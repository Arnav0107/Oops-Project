/**
 * ActionBar.jsx
 * Player command console for executing combat actions.
 * Explicitly associates each button with its pure virtual method contract in C++ (attack(), specialMove()),
 * displays resource constraints, and clearly articulates disabled reasons.
 */
import React from 'react';

const SPECIAL_MOVE_INFO = {
  Warrior: { name: 'Berserk', cost: 0, desc: 'Double damage, 25% recoil' },
  Mage: { name: 'Fireball', cost: 30, desc: 'Massive burst spell' },
  Archer: { name: 'Multi-shot', cost: 20, desc: '3 rapid arrow strikes' },
  Healer: { name: 'Soul Drain', cost: 25, desc: 'Siphons HP from enemy' }
};

export default function ActionBar({
  isMyTurn = false,
  isGameOver = false,
  currentFighter = null,
  onAction,
  onOpenInventory
}) {
  const charClass = currentFighter?.class || 'Warrior';
  const specialInfo = SPECIAL_MOVE_INFO[charClass] || { name: 'Special', cost: 0, desc: 'Special move' };
  const currentMana = currentFighter?.mana || 0;
  const hasManaForSpecial = currentMana >= specialInfo.cost;
  const itemCount = currentFighter?.inventory?.length || 0;

  // Compute disabled reasons
  let disabledReason = '';
  if (isGameOver) {
    disabledReason = 'Match concluded. Winner has been decided by Arena::checkWinner().';
  } else if (!isMyTurn) {
    disabledReason = "Opponent's Turn — Input locked by Arena turn order.";
  }

  const handleActionClick = (actionName) => {
    if (!isMyTurn || isGameOver) return;
    onAction(actionName);
  };

  return (
    <div className="action-bar-container" aria-label="Combat Actions">
      <div className="action-bar-header">
        <div className="action-bar-title">
          <span className="console-icon">🎮</span>
          <span className="heading-font">Combat Command Console</span>
        </div>

        <div className="action-status-indicator">
          {disabledReason ? (
            <span className="status-locked">🔒 {disabledReason}</span>
          ) : (
            <span className="status-unlocked">🔥 YOUR TURN — Select a polymorphic method</span>
          )}
        </div>
      </div>

      <div className="action-buttons-grid">
        {/* NORMAL ATTACK */}
        <button
          className="btn-action action-attack"
          onClick={() => handleActionClick('attack')}
          disabled={!isMyTurn || isGameOver}
          aria-label="Execute normal attack"
        >
          <div className="action-icon">⚔️</div>
          <div className="action-meta">
            <span className="action-main-title">Normal Attack</span>
            <code className="action-cpp-method">Character::attack()</code>
          </div>
          <div className="action-tagline">Physical Strike</div>
        </button>

        {/* SPECIAL MOVE */}
        <button
          className="btn-action action-special"
          onClick={() => handleActionClick('special')}
          disabled={!isMyTurn || isGameOver || !hasManaForSpecial}
          title={!hasManaForSpecial ? `Requires ${specialInfo.cost} MP (Available: ${currentMana} MP)` : specialInfo.desc}
          aria-label={`Execute special move: ${specialInfo.name}`}
        >
          <div className="action-icon">💥</div>
          <div className="action-meta">
            <span className="action-main-title">{specialInfo.name}</span>
            <code className="action-cpp-method">Character::specialMove()</code>
          </div>
          <div className="action-tagline">
            {specialInfo.cost > 0 ? (
              <span className={hasManaForSpecial ? 'mana-cost' : 'mana-cost-insufficient'}>
                {specialInfo.cost} MP {!hasManaForSpecial && '(Low MP)'}
              </span>
            ) : (
              <span className="mana-cost-free">0 MP (Recoil)</span>
            )}
          </div>
        </button>

        {/* USE ITEM */}
        <button
          className="btn-action action-item"
          onClick={onOpenInventory}
          disabled={!isMyTurn || isGameOver}
          aria-label="Open Inventory to use or combine items"
        >
          <div className="action-icon">🧪</div>
          <div className="action-meta">
            <span className="action-main-title">Use Item ({itemCount})</span>
            <code className="action-cpp-method">Inventory&lt;T&gt;::getItem()</code>
          </div>
          <div className="action-tagline">Potions & Gear</div>
        </button>

        {/* SKIP TURN */}
        <button
          className="btn-action action-skip"
          onClick={() => handleActionClick('skip')}
          disabled={!isMyTurn || isGameOver}
          aria-label="Skip current turn"
        >
          <div className="action-icon">🛡️</div>
          <div className="action-meta">
            <span className="action-main-title">Skip Turn</span>
            <code className="action-cpp-method">Arena::applyAction("skip")</code>
          </div>
          <div className="action-tagline">Bide Time</div>
        </button>
      </div>
    </div>
  );
}
