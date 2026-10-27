import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './components/HomeScreen';
import SelectScreen from './components/SelectScreen';
import BattleScreen from './components/BattleScreen';
import ConceptsDrawer from './components/ConceptsDrawer';
import HowToPlayModal from './components/HowToPlayModal';
import Toast from './components/Toast';

const DEFAULT_SERVER = import.meta.env.VITE_SERVER_URL || 
  (typeof window !== 'undefined' && window.location.hostname 
    ? `http://${window.location.hostname}:3001` 
    : 'http://localhost:3001');

export default function App() {
  const [serverUrl, setServerUrl] = useState(DEFAULT_SERVER);
  const [isConnected, setIsConnected] = useState(false);
  const [screen, setScreen] = useState('home'); // 'home' | 'select' | 'battle'
  const [roomCode, setRoomCode] = useState('');
  const [playerIndex, setPlayerIndex] = useState(0);
  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState(null);
  const [error, setError] = useState('');
  const [gameError, setGameError] = useState('');
  const [savedFileNotice, setSavedFileNotice] = useState('');

  // Presentation & Modal States
  const [presentationMode, setPresentationMode] = useState(false);
  const [isConceptsOpen, setIsConceptsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const socketRef = useRef(null);

  const addToast = (type, message, title = '') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initialize or re-initialize socket on serverUrl change
  useEffect(() => {
    const socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 8
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to relay server:', socket.id);
      setIsConnected(true);
      setError('');
      addToast('success', 'Connected to C++ relay server on port 3001', 'Engine Online');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      addToast('warning', 'Relay server disconnected. Reconnecting...', 'Connection Dropped');
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setIsConnected(false);
      setError(`Cannot connect to relay server at ${serverUrl}. Ensure 'node server.js' is running.`);
    });

    // 1. Room Created
    socket.on('room_created', (data) => {
      setRoomCode(data.roomCode);
      setPlayerIndex(data.playerIndex);
      setPlayers(data.players);
      setScreen('select');
      setError('');
      addToast('info', `Room ${data.roomCode} created. Waiting for Player 2 to join.`, 'Room Created');
    });

    // 2. Room Joined
    socket.on('room_joined', (data) => {
      setRoomCode(data.roomCode);
      setPlayerIndex(data.playerIndex);
      setPlayers(data.players);
      setScreen('select');
      setError('');
      addToast('info', `Joined Room ${data.roomCode} as Player 2.`, 'Room Joined');
    });

    // 3. Join Error
    socket.on('join_error', (data) => {
      setError(data.message);
      addToast('error', data.message, 'Join Failed');
    });

    // 4. Players Updated
    socket.on('players_updated', (data) => {
      setPlayers(data.players);
    });

    // 5. Game State Received from C++ Engine
    socket.on('state', (state) => {
      setGameState(state);
      setGameError('');
      if (screen !== 'battle') {
        setScreen('battle');
      }
    });

    // 6. Game Exception from C++ Engine
    socket.on('game_error', (data) => {
      setGameError(data.error);
      addToast('error', data.error, 'C++ GameException');
      setTimeout(() => setGameError(''), 5000);
    });

    // 7. Match Saved via C++ File I/O
    socket.on('match_saved', (data) => {
      setSavedFileNotice(data.file);
      addToast('success', `Match report archived to ${data.file} via std::ofstream`, 'Arena::saveMatch');
      setTimeout(() => setSavedFileNotice(''), 6000);
    });

    // 8. Rematch / Reset to Character Select
    socket.on('reset_to_select', (data) => {
      setPlayers(data.players);
      setGameState(null);
      setScreen('select');
      addToast('info', 'Resetting match. Choose your archetype for the rematch!', 'Rematch Ready');
    });

    // 9. Opponent Left
    socket.on('opponent_left', (data) => {
      addToast('warning', data.message || 'Opponent disconnected. Match closed.', 'Opponent Departed');
      setScreen('home');
      setGameState(null);
      setRoomCode('');
      setPlayers([]);
    });

    return () => {
      socket.disconnect();
    };
  }, [serverUrl]);

  // Actions emitted to relay server
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
    <div className={`app-container ${presentationMode ? 'presentation-mode' : ''}`}>
      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Global Header */}
      <Header
        isConnected={isConnected}
        roomCode={roomCode}
        presentationMode={presentationMode}
        onTogglePresentationMode={() => setPresentationMode(!presentationMode)}
        onOpenConcepts={() => setIsConceptsOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Screen Router */}
      <main className="app-main-content">
        {screen === 'home' && (
          <HomeScreen
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            error={error}
            serverUrl={serverUrl}
            setServerUrl={setServerUrl}
            onOpenConcepts={() => setIsConceptsOpen(true)}
            onOpenGuide={() => setIsGuideOpen(true)}
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
            presentationMode={presentationMode}
            onOpenConcepts={() => setIsConceptsOpen(true)}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer onOpenConcepts={() => setIsConceptsOpen(true)} />

      {/* OOP Concepts Interactive Drawer */}
      <ConceptsDrawer
        isOpen={isConceptsOpen}
        onClose={() => setIsConceptsOpen(false)}
        demonstratedConcepts={[
          'inheritance',
          'abstraction',
          'static_members',
          'polymorphism',
          'encapsulation',
          'templates',
          ...(gameError ? ['exceptions'] : []),
          ...(savedFileNotice ? ['file_io'] : [])
        ]}
      />

      {/* How To Play & Guide Modal */}
      <HowToPlayModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
