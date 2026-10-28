import React, { useRef, useEffect } from 'react';
import { ScrollText } from 'lucide-react';

export default function BattleLog({ log = [] }) {
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  return (
    <div className="battle-log-panel" aria-label="Battle log">
      <div className="log-header">
        <div className="log-title-row">
          <ScrollText size={16} strokeWidth={2} />
          <h4 className="log-heading">Battle log</h4>
        </div>
        <span className="log-entry-count">{log.length} actions</span>
      </div>

      <div className="log-content" tabIndex={0} role="region" aria-label="Log stream">
        {log.length === 0 ? (
          <div className="log-empty">The match has not started yet.</div>
        ) : (
          log.map((entry, idx) => (
            <div key={idx} className="log-row">
              <span className="log-index">{idx + 1}</span>
              <span className="log-text">{entry}</span>
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
