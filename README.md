# Project Apollo

A strategic survival game where you maintain your spaceship's critical systems until rescue arrives. Experience dynamic difficulty scaling, random events, and complex decision-making in this turn-based space survival simulator.

<p align="center">
  <a href="https://x01jin.github.io/project-apollo/">
    <img src="https://img.shields.io/badge/🚀%20Play%20Online-blue?style=for-the-badge" alt="Play Online" />
  </a>
  <br>
  <img src="https://img.shields.io/badge/JavaScript-ES6+-yellow" alt="JavaScript" />
  <img src="https://img.shields.io/badge/HTML5-Modern-orange" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-Modular-blue" alt="CSS3" />
  <img src="https://img.shields.io/badge/Architecture-Modular-green" alt="Modular Architecture" />
</p>

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

```Directory Structure
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

## Technical Stack

- **Frontend**: HTML5, CSS3, ES6+ JavaScript
- **Architecture**: Modular ES6 modules with dynamic imports
- **State Management**: Immutable game state with functional updates
- **UI Framework**: Vanilla JavaScript with component-based CSS
- **Build System**: Native ES6 modules (no bundler required)

## Development

### Project Structure

```Structure
project-apollo/
├── index.html          # Landing page
├── setup.html          # Game configuration
├── game.html           # Main game interface
├── config.js           # Central module registry
├── src/                # Core game logic
├── systems/            # System definitions
├── events/             # Event definitions
├── styles/             # Component stylesheets
└── .clinerules/        # Development guidelines
```

### Adding New Content

**To add a new system:**

1. Create `systems/newSystem.js` with supported methods
2. Register in `config.js`

**To add a new event:**

1. Create `events/positive/newEvent.js` or `events/negative/newEvent.js`
2. Define description and apply() method
3. Register in `config.js`

### Development Workflow

This project follows a modular workflow design:

1. **Core Logic** in `src/` remains generic and unchanged
2. **Game Content** is added via modules in dedicated folders
3. **Configuration** is managed through `config.js` registry
4. **Testing** is performed on isolated modules

## Contributing

### Guidelines

- Maintain separation between core engine and game content
- Add new systems/events as independent modules
- Test changes in isolation before integration

### Code Style

- Use ES6+ features and modern JavaScript patterns
- Maintain functional programming principles for state management
- Follow the established naming conventions
- Keep modules focused on single responsibilities

### Architecture Principles

- **Modularity**: Each component has clear boundaries
- **Data-Driven**: Configuration over hardcoded values
- **Extensibility**: Easy to add new content without core changes
- **Maintainability**: Clear separation of concerns
