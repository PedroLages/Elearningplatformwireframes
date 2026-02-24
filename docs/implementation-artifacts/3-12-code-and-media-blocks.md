---
story_id: E03-S12
story_name: "Code & Media Blocks"
status: in-progress
started: 2026-02-24
completed:
reviewed: false
review_started:
review_gates_passed: []
---

# Story 3.12: Code & Media Blocks

## Story

As a learner,
I want syntax-highlighted code blocks, embedded images, and YouTube videos in my notes,
So that I can capture technical content and reference materials alongside my study notes.

## Acceptance Criteria

**AC1: Code blocks with syntax highlighting**
**Given** the user inserts a code block
**When** code is typed or pasted
**Then** syntax highlighting renders for the detected language
**And** a language selector dropdown appears in the top-right corner of the code block
**And** supported languages: JavaScript, TypeScript, Python, CSS, HTML, Bash (selective imports, ~25KB)

**AC2: Inline images via drag-and-drop**
**Given** the user drags an image file onto the editor
**When** the file is dropped
**Then** the image embeds inline as a block element
**And** accepted formats: PNG, JPG, GIF, WebP
**And** images are stored as base64 data URLs in the HTML content

**AC3: YouTube embeds**
**Given** the user inserts a YouTube URL via toolbar button or paste
**When** the URL is recognized as YouTube
**Then** a responsive YouTube embed renders inline
**And** the embed respects 16:9 aspect ratio

**AC4: Collapsible details blocks**
**Given** the user clicks the collapsible toggle button (or types `/toggle`)
**When** a Details block is inserted
**Then** a collapsible section renders with a summary line and hidden content
**And** clicking the summary toggles visibility

## Tasks / Subtasks

- [ ] Task 1: Install dependencies (AC: all)
  - [ ] 1.1 Install 8 tiptap extensions + lowlight
  - [ ] 1.2 Run npm dedupe and verify build
- [ ] Task 2: Code block with syntax highlighting (AC: 1)
  - [ ] 2.1 Create CodeBlockView.tsx with language selector dropdown
  - [ ] 2.2 Register CodeBlockLowlight extension in NoteEditor
  - [ ] 2.3 Add CSS syntax highlighting theme
- [ ] Task 3: Inline images (AC: 2)
  - [ ] 3.1 Register Image + FileHandler extensions
  - [ ] 3.2 Add toolbar button with file input
  - [ ] 3.3 Add CSS for image blocks
- [ ] Task 4: YouTube embeds (AC: 3)
  - [ ] 4.1 Register YouTube extension
  - [ ] 4.2 Add toolbar button with URL dialog
  - [ ] 4.3 Add CSS for responsive embeds
- [ ] Task 5: Collapsible details blocks (AC: 4)
  - [ ] 5.1 Register Details/DetailsContent/DetailsSummary extensions
  - [ ] 5.2 Add toolbar button
  - [ ] 5.3 Add CSS for toggle blocks
- [ ] Task 6: Toolbar reorganization (AC: all)
  - [ ] 6.1 Add Media group between Code and Link
  - [ ] 6.2 Update mobile overflow menu
- [ ] Task 7: Verification (AC: all)
  - [ ] 7.1 Build passes with no TypeScript errors
  - [ ] 7.2 E2E tests pass

## Implementation Notes

[Architecture decisions, patterns used, dependencies added]

## Testing Notes

[Test strategy, edge cases discovered, coverage notes]

## Design Review Feedback

[Populated by /review-story]

## Code Review Feedback

[Populated by /review-story]

## Challenges and Lessons Learned

[Document issues, solutions, and patterns worth remembering]

## Implementation Plan

See [plan](/Users/pedro/.claude/plans/keen-wibbling-steele.md) for implementation approach.
