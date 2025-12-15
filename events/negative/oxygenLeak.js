/**
 * Oxygen Leak negative event module.
 * This module contains all data and functionality for the Oxygen Leak event.
 * An oxygen leak rapidly depletes life support.
 */
import { isSystemImmune } from "../../src/mechanics/damageModifiers.js";

export const oxygenLeak = {
  description: "An oxygen leak is detected in the life support system!",

  /**
   * Applies the oxygen leak effect to the game state.
   * @param {Object} state - The current game state
   * @returns {Object} The updated game state
   */
  apply(state) {
    const updatedState = { ...state };
    // Find life support system and damage it heavily, but skip if protected
    const lifeSupportIndex = updatedState.systems.findIndex(
      (system) => system.name === "Life Support"
    );
    if (
      lifeSupportIndex !== -1 &&
      !isSystemImmune("Life Support", "negative_events", updatedState)
    ) {
      updatedState.systems[lifeSupportIndex].health = Math.max(
        0,
        updatedState.systems[lifeSupportIndex].health - 35
      );
    }
    return updatedState;
  },
};
