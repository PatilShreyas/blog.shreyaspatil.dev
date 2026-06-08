## 2026-06-08 - Accessible Dynamic Elements Pattern
**Learning:** Dynamically injected UI elements (like code copy buttons) often miss critical accessibility and visual interaction states that static elements natively have. Setting `aria-live="polite"` handles state changes (e.g. from "Copy" to "Copied!") for screen readers correctly, while `active:scale-95` gives a physical-feeling tap feedback.
**Action:** When adding JS-generated UI components, systematically add hover/active states and ensure ARIA attributes (label, title, live) update synchronously with visual state changes.

## 2026-06-07 - Add aria-current to Active Navigation Links
**Learning:** Adding `aria-current="page"` conditionally via Astro (`aria-current={isActive(path) ? "page" : undefined}`) is an effective and safe way to signal the active navigation item to screen readers without rendering unwanted `undefined` attributes when inactive.
**Action:** Always include `aria-current="page"` on active items within site navigation menus to improve keyboard and screen reader accessibility.
