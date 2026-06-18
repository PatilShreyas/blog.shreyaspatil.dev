## 2026-06-08 - Accessible Dynamic Elements Pattern
**Learning:** Dynamically injected UI elements (like code copy buttons) often miss critical accessibility and visual interaction states that static elements natively have. Setting `aria-live="polite"` handles state changes (e.g. from "Copy" to "Copied!") for screen readers correctly, while `active:scale-95` gives a physical-feeling tap feedback.
**Action:** When adding JS-generated UI components, systematically add hover/active states and ensure ARIA attributes (label, title, live) update synchronously with visual state changes.

## 2026-06-09 - Descriptive Action Tooltips on Toggles
**Learning:** For toggle buttons (like theme switchers), providing an `aria-label` or `title` that purely states the current state (e.g. "dark" or "auto") isn't fully informative to users hovering or using screen readers.
**Action:** Use action-oriented labels like "Switch to dark theme" so the user knows exactly what will happen when they click it. Keep these attributes dynamic so they always reflect the next intended state.

## 2026-06-18 - Accessible Icon-Only Anchor Links
**Learning:** Icon-only anchor links generated dynamically via JavaScript (such as heading anchor links) often lack accessible names because they typically contain just a symbol (like "#") hidden with `aria-hidden="true"`, causing screen readers to skip them or read out confusing contexts.
**Action:** Always assign meaningful `aria-label` and `title` attributes to generated icon-only links based on the context they link to (e.g. use the text content of the heading to provide "Link to section: [Heading]").
