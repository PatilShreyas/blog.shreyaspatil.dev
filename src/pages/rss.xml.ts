import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";
import { SITE } from "@/config";

export async function GET() {
  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts);
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    customData: `<language>${SITE.lang || "en"}</language>`,
    items: sortedPosts.map(({ data, id, filePath }) => ({
      link: getPath(id, filePath),
      title: data.title,
      description: data.description,
      pubDate: data.modDatetime ?? data.pubDatetime,
      customData: [
        `<author>${SITE.author}</author>`,
        ...data.tags.map(tag => `<category>${tag}</category>`),
      ].join(""),
    })),
  });
}
