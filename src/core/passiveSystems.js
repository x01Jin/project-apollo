/**
 * Passive Systems Parser module for the survival game.
 * This module handles all functionality for systems classified as "passive".
 * Passive systems have background effects and dynamic behavior but no UI interactions.
 * They can update game state and respond to events without player interaction.
 */

/**
 * Renders a passive system element (minimal UI, no interactive elements)
 * @param {Object} system - The system object
 * @param {HTMLElement} container - The container element to render into
 * @returns {HTMLElement} The rendered system element
 */
export function renderPassiveSystem(system, container) {
  container.className = "system passive-system";
  container.id = `system-${system.name.toLowerCase().replace(" ", "-")}`;
  container.setAttribute("data-system-name", system.name);

  // Get system icon
  const icon = system.icon || "fas fa-eye";

  // Create passive system HTML (minimal UI, no interactive elements)
  container.innerHTML = `
    <div class="system-header">
      <i class="${icon} system-icon"></i>
      <h3>${system.name}</h3>
    </div>
    <div class="passive-system-content">
      <div class="caveat">${
        system.caveat || "Passive system with background effects"
      }</div>
      <div class="passive-indicators">
        <span class="passive-status">○ Passive</span>
      </div>
    </div>
  `;

  // Add custom styling for passive systems
  container.style.borderColor = "var(--info-color)";
  container.style.boxShadow = "0 0 8px rgba(0, 136, 255, 0.2)";
  container.style.opacity = "0.8";

  return container;
}

/**
 * Updates an existing passive system element
 * @param {HTMLElement} systemElement - The existing system element to update
 * @param {Object} system - The system object with updated data
 */
export function updatePassiveSystemElement(systemElement, system) {
  // Check if system has a custom updateUI method
  if (typeof system.updateUI === "function") {
    // Call the system's custom update method
    system.updateUI(systemElement);
  } else {
    // Default update behavior for passive systems
    updateDefaultPassiveSystemElement(systemElement, system);
  }
}

/**
 * Default update for passive systems without custom updateUI
 * @param {HTMLElement} systemElement - The system element
 * @param {Object} system - The system object
 */
function updateDefaultPassiveSystemElement(systemElement, system) {
  // Update status indicators or other dynamic content if needed
  // This could show current passive effects or status
}

/**
 * Handles interaction with a passive system (should not happen, but handle gracefully)
 * @param {Object} system - The system object
 * @param {Object} gameState - The current game state
 * @returns {Object} The unchanged game state (passive systems don't handle interactions)
 */
export function handlePassiveInteraction(system, gameState) {
  // Passive systems don't have interactions
  console.log(
    `Passive system ${system.name} received interaction attempt - ignoring`
  );
  return gameState;
}

/**
 * Updates a passive system during the game loop
 * @param {Object} system - The system object
 * @param {Object} gameState - The current game state
 * @returns {Object} The updated game state
 */
export function updatePassiveSystem(system, gameState) {
  // Check if system has a custom update method
  if (typeof system.update === "function") {
    try {
      // Call the system's custom update method
      const result = system.update(gameState);

      // Ensure we return a valid game state
      if (result && typeof result === "object") {
        return result;
      } else {
        console.warn(
          `Passive system ${system.name} update did not return a valid game state`
        );
        return gameState;
      }
    } catch (error) {
      console.error(`Error in passive system ${system.name} update:`, error);
      return gameState;
    }
  } else {
    // No custom update method - return unchanged state
    return gameState;
  }
}

/**
 * Handles event effects for passive systems
 * @param {Object} system - The system object
 * @param {Object} event - The event object
 * @param {Object} gameState - The current game state
 * @param {Object} config - The game configuration
 * @returns {Object} The updated game state
 */
export function handlePassiveEvent(system, event, gameState, config) {
  // Check if system has an onEvent method
  if (typeof system.onEvent === "function") {
    try {
      // Call the system's event handler
      const result = system.onEvent(gameState, event, config);

      // Ensure we return a valid game state
      if (result && typeof result === "object") {
        return result;
      } else {
        console.warn(
          `Passive system ${system.name} onEvent did not return a valid game state`
        );
        return gameState;
      }
    } catch (error) {
      console.error(`Error in passive system ${system.name} onEvent:`, error);
      return gameState;
    }
  } else {
    // No event handler - return unchanged state
    return gameState;
  }
}

/**
 * Initializes a passive system with any required setup
 * @param {Object} system - The system object
 * @param {Object} gameState - The current game state
 * @returns {Object} The updated game state
 */
export function initializePassiveSystem(system, gameState) {
  // Check if system has an initialize method
  if (typeof system.initialize === "function") {
    try {
      const result = system.initialize(gameState);
      if (result && typeof result === "object") {
        return result;
      } else {
        console.warn(
          `Passive system ${system.name} initialize did not return a valid game state`
        );
        return gameState;
      }
    } catch (error) {
      console.error(`Error initializing passive system ${system.name}:`, error);
      return gameState;
    }
  } else {
    // No initialization needed
    return gameState;
  }
}

/**
 * Gets the current status of a passive system for display
 * @param {Object} system - The system object
 * @returns {string} Status description
 */
export function getPassiveSystemStatus(system) {
  // Check if system has a getStatus method
  if (typeof system.getStatus === "function") {
    try {
      return system.getStatus();
    } catch (error) {
      console.error(
        `Error getting status for passive system ${system.name}:`,
        error
      );
      return "Status unknown";
    }
  } else {
    // Default status
    return "Operating normally";
  }
}
