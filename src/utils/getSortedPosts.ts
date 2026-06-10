import type { CollectionEntry } from "astro:content";
import postFilter from "./postFilter";

const getSortedPosts = (posts: CollectionEntry<"blog">[]) => {
  return posts
    .filter(postFilter)
    .sort(
      (a, b) =>
        (b.data.modDatetime ?? b.data.pubDatetime).valueOf() -
        (a.data.modDatetime ?? a.data.pubDatetime).valueOf()
    );
};

export default getSortedPosts;
