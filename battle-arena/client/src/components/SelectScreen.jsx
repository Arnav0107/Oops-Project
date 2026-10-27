import React, { useState } from 'react';

const CLASSES = [
  {
    id: 'Warrior',
    name: 'Warrior',
    icon: '🛡️',
    hp: 130,
    mp: 30,
    atk: 22,
    def: 12,
    special: 'Berserk',
    specialDesc: 'Deals 2x damage (+bonus), but suffers 25% recoil damage.',
    starter: '2x Health Potions, 1x Battle Axe (+6 ATK)'
  },
  {
    id: 'Mage',
    name: 'Mage',
    icon: '🔮',
    hp: 85,
    mp: 100,
    atk: 16,
    def: 6,
    special: 'Fireball',
    specialDesc: 'Unleashes 46-58 massive spell damage. Costs 30 MP.',
    starter: '1x Health Potion, 2x Mana Potions'
  },
  {
    id: 'Archer',
    name: 'Archer',
    icon: '🏹',
    hp: 95,
    mp: 50,
    atk: 20,
    def: 8,
    special: 'Multi-shot',
    specialDesc: 'Fires 3 rapid arrows in sequence. Costs 20 MP. Passive 35% crit chance on basics.',
    starter: '1x Health Potion, 1x Mana Potion, 1x Armor (+5 DEF)'
  },
  {
    id: 'Healer',
    name: 'Healer',
    icon: '🌿',
    hp: 90,
    mp: 80,
    atk: 14,
    def: 8,
    special: 'Soul Drain',
    specialDesc: 'Siphons vitality from the enemy to heal the Healer. Costs 25 MP.',
    starter: '2x Health Potions, 1x Mana Potion'
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

  const me = players[playerIndex];
  const opponent = players[1 - playerIndex];

  const handleConfirm = () => {
    setIsReady(true);
    onSelectCharacter(selectedClass, me?.name);
  };

  return (
    <div className="select-container">
      <div style={{
        background: 'var(--bg-card)',
        padding: '1.2rem',
        borderRadius: '12px',
        border: '1px solid var(--bg-card-border)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ROOM CODE:</span>
          <h2 style={{ color: 'var(--accent-gold)', letterSpacing: '0.15em', fontSize: '1.8rem' }}>
            {roomCode}
          </h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Share this 4-letter code with Player 2 to join over LAN / Wi-Fi
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{
            padding: '0.6rem 1rem',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '8px',
            border: playerIndex === 0 ? '1px solid var(--accent-gold)' : '1px solid transparent'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Player 1 (Host)</div>
            <div style={{ fontWeight: 'bold' }}>{players[0]?.name || 'Waiting...'}</div>
            <div style={{ fontSize: '0.75rem', color: players[0]?.ready ? '#10b981' : '#f59e0b' }}>
              {players[0]?.ready ? `✓ Ready (${players[0]?.class})` : 'Selecting...'}
            </div>
          </div>

          <div style={{
            padding: '0.6rem 1rem',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '8px',
            border: playerIndex === 1 ? '1px solid var(--accent-gold)' : '1px solid transparent'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Player 2</div>
            <div style={{ fontWeight: 'bold' }}>{players[1]?.name || 'Waiting to join...'}</div>
            <div style={{ fontSize: '0.75rem', color: players[1]?.ready ? '#10b981' : '#f59e0b' }}>
              {players[1] ? (players[1]?.ready ? `✓ Ready (${players[1]?.class})` : 'Selecting...') : 'Empty slot'}
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h3 className="heading-font" style={{ fontSize: '1.4rem', marginBottom: '0.3rem' }}>
          Choose Your Combat Archetype
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Each class overrides base C++ <code style={{ color: '#c4b5fd' }}>Character::attack()</code> and <code style={{ color: '#c4b5fd' }}>Character::specialMove()</code> polymorphically.
        </p>
      </div>

      <div className="class-grid">
        {CLASSES.map((cls) => {
          const isSelected = selectedClass === cls.id;
          return (
            <div
              key={cls.id}
              className={`class-card ${isSelected ? 'selected' : ''}`}
              onClick={() => !isReady && setSelectedClass(cls.id)}
            >
              <div className="class-icon">{cls.icon}</div>
              <div className="class-name">{cls.name}</div>

              <div className="class-stats">
                <div className="stat-row">
                  <span>HP:</span>
                  <strong style={{ color: '#10b981' }}>{cls.hp}</strong>
                </div>
                <div className="stat-row">
                  <span>MP:</span>
                  <strong style={{ color: '#3b82f6' }}>{cls.mp}</strong>
                </div>
                <div className="stat-row">
                  <span>Base ATK:</span>
                  <strong>{cls.atk}</strong>
                </div>
                <div className="stat-row">
                  <span>Base DEF:</span>
                  <strong>{cls.def}</strong>
                </div>
              </div>

              <div className="class-special">
                <div style={{ fontWeight: 'bold', color: 'var(--accent-gold)', marginBottom: '0.2rem' }}>
                  ★ {cls.special}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  {cls.specialDesc}
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                🎒 {cls.starter}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        {!players[1] ? (
          <div style={{ color: '#f59e0b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            ⏳ Waiting for Player 2 to join room "{roomCode}" before the match can begin...
          </div>
        ) : null}

        <button
          className="btn btn-primary"
          onClick={handleConfirm}
          disabled={isReady || !players[1]}
          style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem' }}
        >
          {isReady ? '✓ Locked In! Awaiting Opponent...' : `Lock In as ${selectedClass}`}
        </button>
      </div>
    </div>
  );
}
