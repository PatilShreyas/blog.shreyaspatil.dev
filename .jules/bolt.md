## 2024-05-24 - Tag Deduplication Bottleneck
**Learning:** The Astro static site generation can be slowed down by O(N^2) algorithms in data processing scripts, such as array deduplication using `filter` and `findIndex`, especially when the number of posts grows.
**Action:** Use a `Map` or `Set` for O(N) deduplication when aggregating large collections of data during the build process to minimize build time.

## 2024-06-11 - Astro Zod Collections Redundant Dates
**Learning:** In Astro v5 content collections, Zod schemas that define a field with `z.date()` output a native JavaScript `Date` object directly. The codebase was unnecessarily wrapping these properties like `pubDatetime` in an extra `new Date(data.pubDatetime)` call before performing sorting, filtering, or processing in components, utils and RSS generation.
**Action:** When filtering, mapping, or sorting Astro content collections containing Zod parsed `Date` objects, directly use `.getTime()` or assignment without passing the field to the `new Date()` constructor to avoid unnecessary allocations in tight loops.
