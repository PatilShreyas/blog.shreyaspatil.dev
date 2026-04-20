/**
 * Converts animated GIFs to WebM (VP9) using the bundled ffmpeg-static binary.
 *
 * - Writes `foo.webm` alongside each `foo.gif`
 * - Keeps the original GIF so it can serve as a <video> fallback in posts
 * - Skips GIFs that already have an up-to-date WebM sibling
 * - Skips GIFs smaller than MIN_SIZE (not worth the conversion overhead)
 *
 * After running this, use the remark plugin in astro.config.ts to automatically
 * rewrite markdown `![alt](foo.gif)` references to `<video>` tags at build time.
 */

import { spawn } from "child_process";
import { readdir, stat, access, mkdir } from "fs/promises";
import { join, extname, relative, dirname, basename } from "path";
import { fileURLToPath } from "url";
import ffmpegPath from "ffmpeg-static";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const IMAGES_DIR = join(ROOT, "src/assets/images");
// WebMs live under public/ so they're served at absolute URLs like /videos/...
// The remark plugin rewrites markdown image refs to point here.
const VIDEOS_OUT_DIR = join(ROOT, "public/videos");

// GIFs below this size aren't worth the conversion overhead
const MIN_SIZE = 200 * 1024;

// VP9 CRF: 0 (lossless) to 63 (worst). 41 is a strong balance for animated
// content — visually indistinguishable from the source for UI demos.
const CRF = 41;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    proc.stderr.on("data", chunk => {
      stderr += chunk.toString();
    });
    proc.on("close", code => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}\n${stderr}`));
    });
    proc.on("error", reject);
  });
}

async function convertGif(gifPath) {
  if (extname(gifPath).toLowerCase() !== ".gif") return null;

  const { size: before, mtimeMs: gifMtime } = await stat(gifPath);
  if (before < MIN_SIZE) return null;

  // Mirror the src/assets/images/ directory structure under public/videos/
  // so the remark plugin can derive the output URL deterministically.
  const relFromImages = relative(IMAGES_DIR, gifPath);
  const webmPath = join(
    VIDEOS_OUT_DIR,
    dirname(relFromImages),
    basename(gifPath, extname(gifPath)) + ".webm"
  );

  // Skip if an up-to-date WebM already exists
  if (await fileExists(webmPath)) {
    const { mtimeMs: webmMtime } = await stat(webmPath);
    if (webmMtime >= gifMtime) return { skipped: true };
  }

  await mkdir(dirname(webmPath), { recursive: true });

  // VP9: best compression, modern browser support.
  // -pix_fmt yuv420p ensures compatibility (some decoders reject yuv420a).
  // -deadline good + -cpu-used 2 picks a reasonable speed/quality tradeoff.
  const args = [
    "-y",
    "-i",
    gifPath,
    "-c:v",
    "libvpx-vp9",
    "-b:v",
    "0",
    "-crf",
    String(CRF),
    "-pix_fmt",
    "yuv420p",
    "-deadline",
    "good",
    "-cpu-used",
    "2",
    "-an",
    webmPath,
  ];

  await runFfmpeg(args);

  const { size: after } = await stat(webmPath);
  return { before, after, webmPath };
}

async function main() {
  if (!ffmpegPath) {
    console.error("ffmpeg-static did not resolve a binary path for this platform.");
    process.exit(1);
  }

  console.log(`Scanning ${IMAGES_DIR} for GIFs > ${MIN_SIZE / 1024}KB...\n`);

  let totalBefore = 0;
  let totalAfter = 0;
  let converted = 0;
  let upToDate = 0;
  let tooSmall = 0;

  for await (const file of walk(IMAGES_DIR)) {
    if (extname(file).toLowerCase() !== ".gif") continue;

    const result = await convertGif(file);
    if (!result) {
      tooSmall++;
      continue;
    }
    if (result.skipped) {
      upToDate++;
      continue;
    }

    const saved = result.before - result.after;
    const pct = Math.round((saved / result.before) * 100);
    console.log(
      `  ✓ ${relative(IMAGES_DIR, file).padEnd(80)} ` +
        `${kb(result.before)} → ${kb(result.after)}  (-${pct}%)`
    );
    totalBefore += result.before;
    totalAfter += result.after;
    converted++;
  }

  const totalSaved = totalBefore - totalAfter;
  console.log(`
─────────────────────────────────────────────
  Converted : ${converted} GIF(s) → WebM
  Up-to-date: ${upToDate} GIF(s)  (WebM already exists)
  Too small : ${tooSmall} GIF(s)  (< ${MIN_SIZE / 1024}KB)
  Saved     : ${mb(totalSaved)} (${kb(totalBefore)} → ${kb(totalAfter)})
─────────────────────────────────────────────
`);
}

const kb = n => `${(n / 1024).toFixed(0)} KB`;
const mb = n => `${(n / 1024 / 1024).toFixed(1)} MB`;

main().catch(err => {
  console.error(err);
  process.exit(1);
});
