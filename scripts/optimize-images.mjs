/**
 * Compresses PNG and JPEG source images in-place using Sharp.
 * Run once after adding new images: pnpm run optimize-images
 *
 * GIFs are skipped — convert large ones to WebM manually with ffmpeg:
 *   ffmpeg -i input.gif -c:v libvpx-vp9 -b:v 0 -crf 41 -an output.webm
 */

import sharp from "sharp";
import { readdir, stat, rename, unlink } from "fs/promises";
import { join, extname, relative } from "path";
import { fileURLToPath } from "url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const IMAGES_DIR = join(ROOT, "src/assets/images");

const MAX_WIDTH = 1400; // Never upscale; covers displayed at max 1200px
const JPEG_QUALITY = 82; // mozjpeg sweet-spot (visually lossless at this range)
const PNG_COMPRESSION = 9; // 0–9; higher = smaller, slower encode
const MIN_SIZE = 100 * 1024; // Skip files already under 100 KB

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

async function compress(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (![".png", ".jpg", ".jpeg"].includes(ext)) return null;

  const { size: before } = await stat(filePath);
  if (before < MIN_SIZE) return null;

  const tmp = filePath + ".opt.tmp";

  try {
    const pipeline = sharp(filePath).resize(MAX_WIDTH, null, {
      withoutEnlargement: true,
      fit: "inside",
    });

    if (ext === ".png") {
      await pipeline
        .png({ compressionLevel: PNG_COMPRESSION, effort: 10 })
        .toFile(tmp);
    } else {
      await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(tmp);
    }

    const { size: after } = await stat(tmp);

    if (after < before) {
      await rename(tmp, filePath);
      return { before, after };
    } else {
      await unlink(tmp);
      return null;
    }
  } catch (err) {
    try {
      await unlink(tmp);
    } catch {}
    console.error(`  ✗ ${relative(IMAGES_DIR, filePath)}: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log(`Scanning ${IMAGES_DIR}...\n`);

  let totalBefore = 0;
  let totalAfter = 0;
  let optimized = 0;
  let skipped = 0;

  for await (const file of walk(IMAGES_DIR)) {
    const result = await compress(file);
    if (result) {
      const saved = result.before - result.after;
      const pct = Math.round((saved / result.before) * 100);
      console.log(
        `  ✓ ${relative(IMAGES_DIR, file).padEnd(60)} ` +
          `${kb(result.before)} → ${kb(result.after)}  (-${pct}%)`
      );
      totalBefore += result.before;
      totalAfter += result.after;
      optimized++;
    } else {
      skipped++;
    }
  }

  const totalSaved = totalBefore - totalAfter;
  console.log(`
─────────────────────────────────────────────
  Optimized : ${optimized} file(s)
  Skipped   : ${skipped} file(s)  (< ${MIN_SIZE / 1024}KB or already optimal)
  Saved     : ${mb(totalSaved)} (${kb(totalBefore)} → ${kb(totalAfter)})
─────────────────────────────────────────────`);
}

const kb = n => `${(n / 1024).toFixed(0)} KB`;
const mb = n => `${(n / 1024 / 1024).toFixed(1)} MB`;

main().catch(err => {
  console.error(err);
  process.exit(1);
});
