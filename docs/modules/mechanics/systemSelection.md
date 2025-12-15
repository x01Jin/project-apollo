# System Selection

File: [src/mechanics/systemSelection.js](src/mechanics/systemSelection.js#L1)

Description:

- Utilities for entering/exiting selection mode and selecting systems with filtering options.

Key API:

- `enterSystemSelectionMode(gameState, config, options)` — starts selection with `allowedTypes`, `multiSelect`, `callback`, and other options.
- `selectSystem(gameState, systemName)` — toggles selection status.
- `confirmSystemSelection(gameState)` — runs callback and exits selection mode.
- `cancelSystemSelection(gameState)` — cancels and exits.

Notes:

- Integrates with `updateUI()` to render overlays and provides options for event-driven flows.
