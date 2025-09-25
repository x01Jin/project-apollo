/**
 * Setup module for the survival game.
 * This module handles the game setup interface where players select
 * which systems and events to include in their game.
 * The setup determines the maximum turns based on selected systems.
 */
export async function initializeSetup() {
  try {
    // Show loading overlay
    const loadingOverlay = document.getElementById("loading-overlay");
    if (loadingOverlay) {
      loadingOverlay.classList.remove("hidden");
    }
    // Get all available systems and events from config
    const { getConfig } = await import("../../config.js");
    const config = await getConfig();

    // Available systems and events
    const availableSystems = config.systems;
    const availableEvents = [
      ...config.positiveEvents.map((event) => ({ ...event, type: "positive" })),
      ...config.negativeEvents.map((event) => ({ ...event, type: "negative" })),
    ];

    // Selected items
    let selectedSystems = [];
    let selectedEvents = [];

    // DOM elements
    const systemsGrid = document.getElementById("systems-grid");
    const eventsGrid = document.getElementById("events-grid");
    const systemsCount = document.getElementById("systems-count");
    const eventsCount = document.getElementById("events-count");
    const beginButton = document.getElementById("begin-game-button");
    const rescueTime = document.getElementById("rescue-time");
    const selectedSystemsDisplay = document.getElementById("selected-systems");
    const selectedEventsDisplay = document.getElementById("selected-events");

    // Create system selection cards
    availableSystems.forEach((system) => {
      const card = createSystemCard(system);
      systemsGrid.appendChild(card);
    });

    // Create event selection cards
    availableEvents.forEach((event) => {
      const card = createEventCard(event);
      eventsGrid.appendChild(card);
    });

    // Update UI function
    function updateUI() {
      systemsCount.textContent = selectedSystems.length;
      eventsCount.textContent = selectedEvents.length;

      const maxTurns = selectedSystems.length * 5;
      rescueTime.textContent = `${maxTurns} turns`;

      selectedSystemsDisplay.textContent =
        selectedSystems.length > 0
          ? selectedSystems.map((s) => s.name).join(", ")
          : "None";

      selectedEventsDisplay.textContent =
        selectedEvents.length > 0
          ? selectedEvents
              .map((e) => e.description.split("!")[0] + "!")
              .join(", ")
          : "None";

      // Enable/disable begin button based on system selection (3-8 systems required)
      beginButton.disabled =
        selectedSystems.length < 3 || selectedSystems.length > 8;
    }

    // Toggle system selection
    function toggleSystem(system, checkbox) {
      if (checkbox.checked) {
        selectedSystems.push(system);
      } else {
        selectedSystems = selectedSystems.filter((s) => s !== system);
      }
      updateUI();
    }

    // Toggle event selection
    function toggleEvent(event, checkbox) {
      if (checkbox.checked) {
        selectedEvents.push(event);
      } else {
        selectedEvents = selectedEvents.filter((e) => e !== event);
      }
      updateUI();
    }

    // Create system selection card
    function createSystemCard(system) {
      const card = document.createElement("div");
      card.className = "selection-card system-card";
      card.dataset.systemName = system.name;

      const icon = system.icon;
      const isSelected = selectedSystems.includes(system);

      card.innerHTML = `
        <div class="card-header">
          <i class="${icon}"></i>
          <input type="checkbox" ${isSelected ? "checked" : ""}>
        </div>
        <h3>${system.name}</h3>
        <p>${system.caveat}</p>
      `;

      const checkbox = card.querySelector('input[type="checkbox"]');
      checkbox.addEventListener("change", () => toggleSystem(system, checkbox));

      // Make the entire card clickable to toggle the checkbox
      card.addEventListener("click", (event) => {
        if (event.target === checkbox) return; // Let checkbox handle its own clicks
        checkbox.checked = !checkbox.checked;
        toggleSystem(system, checkbox);
      });

      if (isSelected) {
        card.classList.add("selected");
      }

      return card;
    }

    // Create event selection card
    function createEventCard(eventObj) {
      const card = document.createElement("div");
      card.className = `selection-card event-card ${eventObj.type}`;
      card.dataset.eventDescription = eventObj.description;

      const icon =
        eventObj.type === "positive"
          ? "fas fa-plus-circle"
          : "fas fa-minus-circle";
      const isSelected = selectedEvents.includes(eventObj);

      card.innerHTML = `
        <div class="card-header">
          <i class="${icon}"></i>
          <input type="checkbox" ${isSelected ? "checked" : ""}>
        </div>
        <h3>${eventObj.type === "positive" ? "Positive" : "Negative"} Event</h3>
        <p>${eventObj.description}</p>
      `;

      const checkbox = card.querySelector('input[type="checkbox"]');
      checkbox.addEventListener("change", () =>
        toggleEvent(eventObj, checkbox)
      );

      // Make the entire card clickable to toggle the checkbox
      card.addEventListener("click", (clickEvent) => {
        if (clickEvent.target === checkbox) return; // Let checkbox handle its own clicks
        checkbox.checked = !checkbox.checked;
        toggleEvent(eventObj, checkbox);
      });

      if (isSelected) {
        card.classList.add("selected");
      }

      return card;
    }

    // Handle begin game button
    beginButton.addEventListener("click", () => {
      if (selectedSystems.length >= 3 && selectedSystems.length <= 8) {
        // Create URL parameters
        const systemNames = selectedSystems.map((s) => s.name);
        const eventDescriptions = selectedEvents.map((e) =>
          encodeURIComponent(e.description)
        );

        const params = new URLSearchParams({
          systems: systemNames.join(","),
          events: eventDescriptions.join("|"),
        });

        // Navigate to game page with selections
        window.location.href = `game.html?${params.toString()}`;
      }
    });

    // Initialize UI
    updateUI();

    // Hide loading overlay
    if (loadingOverlay) {
      loadingOverlay.classList.add("hidden");
    }

    console.log("Setup initialized successfully");
  } catch (error) {
    console.error("Failed to initialize setup:", error);
    // Hide loading overlay
    const loadingOverlay = document.getElementById("loading-overlay");
    if (loadingOverlay) {
      loadingOverlay.classList.add("hidden");
    }
    // Display error message to user
    const container = document.querySelector(".setup-container");
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <h2>Error Loading Setup</h2>
          <p>Please refresh the page and try again.</p>
          <a href="index.html" class="back-button">Back to Home</a>
        </div>
      `;
    }
  }
}
