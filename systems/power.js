/**
 * Power system module.
 * This module contains all data and functionality for the Power system.
 * The Power system provides energy to all other systems.
 * It deteriorates slowly but affects overall ship functionality.
 */
export const power = {
  name: "Power",
  type: "normal",
  icon: "fas fa-bolt",
  caveat:
    "Provides energy to all systems. Low power increases deterioration rates of other systems.",

  /**
   * Deteriorates the power system and applies effects to other systems if power is low.
   * @param {Object} state - The current game state
   * @returns {Object} The updated game state
   */
  deteriorate(state) {
    const updatedState = { ...state };
    const powerSystem = updatedState.systems.find(
      (sys) => sys.name === this.name
    );

    if (powerSystem) {
      // Deteriorate power system by 10 points
      powerSystem.health = Math.max(0, powerSystem.health - 10);

      // If power is low (<50), increase deterioration of other systems
      if (powerSystem.health < 50) {
        updatedState.systems = updatedState.systems.map((system) => {
          if (system.name !== this.name) {
            return {
              ...system,
              health: Math.max(0, system.health - 5), // Extra 5 damage
            };
          }
          return system;
        });
      }
    }

    return updatedState;
  },

  /**
   * Fixes the power system to full health.
   * @param {Object} state - The current game state
   * @returns {Object} The updated game state
   */
  fix(state) {
    const updatedState = { ...state };
    const powerSystem = updatedState.systems.find(
      (sys) => sys.name === this.name
    );

    if (powerSystem) {
      powerSystem.health = 100;
    }

    return updatedState;
  },
};
