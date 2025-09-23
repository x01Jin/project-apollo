/**
 * Update UI module for the survival game.
 * This module handles updating the user interface elements based on the current game state.
 * It refreshes the display of turn number, system health bars, messages, and button states.
 * The UI updates occur after each game state change to keep the player informed.
 *
 * @param {Object} gameState - The current game state object.
 * @param {Object} config - The game configuration object.
 * @param {Object} options - Additional options for UI updates.
 */
export function updateUI(gameState, config = null, options = {}) {
  // Validate the gameState object
  if (!gameState) {
    throw new Error('Invalid gameState: gameState is required');
  }

  // Update the turn display
  const turnTextElement = document.getElementById('turn-text');
  if (turnTextElement) {
    turnTextElement.textContent = `Turn: ${gameState.turn} / ${gameState.maxTurns}`;
  }

  // Update turn progress bar
  const turnProgressBar = document.getElementById('turn-progress-bar');
  if (turnProgressBar) {
    const progress = (gameState.turn / gameState.maxTurns) * 100;
    turnProgressBar.style.width = `${progress}%`;
  }

  // Update the message display
  const messageElement = document.getElementById('message-display');
  if (messageElement) {
    const messageSpan = messageElement.querySelector('span');
    if (messageSpan) {
      messageSpan.textContent = gameState.message;
    }
  }

  // Update header to reflect dynamic turns
  const headerParagraph = document.querySelector('.game-header p');
  if (headerParagraph) {
    headerParagraph.textContent = `Maintain your ship's systems until rescue arrives in ${gameState.maxTurns} turns!`;
  }

  // Update system elements (preserve existing elements for smooth animations)
  const systemsContainer = document.querySelector('.systems-container');
  if (systemsContainer) {
    const existingSystems = systemsContainer.querySelectorAll('.system');

    if (existingSystems.length === gameState.systems.length) {
      // Update existing system elements for smooth transitions
      gameState.systems.forEach((system, index) => {
        updateSystemElement(existingSystems[index], system);
      });
    } else {
      // Recreate all systems if count changed
      systemsContainer.innerHTML = '';
      gameState.systems.forEach(system => {
        const systemElement = createSystemElement(system);
        systemsContainer.appendChild(systemElement);
      });
    }
  }

  // Update button states based on game over status
  const buttons = document.querySelectorAll('.fix-button');
  buttons.forEach(button => {
    button.disabled = gameState.gameOver;
  });

  // Handle game over state and button states
  const gameOverElement = document.getElementById('game-over');
  const retryButton = document.getElementById('retry-button');
  const setupButton = document.getElementById('setup-button');
  const abandonButton = document.getElementById('abandon-button');

  if (gameState.gameOver) {
    // Show game over message
    const gameOverTitle = document.getElementById('game-over-title');
    const gameOverMessage = document.getElementById('game-over-message');
    const winIcon = document.querySelector('.win-icon');
    const loseIcon = document.querySelector('.lose-icon');

    if (gameOverElement && gameOverTitle && gameOverMessage) {
      gameOverElement.style.display = 'block';

      if (gameState.win) {
        gameOverTitle.textContent = 'Victory!';
        gameOverMessage.textContent = 'You successfully maintained your ship systems until rescue arrived!';
        if (winIcon) winIcon.style.display = 'block';
        if (loseIcon) loseIcon.style.display = 'none';
      } else {
        gameOverTitle.textContent = 'Game Over';
        gameOverMessage.textContent = 'Your ship systems failed. Rescue could not reach you in time.';
        if (winIcon) winIcon.style.display = 'none';
        if (loseIcon) loseIcon.style.display = 'block';
      }
    }

    // Enable retry and setup buttons when game is over
    if (retryButton) retryButton.disabled = false;
    if (setupButton) setupButton.disabled = false;
  } else {
    // Hide game over message when game is not over
    if (gameOverElement) {
      gameOverElement.style.display = 'none';
    }

    // Disable retry and setup buttons when game is not over
    if (retryButton) retryButton.disabled = true;
    if (setupButton) setupButton.disabled = true;
  }

  // Abandon button is always enabled
  if (abandonButton) abandonButton.disabled = false;

  // Add event to log if provided
  if (options.eventToLog) {
    addEventToLog(options.eventToLog, gameState.turn);
  }

  // Show event toast if provided
  if (options.showToast && config) {
    showEventToast(options.showToast, config);
  }

  // Log UI update for debugging
  console.log('UI updated with game state:', gameState);
}

/**
 * Add an event to the event log
 * @param {string} eventText - The event description to log
 * @param {number} turn - The current turn number
 */
export function addEventToLog(eventText, turn) {
  const eventLogContent = document.getElementById('event-log-content');
  if (eventLogContent) {
    const eventItem = document.createElement('div');
    eventItem.className = 'event-item';

    const eventTime = document.createElement('span');
    eventTime.className = 'event-time';
    eventTime.textContent = `Turn ${turn}`;

    const eventTextSpan = document.createElement('span');
    eventTextSpan.className = 'event-text';
    eventTextSpan.textContent = eventText;

    eventItem.appendChild(eventTime);
    eventItem.appendChild(eventTextSpan);

    eventLogContent.appendChild(eventItem);

    // Auto-scroll to bottom
    eventLogContent.scrollTop = eventLogContent.scrollHeight;
  }
}

/**
 * Create a system element for the UI
 * @param {Object} system - The system object with name, health, and caveat
 * @returns {HTMLElement} The created system element
 */
function createSystemElement(system) {
  const systemElement = document.createElement('div');
  systemElement.className = 'system';
  systemElement.id = `system-${system.name.toLowerCase().replace(' ', '-')}`;

  // Get system icon
  const icon = system.icon;

  // Create system HTML
  systemElement.innerHTML = `
    <div class="system-header">
      <i class="${icon} system-icon"></i>
      <h3>${system.name}</h3>
    </div>
    <div class="health-bar-container">
      <div class="health-bar"></div>
      <div class="health-bar-overlay"></div>
    </div>
    <div class="health-text">Health: ${system.health}/100</div>
    <div class="caveat">${system.caveat}</div>
    <button class="fix-button" data-system="${system.name}">
      <i class="fas fa-wrench"></i> Fix ${system.name}
    </button>
  `;

  // Update health bar styling
  const healthBar = systemElement.querySelector('.health-bar');
  if (healthBar) {
    healthBar.style.width = `${system.health}%`;

    // Update health bar color based on health with gradient
    const healthPercent = system.health / 100;
    if (healthPercent > 0.6) {
      healthBar.style.background = 'linear-gradient(90deg, #ff4444 0%, #ffff00 50%, #00ff88 100%)';
    } else if (healthPercent > 0.3) {
      healthBar.style.background = 'linear-gradient(90deg, #ff4444 0%, #ffff00 70%, #ffff00 100%)';
    } else {
      healthBar.style.background = 'linear-gradient(90deg, #ff4444 0%, #ff4444 100%)';
    }

    // Add critical system warning
    if (system.health < 20) {
      systemElement.style.borderColor = 'var(--danger-color)';
      systemElement.style.boxShadow = '0 0 15px rgba(255, 68, 68, 0.5)';
    } else if (system.health < 50) {
      systemElement.style.borderColor = 'var(--warning-color)';
      systemElement.style.boxShadow = '0 0 10px rgba(255, 255, 0, 0.3)';
    } else {
      systemElement.style.borderColor = 'var(--border-color)';
      systemElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    }
  }

  return systemElement;
}

/**
 * Update an existing system element with new health data
 * @param {HTMLElement} systemElement - The existing system element to update
 * @param {Object} system - The system object with updated name, health, and caveat
 */
function updateSystemElement(systemElement, system) {
  // Update health bar width (this will animate smoothly due to CSS transition)
  const healthBar = systemElement.querySelector('.health-bar');
  if (healthBar) {
    healthBar.style.width = `${system.health}%`;

    // Update health bar color based on health with gradient
    const healthPercent = system.health / 100;
    if (healthPercent > 0.6) {
      healthBar.style.background = 'linear-gradient(90deg, #ff4444 0%, #ffff00 50%, #00ff88 100%)';
    } else if (healthPercent > 0.3) {
      healthBar.style.background = 'linear-gradient(90deg, #ff4444 0%, #ffff00 70%, #ffff00 100%)';
    } else {
      healthBar.style.background = 'linear-gradient(90deg, #ff4444 0%, #ff4444 100%)';
    }
  }

  // Update health text
  const healthText = systemElement.querySelector('.health-text');
  if (healthText) {
    healthText.textContent = `Health: ${system.health}/100`;
  }

  // Update caveat text (in case it changed)
  const caveatElement = systemElement.querySelector('.caveat');
  if (caveatElement) {
    caveatElement.textContent = system.caveat;
  }

  // Update critical system warning styling
  if (system.health < 20) {
    systemElement.style.borderColor = 'var(--danger-color)';
    systemElement.style.boxShadow = '0 0 15px rgba(255, 68, 68, 0.5)';
  } else if (system.health < 50) {
    systemElement.style.borderColor = 'var(--warning-color)';
    systemElement.style.boxShadow = '0 0 10px rgba(255, 255, 0, 0.3)';
  } else {
    systemElement.style.borderColor = 'var(--border-color)';
    systemElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
  }
}

/**
 * Show an event toast notification
 * @param {Object} event - The event object containing type and description
 * @param {Object} config - The game configuration
 */
export function showEventToast(event, config) {
  const toast = document.getElementById('event-toast');
  const toastTitle = document.getElementById('event-toast-title');
  const toastDescription = document.getElementById('event-toast-description');
  const toastIcon = document.querySelector('.event-icon');

  if (toast && toastTitle && toastDescription && toastIcon) {
    // Determine if positive or negative event
    const isPositive = config.positiveEvents && config.positiveEvents.some(e => e.description === event.description);

    toastTitle.textContent = isPositive ? 'Positive Event!' : 'Negative Event!';
    toastDescription.textContent = event.description;

    // Update icon and colors
    if (isPositive) {
      toastIcon.className = 'fas fa-star event-icon';
      toastIcon.style.color = 'var(--success-color)';
      toast.style.borderLeft = '4px solid var(--success-color)';
    } else {
      toastIcon.className = 'fas fa-exclamation-triangle event-icon';
      toastIcon.style.color = 'var(--danger-color)';
      toast.style.borderLeft = '4px solid var(--danger-color)';
    }

    // Show toast
    toast.style.display = 'block';

    // Auto-hide after 4 seconds
    setTimeout(() => {
      toast.style.display = 'none';
    }, 4000);
  }
}
