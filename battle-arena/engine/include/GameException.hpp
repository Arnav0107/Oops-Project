#pragma once
#include <string>
#include <exception>

/**
 * ============================================================================
 * OOP CONCEPT: EXCEPTION HANDLING & INHERITANCE
 * ============================================================================
 * GameException inherits from std::exception to provide custom, domain-specific
 * runtime error handling for illegal actions, insufficient resources, or dead state.
 */
class GameException : public std::exception {
private:
    std::string message;

public:
    explicit GameException(const std::string& msg) : message(msg) {}

    const char* what() const noexcept override {
        return message.c_str();
    }
};
