import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import GameHeader from './components/GameHeader';
import HomeScreen from './components/HomeScreen';
import SelectScreen from './components/SelectScreen';
import BattleScreen from './components/BattleScreen';
import Toast from './components/Toast';
import LandingPage from './landing/LandingPage';

const getInitialServerUrl = () => {
  if (import.meta.env.VITE_SERVER_URL) {
    return import.meta.env.VITE_SERVER_URL;
  }
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('battle_arena_server_url');
    if (saved) return saved;

    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      return `http://${hostname}:3001`;
    }
  }
  return 'https://battle-arena-server-sutp.onrender.com';
};

const getInitialRoute = () => {
  if (typeof window !== 'undefined') {
    return window.location.hash === '#/play' ? '#/play' : '#/';
  }
  return '#/';
};

export default function App() {
  const [route, setRoute] = useState(getInitialRoute);
  const [serverUrl, setServerUrl] = useState(getInitialServerUrl);
  const [isConnected, setIsConnected] = useState(false);
  const [screen, setScreen] = useState('home'); // 'home' | 'select' | 'battle'
  const [roomCode, setRoomCode] = useState('');
  const [playerIndex, setPlayerIndex] = useState(0);
  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState(null);
  const [error, setError] = useState('');
  const [gameError, setGameError] = useState('');
  const [savedFileNotice, setSavedFileNotice] = useState('');
  const [toasts, setToasts] = useState([]);

  const socketRef = useRef(null);

  // Simple hash routing listener
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/play') {
        setRoute('#/play');
      } else {
        setRoute('#/');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToPlay = () => {
    window.location.hash = '#/play';
    setRoute('#/play');
  };

  const navigateToLanding = () => {
    window.location.hash = '#/';
    setRoute('#/');
  };

  const addToast = (type, message, title = '') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Socket connection lifecycle
  useEffect(() => {
    const socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 8
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setError('');
      addToast('success', 'Connected to server.');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      addToast('warning', 'Server disconnected. Reconnecting...');
    });

    socket.on('connect_error', () => {
      setIsConnected(false);
      setError(`Cannot connect to server at ${serverUrl}. Ensure the server is running.`);
    });

    socket.on('room_created', (data) => {
      setRoomCode(data.roomCode);
      setPlayerIndex(data.playerIndex);
      setPlayers(data.players);
      setScreen('select');
      setError('');
      addToast('info', `Room ${data.roomCode} created. Waiting for opponent.`);
    });

    socket.on('room_joined', (data) => {
      setRoomCode(data.roomCode);
      setPlayerIndex(data.playerIndex);
      setPlayers(data.players);
      setScreen('select');
      setError('');
      addToast('info', `Joined room ${data.roomCode}.`);
    });

    socket.on('join_error', (data) => {
      setError(data.message);
      addToast('error', data.message);
    });

    socket.on('players_updated', (data) => {
      setPlayers(data.players);
    });

    socket.on('state', (state) => {
      setGameState(state);
      setGameError('');
      if (screen !== 'battle') {
        setScreen('battle');
      }
    });

    socket.on('game_error', (data) => {
      setGameError(data.error);
      addToast('error', data.error);
      setTimeout(() => setGameError(''), 5000);
    });

    socket.on('match_saved', (data) => {
      setSavedFileNotice(data.file);
      addToast('success', `Match report saved to ${data.file}`);
      setTimeout(() => setSavedFileNotice(''), 6000);
    });

    socket.on('reset_to_select', (data) => {
      setPlayers(data.players);
      setGameState(null);
      setScreen('select');
      addToast('info', 'Rematch started. Choose your character.');
    });

    socket.on('opponent_left', (data) => {
      addToast('warning', data.message || 'Opponent disconnected. Match closed.');
      setScreen('home');
      setGameState(null);
      setRoomCode('');
      setPlayers([]);
    });

    return () => {
      socket.disconnect();
    };
  }, [serverUrl]);

  const handleCreateRoom = (playerName) => {
    socketRef.current?.emit('create_room', { playerName });
  };

  const handleJoinRoom = (code, playerName) => {
    socketRef.current?.emit('join_room', { roomCode: code, playerName });
  };

  const handleSelectCharacter = (characterClass, characterName) => {
    socketRef.current?.emit('select_character', { characterClass, characterName });
  };

  const handleAction = (action, itemIndex = 0) => {
    socketRef.current?.emit('action', { action, itemIndex });
  };

  const handleSaveMatch = () => {
    socketRef.current?.emit('save_match');
  };

  const handlePlayAgain = () => {
    socketRef.current?.emit('play_again');
  };

  const handleServerUrlChange = (newUrl) => {
    setServerUrl(newUrl);
    if (typeof window !== 'undefined') {
      localStorage.setItem('battle_arena_server_url', newUrl);
    }
  };

  if (route === '#/') {
    return <LandingPage onPlayNow={navigateToPlay} />;
  }

  return (
    <div className="game-app-container">
      <Toast toasts={toasts} onDismiss={removeToast} />

      <GameHeader
        isConnected={isConnected}
        roomCode={roomCode}
        onBackToSite={navigateToLanding}
      />

      <main className="game-main-content">
        {screen === 'home' && (
          <HomeScreen
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            error={error}
            serverUrl={serverUrl}
            setServerUrl={handleServerUrlChange}
            isConnected={isConnected}
          />
        )}

        {screen === 'select' && (
          <SelectScreen
            roomCode={roomCode}
            playerIndex={playerIndex}
            players={players}
            onSelectCharacter={handleSelectCharacter}
          />
        )}

        {screen === 'battle' && (
          <BattleScreen
            gameState={gameState}
            playerIndex={playerIndex}
            onAction={handleAction}
            onSaveMatch={handleSaveMatch}
            onPlayAgain={handlePlayAgain}
            gameError={gameError}
            savedFileNotice={savedFileNotice}
          />
        )}
      </main>
    </div>
  );
}
