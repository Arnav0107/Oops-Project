#pragma once
#include "Character.hpp"

/**
 * ============================================================================
 * OOP CONCEPT: INHERITANCE & POLYMORPHISM
 * ============================================================================
 * Warrior is a derived class specializing Character.
 * High durability and physical prowess.
 * Special Move: Berserk - strikes for double damage at the expense of self recoil.
 */
class Warrior : public Character {
public:
    explicit Warrior(const std::string& name);

    void attack(Character& target, std::vector<std::string>& log) override;
    void specialMove(Character& target, std::vector<std::string>& log) override;
};
