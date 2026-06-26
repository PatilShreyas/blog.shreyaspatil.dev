## 2024-05-24 - Tag Deduplication Bottleneck
**Learning:** The Astro static site generation can be slowed down by O(N^2) algorithms in data processing scripts, such as array deduplication using `filter` and `findIndex`, especially when the number of posts grows.
**Action:** Use a `Map` or `Set` for O(N) deduplication when aggregating large collections of data during the build process to minimize build time.

## 2024-05-24 - Redundant Date Operations Bottleneck
**Learning:** Zod schemas in Astro content collections natively parse fields as `Date` objects. Re-wrapping these existing `Date` objects in `new Date()` within high-frequency operations like `.sort()` or `.filter()` callbacks causes unnecessary object allocation and garbage collection overhead, especially as the number of posts grows. Additionally, performing math operations like `Math.floor(date.getTime() / 1000)` inside sorting comparators introduces expensive operations that execute `O(n log n)` times.
**Action:** Use the existing `Date` objects directly. When sorting, simply subtract `getTime()` values instead of dividing and using `Math.floor`.
