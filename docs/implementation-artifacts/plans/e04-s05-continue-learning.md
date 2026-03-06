# E04-S05: Continue Learning Dashboard Action — Implementation Plan

## Context

Epic 4's final story. The Overview dashboard has a "Continue Studying" section showing in-progress courses as small cards. This story upgrades it to a prominent "Continue Learning" hero card that surfaces the most recent session, shows detailed progress, and enables one-click resume. It also adds an empty/discovery state for new users.

**Key data source**: `localStorage` `course-progress` key via `getAllProgress()` from `src/lib/progress.ts`. This stores `CourseProgress` objects with `lastWatchedLesson`, `lastVideoPosition`, `lastAccessedAt`, `completedLessons`.

## Files to Modify

| File | Change |
|------|--------|
| `src/app/components/ContinueLearning.tsx` | **NEW** — ContinueLearning component (hero card + recently accessed + empty state) |
| `src/app/pages/Overview.tsx` | Replace "Continue Studying" section (lines 200-252) with `<ContinueLearning />` |

## Implementation

### Task 1: ContinueLearning Component

Create `src/app/components/ContinueLearning.tsx` with three states:

**1a. Hero Card (has sessions)**
- Query: `getAllProgress()` → filter entries with `lastWatchedLesson` → sort by `lastAccessedAt` desc → take first as "most recent"
- Look up course details from `allCourses` by courseId
- Look up lesson title from course modules
- Display: course title (heading), lesson title, thumbnail/icon, progress bar with completion %, "Last accessed" relative time, "Resume Learning" button
- Entire card is a `<Link>` to `/courses/{courseId}/{lastWatchedLesson}`
- `data-testid="continue-learning-card"` on the card link
- `data-testid="continue-learning-section"` on the wrapper `<section>`

**1b. Recently Accessed Row (AC3)**
- Show other in-progress courses (sorted by `lastAccessedAt`, skip the hero course)
- Render as smaller cards in a row (reuse existing Continue Studying card pattern)
- Optional — only shown when 2+ courses have progress

**1c. Empty/Discovery State (AC4)**
- When no progress entries exist (or all reference deleted courses)
- Show "Start Your Learning Journey" heading + description
- Display 3 suggested courses from `allCourses` with `data-testid="suggested-course-{id}"`
- "Explore All Courses" CTA link to `/courses`

**1d. Deleted Course Handling (AC5)**
- If most recent courseId not found in `allCourses`, skip it
- If ALL progress entries reference deleted courses, show empty state
- No crash, no broken card

### Task 2: Overview Integration

Replace lines 200-252 in Overview.tsx:
- Remove the "Continue Studying" section
- Insert `<ContinueLearning />` **before** the existing "Continue Studying" position (keep it near the top, after Achievement Banner)
- Move it above Recent Activity for prominence (after Study Streak Calendar)

### Task 3: Responsive + Accessibility (AC6)

- Hero card: full-width on mobile, adequate height (≥88px)
- Resume button: min 44x44px touch target (`min-h-11 min-w-11`)
- Card width >300px on mobile
- Use `rounded-[24px]` for card, `rounded-xl` for button
- Keyboard navigable (Link component handles this)
- Progress bar with `aria-label="{Course}: {N}% complete"`

### Task 4: Performance (AC2)

- No extra data fetching — `getAllProgress()` is synchronous localStorage read
- Course lookup is O(n) against `allCourses` array (small, ~20 courses)
- Navigation via React Router `<Link>` — no extra overhead
- Target: <1s from click to content ready (inherently fast since it's client-side routing)

## Component Structure

```
<section data-testid="continue-learning-section">
  {hasRecentSession ? (
    <>
      <Link to={resumeLink} data-testid="continue-learning-card">
        <Card>  // Hero card with course info, progress, resume button
      </Link>
      {otherCourses.length > 0 && (
        <div>  // Recently accessed row
      )}
    </>
  ) : (
    <div>  // Empty/discovery state
      <h3>Start Your Learning Journey</h3>
      <p>Begin with one of these recommended courses</p>
      {suggestedCourses.map(c => <SuggestedCourseCard data-testid={`suggested-course-${c.id}`} />)}
      <Link to="/courses">Explore All Courses</Link>
    </div>
  )}
</section>
```

## Existing Code to Reuse

- `getAllProgress()` from `src/lib/progress.ts` — get all course progress
- `getCourseCompletionPercent(courseId, totalLessons)` from `src/lib/progress.ts`
- `allCourses` from `src/data/courses` — course metadata + modules
- `Progress` component from `src/app/components/ui/progress`
- `Card`, `CardContent` from `src/app/components/ui/card`
- `EmptyState` from `src/app/components/EmptyState` (for empty state pattern reference)
- `BookOpen`, `Play`, `Clock` icons from `lucide-react`
- Existing Continue Studying card pattern (thumbnail + title + progress bar) in Overview.tsx lines 211-239

## Verification

1. `npm run build` — no errors
2. `npx playwright test tests/e2e/story-e04-s05.spec.ts --project=chromium` — all 6 tests pass
3. `npx playwright test tests/e2e/overview.spec.ts tests/e2e/navigation.spec.ts tests/e2e/courses.spec.ts --project=chromium` — smoke tests still pass
4. Manual: visit `/` — see Continue Learning section, click resume, verify navigation

## Commit Sequence

1. `feat(E04-S05): add Continue Learning dashboard section` — ContinueLearning component + Overview integration
