import React from 'react';
import { Trophy, RotateCcw, Save } from 'lucide-react';

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

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-box winner-box">
        <div className="winner-icon-wrap">
          <Trophy size={40} strokeWidth={2} className="trophy-icon" />
        </div>

        <h2 className="winner-title">
          {isDraw ? 'Draw!' : isVictorious ? 'Victory!' : 'Defeat'}
        </h2>

        <p className="winner-message">
          {isDraw
            ? 'Both fighters collapsed simultaneously. The match ended in a tie.'
            : isVictorious
            ? `${me?.name || 'You'} won the match.`
            : `${opponent?.name || 'Opponent'} won the match.`}
        </p>

        <div className="winner-stats-card">
          <div className="winner-stats-row">
            <span className="stats-label">Rounds played</span>
            <span className="stats-value">{roundNumber}</span>
          </div>
          <div className="winner-stats-row">
            <span className="stats-label">{me?.name || 'You'} final HP</span>
            <span className="stats-value">
              {Math.max(0, me?.health || 0)} / {me?.maxHealth || 100}
            </span>
          </div>
          <div className="winner-stats-row">
            <span className="stats-label">{opponent?.name || 'Opponent'} final HP</span>
            <span className="stats-value">
              {Math.max(0, opponent?.health || 0)} / {opponent?.maxHealth || 100}
            </span>
          </div>
        </div>

        {savedFileName && (
          <div className="file-saved-note">
            Match report saved to {savedFileName}
          </div>
        )}

        <div className="winner-actions">
          <button type="button" className="btn-primary full-width" onClick={onPlayAgain}>
            <RotateCcw size={16} strokeWidth={2} />
            <span>Play again</span>
          </button>
          <button type="button" className="btn-secondary full-width" onClick={onSaveMatch}>
            <Save size={16} strokeWidth={2} />
            <span>Save match</span>
          </button>
        </div>
      </div>
    </div>
  );
}
