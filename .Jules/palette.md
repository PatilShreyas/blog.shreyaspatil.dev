## 2026-06-08 - Accessible Dynamic Elements Pattern
**Learning:** Dynamically injected UI elements (like code copy buttons) often miss critical accessibility and visual interaction states that static elements natively have. Setting `aria-live="polite"` handles state changes (e.g. from "Copy" to "Copied!") for screen readers correctly, while `active:scale-95` gives a physical-feeling tap feedback.
**Action:** When adding JS-generated UI components, systematically add hover/active states and ensure ARIA attributes (label, title, live) update synchronously with visual state changes.

## 2026-06-09 - Descriptive Action Tooltips on Toggles
**Learning:** For toggle buttons (like theme switchers), providing an `aria-label` or `title` that purely states the current state (e.g. "dark" or "auto") isn't fully informative to users hovering or using screen readers.
**Action:** Use action-oriented labels like "Switch to dark theme" so the user knows exactly what will happen when they click it. Keep these attributes dynamic so they always reflect the next intended state.

## 2026-06-26 - Accessible Active Navigation States
**Learning:** For accessible navigation, it is critical to always pair visual active states (e.g. active navigation link styling) with `aria-current="page"` to provide correct spatial context to screen reader users. However, in Astro components, conditionally rendering boolean attributes correctly requires setting the false state to `undefined` rather than `false`, so the attribute is cleanly omitted from the HTML (e.g. `aria-current={isActive ? 'page' : undefined}`). External links should not receive this attribute.
**Action:** When creating or updating navigation menus, ensure active internal links use `aria-current="page"`, and leverage Astro's `undefined` pattern for conditionally omitting HTML attributes correctly.
