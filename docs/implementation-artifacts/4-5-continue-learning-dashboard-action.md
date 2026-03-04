---
story_id: E04-S05
story_name: "Continue Learning Dashboard Action"
status: in-progress
started: 2026-03-04
completed:
reviewed: false
review_started:
review_gates_passed: []
---

# Story 4.5: Continue Learning Dashboard Action

## Story

As a learner,
I want a prominent "Continue Learning" action on the dashboard that resumes my last study session,
so that I can pick up exactly where I left off within one click of launching the app.

## Acceptance Criteria

**Given** a user has at least one previous study session
**When** they land on the Overview (dashboard) page
**Then** a "Continue Learning" card is prominently displayed near the top of the page
**And** the card shows: course title, video/chapter title, a thumbnail or icon, and a progress indicator showing how far through the content they are

**Given** the "Continue Learning" card is displayed
**When** the user clicks the "Continue Learning" action
**Then** the app navigates directly to the course content interface, loads the exact video or chapter, and resumes playback at the last known position
**And** the transition from click to content ready takes less than 1 second (NFR17)

**Given** a user has sessions across multiple courses
**When** the dashboard renders
**Then** the "Continue Learning" card shows the most recently active session
**And** optionally, a secondary row or carousel shows other recently accessed courses for quick access

**Given** a user has never started any course
**When** they land on the dashboard
**Then** the "Continue Learning" section displays a discovery state suggesting courses to start
**And** no broken or empty card is shown

**Given** a user clicks "Continue Learning"
**When** the target course or content item has been deleted or is no longer available
**Then** a graceful fallback message is displayed explaining the content is unavailable
**And** the user is offered alternative courses or redirected to the Courses page

**Given** the dashboard is rendered on a mobile viewport
**When** the "Continue Learning" card is visible
**Then** the card is fully responsive with touch-friendly tap targets (minimum 44x44px)
**And** the card maintains its prominence as the first actionable element on the page

## Tasks / Subtasks

- [ ] Task 1: Query latest session data from session store (AC: 1, 3)
- [ ] Task 2: Build ContinueLearning card component with course info and progress (AC: 1, 6)
- [ ] Task 3: Implement navigation to resume playback at last position (AC: 2)
- [ ] Task 4: Add recently accessed courses row (AC: 3)
- [ ] Task 5: Handle empty state — no sessions yet (AC: 4)
- [ ] Task 6: Handle deleted/unavailable content gracefully (AC: 5)
- [ ] Task 7: Integrate into Overview page as first actionable section (AC: 1, 6)

## Implementation Notes

[Architecture decisions, patterns used, dependencies added]

## Testing Notes

[Test strategy, edge cases discovered, coverage notes]

## Design Review Feedback

[Populated by /review-story — Playwright MCP findings]

## Code Review Feedback

[Populated by /review-story — adversarial code review findings]

## Implementation Plan

See [plan](plans/e04-s05-continue-learning.md) for implementation approach.

## Challenges and Lessons Learned

[Document issues, solutions, and patterns worth remembering]
