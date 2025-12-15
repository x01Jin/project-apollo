/**
 * Damage Modifiers module for the survival game.
 * This module handles damage reduction and protection modifiers that can be applied to systems.
 * Modifiers can protect against deterioration and negative events.
 */

/**
 * Adds a damage modifier to the game state
 * @param {Object} gameState - The current game state
 * @param {string} systemName - The name of the system to protect
 * @param {number} modifier - Damage modifier (0 = immune, 0.5 = 50% reduction, etc.)
 * @param {string} type - Type of damage to modify ('deterioration', 'negative_events', or 'all')
 * @param {number} turnsLeft - How many turns the modifier lasts
 * @param {string} source - Optional source identifier for the modifier (e.g., 'protection')
 * @returns {Object} The updated game state
 */
export function addDamageModifier(
  gameState,
  systemName,
  modifier,
  type,
  turnsLeft,
  source = null
) {
  const updatedState = { ...gameState };

  // Initialize damageModifiers array if it doesn't exist
  if (!updatedState.damageModifiers) {
    updatedState.damageModifiers = [];
  }

  // Add the new modifier
  updatedState.damageModifiers.push({
    systemName,
    modifier,
    type,
    turnsLeft,
    source,
  });

  return updatedState;
}

/**
 * Updates damage modifiers, removing expired ones
 * @param {Object} gameState - The current game state
 * @returns {Object} The updated game state
 */
export function updateDamageModifiers(gameState) {
  const updatedState = { ...gameState };

  if (!updatedState.damageModifiers) {
    updatedState.damageModifiers = [];
    return updatedState;
  }

  // Store previous modifiers for comparison
  const previousModifiers = [...updatedState.damageModifiers];

  // Update turns left and remove expired modifiers
  updatedState.damageModifiers = updatedState.damageModifiers
    .map((modifier) => ({
      ...modifier,
      turnsLeft: modifier.turnsLeft - 1,
    }))
    .filter((modifier) => modifier.turnsLeft > 0);

  // Emit event for systems that need to respond to modifier changes
  if (
    previousModifiers.length !== updatedState.damageModifiers.length ||
    JSON.stringify(previousModifiers) !==
      JSON.stringify(updatedState.damageModifiers)
  ) {
    // Dispatch custom event for damage modifier changes
    const event = new CustomEvent("damageModifiersUpdated", {
      detail: {
        previousModifiers,
        currentModifiers: updatedState.damageModifiers,
        gameState: updatedState,
      },
    });
    document.dispatchEvent(event);
  }

  return updatedState;
}

/**
 * Gets the effective damage modifier for a system and damage type
 * @param {string} systemName - The name of the system
 * @param {string} damageType - The type of damage ('deterioration' or 'negative_events')
 * @param {Object} gameState - The current game state
 * @returns {number} The damage modifier (0 = immune, 1 = full damage)
 */
export function getDamageModifier(systemName, damageType, gameState) {
  if (!gameState.damageModifiers) {
    return 1; // Full damage by default
  }

  // Find all applicable modifiers for this system and damage type
  // Support global modifiers targeting `all` so shields and similar systems
  // can protect every system without adding a modifier per-system.
  const applicableModifiers = gameState.damageModifiers.filter((modifier) => {
    // Allow modifiers targeted at the specific system or globally at "all"
    const targetMatch =
      modifier.systemName === systemName || modifier.systemName === "all";
    const typeMatch = modifier.type === damageType || modifier.type === "all";
    return targetMatch && typeMatch;
  });

  if (applicableModifiers.length === 0) {
    return 1; // Full damage if no modifiers
  }

  // Combine modifiers (multiply them together for cumulative effect)
  // Lower modifier values provide more protection (0 = immune, 0.5 = half damage)
  return applicableModifiers.reduce(
    (totalModifier, modifier) => totalModifier * modifier.modifier,
    1
  );
}

/**
 * Checks if a system is immune to a specific damage type
 * @param {string} systemName - The name of the system
 * @param {string} damageType - The type of damage ('deterioration' or 'negative_events')
 * @param {Object} gameState - The current game state
 * @returns {boolean} True if the system is immune
 */
export function isSystemImmune(systemName, damageType, gameState) {
  const modifier = getDamageModifier(systemName, damageType, gameState);
  return modifier === 0;
}

/**
 * Removes all damage modifiers for a specific system
 * @param {Object} gameState - The current game state
 * @param {string} systemName - The name of the system
 * @returns {Object} The updated game state
 */
export function removeDamageModifiers(gameState, systemName) {
  const updatedState = { ...gameState };

  if (!updatedState.damageModifiers) {
    return updatedState;
  }

  // Remove all modifiers for the specified system
  updatedState.damageModifiers = updatedState.damageModifiers.filter(
    (modifier) => modifier.systemName !== systemName
  );

  return updatedState;
}

/**
 * Removes damage modifiers by source identifier
 * @param {Object} gameState - The current game state
 * @param {string} source - The source identifier to remove modifiers for
 * @returns {Object} The updated game state
 */
export function removeDamageModifiersBySource(gameState, source) {
  const updatedState = { ...gameState };

  if (!updatedState.damageModifiers) {
    return updatedState;
  }

  // Remove all modifiers with the specified source
  updatedState.damageModifiers = updatedState.damageModifiers.filter(
    (modifier) => modifier.source !== source
  );

  return updatedState;
}

/**
 * Gets all active damage modifiers for debugging/display
 * @param {Object} gameState - The current game state
 * @returns {Array} Array of active damage modifiers
 */
export function getActiveModifiers(gameState) {
  return gameState.damageModifiers || [];
}
