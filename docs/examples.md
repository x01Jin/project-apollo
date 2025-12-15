# Examples & Playthroughs

This section contains short example sequences and suggested play patterns.

Example playthrough (high-level):

1. Turn 1: Initial deterioration applied; inspect `message` and `event log`.
2. Use fixes on the most damaged normal system (e.g., Life Support or Power).
3. Activate `Protection` on a high-risk system before a predicted negative event or when low on resources.
4. Use `Comms` bonuses if extra-turn granted to recover from heavy damage the previous turn.
5. Prioritize fixing `Life Support` if its health drops to critical.

Developer example: adding a new positive event

1. Create `events/positive/myEvent.js` exporting `{ description, apply(state) }`.
2. Add the path to `registry.js` under `positiveEvents`.
3. Use `loadGameModules()` or reload the page to test.
