#pragma once
#include <vector>
#include <memory>
#include <stdexcept>
#include <iostream>
#include "GameException.hpp"
#include "nlohmann/json.hpp"

/**
 * ============================================================================
 * OOP CONCEPT: TEMPLATES (GENERIC PROGRAMMING)
 * ============================================================================
 * Inventory<T> is a generic container class that can manage any item type or pointer.
 * Demonstrates parameterization of types, bounds-checking, and operator overloading.
 */
template <typename T>
class Inventory {
private:
    std::vector<T> items;
    size_t capacity;

public:
    explicit Inventory(size_t cap = 6) : capacity(cap) {}

    void addItem(const T& item) {
        if (items.size() >= capacity) {
            throw GameException("Inventory is full!");
        }
        items.push_back(item);
    }

    void removeItem(size_t index) {
        if (index >= items.size()) {
            throw GameException("Invalid inventory slot index!");
        }
        items.erase(items.begin() + index);
    }

    T& getItem(size_t index) {
        if (index >= items.size()) {
            throw GameException("Invalid item index requested from inventory!");
        }
        return items[index];
    }

    const T& getItem(size_t index) const {
        if (index >= items.size()) {
            throw GameException("Invalid item index requested from inventory!");
        }
        return items[index];
    }

    /**
     * ========================================================================
     * OOP CONCEPT: OPERATOR OVERLOADING
     * ========================================================================
     * Subscript operator [] for intuitive array-style element access.
     */
    T& operator[](size_t index) {
        return getItem(index);
    }

    const T& operator[](size_t index) const {
        return getItem(index);
    }

    size_t size() const {
        return items.size();
    }

    bool empty() const {
        return items.empty();
    }

    void clear() {
        items.clear();
    }

    const std::vector<T>& getAll() const {
        return items;
    }

    nlohmann::json toJson() const {
        nlohmann::json arr = nlohmann::json::array();
        for (const auto& item : items) {
            if (item) {
                arr.push_back(item->toJson());
            }
        }
        return arr;
    }
};
