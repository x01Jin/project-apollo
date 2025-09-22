/**
 * Check Win/Lose module for the survival game.
 * This module evaluates the current game state to determine if the game has ended.
 * The game is won if the player survives all 15 turns with systems intact.
 * The game is lost if ALL systems fail (reach 0 health) before the rescue arrives.
 * This check is performed after each turn and after player actions.
 *
 * @param {Object} gameState - The current game state object.
 * @returns {Object} The updated game state with win/lose flags set.
 */
export function checkWinLose(gameState) {
  // Validate the gameState object
  if (!gameState || !gameState.systems || !Array.isArray(gameState.systems)) {
    throw new Error('Invalid gameState: systems array is required');
  }

  // Create a copy of the gameState to avoid mutation
  const updatedState = { ...gameState };

  // Check for loss condition: ALL systems have 0 or less health
  const allSystemsFailed = updatedState.systems.every(system => system.health <= 0);
  if (allSystemsFailed) {
    updatedState.gameOver = true;
    updatedState.win = false;
    updatedState.message = 'All ship systems have failed! Game Over.';
    return updatedState;
  }

  // Check for win condition: reached turn 15 without failure
  if (updatedState.turn >= updatedState.maxTurns) {
    updatedState.gameOver = true;
    updatedState.win = true;
    updatedState.message = 'Rescue has arrived! You survived! Congratulations!';
    return updatedState;
  }

  // Game continues if no win or lose condition is met
  // Preserve gameOver if already set (e.g., by Life Support failure)
  if (!updatedState.gameOver) {
    updatedState.gameOver = false;
  }
  updatedState.win = false;

  // Return the updated game state
  return updatedState;
}
