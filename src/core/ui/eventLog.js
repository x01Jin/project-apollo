/**
 * Event Log UI module for the survival game.
 * Handles adding events to the event log display.
 */

/**
 * Add an event to the event log
 * @param {string} eventText - The event description to log
 * @param {number} turn - The current turn number
 */
export function addEventToLog(eventText, turn) {
  const eventLogContent = document.getElementById("event-log-content");
  if (eventLogContent) {
    const eventItem = document.createElement("div");
    eventItem.className = "event-item";

    const eventTime = document.createElement("span");
    eventTime.className = "event-time";
    eventTime.textContent = `Turn ${turn}`;

    const eventTextSpan = document.createElement("span");
    eventTextSpan.className = "event-text";
    eventTextSpan.textContent = eventText;

    eventItem.appendChild(eventTime);
    eventItem.appendChild(eventTextSpan);

    eventLogContent.appendChild(eventItem);

    // Auto-scroll to bottom
    eventLogContent.scrollTop = eventLogContent.scrollHeight;
  }
}
