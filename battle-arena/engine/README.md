# Battle Arena C++ Engine (C++17)

A fully object-oriented game engine written in C++17 implementing the core mechanics and rule enforcement for the two-player Battle Arena.

## OOP Concepts Demonstrated

| Concept | File / Implementation | Description |
| :--- | :--- | :--- |
| **Abstraction** | `include/Character.hpp`, `include/Item.hpp` | Abstract base classes with pure virtual methods (`attack`, `specialMove`, `use`). |
| **Inheritance** | `Warrior.hpp`, `Mage.hpp`, `Archer.hpp`, `Healer.hpp`, `Item.hpp` | Concrete character archetypes and item types deriving from base classes. |
| **Polymorphism** | `Arena.hpp` (`std::vector<Character*>`) | Dynamic dispatch calling overridden methods at runtime via base pointers. |
| **Encapsulation** | `Character.hpp`, `Character.cpp` | Protected fields with guarded public getters and setters (e.g., HP/MP boundaries). |
| **Operator Overloading** | `Item.hpp`, `Character.hpp` | `+` combines `HealthPotion` into `SuperPotion`; `<<` formats character/item display; `<` and `==` compare characters by health. |
| **Templates** | `include/Inventory.hpp` | Generic `Inventory<T>` template container with bounds checking and index operator `[]`. |
| **Static Members** | `Character.hpp` | `Character::totalCharactersCreated` tracks the cumulative number of fighter instances. |
| **Custom Exceptions** | `include/GameException.hpp` | Inherits from `std::exception` to handle rule violations (e.g. low mana, acting out of turn) cleanly. |
| **File I/O** | `Arena.cpp` | `saveMatch()` and `replayMatch()` using `std::ofstream` and `std::ifstream`. |

## How to Compile

### Using MinGW / G++:
```bash
cd engine
g++ -std=c++17 -Wall -Wextra -O2 -Iinclude src/*.cpp -o battle_engine.exe
```

### Using CMake:
```bash
cd engine
mkdir build
cd build
cmake ..
cmake --build .
```

## Running the Engine

### 1. Fallback Terminal Demo Mode:
```bash
./battle_engine.exe --console
```
This runs an interactive text-based RPG in your terminal. Perfect for quick presentations and offline grading!

### 2. JSON Protocol Mode (Used by Node Server):
```bash
./battle_engine.exe
```
Reads JSON commands line-by-line via `stdin` and writes JSON responses to `stdout` with automatic flushing.
