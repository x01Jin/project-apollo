/**
 * Trigger Event module for the survival game.
 * This module handles the random triggering of positive and negative events.
 * Events can occur at the start of each turn with a certain probability.
 * Positive events help the player, while negative events hinder progress.
 * The event system adds unpredictability and strategic depth to the game.
 *
 * @param {Object} gameState - The current game state object.
 * @param {Object} config - The game configuration containing events arrays.
 * @returns {Object} The updated game state after applying any triggered event.
 */
import { getDamageModifier } from "./damageModifiers.js";
export async function triggerEvent(gameState, config) {
  // Validate inputs
  if (!gameState || !config) {
    throw new Error("Invalid parameters: gameState and config are required");
  }

  // Create a copy of the gameState to avoid mutation
  let updatedState = { ...gameState };
  let triggeredEvent = null;

  // Define event trigger probability (default 30% chance per turn)
  // Can be overridden by `config.eventChance` (0..1)
  const eventChance =
    typeof config.eventChance === "number" ? config.eventChance : 0.3;

  // Check if an event should trigger
  if (Math.random() < eventChance) {
    // Determine if it's positive or negative (default 50/50 chance)
    // Can be overridden by `config.positiveEventProbability` (0..1)
    const positiveProbability =
      typeof config.positiveEventProbability === "number"
        ? config.positiveEventProbability
        : 0.5;
    const isPositive = Math.random() < positiveProbability;
    let selectedEvent;

    if (
      isPositive &&
      config.positiveEvents &&
      config.positiveEvents.length > 0
    ) {
      // Select a random positive event
      const randomIndex = Math.floor(
        Math.random() * config.positiveEvents.length
      );
      selectedEvent = config.positiveEvents[randomIndex];
    } else if (
      !isPositive &&
      config.negativeEvents &&
      config.negativeEvents.length > 0
    ) {
      // Select a random negative event
      const randomIndex = Math.floor(
        Math.random() * config.negativeEvents.length
      );
      selectedEvent = config.negativeEvents[randomIndex];
    }

    // Apply the selected event if one was chosen
    if (selectedEvent) {
      // Add isPositive flag to the event for UI detection
      selectedEvent.isPositive = isPositive;

      // Check if this is an interactive event
      if (selectedEvent.interactive) {
        // Import interactive events module
        const { showInteractiveEvent } = await import("./interactiveEvents.js");

        // Show interactive event popup instead of immediate application
        updatedState = showInteractiveEvent(
          updatedState,
          config,
          selectedEvent
        );

        // Store the triggered event for return
        triggeredEvent = selectedEvent;

        // Log the interactive event for debugging
        console.log("Interactive event triggered:", selectedEvent.description);
      } else {
        // Handle regular (non-interactive) events
        // Capture state before event application for system hooks
        const stateBeforeEvent = { ...updatedState };

        // Update the message to describe the event
        updatedState.message = selectedEvent.description;

        // Apply the event's effect to the game state
        const stateAfterEventApplication = await selectedEvent.apply(
          updatedState
        );

        // Apply damage modifiers for negative events
        if (!isPositive) {
          updatedState = applyDamageModifiersToEvent(
            stateAfterEventApplication,
            updatedState,
            selectedEvent
          );
        } else {
          updatedState = stateAfterEventApplication;
        }

        // Check for critical system failures after event damage
        for (const system of updatedState.systems) {
          if (system.critical && system.health <= 0 && !updatedState.gameOver) {
            updatedState.gameOver = true;
            updatedState.message = `${system.name} has failed! Game Over.`;
            break; // Only need to check until first critical failure
          }
        }

        // Allow systems to react to the event
        for (const system of updatedState.systems) {
          if (system.onEvent) {
            updatedState = system.onEvent(
              updatedState,
              selectedEvent,
              config,
              stateBeforeEvent
            );
          }
        }

        // Store the triggered event for return
        triggeredEvent = selectedEvent;

        // Log the event for debugging
        console.log("Event triggered:", selectedEvent.description);
      }
    }
  } else {
    // No event triggered, update message accordingly
    updatedState.message = "No unusual events this turn.";
  }

  // Return both the updated state and the triggered event (if any)
  return {
    state: updatedState,
    event: triggeredEvent,
  };
}

/**
 * Applies damage modifiers to negative event effects
 * @param {Object} stateAfterEvent - State after event application
 * @param {Object} stateBeforeEvent - State before event application
 * @param {Object} event - The event that was applied
 * @returns {Object} The updated game state with damage modifiers applied
 */
/**
 * Applies damage modifiers to negative event effects
 * @param {Object} stateAfterEvent - State after event application
 * @param {Object} stateBeforeEvent - State before event application
 * @param {Object} event - The event that was applied
 * @returns {Object} The updated game state with damage modifiers applied
 */
function applyDamageModifiersToEvent(stateAfterEvent, stateBeforeEvent, event) {
  let updatedState = { ...stateAfterEvent };

  // Check each system for health changes and apply modifiers
  for (let i = 0; i < updatedState.systems.length; i++) {
    const system = updatedState.systems[i];
    const originalHealth = stateBeforeEvent.systems[i].health;
    const newHealth = system.health;

    // If health decreased, apply damage modifier
    if (newHealth < originalHealth) {
      const damageTaken = originalHealth - newHealth;
      const modifier = getDamageModifier(
        system.name,
        "negative_events",
        updatedState
      );

      if (modifier === 0) {
        // System is immune - restore full health
        updatedState.systems[i].health = originalHealth;
      } else if (modifier < 1) {
        // Apply damage reduction
        const modifiedDamage = Math.floor(damageTaken * modifier);
        const actualDamage = damageTaken - modifiedDamage;
        updatedState.systems[i].health = Math.max(
          0,
          originalHealth - actualDamage
        );
      }
      // If modifier is 1, no change needed (full damage)
    }
  }

  return updatedState;
}
