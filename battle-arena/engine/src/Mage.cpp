#include "../include/Mage.hpp"
#include <cstdlib>

Mage::Mage(const std::string& name)
    : Character(name, "Mage", 85, 100, 16, 6) {
    // Populate starter kit in template inventory
    inventory.addItem(std::make_shared<HealthPotion>("Health Potion", 30));
    inventory.addItem(std::make_shared<ManaPotion>("Mana Potion", 35));
    inventory.addItem(std::make_shared<ManaPotion>("Greater Mana Potion", 50));
}

void Mage::attack(Character& target, std::vector<std::string>& log) {
    if (!isAlive()) throw GameException("Cannot attack while dead!");

    if (mana >= 5) {
        setMana(mana - 5);
        int damage = attackPower + 4 + (std::rand() % 5);
        log.push_back("✨ " + name + " casts Arcane Bolt at " + target.getName() + " (-5 MP)!");
        target.takeDamage(damage, log);
    } else {
        int damage = attackPower / 2;
        log.push_back("🦯 " + name + " is low on mana and bonks " + target.getName() + " with a wooden staff!");
        target.takeDamage(damage, log);
    }
}

void Mage::specialMove(Character& target, std::vector<std::string>& log) {
    if (!isAlive()) throw GameException("Cannot cast spells while dead!");

    const int MANA_COST = 30;
    if (mana < MANA_COST) {
        throw GameException("Not enough mana for Fireball! Required: " +
                            std::to_string(MANA_COST) + " MP, Available: " +
                            std::to_string(mana) + " MP.");
    }

    setMana(mana - MANA_COST);
    int fireballDamage = 46 + (std::rand() % 12); // High burst spell

    log.push_back("🔥 [SPECIAL] " + name + " summons an infernal FIREBALL and launches it at " +
                  target.getName() + " (-" + std::to_string(MANA_COST) + " MP)!");
    target.takeDamage(fireballDamage, log);
}
