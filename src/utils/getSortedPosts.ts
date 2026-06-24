import type { CollectionEntry } from "astro:content";
import postFilter from "./postFilter";

const getSortedPosts = (posts: CollectionEntry<"blog">[]) => {
  return posts
    .filter(postFilter)
    .sort(
      (a, b) =>
        // ⚡ Bolt: Removed redundant new Date() and Math.floor() since pubDatetime/modDatetime are native Date objects.
        // Direct subtraction of getTime() milliseconds avoids unnecessary overhead during array sorting.
        (b.data.modDatetime ?? b.data.pubDatetime).getTime() -
        (a.data.modDatetime ?? a.data.pubDatetime).getTime()
    );
};

export default getSortedPosts;
