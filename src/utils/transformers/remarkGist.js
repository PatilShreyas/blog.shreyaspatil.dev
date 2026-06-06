import { visit } from "unist-util-visit";

/**
 * Remark plugin to transform embedded GitHub Gist scripts into standard Markdown code blocks.
 * Uses GitHub's public CDN to bypass standard API rate limits and token requirements.
 */
export function remarkGist() {
  return async tree => {
    const nodes = [];

    // 1. Find all HTML nodes containing a Gist script
    visit(tree, "html", node => {
      if (node.value && node.value.includes("gist.github.com")) {
        nodes.push(node);
      }
    });

    if (nodes.length === 0) return;

    // 2. Process them asynchronously at build time
    await Promise.all(
      nodes.map(async node => {
        // Extract Username and Gist ID from the script tag
        // Matches: <script src="https://gist.github.com/PatilShreyas/42a4281f433103ef2d2803b270fc6edd.js"></script>
        const match = node.value.match(
          /gist\.github\.com\/([a-zA-Z0-9_-]+)\/([a-f0-9]+)\.js/
        );

        if (match && match[1] && match[2]) {
          const username = match[1];
          const gistId = match[2];

          try {
            // STEP A: Fetch the public embed JSON (No strict API rate limits here)
            const jsonRes = await fetch(
              `https://gist.github.com/${username}/${gistId}.json`
            );

            if (!jsonRes.ok) {
              // eslint-disable-next-line no-console
              console.warn(
                `[remarkGist] Failed to fetch JSON for Gist ${gistId}`
              );
              return;
            }

            const gistData = await jsonRes.json();

            if (gistData.files && gistData.files.length > 0) {
              // Get the first file in the Gist
              const filename = gistData.files[0];

              // Extract the extension to map to Shiki syntax highlighting
              const ext = filename.split(".").pop().toLowerCase();

              // Map common extensions to Shiki language identifiers
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
              const lang = langMap[ext] || ext || "text";

              // STEP B: Fetch the raw code directly from GitHub's CDN (No API rate limits)
              const rawUrl = `https://gist.githubusercontent.com/${username}/${gistId}/raw/${encodeURIComponent(
                filename
              )}`;

              const rawRes = await fetch(rawUrl);
              if (!rawRes.ok) {
                // eslint-disable-next-line no-console
                console.warn(
                  `[remarkGist] Failed to fetch raw code for Gist ${gistId}`
                );
                return;
              }

              const rawContent = await rawRes.text();

              // 3. Mutate the AST HTML node into a standard code block for Astro/Shiki
              node.type = "code";
              node.lang = lang;
              node.value = rawContent.trim();
            }
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(
              `[remarkGist] Exception processing Gist ${gistId}:`,
              error
            );
          }
        }
      })
    );
  };
}
