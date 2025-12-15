# Interactive Events

File: [src/mechanics/interactiveEvents.js](src/mechanics/interactiveEvents.js#L1)

Description:

- Manages interactive popups that pause normal flow and require player confirmation or cancellation.

Functions:

- `showInteractiveEvent(gameState, config, interactiveEvent)` — shows popup and sets interactive state.
- `confirmInteractiveEvent(gameState, config, eventData)` — applies `interactiveEvent.apply()` and hides popup.
- `cancelInteractiveEvent(gameState)` — hides popup and resumes normal flow.

Notes:

- Popup HTML lives in `renderInteractivePopup`. Confirm and cancel handlers dispatch `interactiveEventCompleted` custom events with updated state.
