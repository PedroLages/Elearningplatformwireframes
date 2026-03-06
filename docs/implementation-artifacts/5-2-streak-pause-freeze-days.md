---
story_id: E05-S02
story_name: "Streak Pause & Freeze Days"
status: in-progress
started: 2026-03-06
completed:
reviewed: false
review_started:
review_gates_passed: []
---

# Story 5.2: Streak Pause & Freeze Days

## Story

As a learner,
I want to pause my streak or configure weekly freeze days,
So that I can take planned rest days without losing my streak progress.

## Acceptance Criteria

**Given** a learner has an active study streak
**When** they toggle the streak pause control
**Then** the streak enters a paused state
**And** the dashboard streak counter displays a paused indicator (e.g., pause icon or "Paused" label)
**And** the streak count is preserved and does not reset while paused

**Given** a learner has a paused streak
**When** they resume the streak
**Then** the paused state is cleared
**And** the streak counter resumes from its previous value
**And** the 24-hour inactivity window resets from the moment of resumption

**Given** a learner wants to configure freeze days
**When** they open the freeze day settings
**Then** they can select 1 to 3 days of the week as freeze days
**And** the selected days are visually indicated

**Given** a learner has configured freeze days
**When** a freeze day passes with no study activity
**Then** the streak does not reset
**And** the freeze day is recorded distinctly in the study history
**And** the streak counter from Story 5.1 respects freeze days in its 24-hour evaluation

**Given** a learner studies on a configured freeze day
**When** the session is recorded
**Then** the day counts as a regular study day (not consumed as a freeze)
**And** the streak increments normally

**Given** a learner attempts to select more than 3 freeze days
**When** they try to toggle a fourth day
**Then** the selection is prevented
**And** a validation message explains the maximum of 3 freeze days per week

**Given** a learner has both a paused streak and configured freeze days
**When** the streak is paused
**Then** freeze day logic is suspended until the streak is resumed

## Tasks / Subtasks

- [ ] Task 1: Extend streak data model for pause state and freeze days (AC: 1-2, 7)
  - [ ] 1.1 Add `isPaused`, `pausedAt` fields to streak store
  - [ ] 1.2 Add `freezeDays` (array of day indices) to streak config
  - [ ] 1.3 Update streak evaluation logic to respect pause and freeze states
- [ ] Task 2: Implement streak pause/resume UI (AC: 1-2)
  - [ ] 2.1 Add pause/resume toggle to streak widget on dashboard
  - [ ] 2.2 Display paused indicator on streak counter
  - [ ] 2.3 Reset 24-hour window on resume
- [ ] Task 3: Implement freeze day configuration UI (AC: 3, 6)
  - [ ] 3.1 Create freeze day selector component (day-of-week picker)
  - [ ] 3.2 Enforce max 3 freeze days with validation message
  - [ ] 3.3 Visual indication of selected freeze days
- [ ] Task 4: Update streak evaluation logic for freeze days (AC: 4-5, 7)
  - [ ] 4.1 Skip streak reset on freeze days with no activity
  - [ ] 4.2 Record freeze days distinctly in study history
  - [ ] 4.3 Count study on freeze day as regular day
  - [ ] 4.4 Suspend freeze logic when streak is paused

## Implementation Notes

[Architecture decisions, patterns used, dependencies added]

## Testing Notes

[Test strategy, edge cases discovered, coverage notes]

## Design Review Feedback

[Populated by /review-story — Playwright MCP findings]

## Code Review Feedback

[Populated by /review-story — adversarial code review findings]

## Implementation Plan

See [plan](plans/e05-s02-streak-pause-freeze-days.md) for implementation approach.

## Challenges and Lessons Learned

[Document issues, solutions, and patterns worth remembering]
