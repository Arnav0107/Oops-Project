#pragma once
#include <string>
#include <vector>
#include <memory>
#include <iostream>
#include "Item.hpp"
#include "Inventory.hpp"
#include "GameException.hpp"
#include "nlohmann/json.hpp"

/**
 * ============================================================================
 * OOP CONCEPT: ABSTRACTION & ENCAPSULATION
 * ============================================================================
 * Character is an abstract base class representing any combatant in the Arena.
 * Internal attributes (health, mana, stats, inventory) are protected/private,
 * accessible strictly through controlled public getters/setters.
 */
class Character {
protected:
    std::string name;
    std::string characterClass;
    int health;
    int maxHealth;
    int mana;
    int maxMana;
    int attackPower;
    int defense;

    // Composition: Each Character owns a generic template Inventory of Items
    Inventory<std::shared_ptr<Item>> inventory;

    /**
     * ========================================================================
     * OOP CONCEPT: STATIC MEMBERS
     * ========================================================================
     * Tracks the cumulative count of Character instances created throughout
     * the program lifecycle.
     */
    static int totalCharactersCreated;

public:
    Character(const std::string& name, const std::string& characterClass,
              int maxHp, int maxMp, int atk, int def);
    virtual ~Character();

    // Static member function
    static int getTotalCharactersCreated() {
        return totalCharactersCreated;
    }

    // Encapsulation: Getters and Setters with domain logic / boundaries
    std::string getName() const { return name; }
    std::string getCharacterClass() const { return characterClass; }
    
    int getHealth() const { return health; }
    void setHealth(int h);

    int getMaxHealth() const { return maxHealth; }
    void setMaxHealth(int mh);

    int getMana() const { return mana; }
    void setMana(int m);

    int getMaxMana() const { return maxMana; }
    void setMaxMana(int mm);

    int getAttackPower() const { return attackPower; }
    void setAttackPower(int atk) { attackPower = (atk > 0) ? atk : 1; }

    int getDefense() const { return defense; }
    void setDefense(int def) { defense = (def >= 0) ? def : 0; }

    bool isAlive() const { return health > 0; }

    Inventory<std::shared_ptr<Item>>& getInventory() { return inventory; }
    const Inventory<std::shared_ptr<Item>>& getInventory() const { return inventory; }

    /**
     * ========================================================================
     * OOP CONCEPT: PURE VIRTUAL FUNCTIONS (POLYMORPHISM / RUNTIME DISPATCH)
     * ========================================================================
     * Pure virtual methods that must be overridden by concrete derived classes.
     */
    virtual void attack(Character& target, std::vector<std::string>& log) = 0;
    virtual void specialMove(Character& target, std::vector<std::string>& log) = 0;

    /**
     * ========================================================================
     * OOP CONCEPT: VIRTUAL METHODS
     * ========================================================================
     * Base implementation provided, can be customized or overridden by subclasses.
     */
    virtual int takeDamage(int rawDamage, std::vector<std::string>& log);
    virtual void heal(int amount, std::vector<std::string>& log);
    virtual void restoreMana(int amount, std::vector<std::string>& log);
    virtual void useItem(size_t itemIndex, std::vector<std::string>& log);
    virtual bool combineHealthPotions(std::vector<std::string>& log);

    virtual nlohmann::json toJson() const;
    virtual void displayStats() const;

    /**
     * ========================================================================
     * OOP CONCEPT: OPERATOR OVERLOADING
     * ========================================================================
     * 1. operator< compares characters by current health.
     * 2. operator== checks health parity.
     * 3. operator<< prints formatted character status directly to any stream.
     */
    bool operator<(const Character& other) const {
        return this->health < other.health;
    }

    bool operator==(const Character& other) const {
        return this->health == other.health;
    }

    friend std::ostream& operator<<(std::ostream& os, const Character& character);
};
