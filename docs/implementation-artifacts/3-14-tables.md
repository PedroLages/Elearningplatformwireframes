---
story_id: E03-S14
story_name: "Tables"
status: in-progress
started: 2026-02-25
completed:
reviewed: false
review_started:
review_gates_passed: []
---

# Story 3.14: Tables

## Story

As a learner,
I want to create and edit tables in my notes,
So that I can organize structured data like comparisons, vocabulary lists, and reference information.

## Acceptance Criteria

**AC1**: Given the user clicks the Table button in the toolbar (or types `/table`)
When the table insert UI appears
Then a grid picker lets the user choose rows x columns (up to 6x6)
And a default 3x3 table is inserted on click

**AC2**: Given a table exists in the editor
When the user right-clicks a cell
Then options appear: Add Row Above, Add Row Below, Add Column Left, Add Column Right, Delete Row, Delete Column, Delete Table
And Tab moves between cells, Enter creates a new row at the end

## Tasks / Subtasks

- [ ] Task 1: Install `@tiptap/extension-table` (AC: 1, 2)
- [ ] Task 2: Add table CSS styles (AC: 1, 2)
- [ ] Task 3: Create TableGridPicker component (AC: 1)
- [ ] Task 4: Create TableContextMenu component (AC: 2)
- [ ] Task 5: Wire up NoteEditor.tsx (AC: 1, 2)
  - [ ] 5a: Imports and extension config
  - [ ] 5b: Toolbar button with grid picker
  - [ ] 5c: Mobile overflow menu item
  - [ ] 5d: Context menu wrapper around EditorContent
- [ ] Task 6: Add `/table` slash command (AC: 1)
- [ ] Task 7: E2E tests (AC: 1, 2)

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

## Implementation Plan

See [plan](../../.claude/plans/golden-stirring-truffle.md) for implementation approach.
