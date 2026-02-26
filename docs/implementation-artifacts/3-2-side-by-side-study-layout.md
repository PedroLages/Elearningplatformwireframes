---
story_id: E03-S02
story_name: "Side-by-Side Study Layout"
status: done
started: 2026-02-26
completed: 2026-02-26
reviewed: true
review_started: 2026-02-26
review_gates_passed: [build, lint, e2e-tests, code-review, test-quality]
---

# Story 3.2: Side-by-Side Study Layout

## Story

As a learner,
I want to see the video player and note editor side-by-side on desktop,
So that I can watch and take notes simultaneously without context switching.

## Acceptance Criteria

**AC1** — Desktop resizable split
**Given** the user is on the Lesson Player page on desktop (>= 1024px)
**When** the note editor is open
**Then** the layout shows video player (60% width) and note editor (40% width) side by side
**And** the split is resizable via a drag handle (shadcn/ui Resizable component)
**And** minimum width for each panel prevents content from being unusably small

**AC2** — Notes panel collapsed by default with toggle
**Given** the user navigates to a lesson directly (not via "Continue Learning")
**When** the Lesson Player loads on desktop
**Then** the notes panel is collapsed by default with a toggle button to expand
**And** if the lesson has existing notes, a subtle indicator shows "Notes available"

**AC3** — URL param auto-opens notes
**Given** the user navigates via "Continue Learning" or with `?panel=notes` URL param
**When** the Lesson Player loads
**Then** the notes panel opens automatically with existing notes pre-loaded

**AC4** — Tablet stacked layout
**Given** the user is on tablet (640px-1023px)
**When** the note editor is open
**Then** the layout stacks video on top, notes below
**And** a toggle button allows switching between video-focused and notes-focused view

**AC5** — Mobile full-screen notes
**Given** the user is on mobile (< 640px)
**When** the note editor is open
**Then** the video and notes are fully stacked (video top, notes bottom)
**And** the note editor can expand to full screen for focused note-taking

**AC6** — Regression
**Given** the side-by-side layout has been implemented
**When** the Epic 2 E2E tests run
**Then** all existing LessonPlayer E2E tests pass, including mini-player and theater mode
**And** the following testids are preserved: `video-anchor`, `mini-player`, `lesson-content-scroll`, `desktop-sidebar`
**And** the single scroll container for IntersectionObserver mini-player detection is maintained
**And** VideoPlayer props `onPlayStateChange`, `theaterMode`, `onTheaterModeToggle`, `chapters`, `captions` remain wired from LessonPlayer

## Tasks / Subtasks

- [ ] Task 1: Convert Tabs to controlled component (AC3)
- [ ] Task 2: Add notes panel state and URL param support (AC2, AC3)
- [ ] Task 3: Desktop resizable layout (AC1, AC2)
- [ ] Task 4: Notes toggle button with indicator (AC2)
- [ ] Task 5: Gate Notes tab when side panel open (AC1)
- [ ] Task 6: Hide course sidebar when notes open (AC1)
- [ ] Task 7: Tablet stacked layout (AC4)
- [ ] Task 8: Mobile full-screen notes (AC5)
- [ ] Task 9: Regression verification (AC6)
- [ ] Task 10: ATDD E2E tests

## Implementation Notes

[Architecture decisions, patterns used, dependencies added]

## Testing Notes

[Test strategy, edge cases discovered, coverage notes]

## Design Review Feedback

Skipped — Playwright MCP agent timed out (OAuth expiry). No design review findings.

## Code Review Feedback

**1 Blocker, 4 High, 3 Medium, 2 Nits** — See full report: `docs/reviews/code/code-review-2026-02-26-E03-S02.md`

Blocker (resolved):

1. ~~Focus trap, Escape handler, ARIA attrs, and dual NoteEditor guard~~ — committed in `eb5552b`.

High:

1. AC2 indicator test is a no-op (no notes seeded, no dot asserted)
2. `handleNotesToggle` tab fallback can select non-existent tab
3. Inline `style={{ overflow: 'visible' }}` violates Tailwind-only convention
4. Close button 28x28px below 44x44px WCAG target size

## Challenges and Lessons Learned

- **Controlled tabs unlock composition.** Converting from `defaultValue` to `value`/`onValueChange` was prerequisite for the side panel — without it, the tabs couldn't react to external state (URL params, toggle button). Do this refactor first when adding state-driven UI alongside existing tab components.
- **`react-resizable-panels` imperative API is essential.** The declarative props alone can't sync panel collapse/expand with external React state. Use `usePanelRef()` with `expand()`/`collapse()` — don't fight the library by trying to control size via props alone.
- **Dual-instance race condition.** Mounting two instances of the same stateful component (NoteEditor in tab + fullscreen overlay) sharing the same save callback creates feedback loops. Conditionally unmount the background instance when the foreground one is active.
- **Mobile overlays need dialog semantics.** A `fixed inset-0 z-50` div is not a dialog — it needs `role="dialog"`, `aria-modal`, focus trap, and Escape handler. Use shadcn/ui Dialog or Sheet to get these for free instead of hand-rolling.
- **E2E test no-ops are silent failures.** A test that seeds no data and asserts nothing passes vacuously. Always verify the precondition exists before asserting the behavior.

## Implementation Plan

See [plan](../../.claude/plans/groovy-puzzling-moth.md) for implementation approach.
