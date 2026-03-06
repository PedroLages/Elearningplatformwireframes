# Test Coverage Review: E05-S01 — Daily Study Streak Counter (v2)

**Date**: 2026-03-05
**Reviewer**: code-review-testing agent (Sonnet)
**Files reviewed**: story-e05-s01.spec.ts, studyLog.test.ts, studyLog.ts, StudyStreak.tsx, StudyStreakCalendar.tsx, Overview.tsx

## AC Coverage Table

| AC# | Description | Unit Test | E2E Test | Verdict |
|-----|-------------|-----------|----------|---------|
| 1 | Streak counter widget displays on Overview with fire emoji and current count | getCurrentStreak, getLongestStreak, getStudyActivity (unstaged) | 3 tests: widget visible, count=0, count=7 | Covered (tests exist in working tree) |
| 2 | Streak increments on new study session; pulse animation respecting prefers-reduced-motion | getCurrentStreak tests (unstaged) | Live increment + reduced-motion tests (unstaged) | Covered (tests exist in working tree) |
| 3 | Streak resets to 0 after 24+ hours; previous streak preserved in history | getCurrentStreak 2+ days ago test (unstaged) | Reset to 0 + "Longest: 5 days" tests (committed) | Covered |
| 4 | First session shows streak of 1 with fire emoji and pulse | getCurrentStreak today-only test (unstaged) | AC2/AC4 combined test (committed) | Partial — no positive pulse animation assertion |

**Coverage**: 3/4 ACs fully covered | 1 partial (AC4 — missing pulse class assertion)

Note: All unit tests and 2 E2E tests exist in working tree but are not yet committed. This is expected — commits happen at `/finish-story`.

## Findings

### High Priority

1. **No positive pulse animation assertion for AC4** (confidence: 78)
   - Tests verify reduced-motion suppresses animation but don't verify animation IS applied when motion is allowed
   - The AC2/AC4 test checks flame visibility but not the `animate-streak-pulse` class
   - Assessment: Moderate gap — the animation works (verified in design review), but no automated assertion

2. **Live increment test bypasses real UI flow** (confidence: 70)
   - E2E test at line 113 injects localStorage directly + dispatches event, doesn't go through `markLessonComplete` UI
   - Assessment: Appropriate for unit-level E2E, but one integration test through actual lesson completion UI would strengthen coverage

3. **`seedStudyDays` helper duplicated** (confidence: 55)
   - Same helper defined in both `describe('getCurrentStreak')` and `describe('getLongestStreak')` blocks
   - Assessment: Nit — extract to module scope

### Medium

1. **No DST boundary test** (confidence: 68)
   - No test covers entries straddling DST transition affecting date binning
   - Assessment: Edge case, low real-world impact with current `toLocalDateStr` implementation

2. **Expired pause test bypasses write path** (confidence: 65)
   - Line 353 manually constructs pause object instead of using `setStreakPause()` + clock advancement
   - Assessment: Acceptable for testing read behavior, but full write-read cycle test would be stronger

3. **getLongestStreak write-read cycle untested** (confidence: 62)
   - Tests seed `study-longest-streak` via localStorage.setItem, bypassing the function's persistence logic
   - Assessment: The read path is tested; write path tested indirectly through `getLongestStreak()` calls

### Nits

1. **`makeStreakEntry` uses real clock** (confidence: 55)
   - E2E helper creates entries relative to `new Date()`, coupling test to execution time
   - Assessment: Works correctly due to local timezone round-trip, but explicit timestamps would be more robust

2. **Animation duration assertion fragility** (confidence: 50)
   - `parseFloat(computedStyle.animationDuration) * 1000 < 1` depends on browser's computed style resolution
   - Assessment: Works in Chromium, tested and passing

3. **No loading state test** (confidence: 45)
   - No test verifies streak counter transitions from skeleton to live data during Overview's 800ms loading
   - Assessment: Low risk — skeleton is cosmetic, not functional
