import React from 'react';
import { Sword, Zap, FlaskConical, SkipForward } from 'lucide-react';

const SPECIAL_MOVE_COSTS = {
  Warrior: 0,
  Mage: 30,
  Archer: 20,
  Healer: 25
};

export default function ActionBar({
  isMyTurn = false,
  isGameOver = false,
  currentFighter = null,
  onAction,
  onOpenInventory
}) {
  const charClass = currentFighter?.class || 'Warrior';
  const specialCost = SPECIAL_MOVE_COSTS[charClass] || 0;
  const currentMana = currentFighter?.mana || 0;
  const hasManaForSpecial = currentMana >= specialCost;
  const itemCount = currentFighter?.inventory?.length || 0;

  const getDisabledReason = (actionType) => {
    if (isGameOver) return 'Game over';
    if (!isMyTurn) return "Opponent's turn";
    if (actionType === 'special' && !hasManaForSpecial) return 'Not enough mana';
    return null;
  };

  const handleAction = (actionName) => {
    if (!isMyTurn || isGameOver) return;
    onAction(actionName);
  };

  const attackDisabled = !isMyTurn || isGameOver;
  const specialDisabled = !isMyTurn || isGameOver || !hasManaForSpecial;
  const itemDisabled = !isMyTurn || isGameOver;
  const skipDisabled = !isMyTurn || isGameOver;

  return (
    <div className="action-bar" aria-label="Combat actions">
      <div className="action-grid">
        {/* Attack */}
        <button
          type="button"
          className="btn-action"
          onClick={() => handleAction('attack')}
          disabled={attackDisabled}
          aria-label="Attack"
        >
          <div className="action-main">
            <Sword size={18} strokeWidth={2} />
            <span className="action-label">Attack</span>
          </div>
          {getDisabledReason('attack') && (
            <span className="action-reason">{getDisabledReason('attack')}</span>
          )}
        </button>

        {/* Special move */}
        <button
          type="button"
          className="btn-action"
          onClick={() => handleAction('special')}
          disabled={specialDisabled}
          aria-label="Special move"
        >
          <div className="action-main">
            <Zap size={18} strokeWidth={2} />
            <span className="action-label">Special move</span>
          </div>
          {getDisabledReason('special') ? (
            <span className="action-reason">{getDisabledReason('special')}</span>
          ) : specialCost > 0 ? (
            <span className="action-cost">{specialCost} Mana</span>
          ) : (
            <span className="action-cost">0 Mana</span>
          )}
        </button>

        {/* Use item */}
        <button
          type="button"
          className="btn-action"
          onClick={onOpenInventory}
          disabled={itemDisabled}
          aria-label="Use item"
        >
          <div className="action-main">
            <FlaskConical size={18} strokeWidth={2} />
            <span className="action-label">Use item</span>
          </div>
          {getDisabledReason('item') ? (
            <span className="action-reason">{getDisabledReason('item')}</span>
          ) : (
            <span className="action-count">{itemCount} items</span>
          )}
        </button>

        {/* Skip turn */}
        <button
          type="button"
          className="btn-action"
          onClick={() => handleAction('skip')}
          disabled={skipDisabled}
          aria-label="Skip turn"
        >
          <div className="action-main">
            <SkipForward size={18} strokeWidth={2} />
            <span className="action-label">Skip turn</span>
          </div>
          {getDisabledReason('skip') && (
            <span className="action-reason">{getDisabledReason('skip')}</span>
          )}
        </button>
      </div>
    </div>
  );
}
