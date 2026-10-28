import React, { useState, useEffect, useRef } from 'react';
import { Save, AlertCircle, Sparkles } from 'lucide-react';
import FighterCard from './FighterCard';
import ActionBar from './ActionBar';
import BattleLog from './BattleLog';
import ItemModal from './ItemModal';
import WinnerOverlay from './WinnerOverlay';

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
  const [floaters, setFloaters] = useState({ 0: [], 1: [] });
  const prevPlayersRef = useRef(gameState?.players || []);

  const players = gameState?.players || [];
  const currentTurn = gameState?.turn;
  const isMyTurn = currentTurn === playerIndex;
  const winner = gameState?.winner;
  const round = gameState?.round || 1;
  const event = gameState?.event;
  const log = gameState?.log || [];

  const me = players[playerIndex];
  const opponent = players[1 - playerIndex];

  // Calculate floaters on health/mana change
  useEffect(() => {
    if (!gameState) return;

    const prevPlayers = prevPlayersRef.current;
    if (prevPlayers.length >= 2 && players.length >= 2) {
      players.forEach((curr, idx) => {
        const prev = prevPlayers[idx];
        if (prev) {
          const hpDiff = curr.health - prev.health;
          const mpDiff = curr.mana - prev.mana;

          if (hpDiff < 0) {
            addFloater(idx, `${hpDiff} HP`, 'damage');
          } else if (hpDiff > 0) {
            addFloater(idx, `+${hpDiff} HP`, 'heal');
          }

          if (mpDiff < 0 && hpDiff >= 0) {
            addFloater(idx, `${mpDiff} Mana`, 'mana-spend');
          } else if (mpDiff > 0) {
            addFloater(idx, `+${mpDiff} Mana`, 'mana-gain');
          }
        }
      });
    }

    prevPlayersRef.current = players;
  }, [gameState, players]);

  const addFloater = (targetIdx, text, type) => {
    const id = Math.random().toString(36).substring(2, 9);
    setFloaters((prev) => ({
      ...prev,
      [targetIdx]: [...(prev[targetIdx] || []), { id, text, type }]
    }));

    setTimeout(() => {
      setFloaters((prev) => ({
        ...prev,
        [targetIdx]: (prev[targetIdx] || []).filter((f) => f.id !== id)
      }));
    }, 1500);
  };

  const handleAction = (actionName, itemIndex = 0) => {
    if (!isMyTurn) return;
    onAction(actionName, itemIndex);
  };

  const handleUseItem = (idx) => {
    setShowItemModal(false);
    handleAction('item', idx);
  };

  const handleCombinePotions = () => {
    setShowItemModal(false);
    handleAction('combine');
  };

  return (
    <div className="battle-container">
      {/* Top Status Bar: Round, Turn, Save Match */}
      <div className="battle-top-bar">
        <div className="turn-indicator-group">
          <span className="round-pill">Round {round}</span>
          <div className={`turn-status ${isMyTurn ? 'my-turn' : 'opponent-turn'}`}>
            <span className="turn-dot" />
            <span className="turn-label">
              {isMyTurn ? 'Your turn' : `Waiting for ${opponent?.name || 'opponent'}`}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="btn-secondary btn-sm"
          onClick={onSaveMatch}
          title="Save match summary to disk"
        >
          <Save size={14} strokeWidth={2} />
          <span>Save match</span>
        </button>
      </div>

      {/* Error Banner */}
      {gameError && (
        <div className="game-alert-banner error" role="alert">
          <AlertCircle size={16} strokeWidth={2} />
          <span>{gameError}</span>
        </div>
      )}

      {/* Arena Event Banner */}
      {event && event !== 'The battle begins! Round 1!' && event !== 'Match initialized. Choose your action!' && (
        <div className="game-alert-banner event" role="status">
          <Sparkles size={16} strokeWidth={2} />
          <span>{event}</span>
        </div>
      )}

      {/* Fighter Panels Stage */}
      <div className="fighters-stage">
        <FighterCard
          fighter={me}
          index={playerIndex}
          playerIndex={playerIndex}
          isTurn={currentTurn === playerIndex && winner === null}
          isAttacking={isMyTurn}
          recentFloaters={floaters[playerIndex] || []}
          onOpenInventory={() => setShowItemModal(true)}
        />

        <div className="versus-badge" aria-hidden="true">
          <span>VS</span>
        </div>

        <FighterCard
          fighter={opponent}
          index={1 - playerIndex}
          playerIndex={playerIndex}
          isTurn={currentTurn === (1 - playerIndex) && winner === null}
          isAttacking={!isMyTurn}
          recentFloaters={floaters[1 - playerIndex] || []}
          onOpenInventory={() => {}}
        />
      </div>

      {/* Action Bar */}
      <ActionBar
        isMyTurn={isMyTurn}
        isGameOver={winner !== null}
        currentFighter={me}
        onAction={handleAction}
        onOpenInventory={() => setShowItemModal(true)}
      />

      {/* Battle Log */}
      <BattleLog log={log} />

      {/* Inventory Modal */}
      {showItemModal && me && (
        <ItemModal
          inventory={me.inventory || []}
          onUseItem={handleUseItem}
          onCombinePotions={handleCombinePotions}
          onClose={() => setShowItemModal(false)}
        />
      )}

      {/* Winner Modal */}
      {winner !== null && (
        <WinnerOverlay
          winnerIndex={winner}
          playerIndex={playerIndex}
          players={players}
          roundNumber={round}
          savedFileName={savedFileNotice}
          onPlayAgain={onPlayAgain}
          onSaveMatch={onSaveMatch}
        />
      )}
    </div>
  );
}
