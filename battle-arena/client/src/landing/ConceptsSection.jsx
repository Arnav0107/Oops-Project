import React from 'react';

const CONCEPTS = [
  {
    name: 'Abstraction',
    file: 'Character.hpp',
    definition: 'Character is an abstract base class with pure virtual methods that define the combat contract without dictating implementation details.',
    code: `virtual void attack(Character& target, std::vector<std::string>& log) = 0;
virtual void specialMove(Character& target, std::vector<std::string>& log) = 0;`
  },
  {
    name: 'Encapsulation',
    file: 'Character.hpp',
    definition: 'Internal attributes like health and mana are protected from direct modification, accessible only through bounded getters and setters.',
    code: `protected:
    std::string name;
    int health;
    int maxHealth;
public:
    int getHealth() const { return health; }
    void setHealth(int h);`
  },
  {
    name: 'Inheritance',
    file: 'Warrior.hpp',
    definition: 'Concrete classes like Warrior derive from the Character base class, inheriting core stats and behaviors while specializing their capabilities.',
    code: `class Warrior : public Character {
public:
    explicit Warrior(const std::string& name);

    void attack(Character& target, std::vector<std::string>& log) override;
    void specialMove(Character& target, std::vector<std::string>& log) override;
};`
  },
  {
    name: 'Polymorphism',
    file: 'Arena.cpp',
    definition: 'Actions are dispatched at runtime through base class references, executing the derived class method according to dynamic type.',
    code: `if (action == "attack") {
    actor.attack(target, battleLog);
} else if (action == "special") {
    actor.specialMove(target, battleLog);
}`
  },
  {
    name: 'Operator overloading',
    file: 'Item.cpp',
    definition: 'The addition operator is overloaded on HealthPotion to combine two individual potions into an upgraded super potion.',
    code: `HealthPotion HealthPotion::operator+(const HealthPotion& other) const {
    int combinedHeal = this->healAmount + other.healAmount + 15; // Synergy bonus
    return HealthPotion("Super Health Potion", combinedHeal);
}`
  },
  {
    name: 'Templates',
    file: 'Inventory.hpp',
    definition: 'Inventory is implemented as a generic template container supporting type-safe item storage, slot limits, and element retrieval.',
    code: `template <typename T>
class Inventory {
private:
    std::vector<T> items;
    size_t capacity;
public:
    explicit Inventory(size_t cap = 6) : capacity(cap) {}
    void addItem(const T& item) { ... }
};`
  },
  {
    name: 'Exception handling',
    file: 'Mage.cpp',
    definition: 'Custom GameException classes guard against invalid gameplay actions such as casting spells without adequate mana or acting out of turn.',
    code: `const int MANA_COST = 30;
if (mana < MANA_COST) {
    throw GameException("Not enough mana for Fireball! Required: " +
                        std::to_string(MANA_COST) + " MP, Available: " +
                        std::to_string(mana) + " MP.");
}`
  },
  {
    name: 'File handling',
    file: 'Arena.cpp',
    definition: 'Match statistics and combat logs are formatted and written out to persistent disk storage using standard C++ file streams.',
    code: `void Arena::saveMatch(const std::string& filename) const {
    std::ofstream outFile(filename);
    if (!outFile.is_open()) {
        throw GameException("Failed to open file for saving: " + filename);
    }`
  }
];

export default function ConceptsSection() {
  return (
    <section id="concepts" className="landing-section concepts-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Object-oriented concepts used in the engine</h2>
          <p className="section-desc">
            The C++ game engine applies core object-oriented principles to model combat mechanics, character behaviors, and state persistence.
          </p>
        </div>

        <div className="concepts-grid">
          {CONCEPTS.map((c) => (
            <div key={c.name} className="concept-card">
              <div className="concept-header">
                <h3 className="concept-name">{c.name}</h3>
                <span className="concept-where">Where: {c.file}</span>
              </div>
              <p className="concept-def">{c.definition}</p>
              <div className="concept-code-block">
                <pre>
                  <code>{c.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
