import type { CollectionEntry } from "astro:content";
import postFilter from "./postFilter";

const getSortedPosts = (posts: CollectionEntry<"blog">[]) => {
  return posts.filter(postFilter).sort(
    (a, b) =>
      // Optimization: modDatetime and pubDatetime are already native Date objects via Astro's Zod schema.
      // Calling .getTime() directly avoids redundant object allocation inside this frequent sort operation.
      (b.data.modDatetime ?? b.data.pubDatetime).getTime() -
      (a.data.modDatetime ?? a.data.pubDatetime).getTime()
  );
};

export default getSortedPosts;
