#include "../include/Archer.hpp"
#include <cstdlib>

Archer::Archer(const std::string& name)
    : Character(name, "Archer", 95, 50, 20, 8) {
    // Populate starter kit in template inventory
    inventory.addItem(std::make_shared<HealthPotion>("Health Potion", 30));
    inventory.addItem(std::make_shared<ManaPotion>("Mana Potion", 25));
    inventory.addItem(std::make_shared<Armor>("Leather Bracers", 5));
}

void Archer::attack(Character& target, std::vector<std::string>& log) {
    if (!isAlive()) throw GameException("Cannot attack while dead!");

    // 35% chance of critical strike
    bool isCrit = (std::rand() % 100) < 35;
    int damage = attackPower + (std::rand() % 4);

    if (isCrit) {
        damage = static_cast<int>(damage * 1.85);
        log.push_back("🎯 CRITICAL HIT! " + name + " snipes a vital spot on " + target.getName() + "!");
    } else {
        log.push_back("🏹 " + name + " fires a swift arrow at " + target.getName() + ".");
    }

    target.takeDamage(damage, log);
}

void Archer::specialMove(Character& target, std::vector<std::string>& log) {
    if (!isAlive()) throw GameException("Cannot use special move while dead!");

    const int MANA_COST = 20;
    if (mana < MANA_COST) {
        throw GameException("Not enough mana for Multi-shot! Required: " +
                            std::to_string(MANA_COST) + " MP, Available: " +
                            std::to_string(mana) + " MP.");
    }

    setMana(mana - MANA_COST);
    log.push_back("🏹🏹🏹 [SPECIAL] " + name + " nocks three arrows and fires MULTI-SHOT at " +
                  target.getName() + " (-" + std::to_string(MANA_COST) + " MP)!");

    // Fires 3 consecutive arrows
    for (int i = 1; i <= 3; ++i) {
        int arrowDamage = static_cast<int>(attackPower * 0.65) + (std::rand() % 4);
        log.push_back("-> Arrow #" + std::to_string(i) + " hits:");
        target.takeDamage(arrowDamage, log);
        if (!target.isAlive()) break;
    }
}
