## 2024-05-24 - Tag Deduplication Bottleneck
**Learning:** The Astro static site generation can be slowed down by O(N^2) algorithms in data processing scripts, such as array deduplication using `filter` and `findIndex`, especially when the number of posts grows.
**Action:** Use a `Map` or `Set` for O(N) deduplication when aggregating large collections of data during the build process to minimize build time.
## 2024-06-09 - Caching expensive pure functions in static loops
**Learning:** During static site generation (like Astro rendering `tags/[tag]/[...page].astro`), functions handling arrays of strings (like `slugifyStr`) are called repeatedly across massive loops (e.g., checking tag lists of all posts multiple times). Unmemoized regex testing and string manipulation here creates significant, cumulative build-time overhead.
**Action:** When finding loops traversing all content collections to filter or group data, wrap pure transformation functions (like slugifying or date parsing) in a simple Map cache. Always implement a cache size limit to prevent memory leaks in dev/SSR environments.
