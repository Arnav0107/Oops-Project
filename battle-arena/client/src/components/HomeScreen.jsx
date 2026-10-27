import React, { useState } from 'react';

export default function HomeScreen({
  onCreateRoom,
  onJoinRoom,
  error,
  serverUrl,
  setServerUrl
}) {
  const [tab, setTab] = useState('create');
  const [playerName, setPlayerName] = useState('Hero');
  const [roomCode, setRoomCode] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    onCreateRoom(playerName.trim());
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!playerName.trim() || !roomCode.trim()) return;
    onJoinRoom(roomCode.trim().toUpperCase(), playerName.trim());
  };

  return (
    <div className="home-wrapper">
      <div className="home-logo">
        <div style={{ fontSize: '3rem', marginBottom: '0.4rem' }}>⚔️</div>
        <h2 className="heading-font">BATTLE ARENA</h2>
        <div className="oop-badge" style={{ display: 'inline-block' }}>
          C++17 OOP Core Engine
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.6rem' }}>
          A 2-Player Turn-Based Combat Showcase
        </p>
      </div>

      <div className="home-tabs">
        <div
          className={`home-tab ${tab === 'create' ? 'active' : ''}`}
          onClick={() => setTab('create')}
        >
          Create Room
        </div>
        <div
          className={`home-tab ${tab === 'join' ? 'active' : ''}`}
          onClick={() => setTab('join')}
        >
          Join Room
        </div>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '8px',
          padding: '0.75rem',
          color: '#fca5a5',
          fontSize: '0.85rem',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          ⚠️ {error}
        </div>
      )}

      {tab === 'create' ? (
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
              Your Fighter Name
            </label>
            <input
              type="text"
              className="input-field"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="e.g. Sir Arthur"
              maxLength={16}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            👑 Create New Room
          </button>
        </form>
      ) : (
        <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
              Your Fighter Name
            </label>
            <input
              type="text"
              className="input-field"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="e.g. Lady Guinevere"
              maxLength={16}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
              Room Code (4 Letters)
            </label>
            <input
              type="text"
              className="input-field"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="e.g. WARR"
              maxLength={4}
              style={{ letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 'bold' }}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            ⚔ Join Room
          </button>
        </form>
      )}

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <button
          type="button"
          onClick={() => setShowConfig(!showConfig)}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
        >
          ⚙️ {showConfig ? 'Hide Server Settings' : 'Configure Server Address (for 2nd Device / Wi-Fi)'}
        </button>

        {showConfig && (
          <div style={{ marginTop: '0.8rem', textAlign: 'left' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Server URL (LAN / Wi-Fi):</label>
            <input
              type="text"
              className="input-field"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              placeholder="http://192.168.x.x:3001"
              style={{ fontSize: '0.85rem', padding: '0.5rem' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
