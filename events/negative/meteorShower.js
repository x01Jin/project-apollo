/**
 * Meteor Shower negative event data.
 * This module exports the configuration for the Meteor Shower event.
 * A meteor shower damages the ship's hull and systems.
 */
export const meteorShower = {
  description: "A meteor shower strikes the ship, damaging the hull!",
  effect: (state) => {
    // Damage all systems by 30 points
    state.systems.forEach(system => {
      system.health = Math.max(0, system.health - 30);
    });
    return state;
  }
};
