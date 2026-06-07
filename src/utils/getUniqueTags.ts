import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "./slugify";
import postFilter from "./postFilter";

interface Tag {
  tag: string;
  tagName: string;
}

const getUniqueTags = (posts: CollectionEntry<"blog">[]) => {
  const filteredPosts = posts.filter(postFilter);
  const tagMap = new Map<string, string>();

  // Optimize tag uniqueness check from O(N^2) to O(N) using a Map
  for (const post of filteredPosts) {
    for (const tag of post.data.tags) {
      const slugified = slugifyStr(tag);
      if (!tagMap.has(slugified)) {
        tagMap.set(slugified, tag);
      }
    }
  }

  const tags: Tag[] = Array.from(tagMap.entries())
    .map(([tag, tagName]) => ({ tag, tagName }))
    .sort((tagA, tagB) => tagA.tag.localeCompare(tagB.tag));

  return tags;
};

export default getUniqueTags;
