## 2024-05-24 - Tag Deduplication Bottleneck
**Learning:** The Astro static site generation can be slowed down by O(N^2) algorithms in data processing scripts, such as array deduplication using `filter` and `findIndex`, especially when the number of posts grows.
**Action:** Use a `Map` or `Set` for O(N) deduplication when aggregating large collections of data during the build process to minimize build time.

## 2026-06-21 - Redundant Date Instantiation in Astro Content Collections
**Learning:** Astro's content collection schema uses Zod to natively parse date strings into JavaScript `Date` objects. Instantiating a new `Date` using these parsed fields is redundant, and dividing by 1000 with `Math.floor` for simple numerical sorting adds unnecessary overhead.
**Action:** Always use the native `Date` object directly and utilize `.getTime()` for straightforward subtraction when sorting dates from Astro content collections.
