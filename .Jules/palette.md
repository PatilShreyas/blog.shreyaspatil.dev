## 2026-06-08 - Accessible Dynamic Elements Pattern
**Learning:** Dynamically injected UI elements (like code copy buttons) often miss critical accessibility and visual interaction states that static elements natively have. Setting `aria-live="polite"` handles state changes (e.g. from "Copy" to "Copied!") for screen readers correctly, while `active:scale-95` gives a physical-feeling tap feedback.
**Action:** When adding JS-generated UI components, systematically add hover/active states and ensure ARIA attributes (label, title, live) update synchronously with visual state changes.

## 2026-06-09 - Descriptive Action Tooltips on Toggles
**Learning:** For toggle buttons (like theme switchers), providing an `aria-label` or `title` that purely states the current state (e.g. "dark" or "auto") isn't fully informative to users hovering or using screen readers.
**Action:** Use action-oriented labels like "Switch to dark theme" so the user knows exactly what will happen when they click it. Keep these attributes dynamic so they always reflect the next intended state.

## 2026-06-15 - ARIA Labels for Icon-Only Navigation Controls
**Learning:** Icon-only navigation controls like the "Back to Top" button often lack accessible names, making them invisible or confusing to screen reader users. The visual context (an upward arrow) is lost without text.
**Action:** Always ensure that any button or link consisting solely of an icon has a clear, descriptive `aria-label` attribute (e.g., `aria-label="Back to Top"`) to provide parity in experience for assistive technologies.
