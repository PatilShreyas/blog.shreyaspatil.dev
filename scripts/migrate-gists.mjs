import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Get the absolute path to your blog data directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.resolve(__dirname, "../src/data/blog");

// Regex to extract username and gist ID from script tags
const gistRegex = /<script\s+src="https:\/\/gist\.github\.com\/([a-zA-Z0-9_-]+)\/([a-f0-9]+)\.js"><\/script>/g;

// Map file extensions to Shiki language identifiers
const langMap = {
  kt: "kotlin",
  java: "java",
  js: "javascript",
  ts: "typescript",
  py: "python",
  yml: "yaml",
  md: "markdown",
  json: "json",
  xml: "xml",
  html: "html",
  css: "css",
  sh: "bash",
};

async function processFile(filePath) {
  let content = await fs.readFile(filePath, "utf-8");

  // Find all gist script tags in the file
  const matches = [...content.matchAll(gistRegex)];
  if (matches.length === 0) return false;

  console.log(`\n📄 Processing: ${path.basename(filePath)} (${matches.length} gists found)`);

  for (const match of matches) {
    const fullTag = match[0];
    const username = match[1];
    const gistId = match[2];

    try {
      // 1. Fetch metadata to get the filename
      const jsonRes = await fetch(`https://gist.github.com/${username}/${gistId}.json`);
      if (!jsonRes.ok) throw new Error(`Failed to fetch metadata (Status: ${jsonRes.status})`);

      const gistData = await jsonRes.json();

      if (gistData.files && gistData.files.length > 0) {
        const filename = gistData.files[0];
        const ext = filename.split(".").pop().toLowerCase();
        const lang = langMap[ext] || ext || "text";

        // 2. Fetch the raw code snippet
        const rawUrl = `https://gist.githubusercontent.com/${username}/${gistId}/raw/${encodeURIComponent(filename)}`;
        const rawRes = await fetch(rawUrl);
        if (!rawRes.ok) throw new Error(`Failed to fetch raw code (Status: ${rawRes.status})`);

        const rawContent = await rawRes.text();

        // 3. Construct the markdown code block.
        // Note: Adding :${filename} leverages your transformerFileName plugin!
        const codeBlock = `\n\`\`\`${lang}\n${rawContent.trim()}\n\`\`\`\n`;

        // 4. Replace the HTML tag with the code block
        content = content.replace(fullTag, codeBlock);
        console.log(`   ✅ Replaced Gist: ${gistId} (${filename})`);
      }
    } catch (error) {
      console.error(`   ❌ Error on Gist ${gistId}:`, error.message);
    }
  }

  // Save the modified content back to the markdown file
  await fs.writeFile(filePath, content, "utf-8");
  return true;
}

async function main() {
  console.log("🚀 Starting Gist Migration...\n");

  try {
    const files = await fs.readdir(BLOG_DIR);
    let updatedCount = 0;

    for (const file of files) {
      if (file.endsWith(".md") || file.endsWith(".mdx")) {
        const filePath = path.join(BLOG_DIR, file);
        const wasUpdated = await processFile(filePath);
        if (wasUpdated) updatedCount++;
      }
    }

    console.log(`\n🎉 Migration complete! Successfully updated ${updatedCount} files.`);
  } catch (error) {
    console.error("Failed to read blog directory:", error);
  }
}

main();