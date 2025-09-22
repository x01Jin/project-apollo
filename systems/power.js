/**
 * Power system data.
 * This module exports the configuration for the Power system.
 * The Power system provides energy to all other systems.
 * It deteriorates slowly but affects overall ship functionality.
 */
export const power = {
  name: "Power",
  deteriorationRate: 10,
  caveat: "Provides energy to all systems. Low power increases deterioration rates of other systems."
};
