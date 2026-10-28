import React from 'react';
import { ArrowRight, Sword, Zap, FlaskConical, SkipForward } from 'lucide-react';
import ClassAvatar from '../components/ClassAvatar';

export default function HeroSection({ onPlayNow, onSeeHowItWorks }) {
  return (
    <section className="hero-section">
      <div className="section-container">
        <div className="hero-grid">
          {/* Hero Copy */}
          <div className="hero-content">
            <h1 className="hero-headline">Real-time two-player battles</h1>
            <p className="hero-subhead">
              A turn-based multiplayer combat game with four distinct fighter classes, tactical items, and deterministic round resolution.
            </p>
            <div className="hero-cta-group">
              <button type="button" className="btn-primary" onClick={onPlayNow}>
                <span>Play now</span>
                <ArrowRight size={16} strokeWidth={2} />
              </button>
              <button type="button" className="btn-secondary" onClick={onSeeHowItWorks}>
                See how it works
              </button>
            </div>
          </div>

          {/* Static Battle Screen Mock Preview */}
          <div className="hero-mock-wrap" aria-label="Battle interface preview">
            <div className="mock-window">
              <div className="mock-titlebar">
                <span className="mock-dot" />
                <span className="mock-dot" />
                <span className="mock-dot" />
                <span className="mock-title">Round 3 • Your turn</span>
              </div>

              <div className="mock-arena">
                <div className="mock-fighters">
                  {/* Left fighter */}
                  <div className="mock-fighter is-active">
                    <div className="mock-fighter-meta">
                      <span className="mock-badge">You</span>
                      <strong className="mock-name">Arthur</strong>
                      <span className="mock-class">Warrior</span>
                    </div>
                    <div className="mock-avatar">
                      <ClassAvatar characterClass="Warrior" size={54} />
                    </div>
                    <div className="mock-bar-group">
                      <div className="mock-bar-label">
                        <span>HP</span>
                        <span>110 / 130</span>
                      </div>
                      <div className="mock-track">
                        <div className="mock-fill hp" style={{ width: '84%' }} />
                      </div>
                    </div>
                    <div className="mock-bar-group">
                      <div className="mock-bar-label">
                        <span>Mana</span>
                        <span>30 / 30</span>
                      </div>
                      <div className="mock-track">
                        <div className="mock-fill mana" style={{ width: '100%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="mock-vs">VS</div>

                  {/* Right fighter */}
                  <div className="mock-fighter">
                    <div className="mock-fighter-meta">
                      <span className="mock-badge">Opponent</span>
                      <strong className="mock-name">Merlin</strong>
                      <span className="mock-class">Mage</span>
                    </div>
                    <div className="mock-avatar">
                      <ClassAvatar characterClass="Mage" isOpponent size={54} />
                    </div>
                    <div className="mock-bar-group">
                      <div className="mock-bar-label">
                        <span>HP</span>
                        <span>45 / 85</span>
                      </div>
                      <div className="mock-track">
                        <div className="mock-fill hp danger" style={{ width: '52%' }} />
                      </div>
                    </div>
                    <div className="mock-bar-group">
                      <div className="mock-bar-label">
                        <span>Mana</span>
                        <span>40 / 100</span>
                      </div>
                      <div className="mock-track">
                        <div className="mock-fill mana" style={{ width: '40%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mock Action Bar */}
                <div className="mock-actions">
                  <div className="mock-btn active">
                    <Sword size={12} strokeWidth={2} />
                    <span>Attack</span>
                  </div>
                  <div className="mock-btn">
                    <Zap size={12} strokeWidth={2} />
                    <span>Special move</span>
                  </div>
                  <div className="mock-btn">
                    <FlaskConical size={12} strokeWidth={2} />
                    <span>Use item</span>
                  </div>
                  <div className="mock-btn">
                    <SkipForward size={12} strokeWidth={2} />
                    <span>Skip turn</span>
                  </div>
                </div>

                {/* Mock Log Snippet */}
                <div className="mock-log">
                  <span className="mock-log-index">[1]</span>
                  <span className="mock-log-text">Arthur attacks Merlin dealing 22 damage.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
