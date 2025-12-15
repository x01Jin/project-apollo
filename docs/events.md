# Events Reference

Events are split into `positive` and `negative` events stored in `events/positive` and `events/negative`.
Each event module must have a `description` and may implement `apply(state)` to mutate the game state.

Event timing and probability:

- Events trigger at the start of each turn with a default 30% probability (`config.eventChance`, 0..1). When an event triggers, it is by default equally likely to be positive or negative (50/50). You can override the split using `config.positiveEventProbability` (0..1).

Included events:

- Positive:
  - Solar Flare (`events/positive/solarFlare.js`): heals all systems by 20 (capped at 100).
  - Supply Cache (`events/positive/supplyCache.js`)
  - Alien Signal (`events/positive/alienSignal.js`)
  - Motivated (`events/positive/motivated.js`) — interactive event that allows selecting systems to receive a fix/boost.
- Negative:
  - Meteor Shower (`events/negative/meteorShower.js`): damages systems by 20 (was 30), skips protected systems. Reduced to tone down early-game RNG.
- Power Surge (`events/negative/powerSurge.js`): reduced general damage to 15 and Power-specific damage to 30 (was 20/40)
- Oxygen Leak (`events/negative/oxygenLeak.js`): reduced Life Support damage to 35 (was 50)

Event display and logging:

- Events often include a `description` used for filtering and display.
- Events can trigger interactive flows by using `interactiveEvents.js` or `systemSelection.js`.

To add an event:

- Export an object with `description` and optionally `apply(state)`.
- Add the path to `registry.js` under `positiveEvents` or `negativeEvents`.
