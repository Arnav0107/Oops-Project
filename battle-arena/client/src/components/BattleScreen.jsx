/**
 * BattleScreen.jsx
 * Primary combat interface orchestrating the Arena stage, C++ call trace telemetry,
 * animated architectural pipeline, combat command console, and victory resolution.
 */
import React, { useState, useEffect, useRef } from 'react';
import ArchitecturePipeline from './ArchitecturePipeline';
import FighterCard from './FighterCard';
import ActionBar from './ActionBar';
import BattleLog from './BattleLog';
import TracePanel from './TracePanel';
import ItemModal from './ItemModal';
import WinnerOverlay from './WinnerOverlay';
import { buildTraceEntry } from '../utils/traceHelper';

export default function BattleScreen({
  gameState,
  playerIndex,
  onAction,
  onSaveMatch,
  onPlayAgain,
  gameError,
  savedFileNotice,
  presentationMode = false,
  onOpenConcepts
}) {
  const [showItemModal, setShowItemModal] = useState(false);
  const [isTraceOpen, setIsTraceOpen] = useState(true);
  const [traces, setTraces] = useState([]);
  const [demonstratedConcepts, setDemonstratedConcepts] = useState([
    'inheritance',
    'abstraction',
    'static_members',
    'polymorphism',
    'encapsulation',
    'templates'
  ]);

  // Telemetry pipeline animation triggers
  const [isPulsingOut, setIsPulsingOut] = useState(false);
  const [isPulsingIn, setIsPulsingIn] = useState(false);
  const [lastActionName, setLastActionName] = useState('');

  // Floating combat numbers per fighter index
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

  // If presentation mode turned on, ensure trace panel is open
  useEffect(() => {
    if (presentationMode) {
      setIsTraceOpen(true);
    }
  }, [presentationMode]);

  // Initial trace entry on mount
  useEffect(() => {
    if (players.length >= 2 && traces.length === 0) {
      const initTrace = buildTraceEntry({
        type: 'start',
        action: 'start',
        actor: players[0],
        target: players[1],
        round: 1
      });
      setTraces([initTrace]);
    }
  }, [players]);

  // Detect state updates: trigger return pulse and calculate floating damage/heal numbers
  useEffect(() => {
    if (!gameState) return;

    // Trigger return telemetry wave
    setIsPulsingOut(false);
    setIsPulsingIn(true);
    const returnTimer = setTimeout(() => setIsPulsingIn(false), 900);

    // Compute floaters by comparing previous and current health / mana
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
            addFloater(idx, `${mpDiff} MP`, 'mana-spend');
          } else if (mpDiff > 0) {
            addFloater(idx, `+${mpDiff} MP`, 'mana-gain');
          }
        }
      });
    }

    prevPlayersRef.current = players;

    return () => clearTimeout(returnTimer);
  }, [gameState]);

  // Listen for Random Events
  useEffect(() => {
    if (event && event !== 'The battle begins! Round 1!' && event !== 'Match initialized. Choose your action!') {
      const eventTrace = buildTraceEntry({
        action: 'event',
        actor: me || { name: 'Player', class: 'Warrior' },
        target: opponent || { name: 'Opponent', class: 'Mage' },
        round,
        eventName: event
      });
      appendTrace(eventTrace);
    }
  }, [event]);

  // Listen for GameException errors
  useEffect(() => {
    if (gameError) {
      const errTrace = buildTraceEntry({
        action: 'error',
        actor: me || { name: 'Player', class: 'Warrior' },
        round,
        errorMessage: gameError
      });
      appendTrace(errTrace);
    }
  }, [gameError]);

  // Listen for match saved notices
  useEffect(() => {
    if (savedFileNotice) {
      const saveTrace = buildTraceEntry({
        action: 'save',
        actor: me || { name: 'Player', class: 'Warrior' },
        round,
        savedFile: savedFileNotice
      });
      appendTrace(saveTrace);
    }
  }, [savedFileNotice]);

  const addFloater = (targetIdx, text, type) => {
    const newFloater = { id: Math.random().toString(), text, type };
    setFloaters((prev) => ({
      ...prev,
      [targetIdx]: [...(prev[targetIdx] || []), newFloater]
    }));

    setTimeout(() => {
      setFloaters((prev) => ({
        ...prev,
        [targetIdx]: (prev[targetIdx] || []).filter((f) => f.id !== newFloater.id)
      }));
    }, 1800);
  };

  const appendTrace = (newTrace) => {
    setTraces((prev) => [...prev, newTrace]);
    if (newTrace.concepts) {
      setDemonstratedConcepts((prev) => {
        const set = new Set([...prev, ...newTrace.concepts]);
        return Array.from(set);
      });
    }
  };

  // User actions triggered from ActionBar
  const handleAction = (actionName, itemIndex = 0) => {
    if (!isMyTurn) return;

    setLastActionName(actionName);
    setIsPulsingOut(true);

    const actionTrace = buildTraceEntry({
      action: actionName,
      actor: me,
      target: opponent,
      round,
      itemIndex,
      itemName: actionName === 'item' && me?.inventory?.[itemIndex]?.name ? me.inventory[itemIndex].name : 'Health Potion'
    });
    appendTrace(actionTrace);

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
    <div className={`battle-screen-container ${presentationMode ? 'presentation-mode' : ''}`}>
      {/* 1. Live IPC Telemetry Pipeline */}
      <ArchitecturePipeline
        isPulsingOut={isPulsingOut}
        isPulsingIn={isPulsingIn}
        lastAction={lastActionName}
      />

      {/* 2. Error Banner (C++ GameException) */}
      {gameError && (
        <div className="game-exception-banner" role="alert">
          <div className="ge-icon">⚠️</div>
          <div className="ge-body">
            <div className="ge-title">GameException Thrown by C++ Engine:</div>
            <div className="ge-msg">{gameError}</div>
          </div>
          <span className="ge-badge">Exception Handling</span>
        </div>
      )}

      {/* 3. Random Environmental Arena Event Banner */}
      {event && (
        <div className={`random-event-banner ${getEventColorClass(event)}`}>
          <span className="event-icon">{getEventIcon(event)}</span>
          <div className="event-content">
            <div className="event-title-tag">Arena Environmental Phenomenon:</div>
            <div className="event-desc">{event}</div>
          </div>
          <span className="event-vtable-badge">Polymorphic Event</span>
        </div>
      )}

      {/* 4. Top Match Status & Controls Bar */}
      <div className="battle-top-bar">
        <div className="round-turn-status">
          <span className="round-badge">ROUND {round}</span>
          <div className={`turn-indicator-pill ${isMyTurn ? 'my-turn-pill' : 'opp-turn-pill'}`}>
            <span className="pulse-indicator"></span>
            <strong>{isMyTurn ? '🔥 YOUR TURN TO ACT' : `⏳ WAITING FOR ${opponent?.name || 'OPPONENT'}`}</strong>
          </div>
        </div>

        <div className="top-bar-actions">
          <button
            className="btn btn-secondary btn-save-match"
            onClick={onSaveMatch}
            title="Archive full combat report to disk via C++ std::ofstream file streams"
          >
            <span>💾</span>
            <span>Save match (Arena::saveMatch - File Handling)</span>
          </button>
        </div>
      </div>

      {/* 5. Main Arena Grid (Fighter Cards Stage, ActionBar, Log, Trace) */}
      <div className="battle-arena-grid">
        <div className="arena-combat-column">
          {/* Dual Fighters Stage */}
          <div className="fighters-stage-row">
            <FighterCard
              fighter={me}
              index={playerIndex}
              playerIndex={playerIndex}
              isTurn={currentTurn === playerIndex && winner === null}
              isAttacking={isMyTurn && isPulsingOut}
              recentFloaters={floaters[playerIndex] || []}
              onOpenInventory={() => setShowItemModal(true)}
            />

            <div className="arena-versus-divider" aria-hidden="true">
              <span>VS</span>
            </div>

            <FighterCard
              fighter={opponent}
              index={1 - playerIndex}
              playerIndex={playerIndex}
              isTurn={currentTurn === (1 - playerIndex) && winner === null}
              isAttacking={!isMyTurn && isPulsingOut}
              recentFloaters={floaters[1 - playerIndex] || []}
              onOpenInventory={() => {}}
            />
          </div>

          {/* Player Command Console */}
          <ActionBar
            isMyTurn={isMyTurn}
            isGameOver={winner !== null}
            currentFighter={me}
            onAction={handleAction}
            onOpenInventory={() => setShowItemModal(true)}
          />

          {/* Combat Log Chronicle */}
          <BattleLog log={log} />
        </div>

        {/* 6. Live C++ Engine Trace Panel */}
        <TracePanel
          traces={traces}
          isOpen={isTraceOpen}
          onToggle={() => setIsTraceOpen(!isTraceOpen)}
          demonstratedConcepts={demonstratedConcepts}
          onOpenConceptsDrawer={onOpenConcepts}
        />
      </div>

      {/* 7. Inventory & Potion Combiner Modal */}
      {showItemModal && me && (
        <ItemModal
          inventory={me.inventory || []}
          onUseItem={handleUseItem}
          onCombinePotions={handleCombinePotions}
          onClose={() => setShowItemModal(false)}
        />
      )}

      {/* 8. Winner & Replay Modal */}
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

function getEventIcon(eventText) {
  if (eventText.includes('⚡') || eventText.includes('Lightning')) return '⚡';
  if (eventText.includes('🌟') || eventText.includes('Blessing')) return '🌟';
  if (eventText.includes('🎁') || eventText.includes('crate') || eventText.includes('supply')) return '🎁';
  if (eventText.includes('🩸') || eventText.includes('Blood')) return '🩸';
  return '⚔️';
}

function getEventColorClass(eventText) {
  if (eventText.includes('⚡') || eventText.includes('Lightning')) return 'event-lightning';
  if (eventText.includes('🌟') || eventText.includes('Blessing')) return 'event-blessing';
  if (eventText.includes('🎁') || eventText.includes('crate')) return 'event-crate';
  if (eventText.includes('🩸') || eventText.includes('Blood')) return 'event-blood';
  return 'event-default';
}
