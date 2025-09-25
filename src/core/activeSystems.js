/**
 * Active Systems Parser module for the survival game.
 * This module handles all functionality for systems classified as "active".
 * Active systems have custom interactability and dynamic behavior.
 * They can define their own UI rendering, interaction handling, and update logic.
 */

/**
 * Renders an active system element using the system's custom renderUI method
 * @param {Object} system - The system object with renderUI method
 * @param {HTMLElement} container - The container element to render into
 * @returns {HTMLElement} The rendered system element
 */
export function renderActiveSystem(system, container) {
  container.className = "system";
  container.id = `system-${system.name.toLowerCase().replace(" ", "-")}`;
  container.setAttribute("data-system-name", system.name);

  // Check if system has a custom renderUI method
  if (typeof system.renderUI === "function") {
    // Call the system's custom rendering method
    return system.renderUI(container);
  } else {
    // Fallback rendering if no custom method provided
    renderDefaultActiveSystem(system, container);
    return container;
  }
}

/**
 * Default rendering for active systems that don't provide custom renderUI
 * @param {Object} system - The system object
 * @param {HTMLElement} container - The container element to render into
 */
function renderDefaultActiveSystem(system, container) {
  // Get system icon
  const icon = system.icon || "fas fa-cogs";

  // Create default active system HTML
  container.innerHTML = `
    <div class="system-header">
      <i class="${icon} system-icon"></i>
      <h3>${system.name}</h3>
    </div>
    <div class="active-system-content">
      <div class="caveat">${
        system.caveat || "Active system with custom interactions"
      }</div>
      <div class="active-indicators">
        <span class="active-status">● Active</span>
      </div>
    </div>
  `;

  // Add custom styling for active systems
  container.style.borderColor = "var(--success-color)";
  container.style.boxShadow = "0 0 10px rgba(0, 255, 136, 0.3)";
}

/**
 * Updates an existing active system element
 * @param {HTMLElement} systemElement - The existing system element to update
 * @param {Object} system - The system object with updated data
 */
export function updateActiveSystemElement(systemElement, system) {
  // Check if system has a custom updateUI method
  if (typeof system.updateUI === "function") {
    // Call the system's custom update method
    system.updateUI(systemElement);
  } else {
    // Default update behavior - could be extended based on system state
    updateDefaultActiveSystemElement(systemElement, system);
  }
}

/**
 * Default update for active systems without custom updateUI
 * @param {HTMLElement} systemElement - The system element
 * @param {Object} system - The system object
 */
function updateDefaultActiveSystemElement(systemElement, system) {
  // Update any dynamic content if needed
  // This is a placeholder for default update behavior
}

/**
 * Handles interaction with an active system using the system's custom handleInteraction method
 * @param {Object} system - The system object
 * @param {string} action - The action being performed
 * @param {Object} gameState - The current game state
 * @param {Object} config - The game configuration
 * @returns {Promise<Object>} The updated game state
 */
export async function handleActiveInteraction(
  system,
  action,
  gameState,
  config
) {
  // Check if system has a custom handleInteraction method
  if (typeof system.handleInteraction === "function") {
    try {
      // Call the system's custom interaction handler
      const result = await system.handleInteraction(action, gameState, config);

      // Ensure we return a valid game state
      if (result && typeof result === "object") {
        return result;
      } else {
        console.warn(
          `System ${system.name} handleInteraction did not return a valid game state`
        );
        return gameState;
      }
    } catch (error) {
      console.error(`Error in ${system.name} handleInteraction:`, error);
      return gameState;
    }
  } else {
    // No custom interaction handler - log and return unchanged state
    console.log(`Active system ${system.name} has no handleInteraction method`);
    return gameState;
  }
}

/**
 * Updates an active system during the game loop
 * @param {Object} system - The system object
 * @param {Object} gameState - The current game state
 * @returns {Object} The updated game state
 */
export function updateActiveSystem(system, gameState) {
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
          `System ${system.name} update did not return a valid game state`
        );
        return gameState;
      }
    } catch (error) {
      console.error(`Error in ${system.name} update:`, error);
      return gameState;
    }
  } else {
    // No custom update method - return unchanged state
    return gameState;
  }
}

/**
 * Initializes an active system with any required setup
 * @param {Object} system - The system object
 * @param {Object} gameState - The current game state
 * @returns {Object} The updated game state
 */
export function initializeActiveSystem(system, gameState) {
  // Check if system has an initialize method
  if (typeof system.initialize === "function") {
    try {
      const result = system.initialize(gameState);
      if (result && typeof result === "object") {
        return result;
      } else {
        console.warn(
          `System ${system.name} initialize did not return a valid game state`
        );
        return gameState;
      }
    } catch (error) {
      console.error(`Error initializing ${system.name}:`, error);
      return gameState;
    }
  } else {
    // No initialization needed
    return gameState;
  }
}
