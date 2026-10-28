import React, { useState } from 'react';
import { Copy, Check, Loader2, CheckCircle2 } from 'lucide-react';
import ClassAvatar from './ClassAvatar';
import { CHARACTER_CLASSES } from '../data/characters';

export default function SelectScreen({
  roomCode,
  playerIndex,
  players,
  onSelectCharacter
}) {
  const [selectedClass, setSelectedClass] = useState('Warrior');
  const [isReady, setIsReady] = useState(false);
  const [copied, setCopied] = useState(false);

  const me = players[playerIndex];
  const opponent = players[1 - playerIndex];
  const bothPlayersJoined = players.length >= 2;
  const bothReady = bothPlayersJoined && players[0]?.ready && players[1]?.ready;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    setIsReady(true);
    onSelectCharacter(selectedClass, me?.name);
  };

  return (
    <div className="select-container">
      {/* Waiting for Opponent Screen if alone */}
      {!bothPlayersJoined ? (
        <div className="waiting-card">
          <div className="waiting-spinner">
            <Loader2 size={32} strokeWidth={2} className="spin-icon" />
          </div>
          <h2 className="waiting-title">Waiting for opponent</h2>
          <p className="waiting-desc">Share this 4-letter room code with player 2 to start.</p>
          <div className="room-code-hero">
            <span className="room-code-large">{roomCode}</span>
            <button
              type="button"
              className="btn-secondary copy-btn-large"
              onClick={handleCopyCode}
              aria-label="Copy room code"
            >
              {copied ? <Check size={16} strokeWidth={2} /> : <Copy size={16} strokeWidth={2} />}
              <span>{copied ? 'Copied' : 'Copy code'}</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Header Bar: Status of Both Players */}
          <div className="lobby-status-bar">
            <div className={`player-slot ${playerIndex === 0 ? 'is-self' : ''}`}>
              <div className="slot-header">
                <span className="slot-role">Player 1 {playerIndex === 0 ? '(You)' : ''}</span>
                {players[0]?.ready ? (
                  <span className="slot-ready-tag">
                    <CheckCircle2 size={13} strokeWidth={2} /> Ready
                  </span>
                ) : (
                  <span className="slot-waiting-tag">Choosing...</span>
                )}
              </div>
              <div className="slot-name">{players[0]?.name || 'Player 1'}</div>
              <div className="slot-class">{players[0]?.ready ? players[0].class : 'Selecting'}</div>
            </div>

            <div className={`player-slot ${playerIndex === 1 ? 'is-self' : ''}`}>
              <div className="slot-header">
                <span className="slot-role">Player 2 {playerIndex === 1 ? '(You)' : ''}</span>
                {players[1]?.ready ? (
                  <span className="slot-ready-tag">
                    <CheckCircle2 size={13} strokeWidth={2} /> Ready
                  </span>
                ) : (
                  <span className="slot-waiting-tag">Choosing...</span>
                )}
              </div>
              <div className="slot-name">{players[1]?.name || 'Player 2'}</div>
              <div className="slot-class">{players[1]?.ready ? players[1].class : 'Selecting'}</div>
            </div>
          </div>

          <div className="select-intro">
            <h2 className="select-title">Choose your character</h2>
            <p className="select-subtitle">Each character features distinct combat stats, starter items, and a special move.</p>
          </div>

          {/* Character Cards Grid */}
          <div className="character-grid">
            {CHARACTER_CLASSES.map((cls) => {
              const isSelected = selectedClass === cls.id;
              return (
                <div
                  key={cls.id}
                  className={`character-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => !isReady && setSelectedClass(cls.id)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && !isReady) setSelectedClass(cls.id);
                  }}
                >
                  <div className="card-avatar-wrap">
                    <ClassAvatar characterClass={cls.id} size={72} />
                  </div>

                  <h3 className="card-character-name">{cls.name}</h3>
                  <p className="card-character-role">{cls.role}</p>

                  <div className="stat-list">
                    <div className="stat-row">
                      <span className="stat-label">HP</span>
                      <span className="stat-value">{cls.stats.health}</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Mana</span>
                      <span className="stat-value">{cls.stats.mana}</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Attack</span>
                      <span className="stat-value">{cls.stats.attackPower}</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Defense</span>
                      <span className="stat-value">{cls.stats.defense}</span>
                    </div>
                  </div>

                  <div className="card-special-section">
                    <div className="special-header">
                      <span className="special-title">{cls.specialName}</span>
                      <span className="special-cost">{cls.specialCost}</span>
                    </div>
                    <p className="special-desc">{cls.specialDesc}</p>
                  </div>

                  <div className="card-items-section">
                    <span className="items-label">Starter items:</span>
                    <span className="items-text">{cls.starterItems}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Confirm Button & Status */}
          <div className="select-action-bar">
            {isReady && !bothReady ? (
              <div className="waiting-opponent-banner">
                <Loader2 size={16} strokeWidth={2} className="spin-icon" />
                <span>Waiting for opponent to choose</span>
              </div>
            ) : null}

            {bothReady ? (
              <div className="waiting-opponent-banner">
                <Loader2 size={16} strokeWidth={2} className="spin-icon" />
                <span>Starting match...</span>
              </div>
            ) : (
              <button
                type="button"
                className="btn-primary"
                onClick={handleConfirm}
                disabled={isReady}
              >
                {isReady ? 'Ready' : `Select ${selectedClass}`}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
