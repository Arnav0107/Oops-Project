import React from 'react';
import ClassAvatar from '../components/ClassAvatar';
import { CHARACTER_CLASSES } from '../data/characters';

export default function CharactersSection() {
  return (
    <section id="characters" className="landing-section characters-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Characters</h2>
          <p className="section-desc">
            Four combat classes with distinct attributes and playstyles.
          </p>
        </div>

        <div className="characters-grid">
          {CHARACTER_CLASSES.map((cls) => (
            <div key={cls.id} className="character-preview-card">
              <div className="preview-avatar">
                <ClassAvatar characterClass={cls.id} size={76} />
              </div>
              <h3 className="preview-name">{cls.name}</h3>
              <p className="preview-role">{cls.role}</p>

              <div className="preview-stats">
                <div className="preview-stat-row">
                  <span className="pstat-label">HP</span>
                  <span className="pstat-val">{cls.stats.health}</span>
                </div>
                <div className="preview-stat-row">
                  <span className="pstat-label">Mana</span>
                  <span className="pstat-val">{cls.stats.mana}</span>
                </div>
                <div className="preview-stat-row">
                  <span className="pstat-label">Attack</span>
                  <span className="pstat-val">{cls.stats.attackPower}</span>
                </div>
                <div className="preview-stat-row">
                  <span className="pstat-label">Defense</span>
                  <span className="pstat-val">{cls.stats.defense}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
