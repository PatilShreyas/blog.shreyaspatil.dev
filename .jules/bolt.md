## 2024-05-24 - Tag Deduplication Bottleneck
**Learning:** The Astro static site generation can be slowed down by O(N^2) algorithms in data processing scripts, such as array deduplication using `filter` and `findIndex`, especially when the number of posts grows.
**Action:** Use a `Map` or `Set` for O(N) deduplication when aggregating large collections of data during the build process to minimize build time.

## 2026-06-20 - Date Initialization Redundancy
**Learning:** Instantiating new `Date()` objects inside sort functions for `pubDatetime` and `modDatetime` when they are already defined as `Date` objects in the Zod schema (`src/content.config.ts`) adds unnecessary overhead to array sorting.
**Action:** Use `.getTime()` directly on the schema-parsed Date objects during sorting to prevent redundant initialization and avoid integer math operations like `Math.floor` when direct millisecond subtraction suffices.
