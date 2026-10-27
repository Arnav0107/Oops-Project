#include "../include/Character.hpp"
#include <iomanip>
#include <sstream>

/**
 * OOP CONCEPT: STATIC MEMBERS
 * Definition and initialization of the static member counter.
 */
int Character::totalCharactersCreated = 0;

Character::Character(const std::string& name, const std::string& characterClass,
                     int maxHp, int maxMp, int atk, int def)
    : name(name), characterClass(characterClass),
      health(maxHp), maxHealth(maxHp),
      mana(maxMp), maxMana(maxMp),
      attackPower(atk), defense(def),
      inventory(6) {
    // Increment the static instance counter
    totalCharactersCreated++;
}

Character::~Character() {
    // Virtual destructor guarantees proper cleanup of derived class sub-objects
}

/**
 * OOP CONCEPT: ENCAPSULATION
 * Setter validation ensures internal invariants (e.g. 0 <= health <= maxHealth) are preserved.
 */
void Character::setHealth(int h) {
    if (h < 0) health = 0;
    else if (h > maxHealth) health = maxHealth;
    else health = h;
}

void Character::setMaxHealth(int mh) {
    maxHealth = (mh > 1) ? mh : 1;
    if (health > maxHealth) health = maxHealth;
}

void Character::setMana(int m) {
    if (m < 0) mana = 0;
    else if (m > maxMana) mana = maxMana;
    else mana = m;
}

void Character::setMaxMana(int mm) {
    maxMana = (mm >= 0) ? mm : 0;
    if (mana > maxMana) mana = maxMana;
}

/**
 * OOP CONCEPT: POLYMORPHISM / VIRTUAL METHOD
 * Calculates net damage by factoring in physical defense mitigation.
 */
int Character::takeDamage(int rawDamage, std::vector<std::string>& log) {
    int reduction = defense / 2;
    int netDamage = rawDamage - reduction;
    if (netDamage < 2) netDamage = 2; // Minimum chip damage

    setHealth(health - netDamage);
    log.push_back(name + " takes " + std::to_string(netDamage) + " damage (reduced by " +
                  std::to_string(reduction) + " defense)! Current HP: " +
                  std::to_string(health) + "/" + std::to_string(maxHealth));

    if (!isAlive()) {
        log.push_back("☠ " + name + " has succumbed to their injuries!");
    }
    return netDamage;
}

void Character::heal(int amount, std::vector<std::string>& log) {
    if (!isAlive()) {
        throw GameException(name + " cannot be healed because they are dead!");
    }
    int prev = health;
    setHealth(health + amount);
    int actualHeal = health - prev;
    log.push_back("✨ " + name + " recovers " + std::to_string(actualHeal) +
                  " HP! Current HP: " + std::to_string(health) + "/" + std::to_string(maxHealth));
}

void Character::restoreMana(int amount, std::vector<std::string>& log) {
    int prev = mana;
    setMana(mana + amount);
    int actualMana = mana - prev;
    log.push_back("🔷 " + name + " restores " + std::to_string(actualMana) +
                  " MP! Current MP: " + std::to_string(mana) + "/" + std::to_string(maxMana));
}

/**
 * OOP CONCEPT: EXCEPTION HANDLING & GENERIC INVENTORY USAGE
 */
void Character::useItem(size_t itemIndex, std::vector<std::string>& log) {
    if (!isAlive()) {
        throw GameException("Cannot use items while defeated!");
    }
    if (inventory.empty()) {
        throw GameException("Inventory is completely empty!");
    }
    if (itemIndex >= inventory.size()) {
        throw GameException("Invalid item slot selection!");
    }

    auto item = inventory[itemIndex];
    if (!item) {
        throw GameException("Selected item slot is invalid!");
    }

    log.push_back(name + " uses " + item->getName() + "!");
    
    // Virtual dispatch calls the correct Item derived use() method
    item->use(*this);

    // Remove the consumed item from template inventory
    inventory.removeItem(itemIndex);
}

/**
 * OOP CONCEPT: OPERATOR OVERLOADING IN PRACTICE
 * Searches for two HealthPotions and merges them into a SuperPotion using operator+!
 */
bool Character::combineHealthPotions(std::vector<std::string>& log) {
    int firstIdx = -1;
    int secondIdx = -1;

    for (size_t i = 0; i < inventory.size(); ++i) {
        auto hp = std::dynamic_pointer_cast<HealthPotion>(inventory[i]);
        if (hp) {
            if (firstIdx == -1) {
                firstIdx = static_cast<int>(i);
            } else {
                secondIdx = static_cast<int>(i);
                break;
            }
        }
    }

    if (firstIdx == -1 || secondIdx == -1) {
        throw GameException("Need at least 2 Health Potions in inventory to combine!");
    }

    auto p1 = std::dynamic_pointer_cast<HealthPotion>(inventory[firstIdx]);
    auto p2 = std::dynamic_pointer_cast<HealthPotion>(inventory[secondIdx]);

    // Invoke overloaded operator+
    HealthPotion superPot = (*p1) + (*p2);

    // Remove in reverse index order
    inventory.removeItem(static_cast<size_t>(secondIdx));
    inventory.removeItem(static_cast<size_t>(firstIdx));

    // Add new super potion
    inventory.addItem(std::make_shared<HealthPotion>(superPot));

    log.push_back("🧪 " + name + " merged two Health Potions via operator+ into a " +
                  superPot.getName() + " (+" + std::to_string(superPot.getHealAmount()) + " HP)!");
    return true;
}

nlohmann::json Character::toJson() const {
    return {
        {"name", name},
        {"class", characterClass},
        {"health", health},
        {"maxHealth", maxHealth},
        {"mana", mana},
        {"maxMana", maxMana},
        {"attackPower", attackPower},
        {"defense", defense},
        {"inventory", inventory.toJson()}
    };
}

void Character::displayStats() const {
    std::cout << *this << std::endl;
}

/**
 * OOP CONCEPT: OPERATOR OVERLOADING
 * Overloading operator<< for Character formatting
 */
std::ostream& operator<<(std::ostream& os, const Character& character) {
    os << "[" << character.characterClass << "] " << character.name
       << " | HP: " << character.health << "/" << character.maxHealth
       << " | MP: " << character.mana << "/" << character.maxMana
       << " | ATK: " << character.attackPower
       << " | DEF: " << character.defense;
    return os;
}
