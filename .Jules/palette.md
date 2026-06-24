## 2026-06-08 - Accessible Dynamic Elements Pattern
**Learning:** Dynamically injected UI elements (like code copy buttons) often miss critical accessibility and visual interaction states that static elements natively have. Setting `aria-live="polite"` handles state changes (e.g. from "Copy" to "Copied!") for screen readers correctly, while `active:scale-95` gives a physical-feeling tap feedback.
**Action:** When adding JS-generated UI components, systematically add hover/active states and ensure ARIA attributes (label, title, live) update synchronously with visual state changes.

## 2026-06-09 - Descriptive Action Tooltips on Toggles
**Learning:** For toggle buttons (like theme switchers), providing an `aria-label` or `title` that purely states the current state (e.g. "dark" or "auto") isn't fully informative to users hovering or using screen readers.
**Action:** Use action-oriented labels like "Switch to dark theme" so the user knows exactly what will happen when they click it. Keep these attributes dynamic so they always reflect the next intended state.

## 2026-06-10 - Accessible Navigation Active States
**Learning:** While navigation links often use custom visual classes (like `.active-nav`) to denote the current page visually, screen readers rely on native attributes. Without `aria-current="page"`, assistive technologies cannot tell which link corresponds to the current page.
**Action:** Always pair visual active states with `aria-current="page"` (using `aria-current={isActive ? 'page' : undefined}`) to ensure correct spatial context for all users. Do not apply this to external links.
