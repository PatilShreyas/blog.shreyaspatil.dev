## 2024-05-24 - Tag Deduplication Bottleneck
**Learning:** The Astro static site generation can be slowed down by O(N^2) algorithms in data processing scripts, such as array deduplication using `filter` and `findIndex`, especially when the number of posts grows.
**Action:** Use a `Map` or `Set` for O(N) deduplication when aggregating large collections of data during the build process to minimize build time.
## 2024-06-19 - Avoid redundant Date parsing in Astro content collections
**Learning:** Astro content collection schema (defined in `src/content.config.ts` via Zod) parses `pubDatetime` and `modDatetime` as native `Date` objects. Wrapping them in `new Date()` calls or using `Math.floor(date.getTime() / 1000)` when sorting is redundant and adds unnecessary CPU overhead for every item.
**Action:** Avoid redundant `new Date()` parsing for Astro collection properties that are already `Date` objects, and sort directly by comparing millisecond timestamps (e.g. `b.getTime() - a.getTime()`) rather than converting to seconds via `Math.floor`.
