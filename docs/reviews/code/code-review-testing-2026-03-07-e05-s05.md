# Test Coverage Review: E05-S05 — Study Reminders & Notifications

**Date**: 2026-03-07
**Reviewed By**: Claude Code (code-review-testing agent)

## AC Coverage Table

| AC# | Description | Unit Test | E2E Test | Verdict |
|-----|-------------|-----------|----------|---------|
| 1 | Permission prompt — granted/denied | None | spec:27, spec:57 | Partial |
| 2 | Daily reminder time config | None | spec:81 | Partial |
| 3 | Streak-at-risk toggle | None | spec:113 | Partial |
| 4 | Notification with streak count | None | None | **Gap** |
| 5 | 22-hour inactivity notification | None | None | **Gap** |
| 6 | Disable cancels all reminders | None | spec:142 | Partial |
| 7 | Suppressed when paused | None | spec:178 | Partial |

**Coverage**: 0/7 fully covered | 2 gaps (AC4, AC5) | 5 partial

## Blockers

1. **(confidence: 95)** AC4 zero test coverage — scheduling logic + notification body untested
2. **(confidence: 95)** AC5 zero test coverage — `isStreakAtRisk()` + sender untested

## High Priority

3. **(confidence: 85)** AC1 granted — no text content assertion on permission status
4. **(confidence: 82)** AC2 — no persistence verification after time change
5. **(confidence: 80)** AC6 — no verification that intervals are actually cancelled
6. **(confidence: 78)** AC7 — fragile disjunction assertion (`isDisabled || isPausedVisible`)
7. **(confidence: 78)** AC7 — pause data seeded after page load (component already rendered)

## Medium

8. **(confidence: 72)** Test isolation — `study-reminders` not in STORAGE_KEYS for auto-cleanup
9. **(confidence: 70)** AC6 — `not.toBeVisible()` passes trivially if element never existed
10. **(confidence: 95)** No unit tests for `studyReminders.ts` (8 pure functions)

## Edge Cases

- Notification API unsupported environment — no test
- Dedup key timezone boundaries — no test
- Midnight wraparound in ±1 minute window — no test
- Multi-tab event propagation — no test
