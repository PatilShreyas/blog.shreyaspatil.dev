## 2024-05-24 - Tag Deduplication Bottleneck
**Learning:** The Astro static site generation can be slowed down by O(N^2) algorithms in data processing scripts, such as array deduplication using `filter` and `findIndex`, especially when the number of posts grows.
**Action:** Use a `Map` or `Set` for O(N) deduplication when aggregating large collections of data during the build process to minimize build time.

## 2024-05-24 - Redundant Date Re-allocation Bottleneck
**Learning:** Zod schemas for Astro content collections already parse dates natively. Wrapping them in `new Date()` combined with unnecessary math operations like `Math.floor(... / 1000)` causes unnecessary object allocations and performance overhead, particularly O(NlogN) overhead during collection sorting.
**Action:** Use `.getTime()` subtraction directly on Zod-parsed `Date` objects when calculating differences or sorting by timestamp to minimize overhead and prevent excessive garbage collection in hot loops.
