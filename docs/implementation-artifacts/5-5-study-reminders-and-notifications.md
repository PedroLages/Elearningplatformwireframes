---
story_id: E05-S05
story_name: "Study Reminders & Notifications"
status: done
started: 2026-03-07
completed: 2026-03-07
reviewed: true
review_started: 2026-03-07
review_gates_passed: [build, lint, type-check, format-check, unit-tests, e2e-tests, design-review, code-review, code-review-testing]
review_revalidated: 2026-03-07
---

# Story 5.5: Study Reminders & Notifications

## Story

As a learner,
I want to configure browser notification reminders for studying,
So that I receive timely nudges that help me maintain my streak and study habits.

## Acceptance Criteria

**Given** a learner wants to enable study reminders
**When** they toggle reminders on for the first time
**Then** the browser Notifications API permission prompt is triggered
**And** if permission is granted, the reminder configuration options become available
**And** if permission is denied, a helpful message explains how to enable notifications in browser settings

**Given** a learner has granted notification permission
**When** they configure a daily reminder
**Then** they can select a specific time of day for the reminder
**And** the reminder is saved and scheduled

**Given** a learner has granted notification permission
**When** they enable the streak-at-risk reminder
**Then** the system monitors for 22+ hours of inactivity
**And** a notification is sent when the streak is within 2 hours of breaking

**Given** a daily reminder is scheduled and the chosen time arrives
**When** the browser is open (or service worker is active)
**Then** a browser notification is displayed with a motivating message and the current streak count

**Given** the learner has not studied for 22+ hours and streak-at-risk is enabled
**When** the 22-hour inactivity threshold is crossed
**Then** a browser notification warns that the streak will break in approximately 2 hours
**And** the notification tone is supportive, not guilt-inducing

**Given** a learner wants to disable reminders
**When** they toggle reminders off
**Then** all scheduled notifications are cancelled
**And** the toggle state is persisted

**Given** the learner has a paused streak (Story 5.2)
**When** the streak is paused
**Then** streak-at-risk notifications are suppressed until the streak is resumed

## Tasks / Subtasks

- [ ] Task 1: Notification permission management (AC: 1)
  - [ ] 1.1 Create notification permission utility (request, check status)
  - [ ] 1.2 Build permission denied guidance UI
- [ ] Task 2: Reminder configuration UI in Settings (AC: 1, 2, 3)
  - [ ] 2.1 Add Reminders section to Settings page
  - [ ] 2.2 Daily reminder toggle with time picker
  - [ ] 2.3 Streak-at-risk reminder toggle
- [ ] Task 3: Reminder scheduling engine (AC: 2, 4)
  - [ ] 3.1 Create reminder store (Zustand) with Dexie persistence
  - [ ] 3.2 Implement timer-based scheduling (setTimeout/setInterval)
  - [ ] 3.3 Send browser notifications with motivating messages + streak count
- [ ] Task 4: Streak-at-risk monitoring (AC: 3, 5)
  - [ ] 4.1 Monitor last study session timestamp
  - [ ] 4.2 Trigger notification at 22-hour inactivity threshold
  - [ ] 4.3 Suppress when streak is paused (Story 5.2 integration)
- [ ] Task 5: Disable/cleanup flow (AC: 6)
  - [ ] 5.1 Cancel all scheduled notifications on toggle off
  - [ ] 5.2 Persist toggle state

## Implementation Notes

[Architecture decisions, patterns used, dependencies added]

## Testing Notes

[Test strategy, edge cases discovered, coverage notes]

## Design Review Feedback

Report: [design-review-2026-03-07-e05-s05.md](../reviews/design/design-review-2026-03-07-e05-s05.md)

**Blockers**: 2 WCAG AA contrast failures (`text-green-600` 3.30:1, `text-amber-600` 3.19:1)
**High**: Touch targets below 44px on switch rows and time input; missing `aria-live` on status messages
**Medium**: No animation on sub-toggle reveal; h3 heading skip (pre-existing)

## Code Review Feedback

Architecture report: [code-review-2026-03-07-e05-s05.md](../reviews/code/code-review-2026-03-07-e05-s05.md)
Testing report: [code-review-testing-2026-03-07-e05-s05.md](../reviews/code/code-review-testing-2026-03-07-e05-s05.md)

**Blockers**: Implementation uncommitted; AC4/AC5 have zero test coverage
**High**: Dead `handleStudyUpdate` listener; `isPaused` not reactive; no unit tests
**Medium**: No validation on time string parsing; hardcoded colors; redundant re-render

## Implementation Plan

See [plan](plans/e05-s05-study-reminders-notifications.md) for implementation approach.

## Challenges and Lessons Learned

- **Worktree dev server collision**: Playwright's `reuseExistingServer: true` silently reused a dev server running from the main workspace instead of the worktree. Tests passed structurally but components didn't exist in main's codebase. Fix: kill any dev server on port 5173 before running E2E tests in a worktree so Playwright starts its own from the correct directory.
- **Vitest Notification constructor mocks**: `vi.fn()` cannot be used with `new` — `new (vi.fn())()` throws "is not a constructor". Use a class-based mock (`class MockNotification`) with `vi.stubGlobal('Notification', MockNotification)` and track instances via a closured array.
- **WCAG contrast with Tailwind color scale**: `text-green-600` (3.30:1) and `text-amber-600` (3.19:1) fail AA contrast on white backgrounds. Use `-700` variants (4.87:1 and 4.55:1) as the minimum for status text.
- **Reactivity via custom events**: The `isPaused` state in `ReminderSettings` initially read once on mount with no update mechanism. Added `streak-pause-updated` event listener to keep it reactive — same pattern used across the streak system (`study-log-updated`, `study-reminders-updated`).
- **Dead code from copy-paste**: `useStudyReminders` had an empty `handleStudyUpdate` event listener that was never implemented — a no-op wired to `study-log-updated`. Code review caught it. Always verify listener bodies aren't empty stubs.
