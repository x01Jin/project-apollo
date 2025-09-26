/**
 * Deterioration Utilities module for the survival game.
 * This module provides shared utilities for applying system deterioration
 * with damage modifiers. Consolidates duplicate logic from system parsers.
 */

import { getDamageModifier } from "./damageModifiers.js";

/**
 * Apply deterioration to a single system with damage modifier support
 * @param {Object} system - The system object to deteriorate
 * @param {Object} gameState - The current game state
 * @param {Function} deteriorateFunction - The system's deteriorate method
 * @returns {Object} Updated game state after deterioration
 */
export function applySystemDeterioration(
  system,
  gameState,
  deteriorateFunction
) {
  let updatedState = { ...gameState };

  // Skip deterioration for systems that were fixed on the previous turn
  if (system.lastFixedTurn === updatedState.turn - 1) {
    return updatedState;
  }

  // Get damage modifier for deterioration
  const modifier = getDamageModifier(
    system.name,
    "deterioration",
    updatedState
  );

  // If system is immune to deterioration, skip it
  if (modifier === 0) {
    return updatedState;
  }

  // Call the system's deteriorate method with proper 'this' binding
  updatedState = deteriorateFunction.call(system, updatedState);

  // Apply damage modifier if not immune
  if (modifier < 1) {
    const systemIndex = updatedState.systems.findIndex(
      (sys) => sys.name === system.name
    );

    if (systemIndex !== -1) {
      const originalHealth = gameState.systems[systemIndex].health;
      const newHealth = updatedState.systems[systemIndex].health;
      const damageTaken = originalHealth - newHealth;

      // Apply modifier to damage
      const modifiedDamage = Math.floor(damageTaken * modifier);
      const actualDamage = damageTaken - modifiedDamage;

      updatedState.systems[systemIndex].health = Math.max(
        0,
        originalHealth - actualDamage
      );
    }
  }

  // Check for critical system failure
  const finalSystemIndex = updatedState.systems.findIndex(
    (sys) => sys.name === system.name
  );

  if (finalSystemIndex !== -1) {
    const finalHealth = updatedState.systems[finalSystemIndex].health;

    // Critical systems cause game over when they fail
    if (system.critical && finalHealth <= 0 && !updatedState.gameOver) {
      updatedState.gameOver = true;
      updatedState.win = false;
      updatedState.message = `${system.name} has failed! Game Over.`;
    }
  }

  return updatedState;
}

/**
 * Apply deterioration to multiple systems using their deteriorate methods
 * @param {Array} systems - Array of system objects to deteriorate
 * @param {Object} gameState - The current game state
 * @returns {Object} Updated game state after all deteriorations
 */
export function applyMultipleSystemDeterioration(systems, gameState) {
  let updatedState = { ...gameState };

  for (const system of systems) {
    if (typeof system.deteriorate === "function") {
      updatedState = applySystemDeterioration(
        system,
        updatedState,
        system.deteriorate
      );
    }
  }

  return updatedState;
}

/**
 * Check if a system should deteriorate based on damage modifiers
 * @param {Object} system - The system object
 * @param {Object} gameState - The current game state
 * @returns {boolean} True if system should deteriorate
 */
export function shouldSystemDeteriorate(system, gameState) {
  const modifier = getDamageModifier(system.name, "deterioration", gameState);
  return modifier > 0; // Only deteriorate if not immune
}

/**
 * Calculate modified damage for a system
 * @param {Object} system - The system object
 * @param {number} baseDamage - The base damage amount
 * @param {Object} gameState - The current game state
 * @param {string} damageType - Type of damage ('deterioration' or 'negative_events')
 * @returns {number} The modified damage amount
 */
export function calculateModifiedDamage(
  system,
  baseDamage,
  gameState,
  damageType = "deterioration"
) {
  const modifier = getDamageModifier(system.name, damageType, gameState);

  if (modifier === 0) {
    return 0; // Immune
  }

  if (modifier >= 1) {
    return baseDamage; // Full damage
  }

  // Apply damage reduction
  return Math.floor(baseDamage * modifier);
}
