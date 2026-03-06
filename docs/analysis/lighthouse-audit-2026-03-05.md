# Lighthouse Audit - 2026-03-05

**Environment:** Vite dev server (localhost:5173), Desktop preset, Chrome headless
**Page:** `/` (Overview/Dashboard)

## Scores

| Category | Score |
|----------|-------|
| Performance | 57 |
| Accessibility | 96 |
| Best Practices | 93 |
| SEO | 83 |

## Core Web Vitals

| Metric | Value | Rating |
|--------|-------|--------|
| First Contentful Paint (FCP) | 3.1s | Poor |
| Largest Contentful Paint (LCP) | 7.9s | Poor |
| Time to Interactive (TTI) | 8.0s | Poor |
| Speed Index | 4.0s | Poor |
| Total Blocking Time (TBT) | 50ms | Good |
| Cumulative Layout Shift (CLS) | 0 | Good |

## Analysis

**Good:**
- TBT (50ms) and CLS (0) are excellent - no layout shifts, minimal blocking
- Accessibility score (96) is near-perfect
- Best Practices (93) is strong

**Concerns:**
- FCP/LCP/TTI are inflated by dev server overhead (Vite HMR, unminified code, source maps)
- Production build metrics would be significantly better (tree-shaken, minified, compressed)
- A production-mode Lighthouse audit is recommended for accurate NFR validation

**NFR Threshold Check (against PRD):**
- NFR1 (<3s FCP on 4G): 3.1s in dev mode - likely passes in production
- NFR2 (<300ms route transitions): Not measured by Lighthouse, use web-vitals `markRouteEnd()`

## Notes

- This is a **dev server** audit, not production. Dev mode adds ~2-5x overhead.
- The app loads Unsplash images on the Overview page which inflate LCP.
- Bundle splitting is effective (no chunks >500KB).
- For accurate production metrics, deploy and re-audit with `--preset=desktop` on the production build.
