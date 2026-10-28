import React from 'react';

export default function ClassAvatar({
  characterClass = 'Warrior',
  isAttacking = false,
  isHit = false,
  isOpponent = false,
  size = 96
}) {
  const normClass = (characterClass || 'Warrior').toLowerCase();
  const flipStyle = isOpponent ? { transform: 'scaleX(-1)' } : {};

  const renderWarrior = () => (
    <svg viewBox="0 0 100 100" width={size} height={size} className="avatar-svg" style={flipStyle}>
      {/* Background shape */}
      <rect x="8" y="8" width="84" height="84" rx="12" fill="#24201d" stroke="#2f2a26" strokeWidth="2" />
      {/* Shoulders */}
      <path d="M 22 78 C 34 70 66 70 78 78 L 74 90 C 60 88 40 88 26 90 Z" fill="#2f2a26" stroke="#443e38" strokeWidth="1.5" />
      {/* Helmet base */}
      <path d="M 32 46 C 32 26 68 26 68 46 L 68 70 C 58 76 42 76 32 70 Z" fill="#35302c" stroke="#524a44" strokeWidth="2" />
      {/* Horns / Crest */}
      <path d="M 34 42 C 24 38 20 28 22 20 C 26 28 32 34 36 38 Z" fill="#e5532d" />
      <path d="M 66 42 C 76 38 80 28 78 20 C 74 28 68 34 64 38 Z" fill="#e5532d" />
      {/* Visor slit */}
      <rect x="36" y="50" width="28" height="6" rx="2" fill="#141210" />
      <line x1="40" y1="53" x2="60" y2="53" stroke="#e5532d" strokeWidth="2" strokeLinecap="round" />
      {/* Noseguard */}
      <line x1="50" y1="36" x2="50" y2="64" stroke="#524a44" strokeWidth="2" />
    </svg>
  );

  const renderMage = () => (
    <svg viewBox="0 0 100 100" width={size} height={size} className="avatar-svg" style={flipStyle}>
      <rect x="8" y="8" width="84" height="84" rx="12" fill="#24201d" stroke="#2f2a26" strokeWidth="2" />
      {/* Robe shoulders */}
      <path d="M 22 78 C 34 72 66 72 78 78 L 74 90 C 60 88 40 88 26 90 Z" fill="#2f2a26" stroke="#443e38" strokeWidth="1.5" />
      {/* Hood */}
      <path d="M 30 52 C 30 24 70 24 70 52 C 74 72 66 76 50 74 C 34 76 26 72 30 52 Z" fill="#35302c" stroke="#524a44" strokeWidth="2" />
      {/* Hat peak */}
      <path d="M 34 38 L 50 14 L 66 38 Z" fill="#2f2a26" stroke="#443e38" strokeWidth="1.5" />
      <circle cx="50" cy="14" r="3" fill="#e5532d" />
      {/* Shadowed face */}
      <ellipse cx="50" cy="54" rx="13" ry="9" fill="#141210" />
      {/* Eyes */}
      <circle cx="45" cy="54" r="2.5" fill="#5b8def" />
      <circle cx="55" cy="54" r="2.5" fill="#5b8def" />
    </svg>
  );

  const renderArcher = () => (
    <svg viewBox="0 0 100 100" width={size} height={size} className="avatar-svg" style={flipStyle}>
      <rect x="8" y="8" width="84" height="84" rx="12" fill="#24201d" stroke="#2f2a26" strokeWidth="2" />
      {/* Arrows on back */}
      <line x1="74" y1="20" x2="62" y2="48" stroke="#524a44" strokeWidth="2.5" />
      <polygon points="74,18 80,14 78,22" fill="#5aa469" />
      <polygon points="78,24 84,20 82,28" fill="#5aa469" />
      {/* Hood */}
      <path d="M 28 50 C 28 26 72 26 72 50 L 68 76 C 50 74 34 76 30 76 Z" fill="#35302c" stroke="#524a44" strokeWidth="2" />
      {/* Mask */}
      <path d="M 35 52 C 45 56 55 56 65 52 L 63 68 C 50 72 37 68 37 68 Z" fill="#24201d" stroke="#443e38" strokeWidth="1" />
      {/* Sharp eyes */}
      <ellipse cx="43" cy="48" rx="3.5" ry="2" fill="#5aa469" />
      <ellipse cx="57" cy="48" rx="3.5" ry="2" fill="#5aa469" />
      <circle cx="43" cy="48" r="1" fill="#ece7df" />
      <circle cx="57" cy="48" r="1" fill="#ece7df" />
    </svg>
  );

  const renderHealer = () => (
    <svg viewBox="0 0 100 100" width={size} height={size} className="avatar-svg" style={flipStyle}>
      <rect x="8" y="8" width="84" height="84" rx="12" fill="#24201d" stroke="#2f2a26" strokeWidth="2" />
      {/* Mantle */}
      <path d="M 22 78 C 34 72 66 72 78 78 L 74 90 C 60 88 40 88 26 90 Z" fill="#2f2a26" stroke="#443e38" strokeWidth="1.5" />
      {/* Circlet / cowl */}
      <path d="M 30 50 C 30 26 70 26 70 50 L 68 74 C 50 78 32 74 32 74 Z" fill="#35302c" stroke="#524a44" strokeWidth="2" />
      {/* Clean halo ring */}
      <ellipse cx="50" cy="22" rx="18" ry="5" fill="none" stroke="#5aa469" strokeWidth="2" />
      {/* Face */}
      <ellipse cx="50" cy="52" rx="13" ry="11" fill="#1c1917" />
      <circle cx="45" cy="51" r="2.2" fill="#ece7df" />
      <circle cx="55" cy="51" r="2.2" fill="#ece7df" />
      {/* Cross symbol on collar */}
      <line x1="50" y1="68" x2="50" y2="78" stroke="#5aa469" strokeWidth="2" />
      <line x1="45" y1="73" x2="55" y2="73" stroke="#5aa469" strokeWidth="2" />
    </svg>
  );

  return (
    <div
      className={`avatar-box ${normClass}-avatar ${isAttacking ? 'attacking-lunge' : ''} ${isHit ? 'hit-shake' : ''}`}
      aria-label={`${characterClass} illustration`}
    >
      {normClass === 'warrior' && renderWarrior()}
      {normClass === 'mage' && renderMage()}
      {normClass === 'archer' && renderArcher()}
      {normClass === 'healer' && renderHealer()}
    </div>
  );
}
