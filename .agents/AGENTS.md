# 🤖 AI Agent Guidelines & Rules (AGENTS.md)

Welcome, AI Coding Assistant! This file provides essential guidelines, context, and structural instructions for working in this codebase. Refer to these rules to maintain high quality, performance, and formatting.

---

## 📂 Codebase Overview

This repository is the official codebase for **Shreyas Patil's Blog** ([blog.shreyaspatil.dev](https://blog.shreyaspatil.dev)).

*   **Framework**: [Astro v7](https://astro.build/) (Static Site Generation)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Search**: [Pagefind](https://pagefind.app/) (client-side search engine)
*   **Typography**: Google Fonts — **Lora** (Body serif) & **Inter** (Heading sans-serif)
*   **Deployment**: Cloudflare Workers Assets

---

## 🛠️ Critical Directories & Paths

*   **Blog Posts**: `src/data/blog/*.md` (Content Collection source)
*   **Assets / Images**: `src/assets/images/`
*   **Global Layout**: `src/layouts/Layout.astro`
*   **Post Details Layout**: `src/layouts/PostDetails.astro`
*   **Global Styles**: `src/styles/global.css` & `src/styles/typography.css`
*   **Config File**: `src/config.ts`

---

## ⚙️ Key Agent Rules & Constraints

### 1. Font and Typography Integrity
*   Always use `Lora` and `Inter` for styling.
*   Do not inject external google fonts manually or import additional fonts. They are pre-bundled and preloaded via `astro.config.ts` and `Layout.astro`.

### 2. Styling and Global Utility Classes
Instead of writing inline custom sizes or margins, prefer the predefined global utilities in `src/styles/global.css`:
*   `app-layout`: Centers content and applies standardized padding constraints.
*   `max-w-app`: Restricts elements to standard readable container width (`max-w-2xl`).
*   `img-shimmer`: Adds standard loading shimmer animations to images.

### 3. Frontmatter schema strictness
*   When editing or suggesting metadata templates, adhere strictly to `src/content.config.ts`.
*   **Do NOT suggest or use `subtitle`** in post frontmatter — it is not supported by the schema or Astro layout rendering.

### 4. Sandboxed Build Warning (Satori OG Generation)
*   Dynamic Open Graph images (`/og.png` / `/posts/.../index.png`) use Satori, which performs a build-time network fetch to download Google Fonts.
*   If you are running in a restricted sandbox or a CLI/Agent environment with offline/throttled network capabilities, running `npm run build` may fail with a `Connect Timeout Error` fetching Google Fonts. This is a network-sandbox limitation and not an error with your code.

---

## 🚀 Specialized Agent Skills

We have defined several customized Agent Skills under the `.agents/skills/` directory:
*   [Write Blog Post Skill](file:///.agents/skills/write_blog_post/SKILL.md): Complete guidelines on writing, updating, formatting, and indexing new blog posts.
*   [Development Guide Skill](file:///.agents/skills/development_guide/SKILL.md): Steps for formatting, building, deploying, and troubleshooting development tasks.
