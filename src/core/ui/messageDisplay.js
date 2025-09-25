/**
 * Message Display UI module for the survival game.
 * Handles updating the game message display.
 */

/**
 * Update the message display element
 * @param {Object} gameState - The current game state object
 */
export function updateMessageDisplay(gameState) {
  const messageElement = document.getElementById("message-display");
  if (messageElement) {
    const messageSpan = messageElement.querySelector("span");
    if (messageSpan) {
      messageSpan.textContent = gameState.message;
    }
  }
}
