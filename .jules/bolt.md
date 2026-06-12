## 2024-05-24 - Tag Deduplication Bottleneck
**Learning:** The Astro static site generation can be slowed down by O(N^2) algorithms in data processing scripts, such as array deduplication using `filter` and `findIndex`, especially when the number of posts grows.
**Action:** Use a `Map` or `Set` for O(N) deduplication when aggregating large collections of data during the build process to minimize build time.

## 2026-06-12 - Redundant Date instantiation bottleneck
**Learning:** Astro's `astro:content` schema natively parses dates as `Date` objects via Zod (`z.date()`). Wrapping these fields in redundant `new Date()` calls inside tight loops (like `.sort()`) introduces unnecessary garbage collection pressure and build overhead.
**Action:** Access `getTime()` directly on parsed Date fields (`data.pubDatetime.getTime()`) and avoid wrapping them in `new Date()` when working with content collections.
