import { updateUI } from "../core/updateUI.js";

/**
 * Enter system selection mode with type-based filtering and customizable options.
 */
export function enterSystemSelectionMode(gameState, config, options = {}) {
  if (!gameState || !config || !options.allowedTypes) {
    throw new Error("Invalid parameters");
  }

  const updatedState = { ...gameState };
  updatedState.systemSelectionMode = true;
  updatedState.systemSelectionOptions = {
    allowedTypes: options.allowedTypes,
    multiSelect: options.multiSelect || false,
    maxSelections: options.maxSelections || null,
    callback: options.callback || null,
    message: options.message || "Select systems...",
    systemFilter: options.systemFilter || null,
    showCancelButton: options.showCancelButton !== false,
  };
  updatedState.selectedSystems = [];
  updatedState.message = options.message || "Select systems...";
  updatedState.interactiveMode = true;

  updateUI(updatedState, config);
  return updatedState;
}

/**
 * Exit system selection mode and resume normal game flow.
 */
export function exitSystemSelectionMode(gameState) {
  const updatedState = { ...gameState };
  updatedState.systemSelectionMode = false;
  updatedState.systemSelectionOptions = null;
  updatedState.selectedSystems = null;
  updatedState.interactiveMode = false;
  removeSelectionUI();
  return updatedState;
}

/**
 * Handle system selection/deselection.
 */
export function selectSystem(gameState, systemName) {
  if (!gameState.systemSelectionMode) return gameState;

  const system = gameState.systems.find((s) => s.name === systemName);
  if (!system) return gameState;

  const allowedTypes = gameState.systemSelectionOptions.allowedTypes;
  if (!allowedTypes.includes(system.type || "normal")) return gameState;

  const updatedState = { ...gameState };
  const options = updatedState.systemSelectionOptions;

  if (options.multiSelect) {
    if (updatedState.selectedSystems.includes(systemName)) {
      updatedState.selectedSystems = updatedState.selectedSystems.filter(
        (name) => name !== systemName
      );
    } else if (
      !options.maxSelections ||
      updatedState.selectedSystems.length < options.maxSelections
    ) {
      updatedState.selectedSystems = [
        ...updatedState.selectedSystems,
        systemName,
      ];
    }
  } else {
    // For single select, allow deselection by clicking selected system
    if (updatedState.selectedSystems.includes(systemName)) {
      updatedState.selectedSystems = [];
    } else {
      updatedState.selectedSystems = [systemName];
    }
  }

  return updatedState;
}

/**
 * Confirm the current system selection and exit selection mode.
 */
export async function confirmSystemSelection(gameState) {
  if (!gameState.systemSelectionMode) return gameState;

  const selectedSystems = gameState.selectedSystems || [];
  const callback = gameState.systemSelectionOptions.callback;
  let updatedState = { ...gameState };

  if (callback && typeof callback === "function") {
    try {
      const result = await callback(selectedSystems, updatedState);
      if (result && typeof result === "object") {
        updatedState = result;
      }
    } catch (error) {
      console.error("Error in system selection callback:", error);
    }
  }

  updatedState = exitSystemSelectionMode(updatedState);
  if (!updatedState.message || updatedState.message === gameState.message) {
    updatedState.message = `Selected ${selectedSystems.length} system(s)`;
  }

  updateUI(updatedState);
  return updatedState;
}

/**
 * Cancel system selection and exit selection mode without applying changes.
 */
export function cancelSystemSelection(gameState) {
  if (!gameState.systemSelectionMode) return gameState;

  const updatedState = exitSystemSelectionMode(gameState);
  updatedState.message = "System selection cancelled";
  updateUI(updatedState);
  return updatedState;
}

/**
 * Remove selection UI elements from the DOM.
 */
function removeSelectionUI() {
  // Remove selection overlay
  const overlay = document.getElementById("system-selection-overlay");
  if (overlay) {
    overlay.remove();
  }

  // Remove selection controls
  const controls = document.getElementById("system-selection-controls");
  if (controls) {
    controls.remove();
  }

  // Remove selection classes from body
  document.body.classList.remove("system-selection-active");
}
