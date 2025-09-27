/**
 * Registry Configuration for HTML5 Game
 * This file contains the registry configuration that can be easily edited
 * when adding new game components (systems, events, etc.)
 */

// Import the registry utilities from the setup folder
import {
  loadGameModules as _loadGameModules,
  default as ModuleRegistry,
  MODULE_INTERFACES,
} from "./src/setup/registryUtils.js";

// Registry configuration - edit this when adding new components
const registryConfig = {
  systems: [
    "../../systems/lifeSupport.js",
    "../../systems/power.js",
    "../../systems/navigation.js",
    "../../systems/shields.js",
    "../../systems/comms.js",
    "../../systems/protection.js",
  ],
  positiveEvents: [
    "../../events/positive/solarFlare.js",
    "../../events/positive/supplyCache.js",
    "../../events/positive/alienSignal.js",
    "../../events/positive/motivated.js",
  ],
  negativeEvents: [
    "../../events/negative/meteorShower.js",
    "../../events/negative/powerSurge.js",
    "../../events/negative/oxygenLeak.js",
  ],
};

/**
 * Convenience function to create and load registry with default config
 * @param {Object} config - Additional registry configuration to merge with defaults
 * @param {Object} options - Registry options
 * @returns {Promise<Object>} Game configuration object
 */
export async function loadGameModules(config = {}, options = {}) {
  // Merge the default registry config with any additional config
  const mergedConfig = {
    ...registryConfig,
    ...config,
    systems: [...registryConfig.systems, ...(config.systems || [])],
    positiveEvents: [
      ...registryConfig.positiveEvents,
      ...(config.positiveEvents || []),
    ],
    negativeEvents: [
      ...registryConfig.negativeEvents,
      ...(config.negativeEvents || []),
    ],
  };

  return await _loadGameModules(mergedConfig, options);
}

/**
 * Default export - creates a new registry instance
 */
export default ModuleRegistry;

// Export interfaces for external use
export { MODULE_INTERFACES };

// Export the registry config for external access if needed
export { registryConfig };
