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
  // Import required modules dynamically to avoid circular dependencies
  const { deteriorateSystems } = await import("./deteriorateSystems.js");
  const { triggerEvent } = await import("./triggerEvent.js");
  const { checkWinLose } = await import("../core/checkWinLose.js");

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

  // Follow the same sequence as normal system fixes:

  // Step 1: Advance to the next turn (force recovery is a player action)
  updatedState.turn += 1;

  // Step 2: Increment deterioration count for consistent timing
  updatedState.deteriorationCount += 1;

  // Step 3: Apply system deterioration
  updatedState = await deteriorateSystems(updatedState);

  // Step 4: Check for win/lose after deterioration
  updatedState = checkWinLose(updatedState);

  // Step 5: Trigger random event if game not over
  if (!updatedState.gameOver) {
    const eventResult = await triggerEvent(updatedState, config);
    updatedState = eventResult.state;
  }

  // Step 6: Final win/lose check
  updatedState = checkWinLose(updatedState);

  return updatedState;
}
