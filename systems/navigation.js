/**
 * Navigation system data.
 * This module exports the configuration for the Navigation system.
 * The Navigation system handles ship positioning and rescue coordination.
 * It deteriorates quickly but is essential for the rescue mission.
 */
export const navigation = {
  name: "Navigation",
  deteriorationRate: 20,
  caveat: "Handles ship positioning and rescue signals. Failure may delay rescue arrival."
};
