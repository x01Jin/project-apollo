/**
 * Sequence Order module for the survival game.
 * This module centralizes the turn progression sequence using the Command pattern.
 * Each step in the turn sequence is encapsulated as a command object for better
 * testability, maintainability, and flexibility.
 *
 * The standard turn sequence is:
 * 1. Advance Turn
 * 2. Apply System Deterioration
 * 3. Check Win/Lose conditions
 * 4. Trigger Random Event (if game not over)
 * 5. Final Win/Lose check
 * 6. Update UI
 */

import { deteriorateSystems } from "../mechanics/deteriorateSystems.js";
import { triggerEvent } from "../mechanics/triggerEvent.js";
import { checkWinLose } from "./checkWinLose.js";
import { updateUI } from "./updateUI.js";
import { updateDamageModifiers } from "../mechanics/damageModifiers.js";

/**
 * Abstract Command interface
 * All turn sequence commands must implement this interface
 */
class Command {
  /**
   * Execute the command
   * @param {Object} context - Execution context containing gameState, config, etc.
   * @returns {Promise<Object>} Updated context
   */
  async execute(context) {
    throw new Error("Command.execute() must be implemented by subclass");
  }
}

/**
 * Command to advance the turn counter
 */
class AdvanceTurnCommand extends Command {
  async execute(context) {
    const updatedState = { ...context.gameState };
    updatedState.turn += 1;
    updatedState.deteriorationCount += 1;

    return {
      ...context,
      gameState: updatedState,
    };
  }
}

/**
 * Command to apply system deterioration with damage modifiers
 */
class DeteriorateSystemsCommand extends Command {
  async execute(context) {
    const updatedState = await deteriorateSystems(context.gameState);

    return {
      ...context,
      gameState: updatedState,
    };
  }
}

/**
 * Command to check win/lose conditions
 */
class CheckWinLoseCommand extends Command {
  async execute(context) {
    const updatedState = checkWinLose(context.gameState);

    return {
      ...context,
      gameState: updatedState,
    };
  }
}

/**
 * Command to trigger a random event if game is not over
 */
class TriggerEventCommand extends Command {
  async execute(context) {
    let updatedState = { ...context.gameState };
    let triggeredEvent = null;

    // Only trigger events if game is not over
    if (!updatedState.gameOver) {
      const eventResult = await triggerEvent(updatedState, context.config);
      updatedState = eventResult.state;
      triggeredEvent = eventResult.event;
    }

    return {
      ...context,
      gameState: updatedState,
      triggeredEvent,
    };
  }
}

/**
 * Command to update the UI with current game state
 */
class UpdateUICommand extends Command {
  async execute(context) {
    const uiOptions = {};

    // Add event logging and toast if an event was triggered
    if (context.triggeredEvent) {
      uiOptions.eventToLog = context.triggeredEvent.description;
      uiOptions.showToast = context.triggeredEvent;
    }

    updateUI(context.gameState, context.config, uiOptions);

    return context;
  }
}

/**
 * Invoker class that manages and executes the command sequence
 */
class TurnSequenceInvoker {
  constructor() {
    this.commands = [];
  }

  /**
   * Add a command to the sequence
   * @param {Command} command - The command to add
   */
  addCommand(command) {
    this.commands.push(command);
  }

  /**
   * Execute all commands in sequence
   * @param {Object} initialContext - Initial execution context
   * @returns {Promise<Object>} Final context after all commands execute
   */
  async executeSequence(initialContext) {
    let context = { ...initialContext };

    for (const command of this.commands) {
      try {
        context = await command.execute(context);
      } catch (error) {
        console.error(
          `Error executing command ${command.constructor.name}:`,
          error
        );
        // Continue with other commands but log the error
      }
    }

    return context;
  }

  /**
   * Clear all commands from the sequence
   */
  clearCommands() {
    this.commands = [];
  }
}

/**
 * Pre-configured invoker for the standard turn progression sequence
 */
class StandardTurnInvoker extends TurnSequenceInvoker {
  constructor() {
    super();
    this.setupStandardSequence();
  }

  /**
   * Set up the standard turn progression commands
   */
  setupStandardSequence() {
    this.addCommand(new AdvanceTurnCommand());
    this.addCommand(new DeteriorateSystemsCommand());
    this.addCommand(new CheckWinLoseCommand());
    this.addCommand(new TriggerEventCommand());
    this.addCommand(new CheckWinLoseCommand());
    this.addCommand(new UpdateUICommand());
  }
}

/**
 * Execute the standard turn progression sequence
 * @param {Object} gameState - Current game state
 * @param {Object} config - Game configuration
 * @param {Object} options - Additional options for execution
 * @returns {Promise<Object>} Updated game state
 */
export async function executeTurnSequence(gameState, config, options = {}) {
  const invoker = new StandardTurnInvoker();
  const initialContext = {
    gameState,
    config,
    options,
    triggeredEvent: null,
  };

  const finalContext = await invoker.executeSequence(initialContext);
  return finalContext.gameState;
}

/**
 * Execute a custom turn sequence with specific commands
 * @param {Object} gameState - Current game state
 * @param {Object} config - Game configuration
 * @param {Array<Command>} commands - Array of commands to execute
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Updated game state
 */
export async function executeCustomSequence(
  gameState,
  config,
  commands,
  options = {}
) {
  const invoker = new TurnSequenceInvoker();

  commands.forEach((command) => invoker.addCommand(command));

  const initialContext = {
    gameState,
    config,
    options,
    triggeredEvent: null,
  };

  const finalContext = await invoker.executeSequence(initialContext);
  return finalContext.gameState;
}

// Export command classes for custom sequences
export {
  Command,
  AdvanceTurnCommand,
  DeteriorateSystemsCommand,
  CheckWinLoseCommand,
  TriggerEventCommand,
  UpdateUICommand,
  TurnSequenceInvoker,
};
