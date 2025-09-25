/**
 * Game module for the survival game.
 * This module initializes the game by loading configuration based on user selections,
 * setting up the initial state, and attaching event listeners to the UI buttons.
 * It serves as the entry point for the game page.
 * The game uses a modular architecture with separate concerns for maintainability.
 */
export async function initializeGame() {
  try {
    // Show loading overlay
    const loadingOverlay = document.getElementById("loading-overlay");
    if (loadingOverlay) {
      loadingOverlay.classList.remove("hidden");
    }
    // Import required modules
    const { getConfig } = await import("../../config.js");
    const { createGameState } = await import("./gameState.js");
    const { updateUI } = await import("./updateUI.js");
    const { handleClick } = await import("./handleClick.js");

    // Get URL parameters for selected systems and events
    const urlParams = new URLSearchParams(window.location.search);
    const selectedSystems = urlParams.get("systems")?.split(",") || [];
    const selectedEvents =
      urlParams.get("events")?.split("|").map(decodeURIComponent) || [];

    // Load full game configuration
    const fullConfig = await getConfig();

    // Filter config based on user selections
    const config = filterConfigBySelections(
      fullConfig,
      selectedSystems,
      selectedEvents
    );
    console.log("Filtered config loaded:", config);
    console.log("Selected systems:", selectedSystems);
    console.log("Selected events:", selectedEvents);

    // Create initial game state
    let gameState = createGameState(config);
    console.log("Initial game state:", gameState);

    // Apply initial deterioration for turn 1
    const { deteriorateSystems } = await import(
      "../mechanics/deteriorateSystems.js"
    );
    gameState = deteriorateSystems(gameState);

    // Update UI with initial state (after deterioration)
    updateUI(gameState, config);

    // Listen for interactive event completion
    document.addEventListener("interactiveEventCompleted", (event) => {
      gameState = event.detail.updatedState;

      // Update button states after interactive event completion
      const systemsContainer = document.querySelector(".systems-container");
      if (systemsContainer) {
        if (gameState.interactiveMode) {
          const allButtons = systemsContainer.querySelectorAll(".fix-button");
          allButtons.forEach((btn) => (btn.disabled = true));
        } else {
          const allButtons = systemsContainer.querySelectorAll(".fix-button");
          allButtons.forEach((btn) => (btn.disabled = false));
        }
      }
    });

    // Listen for system selection events
    document.addEventListener("systemSelected", async (event) => {
      const { selectSystem } = await import("../mechanics/systemSelection.js");
      gameState = await selectSystem(gameState, event.detail.systemName);

      // Dispatch custom event with current selection state
      const selectionEvent = new CustomEvent("systemSelectionChanged", {
        detail: { selectedSystems: gameState.selectedSystems || [] },
      });
      document.dispatchEvent(selectionEvent);
    });

    document.addEventListener("systemSelectionConfirmed", async (event) => {
      const { confirmSystemSelection } = await import(
        "../mechanics/systemSelection.js"
      );
      gameState = await confirmSystemSelection(gameState);
    });

    document.addEventListener("systemSelectionCancelled", async (event) => {
      const { cancelSystemSelection } = await import(
        "../mechanics/systemSelection.js"
      );
      gameState = await cancelSystemSelection(gameState);
    });

    // Use event delegation for system interactions (attaches to container that doesn't change)
    const systemsContainer = document.querySelector(".systems-container");
    if (systemsContainer) {
      systemsContainer.addEventListener("click", async (event) => {
        // Handle different types of system interactions
        const target = event.target;

        // Check for fix buttons (normal systems)
        if (target.classList.contains("fix-button")) {
          event.preventDefault();
          const systemName = target.dataset.system;

          // Import normal systems handler
          const { handleNormalInteraction } = await import(
            "./normalSystems.js"
          );
          gameState = await handleNormalInteraction(
            systemName,
            gameState,
            config
          );
        }
        // Check for active system interactions (custom buttons/actions)
        else if (
          target.closest(".system") &&
          target.hasAttribute("data-action")
        ) {
          event.preventDefault();
          const systemElement = target.closest(".system");
          const systemId = systemElement.id
            .replace("system-", "")
            .replace(/-/g, " ");
          const action = target.getAttribute("data-action");

          // Find the system object
          const system = gameState.systems.find(
            (sys) => sys.name.toLowerCase() === systemId.toLowerCase()
          );
          if (system && system.type === "active") {
            // Import active systems handler
            const { handleActiveInteraction } = await import(
              "./activeSystems.js"
            );
            gameState = await handleActiveInteraction(
              system,
              action,
              gameState,
              config
            );
          }
        }

        // Update UI after any interaction
        const { updateUI } = await import("./updateUI.js");
        updateUI(gameState, config);

        // Handle button states after interaction
        if (gameState.gameOver) {
          const allButtons = systemsContainer.querySelectorAll("button");
          allButtons.forEach((btn) => {
            btn.disabled = true;
            if (btn.classList.contains("fix-button")) {
              btn.classList.add("game-over");
            }
          });
        }

        // Disable buttons during interactive mode
        if (gameState.interactiveMode) {
          const allButtons = systemsContainer.querySelectorAll("button");
          allButtons.forEach((btn) => (btn.disabled = true));
        } else {
          // Re-enable buttons when not in interactive mode
          const allButtons = systemsContainer.querySelectorAll("button");
          allButtons.forEach((btn) => (btn.disabled = false));
        }
      });
    }

    // Attach button functionalities
    const retryButton = document.getElementById("retry-button");
    const setupButton = document.getElementById("setup-button");
    const abandonButton = document.getElementById("abandon-button");

    // Retry button functionality
    if (retryButton) {
      retryButton.addEventListener("click", async () => {
        // Reset game state
        gameState = createGameState(config);

        // Apply initial deterioration for turn 1
        gameState = deteriorateSystems(gameState);

        // Clear event log and reset to initial state
        const eventLogContent = document.getElementById("event-log-content");
        if (eventLogContent) {
          eventLogContent.innerHTML = `
            <div class="event-item">
              <span class="event-time">Turn 1</span>
              <span class="event-text">Game started</span>
            </div>
          `;
        }

        // Re-enable buttons and remove game-over class
        const allButtons = systemsContainer.querySelectorAll("button");
        allButtons.forEach((btn) => {
          btn.disabled = false;
          if (btn.classList.contains("fix-button")) {
            btn.classList.remove("game-over");
          }
        });

        // Update UI
        updateUI(gameState, config);

        console.log("Game restarted");
      });
    }

    // Setup button functionality
    if (setupButton) {
      setupButton.addEventListener("click", () => {
        window.location.href = "setup.html";
      });
    }

    // Abandon button functionality
    if (abandonButton) {
      abandonButton.addEventListener("click", () => {
        window.location.href = "index.html";
      });
    }

    // Hide loading overlay
    if (loadingOverlay) {
      loadingOverlay.classList.add("hidden");
    }

    console.log("Game initialized successfully");
  } catch (error) {
    console.error("Failed to initialize game:", error);
    // Hide loading overlay
    const loadingOverlay = document.getElementById("loading-overlay");
    if (loadingOverlay) {
      loadingOverlay.classList.add("hidden");
    }
    // Display error message to user
    const messageElement = document.getElementById("message-display");
    if (messageElement) {
      messageElement.textContent =
        "Error initializing game. Please refresh the page.";
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
  const filteredSystems = fullConfig.systems.filter((system) =>
    selectedSystems.includes(system.name)
  );

  // Filter events
  const filteredPositiveEvents = fullConfig.positiveEvents.filter((event) =>
    selectedEvents.includes(event.description)
  );

  const filteredNegativeEvents = fullConfig.negativeEvents.filter((event) =>
    selectedEvents.includes(event.description)
  );

  return {
    systems: filteredSystems,
    positiveEvents: filteredPositiveEvents,
    negativeEvents: filteredNegativeEvents,
  };
}
