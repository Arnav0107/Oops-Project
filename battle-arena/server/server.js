const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const readline = require('readline');
const os = require('os');

const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;
const isWindows = process.platform === 'win32';

// Dynamic path resolution for C++ compiled engine executable
function resolveEnginePath() {
  const binaryName = isWindows ? 'battle_engine.exe' : 'battle_engine';
  const candidates = [
    process.env.ENGINE_PATH,
    path.join(__dirname, '..', 'engine', binaryName),
    path.join(__dirname, '..', 'engine', 'battle_engine'),
    path.join(__dirname, binaryName),
    path.join(process.cwd(), 'battle-arena', 'engine', binaryName),
    path.join(process.cwd(), 'engine', binaryName)
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      if (!isWindows) {
        try { fs.chmodSync(candidate, 0o755); } catch (e) {}
      }
      return candidate;
    }
  }

  // If binary doesn't exist yet, attempt automatic compile using build-engine.js
  const buildScriptPath = path.join(__dirname, 'build-engine.js');
  if (fs.existsSync(buildScriptPath)) {
    console.log('[Server Startup] Engine binary not found. Triggering build-engine.js...');
    try {
      const { execSync } = require('child_process');
      execSync(`node "${buildScriptPath}"`, { stdio: 'inherit' });
    } catch (buildErr) {
      console.error('[Server Startup] Automatic build failed:', buildErr.message);
    }
  }

  // Re-check after build attempt
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      if (!isWindows) {
        try { fs.chmodSync(candidate, 0o755); } catch (e) {}
      }
      return candidate;
    }
  }

  return path.join(__dirname, '..', 'engine', binaryName);
}

const ENGINE_PATH = resolveEnginePath();

// Active rooms in memory
// Key: roomCode -> { code, players: [{id, name, class, ready}], engine: ChildProcess, rl: Readline, turn: 0, pendingSocket: null, state: null }
const rooms = new Map();

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const k in interfaces) {
    for (const addr of interfaces[k]) {
      if (addr.family === 'IPv4' && !addr.internal) {
        addresses.push(addr.address);
      }
    }
  }
  return addresses;
}

// Root endpoint for Render / PaaS deployment health checks
app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Battle Arena C++ Relay Server',
    engineFound: fs.existsSync(ENGINE_PATH),
    engineBinary: ENGINE_PATH,
    activeRooms: rooms.size,
    uptime: process.uptime()
  });
});

// REST health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    activeRooms: rooms.size,
    engineBinary: ENGINE_PATH,
    engineFound: fs.existsSync(ENGINE_PATH)
  });
});

io.on('connection', (socket) => {
  console.log(`[Socket] Connected: ${socket.id}`);

  // 1. Create Room
  socket.on('create_room', ({ playerName }) => {
    let roomCode = generateRoomCode();
    while (rooms.has(roomCode)) {
      roomCode = generateRoomCode();
    }

    const room = {
      code: roomCode,
      players: [
        { id: socket.id, name: playerName || 'Player 1', class: null, ready: false, index: 0 }
      ],
      engine: null,
      rl: null,
      turn: 0,
      state: null,
      pendingActionSocketId: null
    };

    rooms.set(roomCode, room);
    socket.join(roomCode);
    socket.roomCode = roomCode;
    socket.playerIndex = 0;

    socket.emit('room_created', {
      roomCode,
      playerIndex: 0,
      players: room.players
    });
    console.log(`[Room ${roomCode}] Created by ${socket.id} (${playerName})`);
  });

  // 2. Join Room
  socket.on('join_room', ({ roomCode, playerName }) => {
    const code = (roomCode || '').trim().toUpperCase();
    const room = rooms.get(code);

    if (!room) {
      return socket.emit('join_error', { message: 'Room not found. Check the 4-letter code!' });
    }

    if (room.players.length >= 2) {
      return socket.emit('join_error', { message: 'Room is already full (2 players max).' });
    }

    const player = {
      id: socket.id,
      name: playerName || 'Player 2',
      class: null,
      ready: false,
      index: 1
    };

    room.players.push(player);
    socket.join(code);
    socket.roomCode = code;
    socket.playerIndex = 1;

    socket.emit('room_joined', {
      roomCode: code,
      playerIndex: 1,
      players: room.players
    });

    // Notify room of update
    io.to(code).emit('players_updated', { players: room.players });
    console.log(`[Room ${code}] Player 2 joined: ${socket.id} (${playerName})`);
  });

  // 3. Select Character & Ready
  socket.on('select_character', ({ characterClass, characterName }) => {
    const code = socket.roomCode;
    const room = rooms.get(code);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    player.class = characterClass;
    if (characterName) player.name = characterName;
    player.ready = true;

    io.to(code).emit('players_updated', { players: room.players });
    console.log(`[Room ${code}] ${player.name} selected ${player.class} (Ready)`);

    // Check if both players are ready
    if (room.players.length === 2 && room.players[0].ready && room.players[1].ready) {
      startMatchForRoom(room);
    }
  });

  // 4. Action Forwarding (Relay only, zero game rules)
  socket.on('action', (actionData) => {
    const code = socket.roomCode;
    const room = rooms.get(code);
    if (!room || !room.engine) {
      return socket.emit('game_error', { error: 'Match is not active.' });
    }

    // Node only checks if it is this socket's turn; game rules are in C++
    if (socket.playerIndex !== room.turn) {
      return socket.emit('game_error', { error: 'Not your turn!' });
    }

    room.pendingActionSocketId = socket.id;

    const payload = {
      cmd: 'action',
      player: socket.playerIndex,
      action: actionData.action,
      itemIndex: actionData.itemIndex !== undefined ? actionData.itemIndex : 0
    };

    try {
      room.engine.stdin.write(JSON.stringify(payload) + '\n');
    } catch (err) {
      console.error(`[Room ${code}] Error writing to C++ engine stdin:`, err);
      socket.emit('game_error', { error: 'Engine communication error.' });
    }
  });

  // 5. Save Match Command
  socket.on('save_match', () => {
    const code = socket.roomCode;
    const room = rooms.get(code);
    if (!room || !room.engine) return;

    room.pendingActionSocketId = socket.id;
    try {
      room.engine.stdin.write(JSON.stringify({ cmd: 'save' }) + '\n');
    } catch (err) {
      socket.emit('game_error', { error: 'Failed to request engine save.' });
    }
  });

  // 6. Play Again / Rematch
  socket.on('play_again', () => {
    const code = socket.roomCode;
    const room = rooms.get(code);
    if (!room) return;

    // Terminate existing engine
    if (room.engine) {
      try {
        room.engine.kill();
      } catch (e) {}
      room.engine = null;
      room.rl = null;
    }

    // Reset player ready states
    room.players.forEach(p => { p.ready = false; });
    room.state = null;
    room.turn = 0;

    io.to(code).emit('reset_to_select', { players: room.players });
  });

  // 7. Disconnect Handler
  socket.on('disconnect', () => {
    console.log(`[Socket] Disconnected: ${socket.id}`);
    const code = socket.roomCode;
    if (!code) return;

    const room = rooms.get(code);
    if (!room) return;

    // Clean up C++ child process
    if (room.engine) {
      try {
        room.engine.kill();
      } catch (e) {}
      room.engine = null;
    }

    io.to(code).emit('opponent_left', { message: 'Opponent disconnected. Match closed.' });
    rooms.delete(code);
    console.log(`[Room ${code}] Destroyed due to player departure.`);
  });
});

/**
 * Spawns the C++ engine executable once per match
 */
function startMatchForRoom(room) {
  console.log(`[Room ${room.code}] Spawning C++ engine: ${ENGINE_PATH}`);

  try {
    const engine = spawn(ENGINE_PATH, [], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    room.engine = engine;

    const rl = readline.createInterface({
      input: engine.stdout,
      terminal: false
    });
    room.rl = rl;

    // Forward engine lines to players
    rl.on('line', (line) => {
      line = line.trim();
      if (!line) return;

      try {
        const response = JSON.parse(line);

        if (response.ok) {
          if (response.state) {
            room.state = response.state;
            room.turn = response.state.turn;
            // Broadcast state to all players in the room
            io.to(room.code).emit('state', response.state);
          }
          if (response.savedToFile) {
            io.to(room.code).emit('match_saved', { file: response.savedToFile });
          }
        } else {
          // Send error exclusively to the socket that initiated the action
          const targetSocketId = room.pendingActionSocketId;
          if (targetSocketId) {
            io.to(targetSocketId).emit('game_error', { error: response.error });
          } else {
            io.to(room.code).emit('game_error', { error: response.error });
          }
        }
      } catch (err) {
        console.error(`[Room ${room.code}] Failed to parse engine stdout:`, line, err);
      }
    });

    engine.stderr.on('data', (data) => {
      console.error(`[Room ${room.code}] Engine stderr:`, data.toString());
    });

    engine.on('exit', (code, signal) => {
      console.log(`[Room ${room.code}] C++ engine process exited with code ${code}, signal ${signal}`);
    });

    engine.on('error', (err) => {
      console.error(`[Room ${room.code}] Failed to launch C++ engine binary:`, err);
      io.to(room.code).emit('game_error', {
        error: `Could not launch C++ engine executable at ${ENGINE_PATH}. Ensure it has been compiled.`
      });
    });

    // Send the "start" command to initialize match with chosen player classes
    const startPayload = {
      cmd: 'start',
      players: [
        { name: room.players[0].name, class: room.players[0].class },
        { name: room.players[1].name, class: room.players[1].class }
      ]
    };

    engine.stdin.write(JSON.stringify(startPayload) + '\n');
    console.log(`[Room ${room.code}] Sent start command to C++ engine.`);

  } catch (err) {
    console.error(`[Room ${room.code}] Exception while launching engine:`, err);
    io.to(room.code).emit('game_error', { error: 'Server failed to start C++ engine process.' });
  }
}

// Bind to 0.0.0.0 so external mobile / laptop devices on same Wi-Fi can join
server.listen(PORT, '0.0.0.0', () => {
  const localIps = getLocalIpAddresses();
  console.log(`============================================================`);
  console.log(`BATTLE ARENA RELAY SERVER RUNNING ON PORT ${PORT}`);
  console.log(`Localhost: http://localhost:${PORT}`);
  localIps.forEach(ip => {
    console.log(`LAN (Wi-Fi) IP: http://${ip}:${PORT}`);
  });
  console.log(`C++ Engine Binary Target: ${ENGINE_PATH}`);
  console.log(`============================================================`);
});
