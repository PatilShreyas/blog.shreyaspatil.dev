## 2024-05-24 - Tag Deduplication Bottleneck
**Learning:** The Astro static site generation can be slowed down by O(N^2) algorithms in data processing scripts, such as array deduplication using `filter` and `findIndex`, especially when the number of posts grows.
**Action:** Use a `Map` or `Set` for O(N) deduplication when aggregating large collections of data during the build process to minimize build time.
## 2024-11-20 - Redundant Date Instantiation in Astro

**Learning:** Astro's Content Collection schemas (via Zod) parse dates like `pubDatetime` and `modDatetime` into native JavaScript `Date` objects. Re-wrapping these in `new Date()` is unnecessary and can add minor performance overhead (allocations, object creation). Similarly, using `Math.floor(date.getTime() / 1000)` during sorting is an unnecessary step; direct subtraction of `.getTime()` values works perfectly and is more efficient.
**Action:** When working with Astro content collections, directly use the Date object properties methods (e.g. `.getTime()`) and avoid re-wrapping them in `new Date()`. Additionally, avoid unnecessary math operations during simple comparison sorting.
