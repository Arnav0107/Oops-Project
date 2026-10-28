import React, { useState } from 'react';
import { Copy, Check, Swords } from 'lucide-react';

export default function GameHeader({
  isConnected = false,
  roomCode = '',
  onBackToSite
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!roomCode) return;
    navigator.clipboard?.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="game-header">
      <div className="game-header-left">
        <a href="#/" onClick={onBackToSite} className="game-brand">
          <Swords size={20} strokeWidth={2} className="game-brand-icon" />
          <span>Battle Arena</span>
        </a>
        <a href="#/" onClick={onBackToSite} className="nav-back-link">
          Back to site
        </a>
      </div>

      <div className="game-header-right">
        {roomCode && (
          <div className="room-code-badge">
            <span className="room-code-label">Room:</span>
            <span className="room-code-value">{roomCode}</span>
            <button
              type="button"
              className="room-copy-btn"
              onClick={handleCopy}
              aria-label="Copy room code"
              title="Copy room code"
            >
              {copied ? <Check size={14} strokeWidth={2} /> : <Copy size={14} strokeWidth={2} />}
            </button>
          </div>
        )}

        <div className="connection-status">
          <span className={`connection-dot ${isConnected ? 'online' : 'offline'}`} />
          <span className="connection-text">
            {isConnected ? 'Connected' : 'Reconnecting'}
          </span>
        </div>
      </div>
    </header>
  );
}
