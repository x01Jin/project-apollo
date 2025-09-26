/**
 * Game State module for the survival game.
 * This module is responsible for creating and managing the initial game state.
 * It takes the configuration object and initializes the game with default values.
 * The game state includes the current turn, system statuses, and other game variables.
 *
 * @param {Object} config - The game configuration object containing systems and events.
 * @returns {Object} The initial game state object.
 */
export async function createGameState(config) {
  // Validate the config object to ensure it has the required properties
  if (!config || !config.systems || !Array.isArray(config.systems)) {
    throw new Error("Invalid config: systems array is required");
  }

  // Clone the systems from config and add health property
  const systems = config.systems.map((system) => {
    // Normal systems start with random health between 50-100
    // Active and passive systems start at full health for balance
    const initialHealth =
      system.type === "normal"
        ? Math.floor(Math.random() * 51) + 50 // Random between 50-100
        : 100; // Active and passive systems start at 100%

    return {
      ...system,
      health: initialHealth,
      lastFixedTurn: 0, // Track when system was last fixed (0 = never fixed)
    };
  });

  // Calculate max turns based on number of systems (5 turns per system)
  const maxTurns = systems.length * 5;

  // Initialize the game state object
  let gameState = {
    turn: 1, // Start at turn 1
    maxTurns: maxTurns, // Total turns until rescue (5 per system)
    systems: systems, // Array of system objects with health
    gameOver: false, // Flag to indicate if the game has ended
    win: false, // Flag to indicate if the player won
    message:
      "Welcome to the survival game! Maintain your systems until rescue arrives.", // Current game message
    damageModifiers: [], // Array of active damage modifiers {systemName, modifier, type, turnsLeft}
    deteriorationCount: 0, // Counter for deterioration cycles, independent of turn manipulation
  };

  // Initialize active and passive systems
  const { initializeActiveSystem } = await import("./activeSystems.js");
  const { initializePassiveSystem } = await import("./passiveSystems.js");
  for (const system of gameState.systems) {
    if (system.type === "active") {
      gameState = initializeActiveSystem(system, gameState);
    } else if (system.type === "passive") {
      gameState = initializePassiveSystem(system, gameState);
    }
  }

  // Additional initialization logic can be added here if needed
  // For example, setting up event probabilities or other state variables

  // Log the initial state for debugging purposes
  console.log("Initial game state created:", gameState);

  // Return the initialized game state
  return gameState;
}
