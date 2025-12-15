# Gameplay & Rules

Objective:

- Keep ship systems operational until rescue arrives (the game tracks `turn` and `maxTurns`—rescue occurs when turns reach `maxTurns`).

Turn flow (high level):

- At start of each turn deterioration is applied (`src/mechanics/deteriorateSystems.js`).
- The player then may interact with systems (fix, activate actions, etc.).
- Events may trigger and apply effects (positive or negative).

Winning and Losing:

- Win: Maintain systems until `turn >= maxTurns` and meet any win conditions in `checkWinLose.js`.
- Lose: Critical systems (e.g., Life Support) reaching 0 health cause immediate game over.

System health and repair:

- Each system has a `health` property (0–100). Normal systems start with random health 50–100; active and passive systems start at 100 (see `createGameState`).
- `fix` methods on systems are used to repair (often restore to 100).

Interactive events and system selection:

- Some events require player choices and use `interactiveEvents.js` and `systemSelection.js` to gather input.

Logging and feedback:

- Events are logged to the event log and may show toasts. UI updates are coordinated by `updateUI()`.
