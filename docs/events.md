# Events Reference

Events are split into `positive` and `negative` events stored in `events/positive` and `events/negative`.
Each event module must have a `description` and may implement `apply(state)` to mutate the game state.

Included events:

- Positive:
  - Solar Flare (`events/positive/solarFlare.js`): heals all systems by 20 (capped at 100).
  - Supply Cache (`events/positive/supplyCache.js`)
  - Alien Signal (`events/positive/alienSignal.js`)
  - Motivated (`events/positive/motivated.js`) — interactive event that allows selecting systems to receive a fix/boost.
- Negative:
  - Meteor Shower (`events/negative/meteorShower.js`): damages systems by 30, skips protected systems.
  - Power Surge (`events/negative/powerSurge.js`)
  - Oxygen Leak (`events/negative/oxygenLeak.js`)

Event display and logging:

- Events often include a `description` used for filtering and display.
- Events can trigger interactive flows by using `interactiveEvents.js` or `systemSelection.js`.

To add an event:

- Export an object with `description` and optionally `apply(state)`.
- Add the path to `registry.js` under `positiveEvents` or `negativeEvents`.
