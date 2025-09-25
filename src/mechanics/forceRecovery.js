/**
 * Force Recovery module for the survival game.
 * This module handles the force recovery mechanic for dead systems.
 * Provides a low chance revival without disrupting normal game flow.
 */

/**
 * Attempts force recovery on a dead system
 * @param {string} systemName - The name of the system to attempt recovery on
 * @param {Object} gameState - The current game state
 * @param {Object} config - The game configuration
 * @returns {Promise<Object>} The updated game state
 */
export async function attemptForceRecovery(systemName, gameState, config) {
  let updatedState = { ...gameState };

  // Find the target system
  const targetSystem = updatedState.systems.find(
    (system) => system.name === systemName
  );
  if (!targetSystem) {
    throw new Error(`System '${systemName}' not found`);
  }

  // Check if system is actually dead
  if (targetSystem.health > 0) {
    updatedState.message = `${systemName} is not dead and doesn't need force recovery.`;
    return updatedState;
  }

  // Check if an interactive event is active - force recovery should be blocked
  if (gameState.interactiveMode) {
    console.log("Interactive event is active, ignoring force recovery attempt");
    return gameState;
  }

  // Force recovery attempt - low chance revival
  const recoverySuccess = Math.random() < 0.1; // 10% chance

  if (recoverySuccess) {
    // Successful recovery: restore to 50% health
    targetSystem.health = 50;
    updatedState.message = `${systemName} force recovery successful! Restored to 50% health.`;
  } else {
    // Failed recovery
    updatedState.message = `${systemName} force recovery failed. System remains offline.`;

    // Trigger shake animation on the system element
    const systemElement = document.querySelector(
      `[data-system-name="${systemName}"]`
    );
    if (systemElement) {
      systemElement.classList.add("shake");
      setTimeout(() => {
        systemElement.classList.remove("shake");
      }, 500);
    }
  }

  // Execute the standard turn progression sequence
  const { executeTurnSequence } = await import("../core/sequenceOrder.js");
  updatedState = await executeTurnSequence(updatedState, config);

  return updatedState;
}
