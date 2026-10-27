cmake_minimum_required(VERSION 3.10)
project(BattleArenaEngine CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories(include)

file(GLOB SOURCES "src/*.cpp")

add_executable(battle_engine ${SOURCES})

# Ensure cross-platform flags
if(MSVC)
    target_compile_options(battle_engine PRIVATE /W4)
else()
    target_compile_options(battle_engine PRIVATE -Wall -Wextra -O2)
endif()
