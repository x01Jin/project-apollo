/**
 * Meteor Shower negative event module.
 * This module contains all data and functionality for the Meteor Shower event.
 * A meteor shower damages the ship's hull and systems.
 */
import { isSystemImmune } from "../../src/mechanics/damageModifiers.js";

export const meteorShower = {
  description: "A meteor shower strikes the ship, damaging the hull!",

  /**
   * Applies the meteor shower effect to the game state.
   * @param {Object} state - The current game state
   * @returns {Object} The updated game state
   */
  apply(state) {
    const updatedState = { ...state };
    // Damage all systems by 30 points, but skip protected systems
    updatedState.systems = updatedState.systems.map((system) => {
      if (isSystemImmune(system.name, "negative_events", updatedState)) {
        return system; // Protected system takes no damage
      }
      return {
        ...system,
        health: Math.max(0, system.health - 30),
      };
    });
    return updatedState;
  },
};
