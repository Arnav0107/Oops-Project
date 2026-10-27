/**
 * Footer.jsx
 * Persistent footer on every screen displaying technical engine specs
 * and the complete taxonomy of academic OOP concepts demonstrated in the presentation.
 */
import React from 'react';

export default function Footer({ onOpenConcepts }) {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-engine-info">
          <span className="footer-badge">CORE: C++17</span>
          <span className="footer-text">
            <strong>Demonstrated Concepts:</strong> Abstraction • Encapsulation • Inheritance • Polymorphism • Operator Overloading • Templates • Static Members • Exceptions • File I/O
          </span>
        </div>

        <button
          className="footer-link-btn"
          onClick={onOpenConcepts}
          title="Open complete C++ code snippets and implementation mapping"
        >
          View Concept Mappings ↗
        </button>
      </div>
    </footer>
  );
}
