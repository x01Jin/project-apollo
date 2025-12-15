# API Reference

This section provides a quick reference for important modules and exported functions.

Core:

- `initializeGame()` — entry point (src/core/game.js): loads modules, creates game state, wires UI events.
- `createGameState(config)` — initializes game state including systems health and maxTurns (src/core/gameState.js).

Mechanics:

- `deteriorateSystems(gameState, force = false)` — apply per-turn deterioration (src/mechanics/deteriorateSystems.js).
- `addDamageModifier(...), updateDamageModifiers(...), getDamageModifier(...), isSystemImmune(...)` — see src/mechanics/damageModifiers.js.
- `enterSystemSelectionMode(gameState, config, options)` — start system selection; `confirmSystemSelection`/`cancelSystemSelection` complete or cancel it (src/mechanics/systemSelection.js).
- Interactive event helpers: `showInteractiveEvent`, `confirmInteractiveEvent`, `hideInteractiveEvent` (src/mechanics/interactiveEvents.js).

Registry:

- `loadGameModules(config = {}, options = {})` — convenience wrapper exported from `registry.js` that calls `src/setup/registryUtils.js`.
- `ModuleRegistry` — class with `load`, `loadModule`, `clearCache`, and `getStats`.

UI:

- `updateUI(gameState, config = null, options = {})` — top-level UI update function (src/core/updateUI.js).

Systems & Events

- Systems export objects with keys such as `name`, `type`, `deteriorate`, `fix`, and optional UI hooks.
- Events export objects with `description` and optional `apply(state)` function.
