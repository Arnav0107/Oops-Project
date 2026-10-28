export const CHARACTER_CLASSES = [
  {
    id: 'Warrior',
    name: 'Warrior',
    role: 'High health melee fighter with heavy strikes and recoil',
    stats: {
      health: 130,
      mana: 30,
      attackPower: 22,
      defense: 12
    },
    specialName: 'Berserk',
    specialCost: '0 Mana',
    specialDesc: 'Deals heavy physical damage, but suffers 25% recoil damage.',
    starterItems: '2x Health Potion, 1x Battle Axe (+6 Attack)'
  },
  {
    id: 'Mage',
    name: 'Mage',
    role: 'High damage spellcaster with powerful burst spells',
    stats: {
      health: 85,
      mana: 100,
      attackPower: 16,
      defense: 6
    },
    specialName: 'Fireball',
    specialCost: '30 Mana',
    specialDesc: 'Summons a burst of flame dealing 46–58 damage. Costs 30 Mana.',
    starterItems: '1x Health Potion, 2x Mana Potion'
  },
  {
    id: 'Archer',
    name: 'Archer',
    role: 'Ranged marksman with rapid multi-hit strikes',
    stats: {
      health: 95,
      mana: 50,
      attackPower: 20,
      defense: 8
    },
    specialName: 'Multi-shot',
    specialCost: '20 Mana',
    specialDesc: 'Fires 3 rapid arrows in sequence. Costs 20 Mana.',
    starterItems: '1x Health Potion, 1x Mana Potion, 1x Armor (+5 Defense)'
  },
  {
    id: 'Healer',
    name: 'Healer',
    role: 'Support combatant that steals enemy health to restore self',
    stats: {
      health: 90,
      mana: 80,
      attackPower: 14,
      defense: 8
    },
    specialName: 'Soul Drain',
    specialCost: '25 Mana',
    specialDesc: 'Drains enemy vitality to heal self for the damage dealt. Costs 25 Mana.',
    starterItems: '2x Health Potion, 1x Mana Potion'
  }
];
