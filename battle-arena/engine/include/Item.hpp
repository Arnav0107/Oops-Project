#pragma once
#include <string>
#include <iostream>
#include <memory>
#include "nlohmann/json.hpp"

// Forward declaration of Character to avoid circular dependency
class Character;

/**
 * ============================================================================
 * OOP CONCEPT: ABSTRACTION & INHERITANCE
 * ============================================================================
 * Item is an abstract base class defining the contract for all usable items.
 * Pure virtual function use() enforces specific behaviour in derived classes.
 */
class Item {
protected:
    std::string name;
    std::string type;        // "health_potion", "mana_potion", "weapon", "armor"
    std::string description;

public:
    Item(const std::string& name, const std::string& type, const std::string& description);
    virtual ~Item() = default;

    // Pure virtual method making Item an abstract class
    virtual void use(Character& target) = 0;

    // Virtual helper methods
    virtual std::string getName() const { return name; }
    virtual std::string getType() const { return type; }
    virtual std::string getDescription() const { return description; }
    virtual nlohmann::json toJson() const;

    /**
     * ========================================================================
     * OOP CONCEPT: OPERATOR OVERLOADING
     * ========================================================================
     * Overloading operator<< for stream insertion to print Item details cleanly.
     */
    friend std::ostream& operator<<(std::ostream& os, const Item& item);
};

/**
 * Derived Class: HealthPotion
 * Restores HP to the character.
 */
class HealthPotion : public Item {
private:
    int healAmount;

public:
    HealthPotion(const std::string& name = "Health Potion", int healAmount = 35);
    void use(Character& target) override;
    int getHealAmount() const { return healAmount; }

    /**
     * ========================================================================
     * OOP CONCEPT: OPERATOR OVERLOADING
     * ========================================================================
     * HealthPotion + HealthPotion = SuperPotion (combined and boosted healing!)
     */
    HealthPotion operator+(const HealthPotion& other) const;

    nlohmann::json toJson() const override;
};

/**
 * Derived Class: ManaPotion
 * Restores MP to the character.
 */
class ManaPotion : public Item {
private:
    int manaAmount;

public:
    ManaPotion(const std::string& name = "Mana Potion", int manaAmount = 30);
    void use(Character& target) override;
    int getManaAmount() const { return manaAmount; }
    nlohmann::json toJson() const override;
};

/**
 * Derived Class: Weapon
 * Permanently buffs the character's attack power.
 */
class Weapon : public Item {
private:
    int attackBonus;

public:
    Weapon(const std::string& name = "Iron Broadsword", int attackBonus = 8);
    void use(Character& target) override;
    int getAttackBonus() const { return attackBonus; }
    nlohmann::json toJson() const override;
};

/**
 * Derived Class: Armor
 * Permanently buffs the character's defense.
 */
class Armor : public Item {
private:
    int defenseBonus;

public:
    Armor(const std::string& name = "Steel Plate Armor", int defenseBonus = 6);
    void use(Character& target) override;
    int getDefenseBonus() const { return defenseBonus; }
    nlohmann::json toJson() const override;
};
