import type { CollectionEntry } from "astro:content";
import { SITE } from "@/config";

const postFilter = ({ data }: CollectionEntry<"blog">) => {
  const isPublishTimePassed =
    // ⚡ Bolt: data.pubDatetime is already a native Date object. Calling getTime() directly avoids redundant instantiation.
    Date.now() >
    data.pubDatetime.getTime() - SITE.scheduledPostMargin;
  return !data.draft && (import.meta.env.DEV || isPublishTimePassed);
};

export default postFilter;
