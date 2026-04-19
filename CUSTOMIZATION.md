# 🎨 Blog Customization Guide

This document serves as a reference for all the custom "Native" styles and components available for your blog posts. Use these snippets to ensure your content stays visually consistent and high-performance.

---

## 💡 Native Callouts
Used for "Pro Tips", "Notes", or "Warnings". These are theme-aware and look great in both light and dark modes.

**Snippet:**
```html
<div class="post-callout">
  <span class="emoji">💡</span>
  <div class="content">
    Your important message or tip goes here. You can even include [links](https://shreyaspatil.dev)!
  </div>
</div>
```

---

## 🖍️ Highlights
Use the standard `<mark>` tag to highlight key sentences. It uses a subtle rounded background that adapts to your theme colors.

**Snippet:**
```html
This is a regular sentence with a <mark>perfectly styled highlight</mark> in the middle.
```

---

## 🎬 Video Embeds
For high-performance demos (e.g., AppFunctions). To stay under Cloudflare's 25MiB limit, we recommend hosting videos on GitHub and using this structure.

**Snippet:**
```html
<video controls width="100%">
  <source src="https://github.com/USER/REPO/raw/main/video.webm" type="video/webm">
  Your browser does not support the video tag.
</video>
```
*Note: The first frame of the video is automatically used as the preview poster.*

---

## ⌨️ GitHub Gists
Standard way to embed interactive, syntax-highlighted code.

**Snippet:**
```html
<script src="https://gist.github.com/PatilShreyas/your-gist-id.js"></script>
```

---

## 📝 Frontmatter Reference
Every post should have these fields at the top of the `.md` file.

**Template:**
```yaml
---
title: "Your Amazing Post Title"
pubDatetime: 2024-03-20T10:00:00Z
description: "A concise 1-2 sentence summary for SEO and social sharing."
tags:
  - android
  - kotlin
  - jetpack-compose
coverImage: "../../assets/images/your-cover-image.jpg"
---
```

---

## 🚀 Performance Checklist
1. **Images**: Use `.jpg` or `.webp` for covers. Aim for < 500KB.
2. **GIFs**: If a GIF is > 5MB, consider converting it to a `.webm` video.
3. **Alt Text**: Always include descriptive text for images for better accessibility.

---

## 🛠️ Global Utilities
You can use these Tailwind classes for custom layouts if needed:
- `app-layout`: Centers content and adds standard padding.
- `max-w-app`: Restricts width to the standard blog reading width (2XL).
- `img-shimmer`: Adds a loading shimmer effect to any image.
