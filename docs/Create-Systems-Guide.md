# Guide: Creating New Systems

This guide explains how to add new systems to Project Apollo, including boilerplate templates for each supported system type.

---

## System Types Overview

Project Apollo supports three system types:

### 1. Normal Systems

- **Type:** `normal`
- **Features:** Health bar, fix button, standard deterioration
- **Required:** `name`, `type`, `deteriorate(state)`, `fix(state)`
- **Optional:** `icon`, `caveat`, `update(gameState)`

### 2. Active Systems

- **Type:** `active`
- **Features:** Custom UI, interactive logic, activation/cooldown
- **Required:** `name`, `type`, `renderUI(container, gameState)`, `handleInteraction(action, gameState, config)`
- **Optional:** `icon`, `caveat`, `initialize(gameState)`, `update(gameState)`

### 3. Passive Systems

- **Type:** `passive`
- **Features:** Background effects, minimal UI, no direct interaction
- **Required:** `name`, `type`, `update(gameState)`
- **Optional:** `icon`, `caveat`, `initialize(gameState)`, `onEvent(gameState, event, config)`, `getStatus()`, `deteriorate(state)`, `fix(state)`

---

## Boilerplate Templates

### Normal System Example

```javascript
//**
 * [System Name] system module.
 * [Brief description of what this system does]
 */
export const [systemName] = {
  name: "[System Name]",
  type: "normal",
  icon: "fas fa-[icon-name]",
  caveat: "[Description of system behavior and purpose]",

  /**
   * Deteriorates the [system name] system.
   * @param {Object} state - The current game state
   * @returns {Object} The updated game state
   */
  deteriorate(state) {
    const updatedState = { ...state };
    const [systemName]System = updatedState.systems.find(
      (sys) => sys.name === this.name
    );

    if ([systemName]System) {
      // Deteriorate system by X points (adjust as needed)
      [systemName]System.health = Math.max(0, [systemName]System.health - 10);

      // Add custom deterioration logic here
      // Example: Affect other systems, modify game state, etc.
    }

    return updatedState;
  },

  /**
   * Fixes the [system name] system to full health.
   * @param {Object} state - The current game state
   * @returns {Object} The updated game state
   */
  fix(state) {
    const updatedState = { ...state };
    const [systemName]System = updatedState.systems.find(
      (sys) => sys.name === this.name
    );

    if ([systemName]System) {
      [systemName]System.health = 100;

      // Add custom fix logic here
      // Example: Reset system-specific state, apply bonuses, etc.
    }

    return updatedState;
  },

  /**
   * Optional: Updates the system each turn (e.g., for passive effects)
   * @param {Object} gameState - The current game state
   * @returns {Object} The updated game state
   */
  update(gameState) {
    // Add custom update logic here
    // Example: Apply ongoing effects, check conditions, etc.
    return gameState;
  },
};
```

### Active System Example

```javascript
/**
 * [System Name] system module.
 * [Brief description of what this active system does]
 */
export const [systemName] = {
  name: "[System Name]",
  type: "active",
  icon: "fas fa-[icon-name]",
  caveat: "[Description of active system behavior and player interactions]",

  /**
   * Initialize the [system name] system with default state
   * @param {Object} gameState - The current game state
   * @returns {Object} The updated game state
   */
  initialize(gameState) {
    const updatedState = { ...gameState };

    // Initialize system-specific state
    updatedState.[systemName]State = {
      // Add system-specific state properties
      isActive: false,
      cooldown: 0,
      // ... other state variables
    };

    return updatedState;
  },

  /**
   * Custom UI rendering for the [system name] system
   * @param {HTMLElement} container - The container element to render into
   * @param {Object} gameState - The current game state
   * @returns {HTMLElement} The rendered container
   */
  renderUI(container, gameState) {
    container.className = "system active-system";
    container.id = `system-${this.name.toLowerCase().replace(" ", "-")}`;
    container.setAttribute("data-system-name", this.name);

    const icon = this.icon || "fas fa-cogs";
    const { statusText, statusClass, isAvailable } = this.getStatus(gameState);
    const buttonHtml = isAvailable 
      ? `<button class="action-button" data-action="activate">Activate</button>`
      : "";

    container.innerHTML = `
      <div class="system-header">
        <i class="${icon} system-icon"></i>
        <h3>${this.name}</h3>
      </div>
      <div class="active-system-content">
        <div class="caveat">${this.caveat}</div>
        <div class="active-status ${statusClass}">${statusText}</div>
        ${buttonHtml}
      </div>
    `;

    return container;
  },

  /**
   * Handle interactions with the [system name] system
   * @param {string} action - The action being performed
   * @param {Object} gameState - The current game state
   * @param {Object} config - The game configuration
   * @returns {Promise<Object>} The updated game state
   */
  async handleInteraction(action, gameState, config) {
    let updatedState = { ...gameState };

    if (action === "activate") {
      // Check if system is available
      const systemState = updatedState.[systemName]State || {};
      
      if (!this.isAvailable(systemState)) {
        updatedState.message = "[System Name] is not ready to activate.";
        return updatedState;
      }

      // Implement activation logic
      updatedState.[systemName]State = {
        ...systemState,
        isActive: true,
        activatedAt: gameState.turn,
      };

      updatedState.message = "[System Name] activated successfully!";
    }

    return updatedState;
  },

  /**
   * Update the [system name] system each turn
   * @param {Object} gameState - The current game state
   * @returns {Promise<Object>} The updated game state
   */
  async update(gameState) {
    let updatedState = { ...gameState };
    const systemState = updatedState.[systemName]State || {};

    // Update system state each turn
    if (systemState.isActive) {
      // Implement ongoing effects
      // Example: Apply protection, modify other systems, etc.
      
      // Check if effect should end
      if (this.shouldEffectEnd(systemState, gameState)) {
        updatedState.[systemName]State = {
          ...systemState,
          isActive: false,
          cooldown: 5, // Set cooldown period
        };
      }
    }

    // Handle cooldown
    if (systemState.cooldown > 0) {
      updatedState.[systemName]State = {
        ...systemState,
        cooldown: systemState.cooldown - 1,
      };
    }

    return updatedState;
  },

  /**
   * Get current system status for UI
   * @param {Object} gameState - The current game state
   * @returns {Object} Status information
   */
  getStatus(gameState) {
    const systemState = gameState.[systemName]State || {};
    
    if (systemState.isActive) {
      return {
        statusText: "Active",
        statusClass: "active",
        isAvailable: false
      };
    } else if (systemState.cooldown > 0) {
      return {
        statusText: `Cooldown: ${systemState.cooldown} turns`,
        statusClass: "cooldown",
        isAvailable: false
      };
    } else {
      return {
        statusText: "Ready",
        statusClass: "ready",
        isAvailable: true
      };
    }
  },

  /**
   * Check if system is available for activation
   * @param {Object} systemState - The system's state
   * @returns {boolean} True if available
   */
  isAvailable(systemState) {
    return !systemState.isActive && (!systemState.cooldown || systemState.cooldown <= 0);
  },

  /**
   * Check if active effect should end
   * @param {Object} systemState - The system's state
   * @param {Object} gameState - The current game state
   * @returns {boolean} True if effect should end
   */
  shouldEffectEnd(systemState, gameState) {
    // Implement your ending condition logic
    // Example: After X turns, or when certain conditions are met
    return (gameState.turn - systemState.activatedAt) >= 3;
  },
};
```

### Passive System Example

```javascript
/**
 * [System Name] system module.
 * [Brief description of what this passive system does]
 */
export const [systemName] = {
  name: "[System Name]",
  type: "passive",
  icon: "fas fa-[icon-name]",
  caveat: "[Description of passive system behavior and background effects]",

  /**
   * Initialize the [system name] system with default state
   * @param {Object} gameState - The current game state
   * @returns {Object} The updated game state
   */
  initialize(gameState) {
    const updatedState = { ...gameState };

    // Initialize passive system state
    updatedState.[systemName]State = {
      // Add passive system state properties
      isOperational: true,
      efficiency: 1.0,
      // ... other state variables
    };

    return updatedState;
  },

  /**
   * Updates the [system name] system each turn
   * @param {Object} gameState - The current game state
   * @returns {Object} The updated game state
   */
  update(gameState) {
    let updatedState = { ...gameState };
    const systemState = updatedState.[systemName]State || {};

    // Implement passive effects here
    // Example: Background resource generation, automatic repairs, etc.
    
    // Update system state
    updatedState.[systemName]State = {
      ...systemState,
      // Modify state as needed
    };

    return updatedState;
  },

  /**
   * Optional: Handle events that affect this passive system
   * @param {Object} gameState - The current game state
   * @param {Object} event - The event object
   * @param {Object} config - The game configuration
   * @returns {Object} The updated game state
   */
  onEvent(gameState, event, config) {
    // Implement event-specific logic
    // Example: Respond to positive/negative events
    
    return gameState;
  },

  /**
   * Optional: Get current status for display
   * @returns {string} Status description
   */
  getStatus() {
    // Return current operational status
    return "Operating optimally";
  },

  /**
   * Optional: Deterioration logic (if this passive system can be damaged)
   * @param {Object} state - The current game state
   * @returns {Object} The updated game state
   */
  deteriorate(state) {
    const updatedState = { ...state };
    const [systemName]System = updatedState.systems.find(
      (sys) => sys.name === this.name
    );

    if ([systemName]System) {
      // Deteriorate passive system by X points
      [systemName]System.health = Math.max(0, [systemName]System.health - 5);

      // Update efficiency based on health
      const systemState = updatedState.[systemName]State || {};
      updatedState.[systemName]State = {
        ...systemState,
        efficiency: [systemName]System.health / 100,
      };
    }

    return updatedState;
  },

  /**
   * Optional: Fix logic (if this passive system can be repaired)
   * @param {Object} state - The current game state
   * @returns {Object} The updated game state
   */
  fix(state) {
    const updatedState = { ...state };
    const [systemName]System = updatedState.systems.find(
      (sys) => sys.name === this.name
    );

    if ([systemName]System) {
      [systemName]System.health = 100;

      // Reset efficiency
      const systemState = updatedState.[systemName]State || {};
      updatedState.[systemName]State = {
        ...systemState,
        efficiency: 1.0,
      };
    }

    return updatedState;
  },
};
```

---

## Registration Steps

1. **Create your system file** in the `systems/` folder using the appropriate template.
2. **Register the system** by adding its path to the `systems` array in [`registry.js`](registry.js:74).

   ```js
   systems: [
     "./systems/lifeSupport.js",
     "./systems/yourNewSystem.js",
   ],
   ```

3. The registry will automatically load, validate, and integrate your system.

---

## Best Practices

- Use immutable state updates (`{ ...state }`)
- Always include `name` and `type`
- Follow method signatures as shown above
- Add comments for clarity
- Test your system module in isolation before integration
