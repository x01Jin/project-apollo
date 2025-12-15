# Developer Guide

This project is structured for easy extension. Developer-focused notes:

Adding a System or Event:

1. Create the module in `systems/` or `events/`.
2. Export an object named appropriately (e.g., `export const comms = { ... }`).
3. Ensure `name` and `type` are present and implement `deteriorate`/`fix` when applicable.
4. Add the path to `registry.js`.

Debugging tips:

- Use console logs — the code includes helpful debugging output for registry loading, state creation, and deterioration.
- Use `ModuleRegistry` options to disable caching or enable `strictMode` for stricter interface validation.

Testing locally:

- Open `game.html` in a browser or use a local static server to host the files.
- Use `setup.html` to create deterministic runs by selecting specific systems and events.

Conventions:

- Keep UI code separated from mechanics. Use `updateUI()` to reflect state changes.
- Use `deteriorationCount` for time-based effects that must be resilient to turn manipulations.
