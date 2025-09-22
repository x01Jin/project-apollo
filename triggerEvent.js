/**
 * Trigger Event module for the survival game.
 * This module handles the random triggering of positive and negative events.
 * Events can occur at the start of each turn with a certain probability.
 * Positive events help the player, while negative events hinder progress.
 * The event system adds unpredictability and strategic depth to the game.
 *
 * @param {Object} gameState - The current game state object.
 * @param {Object} config - The game configuration containing events arrays.
 * @returns {Object} The updated game state after applying any triggered event.
 */
export function triggerEvent(gameState, config) {
  // Validate inputs
  if (!gameState || !config) {
    throw new Error('Invalid parameters: gameState and config are required');
  }

  // Create a copy of the gameState to avoid mutation
  const updatedState = { ...gameState };
  let triggeredEvent = null;

  // Define event trigger probability (30% chance per turn)
  const eventChance = 0.3;

  // Check if an event should trigger
  if (Math.random() < eventChance) {
    // Determine if it's positive or negative (50/50 chance)
    const isPositive = Math.random() < 0.5;
    let selectedEvent;

    if (isPositive && config.positiveEvents && config.positiveEvents.length > 0) {
      // Select a random positive event
      const randomIndex = Math.floor(Math.random() * config.positiveEvents.length);
      selectedEvent = config.positiveEvents[randomIndex];
    } else if (!isPositive && config.negativeEvents && config.negativeEvents.length > 0) {
      // Select a random negative event
      const randomIndex = Math.floor(Math.random() * config.negativeEvents.length);
      selectedEvent = config.negativeEvents[randomIndex];
    }

    // Apply the selected event if one was chosen
    if (selectedEvent) {
      // Update the message to describe the event
      updatedState.message = selectedEvent.description;

      // Apply the event's effect to the game state
      const newState = selectedEvent.effect(updatedState);

      // Ensure the returned state is valid
      if (newState && newState.systems) {
        updatedState.systems = newState.systems;
      }

      // Store the triggered event for return
      triggeredEvent = selectedEvent;

      // Log the event for debugging
      console.log('Event triggered:', selectedEvent.description);
    }
  } else {
    // No event triggered, update message accordingly
    updatedState.message = 'No unusual events this turn.';
  }

  // Return both the updated state and the triggered event (if any)
  return {
    state: updatedState,
    event: triggeredEvent
  };
}
