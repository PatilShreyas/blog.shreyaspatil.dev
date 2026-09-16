/**
 * Cloudflare Markdown for Agents converter & token estimator.
 * Converts HTML documents into clean, structured Markdown adhering to Cloudflare's
 * Markdown for Agents specification:
 * 1. YAML frontmatter from meta tags (title, description, image)
 * 2. Body Markdown converted from document body (scripts, styles, nav, footers stripped)
 * 3. JSON-LD structured data in fenced json code block at end
 */

export function estimateTokens(text: string): number {
  if (!text) return 0;
  // Standard heuristic for English text/code: ~4 characters per token
  return Math.ceil(text.length / 4);
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)));
}

function resolveUrl(urlStr: string, baseUrl?: string): string {
  if (!urlStr) return "";
  if (!baseUrl) return urlStr;
  try {
    return new URL(urlStr, baseUrl).href;
  } catch {
    return urlStr;
  }
}

interface PageMeta {
  title?: string;
  description?: string;
  image?: string;
}

function getMetaContent(html: string, nameOrProp: string): string | undefined {
  const re1 = new RegExp(
    `<meta\\s+[^>]*(?:property|name)=["']${nameOrProp}["'][^>]*content=(["'])([\\s\\S]*?)\\1`,
    "i"
  );
  const match1 = html.match(re1);
  if (match1) return match1[2];

  const re2 = new RegExp(
    `<meta\\s+[^>]*content=(["'])([\\s\\S]*?)\\1[^>]*(?:property|name)=["']${nameOrProp}["']`,
    "i"
  );
  const match2 = html.match(re2);
  if (match2) return match2[2];

  return undefined;
}

function extractMeta(html: string, baseUrl?: string): PageMeta {
  const meta: PageMeta = {};

  // Title: og:title > title tag
  const ogTitle = getMetaContent(html, "og:title") || getMetaContent(html, "title");
  if (ogTitle) {
    meta.title = decodeHtmlEntities(ogTitle.trim());
  } else {
    const titleTagMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (titleTagMatch) {
      meta.title = decodeHtmlEntities(titleTagMatch[1].trim());
    }
  }

  // Description: og:description > description
  const desc = getMetaContent(html, "og:description") || getMetaContent(html, "description");
  if (desc) {
    meta.description = decodeHtmlEntities(desc.trim());
  }

  // Image: og:image
  const img = getMetaContent(html, "og:image");
  if (img) {
    meta.image = resolveUrl(decodeHtmlEntities(img.trim()), baseUrl);
  }

  return meta;
}

function extractJsonLd(html: string): string[] {
  const scripts: string[] = [];
  const regex = /<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    const content = match[1].trim();
    if (content) {
      try {
        // Pretty-print if valid JSON
        const parsed = JSON.parse(content);
        scripts.push(JSON.stringify(parsed, null, 2));
      } catch {
        scripts.push(content);
      }
    }
  }

  return scripts;
}

export function htmlToMarkdown(html: string, baseUrl?: string): string {
  const meta = extractMeta(html, baseUrl);
  const jsonLdBlocks = extractJsonLd(html);

  // Extract primary content container if present
  let bodyContent = html;
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

  if (articleMatch) {
    // If article is found, check if there's a preceding h1 in main that we should include
    if (mainMatch) {
      const h1Match = mainMatch[1].match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      if (h1Match && !articleMatch[1].includes(h1Match[0])) {
        bodyContent = `${h1Match[0]}\n${articleMatch[1]}`;
      } else {
        bodyContent = articleMatch[1];
      }
    } else {
      bodyContent = articleMatch[1];
    }
  } else if (mainMatch) {
    bodyContent = mainMatch[1];
  } else if (bodyMatch) {
    bodyContent = bodyMatch[1];
  }

  // Strip non-content containers and elements
  bodyContent = bodyContent
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, "")
    .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, "")
    .replace(/<div\s+[^>]*id=["']comments["'][^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<div\s+[^>]*class=["'][^"']*copy-code[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<button[^>]*>[\s\S]*?<\/button>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  // Preserve pre/code blocks by replacing with tokens
  const codeBlocks: string[] = [];
  bodyContent = bodyContent.replace(
    /<pre[^>]*><code([^>]*)>([\s\S]*?)<\/code><\/pre>/gi,
    (_, attrs, codeContent) => {
      const langMatch =
        attrs.match(/class=["'][^"']*language-([a-zA-Z0-9_-]+)[^"']*["']/i) ||
        attrs.match(/data-language=["']([a-zA-Z0-9_-]+)["']/i);
      const lang = langMatch ? langMatch[1] : "";
      // Strip any inner html tags (like Shiki syntax spans) inside code block
      const cleanCode = decodeHtmlEntities(codeContent.replace(/<[^>]+>/g, ""));
      const placeholder = `___CODE_BLOCK_${codeBlocks.length}___`;
      codeBlocks.push(`\`\`\`${lang}\n${cleanCode}\n\`\`\``);
      return placeholder;
    }
  );

  // Preserve inline code
  const inlineCodes: string[] = [];
  bodyContent = bodyContent.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, code) => {
    const clean = decodeHtmlEntities(code.replace(/<[^>]+>/g, ""));
    const placeholder = `___INLINE_CODE_${inlineCodes.length}___`;
    inlineCodes.push(`\`${clean}\``);
    return placeholder;
  });

  // Convert Headings
  bodyContent = bodyContent.replace(
    /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi,
    (_, level, content) => {
      const hashes = "#".repeat(parseInt(level, 10));
      const cleanText = decodeHtmlEntities(content.replace(/<[^>]+>/g, "")).trim();
      return `\n\n${hashes} ${cleanText}\n\n`;
    }
  );

  // Convert Blockquotes
  bodyContent = bodyContent.replace(
    /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi,
    (_, content) => {
      const cleanText = decodeHtmlEntities(content.replace(/<[^>]+>/g, "")).trim();
      const quoted = cleanText
        .split("\n")
        .map(line => `> ${line.trim()}`)
        .join("\n");
      return `\n\n${quoted}\n\n`;
    }
  );

  // Convert Images before links (in case img is inside a)
  bodyContent = bodyContent.replace(
    /<img\s+[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi,
    (_, src, alt) => {
      const resolved = resolveUrl(decodeHtmlEntities(src), baseUrl);
      return `![${decodeHtmlEntities(alt)}](${resolved})`;
    }
  );
  bodyContent = bodyContent.replace(/<img\s+[^>]*src=["']([^"']*)["'][^>]*>/gi, (_, src) => {
    const resolved = resolveUrl(decodeHtmlEntities(src), baseUrl);
    return `![](${resolved})`;
  });

  // Convert Links
  bodyContent = bodyContent.replace(
    /<a\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (_, href, text) => {
      const cleanText = decodeHtmlEntities(text.replace(/<[^>]+>/g, "")).trim();
      if (!cleanText) return "";
      const resolved = resolveUrl(decodeHtmlEntities(href), baseUrl);
      return `[${cleanText}](${resolved})`;
    }
  );

  // Convert Lists
  bodyContent = bodyContent.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, item) => {
    const cleanItem = decodeHtmlEntities(item.replace(/<[^>]+>/g, "")).trim();
    return `\n- ${cleanItem}`;
  });
  bodyContent = bodyContent.replace(/<\/?(ul|ol)[^>]*>/gi, "\n\n");

  // Convert Tables
  bodyContent = bodyContent.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (_, tableInner) => {
    const rows: string[][] = [];
    const trMatches = Array.from(tableInner.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) as RegExpExecArray[];

    for (const trMatch of trMatches) {
      const rowHtml = trMatch[1];
      const cells: string[] = [];
      const thMatches = Array.from(rowHtml.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)) as RegExpExecArray[];
      if (thMatches.length > 0) {
        for (const th of thMatches) {
          cells.push(decodeHtmlEntities(th[1].replace(/<[^>]+>/g, "")).trim());
        }
      } else {
        const tdMatches = Array.from(rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)) as RegExpExecArray[];
        for (const td of tdMatches) {
          cells.push(decodeHtmlEntities(td[1].replace(/<[^>]+>/g, "")).trim());
        }
      }
      if (cells.length > 0) {
        rows.push(cells);
      }
    }

    if (rows.length === 0) return "";
    const colCount = Math.max(...rows.map(r => r.length));
    const lines: string[] = [];

    const formatRow = (cells: string[]) => {
      const padded = [...cells];
      while (padded.length < colCount) padded.push("");
      return `| ${padded.join(" | ")} |`;
    };

    lines.push(formatRow(rows[0]));
    lines.push(`| ${Array(colCount).fill("---").join(" | ")} |`);
    for (let i = 1; i < rows.length; i++) {
      lines.push(formatRow(rows[i]));
    }

    return `\n\n${lines.join("\n")}\n\n`;
  });

  // Convert Paragraphs and line breaks
  bodyContent = bodyContent.replace(/<br\s*\/?>/gi, "\n");
  bodyContent = bodyContent.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, p) => {
    return `\n\n${p}\n\n`;
  });
  bodyContent = bodyContent.replace(/<hr\s*\/?>/gi, "\n\n---\n\n");

  // Convert Text styles
  bodyContent = bodyContent
    .replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, "**$2**")
    .replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, "*$2*")
    .replace(/<(del|s)[^>]*>([\s\S]*?)<\/\1>/gi, "~~$2~~");

  // Strip remaining HTML tags
  bodyContent = bodyContent.replace(/<[^>]+>/g, "");

  // Restore code blocks and inline code
  bodyContent = bodyContent.replace(/___CODE_BLOCK_(\d+)___/g, (_, idx) => {
    return `\n\n${codeBlocks[parseInt(idx, 10)]}\n\n`;
  });
  bodyContent = bodyContent.replace(/___INLINE_CODE_(\d+)___/g, (_, idx) => {
    return inlineCodes[parseInt(idx, 10)];
  });

  // Decode leftover entities
  bodyContent = decodeHtmlEntities(bodyContent);

  // Clean up excessive whitespace
  const cleanedBody = bodyContent
    .split("\n")
    .map(line => line.trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Build Frontmatter if metadata exists
  const hasMeta = meta.title || meta.description || meta.image;
  let frontmatter = "";
  if (hasMeta) {
    const lines = ["---"];
    if (meta.title) lines.push(`title: "${meta.title.replace(/"/g, '\\"')}"`);
    if (meta.description)
      lines.push(`description: "${meta.description.replace(/"/g, '\\"')}"`);
    if (meta.image) lines.push(`image: "${meta.image.replace(/"/g, '\\"')}"`);
    lines.push("---");
    frontmatter = `${lines.join("\n")}\n\n`;
  }

  // Build JSON-LD section if present
  let jsonLdSection = "";
  if (jsonLdBlocks.length > 0) {
    jsonLdSection = `\n\n\`\`\`json\n${jsonLdBlocks.join("\n\n")}\n\`\`\``;
  }

  return `${frontmatter}${cleanedBody}${jsonLdSection}\n`;
}
