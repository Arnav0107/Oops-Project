import React, { useState } from 'react';
import { Swords, Menu, X } from 'lucide-react';

export default function LandingNav({ onPlayNow }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="landing-nav" aria-label="Main navigation">
      <div className="nav-container">
        <a href="#/" className="nav-brand" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <Swords size={20} strokeWidth={2} className="nav-brand-icon" />
          <span className="nav-brand-text">Battle Arena</span>
        </a>

        {/* Desktop Nav Links */}
        <div className="nav-links">
          <button type="button" className="nav-link-btn" onClick={() => scrollToSection('architecture')}>
            Architecture
          </button>
          <button type="button" className="nav-link-btn" onClick={() => scrollToSection('concepts')}>
            Concepts
          </button>
          <button type="button" className="nav-link-btn" onClick={() => scrollToSection('characters')}>
            Characters
          </button>
          <button type="button" className="btn-primary btn-sm" onClick={onPlayNow}>
            Play now
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <button type="button" className="mobile-nav-link" onClick={() => scrollToSection('architecture')}>
            Architecture
          </button>
          <button type="button" className="mobile-nav-link" onClick={() => scrollToSection('concepts')}>
            Concepts
          </button>
          <button type="button" className="mobile-nav-link" onClick={() => scrollToSection('characters')}>
            Characters
          </button>
          <button type="button" className="btn-primary full-width" onClick={() => { setMobileMenuOpen(false); onPlayNow(); }}>
            Play now
          </button>
        </div>
      )}
    </nav>
  );
}
