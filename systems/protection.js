/**
 * Protection system module.
 * This module contains all data and functionality for the Protection system.
 * The Protection system is an active system that can protect a normal system from deterioration for 3 turns,
 * followed by a 5-turn cooldown period.
 */

// Import dependencies at module level for better performance
import { enterSystemSelectionMode } from "../src/mechanics/systemSelection.js";
import {
  addDamageModifier,
  removeDamageModifiersBySource,
} from "../src/mechanics/damageModifiers.js";

export const protection = {
  name: "Protection",
  type: "active",
  icon: "fas fa-shield-alt",
  caveat:
    "Active protection system. Can shield one normal system from deterioration damage and negative events for 3 turns, then requires 5 turns to recharge.",

  /**
   * Initialize the protection system with default state
   */
  initialize(gameState) {
    const updatedState = { ...gameState };

    // Initialize protection state in gameState instead of on the system object
    updatedState.protectionState = {
      isProtecting: false,
      targetSystem: null,
      protectionDuration: 3, // 3 deterioration cycles
      cooldownDuration: 5, // 5 deterioration cycles
      startDeteriorationCount: 0,
      endProtectionCount: 0,
      endCooldownCount: 0,
    };

    return updatedState;
  },

  /**
   * Custom UI rendering for the protection system
   */
  renderUI(container, gameState) {
    container.className = "system active-system";
    container.id = `system-${this.name.toLowerCase().replace(" ", "-")}`;
    container.setAttribute("data-system-name", this.name);

    const icon = this.icon || "fas fa-shield-alt";
    const { statusText, statusClass, isAvailable } =
      this.getProtectionStatus(gameState);
    const buttonHtml = isAvailable
      ? `<button class="action-button" data-action="activate">Activate</button>`
      : "";

    container.innerHTML = `
      <div class="system-header">
        <i class="${icon} system-icon"></i>
        <h3>${this.name}</h3>
      </div>
      <div class="active-system-content">
        <div class="caveat">${this.caveat}</div>
        <div class="protection-status ${statusClass}">${statusText}</div>
        ${buttonHtml}
      </div>
    `;

    return container;
  },

  /**
   * Update UI for the protection system
   */
  updateUI(container, gameState) {
    const statusElement = container.querySelector(".protection-status");
    const { statusText, statusClass, isAvailable } =
      this.getProtectionStatus(gameState);

    if (statusElement) {
      statusElement.textContent = statusText;
      statusElement.className = `protection-status ${statusClass}`;
    }

    // Update activation button
    this.renderActivationButton(container, isAvailable);
  },

  /**
   * Handle interactions with the protection system
   */
  async handleInteraction(action, gameState, config) {
    let updatedState = { ...gameState };
    const protectionState = updatedState.protectionState || {};

    if (action === "activate") {
      // Check if system is available
      const currentCount = gameState.deteriorationCount;
      const isOnCooldown =
        !protectionState.isProtecting &&
        currentCount < protectionState.endCooldownCount;
      if (protectionState.isProtecting || isOnCooldown) {
        updatedState.message = "Protection system is not ready to activate.";
        return updatedState;
      }

      // Enter system selection mode for normal systems
      const selectionCallback = async (selectedSystems) => {
        if (selectedSystems.length === 0) {
          return updatedState; // No system selected
        }

        const targetSystemName = selectedSystems[0];
        const targetSystem = updatedState.systems.find(
          (sys) => sys.name === targetSystemName
        );

        if (!targetSystem || targetSystem.type !== "normal") {
          updatedState.message = "Invalid target system selected.";
          return updatedState;
        }

        // Apply protection
        const currentCount = updatedState.deteriorationCount;
        updatedState.protectionState = {
          ...protectionState,
          isProtecting: true,
          targetSystem: targetSystemName,
          startDeteriorationCount: currentCount,
          endProtectionCount: currentCount + 3,
          endCooldownCount: currentCount + 3 + 5,
        };

        // Add damage modifiers for immunity to both deterioration and negative events
        updatedState = addDamageModifier(
          updatedState,
          targetSystemName,
          0, // Complete immunity
          "deterioration",
          3, // 3 deterioration cycles
          "protection" // Source identifier
        );

        updatedState = addDamageModifier(
          updatedState,
          targetSystemName,
          0, // Complete immunity
          "negative_events",
          3, // 3 deterioration cycles
          "protection" // Source identifier
        );

        // Immediately update protection overlay (use rAF to batch with render)
        requestAnimationFrame(() => {
          this.updateProtectionOverlay(updatedState);
        });

        updatedState.message = `Protection activated! ${targetSystemName} is now protected for 3 turns!`;
        return updatedState;
      };

      updatedState = enterSystemSelectionMode(updatedState, config, {
        allowedTypes: ["normal"],
        multiSelect: false,
        message: "Select a system to protect:",
        callback: selectionCallback,
      });

      // Set up visual indicators for system selection
      this.setupProtectionSelectionIndicators(updatedState);
    }

    return updatedState;
  },

  /**
   * Update the protection system each deterioration cycle
   */
  async update(gameState) {
    let updatedState = { ...gameState };
    const protectionState = updatedState.protectionState || {};
    const currentCount = updatedState.deteriorationCount;

    if (protectionState.isProtecting) {
      if (currentCount >= protectionState.endProtectionCount) {
        // Protection ended, start cooldown
        updatedState.protectionState = {
          ...protectionState,
          isProtecting: false,
          targetSystem: null,
        };

        // Remove protection damage modifiers (it should expire automatically, but ensure cleanup)
        updatedState = removeDamageModifiersBySource(
          updatedState,
          "protection"
        );

        updatedState.message =
          "Protection period ended. System entering recharge phase.";
      }
      // If still protecting, no changes needed to state
    } else if (currentCount < protectionState.endCooldownCount) {
      // Still in cooldown, no changes needed
      if (currentCount >= protectionState.endCooldownCount) {
        updatedState.message = "Protection system is ready to activate again.";
      }
    }

    // Update protection overlay based on current state
    this.updateProtectionOverlay(updatedState);

    return updatedState;
  },

  /**
   * Get the current protection status for UI rendering
   */
  getProtectionStatus(gameState) {
    const protectionState = gameState.protectionState || {};
    const currentCount = gameState.deteriorationCount;
    const isProtecting = protectionState.isProtecting;
    const isOnCooldown =
      !isProtecting && currentCount < protectionState.endCooldownCount;
    const isAvailable = !isProtecting && !isOnCooldown;

    let statusText = "";
    let statusClass = "";

    if (isProtecting) {
      const turnsLeft = Math.max(
        0,
        protectionState.endProtectionCount - currentCount
      );
      statusText = `Protecting: ${protectionState.targetSystem} (${turnsLeft} turns left)`;
      statusClass = "protecting";
    } else if (isOnCooldown) {
      const turnsLeft = Math.max(
        0,
        protectionState.endCooldownCount - currentCount
      );
      statusText = `Recharging: ${turnsLeft} turns left`;
      statusClass = "cooldown";
    } else {
      statusText = "Ready to activate";
      statusClass = "ready";
    }

    return { statusText, statusClass, isAvailable };
  },

  /**
   * Render or update the activation button
   */
  renderActivationButton(container, isAvailable) {
    const buttonContainer = container.querySelector(".active-system-content");
    let button = buttonContainer.querySelector(".action-button");

    if (isAvailable && !button) {
      button = document.createElement("button");
      button.className = "action-button";
      button.setAttribute("data-action", "activate");
      button.textContent = "Activate";
      buttonContainer.appendChild(button);
    } else if (!isAvailable && button) {
      button.remove();
    }
  },

  /**
   * Set up visual indicators for protection system selection
   */
  setupProtectionSelectionIndicators(gameState) {
    // Inject CSS animation if not already present
    injectProtectionAnimationCSS();

    // Remove any existing event listeners to prevent accumulation
    document.removeEventListener(
      "systemSelectionChanged",
      handleProtectionSelection
    );
    document.removeEventListener(
      "systemSelectionConfirmed",
      cleanupProtectionSelection
    );
    document.removeEventListener(
      "systemSelectionCancelled",
      cleanupProtectionSelection
    );

    // Add event listeners for system selection lifecycle
    document.addEventListener(
      "systemSelectionChanged",
      handleProtectionSelection
    );
    document.addEventListener(
      "systemSelectionConfirmed",
      cleanupProtectionSelection
    );
    document.addEventListener(
      "systemSelectionCancelled",
      cleanupProtectionSelection
    );

    // Initially update selection indicators based on current selection
    updateProtectionSelectionIndicators(gameState.selectedSystems || []);
  },

  /**
   * Update protection duration overlay based on protection state
   */
  updateProtectionOverlay(gameState) {
    const protectionState = gameState.protectionState || {};

    // Remove any existing protection overlays
    const existingOverlays = document.querySelectorAll(
      ".protection-shield-overlay"
    );
    existingOverlays.forEach((overlay) => overlay.remove());

    // Add overlay if protection is active
    if (protectionState.isProtecting && protectionState.targetSystem) {
      const targetSystemElement = document.querySelector(
        `[data-system-name="${protectionState.targetSystem}"]`
      );

      if (targetSystemElement) {
        const currentCount = gameState.deteriorationCount;
        const turnsLeft = Math.max(
          0,
          protectionState.endProtectionCount - currentCount
        );
        createProtectionOverlay(targetSystemElement, turnsLeft);
      }
    }
  },
};

/**
 * Inject CSS animation for protection visual indicators if not already present
 */
function injectProtectionAnimationCSS() {
  // Check if animation is already injected
  if (document.getElementById("protection-visual-indicators")) {
    return;
  }

  // Create style element with animations
  const style = document.createElement("style");
  style.id = "protection-visual-indicators";
  style.textContent = `
    @keyframes shield-float {
      0% {
        transform: translate(-50%, -50%) translateY(0px);
      }
      50% {
        transform: translate(-50%, -50%) translateY(-8px);
      }
      100% {
        transform: translate(-50%, -50%) translateY(0px);
      }
    }

    @keyframes protection-shield-pulse {
      0% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 0.8;
      }
      50% {
        transform: translate(-50%, -50%) scale(1.1);
        opacity: 1;
      }
      100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 0.8;
      }
    }

    @keyframes protection-selection-glow {
      0% {
        box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7), 0 8px 16px rgba(0, 0, 0, 0.4);
      }
      50% {
        box-shadow: 0 0 20px rgba(0, 123, 255, 0.9), 0 12px 24px rgba(0, 0, 0, 0.5);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7), 0 8px 16px rgba(0, 0, 0, 0.4);
      }
    }

    .protection-selection-active {
      animation: protection-selection-glow 2s ease-in-out infinite;
      border-color: #007bff !important;
      box-shadow: 0 0 15px rgba(0, 123, 255, 0.6), 0 8px 16px rgba(0, 0, 0, 0.4) !important;
      z-index: 1005 !important;
      position: relative !important;
    }
  `;

  // Inject into document head
  document.head.appendChild(style);
}

/**
 * Handle system selection change events to update protection selection indicators
 */
function handleProtectionSelection(event) {
  const selectedSystems = event.detail.selectedSystems;
  updateProtectionSelectionIndicators(selectedSystems);
}

/**
 * Update protection selection indicators to show shield icon on selected systems
 */
function updateProtectionSelectionIndicators(selectedSystems) {
  // Remove any existing selection shield overlays
  const existingSelectionOverlays = document.querySelectorAll(
    ".protection-selection-shield"
  );
  existingSelectionOverlays.forEach((overlay) => overlay.remove());

  // Add shield overlay to selected systems
  selectedSystems.forEach((systemName) => {
    const systemElement = document.querySelector(
      `[data-system-name="${systemName}"]`
    );
    if (systemElement) {
      createSelectionShieldOverlay(systemElement);
    }
  });
}

/**
 * Create a protection shield overlay with pulse animation and turn counter
 */
function createProtectionOverlay(systemElement, turnsLeft) {
  // Create overlay container
  const overlay = document.createElement("div");
  overlay.className = "protection-shield-overlay";
  overlay.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1003;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    opacity: 0.5;
    animation: shield-float 3s ease-in-out infinite;
  `;

  // Add large shield icon
  const icon = document.createElement("i");
  icon.className = "fas fa-shield-alt";
  icon.style.cssText = `
    color: #4dabf7;
    font-size: 100px;
    text-shadow: 0 0 20px rgba(77, 171, 247, 0.8), 0 0 40px rgba(77, 171, 247, 0.6);
    filter: drop-shadow(0 0 10px rgba(77, 171, 247, 0.5));
  `;
  overlay.appendChild(icon);

  // Add turn counter
  const counter = document.createElement("div");
  counter.className = "protection-turns-counter";
  counter.textContent = turnsLeft.toString();
  counter.style.cssText = `
    position: absolute;
    background: rgba(255, 255, 255, 0.9);
    color: #4dabf7;
    border-radius: 100%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    font-weight: bold;
    border: 1px solid #4dabf7;
  `;
  overlay.appendChild(counter);

  // Position overlay on system element
  systemElement.style.position = "relative";
  systemElement.appendChild(overlay);
}

/**
 * Create a selection shield overlay with large transparent shield icon
 */
function createSelectionShieldOverlay(systemElement) {
  // Create overlay container
  const overlay = document.createElement("div");
  overlay.className = "protection-selection-shield";
  overlay.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1004;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    opacity: 0.25;
    animation: shield-float 3s ease-in-out infinite;
  `;

  // Add large shield icon
  const icon = document.createElement("i");
  icon.className = "fas fa-shield-alt";
  icon.style.cssText = `
    color: #4dabf7;
    font-size: 100px;
    text-shadow: 0 0 20px rgba(77, 171, 247, 0.8), 0 0 40px rgba(77, 171, 247, 0.6);
    filter: drop-shadow(0 0 10px rgba(77, 171, 247, 0.5));
  `;
  overlay.appendChild(icon);

  // Position overlay on system element
  systemElement.style.position = "relative";
  systemElement.appendChild(overlay);
}

/**
 * Clean up all protection selection indicators when selection mode ends
 */
function cleanupProtectionSelection() {
  // Remove all selection shield overlays
  const selectionOverlays = document.querySelectorAll(
    ".protection-selection-shield"
  );
  selectionOverlays.forEach((overlay) => overlay.remove());

  // Remove event listeners
  document.removeEventListener(
    "systemSelectionChanged",
    handleProtectionSelection
  );
  document.removeEventListener(
    "systemSelectionConfirmed",
    cleanupProtectionSelection
  );
  document.removeEventListener(
    "systemSelectionCancelled",
    cleanupProtectionSelection
  );
}
