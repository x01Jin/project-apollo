# Overview

Project Apollo is a modular HTML5 survival game. The objective is to maintain ship systems until rescue arrives. The project is designed with a modular architecture: systems, events, mechanics, and UI are separated into small, testable modules.

Key concepts:

- Systems: independent modules representing ship subsystems (normal, active, passive).
- Events: positive and negative events that affect systems and state.
- Mechanics: rules such as deterioration, damage modifiers, system selection, and interactive events.
- Registry: dynamic module-loading system with interface validation.

Where to look in the code:

- Game entry: [src/core/game.js](src/core/game.js#L1)
- Registry and configuration: [registry.js](registry.js#L1) and [src/setup/registryUtils.js](src/setup/registryUtils.js#L1)
