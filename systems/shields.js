/**
 * Shields system module.
 * This module contains all data and functionality for the Shields system.
 * The Shields system provides damage reduction against negative events based on shields health.
 * It deteriorates moderately and provides protection when active.
 */
export const shields = {
  name: "Shields",
  type: "normal",
  icon: "fas fa-shield-alt",
  caveat:
    "Provides damage reduction against negative events based on shields health.",

  /**
   * Updates shields each turn to apply damage modifiers for negative events.
   * @param {Object} gameState - The current game state
   * @returns {Object} The updated game state
   */
  async update(gameState) {
    // Import damage modifier functions
    const { addDamageModifier, removeDamageModifiers } = await import(
      "../src/mechanics/damageModifiers.js"
    );

    let updatedState = { ...gameState };
    const shieldsSystem = updatedState.systems.find(
      (sys) => sys.name === this.name
    );

    if (shieldsSystem) {
      // Remove existing shields damage modifiers
      updatedState = removeDamageModifiers(updatedState, "Shields");

      // Add new damage modifier based on shields health
      if (shieldsSystem.health > 0) {
        let modifier = 1; // No reduction by default

        if (shieldsSystem.health >= 90) {
          modifier = 0.5; // 50% damage reduction
        } else if (shieldsSystem.health >= 75) {
          modifier = 0.75; // 25% damage reduction
        } else if (shieldsSystem.health >= 50) {
          modifier = 0.9; // 10% damage reduction
        }

        // Only add modifier if it provides actual protection
        if (modifier < 1) {
          updatedState = addDamageModifier(
            updatedState,
            "all", // Protect all systems
            modifier,
            "negative_events", // Only protect against negative events
            1 // Lasts for 1 turn (reapplied each turn)
          );
        }
      }
    }

    return updatedState;
  },

  /**
   * Deteriorates the shields system.
   * @param {Object} state - The current game state
   * @returns {Object} The updated game state
   */
  deteriorate(state) {
    const updatedState = { ...state };
    const shieldsSystem = updatedState.systems.find(
      (sys) => sys.name === this.name
    );

    if (shieldsSystem) {
      // Deteriorate shields by 10 points
      shieldsSystem.health = Math.max(0, shieldsSystem.health - 10);
    }

    return updatedState;
  },

  /**
   * Fixes the shields system to full health.
   * @param {Object} state - The current game state
   * @returns {Object} The updated game state
   */
  fix(state) {
    const updatedState = { ...state };
    const shieldsSystem = updatedState.systems.find(
      (sys) => sys.name === this.name
    );

    if (shieldsSystem) {
      shieldsSystem.health = 100;
    }

    return updatedState;
  },
};
