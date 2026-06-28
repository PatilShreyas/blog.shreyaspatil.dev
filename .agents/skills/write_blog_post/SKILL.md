---
name: write_blog_post
description: Specialized skill to create, structure, and format new blog posts or modify existing posts on blog.shreyaspatil.dev.
---

# 📝 Skill: Write Blog Post

This skill guides AI agents in creating high-quality, perfectly formatted blog posts in this repository.

---

## 1. File Placement

*   **Markdown Post**: Create a new `.md` (or `.mdx`) file inside `src/data/blog/`.
*   **Filename**: Name your file using kebab-case matching the desired URL slug (e.g., `my-new-jetpack-compose-guide.md`).
*   **Images**: Put all cover images and inline assets inside `src/assets/images/`.

---

## 2. Frontmatter Schema (YAML)

Every blog post must begin with standard Frontmatter bounded by `---`. Use this strict template:

```yaml
---
title: "Your Post Title"
pubDatetime: 2026-06-28T16:25:00.000Z # ISO 8601 UTC string
description: "A compelling 1-2 sentence description for SEO and feed preview."
coverImage: "../../assets/images/your-cover-image.png" # Optional, must use relative path
tags:
  - Android # Match case-sensitively or add new ones
  - Kotlin
draft: false # Optional, set true to hide from feeds
---
```

### Important Formatting Constraints:
1.  **Do NOT include `subtitle`**: Subtitles are not supported by the Astro schema (`src/content.config.ts`).
2.  **`coverImage` Path**: Must be relative from the post file to the images folder (i.e. starting with `../../assets/images/`).
3.  **`pubDatetime`**: Must be a valid ISO Date string (e.g. `YYYY-MM-DDTHH:MM:SS.000Z`).

---

## 3. Writing Content Guidelines

*   **Syntax Highlighting**: Wrap code snippets in standard fenced code blocks with language annotations (e.g., ````kotlin ... ````). Shiki highlights them beautifully.
*   **Line Shimmer Utility**: To show a video/GIF with standard styles, refer to the `CUSTOMIZATION.md` file.
*   **Native Callouts**: You can use the native callout CSS structure inside posts for warnings or tips:
    ```html
    <div class="post-callout">
      <span class="emoji">💡</span>
      <div class="content">
        Your tip or message here!
      </div>
    </div>
    ```

---

## 4. Verification and Formatting

Once you have written or updated a blog post, run the following commands to format and verify the structure:

```bash
# 1. Format the Markdown file using Prettier
npm run format

# 2. Start local server to preview your post
npm run dev
```
