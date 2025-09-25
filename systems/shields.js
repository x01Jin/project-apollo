/**
 * Shields system module.
 * This module contains all data and functionality for the Shields system.
 * The Shields system absorbs damage from negative events to protect other systems.
 * It deteriorates moderately and provides damage mitigation when active.
 */
export const shields = {
  name: "Shields",
  type: "normal",
  icon: "fas fa-shield-alt",
  caveat: "Absorbs damage from negative events to protect other systems.",

  /**
   * Deteriorates the shields system.
   * @param {Object} state - The current game state
   * @returns {Object} The updated game state
   */
  deteriorate(state) {
    const updatedState = { ...state };
    const shieldsSystem = updatedState.systems.find(
      (sys) => sys.name === this.name
    );

    if (shieldsSystem) {
      // Deteriorate shields by 10 points
      shieldsSystem.health = Math.max(0, shieldsSystem.health - 10);
    }

    return updatedState;
  },

  /**
   * Fixes the shields system to full health.
   * @param {Object} state - The current game state
   * @returns {Object} The updated game state
   */
  fix(state) {
    const updatedState = { ...state };
    const shieldsSystem = updatedState.systems.find(
      (sys) => sys.name === this.name
    );

    if (shieldsSystem) {
      shieldsSystem.health = 100;
    }

    return updatedState;
  },

  /**
   * Handles event effects, providing damage absorption for negative events.
   * @param {Object} state - The current game state after event application
   * @param {Object} event - The event that was triggered
   * @param {Object} config - The game configuration
   * @param {Object} originalState - The game state before event application
   * @returns {Object} The updated game state with shields protection applied
   */
  onEvent(state, event, config, originalState) {
    const updatedState = { ...state };

    // Check if this is a negative event
    const isNegativeEvent = config.negativeEvents.some(
      (negEvent) => negEvent === event
    );

    if (isNegativeEvent) {
      // Calculate damage dealt to each system
      const damages = updatedState.systems.map((sys, i) =>
        Math.max(0, originalState.systems[i].health - sys.health)
      );

      const totalDamage = damages.reduce((sum, d) => sum + d, 0);

      if (totalDamage > 0) {
        const shieldsSystem = updatedState.systems.find(
          (sys) => sys.name === this.name
        );

        if (shieldsSystem && shieldsSystem.health > 0) {
          // Calculate absorption rate based on shields health
          let absorptionRate = 0;
          if (shieldsSystem.health >= 90) {
            absorptionRate = 0.5;
          } else if (shieldsSystem.health >= 75) {
            absorptionRate = 0.25;
          } else if (shieldsSystem.health >= 50) {
            absorptionRate = 0.1;
          }
          // Absorb percentage of total damage
          const absorption = totalDamage * absorptionRate;

          // Distribute absorption proportionally to damaged systems
          let remainingAbsorption = absorption;
          for (let i = 0; i < updatedState.systems.length; i++) {
            if (damages[i] > 0 && updatedState.systems[i].name !== this.name) {
              const reduceAmount = Math.min(damages[i], remainingAbsorption);
              updatedState.systems[i].health += reduceAmount;
              remainingAbsorption -= reduceAmount;
              if (remainingAbsorption <= 0) break;
            }
          }

          // Damage shields by the amount absorbed
          shieldsSystem.health = Math.max(0, shieldsSystem.health - absorption);
        }
      }
    }

    return updatedState;
  },
};
