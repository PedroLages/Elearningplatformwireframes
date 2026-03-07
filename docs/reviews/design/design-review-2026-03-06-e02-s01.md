# Design Review — E02-S01: Lesson Player Page with Video Playback

**Review Date**: 2026-03-06
**Reviewed By**: Claude Code (design-review agent via Playwright MCP)
**Changed Files**:
- `src/app/pages/ImportedCourseDetail.tsx`
- `src/app/pages/ImportedLessonPlayer.tsx`
- `src/app/components/figma/ImportedCourseCard.tsx`
- `src/hooks/useVideoFromHandle.ts`
- `src/app/routes.tsx`

**Affected Routes Tested**:
- `/courses` — Courses page with ImportedCourseCard (desktop 1440px, tablet 768px, mobile 375px)
- `/imported-courses/:courseId` — ImportedCourseDetail page
- `/imported-courses/:courseId/lessons/:lessonId` — ImportedLessonPlayer error state

---

## Executive Summary

The E02-S01 implementation delivers a clean, well-structured lesson player and course detail page for imported courses. Card navigation, error recovery UI, and session tracking are all implemented correctly. The primary concerns are touch target sizes on interactive elements (back arrows, buttons), a missing semantic role on the PDF list item, and the lesson player header lacking an H1 for the error state variant.

---

## What Works Well

- **Background token is correct**: Computed `rgb(250, 245, 238)` matches `#FAF5EE` — the warm off-white is applied properly across all three new routes.
- **Card border radius is correct**: `ImportedCourseCard` renders with `24px` border radius matching the design system standard.
- **ImportedCourseCard click navigation works**: Clicking the card correctly navigates to `/imported-courses/:courseId`. Keyboard Enter/Space activation is also handled via `onKeyDown`. The `focus-visible:ring-2 focus-visible:ring-blue-600` focus ring pattern is correctly applied.
- **Error state recovery flow is complete**: The `ImportedLessonPlayer` error state presents a `FileWarning` icon, a clear heading, contextual message, and two recovery actions (Locate File + Back to Course). The message correctly differentiates between `permission-denied` and `file-not-found` errors.
- **No horizontal scroll at any viewport**: Verified at 375px, 768px, and 1440px — no horizontal overflow.
- **No console errors or warnings**: Clean runtime across all tested routes.
- **Video list rows have adequate touch targets**: The `<a>` elements in `ImportedCourseDetail`'s video list are 54px tall — comfortably above the 44px minimum.
- **Icon aria-hidden usage is consistent**: `FileWarning`, `FolderSearch`, `Video`, `FileText`, `ArrowLeft` icons all carry `aria-hidden="true"` — good screen reader hygiene.
- **Import conventions followed**: All imports in new files use the `@/` alias. No relative `../` paths.
- **No hardcoded hex colors or inline styles**: All styling uses Tailwind utility classes and theme tokens.
- **Blob URL lifecycle is managed correctly**: `useVideoFromHandle` revokes object URLs on cleanup, preventing memory leaks.
- **`motion-reduce` respected on ImportedCourseCard**: The hover scale transform is disabled via `motion-reduce:hover:[transform:scale(1)]`.

---

## Findings by Severity

### Blockers (Must fix before merge)

None identified.

### High Priority (Should fix before merge)

**H1: Header back-arrow link is a 16x16px touch target**

- **Location**: `src/app/pages/ImportedLessonPlayer.tsx:139-146`
- **Evidence**: Computed `getBoundingClientRect()` returns `{ width: 16, height: 16, padding: "0px" }`. The link wraps only the `<ArrowLeft className="size-4" />` icon with no padding.
- **Impact**: On mobile and touch devices, the back navigation target is 7x smaller than the WCAG-required 44x44px minimum. Learners trying to leave a lesson will frequently miss the tap target, leading to frustration — especially in video playback contexts where the interface is simplified.
- **Suggestion**: Add padding to the link to expand the tap target without changing its visual footprint. For example: `className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors p-3 -ml-3"` — the negative margin compensates so the visual position is unchanged. Alternatively, add a visible label ("Back") so the link has both text and sufficient height from the parent flex layout.

**H2: Error state action buttons are 36px tall on all viewports**

- **Location**: `src/app/pages/ImportedLessonPlayer.tsx:178-186`
- **Evidence**: Both "Locate File" `<Button>` and "Back to Course" `<Button variant="outline" asChild>` measure `{ height: 36, width: ~130 }` at desktop and mobile. The default shadcn `Button` renders at `h-9` (36px).
- **Impact**: The error recovery actions are the primary affordance when a video file is missing — the most common state a new learner would encounter. Undersized buttons on mobile increase the likelihood of missed taps at a frustrating moment.
- **Suggestion**: Use `size="lg"` on both buttons to get `h-11` (44px), or add `className="h-11"` to each. Since these are the sole CTAs on the page at this state, larger buttons also reinforce their importance visually.

### Medium Priority (Fix when possible)

**M1: PDF list items have no accessible unavailability indicator**

- **Location**: `src/app/pages/ImportedCourseDetail.tsx:85-98`
- **Evidence**: PDF items render as `<div className="... opacity-75 cursor-not-allowed">` — the `cursor-not-allowed` is CSS-only and communicates nothing to screen readers. No `aria-disabled`, no `role`, no visually-hidden text explaining why the item is unavailable.
- **Impact**: Screen reader users will encounter PDF filenames that appear to be plain text with no indication they are non-interactive placeholders. They may waste time trying to interact with them.
- **Suggestion**: Add `aria-disabled="true"` and a visually-hidden note, or append "(coming soon)" text via a `<span className="sr-only">` element. Example: `<div role="listitem" aria-disabled="true">`.

**M2: Lesson player H2 heading with no H1 on the page (error state)**

- **Location**: `src/app/pages/ImportedLessonPlayer.tsx:171`
- **Evidence**: When the error state is active, `document.querySelectorAll('h1,h2,h3')` returns only `[{ level: "H2", text: "Video file not found" }]` — no H1 exists on the page.
- **Impact**: Screen reader users who navigate by heading cannot orient themselves within the page. A heading-first navigation approach would find "Video file not found" as the only heading, with no page-level context.
- **Suggestion**: The lesson title displayed in the header (`video.filename`) should be an H1, or the page needs a visually-present H1. The simplest fix is changing the `<span data-testid="lesson-header-title">` to an `<h1 className="font-semibold text-sm truncate">`. The error state `h2` "Video file not found" is then correctly subordinate.

**M3: `ImportedCourseCard` uses `<article>` as an interactive element without `role="button"`**

- **Location**: `src/app/components/figma/ImportedCourseCard.tsx:162-173`
- **Evidence**: The card is `<article tabIndex={0} onClick={...} onKeyDown={...}>` with `aria-label`. The `<article>` landmark role is not interactive; screen readers will announce it as a content region, not a button or link. The `tabIndex={0}` makes it focusable but the semantics are misleading.
- **Impact**: Screen reader users relying on semantic roles to understand affordances will not know the card is clickable until they attempt to activate it.
- **Suggestion**: Add `role="button"` to the `<article>` element, or restructure so the primary navigation is a full-card `<a>` link (which is more semantically correct and avoids the keyboard handler duplication). If the card-as-link approach is used, interactive sub-elements (status badge, info button) can still intercept `e.stopPropagation()`.

**M4: Course subtitle missing in lesson player header when navigating directly to URL**

- **Location**: `src/app/pages/ImportedLessonPlayer.tsx:150-158`
- **Evidence**: `document.querySelector('[data-testid="lesson-header-course"]')` returns `null` when navigating directly to `/imported-courses/:courseId/lessons/:lessonId` — the Zustand store (`useCourseImportStore`) is not hydrated until the Courses page is visited. The conditional `{course && <span>}` silently omits the course name.
- **Impact**: Learners who bookmark a lesson URL or share it will see a headerbar showing only the filename with no course context — a loss of orientation. This is especially noticeable in the error state, where understanding which course the video belongs to aids recovery.
- **Suggestion**: The course name could be persisted to `localStorage` when a lesson is started (already has the `courseId`), or the course data could be fetched directly from Dexie in the lesson player as a fallback rather than relying solely on the Zustand store. A minimal fix is to also query `db.importedCourses?.get(courseId)` in a `useEffect` as a fallback when `course` is undefined.

### Nitpicks (Optional)

**N1: "Back to Courses" breadcrumb link in ImportedCourseDetail is a small inline text link**

- **Location**: `src/app/pages/ImportedCourseDetail.tsx:42-48`
- **Evidence**: The back link is `text-sm` at 20px tall on mobile — consistent with the existing app pattern for breadcrumb-style back links (see `CourseDetail.tsx`). Below 44px but contextually reasonable for desktop; worth a `py-2` to improve mobile tap area.
- **Suggestion**: Adding `py-2` to the back link className would bring its tap target to ~32px with a modest improvement. A full button treatment may be visually heavy for this element, but `py-2` is low-risk.

**N2: Loading state in ImportedLessonPlayer uses plain text, not a spinner**

- **Location**: `src/app/pages/ImportedLessonPlayer.tsx:108-116`
- **Evidence**: `<span className="text-sm">Loading...</span>` — no animation, no ARIA live region.
- **Suggestion**: Consider adding `role="status" aria-live="polite"` to the loading container, and optionally a `<Skeleton>` or animated spinner for visual feedback consistent with other loading states in the app (e.g., `ImportedCourseCard`'s `<Skeleton className="h-64 w-full rounded-xl" />`).

---

## Accessibility Checklist

| Check | Status | Notes |
|-------|--------|-------|
| Text contrast ≥4.5:1 | Pass | H2 and muted foreground text pass against `#FAF5EE` background |
| Keyboard navigation | Partial | All new elements are Tab-reachable; back arrow link has `:focus-visible` ring but 16x16px target is a problem |
| Focus indicators visible | Pass | `focus-visible:ring-2 focus-visible:ring-blue-600` on ImportedCourseCard; shadcn Button has built-in focus styles |
| Heading hierarchy | Fail | Lesson player has no H1 in error state; "Video file not found" is H2 with no parent H1 |
| ARIA labels on icon buttons | Pass | Back arrow link has `aria-label="Back to course"`; all icons have `aria-hidden="true"` |
| Semantic HTML | Partial | PDF items use `<div>` with no role/aria-disabled; `<article>` card has no `role="button"` |
| Form labels associated | Pass | No forms in the new components |
| prefers-reduced-motion | Pass | `motion-reduce:hover:[transform:scale(1)]` on ImportedCourseCard; no unguarded animations in lesson player |
| No horizontal scroll | Pass | Verified at 375px, 768px, 1440px |
| Touch targets ≥44px | Fail | Header back arrow: 16x16px; error state buttons: 36px tall |

---

## Responsive Design Verification

- **Mobile (375px)**: Pass with caveats — no horizontal scroll, single-column layout, mobile bottom nav renders correctly, video list rows are 54px. Touch targets on back arrow and action buttons are below 44px minimum.
- **Tablet (768px)**: Pass — no horizontal scroll, detail page at 709px width fits cleanly within `max-w-3xl` constraint.
- **Desktop (1440px)**: Pass — sidebar persistent, content centred at max-w-3xl, card at correct 24px radius with hover shadow/scale.

---

## Recommendations

1. **Expand the header back arrow tap target** (H1) — this is the highest-impact fix for mobile usability. A `p-3 -ml-3` padding approach preserves the visual design while meeting the 44x44px requirement.

2. **Upgrade error state buttons to `size="lg"`** (H2) — these are recovery CTAs in a frustrating moment. Larger buttons signal importance and meet mobile touch requirements simultaneously.

3. **Add H1 to the lesson player** (M2) — changing `<span data-testid="lesson-header-title">` to `<h1>` is a one-line change with meaningful accessibility impact for screen reader users.

4. **Mark PDF items as `aria-disabled`** (M1) — a small addition that communicates intent clearly to assistive technologies and prevents user confusion.
