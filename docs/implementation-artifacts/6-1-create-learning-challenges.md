---
story_id: E06-S01
story_name: "Create Learning Challenges"
status: in-progress
started: 2026-03-07
completed:
reviewed: true
review_started: 2026-03-07
review_gates_passed: [build, lint, type-check, format-check, unit-tests, e2e-tests, design-review, code-review, code-review-testing]
---

# Story 6.1: Create Learning Challenges

## Story

As a learner,
I want to create custom learning challenges by specifying a name, type, target metric, and deadline,
So that I can set concrete goals that motivate me beyond daily streaks.

## Acceptance Criteria

**Given** the user navigates to the challenges section
**When** they open the "Create Challenge" form
**Then** the form displays fields for challenge name, challenge type, target value, and deadline

**Given** the create challenge form is open
**When** the user selects a challenge type
**Then** they can choose from three types: completion-based (videos completed), time-based (study hours), or streak-based (streak days)
**And** the target metric label updates to reflect the selected type (e.g., "videos", "hours", "days")

**Given** the user has filled in the challenge form
**When** they submit with a valid name (1-60 characters), a target value greater than zero, and a deadline in the future
**Then** the challenge is saved to IndexedDB with a unique ID, creation timestamp, and initial progress of zero
**And** a success toast confirms the challenge was created

**Given** the user submits the form with invalid inputs
**When** the name is empty, the target value is zero or negative, or the deadline is in the past
**Then** inline validation errors are shown for each invalid field
**And** the form is not submitted

**Given** a screen reader user interacts with the create challenge form
**When** they navigate through the fields
**Then** all inputs have associated labels, error messages are announced via aria-live, and the form is fully keyboard-navigable

## Tasks / Subtasks

- [ ] Task 1: Add Dexie schema for challenges table (AC: 3)
  - [ ] 1.1 Define Challenge interface/type
  - [ ] 1.2 Add challenges table to Dexie DB with auto-increment ID
  - [ ] 1.3 Create challenge store (Zustand) for UI state
- [ ] Task 2: Build Create Challenge form component (AC: 1, 2)
  - [ ] 2.1 Create form with name, type select, target input, deadline picker
  - [ ] 2.2 Dynamic label updates based on challenge type
  - [ ] 2.3 Wire up shadcn/ui form controls
- [ ] Task 3: Form validation (AC: 3, 4)
  - [ ] 3.1 Validate name (1-60 chars), target (> 0), deadline (future)
  - [ ] 3.2 Display inline validation errors
  - [ ] 3.3 Submit to IndexedDB on valid input
  - [ ] 3.4 Show success toast via Sonner
- [ ] Task 4: Accessibility (AC: 5)
  - [ ] 4.1 Associate labels with inputs
  - [ ] 4.2 aria-live regions for validation errors
  - [ ] 4.3 Full keyboard navigation
- [ ] Task 5: Route and navigation setup
  - [ ] 5.1 Add challenges page/route
  - [ ] 5.2 Add sidebar navigation entry

## Implementation Plan

See [plan](plans/e06-s01-create-learning-challenges.md) for implementation approach.

## Implementation Notes

[Architecture decisions, patterns used, dependencies added]

## Testing Notes

[Test strategy, edge cases discovered, coverage notes]

## Design Review Feedback

Report: `docs/reviews/design/design-review-2026-03-07-e06-s01.md`

**Blocker**: Dialog close button 16×16px on mobile (needs 44×44px touch target)
**High**: Button border-radius `rounded-md` vs standard `rounded-xl`; CTA buttons 36px tall (need 44px); no Cancel button in dialog footer; primary colour token near-black vs blue-600 (pre-existing)
**Medium**: Errors don't clear in real-time; empty-state button copy identical to header; no delete/edit actions (follow-up story)

## Code Review Feedback

Reports:
- `docs/reviews/code/code-review-2026-03-07-e06-s01.md`
- `docs/reviews/code/code-review-testing-2026-03-07-e06-s01.md`

**High (code)**: `deleteChallenge` silently swallows errors; deadline validation timezone bug (UTC vs local); no unit tests for store or dialog
**High (testing)**: AC3 doesn't verify IndexedDB fields; AC4 missing negative target test; AC5 aria-live assertion fragile; keyboard nav test incomplete; no challenges table CRUD tests
**Medium**: `h-N w-N` vs `size-N`; no `cn()` for conditional classes; StrictMode double-fetch; silent `.catch(() => {})`; no IndexedDB cleanup between tests

## Challenges and Lessons Learned

[Document issues, solutions, and patterns worth remembering]
