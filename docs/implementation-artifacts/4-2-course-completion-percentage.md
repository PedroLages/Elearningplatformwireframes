---
story_id: E04-S02
story_name: "Course Completion Percentage"
status: in-progress
started: 2026-03-03
completed:
reviewed: false
review_started:
review_gates_passed: []
---

# Story 4.2: Course Completion Percentage

## Story

As a learner,
I want to see an accurate completion percentage for each course based on my content progress,
So that I can understand how far I am through each course and prioritize my study time.

## Acceptance Criteria

**Given** a course contains multiple content items with completion statuses
**When** the course card or course detail page renders
**Then** a progress bar displays the completion percentage calculated as (Completed items / Total items) x 100
**And** the progress bar uses `role="progressbar"` with `aria-valuenow`, `aria-valuemin="0"`, and `aria-valuemax="100"` attributes
**And** a text equivalent (e.g., "65% complete") is visible alongside the progress bar

**Given** a user marks a content item as Completed
**When** the completion status changes
**Then** the course completion percentage recalculates and updates in real-time without requiring a page refresh
**And** the progress bar animates smoothly to the new value

**Given** a course has zero content items marked as Completed
**When** the progress bar renders
**Then** the progress bar shows 0% with an empty state
**And** the aria-valuenow attribute is set to 0

**Given** a course has all content items marked as Completed
**When** the progress bar renders
**Then** the progress bar shows 100% with a full/completed visual state
**And** the course card displays a completion badge or indicator

**Given** a user is browsing the course library
**When** multiple course cards are visible
**Then** each card displays its individual completion percentage progress bar
**And** progress bars are consistent in size, position, and styling across all cards

## Tasks / Subtasks

- [ ] Task 1: Create course completion calculation utility (AC: 1, 2, 3, 4)
  - [ ] 1.1 Add `calculateCourseCompletion` function in stores/completionStore.ts
  - [ ] 1.2 Add Zustand selector to get course completion percentage
  - [ ] 1.3 Handle edge cases (no items, all completed, zero completed)

- [ ] Task 2: Create accessible ProgressBar component (AC: 1)
  - [ ] 2.1 Create ProgressBar.tsx with ARIA attributes
  - [ ] 2.2 Add smooth animation with CSS transitions
  - [ ] 2.3 Add text equivalent display (e.g., "65% complete")

- [ ] Task 3: Integrate progress bars in course cards (AC: 5)
  - [ ] 3.1 Update CourseCard component to display progress
  - [ ] 3.2 Ensure consistent styling across all cards
  - [ ] 3.3 Add completion badge for 100% completed courses

- [ ] Task 4: Integrate progress bar in CourseDetail page (AC: 1, 4)
  - [ ] 4.1 Add progress bar to course header
  - [ ] 4.2 Ensure real-time updates when completion changes

## Implementation Plan

See [plan](.claude/plans/generic-snuggling-lightning.md) for implementation approach.

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
