import type { APIRoute } from "astro";
import { SITE } from "@/config";

const getRobotsTxt = (sitemapURL: URL) => `
User-agent: *
Allow: /
Content-Signal: ${SITE.contentSignal}

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);
  return new Response(getRobotsTxt(sitemapURL), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
