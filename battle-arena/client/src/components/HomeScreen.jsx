import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, PlusCircle, LogIn } from 'lucide-react';

export default function HomeScreen({
  onCreateRoom,
  onJoinRoom,
  error,
  serverUrl,
  setServerUrl,
  isConnected
}) {
  const [tab, setTab] = useState('create');
  const [playerName, setPlayerName] = useState('Player 1');
  const [roomCode, setRoomCode] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setValidationError('Please enter a player name.');
      return;
    }
    setValidationError('');
    onCreateRoom(playerName.trim());
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setValidationError('Please enter a player name.');
      return;
    }
    if (!roomCode.trim() || roomCode.trim().length !== 4) {
      setValidationError('Room code must be 4 characters.');
      return;
    }
    setValidationError('');
    onJoinRoom(roomCode.trim().toUpperCase(), playerName.trim());
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <div className="home-heading-group">
          <h1 className="home-title">Battle Arena</h1>
          <p className="home-subtitle">Two-player turn-based multiplayer combat.</p>
        </div>

        {/* Create / Join Tabs */}
        <div className="tab-group" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'create'}
            className={`tab-btn ${tab === 'create' ? 'active' : ''}`}
            onClick={() => {
              setTab('create');
              setValidationError('');
            }}
          >
            <PlusCircle size={16} strokeWidth={2} />
            <span>Create room</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'join'}
            className={`tab-btn ${tab === 'join' ? 'active' : ''}`}
            onClick={() => {
              setTab('join');
              setValidationError('');
            }}
          >
            <LogIn size={16} strokeWidth={2} />
            <span>Join room</span>
          </button>
        </div>

        {/* Validation or Server Error */}
        {(validationError || error) && (
          <div className="form-error" role="alert">
            <AlertCircle size={16} strokeWidth={2} />
            <span>{validationError || error}</span>
          </div>
        )}

        {/* Create Form */}
        {tab === 'create' ? (
          <form onSubmit={handleCreate} className="form-stack">
            <div className="form-field">
              <label htmlFor="playerNameCreate" className="field-label">
                Your name
              </label>
              <input
                id="playerNameCreate"
                type="text"
                className="text-input"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter name"
                maxLength={16}
                required
              />
            </div>

            <button type="submit" className="btn-primary full-width" disabled={!isConnected}>
              Create room
            </button>
          </form>
        ) : (
          /* Join Form */
          <form onSubmit={handleJoin} className="form-stack">
            <div className="form-field">
              <label htmlFor="playerNameJoin" className="field-label">
                Your name
              </label>
              <input
                id="playerNameJoin"
                type="text"
                className="text-input"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter name"
                maxLength={16}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="roomCodeJoin" className="field-label">
                4-letter room code
              </label>
              <input
                id="roomCodeJoin"
                type="text"
                className="text-input room-input"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="ABCD"
                maxLength={4}
                required
              />
            </div>

            <button type="submit" className="btn-primary full-width" disabled={!isConnected}>
              Join room
            </button>
          </form>
        )}

        {/* Connection Settings Disclosure */}
        <div className="settings-disclosure">
          <button
            type="button"
            className="disclosure-toggle"
            onClick={() => setShowConfig(!showConfig)}
            aria-expanded={showConfig}
          >
            <span>Connection settings</span>
            {showConfig ? <ChevronUp size={14} strokeWidth={2} /> : <ChevronDown size={14} strokeWidth={2} />}
          </button>

          {showConfig && (
            <div className="disclosure-content">
              <label htmlFor="serverUrlInput" className="field-label-sm">
                Server URL
              </label>
              <input
                id="serverUrlInput"
                type="text"
                className="text-input text-input-sm"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder="http://localhost:3001"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
