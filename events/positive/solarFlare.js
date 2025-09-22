/**
 * Solar Flare positive event data.
 * This module exports the configuration for the Solar Flare event.
 * A solar flare provides a burst of energy that heals all systems.
 */
export const solarFlare = {
  description: "A solar flare passes by, providing a burst of clean energy!",
  effect: (state) => {
    // Heal all systems by 20 points, capped at 100
    state.systems.forEach(system => {
      system.health = Math.min(100, system.health + 20);
    });
    return state;
  }
};
