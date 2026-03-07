---
story_id: E05-S05
story_name: "Study Reminders & Notifications"
status: in-progress
started: 2026-03-07
completed:
reviewed: false
review_started:
review_gates_passed: []
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

[Populated by /review-story — Playwright MCP findings]

## Code Review Feedback

[Populated by /review-story — adversarial code review findings]

## Implementation Plan

See [plan](plans/e05-s05-study-reminders-notifications.md) for implementation approach.

## Challenges and Lessons Learned

[Document issues, solutions, and patterns worth remembering]
