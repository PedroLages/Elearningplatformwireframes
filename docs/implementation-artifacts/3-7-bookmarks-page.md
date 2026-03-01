---
story_id: E03-S07
story_name: "Bookmarks Page"
status: in-progress
started: 2026-03-01
completed:
reviewed: false
review_started:
review_gates_passed: []
---

# Story 3.7: Bookmarks Page

## Story

As a learner,
I want to view and manage all my video bookmarks in one place,
So that I can quickly return to important sections across all my courses.

## Acceptance Criteria

**Given** the user has created bookmarks
**When** the user navigates to the Bookmarks page
**Then** all bookmarks are listed with: course title, video title, timestamp, and date created
**And** bookmarks are sorted by most recent first

**Given** a bookmark entry is displayed
**When** the user clicks on it
**Then** the system navigates to the course player, loads the video, and seeks to the bookmarked timestamp
**And** playback resumes from that position

**Given** a bookmark exists for a video
**When** the user is watching that video and the playback position passes a bookmarked timestamp
**Then** a subtle visual indicator appears on the seek bar at the bookmark position

**Given** the user wants to remove a bookmark
**When** the user clicks the delete/remove action on a bookmark
**Then** a confirmation dialog appears (NFR23 — destructive actions require confirmation)
**And** upon confirmation, the bookmark is removed

## Tasks / Subtasks

- [ ] Task 1: Create Bookmarks page component with route registration (AC: 1)
  - [ ] 1.1 Add `/bookmarks` or `/library` route entry in routes.tsx
  - [ ] 1.2 Create BookmarksPage component with layout structure
- [ ] Task 2: Display bookmarks list with course/video context (AC: 1)
  - [ ] 2.1 Query bookmark data from Dexie store with course/video joins
  - [ ] 2.2 Render bookmark cards with course title, video title, timestamp, date
  - [ ] 2.3 Sort by most recently created
- [ ] Task 3: Bookmark navigation to video player (AC: 2)
  - [ ] 3.1 Click handler that navigates to lesson player at bookmark timestamp
  - [ ] 3.2 Pass timestamp via URL params or state for auto-seek
- [ ] Task 4: Seek bar bookmark indicators (AC: 3)
  - [ ] 4.1 Query bookmarks for current video in lesson player
  - [ ] 4.2 Render visual markers on the video seek bar at bookmark positions
- [ ] Task 5: Delete bookmarks with confirmation (AC: 4)
  - [ ] 5.1 Delete button on each bookmark entry
  - [ ] 5.2 Confirmation dialog using AlertDialog component
  - [ ] 5.3 Remove bookmark from Dexie store on confirmation

## Implementation Notes

[Architecture decisions, patterns used, dependencies added]

## Testing Notes

[Test strategy, edge cases discovered, coverage notes]

## Design Review Feedback

[Populated by /review-story — Playwright MCP findings]

## Code Review Feedback

[Populated by /review-story — adversarial code review findings]

## Implementation Plan

See [plan](.claude/plans/snuggly-wishing-swan.md) for implementation approach.

## Challenges and Lessons Learned

[Document issues, solutions, and patterns worth remembering]
