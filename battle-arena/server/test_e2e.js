const { io } = require('socket.io-client');
const { spawn } = require('child_process');
const path = require('path');

console.log('--- STARTING END-TO-END AUTOMATED SOCKET + C++ INTEGRATION TEST ---');

// 1. Start Server Process
const serverProcess = spawn('node', ['server.js'], {
  cwd: __dirname,
  stdio: ['inherit', 'pipe', 'pipe']
});

serverProcess.stdout.on('data', (d) => {
  const msg = d.toString().trim();
  if (msg.includes('BATTLE ARENA RELAY SERVER') || msg.includes('[Room')) {
    console.log('[SERVER LOG]', msg);
  }
});

serverProcess.stderr.on('data', (d) => {
  console.error('[SERVER ERR]', d.toString());
});

const SERVER_URL = 'http://localhost:3001';

// Wait 1.5s for server to bind
setTimeout(() => {
  const p1 = io(SERVER_URL);
  let p2 = null;
  let roomCode = null;

  p1.on('connect', () => {
    console.log('✓ Player 1 connected. Creating room...');
    p1.emit('create_room', { playerName: 'Arthur_P1' });
  });

  p1.on('room_created', (data) => {
    roomCode = data.roomCode;
    console.log(`✓ Room created with code: ${roomCode}`);

    // Now connect Player 2
    p2 = io(SERVER_URL);
    p2.on('connect', () => {
      console.log('✓ Player 2 connected. Joining room...');
      p2.emit('join_room', { roomCode, playerName: 'Merlin_P2' });
    });

    p2.on('room_joined', () => {
      console.log('✓ Player 2 successfully joined!');
      // Both select characters
      console.log('-> Player 1 selecting Warrior...');
      p1.emit('select_character', { characterClass: 'Warrior', characterName: 'Arthur' });

      console.log('-> Player 2 selecting Mage...');
      p2.emit('select_character', { characterClass: 'Mage', characterName: 'Merlin' });
    });

    let stateCount = 0;

    p1.on('state', (state) => {
      stateCount++;
      console.log(`\n[GAME STATE #${stateCount}] Turn: Player ${state.turn}, Round: ${state.round}, Event: "${state.event || 'None'}"`);
      console.log(`- P1 (${state.players[0].name}): HP ${state.players[0].health}/${state.players[0].maxHealth}, MP ${state.players[0].mana}`);
      console.log(`- P2 (${state.players[1].name}): HP ${state.players[1].health}/${state.players[1].maxHealth}, MP ${state.players[1].mana}`);

      if (stateCount === 1) {
        // Initial state arrived from C++ engine! Test Player 1 Attack
        console.log('\n-> Action 1: Player 1 attacks Player 2...');
        p1.emit('action', { action: 'attack' });
      } else if (stateCount === 2) {
        // Attack landed! Test Player 2 Special (Fireball)
        console.log('\n-> Action 2: Player 2 casts Special (Fireball)...');
        p2.emit('action', { action: 'special' });
      } else if (stateCount === 3) {
        // Round 2 reached, random event triggered! Test combine potions (Operator+ demo)
        console.log('\n-> Action 3: Player 1 combines Health Potions (C++ operator+ demo)...');
        p1.emit('action', { action: 'combine' });
      } else if (stateCount === 4) {
        // Test save match
        console.log('\n-> Action 4: Player 1 requests save_match...');
        p1.emit('save_match');
      }
    });

    p1.on('match_saved', (data) => {
      console.log(`\n✓ SUCCESS: Match chronicle successfully saved to ${data.file}!`);
      console.log('=== ALL INTEGRATION VERIFICATIONS PASSED CLEANLY! ===\n');

      p1.disconnect();
      if (p2) p2.disconnect();
      serverProcess.kill();
      process.exit(0);
    });

    p1.on('game_error', (err) => {
      console.error('Player 1 Game Error:', err);
    });

    p2.on('game_error', (err) => {
      console.error('Player 2 Game Error:', err);
    });
  });

  setTimeout(() => {
    console.error('TIMEOUT: End-to-end test exceeded 15 seconds.');
    serverProcess.kill();
    process.exit(1);
  }, 15000);

}, 1500);
