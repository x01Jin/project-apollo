# Performance patch #1

- Cached commonly queried DOM nodes to reduce repeated `querySelector` calls.
- Batched system creation using `DocumentFragment` to avoid multiple reflows.
- Reduced repeated `innerHTML` churn on interactive elements (fix buttons now update text only).
- Optimized selection code to avoid O(n^2) scans when toggling system selectability.
- Optional UI profiling: set `window.DEBUG_UI = true` in the browser console to log `updateUI` timing.
- Fixed fix-button click handling: use delegated handlers with `target.closest('.fix-button')` so clicks on child elements (icons / spans) are handled reliably (prevents intermittent unresponsiveness).
