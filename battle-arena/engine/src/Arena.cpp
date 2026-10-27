#include "../include/Arena.hpp"
#include <fstream>
#include <sstream>
#include <cstdlib>

Arena::Arena()
    : currentTurn(0), roundNumber(1), turnsInCurrentRound(0),
      currentEvent("Match initialized. Choose your action!"), winnerIndex(-1) {}

Arena::~Arena() {
    /**
     * OOP CONCEPT: POLYMORPHIC DESTRUCTION & MEMORY DEALLOCATION
     * Iterates over raw Character pointers and safely frees dynamic heap memory.
     */
    for (Character* c : players) {
        delete c;
    }
    players.clear();
}

void Arena::addPlayer(Character* character) {
    if (players.size() >= 2) {
        delete character; // Prevent memory leak
        throw GameException("Arena already has 2 fighters!");
    }
    players.push_back(character);
}

void Arena::startMatch() {
    if (players.size() < 2) {
        throw GameException("Cannot start match with fewer than 2 players!");
    }
    currentTurn = 0;
    roundNumber = 1;
    turnsInCurrentRound = 0;
    winnerIndex = -1;
    battleLog.clear();
    currentEvent = "The battle begins! Round 1!";
    battleLog.push_back("⚔ ARENA MATCH COMMENCED: " + players[0]->getName() + " (" +
                        players[0]->getCharacterClass() + ") VS " +
                        players[1]->getName() + " (" + players[1]->getCharacterClass() + ")");
}

void Arena::triggerRandomEvent() {
    if (isGameOver()) return;

    // Pick 1 of 4 arena events
    int roll = std::rand() % 4;

    switch (roll) {
        case 0: {
            currentEvent = "⚡ Sudden Lightning strikes the arena! Both fighters take 10 shock damage!";
            battleLog.push_back(currentEvent);
            for (Character* p : players) {
                if (p->isAlive()) {
                    p->setHealth(p->getHealth() - 10);
                    if (!p->isAlive()) {
                        battleLog.push_back("☠ " + p->getName() + " was struck down by lightning!");
                    }
                }
            }
            break;
        }
        case 1: {
            currentEvent = "🌟 Celestial Blessing descends! Both champions restore 15 HP and 10 MP!";
            battleLog.push_back(currentEvent);
            for (Character* p : players) {
                if (p->isAlive()) {
                    p->heal(15, battleLog);
                    p->restoreMana(10, battleLog);
                }
            }
            break;
        }
        case 2: {
            currentEvent = "🎁 A supply crate drops from the sky! Both fighters receive combat supplies!";
            battleLog.push_back(currentEvent);
            try {
                if (players[0]->isAlive() && players[0]->getInventory().size() < 6) {
                    players[0]->getInventory().addItem(std::make_shared<HealthPotion>("Battlefield Potion", 25));
                    battleLog.push_back("📦 " + players[0]->getName() + " looted a Battlefield Potion!");
                }
                if (players[1]->isAlive() && players[1]->getInventory().size() < 6) {
                    players[1]->getInventory().addItem(std::make_shared<Armor>("Chain Mail Link", 4));
                    battleLog.push_back("📦 " + players[1]->getName() + " looted Chain Mail Link (+4 DEF)!");
                }
            } catch (...) {}
            break;
        }
        case 3:
        default: {
            currentEvent = "🩸 Blood Moon rises over the Colosseum! Both warriors surge with +3 Attack Power!";
            battleLog.push_back(currentEvent);
            for (Character* p : players) {
                if (p->isAlive()) {
                    p->setAttackPower(p->getAttackPower() + 3);
                }
            }
            break;
        }
    }
}

void Arena::checkWinner() {
    if (players.size() < 2) return;

    bool p0Alive = players[0]->isAlive();
    bool p1Alive = players[1]->isAlive();

    if (!p0Alive && !p1Alive) {
        winnerIndex = -2; // Tie
        battleLog.push_back("🏆 MUTUAL DEFEAT! The match ends in a glorious Draw!");
        currentEvent = "Mutual Defeat! It's a draw!";
    } else if (!p1Alive) {
        winnerIndex = 0; // Player 1 wins
        battleLog.push_back("🏆 VICTORY! " + players[0]->getName() + " reigns supreme!");
        currentEvent = players[0]->getName() + " emerged victorious!";
    } else if (!p0Alive) {
        winnerIndex = 1; // Player 2 wins
        battleLog.push_back("🏆 VICTORY! " + players[1]->getName() + " reigns supreme!");
        currentEvent = players[1]->getName() + " emerged victorious!";
    }
}

void Arena::applyAction(int playerIndex, const std::string& action, int itemIndex) {
    if (players.size() < 2) {
        throw GameException("Cannot perform action: 2 players must be present.");
    }
    if (isGameOver()) {
        throw GameException("Action rejected: The battle is already over!");
    }
    if (playerIndex != currentTurn) {
        throw GameException("Not your turn! Current turn belongs to " + players[currentTurn]->getName() + ".");
    }
    if (!players[playerIndex]->isAlive()) {
        throw GameException("Dead characters cannot take turns!");
    }

    int targetIndex = 1 - playerIndex;
    Character& actor = *players[playerIndex];
    Character& target = *players[targetIndex];

    // Reset current event for this turn
    currentEvent = "";

    // Action dispatch
    if (action == "attack") {
        actor.attack(target, battleLog);
    } else if (action == "special") {
        actor.specialMove(target, battleLog);
    } else if (action == "item") {
        actor.useItem(static_cast<size_t>(itemIndex), battleLog);
    } else if (action == "combine") {
        actor.combineHealthPotions(battleLog);
    } else if (action == "skip") {
        battleLog.push_back("🛡 " + actor.getName() + " chooses to bide time and skips their turn.");
    } else {
        throw GameException("Unknown action requested: '" + action + "'. Valid: attack, special, item, skip, combine");
    }

    // Check if that action concluded the match
    checkWinner();

    // Turn rotation and round processing
    if (!isGameOver()) {
        currentTurn = 1 - currentTurn;
        turnsInCurrentRound++;

        // After both combatants take an action, advance round and trigger event
        if (turnsInCurrentRound >= 2) {
            turnsInCurrentRound = 0;
            roundNumber++;
            triggerRandomEvent();
            checkWinner();
        }
    }
}

nlohmann::json Arena::toJson() const {
    nlohmann::json playersJson = nlohmann::json::array();
    for (const auto* p : players) {
        if (p) {
            playersJson.push_back(p->toJson());
        }
    }

    nlohmann::json j;
    j["turn"] = currentTurn;
    j["round"] = roundNumber;
    j["players"] = playersJson;
    j["log"] = battleLog;
    j["event"] = currentEvent;

    if (winnerIndex == -1) {
        j["winner"] = nullptr;
    } else {
        j["winner"] = winnerIndex;
    }

    return j;
}

/**
 * OOP CONCEPT: FILE HANDLING / STREAM PERSISTENCE
 * Writes the entire match trajectory and stats to an archival text file.
 */
void Arena::saveMatch(const std::string& filename) const {
    std::ofstream outFile(filename);
    if (!outFile.is_open()) {
        throw GameException("Failed to open file for saving: " + filename);
    }

    outFile << "============================================================\n";
    outFile << "               BATTLE ARENA MATCH REPORT                    \n";
    outFile << "============================================================\n";
    outFile << "Total Rounds: " << roundNumber << "\n";
    
    if (winnerIndex == -1) {
        outFile << "Status: In Progress\n";
    } else if (winnerIndex == -2) {
        outFile << "Outcome: DRAW / TIE\n";
    } else {
        outFile << "Winner: " << players[winnerIndex]->getName()
                << " (" << players[winnerIndex]->getCharacterClass() << ")\n";
    }
    outFile << "------------------------------------------------------------\n";
    outFile << "FINAL COMBATANT STATUS:\n";
    for (size_t i = 0; i < players.size(); ++i) {
        outFile << "Player " << (i + 1) << ": " << *players[i] << "\n";
    }
    outFile << "------------------------------------------------------------\n";
    outFile << "COMPLETE BATTLE LOG CHRONICLE:\n";
    for (size_t i = 0; i < battleLog.size(); ++i) {
        outFile << "[" << (i + 1) << "] " << battleLog[i] << "\n";
    }
    outFile << "============================================================\n";
    outFile.close();
}

/**
 * OOP CONCEPT: FILE HANDLING / STREAM READING
 * Replays a previously saved battle file.
 */
std::string Arena::replayMatch(const std::string& filename) {
    std::ifstream inFile(filename);
    if (!inFile.is_open()) {
        throw GameException("Replay file not found: " + filename);
    }

    std::stringstream buffer;
    buffer << inFile.rdbuf();
    inFile.close();
    return buffer.str();
}
