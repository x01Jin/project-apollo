/**
 * Power Surge negative event data.
 * This module exports the configuration for the Power Surge event.
 * A power surge overloads the systems, causing damage.
 */
export const powerSurge = {
  description: "A power surge overloads the electrical systems!",
  effect: (state) => {
    // Damage all systems by 20 points, but power system takes extra damage
    state.systems.forEach(system => {
      if (system.name === "Power") {
        system.health = Math.max(0, system.health - 40);
      } else {
        system.health = Math.max(0, system.health - 20);
      }
    });
    return state;
  }
};
