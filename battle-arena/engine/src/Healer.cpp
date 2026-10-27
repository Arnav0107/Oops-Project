#include "../include/Healer.hpp"
#include <cstdlib>

Healer::Healer(const std::string& name)
    : Character(name, "Healer", 90, 80, 14, 8) {
    // Populate starter kit in template inventory
    inventory.addItem(std::make_shared<HealthPotion>("Health Potion", 30));
    inventory.addItem(std::make_shared<HealthPotion>("Health Potion", 30));
    inventory.addItem(std::make_shared<ManaPotion>("Mana Potion", 30));
}

void Healer::attack(Character& target, std::vector<std::string>& log) {
    if (!isAlive()) throw GameException("Cannot attack while dead!");

    int damage = attackPower + (std::rand() % 3);
    log.push_back("🦯 " + name + " strikes " + target.getName() + " with a consecrated staff!");
    target.takeDamage(damage, log);

    // Divine channel passively recovers 6 MP on hit
    restoreMana(6, log);
}

void Healer::specialMove(Character& target, std::vector<std::string>& log) {
    if (!isAlive()) throw GameException("Cannot use divine arts while dead!");

    const int MANA_COST = 25;
    if (mana < MANA_COST) {
        throw GameException("Not enough mana for Soul Drain! Required: " +
                            std::to_string(MANA_COST) + " MP, Available: " +
                            std::to_string(mana) + " MP.");
    }

    setMana(mana - MANA_COST);
    int siphonPower = 24 + (std::rand() % 5);

    log.push_back("⚜ [SPECIAL] " + name + " channels SOUL DRAIN against " +
                  target.getName() + " (-" + std::to_string(MANA_COST) + " MP)!");
    
    int actualDamageDealt = target.takeDamage(siphonPower, log);
    heal(actualDamageDealt, log);
}
