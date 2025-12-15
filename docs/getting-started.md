# Getting Started

Quick steps to run and test the game locally (static hosting or local web server recommended):

1. Open `index.html` or `game.html` in a browser (prefer a local server such as `http-server` or `python -m http.server`).
2. Use `setup.html` to configure which systems and events are active for the run.
3. The game initializes via `initializeGame()` in [src/core/game.js](src/core/game.js#L1).

Notes:

- The registry loads modules dynamically with the paths defined in `registry.js`.
- To add a system or event, add its script path to `registryConfig` in `registry.js`.

Recommended dev workflow:

- Edit modules under `systems/` or `events/`.
- Update `registry.js` if adding or removing modules.
- Reload the game page to pick up changes.
