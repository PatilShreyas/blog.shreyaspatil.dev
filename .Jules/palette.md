## 2026-06-08 - Accessible Dynamic Elements Pattern
**Learning:** Dynamically injected UI elements (like code copy buttons) often miss critical accessibility and visual interaction states that static elements natively have. Setting `aria-live="polite"` handles state changes (e.g. from "Copy" to "Copied!") for screen readers correctly, while `active:scale-95` gives a physical-feeling tap feedback.
**Action:** When adding JS-generated UI components, systematically add hover/active states and ensure ARIA attributes (label, title, live) update synchronously with visual state changes.

## 2026-06-09 - Descriptive Action Tooltips on Toggles
**Learning:** For toggle buttons (like theme switchers), providing an `aria-label` or `title` that purely states the current state (e.g. "dark" or "auto") isn't fully informative to users hovering or using screen readers.
**Action:** Use action-oriented labels like "Switch to dark theme" so the user knows exactly what will happen when they click it. Keep these attributes dynamic so they always reflect the next intended state.

## 2026-06-25 - Spatial Context for Visual Active States in Navigation
**Learning:** Visual active states (like CSS classes for the current page in a navigation menu) do not automatically convey their meaning to screen reader users. Simply styling the active page link creates a disconnect for accessibility. Setting the `aria-current="page"` attribute purely matches the visual representation of spatial context for screen readers. Furthermore, conditional attributes using `undefined` cleanly omit it when false, keeping the DOM clean. Lastly, external links should never receive this attribute since they leave the active internal scope.
**Action:** Always accompany visual active state styles with an equivalent `aria-current="page"` attribute for internal navigation elements and omit it cleanly using `undefined` when inactive. Never apply this attribute to external links.
