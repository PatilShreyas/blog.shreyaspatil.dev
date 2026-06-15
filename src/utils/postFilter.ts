import type { CollectionEntry } from "astro:content";
import { SITE } from "@/config";

const postFilter = ({ data }: CollectionEntry<"blog">) => {
  // Optimization: pubDatetime is already a native Date object via Astro's Zod schema.
  // Calling .getTime() directly avoids redundant object allocation inside this frequent filter operation.
  const isPublishTimePassed =
    Date.now() > data.pubDatetime.getTime() - SITE.scheduledPostMargin;
  return !data.draft && (import.meta.env.DEV || isPublishTimePassed);
};

export default postFilter;
