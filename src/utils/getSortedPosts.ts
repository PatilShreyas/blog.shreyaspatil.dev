import type { CollectionEntry } from "astro:content";
import postFilter from "./postFilter";

const getSortedPosts = (posts: CollectionEntry<"blog">[]) => {
  return posts
    .filter(postFilter)
    .sort(
      (a, b) =>
        (b.data.modDatetime ?? b.data.pubDatetime).getTime() -
        (a.data.modDatetime ?? a.data.pubDatetime).getTime()
    );
};

export default getSortedPosts;
