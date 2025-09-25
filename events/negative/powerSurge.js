/**
 * Power Surge negative event module.
 * This module contains all data and functionality for the Power Surge event.
 * A power surge overloads the systems, causing damage.
 */
export const powerSurge = {
  description: "A power surge overloads the electrical systems!",

  /**
   * Applies the power surge effect to the game state.
   * @param {Object} state - The current game state
   * @returns {Object} The updated game state
   */
  apply(state) {
    const updatedState = { ...state };
    // Damage all systems by 20 points, but power system takes extra damage
    updatedState.systems = updatedState.systems.map((system) => {
      if (system.name === "Power") {
        return { ...system, health: Math.max(0, system.health - 40) };
      } else {
        return { ...system, health: Math.max(0, system.health - 20) };
      }
    });
    return updatedState;
  },
};
