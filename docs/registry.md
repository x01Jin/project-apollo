# Registry & Module System

The project uses a small, robust module registry to dynamically import systems and events. The registry validates interfaces and supports caching and strict mode.

Key files:

- `registry.js` — default registry configuration used by the game and convenience `loadGameModules()` helper.
- `src/setup/registryUtils.js` — `ModuleRegistry` implementation; interface definitions are in `MODULE_INTERFACES`.

Module interfaces (summary):

- `system`: `required: ["name","type"]`, `methods: ["deteriorate","fix"]` (optional methods allowed).
- `positiveEvent` / `negativeEvent`: `required: ["description"]`, `methods: ["apply"]`.

How to extend:

1. Create your module file exporting an object named consistently (e.g., `export const power = { ... }`).
2. Add the relative path to the appropriate list in `registry.js`.
3. Use the `loadGameModules()` helper (the game calls it at startup).

Runtime behavior:

- Modules are imported using dynamic `import(modulePath)` so they can run in static hosting environments.
- Caching is used by default for performance and can be cleared by `ModuleRegistry.clearCache()`.
