# Test Coverage Review: E03-S05 — Full-Text Note Search

**Date:** 2026-02-28
**Reviewer:** code-review-testing agent

## AC Coverage Table

| AC# | Description | Unit Test | E2E Test | Verdict |
|-----|-------------|-----------|----------|---------|
| 1 | MiniSearch results via Cmd+K with snippets, course name, tags, relevance ranking | `noteSearch.test.ts:117` (tag boost), `:144` (enriched fields), `:197` (courseName boost) | `story-e03-s05.spec.ts:113,128,140` | **Partial** — course name/video title not asserted in E2E |
| 2 | Fuzzy matching and prefix search | `noteSearch.test.ts:108` (prefix) | `story-e03-s05.spec.ts:166,179` | **Covered** (no fuzzy unit test) |
| 3 | Click result → Lesson Player with ?panel=notes + timestamp seek | `noteSearch.test.ts:167` (timestamp stored) | `story-e03-s05.spec.ts:203,218` | **Partial** — `t=42` not asserted in URL; panel open state not verified in DOM |
| 4 | Empty results message | `noteSearch.test.ts:46,102` | `story-e03-s05.spec.ts:244` | **Partial** — regex matches generic fallback equally |

**Coverage**: 1/4 ACs fully covered | 3 partial

## Findings

### High Priority

1. **Timestamp test doesn't assert `t=42`** (confidence: 92) — Test duplicates the previous test's assertion (`panel=notes` only).
2. **E2E doesn't assert course name/video title** (confidence: 85) — Only checks tag badge presence.
3. **Empty state regex too loose** (confidence: 82) — `/no notes found|no results/i` matches generic fallback.
4. **Panel open state not verified in DOM** (confidence: 78) — URL check only; should assert `aria-expanded="true"`.

### Medium Priority

1. **No `afterEach` cleanup in E2E** (confidence: 72) — Seeded notes persist across test groups.
2. **`[cmdk-item]` is implementation-coupled selector** (confidence: 71) — Use `getByRole('option')` instead.
3. **Module-level singleton leaks between describe blocks** (confidence: 76)

### Nits

1. Inline `makeNote` factory duplicates shared pattern
2. Prefix search test doesn't assert which note ID was returned
3. `waitUntil: 'domcontentloaded'` doesn't guarantee async index init complete

## Edge Cases to Consider

- `combineWith: 'AND'` multi-term queries with one unfuzzy-able term
- `addToIndex` called before `initializeSearchIndex` silently drops notes
- Note with unknown `courseId` graceful degradation (empty `courseName`)

## Verdict

1/4 ACs fully covered. 4 high, 3 medium, 3 nit findings.
