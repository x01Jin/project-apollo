/**
 * Motivated positive interactive event module.
 * This module contains all data and functionality for the Motivated event.
 * A motivated event allows the player to select and repair up to 2 damaged systems.
 * This is an interactive event that requires player input before applying effects.
 */
export const motivated = {
  description: "Your crew is highly motivated! You can repair 2 systems at once.",

  // Mark this as an interactive event
  interactive: true,

  // Title for the interactive popup
  title: "Motivated Crew",

  // Disable cancel button for this positive event
  showCancel: false,

  /**
   * Renders the interactive content for the motivated event.
   * Shows damaged systems as selectable options.
   * @param {Object} gameState - The current game state
   * @param {Object} config - The game configuration
   * @returns {string} HTML content for the interactive popup
   */
  renderContent(gameState, config) {
    // Get damaged systems (health < 100)
    const damagedSystems = gameState.systems.filter(system => system.health < 100);

    if (damagedSystems.length === 0) {
      return `
        <p>All systems are at full health! The motivated crew has no systems to repair.</p>
        <p>Click confirm to continue.</p>
      `;
    }

    // Create system selection HTML
    const systemOptions = damagedSystems.map(system => `
      <div class="system-selection-item">
        <input type="checkbox"
               class="system-selection-checkbox"
               id="system-${system.name.toLowerCase().replace(' ', '-')}"
               data-system="${system.name}"
               onchange="handleSystemSelection(this)">
        <label class="system-selection-label" for="system-${system.name.toLowerCase().replace(' ', '-')}">
          <strong>${system.name}</strong>
        </label>
        <span class="system-selection-health">${system.health}/100 HP</span>
      </div>
    `).join('');

    return `
      <p>Your crew is highly motivated and can repair <strong>2 systems</strong> at once!</p>
      <p>Select up to 2 damaged systems to repair:</p>
      <div class="system-selection-container">
        ${systemOptions}
      </div>
      <p id="selection-count">Selected: 0 / 2</p>
    `;
  },

  /**
   * Applies the motivated event effect to the game state.
   * Repairs the selected systems to full health.
   * @param {Object} state - The current game state
   * @param {Object} eventData - Data from the interactive event (selected systems)
   * @returns {Object} The updated game state
   */
  apply(state, eventData) {
    const updatedState = { ...state };

    // Get selected systems from event data
    const selectedSystems = eventData.selectedSystems || [];

    // Repair selected systems to full health
    selectedSystems.forEach(systemName => {
      const system = updatedState.systems.find(s => s.name === systemName);
      if (system) {
        system.health = 100;
      }
    });

    return updatedState;
  }
};

// Global function for handling system selection (called from HTML)
window.handleSystemSelection = function(checkbox) {
  const checkboxes = document.querySelectorAll('.system-selection-checkbox');
  const checkedBoxes = document.querySelectorAll('.system-selection-checkbox:checked');
  const selectionCount = document.getElementById('selection-count');

  // Limit selection to 2 systems
  if (checkedBoxes.length > 2) {
    checkbox.checked = false;
    return;
  }

  // Update selection count display
  if (selectionCount) {
    selectionCount.textContent = `Selected: ${checkedBoxes.length} / 2`;
  }
};
