/**
 * Deteriorate Systems module for the survival game.
 * This module handles the deterioration and updating of ship systems over time.
 * Each system type handles its own logic through dedicated parsers.
 * This simulates the natural decay of systems without maintenance and handles dynamic updates.
 * The deterioration happens at the start of each turn before player actions.
 *
 * @param {Object} gameState - The current game state object containing systems array.
 * @returns {Object} The updated game state after deterioration has been applied.
 */
export function deteriorateSystems(gameState) {
  // Input validation: Ensure gameState exists and has a valid systems array
  if (!gameState || !gameState.systems || !Array.isArray(gameState.systems)) {
    throw new Error("Invalid gameState: systems array is required");
  }

  // Start with the current game state
  let updatedState = { ...gameState };

  // Process each system based on its type
  for (const system of updatedState.systems) {
    switch (system.type || "normal") {
      case "normal":
        // Normal systems use their deteriorate method
        updatedState = updateNormalSystem(system, updatedState);
        break;
      case "active":
        // Active systems can have custom update logic
        updatedState = updateActiveSystem(system, updatedState);
        break;
      case "passive":
        // Passive systems can have background update logic
        updatedState = updatePassiveSystem(system, updatedState);
        break;
      default:
        console.warn(
          `Unknown system type: ${system.type}, defaulting to normal`
        );
        updatedState = updateNormalSystem(system, updatedState);
        break;
    }
  }

  // Update the game's message to inform the player about deterioration
  updatedState.message =
    "Systems have deteriorated due to lack of maintenance.";

  // Debug logging to track system changes during development
  console.log("Systems updated:", updatedState.systems);

  // Return the modified game state with updated systems
  return updatedState;
}

// Import system update functions synchronously
import { updateNormalSystem } from "../core/normalSystems.js";
import { updateActiveSystem } from "../core/activeSystems.js";
import { updatePassiveSystem } from "../core/passiveSystems.js";
