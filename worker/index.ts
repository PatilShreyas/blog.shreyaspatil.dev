import { htmlToMarkdown, estimateTokens } from "./markdown.ts";
import { getApiCatalog } from "./catalog.ts";

export interface Env {
  ASSETS: {
    fetch: (request: Request | string) => Promise<Response>;
  };
}

export const DISCOVERY_LINK_HEADERS = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json"',
  '</about>; rel="service-doc"; type="text/html"',
  '</openapi.json>; rel="describedby"; type="application/vnd.oai.openapi+json"',
].join(", ");

export function applyDiscoveryLinkHeaders(headers: Headers): void {
  const existing = headers.get("Link");
  if (!existing) {
    headers.set("Link", DISCOVERY_LINK_HEADERS);
    return;
  }

  const links = [
    '</.well-known/api-catalog>; rel="api-catalog"',
    '</openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json"',
    '</about>; rel="service-doc"; type="text/html"',
    '</openapi.json>; rel="describedby"; type="application/vnd.oai.openapi+json"',
  ];

  const toAdd: string[] = [];
  for (const link of links) {
    const relMatch = link.match(/rel="([^"]+)"/);
    if (relMatch && !existing.includes(`rel="${relMatch[1]}"`)) {
      toAdd.push(link);
    }
  }

  if (toAdd.length > 0) {
    headers.set("Link", `${existing}, ${toAdd.join(", ")}`);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // RFC 9727 API Catalog
    if (url.pathname === "/.well-known/api-catalog") {
      const isHead = request.method === "HEAD";
      const catalog = getApiCatalog(url.origin);
      const headers = new Headers();
      headers.set("Content-Type", "application/linkset+json");
      headers.set("Link", '</.well-known/api-catalog>; rel="api-catalog"');
      headers.set("Access-Control-Allow-Origin", "*");
      headers.set(
        "Cache-Control",
        "public, max-age=3600, stale-while-revalidate=86400"
      );

      return new Response(isHead ? null : JSON.stringify(catalog, null, 2), {
        status: 200,
        headers,
      });
    }

    // Health check endpoint
    if (url.pathname === "/api/health") {
      const isHead = request.method === "HEAD";
      const headers = new Headers();
      headers.set("Content-Type", "application/json; charset=utf-8");
      headers.set("Access-Control-Allow-Origin", "*");
      headers.set("Cache-Control", "public, max-age=60");

      return new Response(isHead ? null : JSON.stringify({ status: "ok" }), {
        status: 200,
        headers,
      });
    }

    // API index discovery
    if (url.pathname === "/api" || url.pathname === "/api/") {
      const isHead = request.method === "HEAD";
      const base = url.origin;
      const headers = new Headers();
      headers.set("Content-Type", "application/json; charset=utf-8");
      headers.set("Access-Control-Allow-Origin", "*");
      headers.set(
        "Cache-Control",
        "public, max-age=3600, stale-while-revalidate=86400"
      );

      const body = {
        name: "Shreyas Patil's Blog API",
        catalog: `${base}/.well-known/api-catalog`,
        openapi: `${base}/openapi.json`,
        posts: `${base}/posts`,
        feed: `${base}/rss.xml`,
        health: `${base}/api/health`,
      };

      return new Response(isHead ? null : JSON.stringify(body, null, 2), {
        status: 200,
        headers,
      });
    }

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
        applyDiscoveryLinkHeaders(headers);
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
      applyDiscoveryLinkHeaders(headers);
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
