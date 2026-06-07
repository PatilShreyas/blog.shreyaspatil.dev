## 2024-06-07 - Array Filter with findIndex creates O(N²) bottleneck

**Learning:** When extracting unique items (like tags) from content collections in static site generators like Astro, using `array.filter((val, index, self) => self.findIndex(...) === index)` creates a hidden O(N²) operation. This becomes a significant bottleneck during static build times as the number of posts grows, because this extraction typically happens repeatedly across different pages.

**Action:** Replace `array.filter(findIndex)` uniqueness checks with `Map` or `Set` based deduplication for O(N) performance, especially in utility functions that are called during the static build phase of SSGs.
