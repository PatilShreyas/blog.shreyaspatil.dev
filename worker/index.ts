import { htmlToMarkdown, estimateTokens } from "./markdown.ts";

export interface Env {
  ASSETS: {
    fetch: (request: Request | string) => Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const acceptHeader = request.headers.get("accept") || "";
    const isMarkdownRequested = acceptHeader.includes("text/markdown");
    const isExplicitMarkdown = url.pathname.endsWith(".md");

    // Case 1: Standard browser/crawler request (not requesting markdown)
    if (!isMarkdownRequested && !isExplicitMarkdown) {
      const response = await env.ASSETS.fetch(request);
      const contentType = response.headers.get("content-type") || "";

      // Ensure HTML responses announce that their content varies based on Accept header
      if (contentType.includes("text/html")) {
        const headers = new Headers(response.headers);
        headers.set("Vary", "Accept");
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      }

      return response;
    }

    // Case 2: Markdown requested via Content Negotiation or .md extension
    let targetRequest = request;
    if (isExplicitMarkdown) {
      // e.g. /my-post.md -> /my-post/ or /my-post/index.md -> /my-post/ or /index.md -> /
      const targetUrl = new URL(request.url);
      if (targetUrl.pathname === "/index.md") {
        targetUrl.pathname = "/";
      } else if (targetUrl.pathname.endsWith("/index.md")) {
        targetUrl.pathname = targetUrl.pathname.replace(/index\.md$/, "");
      } else {
        targetUrl.pathname = targetUrl.pathname.replace(/\.md$/, "/");
      }
      targetRequest = new Request(targetUrl.toString(), request);
    }

    const isHead = request.method === "HEAD";
    const assetRequest = isHead
      ? new Request(targetRequest, { method: "GET" })
      : targetRequest;

    const response = await env.ASSETS.fetch(assetRequest);
    const contentType = response.headers.get("content-type") || "";

    // If the asset is HTML, convert it to clean Markdown
    if (contentType.includes("text/html")) {
      const html = await response.text();
      const markdown = htmlToMarkdown(html, request.url);
      const markdownTokens = estimateTokens(markdown);
      const originalTokens = estimateTokens(html);

      const headers = new Headers(response.headers);
      headers.set("Content-Type", "text/markdown; charset=utf-8");
      headers.set("Vary", "Accept");
      headers.set("x-markdown-tokens", markdownTokens.toString());
      headers.set("x-original-tokens", originalTokens.toString());

      return new Response(isHead ? null : markdown, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    // If asset was already non-HTML (e.g. image, text file, or static .md)
    return response;
  },
};
