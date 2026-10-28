import React from 'react';
import ClassAvatar from './ClassAvatar';
import { Backpack } from 'lucide-react';

export default function FighterCard({
  fighter,
  index,
  playerIndex,
  isTurn,
  isAttacking,
  recentFloaters = [],
  onOpenInventory
}) {
  const isMe = index === playerIndex;
  const isDead = fighter && fighter.health <= 0;

  if (!fighter) return null;

  const hpPercent = Math.max(0, Math.min(100, (fighter.health / fighter.maxHealth) * 100));
  const mpPercent = fighter.maxMana > 0 ? Math.max(0, Math.min(100, (fighter.mana / fighter.maxMana) * 100)) : 0;
  const isLowHp = hpPercent <= 25 && !isDead;

  return (
    <div
      className={`fighter-card ${isTurn ? 'is-active-turn' : ''} ${isDead ? 'is-defeated' : ''}`}
      aria-label={`${fighter.name} card`}
    >
      {/* Floating combat numbers */}
      <div className="floater-container" aria-hidden="true">
        {recentFloaters.map((fl) => (
          <div key={fl.id} className={`combat-floater float-${fl.type}`}>
            {fl.text}
          </div>
        ))}
      </div>

      {/* Fighter Card Header */}
      <div className="fighter-header">
        <div className="fighter-meta">
          <span className="fighter-badge">{isMe ? 'You' : 'Opponent'}</span>
          <h3 className="fighter-name">{fighter.name}</h3>
        </div>
        <span className="fighter-class-tag">{fighter.class}</span>
      </div>

      {/* Avatar Box */}
      <div className="fighter-avatar-wrap">
        <ClassAvatar
          characterClass={fighter.class}
          isAttacking={isAttacking}
          isHit={fighter.health < fighter.maxHealth && isTurn === false}
          isOpponent={!isMe}
          size={88}
        />
        {isTurn && <div className="turn-tag">Active turn</div>}
      </div>

      {/* Health & Mana Meters */}
      <div className="meter-stack">
        {/* Health */}
        <div className="meter-block">
          <div className="meter-label-row">
            <span className="meter-name">HP</span>
            <span className="meter-nums">
              {fighter.health} / {fighter.maxHealth}
            </span>
          </div>
          <div className="meter-track">
            <div
              className={`meter-bar hp-bar ${isLowHp ? 'hp-danger' : ''}`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>

        {/* Mana */}
        <div className="meter-block">
          <div className="meter-label-row">
            <span className="meter-name">Mana</span>
            <span className="meter-nums">
              {fighter.mana} / {fighter.maxMana}
            </span>
          </div>
          <div className="meter-track">
            <div
              className="meter-bar mana-bar"
              style={{ width: `${mpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats and Bag */}
      <div className="fighter-stats-row">
        <div className="stat-pill">
          <span className="pill-name">Attack</span>
          <span className="pill-val">{fighter.attackPower}</span>
        </div>
        <div className="stat-pill">
          <span className="pill-name">Defense</span>
          <span className="pill-val">{fighter.defense}</span>
        </div>
        <button
          type="button"
          className="stat-pill stat-bag-btn"
          onClick={isMe ? onOpenInventory : undefined}
          disabled={!isMe}
          title={isMe ? 'Open inventory' : undefined}
          aria-label={isMe ? 'Open inventory' : 'Opponent items'}
        >
          <Backpack size={13} strokeWidth={2} />
          <span className="pill-name">Bag</span>
          <span className="pill-val">{fighter.inventory?.length || 0}/6</span>
        </button>
      </div>
    </div>
  );
}
