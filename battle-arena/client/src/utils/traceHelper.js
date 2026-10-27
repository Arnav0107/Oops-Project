/**
 * traceHelper.js
 * Generates technical, code-style C++ telemetry traces based on actual engine actions.
 * Explicitly maps domain interactions to the underlying C++17 OOP concepts.
 */

export function buildTraceEntry({
  type = 'action',
  action = 'attack',
  actor = { name: 'Player', class: 'Warrior' },
  target = { name: 'Opponent', class: 'Mage' },
  round = 1,
  itemIndex = 0,
  itemName = 'Health Potion',
  errorMessage = '',
  savedFile = 'match_history.txt',
  eventName = ''
}) {
  const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  let code = '';
  let note = '';
  let concepts = [];

  switch (action) {
    case 'start':
      code = `// Instantiating combatants polymorphically
Character* p1 = new ${actor.class}("${actor.name}");
Character* p2 = new ${target.class}("${target.name}");
Arena::addPlayer(p1); Arena::addPlayer(p2);
// Character::totalCharactersCreated = ${actor.class ? 2 : 0};`;
      note = `Heap allocation of concrete subclasses derived from abstract base Character.`;
      concepts = ['inheritance', 'abstraction', 'static_members', 'polymorphism'];
      break;

    case 'attack':
      code = `Character* actor = players[currentTurn];
actor->attack(*target, battleLog);
// Runtime dispatch: vtable -> ${actor.class}::attack()`;
      note = `Pure virtual attack() overridden in ${actor.class}. Damage mitigated via target.defense.`;
      concepts = ['polymorphism', 'abstraction', 'encapsulation'];
      break;

    case 'special':
      if (actor.class === 'Mage') {
        code = `// Mage Fireball (costs 30 MP)
if (mana < 30) throw GameException("Not enough mana!");
setMana(mana - 30);
actor->specialMove(*target, battleLog); // -> Mage::specialMove()`;
        note = `Subclass override with resource validation & exception throwing.`;
        concepts = ['polymorphism', 'exceptions', 'encapsulation'];
      } else if (actor.class === 'Warrior') {
        code = `// Warrior Berserk (double damage + 25% self recoil)
actor->specialMove(*target, battleLog); // -> Warrior::specialMove()
target.takeDamage(damage * 2);
setHealth(health - recoil); // Invariant checked via setHealth()`;
        note = `Overridden special move demonstrating state encapsulation mutators.`;
        concepts = ['polymorphism', 'encapsulation'];
      } else if (actor.class === 'Archer') {
        code = `// Archer Multi-shot (fires 3 arrows in sequence)
if (mana < 20) throw GameException("Not enough mana!");
actor->specialMove(*target, battleLog); // -> Archer::specialMove()`;
        note = `Sequential polymorphic hit resolution with crit chance.`;
        concepts = ['polymorphism', 'exceptions'];
      } else {
        code = `// Healer Soul Drain (siphons enemy vitality to restore HP)
actor->specialMove(*target, battleLog); // -> Healer::specialMove()
heal(actualDamageDealt, battleLog);`;
        note = `Life-steal mechanics using encapsulated heal() and takeDamage() methods.`;
        concepts = ['polymorphism', 'encapsulation'];
      }
      break;

    case 'item':
      code = `// Generic Inventory<std::shared_ptr<Item>> index access
auto item = inventory[${itemIndex}]; // operator[] on template container
item->use(*this); // vtable -> ${itemName.includes('Mana') ? 'ManaPotion' : 'HealthPotion'}::use(Character&)
inventory.removeItem(${itemIndex});`;
      note = `Generic template container holding smart pointers to abstract Item hierarchy.`;
      concepts = ['templates', 'polymorphism', 'abstraction'];
      break;

    case 'combine':
      code = `// Invoking overloaded operator+ on HealthPotion
HealthPotion p1 = *std::dynamic_pointer_cast<HealthPotion>(inventory[0]);
HealthPotion p2 = *std::dynamic_pointer_cast<HealthPotion>(inventory[1]);
HealthPotion superPot = p1 + p2; // operator+(HealthPotion, HealthPotion)
inventory.addItem(std::make_shared<HealthPotion>(superPot));`;
      note = `Operator overloading: merges two potion instances into an amplified Super Potion.`;
      concepts = ['operator_overloading', 'templates'];
      break;

    case 'skip':
      code = `// Skip turn: maintains state without executing attack()
Arena::applyAction(currentTurn, "skip");
currentTurn = 1 - currentTurn;`;
      note = `Turn state orchestration managed inside Arena controller.`;
      concepts = ['encapsulation'];
      break;

    case 'event':
      code = `// End of round: trigger random arena environmental phenomenon
Arena::triggerRandomEvent();
// Iterates through std::vector<Character*> players polymorphically`;
      note = `Environmental event: ${eventName || 'Sudden Lightning / Divine Blessing'}.`;
      concepts = ['polymorphism', 'encapsulation'];
      break;

    case 'error':
      code = `// Exception caught at engine communication boundary
try {
    arena->applyAction(player, action, itemIndex);
} catch (const GameException& ex) {
    response["ok"] = false;
    response["error"] = ex.what(); // "${errorMessage}"
}`;
      note = `Custom GameException prevented illegal action without process crash.`;
      concepts = ['exceptions'];
      break;

    case 'save':
      code = `// Archiving match state using C++ file streams
std::ofstream outFile("${savedFile}");
outFile << *players[0] << "\\n" << *players[1] << "\\n"; // operator<<
Arena::saveMatch("${savedFile}");`;
      note = `Serialized battle history written to disk; stream operator<< overloaded for Character.`;
      concepts = ['file_io', 'operator_overloading'];
      break;

    default:
      code = `arena->applyAction(${action});`;
      concepts = ['polymorphism'];
  }

  return {
    id: 'trace_' + Math.random().toString(36).substring(2, 9),
    action,
    round,
    actorName: actor.name || 'Hero',
    actorClass: actor.class || 'Warrior',
    timestamp,
    code,
    note,
    concepts
  };
}
