/**
 * System Selection UI module for the survival game.
 * Handles rendering and managing system selection mode UI elements.
 */

/**
 * Render system selection mode UI
 */
export function renderSystemSelectionMode(gameState, config) {
  document.body.classList.add("system-selection-active");

  let overlay = document.getElementById("system-selection-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "system-selection-overlay";
    overlay.className = "system-selection-overlay";
    overlay.style.pointerEvents = "none";
    document.body.appendChild(overlay);
  }

  let controls = document.getElementById("system-selection-controls");
  if (!controls) {
    controls = document.createElement("div");
    controls.id = "system-selection-controls";
    controls.className = "system-selection-controls";
    document.body.appendChild(controls);
  }

  const options = gameState.systemSelectionOptions;
  const selectedCount = gameState.selectedSystems?.length || 0;
  const selectionCountText = options.maxSelections
    ? `Selected: ${selectedCount}/${options.maxSelections} system${
        options.maxSelections !== 1 ? "s" : ""
      }`
    : `Selected: ${selectedCount} system${selectedCount !== 1 ? "s" : ""}`;

  const buttonsHtml =
    `<button class="system-selection-confirm" ${
      selectedCount === 0 ? "disabled" : ""
    }>Confirm</button>` +
    (options.showCancelButton
      ? '<button class="system-selection-cancel">Cancel</button>'
      : "");

  controls.innerHTML = `
    <div class="system-selection-header">
      <h3>System Selection</h3>
      <p>${options.message}</p>
      <p class="selection-count">${selectionCountText}</p>
    </div>
    <div class="system-selection-buttons">
      ${buttonsHtml}
    </div>
  `;

  // Add event listeners to buttons
  const confirmBtn = controls.querySelector(".system-selection-confirm");
  const cancelBtn = controls.querySelector(".system-selection-cancel");

  confirmBtn.addEventListener("click", () => {
    const event = new CustomEvent("systemSelectionConfirmed");
    document.dispatchEvent(event);
  });

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      const event = new CustomEvent("systemSelectionCancelled");
      document.dispatchEvent(event);
    });
  }

  updateSystemSelectability(gameState);
}

/**
 * Update system elements to be selectable based on current selection mode
 */
export function updateSystemSelectability(gameState) {
  const systems = document.querySelectorAll(".system");
  const options = gameState.systemSelectionOptions;
  const selectedSystems = gameState.selectedSystems || [];

  systems.forEach((systemEl) => {
    const systemName = systemEl.dataset.systemName;
    if (!systemName) return;

    const system = gameState.systems.find((s) => s.name === systemName);
    if (!system) return;

    const isAllowed =
      options.allowedTypes.includes(system.type || "normal") &&
      (!options.systemFilter || options.systemFilter(system));

    systemEl.classList.toggle("system-selectable", isAllowed);

    const buttons = systemEl.querySelectorAll("button");
    buttons.forEach((button) => {
      button.style.display = gameState.systemSelectionMode ? "none" : "";
    });

    if (isAllowed && !systemEl.hasSystemSelectionHandler) {
      const handler = () => {
        const event = new CustomEvent("systemSelected", {
          detail: { systemName },
        });
        document.dispatchEvent(event);
      };
      systemEl.addEventListener("click", handler);
      systemEl.systemSelectionHandler = handler;
      systemEl.hasSystemSelectionHandler = true;
    }
  });
}

/**
 * Remove system selection mode UI elements
 */
export function removeSystemSelectionUI() {
  const overlay = document.getElementById("system-selection-overlay");
  if (overlay) overlay.remove();

  const controls = document.getElementById("system-selection-controls");
  if (controls) controls.remove();

  document.body.classList.remove("system-selection-active");

  const systems = document.querySelectorAll(".system");
  systems.forEach((systemEl) => {
    if (systemEl.systemSelectionHandler) {
      systemEl.removeEventListener("click", systemEl.systemSelectionHandler);
      delete systemEl.systemSelectionHandler;
    }
    systemEl.hasSystemSelectionHandler = false;
    systemEl.classList.remove("system-selectable");
    const buttons = systemEl.querySelectorAll("button");
    buttons.forEach((button) => {
      button.style.display = "";
    });
  });
}
