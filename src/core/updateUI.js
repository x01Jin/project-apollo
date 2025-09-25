/**
 * Update UI module for the survival game.
 * This module orchestrates updating the user interface elements based on the current game state.
 * It coordinates calls to specialized UI modules for different concerns.
 *
 * @param {Object} gameState - The current game state object.
 * @param {Object} config - The game configuration object.
 * @param {Object} options - Additional options for UI updates.
 */

// Import system parsers synchronously (they should be available)
import { renderNormalSystem } from "./normalSystems.js";
import { renderActiveSystem } from "./activeSystems.js";
import { renderPassiveSystem } from "./passiveSystems.js";

// Import update functions synchronously
import { updateNormalSystemElement } from "./normalSystems.js";
import { updateActiveSystemElement } from "./activeSystems.js";
import { updatePassiveSystemElement } from "./passiveSystems.js";

// Import specialized UI modules
import { updateTurnDisplay } from "./ui/turnDisplay.js";
import { updateMessageDisplay } from "./ui/messageDisplay.js";
import { updateGameOverState } from "./ui/gameOver.js";
import { addEventToLog } from "./ui/eventLog.js";
import { showEventToast } from "./ui/toast.js";
import {
  renderSystemSelectionMode,
  removeSystemSelectionUI,
} from "./ui/systemSelectionUI.js";

export function updateUI(gameState, config = null, options = {}) {
  // Validate the gameState object
  if (!gameState) {
    throw new Error("Invalid gameState: gameState is required");
  }

  // Update turn display and progress
  updateTurnDisplay(gameState);

  // Update message display
  updateMessageDisplay(gameState);

  // Update system elements (preserve existing elements for smooth animations)
  const systemsContainer = document.querySelector(".systems-container");
  if (systemsContainer) {
    const existingSystems = systemsContainer.querySelectorAll(".system");

    if (existingSystems.length === gameState.systems.length) {
      // Update existing system elements for smooth transitions
      gameState.systems.forEach((system, index) => {
        updateSystemElement(existingSystems[index], system);
      });
    } else {
      // Recreate all systems if count changed
      systemsContainer.innerHTML = "";
      gameState.systems.forEach((system) => {
        const systemElement = createSystemElement(system);
        systemsContainer.appendChild(systemElement);
      });
    }
  }

  // Update game over state and button management
  updateGameOverState(gameState);

  // Handle system selection mode
  if (gameState.systemSelectionMode) {
    renderSystemSelectionMode(gameState, config);
  } else {
    // Remove selection mode UI if not in selection mode
    removeSystemSelectionUI();
  }

  // Add event to log if provided
  if (options.eventToLog) {
    addEventToLog(options.eventToLog, gameState.turn);
  }

  // Show event toast if provided
  if (options.showToast && config) {
    showEventToast(options.showToast, config);
  }
}

/**
 * Create a system element for the UI
 * @param {Object} system - The system object with name, health, and caveat
 * @returns {HTMLElement} The created system element
 */
function createSystemElement(system) {
  // Delegate to appropriate parser based on system type
  switch (system.type || "normal") {
    case "normal":
      return renderNormalSystem(system, document.createElement("div"));
    case "active":
      return renderActiveSystem(system, document.createElement("div"));
    case "passive":
      return renderPassiveSystem(system, document.createElement("div"));
    default:
      console.warn(`Unknown system type: ${system.type}, defaulting to normal`);
      return renderNormalSystem(system, document.createElement("div"));
  }
}

/**
 * Update an existing system element with new data
 * @param {HTMLElement} systemElement - The existing system element to update
 * @param {Object} system - The system object with updated data
 */
function updateSystemElement(systemElement, system) {
  // Delegate to appropriate parser based on system type
  switch (system.type || "normal") {
    case "normal":
      updateNormalSystemElement(systemElement, system);
      break;
    case "active":
      updateActiveSystemElement(systemElement, system);
      break;
    case "passive":
      updatePassiveSystemElement(systemElement, system);
      break;
    default:
      console.warn(`Unknown system type: ${system.type}, defaulting to normal`);
      updateNormalSystemElement(systemElement, system);
      break;
  }
}
