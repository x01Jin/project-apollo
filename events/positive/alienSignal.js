/**
 * Alien Signal positive event data.
 * This module exports the configuration for the Alien Signal event.
 * An alien signal provides advanced technology to stabilize systems.
 */
export const alienSignal = {
  description: "You intercept an alien signal with advanced repair algorithms!",
  effect: (state) => {
    // Reduce deterioration rates for all systems by 5 for this turn
    state.systems.forEach(system => {
      system.deteriorationRate = Math.max(0, system.deteriorationRate - 5);
    });
    return state;
  }
};
