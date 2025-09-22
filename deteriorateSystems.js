/**
 * Deteriorate Systems module for the survival game.
 * This module handles the deterioration of ship systems over time.
 * Each system handles its own deterioration logic.
 * This simulates the natural decay of systems without maintenance.
 * The deterioration happens at the start of each turn before player actions.
 *
 * @param {Object} gameState - The current game state object containing systems array.
 * @returns {Object} The updated game state after deterioration has been applied.
 */
export function deteriorateSystems(gameState) {
  // Input validation: Ensure gameState exists and has a valid systems array
  if (!gameState || !gameState.systems || !Array.isArray(gameState.systems)) {
    throw new Error('Invalid gameState: systems array is required');
  }

  // Start with the current game state
  let updatedState = { ...gameState };

  // Process each system, calling its deteriorate function
  for (const system of updatedState.systems) {
    updatedState = system.deteriorate(updatedState);
  }

  // Update the game's message to inform the player about deterioration
  updatedState.message = 'Systems have deteriorated due to lack of maintenance.';

  // Debug logging to track system changes during development
  console.log('Systems deteriorated:', updatedState.systems);

  // Return the modified game state with deteriorated systems
  return updatedState;
}
