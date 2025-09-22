/**
 * Oxygen Leak negative event data.
 * This module exports the configuration for the Oxygen Leak event.
 * An oxygen leak rapidly depletes life support.
 */
export const oxygenLeak = {
  description: "An oxygen leak is detected in the life support system!",
  effect: (state) => {
    // Find life support system and damage it heavily
    const lifeSupport = state.systems.find(system => system.name === "Life Support");
    if (lifeSupport) {
      lifeSupport.health = Math.max(0, lifeSupport.health - 50);
    }
    return state;
  }
};
