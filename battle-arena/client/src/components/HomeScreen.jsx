/**
 * HomeScreen.jsx
 * Initial lobby screen for creating or joining matches.
 * Features architectural overview strip, room code copying, input validation,
 * and external LAN/Wi-Fi host configuration for second devices.
 */
import React, { useState } from 'react';
import HowItWorksStrip from './HowItWorksStrip';

export default function HomeScreen({
  onCreateRoom,
  onJoinRoom,
  error,
  serverUrl,
  setServerUrl,
  isConnected,
  onOpenConcepts,
  onOpenGuide
}) {
  const [tab, setTab] = useState('create');
  const [playerName, setPlayerName] = useState('Hero');
  const [roomCode, setRoomCode] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setValidationError('Please enter a fighter name.');
      return;
    }
    setValidationError('');
    onCreateRoom(playerName.trim());
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setValidationError('Please enter a fighter name.');
      return;
    }
    if (!roomCode.trim() || roomCode.trim().length !== 4) {
      setValidationError('Room Code must be exactly 4 letters (e.g. WARR).');
      return;
    }
    setValidationError('');
    onJoinRoom(roomCode.trim().toUpperCase(), playerName.trim());
  };

  return (
    <div className="home-screen-layout">
      <div className="home-wrapper">
        <div className="home-logo">
          <div className="logo-emblem">⚔️</div>
          <h2 className="heading-font">BATTLE ARENA</h2>
          <div className="tech-chip" style={{ margin: '0.4rem auto', display: 'inline-block' }}>
            C++17 OOP ENGINE CORE
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
            Two-Player Turn-Based Combat Showcase
          </p>
        </div>

        {/* Create / Join Tabs */}
        <div className="home-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'create'}
            className={`home-tab ${tab === 'create' ? 'active' : ''}`}
            onClick={() => { setTab('create'); setValidationError(''); }}
          >
            Create Match
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'join'}
            className={`home-tab ${tab === 'join' ? 'active' : ''}`}
            onClick={() => { setTab('join'); setValidationError(''); }}
          >
            Join Match
          </button>
        </div>

        {/* Error / Validation Banners */}
        {(error || validationError) && (
          <div className="alert-box alert-error" role="alert">
            ⚠️ {validationError || error}
          </div>
        )}

        {/* Cloud deployment connection reminder */}
        {!serverUrl && (
          <div className="alert-box" style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fef3c7', fontSize: '0.82rem', marginBottom: '1rem', lineHeight: '1.4' }}>
            🌐 <strong>Render Backend Connection:</strong> Enter your Render service URL below (e.g. <code>https://battle-arena-server.onrender.com</code>) or set <code>VITE_SERVER_URL</code> in Vercel to connect!
          </div>
        )}

        {/* Tab 1: Create Room */}
        {tab === 'create' ? (
          <form onSubmit={handleCreate} className="home-form">
            <div className="form-group">
              <label htmlFor="pNameCreate" className="form-label">
                Host Fighter Name
              </label>
              <input
                id="pNameCreate"
                type="text"
                className="input-field"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="e.g. Sir Arthur"
                maxLength={16}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.4rem' }}>
              👑 Create Room & Select Archetype
            </button>
          </form>
        ) : (
          /* Tab 2: Join Room */
          <form onSubmit={handleJoin} className="home-form">
            <div className="form-group">
              <label htmlFor="pNameJoin" className="form-label">
                Challenger Name
              </label>
              <input
                id="pNameJoin"
                type="text"
                className="input-field"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="e.g. Merlin"
                maxLength={16}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="rCodeJoin" className="form-label">
                4-Letter Room Code
              </label>
              <input
                id="rCodeJoin"
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

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.4rem' }}>
              ⚔ Enter Arena & Join Duel
            </button>
          </form>
        )}

        {/* Secondary Navigation & Settings */}
        <div className="home-footer-links">
          <button
            type="button"
            className="text-link-btn"
            onClick={() => setShowConfig(!showConfig)}
          >
            ⚙️ {showConfig ? 'Hide LAN / Wi-Fi Address Settings' : 'Configure Server Address (for 2nd Device / Wi-Fi)'}
          </button>

          {showConfig && (
            <div className="server-config-box">
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Relay Server URL (Point to Host Laptop's IP if on phone / 2nd device):
              </label>
              <input
                type="text"
                className="input-field"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder="http://192.168.x.x:3001"
                style={{ fontSize: '0.85rem', padding: '0.5rem', marginTop: '0.3rem' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Architecture Strip */}
      <HowItWorksStrip />
    </div>
  );
}
