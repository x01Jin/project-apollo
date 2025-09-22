/**
 * Solar Flare positive event module.
 * This module contains all data and functionality for the Solar Flare event.
 * A solar flare provides a burst of energy that heals all systems.
 */
export const solarFlare = {
  description: "A solar flare passes by, providing a burst of clean energy!",

  /**
   * Applies the solar flare effect to the game state.
   * @param {Object} state - The current game state
   * @returns {Object} The updated game state
   */
  apply(state) {
    const updatedState = { ...state };
    // Heal all systems by 20 points, capped at 100
    updatedState.systems = updatedState.systems.map(system => ({
      ...system,
      health: Math.min(100, system.health + 20)
    }));
    return updatedState;
  }
};
