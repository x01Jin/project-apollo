# Project Apollo

A strategic survival game where you maintain your spaceship's critical systems until rescue arrives.

<div align="center">
  <a href="https://x01jin.github.io/project-apollo/" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">
    🚀 Play Online
  </a>
</div>

## Gameplay

Project Apollo is a turn-based survival game where you command a damaged spaceship and must keep its critical systems operational until rescue arrives. Each decision matters as systems deteriorate over time, and random events can either help or hinder your survival.

### Core Features
- **System Management**: Maintain critical ship systems
- **Resource Allocation**: Repair systems using limited actions each turn
- **Event System**: Experience random positive and negative events that affect gameplay
- **Dynamic Difficulty**: Game length and complexity scale with your system selections
- **Strategic Depth**: System interdependencies create complex decision-making scenarios

### Win/Lose Conditions
- **Victory**: Survive until rescue arrives (turn count based on selected systems)
- **Defeat**: If a critical system fails (e.g. life support) completely, or all systems die

## Gameplay Tips

### System Priorities
- **Life Support** is critical - its failure ends the game immediately
- **Power** affects all other systems when low - keep it above 50% health
- Balance repairs across systems to prevent cascade failures

### Event Management
- Positive events can provide breathing room for repairs
- Negative events often require immediate attention to multiple systems
- Some events may require interactive choices that affect outcomes

### Advanced Tactics
- Monitor deterioration rates - some systems decay faster than others
- Use positive events to over-repair systems for safety margins
- Balance risk vs. reward when selecting events during setup

## Code Architecture

Project Apollo uses a modular, data-driven architecture that emphasizes maintainability and extensibility.

### Modular Design
The codebase is organized into distinct layers with clear separation of concerns:

```
src/
├── core/          # Core game logic (state, UI, game loop)
├── mechanics/     # Game mechanics (deterioration, events, repairs)
└── setup/         # Game configuration and setup

systems/           # Individual system modules
events/            # Event modules (positive/negative)
config.js          # Central configuration aggregator
```

### Data-Driven Systems
Each game element (systems and events) is defined as an independent module with its own logic:

**Systems** (`systems/*.js`):
- Contain deterioration and repair mechanics
- Define system properties (name, icon, caveats)
- Implement system-specific behaviors

**Events** (`events/*/*.js`):
- Define event descriptions and effects
- Implement apply() methods for state modifications
- Support both positive and negative outcomes

### Configuration System
The `config.js` file serves as the central registry:
- Imports all system and event modules
- Aggregates them into structured arrays
- Enables easy addition of new content without code changes
- Supports selective loading based on player choices

### Benefits of This Architecture
- **Extensibility**: New systems/events can be added by creating modules and registering them in config.js
- **Maintainability**: Each module handles one responsibility
- **Testability**: Isolated modules can be unit tested independently
- **Modularity**: Changes to one system don't affect others

Events add unpredictability and strategic depth, requiring players to adapt their repair priorities based on current circumstances.
