/**
 * TracePanel.jsx
 * Real-time C++ Call Trace Panel (The "Wow" Presentation Feature).
 * Dynamically resolves combat state transactions into the exact C++ methods,
 * virtual dispatch calls, and OOP concepts executed by the engine.
 * Features an active checklist counter (e.g. 5/8 Concepts Demonstrated).
 */
import React, { useRef, useEffect } from 'react';

export const ALL_OOP_CHECKLIST = [
  { id: 'polymorphism', label: 'Polymorphism', tag: 'virtual dispatch' },
  { id: 'encapsulation', label: 'Encapsulation', tag: 'protected getters/setters' },
  { id: 'inheritance', label: 'Inheritance', tag: 'Character derived' },
  { id: 'abstraction', label: 'Abstraction', tag: 'pure virtual contracts' },
  { id: 'operator_overloading', label: 'Operator Overloading', tag: 'operator+, <<, <' },
  { id: 'templates', label: 'Templates', tag: 'Inventory<T>' },
  { id: 'static_members', label: 'Static Members', tag: 'totalCharactersCreated' },
  { id: 'exceptions', label: 'Exceptions', tag: 'GameException try/catch' },
  { id: 'file_io', label: 'File I/O', tag: 'Arena::saveMatch' },
];

export default function TracePanel({
  traces = [],
  isOpen = true,
  onToggle,
  demonstratedConcepts = [],
  onOpenConceptsDrawer
}) {
  const traceEndRef = useRef(null);

  // Auto scroll to latest trace
  useEffect(() => {
    if (isOpen) {
      traceEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [traces, isOpen]);

  const count = demonstratedConcepts.length;
  const total = ALL_OOP_CHECKLIST.length;

  return (
    <aside className={`trace-panel ${isOpen ? 'open' : 'collapsed'}`} aria-label="C++ Engine Execution Trace">
      {/* Header & Toggle */}
      <div className="trace-header">
        <div className="trace-title-group" onClick={onToggle} style={{ cursor: 'pointer' }}>
          <span className="live-dot pulse-anim"></span>
          <div>
            <div className="trace-heading heading-font">C++ Engine Trace</div>
            <div className="trace-subheading">Live vtable & OOP call stack</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            className="btn-icon-toggle"
            onClick={onToggle}
            aria-label={isOpen ? 'Collapse Trace Panel' : 'Expand Trace Panel'}
            title={isOpen ? 'Collapse Trace Panel' : 'Expand Trace Panel'}
          >
            {isOpen ? '▶' : '◀'}
          </button>
        </div>
      </div>

      {isOpen && (
        <>
          {/* Concepts Checklist Counter */}
          <div className="checklist-container">
            <div className="checklist-header">
              <span className="checklist-counter">
                Demonstrated: <strong>{count}/{total}</strong> Concepts
              </span>
              <button
                className="btn-link"
                onClick={onOpenConceptsDrawer}
                title="View full C++ code for each concept"
              >
                Inspect All ↗
              </button>
            </div>

            <div className="checklist-chips">
              {ALL_OOP_CHECKLIST.map((c) => {
                const isDemonstrated = demonstratedConcepts.includes(c.id);
                return (
                  <span
                    key={c.id}
                    className={`concept-chip ${isDemonstrated ? 'active' : 'idle'}`}
                    title={c.tag}
                  >
                    {isDemonstrated ? '✓ ' : '○ '}
                    {c.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Trace Log Stream */}
          <div className="trace-stream">
            {traces.length === 0 ? (
              <div className="trace-empty">
                <span style={{ fontSize: '1.4rem' }}>⚙️</span>
                <div>Engine initialized. Awaiting combat action to trace execution...</div>
              </div>
            ) : (
              traces.map((trace, idx) => (
                <div key={trace.id || idx} className="trace-entry slide-in">
                  <div className="trace-entry-meta">
                    <span className="trace-round-badge">
                      R{trace.round} • Turn: {trace.actorName} ({trace.actorClass})
                    </span>
                    <span className="trace-time">{trace.timestamp || `Step #${idx + 1}`}</span>
                  </div>

                  <pre className="trace-code-block">
                    <code>{trace.code}</code>
                  </pre>

                  {trace.note && <div className="trace-note">{trace.note}</div>}

                  <div className="trace-tags">
                    {trace.concepts?.map((cId) => (
                      <span key={cId} className="trace-tag-badge">
                        #{cId.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
            <div ref={traceEndRef} />
          </div>
        </>
      )}
    </aside>
  );
}
