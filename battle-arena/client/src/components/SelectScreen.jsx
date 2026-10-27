/**
 * SelectScreen.jsx
 * Character archetype selection stage.
 * Visually emphasizes Inheritance (subclasses inheriting from Character),
 * Polymorphism (pure virtual overrides), Encapsulation (protected fields),
 * and Templates (Inventory<shared_ptr<Item>>).
 */
import React, { useState } from 'react';
import ClassAvatar from './ClassAvatar';

const CLASS_DEFINITIONS = [
  {
    id: 'Warrior',
    name: 'Warrior',
    cppClassLine: 'class Warrior : public Character',
    polymorphismTag: 'overrides attack() & specialMove() | Polymorphism',
    stats: {
      health: 130,
      mana: 30,
      attackPower: 22,
      defense: 12
    },
    specialName: 'Berserk',
    specialCost: '0 MP (25% recoil)',
    specialDesc: 'Deals 2x damage (+bonus), but suffers 25% recoil damage.',
    starterItems: '2x Health Potion, 1x Battle Axe (+6 ATK)'
  },
  {
    id: 'Mage',
    name: 'Mage',
    cppClassLine: 'class Mage : public Character',
    polymorphismTag: 'overrides attack() & specialMove() | Polymorphism',
    stats: {
      health: 85,
      mana: 100,
      attackPower: 16,
      defense: 6
    },
    specialName: 'Fireball',
    specialCost: '30 MP',
    specialDesc: 'Summons devastating flame dealing 46–58 spell damage. Throws GameException if mana < 30.',
    starterItems: '1x Health Potion, 2x Mana Potion'
  },
  {
    id: 'Archer',
    name: 'Archer',
    cppClassLine: 'class Archer : public Character',
    polymorphismTag: 'overrides attack() & specialMove() | Polymorphism',
    stats: {
      health: 95,
      mana: 50,
      attackPower: 20,
      defense: 8
    },
    specialName: 'Multi-shot',
    specialCost: '20 MP',
    specialDesc: 'Fires 3 rapid arrows in sequence. Passive 35% critical strike chance on basic shots.',
    starterItems: '1x Health Potion, 1x Mana Potion, 1x Armor (+5 DEF)'
  },
  {
    id: 'Healer',
    name: 'Healer',
    cppClassLine: 'class Healer : public Character',
    polymorphismTag: 'overrides attack() & specialMove() | Polymorphism',
    stats: {
      health: 90,
      mana: 80,
      attackPower: 14,
      defense: 8
    },
    specialName: 'Soul Drain',
    specialCost: '25 MP',
    specialDesc: 'Drains enemy vitality to heal self for the exact damage dealt.',
    starterItems: '2x Health Potion, 1x Mana Potion'
  }
];

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
    setTimeout(() => setCopied(false), 2500);
  };

  const handleConfirm = () => {
    setIsReady(true);
    onSelectCharacter(selectedClass, me?.name);
  };

  return (
    <div className="select-container">
      {/* Ready Splash Overlay when match is starting */}
      {bothReady && (
        <div className="fight-splash-overlay" aria-live="assertive">
          <div className="fight-splash-content">
            <span className="fight-splash-icon">⚔️</span>
            <h1 className="fight-splash-text heading-font">FIGHT!</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              Spawning C++ <code>battle_engine.exe</code> process...
            </p>
          </div>
        </div>
      )}

      {/* Room Information & Players Live Status */}
      <div className="select-header-box">
        <div className="room-meta-group">
          <span className="room-label">MATCH ROOM CODE:</span>
          <div className="room-code-display">
            <h2 className="room-code-text heading-font">{roomCode}</h2>
            <button
              className="btn btn-secondary btn-copy"
              onClick={handleCopyCode}
              title="Copy room code to clipboard"
            >
              {copied ? '✓ Copied!' : '📋 Copy Code'}
            </button>
          </div>
          <span className="room-helper-text">
            Give this 4-letter code to Player 2 to join over LAN or Wi-Fi.
          </span>
        </div>

        {/* Live Status Cards for Both Combatants */}
        <div className="players-lobby-bar">
          <div className={`player-lobby-pill ${playerIndex === 0 ? 'is-self' : ''}`}>
            <div className="pill-top">
              <span className="pill-role">Player 1 (Host)</span>
              {players[0]?.ready && <span className="ready-tag">✓ READY</span>}
            </div>
            <strong className="pill-name">{players[0]?.name || 'Waiting...'}</strong>
            <div className="pill-class-status">
              {players[0]?.ready ? (
                <code>class {players[0].class}</code>
              ) : (
                <span className="selecting-text">Choosing archetype...</span>
              )}
            </div>
          </div>

          <div className={`player-lobby-pill ${playerIndex === 1 ? 'is-self' : ''}`}>
            <div className="pill-top">
              <span className="pill-role">Player 2</span>
              {players[1]?.ready && <span className="ready-tag">✓ READY</span>}
            </div>
            <strong className="pill-name">{players[1]?.name || 'Waiting to join...'}</strong>
            <div className="pill-class-status">
              {players[1] ? (
                players[1].ready ? (
                  <code>class {players[1].class}</code>
                ) : (
                  <span className="selecting-text">Choosing archetype...</span>
                )
              ) : (
                <span className="waiting-pulse">⏳ Waiting for Player 2...</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <h3 className="heading-font" style={{ fontSize: '1.4rem', color: 'var(--accent-gold)' }}>
          Select Concrete Character Class
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Concrete classes inherit from abstract base <code style={{ color: '#c4b5fd' }}>Character</code> and override pure virtual methods <code style={{ color: '#c4b5fd' }}>attack()</code> & <code style={{ color: '#c4b5fd' }}>specialMove()</code>.
        </p>
      </div>

      {/* Class Archetype Cards Grid */}
      <div className="class-grid">
        {CLASS_DEFINITIONS.map((cls) => {
          const isSelected = selectedClass === cls.id;
          return (
            <div
              key={cls.id}
              className={`class-card ${isSelected ? 'selected' : ''}`}
              onClick={() => !isReady && setSelectedClass(cls.id)}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !isReady) setSelectedClass(cls.id);
              }}
            >
              {/* Avatar Illustration */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.3rem' }}>
                <ClassAvatar characterClass={cls.id} size={70} />
              </div>

              {/* C++ Class Signature */}
              <div className="class-cpp-signature">
                <code>{cls.cppClassLine}</code>
              </div>

              <div className="class-name heading-font">{cls.name}</div>

              <div className="polymorphism-chip">
                {cls.polymorphismTag}
              </div>

              {/* Protected Fields (Encapsulation) */}
              <div className="class-encapsulated-stats">
                <div className="stats-sub-header">
                  <span>protected members:</span>
                  <span className="encap-badge">Encapsulation</span>
                </div>

                <div className="stat-data-row">
                  <span>health:</span>
                  <strong style={{ color: '#10b981' }}>{cls.stats.health}</strong>
                </div>
                <div className="stat-data-row">
                  <span>mana:</span>
                  <strong style={{ color: '#38bdf8' }}>{cls.stats.mana}</strong>
                </div>
                <div className="stat-data-row">
                  <span>attackPower:</span>
                  <strong>{cls.stats.attackPower}</strong>
                </div>
                <div className="stat-data-row">
                  <span>defense:</span>
                  <strong>{cls.stats.defense}</strong>
                </div>
              </div>

              {/* Special Move info */}
              <div className="class-special-box">
                <div className="special-title-row">
                  <span className="special-icon">★</span>
                  <strong>{cls.specialName}</strong>
                  <span className="special-cost-tag">{cls.specialCost}</span>
                </div>
                <div className="special-desc-text">{cls.specialDesc}</div>
              </div>

              {/* Generic Inventory (Template) */}
              <div className="template-inventory-tag">
                <span className="ti-label">Inventory&lt;shared_ptr&lt;Item&gt;&gt;</span>
                <span className="ti-items">🎒 {cls.starterItems}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lock In Actions */}
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        {!bothPlayersJoined ? (
          <div className="waiting-notice-banner">
            <span className="pulse-dot"></span>
            <span>Awaiting Player 2 to join room "{roomCode}" before lock-in is allowed...</span>
          </div>
        ) : (
          isReady && !bothReady && (
            <div className="waiting-notice-banner">
              <span className="pulse-dot"></span>
              <span>Locked in! Waiting for opponent to confirm their archetype...</span>
            </div>
          )
        )}

        <button
          className="btn btn-primary"
          onClick={handleConfirm}
          disabled={isReady || !bothPlayersJoined}
          style={{ padding: '0.9rem 2.8rem', fontSize: '1.05rem' }}
        >
          {isReady ? '✓ Locked In! Awaiting Opponent...' : `Lock In as ${selectedClass}`}
        </button>
      </div>
    </div>
  );
}
