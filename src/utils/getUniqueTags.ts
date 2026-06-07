import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "./slugify";
import postFilter from "./postFilter";

interface Tag {
  tag: string;
  tagName: string;
}

const getUniqueTags = (posts: CollectionEntry<"blog">[]) => {
  const tags: Tag[] = posts
    .filter(postFilter)
    .flatMap(post => post.data.tags)
    .map(tag => ({ tag: slugifyStr(tag), tagName: tag }));

  const uniqueTagsMap = new Map<string, Tag>();
  for (const tag of tags) {
    if (!uniqueTagsMap.has(tag.tag)) {
      uniqueTagsMap.set(tag.tag, tag);
    }
  }

  return Array.from(uniqueTagsMap.values()).sort((tagA, tagB) =>
    tagA.tag.localeCompare(tagB.tag)
  );
};

export default getUniqueTags;
