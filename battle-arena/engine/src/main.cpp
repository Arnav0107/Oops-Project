#include <iostream>
#include <string>
#include <memory>
#include <cstdlib>
#include <ctime>
#include "../include/Warrior.hpp"
#include "../include/Mage.hpp"
#include "../include/Archer.hpp"
#include "../include/Healer.hpp"
#include "../include/Arena.hpp"
#include "../include/GameException.hpp"
#include "nlohmann/json.hpp"

// Factory helper to instantiate concrete Character derived classes
Character* createCharacter(const std::string& name, const std::string& className) {
    if (className == "Warrior") return new Warrior(name);
    if (className == "Mage") return new Mage(name);
    if (className == "Archer") return new Archer(name);
    if (className == "Healer") return new Healer(name);
    throw GameException("Unknown character class: " + className + ". Choose Warrior, Mage, Archer, or Healer.");
}

// ============================================================================
// CONSOLE INTERACTIVE MODE (--console)
// Provides a full terminal presentation fallback for the college demo
// ============================================================================
void runConsoleMode() {
    std::cout << "============================================================\n";
    std::cout << "        BATTLE ARENA: OOP (C++17) SHOWCASE DEMO             \n";
    std::cout << "============================================================\n";
    std::cout << "OOP Concepts Highlighted:\n";
    std::cout << " [1] Abstraction & Pure Virtuals (Character, Item)\n";
    std::cout << " [2] Inheritance & Polymorphism (Warrior, Mage, Archer, Healer)\n";
    std::cout << " [3] Encapsulation (Private states with validated accessors)\n";
    std::cout << " [4] Operator Overloading (+ for SuperPotion, <<, <, ==)\n";
    std::cout << " [5] Templates (Inventory<T> generic container)\n";
    std::cout << " [6] Static Members (Character::totalCharactersCreated)\n";
    std::cout << " [7] Exception Handling (Custom GameException hierarchy)\n";
    std::cout << " [8] File I/O (Match persistence and offline replay)\n";
    std::cout << "============================================================\n\n";

    std::string name1, name2;
    int classChoice1 = 1, classChoice2 = 2;

    std::cout << "Enter Player 1 Name: ";
    if (!(std::cin >> name1)) name1 = "Player1";
    std::cout << "Select Player 1 Class (1: Warrior, 2: Mage, 3: Archer, 4: Healer): ";
    std::cin >> classChoice1;

    std::cout << "\nEnter Player 2 Name: ";
    if (!(std::cin >> name2)) name2 = "Player2";
    std::cout << "Select Player 2 Class (1: Warrior, 2: Mage, 3: Archer, 4: Healer): ";
    std::cin >> classChoice2;

    auto getClassString = [](int c) -> std::string {
        switch (c) {
            case 1: return "Warrior";
            case 2: return "Mage";
            case 3: return "Archer";
            case 4: return "Healer";
            default: return "Warrior";
        }
    };

    Arena arena;
    try {
        arena.addPlayer(createCharacter(name1, getClassString(classChoice1)));
        arena.addPlayer(createCharacter(name2, getClassString(classChoice2)));
        arena.startMatch();
    } catch (const GameException& ex) {
        std::cerr << "Initialization Error: " << ex.what() << "\n";
        return;
    }

    std::cout << "\n[Static Member] Total Characters instantiated: "
              << Character::getTotalCharactersCreated() << "\n\n";

    // Main game loop
    size_t lastLogged = 0;
    while (!arena.isGameOver()) {
        int turn = arena.getCurrentTurn();
        Character* currentP = arena.getPlayers()[turn];
        Character* opponentP = arena.getPlayers()[1 - turn];

        std::cout << "\n------------------------------------------------------------\n";
        std::cout << "ROUND " << arena.getRoundNumber() << " | TURN: " << currentP->getName() << "\n";
        std::cout << "------------------------------------------------------------\n";
        std::cout << "You:      " << *currentP << "\n";
        std::cout << "Opponent: " << *opponentP << "\n";

        // Compare characters using operator< and operator==
        if (*currentP < *opponentP) {
            std::cout << ">> Tactical Note: Opponent has more health than you! (evaluated via operator<)\n";
        } else if (*currentP == *opponentP) {
            std::cout << ">> Tactical Note: Both combatants currently have equal health! (via operator==)\n";
        }

        std::cout << "\nChoose Action for " << currentP->getName() << ":\n";
        std::cout << " 1. Normal Attack\n";
        std::cout << " 2. Special Move\n";
        std::cout << " 3. Use Item from Inventory\n";
        std::cout << " 4. Combine 2 Health Potions (Operator+ Demo -> SuperPotion)\n";
        std::cout << " 5. Skip Turn (Focus)\n";
        std::cout << "Selection (1-5): ";

        int choice;
        if (!(std::cin >> choice)) {
            if (std::cin.eof()) {
                std::cout << "\nInput stream ended. Exiting console battle.\n";
                break;
            }
            std::cin.clear();
            std::string discard;
            std::cin >> discard;
            continue;
        }

        try {
            if (choice == 1) {
                arena.applyAction(turn, "attack");
            } else if (choice == 2) {
                arena.applyAction(turn, "special");
            } else if (choice == 3) {
                const auto& inv = currentP->getInventory();
                if (inv.empty()) {
                    std::cout << "Your inventory is empty!\n";
                    continue;
                }
                std::cout << "Inventory Contents:\n";
                for (size_t i = 0; i < inv.size(); ++i) {
                    std::cout << " [" << i << "] " << *inv[i] << "\n";
                }
                std::cout << "Select Item Slot (0-" << (inv.size() - 1) << "): ";
                int slot;
                std::cin >> slot;
                arena.applyAction(turn, "item", slot);
            } else if (choice == 4) {
                arena.applyAction(turn, "combine");
            } else if (choice == 5) {
                arena.applyAction(turn, "skip");
            } else {
                std::cout << "Invalid menu choice! Please select 1-5.\n";
                continue;
            }

            // Print newly added battle logs
            const auto& log = arena.getLog();
            std::cout << "\n--- Action Results ---\n";
            for (size_t i = lastLogged; i < log.size(); ++i) {
                std::cout << " " << log[i] << "\n";
            }
            lastLogged = log.size();

        } catch (const GameException& ex) {
            std::cout << "\n⚠️ ACTION FAILED: " << ex.what() << "\n";
            // Exception handled gracefully; turn does not advance illegally
        }
    }

    std::cout << "\n============================================================\n";
    std::cout << "                      MATCH CONCLUDED                       \n";
    std::cout << "============================================================\n";
    int winner = arena.getWinner();
    if (winner == -2) {
        std::cout << "Result: Mutual Defeat! Both fighters collapsed simultaneously!\n";
    } else {
        std::cout << "Champion: " << arena.getPlayers()[winner]->getName()
                  << " (" << arena.getPlayers()[winner]->getCharacterClass() << ")\n";
    }

    // Save match file handling demonstration
    try {
        arena.saveMatch("match_history.txt");
        std::cout << "\n[File I/O] Match chronicle saved to 'match_history.txt'.\n";
        std::cout << "Would you like to review the saved replay file now? (1: Yes, 2: No): ";
        int repChoice;
        if (std::cin >> repChoice && repChoice == 1) {
            std::cout << "\n" << Arena::replayMatch("match_history.txt") << "\n";
        }
    } catch (const std::exception& ex) {
        std::cerr << "File Error: " << ex.what() << "\n";
    }
}

// ============================================================================
// JSON PROTOCOL MODE (Default stdin / stdout)
// Used by the Node.js server child process
// ============================================================================
void runJsonMode() {
    std::unique_ptr<Arena> arena;
    std::string line;

    while (std::getline(std::cin, line)) {
        if (line.empty()) continue;

        nlohmann::json response;
        try {
            nlohmann::json req = nlohmann::json::parse(line);
            std::string cmd = req.value("cmd", "");

            if (cmd == "start") {
                arena = std::make_unique<Arena>();
                if (!req.contains("players") || !req["players"].is_array() || req["players"].size() < 2) {
                    throw GameException("Start command requires 'players' array with 2 objects.");
                }

                for (int i = 0; i < 2; ++i) {
                    std::string pName = req["players"][i].value("name", "Player" + std::to_string(i + 1));
                    std::string pClass = req["players"][i].value("class", "Warrior");
                    arena->addPlayer(createCharacter(pName, pClass));
                }

                arena->startMatch();
                response["ok"] = true;
                response["state"] = arena->toJson();

            } else if (cmd == "action") {
                if (!arena) throw GameException("Match has not been started yet!");
                int player = req.value("player", 0);
                std::string action = req.value("action", "attack");
                int itemIndex = req.value("itemIndex", 0);

                arena->applyAction(player, action, itemIndex);
                response["ok"] = true;
                response["state"] = arena->toJson();

            } else if (cmd == "state") {
                if (!arena) throw GameException("No active match state found.");
                response["ok"] = true;
                response["state"] = arena->toJson();

            } else if (cmd == "save") {
                if (!arena) throw GameException("No match in progress to save.");
                arena->saveMatch("match_history.txt");
                response["ok"] = true;
                response["savedToFile"] = "match_history.txt";
                response["state"] = arena->toJson();

            } else if (cmd == "replay") {
                std::string replayText = Arena::replayMatch("match_history.txt");
                response["ok"] = true;
                response["replay"] = replayText;

            } else {
                throw GameException("Unrecognized command: " + cmd);
            }

        } catch (const GameException& ex) {
            response["ok"] = false;
            response["error"] = ex.what();
        } catch (const std::exception& ex) {
            response["ok"] = false;
            response["error"] = std::string("Engine error: ") + ex.what();
        } catch (...) {
            response["ok"] = false;
            response["error"] = "Unknown internal engine exception.";
        }

        // CRITICAL: Always flush stdout after every JSON line write
        std::cout << response.dump() << "\n";
        std::cout.flush();
    }
}

int main(int argc, char* argv[]) {
    std::srand(static_cast<unsigned int>(std::time(nullptr)));

    bool consoleMode = false;
    for (int i = 1; i < argc; ++i) {
        if (std::string(argv[i]) == "--console") {
            consoleMode = true;
            break;
        }
    }

    if (consoleMode) {
        runConsoleMode();
    } else {
        runJsonMode();
    }

    return 0;
}
