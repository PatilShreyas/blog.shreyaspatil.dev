## 2025-06-10 - [Avoid redundant Date parsing in Astro content collections]
**Learning:** Astro content collection schema (defined in `src/content.config.ts` via Zod) natively parses date fields like `pubDatetime` and `modDatetime` as `Date` objects. Wrapping them in `new Date()` again when sorting or filtering is a redundant and expensive operation.
**Action:** When working with Astro content collection date fields, use them directly as Date objects (e.g., calling `.getTime()` or `.valueOf()`) instead of wrapping them in `new Date()`.
