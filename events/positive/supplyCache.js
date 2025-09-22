/**
 * Supply Cache positive event data.
 * This module exports the configuration for the Supply Cache event.
 * Discovering a supply cache provides resources to repair systems.
 */
export const supplyCache = {
  description: "You discover an abandoned supply cache with repair parts!",
  effect: (state) => {
    // Randomly select one system and fully repair it
    const randomIndex = Math.floor(Math.random() * state.systems.length);
    state.systems[randomIndex].health = 100;
    return state;
  }
};
