/**
 * Configuration module for the survival game.
 * This module aggregates all system and event data into a single configuration object.
 * It imports data from the systems and events folders to provide a centralized config.
 * The config is data-driven, allowing easy addition of new systems and events.
 *
 * @returns {Object} The game configuration containing systems and events arrays.
 */
export async function getConfig() {
  // Import system configurations using static imports for synchronous loading
  const { lifeSupport } = await import('./systems/lifeSupport.js');
  const { power } = await import('./systems/power.js');
  const { navigation } = await import('./systems/navigation.js');
  const { shields } = await import('./systems/shields.js');
  const { comms } = await import('./systems/comms.js');

  // Import positive event configurations
  const { solarFlare } = await import('./events/positive/solarFlare.js');
  const { supplyCache } = await import('./events/positive/supplyCache.js');
  const { alienSignal } = await import('./events/positive/alienSignal.js');

  // Import negative event configurations
  const { meteorShower } = await import('./events/negative/meteorShower.js');
  const { powerSurge } = await import('./events/negative/powerSurge.js');
  const { oxygenLeak } = await import('./events/negative/oxygenLeak.js');

  // Aggregate the imported data into arrays
  const systems = [lifeSupport, power, navigation, shields, comms];
  const positiveEvents = [solarFlare, supplyCache, alienSignal];
  const negativeEvents = [meteorShower, powerSurge, oxygenLeak];

  // Return the complete configuration object
  return {
    systems: systems,
    positiveEvents: positiveEvents,
    negativeEvents: negativeEvents
  };
}
