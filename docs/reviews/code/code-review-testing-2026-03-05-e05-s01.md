# Test Coverage Review: E05-S01 — Daily Study Streak Counter

**Date**: 2026-03-05
**Reviewer**: Test Coverage Agent

## AC Coverage Table

| AC# | Description | Unit Test | E2E Test | Verdict |
|-----|-------------|-----------|----------|---------|
| 1 | Streak widget with fire emoji on dashboard | None | 3 tests (visibility, 0 count, 7-day) | Covered |
| 2 | Streak increments + pulse animation + reduced-motion | None | 1 test (seeded, no live increment, no animation) | Partial |
| 3 | Streak resets after 24h, history preserved | None | 2 tests (reset to 0, longest preserved) | Covered |
| 4 | Zero-to-one transition with fire + pulse | None | Combined with AC2 test | Partial |

**Coverage**: 2/4 ACs fully covered | 2 partial

## Findings Summary: 0 Blockers | 4 High | 3 Medium | 3 Nits

### High Priority

1. AC2/AC4 test doesn't exercise live increment path (confidence: 92)
2. No test for `prefers-reduced-motion` suppression (confidence: 90)
3. Zero unit tests for `getCurrentStreak()` / `getLongestStreak()` (confidence: 90)
4. Zero unit tests for `getLongestStreak()` persistence logic (confidence: 88)

### Medium

5. `makeStreakEntry` uses real clock — midnight boundary risk (confidence: 78)
6. AC3 test seeds `study-longest-streak` directly, bypassing write path (confidence: 72)
7. No component unit tests for StudyStreak.tsx (confidence: 75)

### Nits

8. AC2 vs AC4 bundled in single test — poor traceability (confidence: 50)
9. No pre-test `localStorage.clearAll()` (confidence: 55)
10. Missing boundary comment on daysAgo=2 test (confidence: 60)
