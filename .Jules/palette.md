## 2026-06-07 - Add aria-current to Active Navigation Links
**Learning:** Adding `aria-current="page"` conditionally via Astro (`aria-current={isActive(path) ? "page" : undefined}`) is an effective and safe way to signal the active navigation item to screen readers without rendering unwanted `undefined` attributes when inactive.
**Action:** Always include `aria-current="page"` on active items within site navigation menus to improve keyboard and screen reader accessibility.
