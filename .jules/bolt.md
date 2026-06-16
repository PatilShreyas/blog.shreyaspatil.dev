## 2024-05-24 - Tag Deduplication Bottleneck
**Learning:** The Astro static site generation can be slowed down by O(N^2) algorithms in data processing scripts, such as array deduplication using `filter` and `findIndex`, especially when the number of posts grows.
**Action:** Use a `Map` or `Set` for O(N) deduplication when aggregating large collections of data during the build process to minimize build time.

## 2025-03-09 - Redundant Date Instantiation in Astro Content Collections
**Learning:** Astro content collection schema uses `z.date()` which already parses ISO dates into native `Date` objects. Wrapping them in `new Date()` again or using `Math.floor(... / 1000)` for sorting is an unnecessary and redundant CPU cycle operation during builds.
**Action:** When working with Astro content collections parsed by Zod's `z.date()`, use the native `Date` methods directly (like `.getTime()`) and perform simple subtraction instead of creating new instances or doing extra math when sorting.
