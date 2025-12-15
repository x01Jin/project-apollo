# Module Registry Utils

File: [src/setup/registryUtils.js](src/setup/registryUtils.js#L1)

Summary:

- Implements `ModuleRegistry` which dynamically imports modules, validates them against `MODULE_INTERFACES`, uses caching, and reports statistics. Exported helpers: `loadGameModules`, default `ModuleRegistry`, and `MODULE_INTERFACES`.

Configuration options:

- `validateInterfaces` (default true)
- `enableCaching` (default true)
- `strictMode` (default false)

Validation:

- `MODULE_INTERFACES` defines expected required properties and function methods for systems and events.

Error handling:

- Non-strict mode returns `null` for failed modules and filters them out; strict mode throws an error.
