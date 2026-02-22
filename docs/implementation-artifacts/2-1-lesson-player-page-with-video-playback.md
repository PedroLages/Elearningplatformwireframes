---
story_id: E02-S01
story_name: "Lesson Player Page with Video Playback"
status: done
created: 2026-02-15
started: 2026-02-15
completed: 2026-02-22
reviewed: true
review_started: 2026-02-22
review_gates_passed: [build, lint, unit-tests, e2e-tests, design-review, code-review]
epic: 2
story_num: 1
---

# Story 2.1: Lesson Player Page with Video Playback

Status: in-progress

## Story

As a learner,
I want to open a course video from my imported courses in a dedicated Lesson Player and watch it with standard playback controls,
so that I can consume course content in a focused, distraction-free environment.

## Acceptance Criteria

### AC-1: Video Playback from Imported Course

**Given** the user selects a video from an imported course
**When** the Lesson Player page loads
**Then** the video renders using a blob URL created from the stored FileSystemFileHandle
**And** the player displays the video title and course name in the header
**And** the interface is optimized for minimal distractions (clean layout, no sidebar clutter)
**And** the video starts in paused state, ready for the user to begin

### AC-2: File Access Error Recovery

**Given** the video file cannot be accessed (moved/deleted/permission denied)
**When** the Lesson Player attempts to load the file
**Then** the system displays an error state: "Video file not found. Would you like to locate it?"
**And** provides a file picker button to re-locate the file
**And** provides a "Back to Course" button
**And** does not crash or leave the page in a broken state

### AC-3: File Permission Re-request

**Given** the FileSystemFileHandle is stored in IndexedDB from a previous session
**When** the browser has lost the read permission grant
**Then** the system calls `handle.requestPermission({ mode: 'read' })` with a user-facing prompt
**And** on permission granted, the video loads normally
**And** on permission denied, the error state from AC-2 is shown

### AC-4: Course Detail Page for Imported Courses

**Given** the user clicks on an imported course card in the Courses page
**When** the imported course detail page loads
**Then** all videos and PDFs in the course are listed with filename, duration (videos), and page count (PDFs)
**And** each item is clickable, navigating to the Lesson Player
**And** a "Back to Courses" link is visible

### AC-5: Responsive Layout

**Given** the user is on a mobile viewport (< 640px)
**When** the Lesson Player loads
**Then** the video player takes full width with controls below
**And** touch targets for controls are >= 44x44px

### AC-6: Blob URL Cleanup

**Given** a blob URL was created for video playback
**When** the user navigates away or the component unmounts
**Then** `URL.revokeObjectURL()` is called to release the memory reference

## Tasks / Subtasks

- [ ] Task 1: Add Dexie v3 schema migration with `progress` and `bookmarks` tables (AC: all — foundational)
  - [ ] 1.1 Define `progress` table: `[courseId+videoId], courseId, videoId, currentTime, completionPercentage, completedAt`
  - [ ] 1.2 Define `bookmarks` table: `id, courseId, lessonId, timestamp, createdAt`
  - [ ] 1.3 Write `upgrade()` callback (no backfill needed — new tables)
  - [ ] 1.4 Add TypeScript types: `VideoProgress`, `VideoBookmark` to `src/data/types.ts`
- [ ] Task 2: Create `useVideoFromHandle` hook for blob URL lifecycle management (AC: 1, 2, 3, 6)
  - [ ] 2.1 Accept `FileSystemFileHandle | null`, return `{ blobUrl, error, loading }`
  - [ ] 2.2 Check/request permission via `queryPermission` / `requestPermission`
  - [ ] 2.3 Create blob URL via `URL.createObjectURL(file)`
  - [ ] 2.4 Revoke blob URL on unmount or source change via cleanup function
  - [ ] 2.5 Handle errors: permission denied, file not found, general I/O errors
- [ ] Task 3: Create `ImportedCourseDetail` page component (AC: 4)
  - [ ] 3.1 Route: `/imported-courses/:courseId` — add to `src/app/routes.tsx`
  - [ ] 3.2 Load course from `useCourseImportStore` by ID
  - [ ] 3.3 Load videos from `db.importedVideos.where('courseId').equals(id)` sorted by `order`
  - [ ] 3.4 Load PDFs from `db.importedPdfs.where('courseId').equals(id)`
  - [ ] 3.5 Display list with filename, duration/page count, type icon (video/PDF)
  - [ ] 3.6 Each item links to `/imported-courses/:courseId/lessons/:videoId`
  - [ ] 3.7 Back to Courses link
- [ ] Task 4: Create `ImportedLessonPlayer` page component (AC: 1, 2, 3, 5, 6)
  - [ ] 4.1 Route: `/imported-courses/:courseId/lessons/:lessonId` — add to `src/app/routes.tsx`
  - [ ] 4.2 Load video record from `db.importedVideos.get(lessonId)`
  - [ ] 4.3 Use `useVideoFromHandle` hook with `video.fileHandle`
  - [ ] 4.4 Render existing `VideoPlayer` component with `blobUrl` as `src`
  - [ ] 4.5 Display course name + video title in header
  - [ ] 4.6 Error state component with "Locate File" and "Back to Course" actions
  - [ ] 4.7 "Locate File" uses `showOpenFilePicker()` to let user re-select the file
- [ ] Task 5: Wire up navigation from `ImportedCourseCard` to `ImportedCourseDetail` (AC: 4)
  - [ ] 5.1 Make entire card clickable, navigating to `/imported-courses/:courseId`
  - [ ] 5.2 Preserve existing tag editing and status dropdown functionality (don't break)
- [ ] Task 6: Write unit tests (AC: all)
  - [ ] 6.1 `useVideoFromHandle` hook tests: happy path, permission denied, file not found, cleanup
  - [ ] 6.2 `ImportedCourseDetail` tests: renders video/PDF list, navigation links, empty state
  - [ ] 6.3 `ImportedLessonPlayer` tests: renders VideoPlayer with blob URL, error state, back navigation
  - [ ] 6.4 Dexie v3 migration test: new tables exist, no data loss on existing tables
  - [ ] 6.5 Navigation tests: card click navigates to detail, video click navigates to player

## Dev Notes

### Architecture Override: No react-player

The architecture document specifies `react-player v3.4.0`. **Do NOT use react-player.** The library spike (2026-02-15) confirmed:
- The existing `VideoPlayer.tsx` already uses native `<video>` with comprehensive custom controls
- react-player would just wrap the same `<video>` element for blob URLs — zero added value
- Existing VideoPlayer already has: keyboard shortcuts, WCAG-compliant ARIA, bookmarks, captions, speed control, `prefers-reduced-motion` support
- Adding react-player would increase bundle by ~45KB with no benefit

**Use the existing `VideoPlayer` component directly** by passing the blob URL as the `src` prop.

### Routing Strategy: Separate Routes for Imported Courses

Use separate routes for imported courses to avoid breaking the existing static course system:
- `/imported-courses/:courseId` — ImportedCourseDetail
- `/imported-courses/:courseId/lessons/:lessonId` — ImportedLessonPlayer

Do NOT modify the existing `/courses/:courseId/:lessonId` route — it serves static courses and must continue working.

### Blob URL Lifecycle

The `useVideoFromHandle` hook manages the full lifecycle:
1. Check permission → request if needed
2. `handle.getFile()` → `URL.createObjectURL(file)`
3. Cleanup: `URL.revokeObjectURL(url)` on unmount or handle change

Key details:
- `URL.createObjectURL()` does NOT load the entire file into memory — it creates a reference
- The browser streams video content from disk on demand
- Always revoke on unmount to prevent memory leaks
- `FileSystemFileHandle.getFile()` returns a snapshot — if the file is modified on disk after `getFile()`, the `File` becomes unreadable

### Dexie v3 Migration

Add two new tables for Epic 2. No backfill needed since these are new tables:

```typescript
db.version(3).stores({
  importedCourses: 'id, name, importedAt, status, *tags',
  importedVideos: 'id, courseId, filename',
  importedPdfs: 'id, courseId, filename',
  progress: '[courseId+videoId], courseId, videoId',
  bookmarks: 'id, courseId, lessonId, createdAt',
})
```

The compound index `[courseId+videoId]` on `progress` enables efficient lookups for "get progress for this specific video" queries.

### Existing Components to Reuse

| Component | Location | Usage |
|-----------|----------|-------|
| `VideoPlayer` | `src/app/components/figma/VideoPlayer.tsx` | Video playback with controls |
| `Button` | `src/app/components/ui/button.tsx` | Action buttons |
| `Card` | `src/app/components/ui/card.tsx` | Course detail cards |
| `Badge` | `src/app/components/ui/badge.tsx` | File type badges |
| `useCourseImportStore` | `src/stores/useCourseImportStore.ts` | Course data |

### File Not Found Recovery

When a file can't be accessed, provide two recovery paths:
1. **Locate File** — opens `showOpenFilePicker()` to let user re-select the video file. Update the `fileHandle` in IndexedDB.
2. **Back to Course** — navigates to the course detail page

### Project Structure Notes

New files to create:
- `src/app/pages/ImportedCourseDetail.tsx` — Course detail page for imported courses
- `src/app/pages/ImportedLessonPlayer.tsx` — Lesson player for imported course videos
- `src/hooks/useVideoFromHandle.ts` — Blob URL lifecycle hook
- `src/app/pages/__tests__/ImportedCourseDetail.test.tsx`
- `src/app/pages/__tests__/ImportedLessonPlayer.test.tsx`
- `src/hooks/__tests__/useVideoFromHandle.test.ts`

Files to modify:
- `src/db/schema.ts` — Add v3 migration with progress and bookmarks tables
- `src/data/types.ts` — Add VideoProgress and VideoBookmark types
- `src/app/routes.tsx` — Add imported course routes
- `src/app/components/figma/ImportedCourseCard.tsx` — Make clickable with navigation

Alignment: All new files follow existing conventions (`src/app/pages/` for pages, `src/hooks/` for hooks, `src/data/types.ts` for types, `src/db/schema.ts` for Dexie schema).

### References

- [Source: docs/planning-artifacts/epics.md#Story 2.1] — AC and technical notes
- [Source: docs/planning-artifacts/architecture.md#Video Player] — react-player decision (overridden by spike)
- [Source: docs/project-context.md#File System Access API] — Permission handling pattern
- [Source: docs/project-context.md#Dexie.js Schema Migrations] — upgrade() pattern
- [Source: docs/project-context.md#Blob URL Lifecycle] — Create/revoke pattern
- [Source: docs/implementation-artifacts/epic-1-retro-2026-02-15.md] — Lessons learned from Epic 1

### Previous Story Intelligence (Epic 1)

Key learnings from Epic 1 that apply to this story:

1. **Use individual Zustand selectors** — never destructure the full store (caused N re-renders in Stories 1.3/1.4)
2. **Lift computed values** — if loading video list, compute in parent, pass as props
3. **Test every store action** — happy path + error/rollback + edge cases (flagged in every code review)
4. **Include hover, focus, active, disabled states** on all interactive elements (flagged as critical in Story 1.2)
5. **Cross-reference exact tokens** against AC (gray-500 vs gray-400 caught by design review in Story 1.4)
6. **Don't mark tasks complete without verifying** — Story 1.2 had 3 critical findings where tasks were marked done but not implemented
7. **Test factory duplication** — use inline `makeVideo()` factories for now, shared factories deferred

### Testing Standards

- **Hook tests**: Test `useVideoFromHandle` with `renderHook` from `@testing-library/react`
- **Component tests**: Use `@testing-library/react` + `userEvent`, mock Dexie queries
- **Store tests**: Use `fake-indexeddb` for Dexie.js
- **Schema tests**: Verify v3 migration creates tables, v2 data preserved
- **Navigation tests**: Verify `useNavigate` called with correct paths
- All tests must include keyboard navigation and ARIA assertions

## Implementation Plan

See [plan](/Users/pedro/.claude/plans/agile-forging-gem.md) for implementation approach.

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### Challenges and Lessons Learned

1. **Always create a feature branch before starting work.** E02-S01 was implemented directly on `main`, requiring a retroactive branch + reset to create a proper PR. Added friction to the shipping process.
2. **`<button>` inside `<a>` is invalid HTML.** Screen readers merge the accessible names, keyboard users get duplicate interaction targets. The fix — wrapping cards in `<article tabIndex={0}>` with `onKeyDown` navigation — works but requires `e.target === e.currentTarget` guards to prevent double-firing on nested interactive elements.
3. **Cancellation guards on async queries are essential.** Both `ImportedCourseDetail` and `ImportedLessonPlayer` had race conditions where Dexie queries could update unmounted components. The `let cancelled = false` + cleanup pattern should be standard for any `useEffect` with async data fetching.
4. **`formatDuration` was duplicated six times.** Extract shared utilities to `src/lib/format.ts` early. The code review flagged this — a shared utility would have saved review cycles.
5. **E2E tests that assert on non-existent testids pass trivially.** Playwright's `.not.toBeVisible()` returns true for elements that don't exist in the DOM. Always verify the testid exists in source before writing assertions against it.
6. **Touch target compliance (44x44px) requires deliberate padding.** Default shadcn button sizes (`h-10` = 40px) fall short. Use `p-3` or larger padding on icon-only buttons to reach WCAG 2.5.5 minimum.

### File List

## Design Review Feedback

**Report**: [docs/reviews/design/design-review-2026-02-22-e02-s01.md](../reviews/design/design-review-2026-02-22-e02-s01.md)
**Date**: 2026-02-22

**Blockers (1)**:
- `<button>` inside `<a>` in `CourseCard.tsx` (library/overview variants) — invalid HTML per spec; screen readers merge link and button accessible names

**High Priority (5)**:
- Hardcoded `#2563eb` in `ImportedCourseCard.tsx:298` → use `group-hover:text-brand`
- Back arrow link only 16×16px in `ImportedLessonPlayer` → needs `p-3` padding wrapper
- Error state buttons 36px tall → add `size="lg"` or `h-11`
- `aria-label="Back"` too vague → restore `"Back to course"`
- Error state `<h2>` with no `<h1>` → promote to `<h1>`

## Code Review Feedback

**Report**: [docs/reviews/code/code-review-2026-02-22-e02-s01.md](../reviews/code/code-review-2026-02-22-e02-s01.md)
**Date**: 2026-02-22

**High Priority (3)**:
- No cancellation guard on Dexie queries in `ImportedCourseDetail` and `ImportedLessonPlayer` → add `cancelled` flag pattern
- No `.catch()` handlers on Dexie queries → silent failures leave component in permanent loading state
- `useVideoFromHandle` called unconditionally twice per card → 2N unnecessary state updates on Courses page

**Medium Priority (4)**:
- `formatDuration` doesn't handle ≥ 3600s (1-hour videos) → extract shared `formatTime` utility
- Hardcoded `#2563eb` in `ImportedCourseCard.tsx:298` → `group-hover:text-brand`
- Sidebar E2E assertion trivially passes (testid doesn't exist in DOM)
- `aria-label="Back"` too vague (WCAG 2.4.9)
