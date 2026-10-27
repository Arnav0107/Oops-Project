CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -O2 -Iinclude

SRCDIR = src
SOURCES = $(wildcard $(SRCDIR)/*.cpp)

# Windows binary extension vs POSIX
ifeq ($(OS),Windows_NT)
    TARGET = battle_engine.exe
    RM = del /Q /F
else
    TARGET = battle_engine
    RM = rm -f
endif

all: $(TARGET)

$(TARGET): $(SOURCES)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(SOURCES)

clean:
	$(RM) $(TARGET) match_history.txt

run-console: $(TARGET)
	./$(TARGET) --console

.PHONY: all clean run-console
