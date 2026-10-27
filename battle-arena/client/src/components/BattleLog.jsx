/**
 * BattleLog.jsx
 * Chronicle of all combat operations streamed from the C++ engine.
 * Features semantic color-coding (damage, heal, special moves, random events, operator overloading),
 * and highlights the most recent combat transaction.
 */
import React, { useRef, useEffect } from 'react';

export default function BattleLog({ log = [] }) {
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  const classifyEntry = (text) => {
    if (text.includes('[SPECIAL]')) return 'entry-special';
    if (text.includes('takes') || text.includes('damage') || text.includes('recoil')) return 'entry-damage';
    if (text.includes('recovers') || text.includes('healed') || text.includes('HP!')) return 'entry-heal';
    if (text.includes('restores') || text.includes('MP!')) return 'entry-mana';
    if (text.includes('⚡') || text.includes('🌟') || text.includes('🎁') || text.includes('🩸')) return 'entry-event';
    if (text.includes('operator+') || text.includes('merged')) return 'entry-operator';
    if (text.includes('VICTORY') || text.includes('DEFEAT') || text.includes('Draw')) return 'entry-victory';
    if (text.includes('☠') || text.includes('succumbed')) return 'entry-defeated';
    return 'entry-default';
  };

  return (
    <div className="battle-log-card" aria-label="Battle Chronicle">
      <div className="battle-log-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📜</span>
          <h3 className="heading-font" style={{ fontSize: '1rem', color: 'var(--accent-gold)' }}>
            Combat Chronicle
          </h3>
        </div>
        <span className="log-count-tag">{log.length} Entries</span>
      </div>

      <div className="log-stream" tabIndex={0} role="region" aria-label="Battle log messages">
        {log.length === 0 ? (
          <div className="log-empty">Combat log is currently empty.</div>
        ) : (
          log.map((entry, idx) => {
            const entryType = classifyEntry(entry);
            const isLatest = idx === log.length - 1;

            return (
              <div
                key={idx}
                className={`log-row ${entryType} ${isLatest ? 'latest-row' : ''}`}
              >
                <span className="log-row-index">[{idx + 1}]</span>
                <span className="log-row-text">{entry}</span>
              </div>
            );
          })
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
