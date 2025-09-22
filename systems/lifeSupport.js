/**
 * Life Support system data.
 * This module exports the configuration for the Life Support system.
 * The Life Support system is critical for crew survival.
 * It deteriorates moderately and has a caveat about immediate failure.
 */
export const lifeSupport = {
  name: "Life Support",
  deteriorationRate: 15,
  caveat: "Critical for survival. If this system fails completely, the game ends immediately."
};
