/**
 * Handle Click module for the survival game.
 * This module processes player interactions, specifically button clicks to fix systems.
 * When a player clicks a fix button, it repairs the system and advances the turn.
 * The turn progression includes deterioration, event triggering, and win/lose checks.
 * This module orchestrates the main game loop actions.
 *
 * @param {string} systemName - The name of the system the player wants to fix.
 * @param {Object} gameState - The current game state object.
 * @param {Object} config - The game configuration object.
 * @returns {Object} The updated game state after processing the click.
 */
export async function handleClick(systemName, gameState, config) {
  // Import required modules dynamically to avoid circular dependencies
  const { fixSystem } = await import("../mechanics/fixSystem.js");
  const { deteriorateSystems } = await import(
    "../mechanics/deteriorateSystems.js"
  );
  const { triggerEvent } = await import("../mechanics/triggerEvent.js");
  const { checkWinLose } = await import("./checkWinLose.js");
  const { updateUI } = await import("./updateUI.js");

  // Validate inputs
  if (!systemName || !gameState || !config) {
    throw new Error(
      "Invalid parameters: systemName, gameState, and config are required"
    );
  }

  // Check if game is already over
  if (gameState.gameOver) {
    console.log("Game is over, ignoring click");
    return gameState;
  }

  // Check if an interactive event is active
  if (gameState.interactiveMode) {
    console.log("Interactive event is active, ignoring normal click");
    return gameState;
  }

  let updatedState = { ...gameState };

  try {
    // Find the target system
    const targetSystem = updatedState.systems.find(
      (system) => system.name === systemName
    );
    if (!targetSystem) {
      throw new Error(`System '${systemName}' not found`);
    }

    // Check if system is dead (needs force recovery) or alive (normal fix)
    const isSystemDead = targetSystem.health <= 0;
    let eventTriggered = null;

    if (isSystemDead) {
      // Use the dedicated force recovery module
      const { attemptForceRecovery } = await import(
        "../mechanics/forceRecovery.js"
      );
      updatedState = await attemptForceRecovery(
        systemName,
        updatedState,
        config
      );

      // Log the force recovery attempt
      const uiOptions = {
        eventToLog: `Force recovery attempted on ${systemName}`,
        showToast: {
          description: `Force recovery attempted on ${systemName}`,
          isPositive: false, // Force recovery is a desperate action
        },
      };
      updateUI(updatedState, config, uiOptions);
      return updatedState; // Return early since UI was already updated
    } else {
      // Normal fix for alive system
      // Step 1: Fix the selected system
      updatedState = fixSystem(updatedState, systemName);

      // Step 2: Advance to the next turn
      updatedState.turn += 1;

      // Step 3: Apply system deterioration
      updatedState = deteriorateSystems(updatedState);

      // Step 4: Check for win/lose before events (in case deterioration caused failure)
      updatedState = checkWinLose(updatedState);

      // Step 5: Trigger random event if game not over
      if (!updatedState.gameOver) {
        const eventResult = await triggerEvent(updatedState, config);
        updatedState = eventResult.state;
        eventTriggered = eventResult.event;
      }

      // Step 6: Final win/lose check
      updatedState = checkWinLose(updatedState);
    }

    // Step 7: Update the UI with the new state
    const uiOptions = {};
    if (eventTriggered) {
      uiOptions.eventToLog = eventTriggered.description;
      uiOptions.showToast = eventTriggered;
    }
    updateUI(updatedState, config, uiOptions);

    // Log the action
    if (isSystemDead) {
      console.log(`Force recovery attempted on ${systemName}`);
    } else {
      console.log(`Turn ${updatedState.turn} completed`);
    }
  } catch (error) {
    console.error("Error handling click:", error);
    // In case of error, return the original state
    return gameState;
  }

  // Return the updated game state
  return updatedState;
}
