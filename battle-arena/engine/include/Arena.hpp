#pragma once
#include <vector>
#include <string>
#include <memory>
#include "Character.hpp"
#include "GameException.hpp"
#include "nlohmann/json.hpp"

/**
 * ============================================================================
 * OOP CONCEPT: POLYMORPHISM, DYNAMIC DISPATCH & MEMORY MANAGEMENT
 * ============================================================================
 * Arena manages combatants polymorphically through a collection of Character* pointers.
 * It demonstrates proper memory lifecycle management in the destructor, turn
 * orchestration, state validation, and file handling.
 */
class Arena {
private:
    // Polymorphic collection of base class pointers
    std::vector<Character*> players;
    int currentTurn;       // 0 or 1
    int roundNumber;       // Increments every time both players have acted
    int turnsInCurrentRound;
    std::vector<std::string> battleLog;
    std::string currentEvent;
    int winnerIndex;       // -1 = ongoing, 0 = Player 1 wins, 1 = Player 2 wins, -2 = Draw

    void triggerRandomEvent();
    void checkWinner();

public:
    Arena();
    ~Arena(); // Destructor ensuring clean deletion of dynamically allocated Characters

    // Disallow copy to prevent double-free
    Arena(const Arena&) = delete;
    Arena& operator=(const Arena&) = delete;

    void addPlayer(Character* character);
    void startMatch();

    // Core combat execution method
    void applyAction(int playerIndex, const std::string& action, int itemIndex = 0);

    // Getters
    int getCurrentTurn() const { return currentTurn; }
    int getRoundNumber() const { return roundNumber; }
    int getWinner() const { return winnerIndex; }
    bool isGameOver() const { return winnerIndex != -1; }
    const std::vector<std::string>& getLog() const { return battleLog; }
    const std::string& getLastEvent() const { return currentEvent; }
    const std::vector<Character*>& getPlayers() const { return players; }

    nlohmann::json toJson() const;

    /**
     * ========================================================================
     * OOP CONCEPT: FILE HANDLING / STREAM I/O
     * ========================================================================
     * Persists the match results, statistics, and full battle history to disk,
     * and provides an offline replay parser to review completed matches.
     */
    void saveMatch(const std::string& filename = "match_history.txt") const;
    static std::string replayMatch(const std::string& filename = "match_history.txt");
};
