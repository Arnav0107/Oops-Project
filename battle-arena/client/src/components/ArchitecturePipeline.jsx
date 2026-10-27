/**
 * ArchitecturePipeline.jsx
 * Live animated pipeline displayed above the Battle Arena stage.
 * When player clicks an action, a pulse travels left-to-right (React -> Node -> C++ Engine).
 * When the C++ state arrives, a return wave travels back right-to-left.
 */
import React from 'react';

export default function ArchitecturePipeline({ isPulsingOut, isPulsingIn, lastAction }) {
  return (
    <div className="pipeline-wrapper" title="Real-time IPC telemetry between frontend and C++ engine">
      <div className="pipeline-label">
        <span className="live-dot pulse-anim"></span>
        <span>LIVE IPC PIPELINE:</span>
        <span className="pipeline-activity">
          {isPulsingOut && '📤 Forwarding command to C++ stdin...'}
          {isPulsingIn && '📥 Broadcasting C++ state from stdout...'}
          {!isPulsingOut && !isPulsingIn && (lastAction ? `Ready (Last: ${lastAction})` : 'Idle / Ready')}
        </span>
      </div>

      <div className={`pipeline-track ${isPulsingOut ? 'pulse-outgoing' : ''} ${isPulsingIn ? 'pulse-incoming' : ''}`}>
        <div className="pipe-box pipe-react">
          <span className="pipe-box-role">CLIENT</span>
          <strong>React</strong>
        </div>

        <div className="pipe-wire">
          <div className="packet-dot out-dot"></div>
          <div className="packet-dot in-dot"></div>
          <span className="wire-label">ws://</span>
        </div>

        <div className="pipe-box pipe-socket">
          <span className="pipe-box-role">NETWORK</span>
          <strong>Socket.io</strong>
        </div>

        <div className="pipe-wire">
          <div className="packet-dot out-dot"></div>
          <div className="packet-dot in-dot"></div>
          <span className="wire-label">relay</span>
        </div>

        <div className="pipe-box pipe-node">
          <span className="pipe-box-role">HOST</span>
          <strong>Node Relay</strong>
        </div>

        <div className="pipe-wire">
          <div className="packet-dot out-dot"></div>
          <div className="packet-dot in-dot"></div>
          <span className="wire-label">stdin/out</span>
        </div>

        <div className="pipe-box pipe-cpp active-core">
          <span className="pipe-box-role">LOGIC CORE</span>
          <strong>C++17 Engine</strong>
        </div>
      </div>
    </div>
  );
}
