---
name: development_guide
description: Guides AI agents through local development, building, code formatting, linting, and style sheet customization.
---

# 🛠️ Skill: Development Guide

This skill details standard development workflows, commands, and styling systems for blog.shreyaspatil.dev.

---

## 🚀 1. Setup and Local Development

Ensure Node.js (v20+) is installed, then run the development server:

```bash
# Install dependencies (if needed)
npm install

# Start local server
npm run dev
```

*   **Default Port**: The local server typically runs on `http://localhost:4321`.
*   **Search Previews**: To test client-side search in development mode, you must build the site at least once so that the `pagefind` index is generated in the `public/` directory.

---

## 🧪 2. Code Quality & Build Verification

Before committing code or submitting pull requests, run these verification steps:

```bash
# 1. Format the codebase
npm run format

# 2. Check formatting consistency
npm run format:check

# 3. Lint the Javascript/Typescript files
npm run lint

# 4. Production build (Astro check + Astro build + Pagefind indexing)
npm run build
```

---

## 🎨 3. Styling & Global Utilities Reference

The blog is built using **Tailwind CSS v4** combined with specific base overrides in `src/styles/global.css`.

### Custom Theme Values
Predefined CSS variables are responsive and adapt dynamically to Light and Dark modes:
*   `--background`: `#f9f8f6` (Light) / `#1c1917` (Dark)
*   `--foreground`: `#1a1a1a` (Light) / `#e7e5e4` (Dark)
*   `--accent`: `#674e37` (Light) / `#d4b28a` (Dark) (Warm honey, AAA contrast compliant)

### Useful Tailwind Utilities
Always prefer these classes over raw margins/padding:
*   `app-layout`: Adds standard horizontal constraints and centers page layouts.
*   `max-w-app`: Sets max-width to the standard comfortable reading width (2XL).
*   `img-shimmer`: Adds custom visual skeleton load/shimmer animations to images.

---

## 🪵 4. Troubleshooting Build Failures
*   **Satori OG Image fetch failures**: When building in offline or heavily restricted network sandboxes, `npm run build` might fail during the rendering of `/og.png` or other `.png` dynamic routes. This is because Satori attempts to load fonts via Google Fonts APIs at build time. This is expected and not an error with local code.
