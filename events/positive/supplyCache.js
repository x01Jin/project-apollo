/**
 * Supply Cache positive event module.
 * This module contains all data and functionality for the Supply Cache event.
 * Discovering a supply cache provides resources to repair systems.
 */
export const supplyCache = {
  description: "You discover an abandoned supply cache with repair parts!",

  /**
   * Applies the supply cache effect to the game state.
   * @param {Object} state - The current game state
   * @returns {Object} The updated game state
   */
  apply(state) {
    const updatedState = { ...state };
    // Randomly select one system and fully repair it
    const randomIndex = Math.floor(Math.random() * updatedState.systems.length);
    updatedState.systems[randomIndex].health = 100;
    return updatedState;
  },
};
