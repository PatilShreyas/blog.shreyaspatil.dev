# Shreyas Patil's Blog

The official codebase for [blog.shreyaspatil.dev](https://blog.shreyaspatil.dev). 🚀

This blog is built using **Astro v5**, **Tailwind CSS**, and **Pagefind** for high-performance static content and lightning-fast client-side search.

## ✨ Features

- **Blazing Fast**: Built with Astro v5 for optimal performance and near-zero JavaScript by default.
- **Magazine Layout**: Premium feed with horizontal thumbnails and clean typography.
- **Global Search**: Instant client-side search powered by Pagefind.
- **SEO Ready**: Automatic sitemaps, RSS feed, Open Graph images, and technical SEO meta tags.
- **Dark Mode**: Seamless light/dark mode transitions with system preference detection.
- **Gist Support**: Specialized loader for GitHub Gist embeds that works with View Transitions.
- **CI/CD**: Automatic push verification with GitHub Actions.

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm (or pnpm/yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/PatilShreyas/blog.shreyaspatil.dev.git

# Install dependencies
npm install
```

### Local Development

```bash
# Run the development server
npm run dev
```

> **Note on Search**: To see search results in development mode, you must have built the search index at least once.

## 📦 Build & Deployment

### Production Build

```bash
# Build the site and generate the search index
npm run build
```

The build process automatically:

1.  Runs `astro check` (Type validation)
2.  Runs `astro build` (Static site generation)
3.  Runs `pagefind` (Search indexing)
4.  Syncs the search index to `public/` for local testing.

### Deployment (Cloudflare Pages)

- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## 📝 Writing Posts

Add new Markdown files to `src/data/blog/`. Ensure they follow the frontmatter schema defined in `src/content.config.ts`.

## 🛠️ Tech Stack

- **Framework**: [Astro v5](https://astro.build/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Search Engine**: [Pagefind](https://pagefind.app/)
- **Typography**: [Google Fonts](https://fonts.google.com/) (Merriweather & Inter)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **Icons**: SVG based icons

---

© 2026 [Shreyas Patil](https://shreyaspatil.dev) — Licensed under the [Apache License 2.0](LICENSE)
