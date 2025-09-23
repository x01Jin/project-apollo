/**
 * Game module for the survival game.
 * This module initializes the game by loading configuration based on user selections,
 * setting up the initial state, and attaching event listeners to the UI buttons.
 * It serves as the entry point for the game page.
 * The game uses a modular architecture with separate concerns for maintainability.
 */
export async function initializeGame() {
  try {
    // Import required modules
    const { getConfig } = await import('../../config.js');
    const { createGameState } = await import('./gameState.js');
    const { updateUI } = await import('./updateUI.js');
    const { handleClick } = await import('./handleClick.js');

    // Get URL parameters for selected systems and events
    const urlParams = new URLSearchParams(window.location.search);
    const selectedSystems = urlParams.get('systems')?.split(',') || [];
    const selectedEvents = urlParams.get('events')?.split('|').map(decodeURIComponent) || [];

    // Load full game configuration
    const fullConfig = await getConfig();

    // Filter config based on user selections
    const config = filterConfigBySelections(fullConfig, selectedSystems, selectedEvents);
    console.log('Filtered config loaded:', config);
    console.log('Selected systems:', selectedSystems);
    console.log('Selected events:', selectedEvents);

    // Create initial game state
    let gameState = createGameState(config);
    console.log('Initial game state:', gameState);

    // Apply initial deterioration for turn 1
    const { deteriorateSystems } = await import('../mechanics/deteriorateSystems.js');
    gameState = deteriorateSystems(gameState);

    // Update UI with initial state (after deterioration)
    updateUI(gameState, config);

    // Listen for interactive event completion
    document.addEventListener('interactiveEventCompleted', (event) => {
      gameState = event.detail.updatedState;

      // Update button states after interactive event completion
      const systemsContainer = document.querySelector('.systems-container');
      if (systemsContainer) {
        if (gameState.interactiveMode) {
          const allButtons = systemsContainer.querySelectorAll('.fix-button');
          allButtons.forEach(btn => btn.disabled = true);
        } else {
          const allButtons = systemsContainer.querySelectorAll('.fix-button');
          allButtons.forEach(btn => btn.disabled = false);
        }
      }
    });

    // Use event delegation for fix buttons (attaches to container that doesn't change)
    const systemsContainer = document.querySelector('.systems-container');
    if (systemsContainer) {
      systemsContainer.addEventListener('click', async (event) => {
        // Check if clicked element is a fix button
        if (event.target.classList.contains('fix-button')) {
          event.preventDefault();

          // Get system name from button data attribute
          const systemName = event.target.dataset.system;

          // Handle the click and update game state
          gameState = await handleClick(systemName, gameState, config);

          // Check if game is over and disable all buttons
          if (gameState.gameOver) {
            const allButtons = systemsContainer.querySelectorAll('.fix-button');
            allButtons.forEach(btn => {
              btn.disabled = true;
              btn.classList.add('game-over');
            });
          }

          // Disable buttons during interactive mode
          if (gameState.interactiveMode) {
            const allButtons = systemsContainer.querySelectorAll('.fix-button');
            allButtons.forEach(btn => btn.disabled = true);
          } else {
            // Re-enable buttons when not in interactive mode
            const allButtons = systemsContainer.querySelectorAll('.fix-button');
            allButtons.forEach(btn => btn.disabled = false);
          }
        }
      });
    }

    // Attach button functionalities
    const retryButton = document.getElementById('retry-button');
    const setupButton = document.getElementById('setup-button');
    const abandonButton = document.getElementById('abandon-button');

    // Retry button functionality
    if (retryButton) {
      retryButton.addEventListener('click', async () => {
        // Reset game state
        gameState = createGameState(config);

        // Apply initial deterioration for turn 1
        gameState = deteriorateSystems(gameState);

        // Clear event log and reset to initial state
        const eventLogContent = document.getElementById('event-log-content');
        if (eventLogContent) {
          eventLogContent.innerHTML = `
            <div class="event-item">
              <span class="event-time">Turn 1</span>
              <span class="event-text">Game started</span>
            </div>
          `;
        }

        // Re-enable buttons and remove game-over class
        const allButtons = systemsContainer.querySelectorAll('.fix-button');
        allButtons.forEach(btn => {
          btn.disabled = false;
          btn.classList.remove('game-over');
        });

        // Update UI
        updateUI(gameState, config);

        console.log('Game restarted');
      });
    }

    // Setup button functionality
    if (setupButton) {
      setupButton.addEventListener('click', () => {
        window.location.href = 'setup.html';
      });
    }

    // Abandon button functionality
    if (abandonButton) {
      abandonButton.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    }

    console.log('Game initialized successfully');

  } catch (error) {
    console.error('Failed to initialize game:', error);
    // Display error message to user
    const messageElement = document.getElementById('message-display');
    if (messageElement) {
      messageElement.textContent = 'Error initializing game. Please refresh the page.';
    }
  }
}

/**
 * Filters the full configuration based on user selections from setup.
 * @param {Object} fullConfig - The complete game configuration
 * @param {Array} selectedSystems - Array of selected system names
 * @param {Array} selectedEvents - Array of selected event descriptions
 * @returns {Object} Filtered configuration with only selected items
 */
function filterConfigBySelections(fullConfig, selectedSystems, selectedEvents) {
  // Filter systems
  const filteredSystems = fullConfig.systems.filter(system =>
    selectedSystems.includes(system.name)
  );

  // Filter events
  const filteredPositiveEvents = fullConfig.positiveEvents.filter(event =>
    selectedEvents.includes(event.description)
  );

  const filteredNegativeEvents = fullConfig.negativeEvents.filter(event =>
    selectedEvents.includes(event.description)
  );

  return {
    systems: filteredSystems,
    positiveEvents: filteredPositiveEvents,
    negativeEvents: filteredNegativeEvents
  };
}
