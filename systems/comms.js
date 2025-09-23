/**
 * Comms system module.
 * This module contains all data and functionality for the Comms system.
 * The Comms system handles communication and provides extra turn chances.
 * It can also counter navigation system turn decrements when healthy.
 */
export const comms = {
  name: "Comms",
  icon: "fas fa-signal",
  caveat: "Handles communication systems. Provides chance for extra turns and protects against navigation failures.",

  /**
   * Deteriorates the comms system.
   * @param {Object} state - The current game state
   * @returns {Object} The updated game state
   */
  deteriorate(state) {
    const updatedState = { ...state };
    const commsSystem = updatedState.systems.find(sys => sys.name === this.name);

    if (commsSystem) {
      // Deteriorate comms by 20 points
      commsSystem.health = Math.max(0, commsSystem.health - 20);

      // 25% chance to give an extra turn
      if (Math.random() < 0.25) {
        updatedState.turn += 1;
      }
    }

    return updatedState;
  },

  /**
   * Fixes the comms system to full health.
   * @param {Object} state - The current game state
   * @returns {Object} The updated game state
   */
  fix(state) {
    const updatedState = { ...state };
    const commsSystem = updatedState.systems.find(sys => sys.name === this.name);

    if (commsSystem) {
      commsSystem.health = 100;
    }

    return updatedState;
  }
};
