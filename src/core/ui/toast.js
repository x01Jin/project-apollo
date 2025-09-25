/**
 * Toast Notification UI module for the survival game.
 * Handles showing event toast notifications.
 */

/**
 * Show an event toast notification
 * @param {Object} event - The event object containing type and description
 * @param {Object} config - The game configuration
 */
export function showEventToast(event, config) {
  const toast = document.getElementById("event-toast");
  const toastTitle = document.getElementById("event-toast-title");
  const toastDescription = document.getElementById("event-toast-description");
  const toastIcon = document.querySelector(".event-icon");

  if (toast && toastTitle && toastDescription && toastIcon) {
    // Determine if positive or negative event based on event type from triggerEvent
    // event.isPositive is set in triggerEvent.js when the event is triggered
    const isPositive = event.isPositive === true;

    toastTitle.textContent = isPositive ? "Positive Event!" : "Negative Event!";
    toastDescription.textContent = event.description;

    // Update icon and colors
    if (isPositive) {
      toastIcon.className = "fas fa-star event-icon";
      toastIcon.style.color = "var(--success-color)";
      toast.style.borderLeft = "4px solid var(--success-color)";
    } else {
      toastIcon.className = "fas fa-exclamation-triangle event-icon";
      toastIcon.style.color = "var(--danger-color)";
      toast.style.borderLeft = "4px solid var(--danger-color)";
    }

    // Show toast
    toast.style.display = "block";

    // Auto-hide after 4 seconds
    setTimeout(() => {
      toast.style.display = "none";
    }, 4000);
  }
}
