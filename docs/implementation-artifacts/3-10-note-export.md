---
story_id: E03-S10
story_name: "Note Export"
status: in-progress
started: 2026-03-01
completed:
reviewed: false
review_started:
review_gates_passed: []
---

# Story 3.10: Note Export

## Story

As a learner,
I want to export my notes as individual Markdown files with metadata,
So that I own my note data, can use it in other tools, and have portable backups of my learning knowledge.

## Acceptance Criteria

**Given** the user is on the Notes page or viewing course notes
**When** the user initiates a note export action
**Then** an export dialog presents options for exporting notes

**Given** the user selects notes to export (all notes, or notes for a specific course)
**When** the export executes
**Then** each note is exported as an individual Markdown file with YAML frontmatter containing: title (derived from course/video), course name, video/lesson title, tags, created date, and last updated date
**And** the export completes within 30 seconds regardless of volume (NFR63)

**Given** notes contain timestamps, images, or rich formatting
**When** exported as Markdown
**Then** timestamps are preserved as formatted links, images are included as base64 data URIs or referenced paths, and all TipTap formatting converts cleanly to standard Markdown

**Given** the user exports multiple notes
**When** the export completes
**Then** the files are bundled and downloaded (individual files or a ZIP archive depending on count)
**And** filenames are derived from course and video titles (sanitized for filesystem safety)

**Given** the user wants to verify export completeness
**When** the export finishes
**Then** a summary shows: number of notes exported, total size, and any notes that failed to export with reasons

## Tasks / Subtasks

- [ ] Task 1: Create note-to-Markdown conversion utility (AC: 2, 3)
  - [ ] 1.1 Convert TipTap HTML content to clean Markdown
  - [ ] 1.2 Generate YAML frontmatter from note metadata
  - [ ] 1.3 Handle timestamps, images, and rich formatting in conversion
- [ ] Task 2: Implement export orchestration (AC: 1, 4)
  - [ ] 2.1 Export single note function
  - [ ] 2.2 Export all notes / export by course
  - [ ] 2.3 ZIP bundling for multi-note exports
  - [ ] 2.4 Filename sanitization from course/video titles
- [ ] Task 3: Add export UI to Notes page (AC: 1, 5)
  - [ ] 3.1 Export button/menu on Notes page
  - [ ] 3.2 Export options dialog (all notes vs course-specific)
  - [ ] 3.3 Export progress and completion summary
- [ ] Task 4: Add export from course notes context (AC: 1)
  - [ ] 4.1 Export button on CourseNotesTab for course-specific export

## Implementation Notes

[Architecture decisions, patterns used, dependencies added]

## Testing Notes

[Test strategy, edge cases discovered, coverage notes]

## Design Review Feedback

[Populated by /review-story — Playwright MCP findings]

## Code Review Feedback

[Populated by /review-story — adversarial code review findings]

## Implementation Plan

See [plan](.claude/plans/serene-herding-goose.md) for implementation approach.

## Challenges and Lessons Learned

[Document issues, solutions, and patterns worth remembering]
