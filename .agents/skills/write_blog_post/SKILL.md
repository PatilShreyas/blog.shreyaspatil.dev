---
name: write_blog_post
description: Specialized skill to create, structure, and format new blog posts or modify existing posts on blog.shreyaspatil.dev.
---

# 📝 Skill: Write Blog Post

This skill guides AI agents and human authors in creating high-quality, perfectly formatted blog posts for **blog.shreyaspatil.dev**. It details every supported schema field, custom markdown style, layout rule, and interactive element available in this codebase, drawing directly from live blog configurations and existing posts.

---

## 1. File Placement & Naming Conventions

*   **Markdown Posts**: All blog posts live as Markdown files (`.md` or `.mdx`) in `src/data/blog/`.
*   **Ignored Files**: Files prefixed with an underscore (e.g., `_draft-post.md`) are ignored by the loader.
*   **Filenames (Slugs)**: Name files using kebab-case matching the desired URL slug (e.g., `a-simple-key-to-a-better-lazylist-in-jetpack-compose.md`).
*   **Media Assets**: Place post-specific content images under `src/assets/images/content/<post-slug>/` to keep assets organized. Cover images should go directly under `src/assets/images/`.

---

## 2. Frontmatter Schema (YAML)

Every blog post must begin with standard YAML frontmatter bounded by `---`. Below is the complete template representing all supported fields as defined by the Zod schema in `src/content.config.ts`:

```yaml
---
title: "Solving the Mystery of Recompositions in Compose's LazyList"
pubDatetime: 2026-06-28T16:25:00.000Z # ISO 8601 UTC string (required)
modDatetime: 2026-06-29T10:00:00.000Z # ISO 8601 UTC string (optional)
description: "A compelling 1-2 sentence description for SEO and feed preview."
author: "Shreyas Patil" # Defaults to SITE.author if omitted
tags:
  - Android # Case-sensitive array (defaults to ["others"] if omitted)
  - Jetpack Compose
featured: false # Optional, set true to pin to featured posts
draft: false # Optional, set true to hide from all public listings and feeds
coverImage: "../../assets/images/cover-my-lazy-list-post.png" # Optional, relative path to cover asset
ogImage: "../../assets/images/cover-my-lazy-list-post.png" # Optional, relative path to social sharing image (must be >= 1200x630px)
canonicalURL: "https://yourcustomdomain.com/canonical-slug" # Optional, if republished from elsewhere
editPost: # Optional configuration to let users edit the post
  disabled: false
  text: "Suggest Edits"
  appendFilePath: true
---
```

### ⚠️ Schema Strictness & Constraints:
1.  **Do NOT use `subtitle`**: Subtitles are not supported by the Astro collection schema or the rendering layouts (`PostDetails.astro`).
2.  **`coverImage` and `ogImage` Paths**: Must be valid relative paths from the markdown file to the asset directory (e.g., starting with `../../assets/images/`).
3.  **`ogImage` Pixel Limits**: If specified, the image must be at least **1200 × 630 pixels**. If omitted, a dynamic Open Graph image is automatically generated at build time using Satori.

---

## 3. Supported Post Styles & Elements Guide

The blog features a highly customized typography system (`src/styles/typography.css`) and global utilities (`src/styles/global.css`) designed to render long-form technical content beautifully.

### A. Headings
Use standard markdown headings. They are automatically styled with the premium sans-serif heading font **Inter** for maximum clarity and structure:
```markdown
## This is an H2 (Section Title)
### This is an H3 (Subsection Title)
#### This is an H4 (Sub-subsection / Italicized Title)
```

### B. Typography & Inline Text Elements
*   **Body Text**: Standard paragraph text automatically renders in **Lora** (a premium, highly legible serif font perfect for reading).
*   **Bold / Strong**: `**bold text**` gets standard heavy styling in **Lora**.
*   **Italics**: `*italic text*` or `_italic text_` is fully supported.
*   **Inline Code**: Fenced in single backticks (e.g., `` `var myState = remember { mutableStateOf(false) }` ``) renders with a monospace font, subtle rounded background, and adaptive contrast that shifts beautifully in light/dark mode.
*   **Highlights**: Wrap text in HTML `<mark>` tags for a warm, theme-aware highlight box:
    ```markdown
    We want to avoid <mark>unnecessary recompositions</mark> in our lists.
    ```

### C. Lists
*   **Unordered Lists**: Use `-` or `*`. Rendered with a warm accent-colored bullet marker:
    ```markdown
    - Item A
    - Item B
    ```
*   **Ordered Lists**: Use `1.`, `2.`. Standard warm numbering applies.

### D. Table of Contents (TOC)
The blog features an automatic **TOC** generator using `remarkToc` and `remarkCollapse` configured at build time.
*   To include a Table of Contents, simply add an `H2` heading titled precisely **Table of contents** or **Table of Contents**:
    ```markdown
    ## Table of contents
    ```
*   At build time, the system automatically inserts a nested list of headings found in the post and wraps it inside an interactive, collapsible `<details>` accordion block!

### E. Blockquotes
Standard markdown blockquotes are rendered as premium-quality quote containers with a warm vertical accent border (`border-s-accent`), light accent-tinted background (`bg-accent/5`), and elegant italicized typography:
```markdown
> "A Composable function should be fast, idempotent, and free of side effects."
```

### F. Tables
Tables are fully customized with subtle borders, background headers, and alternating hover-row highlights. Inline code inside tables will wrap appropriately:
```markdown
| State Strategy | Recompositions | Memory Overhead |
| :--- | :---: | :--- |
| **Direct State** | High | Minimal |
| **Lambda-based** | Low (Optimized) | Slightly Higher |
```

### G. Collapsible Accordions (Details Toggle)
For advanced technical notes or deep-dive details, use native HTML `<details>` and `<summary>` tags:
```html
<details>
  <summary>Click to view advanced setup details</summary>
  This content stays completely collapsed and hidden until clicked by the user!
</details>
```

### H. Native Theme-Aware Callouts
For highly prominent notices, "Pro Tips", "Notes", "Key Takeaways", or "Warnings", use the custom `.post-callout` HTML structure. It adapts its borders, shadows, and backgrounds perfectly for both light and dark mode:
```html
<div class="post-callout">
  <div class="emoji">💡</div>
  <div class="content">
    <strong>Pro Tip:</strong> Always use a unique <code>key</code> parameter for your LazyList items to prevent unnecessary layout passes. Refer to our [Compose Guide](https://blog.shreyaspatil.dev) for more details!
  </div>
</div>
```

---

## 4. Code Blocks & Highlighting (Shiki Integration)

The blog features an advanced code highlighting system powered by **Shiki** (`astro.config.ts`), supporting theme-specific background rendering (`dracula` for dark mode, `github-light` for light mode).

### A. Basic Fenced Blocks
Always annotate fenced code blocks with the exact language (e.g., `kotlin`, `yaml`, `bash`, `html`, `json`, `javascript`):
```kotlin
fun main() {
    println("Hello World!")
}
```

### B. Displaying Filename Labels
You can render a gorgeous, styled filename badge above your code block by adding the `file="filename.ext"` meta attribute next to the language name:
````markdown
```kotlin file="MainActivity.kt"
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }
}
```
````
This renders a neat tab showing the filename with an optional decorative green dot indicator (customizable via `src/utils/transformers/fileName.js`).

### C. Advanced Shiki Line Notations
You can use special comment tokens inside your code block lines to apply dynamic, rich styling at build time:
*   **Line Additions (Diff Green)**: Append `// [!code ++]` to the end of a line.
*   **Line Deletions (Diff Red)**: Append `// [!code --]` to the end of a line.
*   **Line Focus/Highlight (Yellow Accent)**: Append `// [!code highlight]` or `// [!code focus]` to the end of a line.
*   **Word Highlight**: Append `// [!code word:yourTargetWord]` to the end of a line.

**Example Code Block with Diffs**:
````markdown
```kotlin file="StateComparison.kt"
fun updateState() {
    state.value = "Old Value" // [!code --]
    state.value = "New Optimized Value" // [!code ++]
    recomposeUI() // [!code highlight]
}
```
````

---

## 5. Rich Tech Diagrams (Mermaid.js Flowcharts)

The blog has native, built-in support for **Mermaid.js** diagrams with seamless Light/Dark mode adaptability.
*   Write your diagrams using standard markdown code fences with the `mermaid` language identifier:
    ````markdown
    ```mermaid
    flowchart TD
        A([📝 Compose UI]) -->|State Change| B[Snapshot System]
        B -->|Trigger Recomposition| C{Has State Changed?}
        C -->|Yes| D[Re-invoke Composable]
        C -->|No| E[Skip Invocation]
    ```
    ````
*   **Semantic Color Classes**: When highlighting specific nodes with colors (e.g., blue checks, orange decisions, green successes, red failures), use standard class names (`blue`, `orange`, `green`, `red`, `purple`). The blog provides automatic theme-adapted styles for both light and dark modes:
    ````markdown
    ```mermaid
    flowchart TD
        Start([Start]) --> Check{"Valid?"}
        Check -->|Yes| Success[Success]
        Check -->|No| Error[Error]

        classDef blue fill:#e0f2fe,stroke:#0284c7,color:#0369a1;
        classDef orange fill:#ffedd5,stroke:#ea580c,color:#c2410c;
        classDef green fill:#dcfce7,stroke:#16a34a,color:#15803d;
        classDef red fill:#fee2e2,stroke:#dc2626,color:#b91c1c;

        class Start blue;
        class Check orange;
        class Success green;
        class Error red;
    ```
    ````
*   The system automatically parses these blocks, loads Mermaid asynchronously, renders a beautifully centered vector SVG adapted to the blog's typography and color palette, and excludes it from the "Copy Code" overlay.

---

## 6. Media (Images, Videos & Animated GIFs)

### A. Standard Images
Insert standard images using relative paths. They are styled automatically with the `img-shimmer` loading animation utility, subtle rounded corners, borders, and a light shadow:
```markdown
![Lighthouse Performance Score](../../assets/images/content/lighthouse-score.png)
```
*   **Lightbox Integration**: The blog integrates a client-side pinch-to-zoom image lightbox. Any standard image is clickable and zoomable automatically.

### B. Interactive Video Players
To embed rich high-performance app demos or screen records, use native HTML `<video>` elements. To avoid massive bundle sizes and stay under Cloudflare Pages' 25MB assets constraints, host larger `.webm` or `.mp4` video files on GitHub or an external CDN and reference them:
```html
<video controls width="100%">
  <source src="https://github.com/PatilShreyas/appfunctions-notyagent-app/raw/refs/heads/main/demo.webm" type="video/webm">
  Your browser does not support the video tag.
</video>
```

### C. Animated GIFs (Automatic Video Conversion)
Because GIFs are notorious for lagging mobile browsers and inflating page size (often up to 10-20MB for a few seconds), the blog utilizes a custom `remarkGifToVideo` plugin.

1.  Place your `.gif` under `src/assets/images/content/`.
2.  Reference the GIF using standard markdown image syntax inside your post:
    ```markdown
    ![Demo of compose list state](../../assets/images/content/compose-demo.gif)
    ```
3.  Add the optimized `.webm` counterpart under `public/videos/content/<post-slug>/` using the same image filename base.
4.  Run the maintainer's optimization script:
    ```bash
    npm run optimize-gifs
    ```
5.  At build time, the `remarkGifToVideo` plugin automatically detects the GIF, checks for the presence of the optimized WebM video on disk, and rewrites the AST node to render a responsive, loop-autoplay, hardware-accelerated, silent HTML5 `<video class="gif-video">` element.

### D. Responsive YouTube Embeds
To embed YouTube recordings or speaker talks, wrap an `<iframe>` inside a `<div class="video-container">` container. This enforces a perfect 16:9 responsive aspect ratio across all devices:
```html
<div class="video-container">
  <iframe
    src="https://www.youtube.com/embed/t4xYihWEcaA"
    title="YouTube video player"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen>
  </iframe>
</div>
```

---

## 7. Quality Verification & Formatting Workflow

Before finalizing or committing a new blog post, always run the quality verification scripts:

```bash
# 1. Automatically format your Markdown file using Prettier
npm run format

# 2. Check for syntax and style violations
npm run format:check
npm run lint

# 3. Build the site locally to verify Pagefind index and check for Astro errors
npm run build

# 4. Spin up the local preview server to review layout and search index
npm run preview
```

*(Note: During offline/sandboxed development, running `npm run build` may encounter a Google Fonts connection timeout during Satori OG generation. This is a sandbox network restriction and not a code issue.)*

