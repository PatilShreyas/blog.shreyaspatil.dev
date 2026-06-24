## 2024-05-24 - Tag Deduplication Bottleneck
**Learning:** The Astro static site generation can be slowed down by O(N^2) algorithms in data processing scripts, such as array deduplication using `filter` and `findIndex`, especially when the number of posts grows.
**Action:** Use a `Map` or `Set` for O(N) deduplication when aggregating large collections of data during the build process to minimize build time.

## 2026-06-24 - Redundant Date Operations in Collection Sorting
**Learning:** Astro content collection schemas utilizing Zod automatically parse and validate `pubDatetime` and `modDatetime` as native JavaScript `Date` objects. The codebase was unnecessarily wrapping these already-parsed dates in `new Date()` and executing expensive, redundant division/rounding computations like `Math.floor(date.getTime() / 1000)` within sorting algorithms. These constant re-allocations and mathematical operations inside array `.sort()` loops created unneeded garbage collection overhead and degraded CPU efficiency, directly impacting build times.
**Action:** Always verify if timestamps or objects are already native JavaScript `Date` instances from schema validations. If they are, directly invoke `.getTime()` for milliseconds subtraction without re-instantiation or unnecessary rounding.
