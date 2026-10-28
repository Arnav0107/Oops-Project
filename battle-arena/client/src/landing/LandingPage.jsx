import React from 'react';
import { ArrowRight } from 'lucide-react';
import LandingNav from './LandingNav';
import HeroSection from './HeroSection';
import ArchitectureSection from './ArchitectureSection';
import ConceptsSection from './ConceptsSection';
import CharactersSection from './CharactersSection';
import LandingFooter from './LandingFooter';

export default function LandingPage({ onPlayNow }) {
  const handleSeeHowItWorks = () => {
    document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      <LandingNav onPlayNow={onPlayNow} />
      <main>
        <HeroSection onPlayNow={onPlayNow} onSeeHowItWorks={handleSeeHowItWorks} />
        <ArchitectureSection />
        <ConceptsSection />
        <CharactersSection />
        <section className="landing-section cta-section">
          <div className="section-container cta-container">
            <h2 className="cta-headline">Ready to challenge an opponent?</h2>
            <button type="button" className="btn-primary" onClick={onPlayNow}>
              <span>Play now</span>
              <ArrowRight size={16} strokeWidth={2} />
            </button>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
