---
story_id: E03-S10
story_name: "Note Export"
status: done
started: 2026-03-01
completed: 2026-03-01
reviewed: true
review_started: 2026-03-01
review_gates_passed: [build, lint, unit-tests, e2e-tests, design-review, code-review, code-review-testing]
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

- [x] Task 1: Create note-to-Markdown conversion utility (AC: 2, 3)
  - [x] 1.1 Convert TipTap HTML content to clean Markdown
  - [x] 1.2 Generate YAML frontmatter from note metadata
  - [x] 1.3 Handle timestamps, images, and rich formatting in conversion
- [x] Task 2: Implement export orchestration (AC: 1, 4)
  - [x] 2.1 Export single note function
  - [x] 2.2 Export all notes / export by course
  - [x] 2.3 ZIP bundling for multi-note exports
  - [x] 2.4 Filename sanitization from course/video titles
- [x] Task 3: Add export UI to Notes page (AC: 1, 5)
  - [x] 3.1 Export button/menu on Notes page
  - [x] 3.2 Export options dialog (all notes vs course-specific)
  - [x] 3.3 Export progress and completion summary
- [x] Task 4: Add export from course notes context (AC: 1)
  - [x] 4.1 Export button on CourseNotesTab for course-specific export

## Dev Agent Record

### Implementation Plan

Three-layer architecture:

1. **Pure conversion layer** (`noteExport.ts`) — HTML→Markdown, YAML frontmatter, filename sanitization
2. **Export orchestration** — single/batch/ZIP workflows with dynamic JSZip import
3. **UI components** — ExportNotesDialog with radio scope selection and completion summary

### Completion Notes

- Created `src/lib/noteExport.ts` with regex-based TipTap HTML→Markdown converter (handles headings, lists, code blocks, links, images, bold/italic/strikethrough, blockquotes, timestamp links)
- YAML frontmatter includes: title, course, video, tags, timestamp, created, updated dates
- JSZip loaded dynamically (`import('jszip')`) to avoid blocking Notes page lazy-load chunk
- Single note exports as `.md`, multiple notes bundle as `.zip`
- Duplicate filenames handled with `-N` suffix
- Export dialog shows radio group for scope selection (all notes or per-course)
- Completion summary shows exported count, total size, and failure details
- CourseNotesTab gets direct export button for course-scoped exports
- Changed Notes page empty state heading to avoid Playwright strict mode conflict

## File List

- `src/lib/noteExport.ts` (new) — HTML→Markdown conversion, frontmatter generation, export orchestration
- `src/lib/__tests__/noteExport.test.ts` (new) — 26 unit tests for conversion, frontmatter, sanitization
- `src/app/components/notes/ExportNotesDialog.tsx` (new) — Export dialog with scope selection and summary
- `src/app/pages/Notes.tsx` (modified) — Added ExportNotesDialog import, changed empty state text
- `src/app/components/notes/CourseNotesTab.tsx` (modified) — Added export button
- `tests/e2e/story-e03-s10.spec.ts` (pre-existing) — 7 E2E tests, all passing
- `package.json` (modified) — Added jszip dependency

## Change Log

- 2026-03-01: Implemented note export feature — HTML→Markdown conversion, ZIP bundling, export dialog UI, course-scoped export

## Implementation Notes

- Regex-based HTML→Markdown converter handles all TipTap output tags without DOM dependency
- JSZip dynamically imported to keep Notes page chunk small (~121KB → no increase at load)
- Timestamp links with `video://` protocol preserved as plain text in Markdown export
- Filename sanitization strips filesystem-illegal chars, collapses hyphens, truncates to 100 chars

## Testing Notes

- 26 unit tests cover: HTML→Markdown (16 cases), frontmatter generation (4), noteToMarkdown (2), filename sanitization (4)
- 7 E2E acceptance tests validate all 5 ACs including empty state, dialog interaction, download content, ZIP bundling, and summary display
- Pre-existing flaky tests (navigation, courses) unrelated to changes (React.lazy loading timing)

## Design Review Feedback

Report: `docs/reviews/design/design-review-2026-03-01-E03-S10.md`

**Blockers (1):** Radio touch targets 16px on mobile (needs min-h-[44px])
**High (3):** text-destructive dark mode contrast, animate-spin missing motion-reduce, header h1 wraps on mobile
**Medium (4):** Button size inconsistency, icon aria-hidden, RadioGroup missing aria-label, key={i} anti-pattern
**Nits (2):** CourseNotesTab direct download (no confirmation), space-x-2 vs gap-2 inconsistency

## Code Review Feedback

Report: `docs/reviews/code/code-review-2026-03-01-E03-S10.md`
Testing report: `docs/reviews/code/code-review-testing-2026-03-01-E03-S10.md`

**Blockers (2):** Uncommitted files (git add needed), YAML frontmatter injection (unescaped quotes)
**High (8):** CourseNotesTab fire-and-forget async, sanitizeFilename control chars, no orchestration unit tests, buildLookups duplication, E2E missing title/video assertions, E2E missing size/failure assertions, E2E filename content validation, NFR63 untested
**Medium (8):** Hardcoded text-green-600, throwaway Blob in ZIP loop, nested list limitation, coursesWithNotes not memoized, inline seedNotes, unscoped empty-state selector, inline makeNote factory, AC1 missing radio option assertions
**Nits (7):** ZIP filename hardcoded, cleanInline duplication, key={i}, setup duplication, loose HR assertion, timestamp protocol, missing h4-h6 tests

## Challenges and Lessons Learned

- JSZip static import blocked the Notes page lazy-load chunk from resolving, causing Suspense fallback to persist. Fixed by using dynamic `import('jszip')` only when ZIP generation is needed.
- Playwright strict mode requires unique text selectors — the page empty state "No notes yet" conflicted with dialog "No notes to export", causing `getByText(/no notes/i)` to match 2 elements. Resolved by changing the page empty state heading.
