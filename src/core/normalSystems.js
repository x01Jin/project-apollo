/**
 * Normal Systems Parser module for the survival game.
 * This module handles all functionality for systems classified as "normal".
 * Normal systems have health bars, fix buttons, and standard deterioration mechanics.
 * This parser provides UI rendering, interaction handling, and state updates for normal systems.
 */

/**
 * Renders a normal system element with health bar and fix button
 * @param {Object} system - The system object
 * @param {HTMLElement} container - The container element to render into
 * @returns {HTMLElement} The rendered system element
 */
export function renderNormalSystem(system, container) {
  container.className = "system";
  container.id = `system-${system.name.toLowerCase().replace(" ", "-")}`;
  container.setAttribute("data-system-name", system.name);

  // Get system icon
  const icon = system.icon;

  // Create system HTML
  container.innerHTML = `
    <div class="system-header">
      <i class="${icon} system-icon"></i>
      <h3>${system.name}</h3>
    </div>
    <div class="health-bar-container">
      <div class="health-bar"></div>
      <div class="health-bar-overlay"></div>
    </div>
    <div class="health-text">Health: ${system.health}/100</div>
    <div class="caveat">${system.caveat}</div>
    <button class="fix-button${
      system.disableFixButton ? " fix-button-disabled" : ""
    }" data-system="${system.name}"${
    system.disableFixButton ? " disabled" : ""
  }>
      <i class="fas fa-wrench"></i> <span class="fix-button-text">${
        system.health <= 0 ? "Recover" : "Fix"
      }</span>
    </button>
  `;

  // Update health bar styling
  updateHealthBarStyling(container, system.health);

  // Cache frequently used element references to avoid repeated querySelector calls
  const healthBar = container.querySelector(".health-bar");
  const healthText = container.querySelector(".health-text");
  const caveatElement = container.querySelector(".caveat");
  const fixButton = container.querySelector(".fix-button");
  container._refs = { healthBar, healthText, caveatElement, fixButton };

  return container;
}

/**
 * Updates an existing normal system element with new health data
 * @param {HTMLElement} systemElement - The existing system element to update
 * @param {Object} system - The system object with updated data
 */
export function updateNormalSystemElement(systemElement, system) {
  // Update health bar width (this will animate smoothly due to CSS transition)
  const healthBarRef = systemElement._refs?.healthBar || systemElement.querySelector(".health-bar");
  if (healthBarRef) {
    healthBarRef.style.width = `${system.health}%`;

    // Update health bar color based on health with gradient
    const healthPercent = system.health / 100;
    if (healthPercent > 0.6) {
      healthBarRef.style.background =
        "linear-gradient(90deg, #ff4444 0%, #ffff00 50%, #00ff88 100%)";
    } else if (healthPercent > 0.3) {
      healthBarRef.style.background =
        "linear-gradient(90deg, #ff4444 0%, #ffff00 70%, #ffff00 100%)";
    } else {
      healthBarRef.style.background =
        "linear-gradient(90deg, #ff4444 0%, #ff4444 100%)";
    }
  }

  // Update health text
  const healthTextRef = systemElement._refs?.healthText || systemElement.querySelector(".health-text");
  if (healthTextRef) {
    healthTextRef.textContent = `Health: ${system.health}/100`;
  }

  // Update caveat text (in case it changed)
  const caveatRef = systemElement._refs?.caveatElement || systemElement.querySelector(".caveat");
  if (caveatRef) {
    caveatRef.textContent = system.caveat;
  }

  // Update button text based on health
  const fixButtonRef = systemElement._refs?.fixButton || systemElement.querySelector(".fix-button");
  if (fixButtonRef) {
    const buttonText = system.health <= 0 ? "Recover" : "Fix";
    const textSpan = fixButtonRef.querySelector(".fix-button-text");
    if (textSpan) textSpan.textContent = buttonText;

    if (system.disableFixButton) {
      fixButtonRef.setAttribute("disabled", "disabled");
      fixButtonRef.classList.add("fix-button-disabled");
    } else {
      fixButtonRef.removeAttribute("disabled");
      fixButtonRef.classList.remove("fix-button-disabled");
    }
  }

  // Update critical system warning styling
  updateHealthBarStyling(systemElement, system.health);
}

/**
 * Handles interaction with a normal system (fix button click)
 * @param {string} systemName - The name of the system
 * @param {Object} gameState - The current game state
 * @param {Object} config - The game configuration
 * @returns {Promise<Object>} The updated game state
 */
export async function handleNormalInteraction(systemName, gameState, config) {
  // Import required modules dynamically to avoid circular dependencies
  const { fixSystem } = await import("../mechanics/fixSystem.js");
  const { executeTurnSequence } = await import("./sequenceOrder.js");

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
    } else {
      // Normal fix for alive system
      // Step 1: Fix the selected system
      updatedState = fixSystem(updatedState, systemName);

      // Step 2-7: Execute the standard turn progression sequence
      updatedState = await executeTurnSequence(updatedState, config);
    }

    // Log the action
    if (isSystemDead) {
      console.log(`Force recovery attempted on ${systemName}`);
    } else {
      console.log(`Turn ${updatedState.turn} completed`);
    }
  } catch (error) {
    console.error("Error handling normal system interaction:", error);
    // In case of error, return the original state
    return gameState;
  }

  // Return the updated game state
  return updatedState;
}

/**
 * Updates a normal system during the deterioration phase
 * @param {Object} system - The system object
 * @param {Object} gameState - The current game state
 * @returns {Promise<Object>} The updated game state
 */
export async function updateNormalSystem(system, gameState) {
  let updatedState = { ...gameState };

  // Allow system to update itself (e.g., add/remove damage modifiers)
  if (typeof system.update === "function") {
    updatedState = await system.update(updatedState);
  }

  // Apply deterioration with damage modifier support
  const { applySystemDeterioration } = await import(
    "../mechanics/deteriorationUtils.js"
  );
  updatedState = applySystemDeterioration(
    system,
    updatedState,
    system.deteriorate
  );

  return updatedState;
}

/**
 * Updates health bar styling based on health value
 * @param {HTMLElement} systemElement - The system element
 * @param {number} health - The health value
 */
function updateHealthBarStyling(systemElement, health) {
  const healthBar = systemElement.querySelector(".health-bar");
  if (healthBar) {
    healthBar.style.width = `${health}%`;

    // Update health bar color based on health with gradient
    const healthPercent = health / 100;
    if (healthPercent > 0.6) {
      healthBar.style.background =
        "linear-gradient(90deg, #ff4444 0%, #ffff00 50%, #00ff88 100%)";
    } else if (healthPercent > 0.3) {
      healthBar.style.background =
        "linear-gradient(90deg, #ff4444 0%, #ffff00 70%, #ffff00 100%)";
    } else {
      healthBar.style.background =
        "linear-gradient(90deg, #ff4444 0%, #ff4444 100%)";
    }

    // Add critical system warning
    if (health < 20) {
      systemElement.style.borderColor = "var(--danger-color)";
      systemElement.style.boxShadow = "0 0 15px rgba(255, 68, 68, 0.5)";
    } else if (health < 50) {
      systemElement.style.borderColor = "var(--warning-color)";
      systemElement.style.boxShadow = "0 0 10px rgba(255, 255, 0, 0.3)";
    } else {
      systemElement.style.borderColor = "var(--border-color)";
      systemElement.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
    }
  }
}
