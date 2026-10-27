/**
 * Header.jsx
 * Top navigation displaying live connection status to the C++ relay server,
 * room identification, Presentation Mode switch, and quick access to the OOP concepts drawer.
 */
import React from 'react';

export default function Header({
  isConnected = false,
  roomCode = '',
  presentationMode = false,
  onTogglePresentationMode,
  onOpenConcepts,
  onOpenGuide
}) {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="app-title">
          <span className="app-icon">⚔️</span>
          <span>BATTLE ARENA</span>
        </div>

        {/* Live C++ Engine Connection Badge */}
        <div
          className={`engine-status-badge ${isConnected ? 'connected' : 'disconnected'}`}
          title={isConnected ? 'Connected to Node relay (spawns C++ child process)' : 'Disconnected from relay server'}
        >
          <span className={`status-dot ${isConnected ? 'online' : 'offline'}`}></span>
          <span className="badge-text">C++17 OOP ENGINE</span>
          <span className="status-label">{isConnected ? 'ONLINE' : 'DISCONNECTED'}</span>
        </div>
      </div>

      <div className="header-right">
        {roomCode && (
          <div className="room-code-tag">
            <span className="room-label">ROOM:</span>
            <span className="room-val">{roomCode}</span>
          </div>
        )}

        {/* Presentation Mode Toggle */}
        <button
          className={`btn-mode-toggle ${presentationMode ? 'active' : ''}`}
          onClick={onTogglePresentationMode}
          title="Toggle Presentation Mode (enlarges text and highlights C++ code for projectors)"
          aria-pressed={presentationMode}
        >
          <span className="toggle-icon">📽️</span>
          <span className="toggle-label">Presentation Mode</span>
          <span className="toggle-pill">{presentationMode ? 'ON' : 'OFF'}</span>
        </button>

        {/* OOP Concepts Blueprint Drawer Button */}
        <button
          className="btn btn-secondary header-btn"
          onClick={onOpenConcepts}
          title="Open interactive blueprint of all 8 OOP concepts implemented in C++"
        >
          <span>📘</span>
          <span>OOP Concepts</span>
        </button>

        {/* Guide Modal Button */}
        <button
          className="btn btn-secondary header-btn"
          onClick={onOpenGuide}
          title="How to play and Wi-Fi multiplayer guide"
        >
          <span>❓</span>
          <span>Guide</span>
        </button>
      </div>
    </header>
  );
}
