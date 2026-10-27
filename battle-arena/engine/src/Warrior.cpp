#include "../include/Warrior.hpp"
#include <cstdlib>

Warrior::Warrior(const std::string& name)
    : Character(name, "Warrior", 130, 30, 22, 12) {
    // Populate starter kit in template inventory
    inventory.addItem(std::make_shared<HealthPotion>("Health Potion", 35));
    inventory.addItem(std::make_shared<HealthPotion>("Health Potion", 35));
    inventory.addItem(std::make_shared<Weapon>("Battle Axe", 6));
}

void Warrior::attack(Character& target, std::vector<std::string>& log) {
    if (!isAlive()) throw GameException("Cannot attack while dead!");
    int variance = (std::rand() % 5) - 2; // -2 to +2
    int damage = attackPower + variance;
    log.push_back("⚔ " + name + " swings a brutal Heavy Strike at " + target.getName() + "!");
    target.takeDamage(damage, log);
}

void Warrior::specialMove(Character& target, std::vector<std::string>& log) {
    if (!isAlive()) throw GameException("Cannot use special move while dead!");
    
    int berserkDamage = (attackPower * 2) + (std::rand() % 6);
    int recoil = berserkDamage / 4;
    if (recoil < 4) recoil = 4;

    log.push_back("💥 [SPECIAL] " + name + " enters BERSERK RAGE and unleashes a crushing blow on " +
                  target.getName() + " for " + std::to_string(berserkDamage) + " raw damage!");
    target.takeDamage(berserkDamage, log);

    // Apply self recoil
    log.push_back("🩸 " + name + " suffers " + std::to_string(recoil) + " recoil damage from the exertion!");
    setHealth(health - recoil);
    if (!isAlive()) {
        log.push_back("☠ " + name + " collapsed from Berserk recoil!");
    }
}
