/**
 * Meteor Shower negative event module.
 * This module contains all data and functionality for the Meteor Shower event.
 * A meteor shower damages the ship's hull and systems.
 */
export const meteorShower = {
  description: "A meteor shower strikes the ship, damaging the hull!",

  /**
   * Applies the meteor shower effect to the game state.
   * @param {Object} state - The current game state
   * @returns {Object} The updated game state
   */
  apply(state) {
    const updatedState = { ...state };
    // Damage all systems by 30 points
    updatedState.systems = updatedState.systems.map(system => ({
      ...system,
      health: Math.max(0, system.health - 30)
    }));
    return updatedState;
  }
};
