import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import HomeScreen from './components/HomeScreen';
import SelectScreen from './components/SelectScreen';
import BattleScreen from './components/BattleScreen';

const DEFAULT_SERVER = import.meta.env.VITE_SERVER_URL || 
  (typeof window !== 'undefined' && window.location.hostname 
    ? `http://${window.location.hostname}:3001` 
    : 'http://localhost:3001');

export default function App() {
  const [serverUrl, setServerUrl] = useState(DEFAULT_SERVER);
  const [screen, setScreen] = useState('home'); // 'home' | 'select' | 'battle'
  const [roomCode, setRoomCode] = useState('');
  const [playerIndex, setPlayerIndex] = useState(0);
  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState(null);
  const [error, setError] = useState('');
  const [gameError, setGameError] = useState('');
  const [savedFileNotice, setSavedFileNotice] = useState('');

  const socketRef = useRef(null);

  // Initialize or re-initialize socket on serverUrl change
  useEffect(() => {
    const socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to relay server:', socket.id);
      setError('');
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError(`Cannot connect to server at ${serverUrl}. Is it running?`);
    });

    socket.on('room_created', (data) => {
      setRoomCode(data.roomCode);
      setPlayerIndex(data.playerIndex);
      setPlayers(data.players);
      setScreen('select');
      setError('');
    });

    socket.on('room_joined', (data) => {
      setRoomCode(data.roomCode);
      setPlayerIndex(data.playerIndex);
      setPlayers(data.players);
      setScreen('select');
      setError('');
    });

    socket.on('join_error', (data) => {
      setError(data.message);
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
      setTimeout(() => setGameError(''), 4000);
    });

    socket.on('match_saved', (data) => {
      setSavedFileNotice(data.file);
      setTimeout(() => setSavedFileNotice(''), 5000);
    });

    socket.on('reset_to_select', (data) => {
      setPlayers(data.players);
      setGameState(null);
      setScreen('select');
    });

    socket.on('opponent_left', (data) => {
      alert(data.message || 'Opponent disconnected.');
      setScreen('home');
      setGameState(null);
      setRoomCode('');
      setPlayers([]);
    });

    return () => {
      socket.disconnect();
    };
  }, [serverUrl]);

  // Actions
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

  return (
    <div className="app-container">
      {/* Top Navigation / Brand */}
      <header className="app-header">
        <div className="app-title">
          <span>⚔️</span>
          <span>BATTLE ARENA</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span className="oop-badge">C++17 OOP Project</span>
          {roomCode && (
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 'bold' }}>
              Room: {roomCode}
            </span>
          )}
        </div>
      </header>

      {/* Main Screens */}
      {screen === 'home' && (
        <HomeScreen
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          error={error}
          serverUrl={serverUrl}
          setServerUrl={setServerUrl}
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
    </div>
  );
}
