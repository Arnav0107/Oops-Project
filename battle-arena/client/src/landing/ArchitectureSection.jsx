import React from 'react';
import { ArrowRight, Monitor, Server, Cpu, RefreshCw } from 'lucide-react';

export default function ArchitectureSection() {
  const steps = [
    'The browser sends the action over a socket.',
    "The server checks it is that player's turn.",
    'The server writes a JSON command to the engine.',
    'The engine runs the game logic and replies with the new state as JSON.',
    'The server forwards the state to both players.'
  ];

  return (
    <section id="architecture" className="landing-section architecture-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">System architecture</h2>
          <p className="section-desc">
            All game rules live in the C++ engine, and the server only relays messages between connected clients.
          </p>
        </div>

        {/* 4 Boxes Horizontal Diagram */}
        <div className="architecture-diagram" aria-label="System architecture diagram">
          {/* Box 1 */}
          <div className="arch-box">
            <div className="arch-icon-wrap">
              <Monitor size={22} strokeWidth={2} />
            </div>
            <div className="arch-box-title">Browser</div>
            <div className="arch-box-sub">React frontend</div>
          </div>

          <div className="arch-arrow">
            <ArrowRight size={18} strokeWidth={2} />
          </div>

          {/* Box 2 */}
          <div className="arch-box">
            <div className="arch-icon-wrap">
              <Server size={22} strokeWidth={2} />
            </div>
            <div className="arch-box-title">Realtime server</div>
            <div className="arch-box-sub">Node.js + Socket.io</div>
          </div>

          <div className="arch-arrow">
            <ArrowRight size={18} strokeWidth={2} />
          </div>

          {/* Box 3 */}
          <div className="arch-box">
            <div className="arch-icon-wrap">
              <Cpu size={22} strokeWidth={2} />
            </div>
            <div className="arch-box-title">Game engine</div>
            <div className="arch-box-sub">C++ program</div>
          </div>

          <div className="arch-arrow">
            <ArrowRight size={18} strokeWidth={2} />
          </div>

          {/* Box 4 */}
          <div className="arch-box">
            <div className="arch-icon-wrap">
              <RefreshCw size={22} strokeWidth={2} />
            </div>
            <div className="arch-box-title">Browser</div>
            <div className="arch-box-sub">State update rendered</div>
          </div>
        </div>

        {/* Numbered List: What happens when a player clicks Attack */}
        <div className="sequence-panel">
          <h3 className="sequence-title">What happens when a player clicks Attack</h3>
          <ol className="sequence-list">
            {steps.map((step, idx) => (
              <li key={idx} className="sequence-item">
                <span className="sequence-num">{idx + 1}</span>
                <span className="sequence-text">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
