# updateUI

File: [src/core/updateUI.js](src/core/updateUI.js#L1)

Purpose:

- Central coordinator for UI updates; updates turn display, message display, system elements, game over state, event log entries, and toasts.

Behavior:

- Delegates rendering to `renderNormalSystem`, `renderActiveSystem`, and `renderPassiveSystem` when creating system elements and uses update functions when elements exist.
- Handles `systemSelectionMode` rendering via `systemSelectionUI` and accepts `options` for `eventToLog` and `showToast`.
