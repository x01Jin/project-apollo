/**
 * Main module for the survival game.
 * This module initializes the game by loading configuration, setting up the initial state,
 * and attaching event listeners to the UI buttons.
 * It serves as the entry point for the application.
 * The game uses a modular architecture with separate concerns for maintainability.
 */
export async function initializeGame() {
  try {
    // Import required modules
    const { getConfig } = await import('./config.js');
    const { createGameState } = await import('./gameState.js');
    const { updateUI } = await import('./updateUI.js');
    const { handleClick } = await import('./handleClick.js');

    // Load game configuration
    const config = await getConfig();
    console.log('Config loaded:', config);

    // Create initial game state
    let gameState = createGameState(config);
    console.log('Initial game state:', gameState);

    // Update UI with initial state
    updateUI(gameState, config);

    // Attach event listeners to fix buttons
    const buttons = document.querySelectorAll('.fix-button');
    buttons.forEach(button => {
      button.addEventListener('click', async () => {
        // Get system name from button data attribute
        const systemName = button.dataset.system;

        // Handle the click and update game state
        gameState = await handleClick(systemName, gameState, config);

        // Check if game is over and disable buttons if needed
        if (gameState.gameOver) {
          buttons.forEach(btn => btn.disabled = true);
        }
      });
    });

    // Attach restart functionality (if restart button exists)
    const restartButton = document.getElementById('restart-button');
    if (restartButton) {
      restartButton.addEventListener('click', async () => {
        // Reset game state
        gameState = createGameState(config);

        // Re-enable buttons
        buttons.forEach(btn => btn.disabled = false);

        // Update UI
        updateUI(gameState, config);

        console.log('Game restarted');
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
