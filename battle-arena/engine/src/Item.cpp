#include "../include/Item.hpp"
#include "../include/Character.hpp"
#include "../include/GameException.hpp"
#include <iostream>

// ============================================================================
// ITEM BASE CLASS
// ============================================================================
Item::Item(const std::string& name, const std::string& type, const std::string& description)
    : name(name), type(type), description(description) {}

nlohmann::json Item::toJson() const {
    return {
        {"name", name},
        {"type", type},
        {"description", description}
    };
}

/**
 * OOP CONCEPT: OPERATOR OVERLOADING
 * Overloading operator<< to output item information directly to std::ostream
 */
std::ostream& operator<<(std::ostream& os, const Item& item) {
    os << "[" << item.name << " (" << item.type << ") - " << item.description << "]";
    return os;
}

// ============================================================================
// HEALTH POTION
// ============================================================================
HealthPotion::HealthPotion(const std::string& name, int healAmount)
    : Item(name, "health_potion", "Restores " + std::to_string(healAmount) + " HP"),
      healAmount(healAmount) {}

void HealthPotion::use(Character& target) {
    std::vector<std::string> dummyLog;
    target.heal(healAmount, dummyLog);
}

/**
 * OOP CONCEPT: OPERATOR OVERLOADING
 * Combining two HealthPotions using operator+ creates an upgraded SuperPotion!
 */
HealthPotion HealthPotion::operator+(const HealthPotion& other) const {
    int combinedHeal = this->healAmount + other.healAmount + 15; // Synergy bonus
    return HealthPotion("Super Health Potion", combinedHeal);
}

nlohmann::json HealthPotion::toJson() const {
    nlohmann::json j = Item::toJson();
    j["healAmount"] = healAmount;
    return j;
}

// ============================================================================
// MANA POTION
// ============================================================================
ManaPotion::ManaPotion(const std::string& name, int manaAmount)
    : Item(name, "mana_potion", "Restores " + std::to_string(manaAmount) + " MP"),
      manaAmount(manaAmount) {}

void ManaPotion::use(Character& target) {
    std::vector<std::string> dummyLog;
    target.restoreMana(manaAmount, dummyLog);
}

nlohmann::json ManaPotion::toJson() const {
    nlohmann::json j = Item::toJson();
    j["manaAmount"] = manaAmount;
    return j;
}

// ============================================================================
// WEAPON
// ============================================================================
Weapon::Weapon(const std::string& name, int attackBonus)
    : Item(name, "weapon", "Permanently increases Attack Power by +" + std::to_string(attackBonus)),
      attackBonus(attackBonus) {}

void Weapon::use(Character& target) {
    target.setAttackPower(target.getAttackPower() + attackBonus);
}

nlohmann::json Weapon::toJson() const {
    nlohmann::json j = Item::toJson();
    j["attackBonus"] = attackBonus;
    return j;
}

// ============================================================================
// ARMOR
// ============================================================================
Armor::Armor(const std::string& name, int defenseBonus)
    : Item(name, "armor", "Permanently increases Defense by +" + std::to_string(defenseBonus)),
      defenseBonus(defenseBonus) {}

void Armor::use(Character& target) {
    target.setDefense(target.getDefense() + defenseBonus);
}

nlohmann::json Armor::toJson() const {
    nlohmann::json j = Item::toJson();
    j["defenseBonus"] = defenseBonus;
    return j;
}
