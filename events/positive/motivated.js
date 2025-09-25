/**
 * Motivated positive event module.
 * This module contains all data and functionality for the Motivated event.
 * A motivated event allows the player to select and repair up to 2 damaged systems.
 * Uses the system selection interface to let players choose which systems to repair.
 */

export const motivated = {
  description:
    "Your crew is highly motivated! Select up to 2 systems to repair.",

  // Event display configuration
  display: {
    showToast: true,
    logEvent: true,
  },

  /**
   * Applies the motivated event effect to the game state.
   * Enters system selection mode to allow player to choose systems to repair.
   * @param {Object} state - The current game state
   * @returns {Object} The updated game state in selection mode
   */
  async apply(state) {
    const { enterSystemSelectionMode } = await import(
      "../../src/mechanics/systemSelection.js"
    );

    // Callback function to repair selected systems
    const repairCallback = async (selectedSystems, gameState) => {
      // Create a copy of the game state to modify
      const updatedState = { ...gameState };

      // Repair selected systems to full health
      selectedSystems.forEach((systemName) => {
        const system = updatedState.systems.find((s) => s.name === systemName);
        if (system) {
          system.health = 100;
        }
      });

      // Update message to reflect the repair
      updatedState.message = `Motivated crew repaired ${selectedSystems.length} system(s) to full health!`;

      return updatedState;
    };

    // Enter system selection mode for damaged systems only
    const updatedState = await enterSystemSelectionMode(
      state,
      { systems: state.systems }, // Pass config with systems
      {
        allowedTypes: ["normal"], // Allow only normal system types
        multiSelect: true, // Allow multiple selection
        maxSelections: 2, // Limit to 2 systems
        callback: repairCallback,
        message: "Select up to 2 systems to repair (damaged systems only)",
        systemFilter: (system) => system.health < 100, // Only damaged systems
        showCancelButton: false, // No cancel button for positive events
        associatedEvent: motivated, // Pass the event for display configuration
      }
    );

    // Set up wrench display for motivated event
    setupWrenchDisplay(updatedState);

    return updatedState;
  },
};

/**
 * Inject CSS animation for wrench rotation if not already present
 */
function injectWrenchAnimationCSS() {
  // Check if animation is already injected
  if (document.getElementById("motivated-wrench-animation")) {
    return;
  }

  // Create style element with animation
  const style = document.createElement("style");
  style.id = "motivated-wrench-animation";
  style.textContent = `
    @keyframes motivated-wrench-rotate {
      0% {
        transform: translate(-50%, -50%) rotate(0deg);
      }
      25% {
        transform: translate(-50%, -50%) rotate(10deg);
      }
      50% {
        transform: translate(-50%, -50%) rotate(0deg);
      }
      75% {
        transform: translate(-50%, -50%) rotate(-10deg);
      }
      100% {
        transform: translate(-50%, -50%) rotate(0deg);
      }
    }
  `;

  // Inject into document head
  document.head.appendChild(style);
}

/**
 * Set up wrench display for the motivated event
 * @param {Object} gameState - The current game state
 */
function setupWrenchDisplay(gameState) {
  // Inject CSS animation if not already present
  injectWrenchAnimationCSS();

  // Remove any existing event listeners to prevent accumulation
  document.removeEventListener("systemSelectionChanged", handleSystemSelection);
  document.removeEventListener(
    "systemSelectionConfirmed",
    cleanupWrenchDisplay
  );
  document.removeEventListener(
    "systemSelectionCancelled",
    cleanupWrenchDisplay
  );

  // Add event listeners for system selection lifecycle
  document.addEventListener("systemSelectionChanged", handleSystemSelection);
  document.addEventListener("systemSelectionConfirmed", cleanupWrenchDisplay);
  document.addEventListener("systemSelectionCancelled", cleanupWrenchDisplay);

  // Initially update wrench display based on current selection
  updateWrenchDisplay(gameState.selectedSystems || []);
}

/**
 * Handle system selection change events to update wrench display
 * @param {CustomEvent} event - The system selection changed event
 */
function handleSystemSelection(event) {
  const selectedSystems = event.detail.selectedSystems;
  updateWrenchDisplay(selectedSystems);
}

/**
 * Update wrench display to show wrenches on selected systems
 * @param {Array} selectedSystems - Array of selected system names
 */
function updateWrenchDisplay(selectedSystems) {
  // Get all system elements
  const allSystemElements = document.querySelectorAll("[data-system-name]");

  allSystemElements.forEach((systemElement) => {
    const systemName = systemElement.getAttribute("data-system-name");
    const isSelected = selectedSystems.includes(systemName);
    const existingWrench = systemElement.querySelector(
      ".motivated-wrench-overlay"
    );

    if (isSelected && !existingWrench) {
      // Add wrench to selected system
      createWrenchOverlay(systemElement);
    } else if (!isSelected && existingWrench) {
      // Remove wrench from deselected system
      removeWrenchOverlay(systemElement);
    }
  });
}

/**
 * Create a teal wrench overlay with rotation animation
 * @param {HTMLElement} systemElement - The system element to add wrench to
 */
function createWrenchOverlay(systemElement) {
  // Create overlay element
  const overlay = document.createElement("div");
  overlay.className = "motivated-wrench-overlay";
  overlay.style.cssText = `
    position: absolute;
    top: 85%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1004;
    pointer-events: none;
    font-size: 3rem;
    color: #00ffffff;
    text-shadow: 0 0 10px #61ffffff;
    animation: motivated-wrench-rotate 4s ease-in-out infinite;
  `;

  // Add wrench icon
  overlay.innerHTML = `<i class="fas fa-wrench"></i>`;

  // Position overlay on system element
  systemElement.style.position = "relative";
  systemElement.appendChild(overlay);
}

/**
 * Remove wrench overlay from a system element
 * @param {HTMLElement} systemElement - The system element to remove wrench from
 */
function removeWrenchOverlay(systemElement) {
  const overlay = systemElement.querySelector(".motivated-wrench-overlay");
  if (overlay) {
    overlay.remove();
  }
}

/**
 * Clean up all wrench displays when selection mode ends
 */
function cleanupWrenchDisplay() {
  // Remove all wrench overlays
  const wrenches = document.querySelectorAll(".motivated-wrench-overlay");
  wrenches.forEach((wrench) => wrench.remove());

  // Remove event listeners
  document.removeEventListener("systemSelectionChanged", handleSystemSelection);
  document.removeEventListener(
    "systemSelectionConfirmed",
    cleanupWrenchDisplay
  );
  document.removeEventListener(
    "systemSelectionCancelled",
    cleanupWrenchDisplay
  );
}
