/**
 * Alien Signal positive event module.
 * This module contains all data and functionality for the Alien Signal event.
 * An alien signal provides advanced technology to stabilize systems.
 */
export const alienSignal = {
  description: "You intercept an alien signal with advanced repair algorithms!",

  /**
   * Applies the alien signal effect to the game state.
   * @param {Object} state - The current game state
   * @returns {Object} The updated game state
   */
  apply(state) {
    const updatedState = { ...state };
    // Heal all systems by 15 points using alien technology, capped at 100
    updatedState.systems = updatedState.systems.map((system) => ({
      ...system,
      health: Math.min(100, system.health + 15),
    }));
    return updatedState;
  },
};
