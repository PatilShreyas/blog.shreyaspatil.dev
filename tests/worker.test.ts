import test from "node:test";
import assert from "node:assert/strict";
import { htmlToMarkdown, estimateTokens } from "../worker/markdown.ts";
import worker, { type Env } from "../worker/index.ts";

test("estimateTokens returns reasonable approximation", () => {
  assert.strictEqual(estimateTokens(""), 0);
  assert.strictEqual(estimateTokens("abcd"), 1);
  assert.strictEqual(estimateTokens("a".repeat(100)), 25);
});

test("htmlToMarkdown extracts YAML frontmatter from meta tags", () => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Test Page Title</title>
        <meta property="og:title" content="OG Test Title" />
        <meta name="description" content="This is a test description." />
        <meta property="og:image" content="https://example.com/image.png" />
      </head>
      <body>
        <main id="main-content">
          <h1>Main Heading</h1>
          <p>Hello world!</p>
        </main>
      </body>
    </html>
  `;

  const md = htmlToMarkdown(html, "https://example.com/test");

  assert.ok(md.startsWith("---\n"), "Should start with frontmatter delimiter");
  assert.ok(md.includes('title: "OG Test Title"'), "Should contain title in frontmatter");
  assert.ok(
    md.includes('description: "This is a test description."'),
    "Should contain description in frontmatter"
  );
  assert.ok(
    md.includes('image: "https://example.com/image.png"'),
    "Should contain image in frontmatter"
  );
  assert.ok(md.includes("# Main Heading"), "Should convert h1 to #");
  assert.ok(md.includes("Hello world!"), "Should include paragraph text");
});

test("htmlToMarkdown extracts JSON-LD into fenced json code block at end", () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "JSON-LD Post",
  };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
      </head>
      <body>
        <main id="main-content">
          <p>Content goes here.</p>
        </main>
      </body>
    </html>
  `;

  const md = htmlToMarkdown(html, "https://example.com/post");

  assert.ok(md.includes("```json"), "Should include fenced json block");
  assert.ok(md.includes('"headline": "JSON-LD Post"'), "Should contain JSON-LD content");
});

test("htmlToMarkdown strips navigation, footer, scripts, styles, and comments", () => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>.hidden { display: none; }</style>
        <script>console.log("ignore me");</script>
      </head>
      <body>
        <header>
          <nav><a href="/">Home</a><a href="/about">About</a></nav>
        </header>
        <main id="main-content">
          <article id="article">
            <h2>Article Title</h2>
            <p>Real article content.</p>
          </article>
          <div id="comments">
            <p>User comment should be stripped.</p>
          </div>
        </main>
        <footer>
          <p>Copyright 2026</p>
        </footer>
      </body>
    </html>
  `;

  const md = htmlToMarkdown(html, "https://example.com");

  assert.ok(!md.includes("ignore me"), "Scripts should be stripped");
  assert.ok(!md.includes(".hidden"), "Styles should be stripped");
  assert.ok(!md.includes("About"), "Navigation should be stripped");
  assert.ok(!md.includes("Copyright 2026"), "Footer should be stripped");
  assert.ok(!md.includes("User comment"), "Comments container should be stripped");
  assert.ok(md.includes("## Article Title"), "Article heading preserved");
  assert.ok(md.includes("Real article content."), "Article content preserved");
});

test("htmlToMarkdown converts code blocks, inline code, links, images, and lists", () => {
  const html = `
    <!DOCTYPE html>
    <html>
      <body>
        <main id="main-content">
          <p>Here is <code>inline code</code> and a <a href="/posts/intro">relative link</a>.</p>
          <p><img src="/images/diagram.png" alt="Architecture Diagram" /></p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
          <pre><code class="language-kotlin">fun main() {
    println("Hello!")
}</code></pre>
          <blockquote>Wise quote</blockquote>
        </main>
      </body>
    </html>
  `;

  const md = htmlToMarkdown(html, "https://example.com/page/");

  assert.ok(md.includes("`inline code`"), "Inline code converted");
  assert.ok(
    md.includes("[relative link](https://example.com/posts/intro)"),
    "Relative link resolved to absolute"
  );
  assert.ok(
    md.includes("![Architecture Diagram](https://example.com/images/diagram.png)"),
    "Relative image resolved to absolute"
  );
  assert.ok(md.includes("- Item 1"), "Unordered list converted");
  assert.ok(md.includes("- Item 2"), "Unordered list converted");
  assert.ok(
    md.includes('```kotlin\nfun main() {\n    println("Hello!")\n}\n```'),
    "Fenced code block with language preserved"
  );
  assert.ok(md.includes("> Wise quote"), "Blockquote converted");
});

test("worker.fetch serves HTML with Vary header for normal browser requests", async () => {
  const mockHtml = "<!DOCTYPE html><html><body><h1>Hello</h1></body></html>";
  const env: Env = {
    ASSETS: {
      fetch: async () => {
        return new Response(mockHtml, {
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      },
    },
  };

  const req = new Request("https://blog.shreyaspatil.dev/", {
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });

  const res = await worker.fetch(req, env);

  assert.strictEqual(res.status, 200);
  assert.ok(res.headers.get("content-type")?.includes("text/html"));
  assert.strictEqual(res.headers.get("vary"), "Accept");
  const body = await res.text();
  assert.strictEqual(body, mockHtml);
});

test("worker.fetch negotiates markdown when Accept: text/markdown is present", async () => {
  const mockHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Blog Post Title</title>
        <meta property="og:title" content="Blog Post Title" />
        <meta name="description" content="A great post." />
      </head>
      <body>
        <main id="main-content">
          <h1>Blog Post Title</h1>
          <p>This is the content of the post.</p>
        </main>
      </body>
    </html>
  `;

  const env: Env = {
    ASSETS: {
      fetch: async () => {
        return new Response(mockHtml, {
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      },
    },
  };

  const req = new Request("https://blog.shreyaspatil.dev/my-post", {
    headers: {
      Accept: "text/markdown",
    },
  });

  const res = await worker.fetch(req, env);

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.headers.get("content-type"), "text/markdown; charset=utf-8");
  assert.strictEqual(res.headers.get("vary"), "Accept");
  assert.ok(res.headers.has("x-markdown-tokens"), "Has x-markdown-tokens header");
  assert.ok(res.headers.has("x-original-tokens"), "Has x-original-tokens header");

  const body = await res.text();
  assert.ok(body.includes('title: "Blog Post Title"'));
  assert.ok(body.includes("# Blog Post Title"));
  assert.ok(body.includes("This is the content of the post."));
});

test("worker.fetch passes through static non-HTML assets directly", async () => {
  const mockImage = new Uint8Array([1, 2, 3, 4]);
  const env: Env = {
    ASSETS: {
      fetch: async () => {
        return new Response(mockImage, {
          status: 200,
          headers: { "Content-Type": "image/png" },
        });
      },
    },
  };

  const req = new Request("https://blog.shreyaspatil.dev/og.png", {
    headers: {
      Accept: "*/*",
    },
  });

  const res = await worker.fetch(req, env);

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.headers.get("content-type"), "image/png");
});

test("htmlToMarkdown converts tables to markdown tables", () => {
  const html = `
    <!DOCTYPE html>
    <html>
      <body>
        <main>
          <table>
            <thead>
              <tr><th>Header 1</th><th>Header 2</th></tr>
            </thead>
            <tbody>
              <tr><td>Row 1 Cell 1</td><td>Row 1 Cell 2</td></tr>
              <tr><td>Row 2 Cell 1</td><td>Row 2 Cell 2</td></tr>
            </tbody>
          </table>
        </main>
      </body>
    </html>
  `;

  const md = htmlToMarkdown(html);
  assert.ok(md.includes("| Header 1 | Header 2 |"));
  assert.ok(md.includes("| --- | --- |"));
  assert.ok(md.includes("| Row 1 Cell 1 | Row 1 Cell 2 |"));
});

test("worker.fetch handles explicit .md URL requests", async () => {
  let requestedPath = "";
  const mockHtml = `
    <!DOCTYPE html>
    <html>
      <head><title>Explicit Post</title></head>
      <body><main><p>Explicit markdown body.</p></main></body>
    </html>
  `;
  const env: Env = {
    ASSETS: {
      fetch: async (req: Request | string) => {
        const urlStr = typeof req === "string" ? req : req.url;
        requestedPath = new URL(urlStr).pathname;
        return new Response(mockHtml, {
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      },
    },
  };

  const req = new Request("https://blog.shreyaspatil.dev/my-post.md");
  const res = await worker.fetch(req, env);

  assert.strictEqual(requestedPath, "/my-post/");
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.headers.get("content-type"), "text/markdown; charset=utf-8");
  const body = await res.text();
  assert.ok(body.includes("Explicit markdown body."));
});

test("worker.fetch handles 404 responses gracefully", async () => {
  const env: Env = {
    ASSETS: {
      fetch: async () => {
        return new Response("Not Found", {
          status: 404,
          headers: { "Content-Type": "text/plain" },
        });
      },
    },
  };

  const req = new Request("https://blog.shreyaspatil.dev/nonexistent", {
    headers: { Accept: "text/markdown" },
  });
  const res = await worker.fetch(req, env);

  assert.strictEqual(res.status, 404);
});

test("end-to-end: converts actual built dist/index.html to Markdown for Agents format", async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const indexPath = path.resolve("dist/index.html");
  if (!fs.existsSync(indexPath)) return;

  const html = fs.readFileSync(indexPath, "utf-8");
  const env: Env = {
    ASSETS: {
      fetch: async () =>
        new Response(html, {
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }),
    },
  };

  const req = new Request("https://blog.shreyaspatil.dev/", {
    headers: { Accept: "text/markdown" },
  });
  const res = await worker.fetch(req, env);

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.headers.get("content-type"), "text/markdown; charset=utf-8");
  assert.strictEqual(res.headers.get("vary"), "Accept");
  assert.ok(parseInt(res.headers.get("x-markdown-tokens") || "0", 10) > 0);

  const md = await res.text();
  assert.ok(md.startsWith("---\n"));
  assert.ok(md.includes("title:"));
  assert.ok(md.includes("```json"));
});

test("end-to-end: converts actual built post HTML to Markdown for Agents format", async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const postPath = path.resolve(
    "dist/51-my-developer-blogging-journey-so-far/index.html"
  );
  if (!fs.existsSync(postPath)) return;

  const html = fs.readFileSync(postPath, "utf-8");
  const env: Env = {
    ASSETS: {
      fetch: async () =>
        new Response(html, {
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }),
    },
  };

  const req = new Request(
    "https://blog.shreyaspatil.dev/51-my-developer-blogging-journey-so-far/",
    {
      headers: { Accept: "text/markdown" },
    }
  );
  const res = await worker.fetch(req, env);

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.headers.get("content-type"), "text/markdown; charset=utf-8");
  const md = await res.text();
  assert.ok(md.startsWith("---\n"));
  assert.ok(md.includes("#51 - My developer blogging journey so far"));
  assert.ok(md.includes("```json"));
});

test("worker.fetch handles HEAD requests with markdown negotiation", async () => {
  const mockHtml = `
    <!DOCTYPE html>
    <html>
      <head><title>Head Test</title></head>
      <body><main><p>Some content for head test.</p></main></body>
    </html>
  `;
  const env: Env = {
    ASSETS: {
      fetch: async (req: Request | string) => {
        const method = typeof req === "string" ? "GET" : req.method;
        return new Response(method === "HEAD" ? null : mockHtml, {
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      },
    },
  };

  const req = new Request("https://blog.shreyaspatil.dev/test-head", {
    method: "HEAD",
    headers: { Accept: "text/markdown" },
  });
  const res = await worker.fetch(req, env);

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.headers.get("content-type"), "text/markdown; charset=utf-8");
  assert.strictEqual(res.headers.get("vary"), "Accept");
  assert.ok(parseInt(res.headers.get("x-markdown-tokens") || "0", 10) > 0);
  assert.ok(parseInt(res.headers.get("x-original-tokens") || "0", 10) > 0);
  const text = await res.text();
  assert.strictEqual(text, "");
});


