import React, { useState, useEffect, useRef } from 'react';
import ItemModal from './ItemModal';

export default function BattleScreen({
  gameState,
  playerIndex,
  onAction,
  onSaveMatch,
  onPlayAgain,
  gameError,
  savedFileNotice
}) {
  const [showItemModal, setShowItemModal] = useState(false);
  const [hitShakeIndex, setHitShakeIndex] = useState(null);
  const prevHealths = useRef([null, null]);
  const logEndRef = useRef(null);

  const players = gameState?.players || [];
  const currentTurn = gameState?.turn;
  const isMyTurn = currentTurn === playerIndex;
  const winner = gameState?.winner;
  const round = gameState?.round || 1;
  const event = gameState?.event;
  const log = gameState?.log || [];

  const me = players[playerIndex];
  const opponent = players[1 - playerIndex];

  // Auto scroll log to bottom
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  // Trigger shake animation when a player loses HP
  useEffect(() => {
    players.forEach((p, idx) => {
      if (prevHealths.current[idx] !== null && p.health < prevHealths.current[idx]) {
        setHitShakeIndex(idx);
        setTimeout(() => setHitShakeIndex(null), 500);
      }
      prevHealths.current[idx] = p.health;
    });
  }, [players]);

  const handleAction = (action, itemIndex = 0) => {
    if (!isMyTurn) return;
    onAction(action, itemIndex);
  };

  const handleUseItem = (index) => {
    setShowItemModal(false);
    handleAction('item', index);
  };

  const handleCombinePotions = () => {
    setShowItemModal(false);
    handleAction('combine');
  };

  const renderFighterCard = (fighter, index) => {
    if (!fighter) return null;
    const isThisMe = index === playerIndex;
    const isTurn = currentTurn === index && winner === null;
    const isShaking = hitShakeIndex === index;
    const hpPercent = Math.max(0, Math.min(100, (fighter.health / fighter.maxHealth) * 100));
    const mpPercent = fighter.maxMana > 0 ? Math.max(0, Math.min(100, (fighter.mana / fighter.maxMana) * 100)) : 0;
    const isHpLow = hpPercent < 30;

    return (
      <div
        key={index}
        className={`fighter-card ${isTurn ? 'active-turn' : ''} ${isShaking ? 'hit-shake' : ''}`}
      >
        <div className="fighter-header">
          <div>
            <span className="fighter-role">
              {isThisMe ? '⭐ YOU' : '⚔ OPPONENT'} (P{index + 1})
            </span>
            <div className="fighter-name">{fighter.name}</div>
          </div>
          <div className="oop-badge">
            {fighter.class}
          </div>
        </div>

        {/* Health & Mana Meters */}
        <div className="meter-container">
          <div className="meter-wrapper">
            <div className="meter-label">
              <span>HEALTH (HP)</span>
              <span>{fighter.health} / {fighter.maxHealth}</span>
            </div>
            <div className="meter-bar">
              <div
                className={`meter-fill health ${isHpLow ? 'low' : ''}`}
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>

          <div className="meter-wrapper">
            <div className="meter-label">
              <span>MANA (MP)</span>
              <span>{fighter.mana} / {fighter.maxMana}</span>
            </div>
            <div className="meter-bar">
              <div
                className="meter-fill mana"
                style={{ width: `${mpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Combat Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.4rem',
          background: 'rgba(0,0,0,0.25)',
          padding: '0.6rem',
          borderRadius: '8px',
          fontSize: '0.75rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>ATK</div>
            <strong style={{ fontSize: '0.9rem' }}>{fighter.attackPower}</strong>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>DEF</div>
            <strong style={{ fontSize: '0.9rem' }}>{fighter.defense}</strong>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>ITEMS</div>
            <strong style={{ fontSize: '0.9rem' }}>{fighter.inventory?.length || 0}</strong>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', flex: 1 }}>
      {/* Top Bar with Round and Status */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--bg-card)',
        padding: '0.8rem 1.2rem',
        borderRadius: '10px',
        border: '1px solid var(--bg-card-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontWeight: '800', color: 'var(--accent-gold)' }}>
            ROUND {round}
          </div>
          <div style={{
            fontSize: '0.85rem',
            padding: '0.3rem 0.8rem',
            borderRadius: '999px',
            background: isMyTurn ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)',
            color: isMyTurn ? '#6ee7b7' : '#9ca3af',
            fontWeight: '600'
          }}>
            {isMyTurn ? '🔥 YOUR TURN TO ACT!' : '⏳ Opponent is deciding...'}
          </div>
        </div>

        <button
          className="btn btn-secondary"
          onClick={onSaveMatch}
          style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
          title="Save match report to disk via C++ File I/O"
        >
          💾 Save Match (C++ File I/O)
        </button>
      </div>

      {/* Error banner if action rejected by C++ engine */}
      {gameError && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          color: '#fca5a5',
          fontSize: '0.9rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          ⚠️ C++ Engine Exception: {gameError}
        </div>
      )}

      {/* Saved match notification */}
      {savedFileNotice && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid #10b981',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          color: '#a7f3d0',
          fontSize: '0.85rem'
        }}>
          ✓ Match chronicle successfully archived to <code style={{ color: '#fff' }}>{savedFileNotice}</code> on server host!
        </div>
      )}

      {/* Arena Random Event Banner */}
      {event && (
        <div className="event-banner">
          <span style={{ fontSize: '1.4rem' }}>⚡</span>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>
              Arena Environment Event
            </div>
            <div>{event}</div>
          </div>
        </div>
      )}

      {/* Main Battle Grid */}
      <div className="battle-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Fighter Cards */}
          <div className="fighters-grid">
            {renderFighterCard(me, playerIndex)}
            {renderFighterCard(opponent, 1 - playerIndex)}
          </div>

          {/* Action Buttons Panel */}
          <div className="actions-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Combat Command Console
              </span>
              <span style={{ fontSize: '0.75rem', color: isMyTurn ? '#10b981' : '#ef4444' }}>
                {isMyTurn ? 'Input Enabled' : 'Input Locked (Waiting for Turn)'}
              </span>
            </div>

            <div className="actions-grid">
              <button
                className="btn action-btn attack"
                onClick={() => handleAction('attack')}
                disabled={!isMyTurn || winner !== null}
              >
                <span className="btn-icon">⚔️</span>
                <span>Normal Attack</span>
              </button>

              <button
                className="btn action-btn special"
                onClick={() => handleAction('special')}
                disabled={!isMyTurn || winner !== null}
              >
                <span className="btn-icon">💥</span>
                <span>Special Move</span>
              </button>

              <button
                className="btn action-btn item"
                onClick={() => setShowItemModal(true)}
                disabled={!isMyTurn || winner !== null}
              >
                <span className="btn-icon">🧪</span>
                <span>Use Item ({me?.inventory?.length || 0})</span>
              </button>

              <button
                className="btn action-btn skip"
                onClick={() => handleAction('skip')}
                disabled={!isMyTurn || winner !== null}
              >
                <span className="btn-icon">🛡️</span>
                <span>Skip Turn</span>
              </button>
            </div>
          </div>
        </div>

        {/* Battle Chronicle / Log */}
        <div className="battle-log-card">
          <h3 className="heading-font" style={{ fontSize: '1rem', marginBottom: '0.8rem', color: 'var(--accent-gold)' }}>
            📜 Combat Chronicle
          </h3>
          <div className="log-content">
            {log.map((entry, idx) => {
              const isSpecial = entry.includes('[SPECIAL]');
              const isEvent = entry.includes('⚡') || entry.includes('🌟') || entry.includes('🎁') || entry.includes('🩸');
              return (
                <div
                  key={idx}
                  className={`log-entry ${isSpecial ? 'special' : ''} ${isEvent ? 'event' : ''}`}
                >
                  {entry}
                </div>
              );
            })}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>

      {/* Item Modal */}
      {showItemModal && me && (
        <ItemModal
          inventory={me.inventory || []}
          onUseItem={handleUseItem}
          onCombinePotions={handleCombinePotions}
          onClose={() => setShowItemModal(false)}
        />
      )}

      {/* Game Over / Winner Modal */}
      {winner !== null && (
        <div className="winner-modal">
          <div className="winner-card">
            <div className="winner-trophy">
              {winner === -2 ? '🤝' : (winner === playerIndex ? '👑' : '💀')}
            </div>

            <h2 className="heading-font" style={{ fontSize: '1.8rem', color: 'var(--accent-gold)' }}>
              {winner === -2
                ? 'MUTUAL DEFEAT'
                : (winner === playerIndex ? 'VICTORY ACHIEVED!' : 'DEFEAT')}
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {winner === -2
                ? 'Both warriors fell in the heat of battle! The duel ends in a tie.'
                : (winner === playerIndex
                    ? `Congratulations! ${me?.name} has triumphed in the arena!`
                    : `${opponent?.name} emerged as the arena champion.`)}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '0.5rem' }}>
              <button
                className="btn btn-primary"
                onClick={onPlayAgain}
                style={{ padding: '0.8rem' }}
              >
                🔄 Play Again (Rematch)
              </button>
              <button
                className="btn btn-secondary"
                onClick={onSaveMatch}
                style={{ padding: '0.7rem' }}
              >
                💾 Export Match Log to File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
