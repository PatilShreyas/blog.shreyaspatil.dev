## 2024-05-24 - Tag Deduplication Bottleneck
**Learning:** The Astro static site generation can be slowed down by O(N^2) algorithms in data processing scripts, such as array deduplication using `filter` and `findIndex`, especially when the number of posts grows.
**Action:** Use a `Map` or `Set` for O(N) deduplication when aggregating large collections of data during the build process to minimize build time.

## 2024-06-23 - Astro Zod Date Optimization
**Learning:** Astro content collections parsed with Zod `z.date()` provide native `Date` objects.
**Action:** Avoid wrapping them in `new Date()` and avoid redundant math operations in tight loops (like sorting) to improve static generation performance.
