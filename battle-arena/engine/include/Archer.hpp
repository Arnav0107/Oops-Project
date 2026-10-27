#pragma once
#include "Character.hpp"

/**
 * ============================================================================
 * OOP CONCEPT: INHERITANCE & POLYMORPHISM
 * ============================================================================
 * Archer is a derived class specializing Character.
 * High precision, critical-hit chance on basic shots.
 * Special Move: Multi-shot - launches 3 rapid arrows in sequence.
 */
class Archer : public Character {
public:
    explicit Archer(const std::string& name);

    void attack(Character& target, std::vector<std::string>& log) override;
    void specialMove(Character& target, std::vector<std::string>& log) override;
};
