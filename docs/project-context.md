# Project Context - LevelUp E-Learning Platform

Concise rules and patterns for AI agents implementing code. Read this before writing any code.

## Architecture Overview

- **Brownfield project**: Existing static course system (`Course`/`Module`/`Lesson` in `src/data/`) coexists with new imported course system (`ImportedCourse`/`ImportedVideo`/`ImportedPdf` in IndexedDB). Do not modify static course types or data.
- **Data layer**: Dexie.js v4 (IndexedDB) for persistence + Zustand v5 for reactive state
- **File access**: Chrome/Edge File System Access API — `FileSystemFileHandle` stored in IndexedDB for re-access
- **No backend**: All data local to browser. No authentication.

## Critical Rules

### Zustand Store Selectors

**ALWAYS** use individual selectors. **NEVER** destructure the full store.

```typescript
// CORRECT
const importedCourses = useCourseImportStore(state => state.importedCourses)
const isImporting = useCourseImportStore(state => state.isImporting)

// WRONG — causes re-render on ANY store change
const { importedCourses, isImporting } = useCourseImportStore()
```

### Lift Computed Values Out of List Items

**NEVER** call store getters inside `.map()` callbacks. Compute once in the parent, pass as props.

```typescript
// CORRECT — compute once, pass down
function CourseList() {
  const courses = useCourseImportStore(state => state.importedCourses)
  const allTags = useCourseImportStore(state => state.getAllTags())
  return courses.map(c => <CourseCard key={c.id} course={c} allTags={allTags} />)
}

// WRONG — N re-renders on any tag change
function CourseCard({ course }) {
  const allTags = useCourseImportStore(state => state.getAllTags()) // DON'T
}
```

### Optimistic Update Pattern

All store mutations follow: Zustand update first (instant UI), then Dexie persist with retry. Rollback on failure.

```typescript
// 1. Capture old state for rollback
const oldValue = course.status
// 2. Optimistic update (Zustand)
set(state => ({ importedCourses: state.importedCourses.map(...) }))
// 3. Persist (Dexie) with exponential backoff retry
await persistWithRetry(async () => { await db.importedCourses.update(id, { status }) })
// 4. Rollback on failure
catch (error) { set(state => ({ importedCourses: state.importedCourses.map(/* restore oldValue */) })) }
```

**Exception**: `loadImportedCourses()` is NOT optimistic — it replaces state with DB contents directly.

### Dexie.js Schema Migrations

Use `upgrade()` callback to backfill existing records when adding new fields.

```typescript
db.version(2)
  .stores({ importedCourses: 'id, name, importedAt, status, *tags' })
  .upgrade(tx => {
    return tx.table('importedCourses').toCollection().modify(course => {
      if (!course.status) course.status = 'active'
    })
  })
```

Current schema version: **2**. Next version for Epic 2 will be **3**.

### Naming Conventions

- **Prefix imported types**: `ImportedCourse`, `ImportedVideo`, `ImportedPdf` — avoids collision with existing `Course`/`Lesson`/`Resource` types
- **Disambiguate status types**: `CourseStatus` = import status (`importing` | `ready` | `error`), `LearnerCourseStatus` = user-facing status (`active` | `completed` | `paused`)
- **Check for name conflicts** before defining new types — `src/data/types.ts` has many existing type names

### Tag Normalization

Normalize at the store boundary, not in UI components:
- `trim()` + `toLowerCase()` + `filter(Boolean)` + deduplicate + sort
- See `normalizeTags()` in `useCourseImportStore.ts`

### IDs and Dates

- IDs: `crypto.randomUUID()` (no external library)
- Dates: ISO 8601 strings (`new Date().toISOString()`)

## Component Patterns

### Interactive Elements

All interactive elements MUST include:
- Hover state (scale, shadow, color change)
- Focus-visible state (`focus-visible:ring-2 focus-visible:ring-blue-500`)
- Active/pressed state
- Disabled state (when applicable)
- `prefers-reduced-motion` respect (`motion-reduce:transform-none motion-reduce:transition-none`)

### Accessibility (WCAG 2.1 AA+)

- Semantic HTML: `<nav>`, `<main>`, `<button>` (not `<div>` with click handlers)
- ARIA labels on icon-only buttons: `aria-label="Add tag"`
- Toggle buttons: `aria-pressed={isSelected}`
- Filter groups: `role="group"` with `aria-label`
- Keyboard: full tab navigation, Enter/Space activation
- Color contrast: minimum 4.5:1 for text, 3:1 for large text

### Design Tokens

- Background: `#FAF5EE` (warm off-white)
- Primary: `blue-600` for CTAs and active states
- Card radius: `rounded-[24px]`
- Button/input radius: `rounded-xl`
- Status colors: Active = `blue-600`, Completed = `green-600`, Paused = `gray-400`

**Known debt**: `bg-blue-600` is hardcoded across the codebase instead of using `--primary` CSS variable. Do not fix inline — dedicated cleanup story planned.

## File System Access API

### Permission Handling

`FileSystemFileHandle` stored in IndexedDB persists across sessions, but **permission does not**. Always check/request permission before accessing file content:

```typescript
const permission = await handle.queryPermission({ mode: 'read' })
if (permission !== 'granted') {
  const result = await handle.requestPermission({ mode: 'read' })
  if (result !== 'granted') throw new Error('Permission denied')
}
const file = await handle.getFile()
```

### Blob URL Lifecycle

- Create: `URL.createObjectURL(file)` — does NOT load entire file into memory
- Revoke: `URL.revokeObjectURL(url)` on component unmount or source change
- For PDFs: prefer `Uint8Array` via `file.arrayBuffer()` over blob URLs

## Testing Patterns

### Store Tests

- Use `fake-indexeddb` for Dexie.js in tests
- Test every store action: happy path + error/rollback + edge cases
- Reset store between tests: `useCourseImportStore.setState({ importedCourses: [] })`

### Component Tests

- Use `@testing-library/react` with `userEvent`
- Mock Zustand stores at module level, override per-test via `storeState` object
- Test hover, focus, keyboard, and reduced-motion states

### Test Fixtures

- Use `makeCourse()` factory functions (deferred: move to shared `tests/support/factories/`)
- Combined filter tests need fixtures that isolate each filter dimension to prove AND-semantics

## Key File Locations

| Concern | File |
|---------|------|
| Types | `src/data/types.ts` |
| Dexie schema | `src/db/schema.ts` |
| Course import store | `src/stores/useCourseImportStore.ts` |
| Course import logic | `src/lib/courseImport.ts` |
| File system utilities | `src/lib/fileSystem.ts` |
| Courses page | `src/app/pages/Courses.tsx` |
| Imported course card | `src/app/components/figma/ImportedCourseCard.tsx` |
| Video player | `src/app/components/figma/VideoPlayer.tsx` |
| Routes | `src/app/routes.tsx` |
| Theme tokens | `src/styles/theme.css` |
| Tailwind config | `src/styles/tailwind.css` |

## Epic 2 Notes

- **react-player**: NOT needed. Existing `VideoPlayer.tsx` uses native `<video>` with full custom controls, WCAG keyboard nav, ARIA, bookmarks, captions, speed control.
- **react-pdf v10.3.0**: GO. Pin `pdfjs-dist` to match react-pdf's version to avoid worker/API version mismatch.
- New Dexie tables needed: `progress`, `bookmarks` (v3 migration)
- New Zustand store: `useVideoPlayerStore`
- New route: `/courses/:courseId/lessons/:lessonId` (Lesson Player page)
