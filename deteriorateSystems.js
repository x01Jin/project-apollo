/**
 * Deteriorate Systems module for the survival game.
 * This module handles the deterioration of ship systems over time.
 * Each system loses health based on its deterioration rate.
 * This simulates the natural decay of systems without maintenance.
 * The deterioration happens at the start of each turn before player actions.
 * Systems cannot have negative health; they are clamped to 0.
 * Special handling for critical systems like Life Support.
 *
 * @param {Object} gameState - The current game state object containing systems array.
 * @returns {Object} The updated game state after deterioration has been applied.
 */
export function deteriorateSystems(gameState) {
  // Input validation: Ensure gameState exists and has a valid systems array
  if (!gameState || !gameState.systems || !Array.isArray(gameState.systems)) {
    throw new Error('Invalid gameState: systems array is required');
  }

  // Create a shallow copy of the gameState to prevent mutation of the original object
  const updatedState = { ...gameState };

  // Process each system in the array, applying deterioration
  updatedState.systems = updatedState.systems.map(system => {
    // Calculate the new health value after deterioration
    // Use Math.max to ensure health doesn't go below 0
    const newHealth = Math.max(0, system.health - system.deteriorationRate);

    // Return a new system object with updated health
    // Preserve all other properties of the system
    return {
      ...system,
      health: newHealth
    };
  });

  // Update the game's message to inform the player about deterioration
  updatedState.message = 'Systems have deteriorated due to lack of maintenance.';

  // Debug logging to track system changes during development
  console.log('Systems deteriorated:', updatedState.systems);

  // Check for critical failure conditions that end the game immediately
  // Life Support is considered critical; failure causes instant game over
  const lifeSupport = updatedState.systems.find(sys => sys.name === 'Life Support');
  if (lifeSupport && lifeSupport.health <= 0) {
    updatedState.gameOver = true;
    updatedState.message = 'Life Support has failed! Game Over.';
  }

  // Additional checks for other critical systems could be added here
  // For example, if Navigation fails, it might delay rescue

  // Return the modified game state with deteriorated systems
  return updatedState;
}
