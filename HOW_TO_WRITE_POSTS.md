# How to Write Blog Posts

Welcome to your new Astro-powered blog! Follow this guide to create and publish new blog posts.

## 1. Where to Put Your Files
- **Blog Posts (`.md` or `.mdx`)**: All your blog posts live inside the `src/data/blog/` directory.
- **Images**: Store your cover images and post-specific assets in `src/assets/images/`.

## 2. Creating a New Post
To create a new post, simply create a new markdown file (e.g., `my-new-post.md`) in `src/data/blog/`.

The name of the file will automatically become the URL slug of the post (e.g., `blog.shreyaspatil.dev/posts/my-new-post`).

### The Frontmatter
Every post must begin with "frontmatter" (YAML metadata at the top of the file bounded by `---`). Here is the complete template you should use:

```yaml
---
title: "Your Awesome Blog Post Title"
subtitle: "An optional catchy subtitle to provide more context"
pubDatetime: 2024-10-21T05:33:17.000Z
description: "A short 1-2 sentence description used for SEO and previews."
coverImage: "../../assets/images/your-cover-image.png" # Optional
tags:
  - Android
  - Kotlin
  - AI
---

Your markdown content starts here!
```

**Required Fields:**
- `title`: The main title of your post.
- `pubDatetime`: The publish date (ISO 8601 format).
- `description`: A brief summary of your post for social media previews and search engines.

**Optional Fields:**
- `subtitle`: Appears beautifully italicized right below the main title.
- `coverImage`: Must be a relative path (e.g., `../../assets/images/image.png`). This will automatically be optimized by Astro and used as the rich preview image when you share the post on social media!
- `tags`: An array of tags for categorizing your post.
- `draft`: Set to `true` if you are still working on the post and don't want it published yet.

## 3. Adding Content
You can write your post using standard Markdown syntax.

### Code Snippets
Your blog has built-in Shiki syntax highlighting. Just use standard markdown code blocks:

\`\`\`kotlin
fun main() {
    println("Hello World!")
}
\`\`\`

### Links and Embeds
Use standard markdown links: `[Text](URL)`. 

**Rich Embeds (Automatic):**
- **YouTube**: Simply paste the YouTube link (e.g., `https://youtu.be/ID`) on its own line, and it will automatically be converted into a responsive video player.
- **GitHub Gists**: Paste the link to your Gist on its own line, and it will be transformed into an interactive code snippet.

*(Note: If you want to embed custom React/UI components in the future, you can rename your files to `.mdx` and import your components!)*

## 4. Previewing Your Work
To see your post live as you write it, open your terminal in the project directory and run:

```bash
npm run dev
```
Then open `http://localhost:4321` in your browser. The page will auto-reload as you save your file.

## 5. Publishing
Once you are happy with the post, simply commit and push your new `.md` file to your GitHub repository. Your hosting provider (Vercel, Cloudflare Pages, GitHub Pages, etc.) will automatically build and deploy the changes!
