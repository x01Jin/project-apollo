/**
 * Interactive Events module for the survival game.
 * This module handles interactive events that require player input before applying effects.
 * Interactive events pause the normal game flow and show a popup for player interaction.
 * The popup appears on the top-left with dynamic content and confirm/cancel buttons.
 *
 * @param {Object} gameState - The current game state object.
 * @param {Object} config - The game configuration object.
 * @param {Object} interactiveEvent - The interactive event object to display.
 * @returns {Object} The updated game state after interactive event processing.
 */
export function showInteractiveEvent(gameState, config, interactiveEvent) {
  // Validate inputs
  if (!gameState || !config || !interactiveEvent) {
    throw new Error('Invalid parameters: gameState, config, and interactiveEvent are required');
  }

  // Create a copy of the gameState to avoid mutation
  let updatedState = { ...gameState };

  // Set interactive event state
  updatedState.interactiveEvent = {
    event: interactiveEvent,
    isActive: true
  };

  // Update message to indicate interactive event
  updatedState.message = interactiveEvent.description;

  // Disable normal game interactions
  updatedState.interactiveMode = true;

  // Show the interactive popup
  renderInteractivePopup(interactiveEvent, config, updatedState);

  return updatedState;
}

/**
 * Hide the interactive event popup and resume normal game flow.
 * @param {Object} gameState - The current game state object.
 * @returns {Object} The updated game state after hiding interactive event.
 */
export function hideInteractiveEvent(gameState) {
  // Create a copy of the gameState to avoid mutation
  let updatedState = { ...gameState };

  // Clear interactive event state
  updatedState.interactiveEvent = null;
  updatedState.interactiveMode = false;

  // Remove the popup from DOM
  const popup = document.getElementById('interactive-popup');
  if (popup) {
    popup.remove();
  }

  return updatedState;
}

/**
 * Process the confirmation of an interactive event.
 * @param {Object} gameState - The current game state object.
 * @param {Object} config - The game configuration object.
 * @param {Object} eventData - Additional data from the interactive event.
 * @returns {Object} The updated game state after applying the interactive event.
 */
export function confirmInteractiveEvent(gameState, config, eventData = {}) {
  const interactiveEvent = gameState.interactiveEvent?.event;

  if (!interactiveEvent) {
    throw new Error('No active interactive event to confirm');
  }

  let updatedState = { ...gameState };

  // Apply the interactive event's effect
  if (interactiveEvent.apply) {
    updatedState = interactiveEvent.apply(updatedState, eventData);
  }

  // Hide the interactive popup and resume normal flow
  updatedState = hideInteractiveEvent(updatedState);

  // Update message to indicate completion
  updatedState.message = `${interactiveEvent.description} - Completed`;

  return updatedState;
}

/**
 * Process the cancellation of an interactive event.
 * @param {Object} gameState - The current game state object.
 * @returns {Object} The updated game state after cancelling the interactive event.
 */
export function cancelInteractiveEvent(gameState) {
  const interactiveEvent = gameState.interactiveEvent?.event;

  if (!interactiveEvent) {
    throw new Error('No active interactive event to cancel');
  }

  let updatedState = { ...gameState };

  // Hide the interactive popup and resume normal flow
  updatedState = hideInteractiveEvent(updatedState);

  // Update message to indicate cancellation
  updatedState.message = `${interactiveEvent.description} - Cancelled`;

  return updatedState;
}

/**
 * Render the interactive popup with dynamic content.
 * @param {Object} interactiveEvent - The interactive event object.
 * @param {Object} config - The game configuration object.
 * @param {Object} gameState - The current game state object.
 */
function renderInteractivePopup(interactiveEvent, config, gameState) {
  // Remove existing popup if any
  const existingPopup = document.getElementById('interactive-popup');
  if (existingPopup) {
    existingPopup.remove();
  }

  // Create popup container
  const popup = document.createElement('div');
  popup.id = 'interactive-popup';
  popup.className = 'interactive-popup';

  // Create popup content
  const content = document.createElement('div');
  content.className = 'interactive-popup-content';

  // Add event title
  const title = document.createElement('h4');
  title.className = 'interactive-popup-title';
  title.textContent = interactiveEvent.title || 'Interactive Event';
  content.appendChild(title);

  // Add dynamic content area
  const contentArea = document.createElement('div');
  contentArea.className = 'interactive-content-area';

  // Render event-specific content
  if (interactiveEvent.renderContent) {
    contentArea.innerHTML = interactiveEvent.renderContent(gameState, config);
  } else {
    contentArea.innerHTML = '<p>No content available for this interactive event.</p>';
  }

  content.appendChild(contentArea);

  // Create button container
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'interactive-button-container';

  // Add confirm button (always present)
  const confirmButton = document.createElement('button');
  confirmButton.className = 'interactive-confirm-button';
  confirmButton.innerHTML = '<i class="fas fa-check"></i> Confirm';
  confirmButton.addEventListener('click', () => {
    handleConfirmClick(gameState, config);
  });
  buttonContainer.appendChild(confirmButton);

  // Add cancel button if enabled for this event
  if (interactiveEvent.showCancel !== false) {
    const cancelButton = document.createElement('button');
    cancelButton.className = 'interactive-cancel-button';
    cancelButton.innerHTML = '<i class="fas fa-times"></i> Cancel';
    cancelButton.addEventListener('click', () => {
      handleCancelClick(gameState);
    });
    buttonContainer.appendChild(cancelButton);
  }

  content.appendChild(buttonContainer);
  popup.appendChild(content);

  // Add to DOM
  document.body.appendChild(popup);

  // Trigger animation
  setTimeout(() => {
    popup.classList.add('active');
  }, 10);
}

/**
 * Handle confirm button click.
 * @param {Object} gameState - The current game state object.
 * @param {Object} config - The game configuration object.
 */
async function handleConfirmClick(gameState, config) {
  // Import required modules
  const { confirmInteractiveEvent } = await import('./interactiveEvents.js');
  const { updateUI } = await import('../core/updateUI.js');

  // Get event data from the popup
  const eventData = getEventDataFromPopup();

  // Confirm the interactive event
  let updatedState = confirmInteractiveEvent(gameState, config, eventData);

  // Update UI
  updateUI(updatedState, config);

  // Dispatch custom event to update main game state
  const event = new CustomEvent('interactiveEventCompleted', {
    detail: { updatedState: updatedState }
  });
  document.dispatchEvent(event);
}

/**
 * Handle cancel button click.
 * @param {Object} gameState - The current game state object.
 */
async function handleCancelClick(gameState) {
  // Import required modules
  const { cancelInteractiveEvent } = await import('./interactiveEvents.js');
  const { updateUI } = await import('../core/updateUI.js');

  // Cancel the interactive event
  let updatedState = cancelInteractiveEvent(gameState);

  // Update UI
  updateUI(updatedState);

  // Dispatch custom event to update main game state
  const event = new CustomEvent('interactiveEventCompleted', {
    detail: { updatedState: updatedState }
  });
  document.dispatchEvent(event);
}

/**
 * Extract event data from the interactive popup.
 * @returns {Object} The event data object.
 */
function getEventDataFromPopup() {
  const popup = document.getElementById('interactive-popup');
  if (!popup) return {};

  // Get selected systems (for motivated event)
  const selectedSystems = [];
  const systemCheckboxes = popup.querySelectorAll('.system-selection-checkbox:checked');
  systemCheckboxes.forEach(checkbox => {
    selectedSystems.push(checkbox.dataset.system);
  });

  return {
    selectedSystems: selectedSystems
  };
}
