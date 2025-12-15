# UI & Frontend Behavior

The UI is updated via `updateUI()` (`src/core/updateUI.js`) which coordinates specialized UI modules in `src/core/ui/`.

Key UI modules:

- `turnDisplay.js` — shows turn, progress, and max turns.
- `messageDisplay.js` — shows user messages and system feedback.
- `eventLog.js` — appends events with turn stamps.
- `toast.js` — temporary event toasts; supports positive/negative styling.
- `systemSelectionUI.js` — renders selection overlays and controls.

System rendering:

- Normal, active, and passive systems have dedicated render/update functions in `src/core/normalSystems.js`, `activeSystems.js`, `passiveSystems.js`.
- Active systems may provide `renderUI` and `updateUI` hooks for custom controls (e.g., Protection's activation button and overlays).

Interactive UI patterns:

- Interactive events spawn a popup (`interactive-popup`) with confirm/cancel. Data from popup is gathered and passed back to the mechanics layer.
