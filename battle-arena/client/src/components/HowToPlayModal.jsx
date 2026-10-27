/**
 * HowToPlayModal.jsx
 * Operational guide for players and presentation evaluators.
 * Covers turn mechanics, class specializations, Wi-Fi connection, and C++ operator overloading.
 */
import React from 'react';

export default function HowToPlayModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="heading-font" style={{ color: 'var(--accent-gold)', fontSize: '1.4rem' }}>
            ⚔️ How to Play & Demonstrate
          </h3>
          <button className="btn-close" onClick={onClose} aria-label="Close guide">
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
          <section className="guide-section">
            <h4 style={{ color: '#c4b5fd', marginBottom: '0.3rem' }}>1. Connecting from Two Devices</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              • <strong>Host Laptop:</strong> Start room on <code>localhost:5173</code> and copy the 4-letter Room Code.<br/>
              • <strong>Second Device:</strong> Connect to the same Wi-Fi, open the LAN IP printed by the server (e.g. <code>http://192.168.x.x:5173</code>), input the room code, and join.
            </p>
          </section>

          <section className="guide-section">
            <h4 style={{ color: '#c4b5fd', marginBottom: '0.3rem' }}>2. Turn-Based Combat Flow</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              • Players alternate turns. Only the active player's command buttons are enabled.<br/>
              • <strong>Normal Attack:</strong> Basic physical or arcane strike using <code>Character::attack()</code>.<br/>
              • <strong>Special Move:</strong> Class-specific high-impact ability (e.g. Mage Fireball, Warrior Berserk, Archer Multi-shot, Healer Soul Drain).
            </p>
          </section>

          <section className="guide-section">
            <h4 style={{ color: '#c4b5fd', marginBottom: '0.3rem' }}>3. Operator Overloading Demo</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              • When holding 2 or more Health Potions, open <strong>Use Item</strong> and click <strong>Combine (+)</strong>.<br/>
              • This invokes <code>HealthPotion::operator+</code> in C++ to synthesize a <strong>Super Health Potion (+85 HP)</strong>!
            </p>
          </section>

          <section className="guide-section">
            <h4 style={{ color: '#c4b5fd', marginBottom: '0.3rem' }}>4. Watching the C++ Engine Trace</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              • Keep the <strong>C++ Engine Trace</strong> panel open during the duel.<br/>
              • It translates every combat event into the exact C++ method call, virtual dispatch, and OOP concept tag in real-time.
            </p>
          </section>
        </div>

        <button className="btn btn-primary" onClick={onClose} style={{ marginTop: '1.2rem', width: '100%' }}>
          Got It, Let's Battle!
        </button>
      </div>
    </div>
  );
}
