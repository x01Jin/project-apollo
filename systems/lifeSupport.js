/**
 * Life Support system module.
 * This module contains all data and functionality for the Life Support system.
 * The Life Support system is critical for crew survival.
 * It deteriorates moderately and causes immediate game over if it fails.
 */
export const lifeSupport = {
  name: "Life Support",
  icon: "fas fa-lungs",
  caveat: "Critical for survival. If this system fails completely, the game ends immediately.",

  /**
   * Deteriorates the life support system and checks for critical failure.
   * @param {Object} state - The current game state
   * @returns {Object} The updated game state
   */
  deteriorate(state) {
    const updatedState = { ...state };
    const lifeSupportSystem = updatedState.systems.find(sys => sys.name === this.name);

    if (lifeSupportSystem) {
      // Deteriorate life support by 15 points
      lifeSupportSystem.health = Math.max(0, lifeSupportSystem.health - 15);

      // Check for critical failure
      if (lifeSupportSystem.health <= 0) {
        updatedState.gameOver = true;
        updatedState.message = 'Life Support has failed! Game Over.';
      }
    }

    return updatedState;
  },

  /**
   * Fixes the life support system to full health.
   * @param {Object} state - The current game state
   * @returns {Object} The updated game state
   */
  fix(state) {
    const updatedState = { ...state };
    const lifeSupportSystem = updatedState.systems.find(sys => sys.name === this.name);

    if (lifeSupportSystem) {
      lifeSupportSystem.health = 100;
    }

    return updatedState;
  }
};
