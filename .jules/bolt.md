## 2024-05-24 - Tag Deduplication Bottleneck
**Learning:** The Astro static site generation can be slowed down by O(N^2) algorithms in data processing scripts, such as array deduplication using `filter` and `findIndex`, especially when the number of posts grows.
**Action:** Use a `Map` or `Set` for O(N) deduplication when aggregating large collections of data during the build process to minimize build time.
## 2025-02-12 - Redundant Date Instantiation Bottleneck
**Learning:** Astro's content collection schema (defined in `src/content.config.ts` via Zod) parses `pubDatetime` and `modDatetime` as native `Date` objects. Wrapping them in `new Date()` and performing math operations like `Math.floor(... / 1000)` inside sorting and filtering loops is unnecessary and slows down the build process.
**Action:** Avoid redundant `new Date()` wrappers for pre-parsed date fields and use direct millisecond subtraction (`.getTime()`) for optimal performance when sorting and filtering content collections.
