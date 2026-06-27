## 2024-05-24 - Tag Deduplication Bottleneck
**Learning:** The Astro static site generation can be slowed down by O(N^2) algorithms in data processing scripts, such as array deduplication using `filter` and `findIndex`, especially when the number of posts grows.
**Action:** Use a `Map` or `Set` for O(N) deduplication when aggregating large collections of data during the build process to minimize build time.

## 2026-06-27 - Astro Collection Date Instantiation Anti-Pattern
**Learning:** Zod schemas in Astro's `src/content.config.ts` natively parse fields like `pubDatetime` and `modDatetime` into `Date` objects. Wrapping these fields in `new Date()` again during sorting or rendering is redundant and causes unnecessary object instantiation and garbage collection.
**Action:** Always use the parsed `Date` fields directly. Instead of `new Date(data.pubDatetime).getTime()`, use `data.pubDatetime.getTime()`.
