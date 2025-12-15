# Deteriorate Systems

File: [src/mechanics/deteriorateSystems.js](src/mechanics/deteriorateSystems.js#L1)

Description:

- Orchestrates per-turn system updates. Ensures a single deterioration cycle per `deteriorationCount` and executes system-specific `deteriorate` or `update` logic in a deterministic order.

Functions:

- `deteriorateSystems(gameState, force = false)` — runs the main pipeline and triggers `updateUI()`.
- `resetSystemsUpdateTracking()` — reset internal tracking for testing or restart.

Notes:

- Execution order ensures harmonized behavior (systems can depend on each other within the same cycle).
