#pragma once
#include "Character.hpp"

/**
 * ============================================================================
 * OOP CONCEPT: INHERITANCE & POLYMORPHISM
 * ============================================================================
 * Healer is a derived class specializing Character.
 * Sustains itself through divine arts and siphons life force from foes.
 * Special Move: Soul Drain - leeches vitality from the enemy to heal the Healer.
 */
class Healer : public Character {
public:
    explicit Healer(const std::string& name);

    void attack(Character& target, std::vector<std::string>& log) override;
    void specialMove(Character& target, std::vector<std::string>& log) override;
};
