# createGameState

File: [src/core/gameState.js](src/core/gameState.js#L1)

Purpose:

- Builds the initial `gameState` using the loaded `config` (systems and events).

Behavior:

- Copies `config.systems`, assigns `health` (normal: random between 50–100, active/passive: 100), sets `maxTurns` to `systems.length * 5`, initializes `damageModifiers`, `deteriorationCount`, and initializes active/passive systems via `initializeActiveSystem`/`initializePassiveSystem`.

Return shape (example):

- `{ turn, maxTurns, systems: [...], gameOver, win, message, damageModifiers, deteriorationCount }`
