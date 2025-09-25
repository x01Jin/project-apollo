/**
 * Game Over UI module for the survival game.
 * Handles game over state display and button management.
 */

/**
 * Update game over state and UI elements
 * @param {Object} gameState - The current game state object
 */
export function updateGameOverState(gameState) {
  const gameOverElement = document.getElementById("game-over");
  const retryButton = document.getElementById("retry-button");
  const setupButton = document.getElementById("setup-button");
  const abandonButton = document.getElementById("abandon-button");

  if (gameState.gameOver) {
    // Show game over message
    const gameOverTitle = document.getElementById("game-over-title");
    const gameOverMessage = document.getElementById("game-over-message");
    const winIcon = document.querySelector(".win-icon");
    const loseIcon = document.querySelector(".lose-icon");

    if (gameOverElement && gameOverTitle && gameOverMessage) {
      gameOverElement.style.display = "block";

      if (gameState.win) {
        gameOverTitle.textContent = "Survived!";
        gameOverMessage.textContent =
          "You successfully maintained your ship systems until rescue arrived!";
        if (winIcon) winIcon.style.display = "block";
        if (loseIcon) loseIcon.style.display = "none";
      } else {
        gameOverTitle.textContent = "Failed!";
        gameOverMessage.textContent =
          "Your ship systems failed. Rescue could not reach you in time.";
        if (winIcon) winIcon.style.display = "none";
        if (loseIcon) loseIcon.style.display = "block";
      }
    }

    // Enable retry and setup buttons when game is over
    if (retryButton) retryButton.disabled = false;
    if (setupButton) setupButton.disabled = false;
  } else {
    // Hide game over message when game is not over
    if (gameOverElement) {
      gameOverElement.style.display = "none";
    }

    // Disable retry and setup buttons when game is not over
    if (retryButton) retryButton.disabled = true;
    if (setupButton) setupButton.disabled = true;
  }

  // Abandon button is always enabled
  if (abandonButton) abandonButton.disabled = false;

  // Update button states based on game over status (only affects normal systems)
  const buttons = document.querySelectorAll(".fix-button");
  buttons.forEach((button) => {
    button.disabled = gameState.gameOver;
    if (gameState.gameOver) {
      button.classList.add("game-over");
    } else {
      button.classList.remove("game-over");
    }
  });
}
