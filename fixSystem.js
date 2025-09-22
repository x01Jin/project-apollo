/**
 * Fix System module for the survival game.
 * This module handles repairing a specific ship system.
 * When a player chooses to fix a system, it restores the system to full health.
 * Fixing a system is the main player action each turn.
 * Only one system can be fixed per turn due to limited resources.
 *
 * @param {Object} gameState - The current game state object.
 * @param {string} systemName - The name of the system to fix.
 * @returns {Object} The updated game state after fixing the system.
 */
export function fixSystem(gameState, systemName) {
  // Validate inputs
  if (!gameState || !gameState.systems) {
    throw new Error('Invalid gameState: systems array is required');
  }
  if (!systemName || typeof systemName !== 'string') {
    throw new Error('Invalid systemName: must be a non-empty string');
  }

  // Create a copy of the gameState to avoid mutation
  const updatedState = { ...gameState };

  // Find the system to fix
  const systemIndex = updatedState.systems.findIndex(system => system.name === systemName);

  // Check if the system exists
  if (systemIndex === -1) {
    throw new Error(`System '${systemName}' not found`);
  }

  // Fix the system by setting health to 100
  updatedState.systems = updatedState.systems.map((system, index) => {
    if (index === systemIndex) {
      return {
        ...system,
        health: 100 // Restore to full health
      };
    }
    return system;
  });

  // Update the game message to reflect the repair
  updatedState.message = `${systemName} has been repaired to full health.`;

  // Log the repair action for debugging
  console.log(`System fixed: ${systemName} to 100 health`);

  // Return the updated game state
  return updatedState;
}
