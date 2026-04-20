/**
 * Remark plugin: rewrite markdown image references to animated GIFs as <video>
 * elements when a pre-generated WebM sibling exists under public/videos/.
 *
 * Source:  ![alt](../../assets/images/content/foo/bar.gif)
 * Output:  <video autoplay loop muted playsinline src="/videos/content/foo/bar.webm" aria-label="alt">
 *
 * The GIF stays on disk untouched; this plugin only rewrites the rendered
 * HTML. If no WebM exists for a given GIF, the image passes through unchanged
 * so the GIF still renders as-is.
 *
 * Run `pnpm run optimize-gifs` to generate WebMs from GIFs.
 */

import { existsSync } from "fs";
import { dirname, resolve, relative, extname, sep } from "path";
import { fileURLToPath } from "url";

const PLUGIN_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const IMAGES_DIR = resolve(PLUGIN_ROOT, "src/assets/images");
const PUBLIC_DIR = resolve(PLUGIN_ROOT, "public");
const VIDEOS_DIR = resolve(PUBLIC_DIR, "videos");

function escapeAttr(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function visitImageNodes(parent, callback) {
  if (!parent || !Array.isArray(parent.children)) return;
  for (let i = 0; i < parent.children.length; i++) {
    const node = parent.children[i];
    if (node.type === "image") {
      callback(node, i, parent);
    } else {
      visitImageNodes(node, callback);
    }
  }
}

export function remarkGifToVideo() {
  return (tree, file) => {
    if (!file?.path) return;
    const fileDir = dirname(file.path);

    visitImageNodes(tree, (node, index, parent) => {
      if (!node.url) return;
      if (extname(node.url).toLowerCase() !== ".gif") return;

      // Resolve the image URL relative to the markdown file on disk
      const absGifPath = resolve(fileDir, node.url);

      // Only act on GIFs inside src/assets/images/ — leave remote/other refs alone
      if (!absGifPath.startsWith(IMAGES_DIR + sep)) return;

      // Derive the expected WebM path under public/videos/
      const relFromImages = relative(IMAGES_DIR, absGifPath);
      const webmPath = resolve(VIDEOS_DIR, relFromImages).replace(
        /\.gif$/i,
        ".webm"
      );

      if (!existsSync(webmPath)) return;

      // Build an absolute URL path served from /public
      const webmUrl = "/" + relative(PUBLIC_DIR, webmPath).split(sep).join("/");

      const alt = escapeAttr(node.alt);
      parent.children[index] = {
        type: "html",
        value:
          `<video autoplay loop muted playsinline controls ` +
          `preload="metadata" class="gif-video" src="${webmUrl}" ` +
          `aria-label="${alt}"></video>`,
      };
    });
  };
}
