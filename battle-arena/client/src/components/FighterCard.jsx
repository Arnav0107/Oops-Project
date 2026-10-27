/**
 * FighterCard.jsx
 * Visualizes a combatant in the Arena stage.
 * Demonstrates Encapsulation (protected fields accessed via getters),
 * Templates (Inventory container), and displays animated HP/MP meters with ghost damage trails.
 */
import React, { useState, useEffect, useRef } from 'react';
import ClassAvatar from './ClassAvatar';

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

  // Delayed ghost bar for smooth HP loss visual trail
  const [ghostHpPercent, setGhostHpPercent] = useState(100);
  const prevHpRef = useRef(fighter?.health || 100);

  const hpPercent = fighter ? Math.max(0, Math.min(100, (fighter.health / fighter.maxHealth) * 100)) : 100;
  const mpPercent = fighter && fighter.maxMana > 0 ? Math.max(0, Math.min(100, (fighter.mana / fighter.maxMana) * 100)) : 0;
  const isLowHp = hpPercent <= 30 && !isDead;

  useEffect(() => {
    if (fighter) {
      if (fighter.health < prevHpRef.current) {
        // Delay ghost catch-up
        const timer = setTimeout(() => {
          setGhostHpPercent(hpPercent);
        }, 500);
        return () => clearTimeout(timer);
      } else {
        setGhostHpPercent(hpPercent);
      }
      prevHpRef.current = fighter.health;
    }
  }, [fighter?.health, hpPercent]);

  // Active tooltip state for mobile tap
  const [activeTooltip, setActiveTooltip] = useState(null);

  const toggleTooltip = (key) => {
    setActiveTooltip(activeTooltip === key ? null : key);
  };

  if (!fighter) return null;

  return (
    <div
      className={`fighter-card ${isTurn ? 'active-turn' : ''} ${isDead ? 'fighter-defeated' : ''}`}
      aria-label={`${fighter.name} combat card`}
    >
      {/* Floating combat numbers over avatar */}
      <div className="floater-container" aria-hidden="true">
        {recentFloaters.map((fl) => (
          <div key={fl.id} className={`combat-number float-${fl.type}`}>
            {fl.text}
          </div>
        ))}
      </div>

      {/* Card Header */}
      <div className="fighter-top-row">
        <div>
          <span className="fighter-role-tag">
            {isMe ? '⭐ YOU' : '⚔ OPPONENT'} (P{index + 1})
          </span>
          <h3 className="fighter-name heading-font">{fighter.name}</h3>
          <div className="fighter-cpp-class">
            <code>class {fighter.class} : public Character</code>
          </div>
        </div>

        <div className="class-badge" title="Derived concrete class inheriting from Character">
          {fighter.class}
        </div>
      </div>

      {/* Portrait Stage */}
      <div className="fighter-stage-box">
        <ClassAvatar
          characterClass={fighter.class}
          isAttacking={isAttacking}
          isHit={fighter.health < prevHpRef.current}
          isOpponent={!isMe}
          size={110}
        />
        {isTurn && (
          <div className="active-turn-ring">
            <span>ACTIVE TURN</span>
          </div>
        )}
      </div>

      {/* Encapsulated Stat Bars */}
      <div className="meter-stack">
        {/* HEALTH METER */}
        <div className="stat-meter-box">
          <div className="meter-info-line">
            <span className="stat-label">
              <span className="stat-name">HP</span>
              <code className="cpp-var-label">Character::health</code>
              <button
                type="button"
                className="btn-info-tooltip"
                onClick={() => toggleTooltip('hp')}
                title="Encapsulation: Protected field accessed via getHealth() and clamped via setHealth()"
                aria-label="Explain Health encapsulation"
              >
                ?
              </button>
            </span>
            <span className="stat-values">
              <strong>{fighter.health}</strong> / {fighter.maxHealth}
            </span>
          </div>

          {activeTooltip === 'hp' && (
            <div className="inline-tooltip">
              <strong>Encapsulation:</strong> <code>protected int health</code> is modified only through <code>setHealth(int)</code>, which guarantees bounds checking [0, maxHealth].
            </div>
          )}

          <div className="meter-track health-track">
            {/* Delayed ghost trail */}
            <div
              className="meter-fill-ghost"
              style={{ width: `${ghostHpPercent}%` }}
              aria-hidden="true"
            />
            {/* Primary bar */}
            <div
              className={`meter-fill-main health-fill ${isLowHp ? 'pulsing-low' : ''}`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>

        {/* MANA METER */}
        <div className="stat-meter-box">
          <div className="meter-info-line">
            <span className="stat-label">
              <span className="stat-name">MP</span>
              <code className="cpp-var-label">Character::mana</code>
              <button
                type="button"
                className="btn-info-tooltip"
                onClick={() => toggleTooltip('mp')}
                title="Encapsulation: Protected mana pool consumed by specialMove()"
                aria-label="Explain Mana encapsulation"
              >
                ?
              </button>
            </span>
            <span className="stat-values">
              <strong>{fighter.mana}</strong> / {fighter.maxMana}
            </span>
          </div>

          {activeTooltip === 'mp' && (
            <div className="inline-tooltip">
              <strong>Encapsulation:</strong> <code>protected int mana</code> is decremented by polymorphic spells and replenished by ManaPotions.
            </div>
          )}

          <div className="meter-track mana-track">
            <div
              className="meter-fill-main mana-fill"
              style={{ width: `${mpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Combat Properties Grid */}
      <div className="combat-stats-grid">
        <div className="combat-stat-cell" title="Protected attackPower field">
          <span className="cs-label">ATK</span>
          <span className="cs-val">{fighter.attackPower}</span>
          <code className="cs-cpp">attackPower</code>
        </div>

        <div className="combat-stat-cell" title="Protected defense field (mitigates raw damage)">
          <span className="cs-label">DEF</span>
          <span className="cs-val">{fighter.defense}</span>
          <code className="cs-cpp">defense</code>
        </div>

        <div
          className="combat-stat-cell inventory-cell"
          onClick={isMe ? onOpenInventory : undefined}
          title="Generic Template: Inventory<std::shared_ptr<Item>>"
          style={{ cursor: isMe ? 'pointer' : 'default' }}
        >
          <span className="cs-label">BAG</span>
          <span className="cs-val">
            {fighter.inventory?.length || 0}/6
          </span>
          <code className="cs-cpp">Inventory&lt;T&gt;</code>
        </div>
      </div>
    </div>
  );
}
