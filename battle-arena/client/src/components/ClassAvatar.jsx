/**
 * ClassAvatar.jsx
 * Procedural inline-SVG vector art portraits for Warrior, Mage, Archer, and Healer.
 * Provides idle floating/breathing animation and directional attack-lunging animations.
 * Eliminates any external image file dependencies for 100% offline reliability.
 */
import React from 'react';

export default function ClassAvatar({
  characterClass = 'Warrior',
  isAttacking = false,
  isHit = false,
  isOpponent = false,
  size = 100
}) {
  const normClass = (characterClass || 'Warrior').toLowerCase();

  // Directional flip for opponent facing left
  const flipStyle = isOpponent ? { transform: 'scaleX(-1)' } : {};

  const renderWarrior = () => (
    <svg viewBox="0 0 100 100" width={size} height={size} className="avatar-svg" style={flipStyle}>
      <defs>
        <radialGradient id="warriorGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="helmMetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* Aura */}
      <circle cx="50" cy="50" r="46" fill="url(#warriorGlow)" />
      
      {/* Shoulder Armor Plates */}
      <path d="M 20 75 Q 50 95 80 75 L 75 92 Q 50 99 25 92 Z" fill="#334155" stroke="#f59e0b" strokeWidth="1.5" />
      
      {/* Helmet Base */}
      <path d="M 30 45 Q 50 18 70 45 L 72 70 Q 50 82 28 70 Z" fill="url(#helmMetal)" stroke="#64748b" strokeWidth="2" />
      
      {/* Horns */}
      <path d="M 32 40 C 20 35 15 20 18 10 C 22 24 28 32 34 36 Z" fill="url(#goldTrim)" />
      <path d="M 68 40 C 80 35 85 20 82 10 C 78 24 72 32 66 36 Z" fill="url(#goldTrim)" />

      {/* Visor Slit */}
      <rect x="36" y="48" width="28" height="6" rx="3" fill="#0f172a" />
      <line x1="39" y1="51" x2="61" y2="51" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" className="visor-glow" />

      {/* Noseguard & Crest */}
      <path d="M 48 30 L 52 30 L 51 64 L 49 64 Z" fill="url(#goldTrim)" />
      <path d="M 40 22 Q 50 12 60 22 L 50 16 Z" fill="#ef4444" />
    </svg>
  );

  const renderMage = () => (
    <svg viewBox="0 0 100 100" width={size} height={size} className="avatar-svg" style={flipStyle}>
      <defs>
        <radialGradient id="mageGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="robeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6d28d9" />
          <stop offset="50%" stopColor="#4c1d95" />
          <stop offset="100%" stopColor="#2e1065" />
        </linearGradient>
      </defs>

      {/* Arcane Aura */}
      <circle cx="50" cy="50" r="46" fill="url(#mageGlow)" />

      {/* Robe Collar */}
      <path d="M 22 75 Q 50 90 78 75 L 72 94 Q 50 99 28 94 Z" fill="url(#robeGrad)" stroke="#c4b5fd" strokeWidth="1.5" />

      {/* Wizard Cowl / Hood */}
      <path d="M 28 55 Q 50 15 72 55 Q 78 75 68 80 Q 50 72 32 80 Q 22 75 28 55 Z" fill="#2e1065" stroke="#8b5cf6" strokeWidth="2" />

      {/* Pointed Cap Peak */}
      <path d="M 32 38 Q 48 10 52 6 Q 66 18 68 38 Z" fill="url(#robeGrad)" />
      <circle cx="52" cy="6" r="3" fill="#f59e0b" />

      {/* Shadowed Face & Glowing Arcane Eyes */}
      <ellipse cx="50" cy="54" rx="14" ry="10" fill="#09090b" />
      <circle cx="44" cy="53" r="2.8" fill="#38bdf8" className="mana-glow" />
      <circle cx="56" cy="53" r="2.8" fill="#38bdf8" className="mana-glow" />

      {/* Arcane Floating Rune Gem */}
      <polygon points="50,70 54,75 50,80 46,75" fill="#38bdf8" stroke="#fff" strokeWidth="0.8" />
    </svg>
  );

  const renderArcher = () => (
    <svg viewBox="0 0 100 100" width={size} height={size} className="avatar-svg" style={flipStyle}>
      <defs>
        <radialGradient id="archerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="leatherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#065f46" />
          <stop offset="100%" stopColor="#022c22" />
        </linearGradient>
      </defs>

      {/* Aura */}
      <circle cx="50" cy="50" r="46" fill="url(#archerGlow)" />

      {/* Quiver & Arrow Feathers on back */}
      <line x1="72" y1="20" x2="60" y2="55" stroke="#f59e0b" strokeWidth="2.5" />
      <polygon points="72,20 78,16 75,25" fill="#10b981" />
      <polygon points="76,26 82,22 79,31" fill="#10b981" />

      {/* Ranger Hood */}
      <path d="M 26 50 Q 50 16 74 50 L 70 78 Q 50 74 30 78 Z" fill="url(#leatherGrad)" stroke="#10b981" strokeWidth="2" />

      {/* Half Mask */}
      <path d="M 34 50 Q 50 56 66 50 L 64 68 Q 50 74 36 68 Z" fill="#064e3b" />

      {/* Piercing Hunter Eyes */}
      <ellipse cx="43" cy="46" rx="3.5" ry="2" fill="#34d399" />
      <ellipse cx="57" cy="46" rx="3.5" ry="2" fill="#34d399" />
      <circle cx="43" cy="46" r="1.2" fill="#fff" />
      <circle cx="57" cy="46" r="1.2" fill="#fff" />

      {/* Forehead Leather Headband with Leaf Emblem */}
      <path d="M 32 38 Q 50 42 68 38 L 68 42 Q 50 46 32 42 Z" fill="#78350f" />
      <circle cx="50" cy="41" r="2.5" fill="#10b981" />
    </svg>
  );

  const renderHealer = () => (
    <svg viewBox="0 0 100 100" width={size} height={size} className="avatar-svg" style={flipStyle}>
      <defs>
        <radialGradient id="healerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="divineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="50%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* Divine Radiant Aura */}
      <circle cx="50" cy="50" r="46" fill="url(#healerGlow)" />

      {/* Angelic Halo */}
      <ellipse cx="50" cy="18" rx="20" ry="6" fill="none" stroke="url(#divineGrad)" strokeWidth="3" className="halo-glow" />

      {/* Cleric Mantle */}
      <path d="M 22 75 Q 50 90 78 75 L 72 94 Q 50 98 28 94 Z" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />

      {/* Consecrated Cowl */}
      <path d="M 30 50 Q 50 24 70 50 L 68 76 Q 50 82 32 76 Z" fill="#0f172a" stroke="#fbbf24" strokeWidth="2" />

      {/* Serene Face & Divine Eyes */}
      <ellipse cx="50" cy="54" rx="14" ry="12" fill="#1e293b" />
      <circle cx="44" cy="52" r="2.5" fill="#fbbf24" />
      <circle cx="56" cy="52" r="2.5" fill="#fbbf24" />

      {/* Caduceus / Sun Sigil on Robe */}
      <line x1="50" y1="68" x2="50" y2="82" stroke="#fbbf24" strokeWidth="2" />
      <line x1="45" y1="73" x2="55" y2="73" stroke="#fbbf24" strokeWidth="2" />
      <circle cx="50" cy="73" r="1.5" fill="#fff" />
    </svg>
  );

  return (
    <div
      className={`avatar-container ${normClass}-avatar ${isAttacking ? 'attacking-lunge' : 'idle-float'} ${isHit ? 'hit-shake' : ''}`}
      aria-label={`${characterClass} Avatar`}
    >
      {normClass === 'warrior' && renderWarrior()}
      {normClass === 'mage' && renderMage()}
      {normClass === 'archer' && renderArcher()}
      {normClass === 'healer' && renderHealer()}
    </div>
  );
}
