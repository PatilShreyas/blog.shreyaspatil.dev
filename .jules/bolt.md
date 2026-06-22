## 2024-05-24 - Tag Deduplication Bottleneck
**Learning:** The Astro static site generation can be slowed down by O(N^2) algorithms in data processing scripts, such as array deduplication using `filter` and `findIndex`, especially when the number of posts grows.
**Action:** Use a `Map` or `Set` for O(N) deduplication when aggregating large collections of data during the build process to minimize build time.

## 2024-05-25 - Redundant Object Instantiation During Array Sorts
**Learning:** Astro's Zod schema integration already parses dates into native `Date` objects. Re-wrapping them in `new Date()` within O(N log N) loops, like `.sort()`, is a common but unnecessary performance tax in this codebase.
**Action:** When working with Astro content collections, verify schemas for pre-parsed types (like dates) and remove redundant type coercions/wrappers, especially in iterative methods like `sort()`, `map()`, or `filter()`. Direct `.getTime()` comparisons are faster than computing seconds using division and `Math.floor()`.
