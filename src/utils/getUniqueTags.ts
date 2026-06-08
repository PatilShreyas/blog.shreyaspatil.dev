import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "./slugify";
import postFilter from "./postFilter";

interface Tag {
  tag: string;
  tagName: string;
}

const getUniqueTags = (posts: CollectionEntry<"blog">[]) => {
  const filteredPosts = posts.filter(postFilter);

  // Use a Map for O(N) deduplication instead of O(N^2) array filtering
  const tagsMap = new Map<string, Tag>();

  for (const post of filteredPosts) {
    for (const tag of post.data.tags) {
      const slugifiedTag = slugifyStr(tag);
      if (!tagsMap.has(slugifiedTag)) {
        tagsMap.set(slugifiedTag, { tag: slugifiedTag, tagName: tag });
      }
    }
  }

  return Array.from(tagsMap.values()).sort((tagA, tagB) =>
    tagA.tag.localeCompare(tagB.tag)
  );
};

export default getUniqueTags;
