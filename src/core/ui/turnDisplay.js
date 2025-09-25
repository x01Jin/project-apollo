/**
 * Turn Display UI module for the survival game.
 * Handles updating the turn counter and progress bar display.
 */

/**
 * Update the turn display elements
 * @param {Object} gameState - The current game state object
 */
export function updateTurnDisplay(gameState) {
  // Update the turn display
  const turnTextElement = document.getElementById("turn-text");
  if (turnTextElement) {
    turnTextElement.textContent = `Turn: ${gameState.turn} / ${gameState.maxTurns}`;
  }

  // Update turn progress bar
  const turnProgressBar = document.getElementById("turn-progress-bar");
  if (turnProgressBar) {
    const progress = (gameState.turn / gameState.maxTurns) * 100;
    turnProgressBar.style.width = `${progress}%`;
  }

  // Update header to reflect dynamic turns
  const headerParagraph = document.querySelector(".game-header p");
  if (headerParagraph) {
    headerParagraph.textContent = `Maintain your ship's systems until rescue arrives in ${gameState.maxTurns} turns!`;
  }
}
