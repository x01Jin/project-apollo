/**
 * Navigation system module.
 * This module contains all data and functionality for the Navigation system.
 * The Navigation system handles ship positioning and rescue coordination.
 * It deteriorates quickly but is essential for the rescue mission.
 */
export const navigation = {
  name: "Navigation",
  type: "normal",
  icon: "fas fa-compass",
  caveat:
    "Handles ship positioning and rescue signals. Failure may delay rescue arrival.",

  /**
   * Deteriorates the navigation system.
   * @param {Object} state - The current game state
   * @returns {Object} The updated game state
   */
  deteriorate(state) {
    const updatedState = { ...state };
    const navigationSystem = updatedState.systems.find(
      (sys) => sys.name === this.name
    );

    if (navigationSystem) {
      // Deteriorate navigation by 20 points
      navigationSystem.health = Math.max(0, navigationSystem.health - 20);

      // Check if Comms system is healthy and can counter the decrement
      const commsSystem = updatedState.systems.find(
        (sys) => sys.name === "Comms"
      );
      if (commsSystem && commsSystem.health > 0) {
        // Comms counters the turn decrement, so skip the turn logic
        return updatedState;
      }

      // Check navigation health and potentially prevent turn increase
      let chance = 0;
      if (navigationSystem.health <= 0) {
        chance = 0.9; // 90% chance when dead
      } else if (navigationSystem.health <= 25) {
        chance = 0.75; // 75% chance at 25% health
      } else if (navigationSystem.health <= 50) {
        chance = 0.5; // 50% chance at 50% health
      } else if (navigationSystem.health <= 75) {
        chance = 0.25; // 25% chance at 75% health
      }

      if (Math.random() < chance) {
        // Prevent turn increase by decrementing it back
        updatedState.turn = Math.max(1, updatedState.turn - 1);
      }
    }

    return updatedState;
  },

  /**
   * Fixes the navigation system to full health.
   * @param {Object} state - The current game state
   * @returns {Object} The updated game state
   */
  fix(state) {
    const updatedState = { ...state };
    const navigationSystem = updatedState.systems.find(
      (sys) => sys.name === this.name
    );

    if (navigationSystem) {
      navigationSystem.health = 100;
    }

    return updatedState;
  },
};
