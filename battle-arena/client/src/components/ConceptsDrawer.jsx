/**
 * ConceptsDrawer.jsx
 * Presentation drawer/modal detailing the 8 Core OOP Concepts implemented in C++17.
 * Features exact code snippets from the codebase, file references, definitions,
 * and live demonstration status tags.
 */
import React from 'react';

export const OOP_CONCEPTS_DATA = [
  {
    id: 'abstraction',
    name: '1. Abstraction',
    definition: 'Hides internal implementation details and enforces a strict interface contract via pure virtual methods.',
    file: 'engine/include/Character.hpp',
    snippet: `// Abstract Base Class: cannot be instantiated directly
class Character {
public:
    virtual ~Character() = default;
    virtual void attack(Character& target, std::vector<std::string>& log) = 0;
    virtual void specialMove(Character& target, std::vector<std::string>& log) = 0;
};`
  },
  {
    id: 'encapsulation',
    name: '2. Encapsulation',
    definition: 'Restricts direct access to internal state; attributes are protected/private and modified only via validated getters and setters.',
    file: 'engine/src/Character.cpp',
    snippet: `void Character::setHealth(int h) {
    if (h < 0) health = 0;
    else if (h > maxHealth) health = maxHealth;
    else health = h; // Enforces boundaries [0, maxHealth]
}`
  },
  {
    id: 'inheritance',
    name: '3. Inheritance',
    definition: 'Subclasses inherit shared attributes and behaviors from base classes while specializing unique traits and gear.',
    file: 'engine/include/Warrior.hpp',
    snippet: `// Warrior specializes Character with high melee armor and Berserk rage
class Warrior : public Character {
public:
    explicit Warrior(const std::string& name);
    void attack(Character& target, std::vector<std::string>& log) override;
    void specialMove(Character& target, std::vector<std::string>& log) override;
};`
  },
  {
    id: 'polymorphism',
    name: '4. Polymorphism & Dynamic Dispatch',
    definition: 'Base pointers dynamically resolve and invoke overridden subclass methods at runtime via the virtual method table (vtable).',
    file: 'engine/src/Arena.cpp',
    snippet: `// Arena manages combatants polymorphically through base Character*
std::vector<Character*> players;
// Dynamic dispatch executes Mage::specialMove() or Warrior::specialMove()
actor.specialMove(target, battleLog);`
  },
  {
    id: 'operator_overloading',
    name: '5. Operator Overloading',
    definition: 'Extends standard C++ operators (+, <<, <, ==, []) to provide natural domain-specific semantics for custom objects.',
    file: 'engine/src/Item.cpp',
    snippet: `// HealthPotion + HealthPotion synthesizes a Super Health Potion!
HealthPotion HealthPotion::operator+(const HealthPotion& other) const {
    int combinedHeal = this->healAmount + other.healAmount + 15;
    return HealthPotion("Super Health Potion", combinedHeal);
}`
  },
  {
    id: 'templates',
    name: '6. Templates (Generic Programming)',
    definition: 'Parameterized container class enabling type-independent storage, safe indexing, and memory management for any item type.',
    file: 'engine/include/Inventory.hpp',
    snippet: `template <typename T>
class Inventory {
private:
    std::vector<T> items;
public:
    void addItem(const T& item);
    T& operator[](size_t index) { return items.at(index); }
};`
  },
  {
    id: 'static_members',
    name: '7. Static Members & Methods',
    definition: 'Class-level state shared across all instances to track global statistics without requiring a singleton.',
    file: 'engine/include/Character.hpp',
    snippet: `class Character {
protected:
    static int totalCharactersCreated;
public:
    static int getTotalCharactersCreated() {
        return totalCharactersCreated;
    }
};`
  },
  {
    id: 'exceptions',
    name: '8. Custom Exception Handling',
    definition: 'Domain-specific error hierarchy derived from std::exception to safely handle invalid turns or out-of-mana scenarios without crashing.',
    file: 'engine/include/GameException.hpp',
    snippet: `class GameException : public std::exception {
    std::string message;
public:
    explicit GameException(const std::string& msg) : message(msg) {}
    const char* what() const noexcept override { return message.c_str(); }
};`
  },
  {
    id: 'file_io',
    name: '9. File I/O & Persistence',
    definition: 'Archives full battle chronologies, combatant statistics, and winner state to persistent disk storage using standard C++ streams.',
    file: 'engine/src/Arena.cpp',
    snippet: `void Arena::saveMatch(const std::string& filename) const {
    std::ofstream outFile(filename);
    outFile << "BATTLE ARENA MATCH REPORT\\nWinner: "
            << players[winnerIndex]->getName() << "\\n";
    // Appends entire battle chronicle...
}`
  }
];

export default function ConceptsDrawer({ isOpen, onClose, demonstratedConcepts = [] }) {
  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <span className="tech-chip">COLLEGE OOP SHOWCASE</span>
            <h2 className="heading-font" style={{ marginTop: '0.3rem', fontSize: '1.4rem', color: 'var(--accent-gold)' }}>
              C++17 OOP Architectural Blueprint
            </h2>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Close drawer">
            ✕
          </button>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
          Every game mechanic, combat transaction, turn order, and rule calculation is executed directly by the C++ engine.
          Below is the concrete code implementing each requirement.
        </p>

        <div className="concepts-list">
          {OOP_CONCEPTS_DATA.map((concept) => {
            const isDemonstrated = demonstratedConcepts.includes(concept.id);
            return (
              <div key={concept.id} className={`concept-card ${isDemonstrated ? 'demonstrated' : ''}`}>
                <div className="concept-card-top">
                  <div className="concept-name">{concept.name}</div>
                  <div className={`concept-status ${isDemonstrated ? 'status-active' : ''}`}>
                    {isDemonstrated ? '✓ Demonstrated in Match' : 'Ready in Engine'}
                  </div>
                </div>

                <div className="concept-def">{concept.definition}</div>
                <div className="concept-file">
                  Source: <code>{concept.file}</code>
                </div>

                <pre className="concept-code">
                  <code>{concept.snippet}</code>
                </pre>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
            Return to Match
          </button>
        </div>
      </div>
    </div>
  );
}
