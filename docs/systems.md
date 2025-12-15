# Systems Reference

Systems are modular objects that expose properties and optional methods. The module interface is validated by the registry; required fields include `name` and `type`.

Types:

- `normal` — typical systems that deteriorate each turn and can be fixed (e.g., Life Support, Power).
- `active` — systems with special actions and UI (e.g., Protection).
- `passive` — background systems that run periodic logic.

Current systems with short descriptions:

- Life Support: critical; failure ends the game. (`systems/lifeSupport.js`)
- Power: provides energy; low power increases deterioration of others. (`systems/power.js`)
- Navigation: affects turn progression and rescue chance. (`systems/navigation.js`)
- Comms: may grant extra turns and counter navigation penalties. (`systems/comms.js`)
- Shields: defensive system (see `systems/shields.js`).
- Protection: active system that grants immunity to a target system for 3 deterioration cycles, then 5-turn cooldown. (`systems/protection.js`)

Per-system API (common methods):

- `deteriorate(state)` — apply deterioration effects for the module.
- `fix(state)` — repair the system.
- `initialize(state)` — (optional) initialize system-level state.
- `renderUI(container, state)` / `updateUI(container, state)` — (active systems) for custom UI.

When adding a system:

- Ensure the module exports an object with `name` and `type` and implement methods as needed.
- Add the relative path to `registry.js` under `systems`.
