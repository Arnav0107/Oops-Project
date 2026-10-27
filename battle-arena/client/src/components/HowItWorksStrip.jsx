/**
 * HowItWorksStrip.jsx
 * Visualizes the full architectural pipeline on the Home screen.
 * Reinforces that the React frontend and Node relay have ZERO game logic,
 * and all combat rules reside exclusively in the compiled C++17 engine.
 */
import React from 'react';

export default function HowItWorksStrip() {
  return (
    <div className="how-it-works-card">
      <div className="how-it-works-header">
        <span className="tech-chip">ARCHITECTURE OVERVIEW</span>
        <span className="how-it-works-caption">
          All game logic runs inside the compiled C++ engine
        </span>
      </div>

      <div className="architecture-strip">
        <div className="arch-node arch-frontend">
          <div className="arch-node-badge">VIEW</div>
          <div className="arch-node-title">React UI</div>
          <div className="arch-node-desc">Vite 5 • Zero Rules</div>
        </div>

        <div className="arch-arrow">
          <div className="arch-arrow-line"></div>
          <span className="arch-arrow-label">Events</span>
        </div>

        <div className="arch-node arch-socket">
          <div className="arch-node-badge">WS</div>
          <div className="arch-node-title">Socket.io</div>
          <div className="arch-node-desc">Rooms & Relay</div>
        </div>

        <div className="arch-arrow">
          <div className="arch-arrow-line"></div>
          <span className="arch-arrow-label">stdin/stdout</span>
        </div>

        <div className="arch-node arch-node-server">
          <div className="arch-node-badge">PIPE</div>
          <div className="arch-node-title">Node.js Server</div>
          <div className="arch-node-desc">Child Process</div>
        </div>

        <div className="arch-arrow">
          <div className="arch-arrow-line"></div>
          <span className="arch-arrow-label">JSON lines</span>
        </div>

        <div className="arch-node arch-cpp-core">
          <div className="arch-node-badge">OOP CORE</div>
          <div className="arch-node-title">C++17 Engine</div>
          <div className="arch-node-desc">Classes & Polymorphism</div>
        </div>
      </div>
    </div>
  );
}
