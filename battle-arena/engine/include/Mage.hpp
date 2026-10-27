#pragma once
#include "Character.hpp"

/**
 * ============================================================================
 * OOP CONCEPT: INHERITANCE & POLYMORPHISM
 * ============================================================================
 * Mage is a derived class specializing Character.
 * Reliant on mana reserves for devastating arcane spells.
 * Special Move: Fireball - massive magical devastation requiring high mana.
 */
class Mage : public Character {
public:
    explicit Mage(const std::string& name);

    void attack(Character& target, std::vector<std::string>& log) override;
    void specialMove(Character& target, std::vector<std::string>& log) override;
};
