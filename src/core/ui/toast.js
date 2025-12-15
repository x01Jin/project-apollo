/**
 * Toast Notification UI module for the survival game.
 * Handles showing event toast notifications with stacking and smooth animations.
 */

// Toast queue and management
let toastQueue = [];
let activeToasts = [];
const MAX_TOASTS = 4;
const TOAST_DURATION = 4000;

/**
 * Show an event toast notification
 * @param {Object} event - The event object containing type and description
 * @param {Object} config - The game configuration
 */
export function showEventToast(event, config) {
  // Add to queue
  toastQueue.push(event);

  // Process queue
  processToastQueue();
}

/**
 * Process the toast queue and display toasts
 */
function processToastQueue() {
  // Remove expired toasts first
  cleanupExpiredToasts();

  // Add new toasts if we have space
  while (toastQueue.length > 0 && activeToasts.length < MAX_TOASTS) {
    const event = toastQueue.shift();
    createAndShowToast(event);
  }
}

/**
 * Create and show a new toast
 * @param {Object} event - The event to display
 */
function createAndShowToast(event) {
  const toastId = `toast-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  // Clone the base toast element (if missing, create an off-DOM template)
  let baseToast = document.getElementById("event-toast");
  if (!baseToast) {
    // Create a minimal template to allow toasts to work without a page-provided template
    baseToast = document.createElement("div");
    baseToast.id = "event-toast";
    baseToast.style.display = "none";
    baseToast.innerHTML = `
      <div id="event-toast-title"></div>
      <div id="event-toast-description"></div>
      <i class="event-icon"></i>
    `;
    // Do not append template to document to avoid ID collisions
    // console.debug('Toast: using internal template');
  }

  const toast = baseToast.cloneNode(true);
  toast.id = toastId;
  toast.style.display = "block";

  // Update content
  updateToastContent(toast, event);

  // Add to DOM
  document.body.appendChild(toast);

  // Calculate stack position
  const stackPosition = activeToasts.length + 1;
  toast.classList.add(`stack-${stackPosition}`);

  // Create toast object
  const toastObj = {
    id: toastId,
    element: toast,
    stackPosition: stackPosition,
    createdAt: Date.now(),
    event: event,
  };

  // Add to active toasts
  activeToasts.push(toastObj);

  // Trigger show animation
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  // Set up auto-hide timer
  setTimeout(() => {
    hideToast(toastObj);
  }, TOAST_DURATION);

  // Update stack positions for all toasts
  updateStackPositions();
}

/**
 * Update toast content based on event
 * @param {HTMLElement} toast - The toast element
 * @param {Object} event - The event object
 */
function updateToastContent(toast, event) {
  const toastTitle = toast.querySelector("#event-toast-title");
  const toastDescription = toast.querySelector("#event-toast-description");
  const toastIcon = toast.querySelector(".event-icon");

  if (toastTitle && toastDescription && toastIcon) {
    // Determine if positive or negative event
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
  }
}

/**
 * Hide a toast with animation
 * @param {Object} toastObj - The toast object to hide
 */
function hideToast(toastObj) {
  const { element, id } = toastObj;

  // Start hide animation
  element.classList.remove("show");
  element.classList.add("hide");

  // Remove after animation completes
  setTimeout(() => {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }

    // Remove from active toasts
    activeToasts = activeToasts.filter((t) => t.id !== id);

    // Update stack positions
    updateStackPositions();

    // Process queue for new toasts
    processToastQueue();
  }, 400); // Match CSS transition duration
}

/**
 * Update stack positions for all active toasts
 */
function updateStackPositions() {
  activeToasts.forEach((toastObj, index) => {
    const newPosition = index + 1;
    if (toastObj.stackPosition !== newPosition) {
      // Remove old stack class
      toastObj.element.classList.remove(`stack-${toastObj.stackPosition}`);
      // Add new stack class
      toastObj.element.classList.add(`stack-${newPosition}`);
      toastObj.stackPosition = newPosition;
    }
  });
}

/**
 * Clean up expired toasts
 */
function cleanupExpiredToasts() {
  const now = Date.now();
  const expiredToasts = activeToasts.filter(
    (toast) => now - toast.createdAt >= TOAST_DURATION
  );

  expiredToasts.forEach((toastObj) => {
    hideToast(toastObj);
  });
}
