## 2026-06-08 - Accessible Dynamic Elements Pattern
**Learning:** Dynamically injected UI elements (like code copy buttons) often miss critical accessibility and visual interaction states that static elements natively have. Setting `aria-live="polite"` handles state changes (e.g. from "Copy" to "Copied!") for screen readers correctly, while `active:scale-95` gives a physical-feeling tap feedback.
**Action:** When adding JS-generated UI components, systematically add hover/active states and ensure ARIA attributes (label, title, live) update synchronously with visual state changes.

## 2026-06-09 - Descriptive Action Tooltips on Toggles
**Learning:** For toggle buttons (like theme switchers), providing an `aria-label` or `title` that purely states the current state (e.g. "dark" or "auto") isn't fully informative to users hovering or using screen readers.
**Action:** Use action-oriented labels like "Switch to dark theme" so the user knows exactly what will happen when they click it. Keep these attributes dynamic so they always reflect the next intended state.

## 2026-06-11 - Accessible Active States in Navigation
**Learning:** Adding a visual indicator for the active navigation item (like an underline) is not enough for screen reader users. They need a programmatic way to know which page they are currently on. Additionally, icons within interactive elements that already have text alternatives (e.g., `aria-label` or visible text) can create redundant noise for screen readers.
**Action:** Use `aria-current="page"` on navigation links that represent the current page. Always add `aria-hidden="true"` to decorative icons inside interactive elements to keep the screen reader output clean and focused on the action.
