/**
 * WinnerOverlay.jsx
 * Presentation modal rendered when a victor or draw is resolved.
 * Explains that the outcome was computed by C++ Arena::checkWinner(),
 * visualizes final statistics, confetti effects, and offers replay export options.
 */
import React from 'react';

export default function WinnerOverlay({
  winnerIndex,
  playerIndex,
  players = [],
  roundNumber = 1,
  savedFileName = '',
  onPlayAgain,
  onSaveMatch
}) {
  if (winnerIndex === null || winnerIndex === undefined) return null;

  const isDraw = winnerIndex === -2;
  const isVictorious = winnerIndex === playerIndex;

  const me = players[playerIndex];
  const opponent = players[1 - playerIndex];
  const champion = !isDraw && players[winnerIndex] ? players[winnerIndex] : null;

  return (
    <div className="winner-overlay-backdrop" role="dialog" aria-modal="true">
      {/* Confetti particles for victory */}
      {isVictorious && (
        <div className="confetti-container" aria-hidden="true">
          {[...Array(24)].map((_, i) => (
            <div key={i} className={`confetti-piece piece-${i % 6}`} />
          ))}
        </div>
      )}

      <div className={`winner-card-panel ${isVictorious ? 'victory-glow' : ''}`}>
        {/* Top Trophy Icon */}
        <div className="winner-trophy-symbol">
          {isDraw ? '🤝' : (isVictorious ? '👑' : '💀')}
        </div>

        <div className="engine-resolution-chip">
          Resolved by <code>Arena::checkWinner()</code>
        </div>

        <h2 className="winner-main-title heading-font">
          {isDraw
            ? 'MUTUAL DEFEAT (DRAW)'
            : (isVictorious ? 'VICTORY ACHIEVED!' : 'DEFEAT')}
        </h2>

        <p className="winner-summary-text">
          {isDraw
            ? 'Both champions collapsed simultaneously! The match concluded in an honorable tie.'
            : (isVictorious
                ? `Congratulations! ${me?.name} (${me?.class}) dominated the Arena!`
                : `${opponent?.name} (${opponent?.class}) has triumphed in the Arena.`)}
        </p>

        {/* Final Statistics Comparison */}
        <div className="final-stats-comparison">
          <div className="fsc-header">
            <span>FINAL COMBATANT STATUS (ROUNDS: {roundNumber})</span>
          </div>

          <div className="fsc-row">
            <div className="fsc-fighter">
              <span className="fsc-role">{isVictorious ? '🏆 Champion' : 'Fighter'}:</span>
              <strong>{me?.name} ({me?.class})</strong>
              <span className="fsc-hp">HP: {me?.health} / {me?.maxHealth}</span>
            </div>

            <div className="fsc-vs">VS</div>

            <div className="fsc-fighter">
              <span className="fsc-role">{!isVictorious && !isDraw ? '🏆 Champion' : 'Fighter'}:</span>
              <strong>{opponent?.name} ({opponent?.class})</strong>
              <span className="fsc-hp">HP: {opponent?.health} / {opponent?.maxHealth}</span>
            </div>
          </div>
        </div>

        {/* Persistence Notice if saved */}
        {savedFileName && (
          <div className="saved-file-alert">
            ✓ Match chronicle archived via <code>Arena::saveMatch("{savedFileName}")</code>!
          </div>
        )}

        {/* Action Buttons */}
        <div className="winner-actions-group">
          <button
            className="btn btn-primary"
            onClick={onPlayAgain}
            style={{ padding: '0.85rem', width: '100%' }}
          >
            🔄 Play Again (Arena::startMatch)
          </button>

          <button
            className="btn btn-secondary"
            onClick={onSaveMatch}
            style={{ padding: '0.8rem', width: '100%' }}
          >
            💾 Save Match (Arena::saveMatch - File Handling)
          </button>
        </div>
      </div>
    </div>
  );
}
