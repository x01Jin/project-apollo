# Damage Modifiers

File: [src/mechanics/damageModifiers.js](src/mechanics/damageModifiers.js#L1)

Functions:

- `addDamageModifier(gameState, systemName, modifier, type, turnsLeft, source)` — add a temporary modifier; `modifier` multiplies damage (0 = immune).
- `updateDamageModifiers(gameState)` — decrement `turnsLeft` for each modifier and remove expired ones; emits `damageModifiersUpdated` event on changes.
- `getDamageModifier(systemName, damageType, gameState)` — returns effective multiplier (1 = full damage).
- `isSystemImmune(systemName, damageType, gameState)` — true when effective modifier is 0.
- `removeDamageModifiers` / `removeDamageModifiersBySource` — clean up helpers.

Usage:

- Used by Protection and other modules to grant temporary immunity or reduction.
