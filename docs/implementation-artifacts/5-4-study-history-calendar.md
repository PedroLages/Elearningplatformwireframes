---
story_id: E05-S04
story_name: "Study History Calendar"
status: in-progress
started: 2026-03-07
completed:
reviewed: false
review_started:
review_gates_passed: []
---

# Story 5.4: Study History Calendar

## Story

As a learner,
I want to view a visual calendar showing my study history,
So that I can see patterns in my study habits and identify gaps.

## Acceptance Criteria

**AC1: Calendar month view rendering**
**Given** a learner navigates to the study history calendar
**When** the calendar renders
**Then** a month-view calendar is displayed for the current month
**And** days with recorded study sessions are visually highlighted (distinct background or dot indicator)
**And** days without study activity use the default styling

**AC2: Month navigation**
**Given** a learner wants to view a different month
**When** they use the previous/next month navigation controls
**Then** the calendar updates to show the selected month with correct study highlights

**AC3: Day detail with study sessions**
**Given** a learner sees a highlighted day on the calendar
**When** they click on that day
**Then** a detail panel or popover displays the study sessions for that date
**And** each session shows the course name, duration, and timestamp

**AC4: Empty day detail**
**Given** a learner clicks on a day with no study sessions
**When** the detail panel opens
**Then** it displays an empty state message such as "No study sessions on this day"

**AC5: Freeze day distinction**
**Given** the learner has configured freeze days (Story 5.2)
**When** the calendar renders
**Then** freeze days are visually distinguished from regular no-activity days (e.g., different color or icon)

**AC6: Mobile responsiveness**
**Given** the learner views the calendar on a mobile viewport
**When** the calendar renders
**Then** it remains usable with appropriately sized touch targets (minimum 44x44px)

## Tasks / Subtasks

- [ ] Task 1: Create StudyCalendar component with month-view grid (AC: 1)
  - [ ] 1.1 Calendar grid layout with day cells
  - [ ] 1.2 Highlight days with study sessions
  - [ ] 1.3 Default styling for inactive days
- [ ] Task 2: Month navigation controls (AC: 2)
  - [ ] 2.1 Previous/next month buttons
  - [ ] 2.2 Current month/year display
- [ ] Task 3: Day detail popover (AC: 3, 4)
  - [ ] 3.1 Popover with session list (course name, duration, timestamp)
  - [ ] 3.2 Empty state for days without sessions
- [ ] Task 4: Freeze day visual distinction (AC: 5)
  - [ ] 4.1 Query freeze days from streak store
  - [ ] 4.2 Visual indicator for freeze days
- [ ] Task 5: Responsive design (AC: 6)
  - [ ] 5.1 Mobile-friendly layout and touch targets
- [ ] Task 6: Integration — add calendar to Overview or Reports page

## Implementation Plan

See [plan](plans/e05-s04-study-history-calendar.md) for implementation approach.

## Implementation Notes

[Architecture decisions, patterns used, dependencies added]

## Testing Notes

[Test strategy, edge cases discovered, coverage notes]

## Design Review Feedback

[Populated by /review-story — Playwright MCP findings]

## Code Review Feedback

[Populated by /review-story — adversarial code review findings]

## Challenges and Lessons Learned

[Document issues, solutions, and patterns worth remembering]
