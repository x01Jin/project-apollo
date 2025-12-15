# Bugs & Balance patch #2

## Changes

- Fixed shields protection timing: shields now add a global damage modifier that targets `all` systems so shields can protect every system.
- Updated `getDamageModifier` to treat modifiers with `systemName === 'all'` as global and match `type === 'all'` or specific damage types.
- Shields cleanup and persistence: use `removeDamageModifiersBySource(..., 'shields')` and add modifiers with `turnsLeft = 2` and `source = 'shields'` so protection survives the deterioration -> event phase.
- Made event timing configurable: added `config.eventChance` (default 0.3) and `config.positiveEventProbability` (default 0.5) so event frequency and positive/negative split are configurable.
- Reduced negative event magnitudes to tone down early randomness:
  - `Meteor Shower`: 30 → 20
  - `Oxygen Leak` (Life Support): 50 → 35
  - `Power Surge`: general 20 → 15, Power-specific 40 → 30
- Added `config.initialHealthRange = { min, max }` to `createGameState` so initial health variance can be narrowed for balance/testing.

## Documentation updates

- `docs/modules/mechanics/damageModifiers.md` — note about global `all` modifiers.
- `docs/systems.md` — clarified `Shields` thresholds (>=90 → 50%, >=75 → 25%, >=50 → 10%) and that protection persists into the event phase.
- `docs/events.md` — documented event trigger probability (30% per turn) and 50/50 positive/negative split.
- `docs/events.md` — notes about configurable `eventChance` and updated descriptions for changed event damages.
- `docs/modules/core/createGameState.md` — documents `initialHealthRange` option.

## Tests

- Added tests (mocks `document.dispatchEvent` for Node testing):
  - `tests/event_modules/triggerEvent_test.js` — verifies `eventChance` and `positiveEventProbability` behavior.
  - `tests/event_modules/magnitude_test.js` — verifies updated event damage magnitudes.
  - `tests/general_tests/initialHealthRange_test.js` — verifies `initialHealthRange` behavior.
  - `tests/system_modules/shields_test.js` to validate shields modifier applies to other systems and expires correctly.

All added tests and existing shields test were run locally and passed. Recommended next step: run Monte Carlo simulations to quantify win/loss rates with the new numbers and iterate on balance if needed.
