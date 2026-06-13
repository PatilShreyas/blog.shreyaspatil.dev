## 2024-05-24 - Tag Deduplication Bottleneck
**Learning:** The Astro static site generation can be slowed down by O(N^2) algorithms in data processing scripts, such as array deduplication using `filter` and `findIndex`, especially when the number of posts grows.
**Action:** Use a `Map` or `Set` for O(N) deduplication when aggregating large collections of data during the build process to minimize build time.

## 2024-06-13 - Redundant Date Instantiation with Astro Content Collections
**Learning:** Astro's `z.date()` schema natively parses dates into `Date` objects. Wrapping these fields (like `pubDatetime` or `modDatetime`) in `new Date()` throughout the codebase is redundant and creates unnecessary allocations, which can degrade performance during static site generation and data filtering. Additionally, math operations like `Math.floor(date.getTime() / 1000)` are unnecessary for simple sorting; direct subtraction of milliseconds (`getTime()`) achieves the same result more efficiently.
**Action:** When working with Astro content collections parsed via `z.date()`, use the date objects directly. Avoid redundant `new Date()` calls and remove unnecessary mathematical operations during sort routines.
