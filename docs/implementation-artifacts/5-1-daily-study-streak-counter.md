---
story_id: E05-S01
story_name: "Daily Study Streak Counter"
status: done
started: 2026-03-05
completed: 2026-03-06
reviewed: true
review_started: 2026-03-05
review_gates_passed: [build, lint, unit-tests, e2e-tests, design-review, code-review, code-review-testing]
---

# Story 5.1: Daily Study Streak Counter

## Story

As a learner,
I want to see my current daily study streak prominently on the dashboard,
so that I feel motivated to maintain consistent study habits.

## Acceptance Criteria

**AC1** — **Given** a learner has completed study sessions on consecutive days
**When** they view the Overview dashboard
**Then** a streak counter widget displays the current streak count with a fire emoji
**And** the counter is visually prominent within the dashboard layout

**AC2** — **Given** a learner completes a study session on a new calendar day
**When** the session is recorded
**Then** the streak count increments by one
**And** a pulse animation plays on the streak counter (respecting prefers-reduced-motion)

**AC3** — **Given** a learner views the Overview dashboard
**When** the streak calendar is displayed
**Then** a visual calendar shows study history with color-coded activity levels
**And** the calendar is keyboard-navigable for accessibility

## Tasks / Subtasks

- [x] Task 1: Implement `getStreakSnapshot()` parse-once pattern in `studyLog.ts` (AC: 1, 2)
- [x] Task 2: Build `StudyStreakCalendar` component with streak counter + calendar heatmap (AC: 1, 3)
- [x] Task 3: Add `study-log-updated` CustomEvent dispatch for live updates (AC: 2)
- [x] Task 4: Integrate into Overview page replacing old StudyStreak widget (AC: 1)
- [x] Task 5: Delete orphaned `StudyStreak.tsx` and `studyStreak.ts` (cleanup)
- [x] Task 6: Migrate `ProgressStats.tsx` to use new streak API (cleanup)
- [x] Task 7: Add 53 unit tests for streak logic with DST edge cases (AC: 1, 2, 3)
- [x] Task 8: Add 6 E2E tests in `story-e05-s01.spec.ts` (AC: 1, 2, 3)

## Implementation Notes

- Parse-once pattern: `getStreakSnapshot()` reads localStorage once and derives current streak, longest streak, and 90-day activity array from a single parse
- DST-safe date handling via `toLocalDateString()` (Swedish locale) and `parseLocalDate()` with `Math.round()` on day diffs
- O(n+m) activity counting with pre-built `Map<string, number>`

## Challenges and Lessons Learned

- **3 review rounds needed.** Round 1 found 13 issues (4 high, 6 medium, 3 nits). Round 2 fixed all 8 critical findings but surfaced 5 new ones. Round 3 confirmed 0 blockers. Lesson: budget for at least 2 review cycles on date-heavy features.
- **`toISOString()` is a timezone trap.** `.toISOString().split('T')[0]` returns UTC date, not local. Near-midnight users in western timezones got wrong streak counts. Fixed with `toLocaleDateString('sv-SE')` which returns `YYYY-MM-DD` in local time.
- **DST breaks millisecond arithmetic.** `Date.now() - 86400000` skips or doubles a day across DST transitions. Use `setDate(getDate() - 1)` and `Math.round()` on day diffs to absorb the hour shift.
- **Parse-once pattern paid off.** Initial implementation parsed localStorage 3x per render. Consolidating into `getStreakSnapshot()` eliminated redundant reads and made the API simpler to test.
- **CustomEvent for cross-component updates.** `logStudyAction()` dispatching `study-log-updated` allowed the streak counter to update live without prop drilling or a store. Round 1 missed this entirely — the event was never dispatched.
- **Dead code accumulates fast.** `StudyStreak.tsx` and `studyStreak.ts` became orphans after the new component was built. Review caught them; delete aggressively.
- **Branch naming mismatch.** E05-S01 was implemented on the `e04-s05` branch because a worktree wasn't used. This caused force-push complications. Use `/start-story` for each new story to get a clean branch.
