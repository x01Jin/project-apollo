# Mechanics & Rules Engine

This section documents core mechanics that implement game rules.

Key modules:

- `deteriorateSystems` (`src/mechanics/deteriorateSystems.js`): applies per-turn deterioration in an ordered pipeline: system updates → deterioration → damage modifier processing → UI update.
- `damageModifiers` (`src/mechanics/damageModifiers.js`): apply temporary modifiers to systems (e.g., immunity). Functions: `addDamageModifier`, `updateDamageModifiers`, `getDamageModifier`, `isSystemImmune`, and removal helpers.
- `systemSelection` (`src/mechanics/systemSelection.js`): enter/exit selection mode, select systems, confirm/cancel selections.
- `interactiveEvents` (`src/mechanics/interactiveEvents.js`): show interactive popups, confirm/cancel, and apply event-specific logic.
- `triggerEvent` (`src/mechanics/triggerEvent.js`): (used to schedule or apply events; see file for implementation details).

Deterioration cycle notes:

- `deteriorationCount` is tracked separately from `turn` to avoid duplication and support turn manipulation.
- Systems can apply additional logic based on the current `deteriorationCount` (e.g., Protection tracks start/end counts).

Damage stacking rules:

- Modifiers multiply together (i.e., combine by multiplication) to produce the effective damage multiplier.
- `modifier=0` ⇒ immunity.
