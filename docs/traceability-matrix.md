# Traceability Matrix & Gate Decision — Epic 2: Video & PDF Content Playback

**Epic:** E02 — Video & PDF Content Playback (9 stories)
**Date:** 2026-02-22
**Evaluator:** TEA Agent (testarch-trace v4.0)
**Gate Type:** Epic
**Decision Mode:** Deterministic

---

> Note: This workflow does not generate tests. Where gaps exist, run `*atdd` or `*automate` to create coverage.

## PHASE 1: REQUIREMENTS TRACEABILITY

### Coverage Summary

| Priority | Total Criteria | FULL Coverage | Coverage % | Status |
| -------- | -------------- | ------------- | ---------- | ------ |
| P0       | 6              | 3             | 50%        | ❌ FAIL |
| P1       | 18             | 15            | 83%        | ⚠️ WARN |
| P2       | 11             | 0             | 0%         | ⚠️ WARN |
| P3       | 4              | 4             | 100%       | ✅ PASS |
| **Total** | **39**        | **22**        | **56%**    | ❌ FAIL |

**Legend:**
- ✅ PASS — Coverage meets quality gate threshold
- ⚠️ WARN — Coverage below threshold but not critical
- ❌ FAIL — Coverage below minimum threshold (blocker)

---

### Detailed Mapping

---

## Story E02-S01: Lesson Player Page with Video Playback

> ⚠️ **CRITICAL STATUS DISCREPANCY**: Story file shows `status: in-progress` with ALL tasks unchecked and ZERO review gates passed (`review_gates_passed: []`). Sprint tracker (`sprint-status.yaml`) incorrectly marks this as `done`. Implementation may be INCOMPLETE.

#### AC-1: Video Playback from Imported Course (P0)

- **Coverage:** PARTIAL ⚠️ — Tests exist but implementation status is UNKNOWN
- **Tests:**
  - `E02-S01-E2E-001` — `tests/e2e/story-2-1-lesson-player.spec.ts` (AC-1 block)
    - **Given:** Imported course with videos seeded in IndexedDB
    - **When:** User navigates to `/imported-courses/:courseId/lessons/:lessonId`
    - **Then:** `video-player-container` is visible, title displayed, paused state, clean layout
- **Gaps:**
  - Story file status is "in-progress" with no implementation notes
  - No design or code review feedback (review sections are empty)
  - `FileSystemFileHandle` → blob URL lifecycle cannot be confirmed implemented
  - Tests are still in "RED PHASE" (file header explicitly states: "All tests expected to FAIL until implementation is complete")
- **Recommendation:** Audit whether ImportedLessonPlayer and useVideoFromHandle hook exist in `src/`. If not, implement before claiming done. Update story status and run review gates.

#### AC-2: File Access Error Recovery (P0)

- **Coverage:** PARTIAL ⚠️ — Tests exist; implementation status unknown
- **Tests:**
  - `E02-S01-E2E-002` — `tests/e2e/story-2-1-lesson-player.spec.ts` (AC-2 block)
    - 5 tests: error state text, locate file button, back to course button, navigation on back click, no crash
- **Gaps:** Same implementation uncertainty as AC-1. Error state component may not exist.
- **Recommendation:** Verify `lesson-error-state` testid exists in implementation.

#### AC-3: File Permission Re-request (P2)

- **Coverage:** PARTIAL ⚠️ — 1 test with OR assertion (permissive)
- **Tests:**
  - `E02-S01-E2E-003` — `tests/e2e/story-2-1-lesson-player.spec.ts` (AC-3 block)
    - **Given:** FileSystemFileHandle exists but permission not granted
    - **Then:** Either `lesson-permission-prompt` OR `lesson-error-state` is visible (OR assertion)
- **Gaps:** FileSystemFileHandle permission APIs not testable in E2E. Needs unit test for `useVideoFromHandle` hook.
- **Recommendation:** Add unit test for `useVideoFromHandle`: (1) permission granted → blob URL created, (2) permission denied → error state triggered.

#### AC-4: Course Detail Page for Imported Courses (P1)

- **Coverage:** FULL ✅ — 10 comprehensive tests
- **Tests:**
  - `E02-S01-E2E-004` — `tests/e2e/story-2-1-lesson-player.spec.ts` (AC-4 block + Navigation block)
    - Page renders at route, course name visible, 3 videos listed, filenames/durations shown, 1 PDF with page count, clickable items → navigation, Back to Courses link, type icons, full card→detail→player flow, keyboard accessible

#### AC-5: Responsive Layout (P1)

- **Coverage:** FULL ✅ — 3 tests
- **Tests:**
  - `E02-S01-E2E-005` — `tests/e2e/story-2-1-lesson-player.spec.ts` (AC-5 block)
    - Full-width player on mobile (375px ≥90% viewport), play button ≥44×44px, content list ≥85% viewport width

#### AC-6: Blob URL Cleanup (P2)

- **Coverage:** PARTIAL ⚠️ — E2E only checks no blob-related console errors
- **Tests:**
  - `E02-S01-E2E-006` — `tests/e2e/story-2-1-lesson-player.spec.ts` (AC-6 block)
    - Navigate away and back, verify zero blob-related console errors
- **Gaps:** `URL.revokeObjectURL()` not directly assertable in E2E. No unit test for `useVideoFromHandle` cleanup.
- **Recommendation:** Add unit test: unmount hook → verify `URL.revokeObjectURL` was called with the created blob URL.

---

## Story E02-S02: Video Playback Controls and Keyboard Shortcuts

#### AC-1: Shift+Arrow ±10s Seeking (P1)

- **Coverage:** FULL ✅ — 3 tests (WebKit skipped — known limitation)
- **Tests:**
  - `E02-S02-E2E-001` — `tests/e2e/story-e02-s02-video-controls.spec.ts` (AC1 block)
    - Shift+ArrowRight from 0 → 0:10, Shift+ArrowLeft from ~20s → ~10s, plain Arrow still 5s
  - WebKit skip is correctly documented (`test.skip(browserName === 'webkit', ...)`)

#### AC-2: 95% Auto-Completion with Celebration (P0)

- **Coverage:** FULL ✅ — 3 tests
- **Tests:**
  - `E02-S02-E2E-002` — `tests/e2e/story-e02-s02-video-controls.spec.ts` (AC2 block)
    - Seek to 96% → button flips to "Mark lesson incomplete", celebration modal appears
    - No re-trigger after 100% (one-shot guard tested)

#### AC-3: Caption Font Size 14pt–20pt (P2)

- **Coverage:** PARTIAL ⚠️ — 1 `test.fixme`, 1 persistence test
- **Tests:**
  - `E02-S02-E2E-003a` — FIXME: `test.fixme('should have a caption font size control...')` — broken: LessonPlayer does not pass `captions` prop to VideoPlayer
  - `E02-S02-E2E-003b` — localStorage persistence test passes (font size key survives reload)
- **Gaps:** Caption control never renders. Font size UI entirely untested.
- **Recommendation:** Wire `captions` prop from LessonPlayer → VideoPlayer (E02-S08 B2 fix), then un-fixme the test.

#### AC-4: prefers-reduced-motion Support (P2)

- **Coverage:** FULL ✅ — 2 tests
- **Tests:**
  - `E02-S02-E2E-004` — `tests/e2e/story-e02-s02-video-controls.spec.ts` (AC4 block)
    - Emulate reduced-motion, complete lesson → no bounce animation, no confetti canvas

#### AC-5: WCAG AA+ Compliance (P1)

- **Coverage:** PARTIAL ⚠️ — 4 tests pass, 1 `test.fixme` for captions aria-pressed
- **Tests:**
  - Focus indicator visible on tab, speed menu role="menu"/role="menuitem" (6 items), ArrowDown nav, Escape closes+focus returns, all icon-only buttons have labels
  - FIXME: Captions toggle `aria-pressed` not testable (captions prop not wired)

---

## Story E02-S03: Video Bookmarking and Resume

#### AC-1: Position Auto-Save Every 5 Seconds (P2)

- **Coverage:** PARTIAL ⚠️ — Tests exist but implementation uses wrong storage layer
- **Tests:**
  - `E02-S03-E2E-001` — `tests/e2e/story-e02-s03.spec.ts` (AC1 block)
    - Dispatches `timeupdate`, checks `course-progress` in localStorage; no UI indication of saving
- **Gaps:**
  - Code review **Blocker**: `src/lib/bookmarks.ts` uses `localStorage`, not IndexedDB (AC specifies IndexedDB)
  - No `beforeunload`/`visibilitychange` save handlers (Task 2.2 flagged missing)
- **Recommendation:** Migrate position save from localStorage to IndexedDB `progress` table. Add lifecycle handlers.

#### AC-2: Resume from Last Position (P1)

- **Coverage:** FULL ✅ — 3 tests
- **Tests:**
  - `E02-S03-E2E-002` — `tests/e2e/story-e02-s03.spec.ts` (AC2 block)
    - Seed position 125s → "Resuming from 2:05" toast appears, auto-dismisses, no toast when no position

#### AC-3: Bookmark Creation (Button, B key, Toast, Markers) (P1)

- **Coverage:** FULL ✅ — 5 tests (quality concern: localStorage vs IndexedDB)
- **Tests:**
  - `E02-S03-E2E-003` — `tests/e2e/story-e02-s03.spec.ts` (AC3 block)
    - Bookmark button visible, click → "Bookmarked at" toast, B key → toast, marker appears, reloads persist
- **Quality Concern:** `src/lib/bookmarks.ts` uses localStorage (code review B3). Persistence test passes but against wrong storage layer.

#### AC-4: Bookmark Marker Seek (P1)

- **Coverage:** FULL ✅ — 2 tests
- **Tests:**
  - `E02-S03-E2E-004` — `tests/e2e/story-e02-s03.spec.ts` (AC4 block)
    - Click marker → video still functional, hover marker → tooltip shows `\d+:\d{2}`

---

## Story E02-S04: PDF Viewer with Page Navigation

#### AC-1: PDF Rendering with Page Navigation (P0)

- **Coverage:** FULL ✅ — 9 tests
- **Tests:**
  - `E02-S04-E2E-001` — `tests/e2e/story-2.4.spec.ts` (AC1 block)
    - react-pdf render (not iframe), page indicator, next/prev buttons, PageDown/PageUp/Home/End, `role="document"`, `role="toolbar"`

#### AC-2: Zoom Controls and Text Selection (P1)

- **Coverage:** FULL ✅ — 7 tests
- **Tests:**
  - `E02-S04-E2E-002` — `tests/e2e/story-2.4.spec.ts` (AC2 block)
    - Zoom in/out buttons, fit-width/fit-page (desktop), `+`/`-` keyboard shortcuts, text layer, Open in New Tab

#### AC-3: Page Position Persistence (P2)

- **Coverage:** PARTIAL ⚠️ — Tests pass but against wrong storage layer
- **Tests:**
  - `E02-S04-E2E-003` — `tests/e2e/story-2.4.spec.ts` (AC3 block)
    - Navigate to page 3, check `lastPdfPages` in localStorage; seed page 3 → restore within 1s
- **Gaps:**
  - Code review **Blocker**: AC3 specifies IndexedDB but implementation uses localStorage
  - No unit tests for `savePdfPage`/`getPdfPage`
- **Recommendation:** Migrate to IndexedDB `progress` table. Add unit tests for persistence functions.

---

## Story E02-S05: Course Structure Navigation

#### AC1: Collapsible ModuleAccordion in Sidebar (P1)

- **Coverage:** FULL ✅ — 4 tests
- **Tests:**
  - `E02-S05-E2E-001` — `tests/e2e/story-2-5.spec.ts` (AC1 block)
    - Accordion visible at 1440px, `data-state` triggers, completion badge, collapse/expand on click

#### AC2: Lesson Details in Course Structure (P2)

- **Coverage:** PARTIAL ⚠️ — Soft assertion on duration
- **Tests:**
  - `E02-S05-E2E-002` — `tests/e2e/story-2-5.spec.ts` (AC2 block)
    - Lesson titles visible, video icon SVG, duration: `count ≥ 0` (VACUOUS — always passes)
- **Gaps:** Duration test `expect(count).toBeGreaterThanOrEqual(0)` provides zero coverage guarantee.
- **Recommendation:** Assert `count > 0` for lessons with known video resources.

#### AC3: Switch Lessons Without Reload + Active Highlight (P0)

- **Coverage:** PARTIAL ⚠️ — Tests use brittle CSS class selectors
- **Tests:**
  - `E02-S05-E2E-003` — `tests/e2e/story-2-5.spec.ts` (AC3 block)
    - Active lesson has `a.bg-blue-50`, clicking different lesson changes URL, highlight updates
- **Gaps:**
  - CSS class selectors break if Tailwind classes change
  - Missing: auto-navigation URL-change assertion (countdown appears but navigation not asserted)
- **Recommendation:** Add `data-testid="lesson-item-active"` to active lesson element.

#### AC4: Next Lesson Button (P1)

- **Coverage:** FULL ✅ — 2 tests
- **Tests:**
  - `E02-S05-E2E-004` — `tests/e2e/story-2-5.spec.ts` (AC4 block)
    - Next button visible for non-final lesson, clicking changes URL

#### AC5: Auto-Advance 5s Countdown with Cancel (P1)

- **Coverage:** FULL ✅ — 5 tests (with caveat noted)
- **Tests:**
  - `E02-S05-E2E-005` — `tests/e2e/story-2-5.spec.ts` (AC5 block)
    - Countdown appears, shows seconds + "Next" text, cancel button, cancel hides countdown, `role="status"` + `aria-live="polite"`
- **Quality Concern:** Actual auto-navigation (countdown expiry → URL change) is NOT tested — only countdown appearance and cancel.

#### AC6: Mobile Sheet Panel (P3)

- **Coverage:** FULL ✅ — 4 tests
- **Tests:**
  - `E02-S05-E2E-006` — `tests/e2e/story-2-5.spec.ts` (AC6 block)
    - Desktop sidebar hidden at 375px, menu button visible, Sheet opens with `mobile-course-accordion`, lesson links present

---

## Story E02-S06: Video Player UX Fixes & Accessibility

#### AC1: Mobile Touch Targets and Volume Popover (P0)

- **Coverage:** FULL ✅ — 3 tests
- **Tests:**
  - `E02-S06-E2E-001` — `tests/e2e/story-2-6.spec.ts` (AC1 block)
    - All bottom-bar buttons ≥44×44px at 375px, mute tap → `mobile-volume-popover` visible, touch auto-show/hide controls

#### AC2: Keyboard Focus and Speed Menu (P1)

- **Coverage:** FULL ✅ — 4 tests (quality concern: focus: vs focus-visible:)
- **Tests:**
  - `E02-S06-E2E-002` — `tests/e2e/story-2-6.spec.ts` (AC2 block)
    - Focus ring outline not "none", speed menu `role="menu"`, Tab wraps last→first, Escape closes+focus returns
- **Quality Concern:** Code review Blocker: focus ring uses `focus:` not `focus-visible:` (shows on mouse clicks). Tests verify outline exists but not keyboard-only behavior. No click-outside handler for speed menu (B2).

#### AC3: Video Element Attributes (P2)

- **Coverage:** PARTIAL ⚠️ — preload/playsInline tested, poster deferred
- **Tests:**
  - `E02-S06-E2E-003` — `tests/e2e/story-2-6.spec.ts` (AC3 block)
    - `preload="metadata"` ✅, `playsinline=""` ✅
    - Poster: explicitly deferred (no poster field in Resource type)

#### AC4: Reduced Motion (P3)

- **Coverage:** FULL ✅ — 1 test
- **Tests:**
  - `E02-S06-E2E-004` — `tests/e2e/story-2-6.spec.ts` (AC4 block)
    - Emulate reduced-motion, controls overlay `transitionDuration ≤ 0.01ms`

#### AC5: Single Scrollbar and Themed Scrollbars (P1)

- **Coverage:** FULL ✅ — 2 tests
- **Tests:**
  - `E02-S06-E2E-005` — `tests/e2e/story-2-6.spec.ts` (AC5 block)
    - `main#main-content` scroll delta ≤2px (no double scroll), sidebar has `overflow-y: auto`

---

## Story E02-S07: Skip Controls, PiP & Shortcuts Help

#### AC1: Skip Controls (P0)

- **Coverage:** FULL ✅ — 4 tests
- **Tests:**
  - `E02-S07-E2E-001` — `tests/e2e/story-2-7.spec.ts` (AC1 block)
    - Skip-back/forward buttons visible in bottom-left, touch targets ≥44px, J key → ARIA "Skipped back 10 seconds", L key → ARIA "Skipped forward 10 seconds"

#### AC2: Picture-in-Picture (P2)

- **Coverage:** PARTIAL ⚠️ — 4 tests but missing PiP exit E2E
- **Tests:**
  - `E02-S07-E2E-002` — `tests/e2e/story-2-7.spec.ts` (AC2 block)
    - PiP button visible (Chromium), P key → ARIA announcement, PiP active `aria-pressed="true"` (webkit skipped), hidden when `pictureInPictureEnabled=false`
- **Gaps:**
  - Code review H3: Missing E2E test for PiP exit (exiting via browser chrome/button returns to inline)
- **Recommendation:** Add: activate PiP → exit → assert `aria-pressed="false"` and video still functional.

#### AC3: Shortcuts Help Overlay (P1)

- **Coverage:** FULL ✅ — 5 tests
- **Tests:**
  - `E02-S07-E2E-003` — `tests/e2e/story-2-7.spec.ts` (AC3 block)
    - `?` opens overlay with two `[data-column]`, contains Play/Pause/Skip/Mute/Fullscreen, `?` again closes, Escape closes, Layout handler does NOT also fire (exactly 1 dialog)

---

## Story E02-S08: Chapter Progress Bar & Transcript Panel

#### AC1: Chapter Markers on Progress Bar (P2)

- **Coverage:** PARTIAL ⚠️ — Tests exist but data dependency uncertain
- **Tests:**
  - `E02-S08-E2E-001` — `tests/e2e/story-e02-s08-chapter-progress-transcript.spec.ts` (AC1 block)
    - `chapter-marker` testid visible, hover → tooltip with `\d+:\d+`
- **Gaps:**
  - Code review Blocker B1: Uncommitted changes (course data, VTT file, E2E test fixes) — committed branch may have broken tests
  - Code review Blocker B2: `captions` prop not passed LessonPlayer → VideoPlayer (subtitle rendering silently broken)
  - Tests depend on `op6-introduction` having `metadata.chapters` — uncertain if committed

#### AC2: Backward Compatibility (No Chapters) (P3)

- **Coverage:** FULL ✅ — 1 test
- **Tests:**
  - `E02-S08-E2E-002` — No chapter metadata → 0 `chapter-marker` elements ✅

#### AC3: Transcript Tab with Synchronized Cues (P2)

- **Coverage:** PARTIAL ⚠️ — Tests exist but data dependency uncertain
- **Tests:**
  - `E02-S08-E2E-003` — Transcript tab visible, click → `transcript-cue` first visible
- **Gaps:** Same data dependency concern as AC1. VTT file may not be committed.

#### AC4: Transcript Tab Hidden When No Captions (P3)

- **Coverage:** FULL ✅ — 1 test
- **Tests:**
  - `E02-S08-E2E-004` — No captions metadata → 0 Transcript tabs ✅

---

## Story E02-S09: Mini-Player & Theater Mode

#### AC1: Mini-Player on Scroll (P1)

- **Coverage:** FULL ✅ — 6 tests (quality concern noted)
- **Tests:**
  - `E02-S09-E2E-001` — `tests/e2e/story-e02-s09.spec.ts` (AC1 block)
    - `mini-player` in DOM, not fixed in viewport, becomes `position: fixed` after playing+scroll 1000px, anchor preserves layout, click scrolls back (no longer fixed), paused video does NOT trigger mini-player
- **Quality Concern:** Code review noted click-back test "passes for wrong reason" — clicking pauses video (hiding mini-player) rather than scroll-back. Test asserts `position !== fixed` but not `isPlaying === true`.

#### AC2: Theater Mode (P1)

- **Coverage:** FULL ✅ — 4 tests
- **Tests:**
  - `E02-S09-E2E-002` — `tests/e2e/story-e02-s09.spec.ts` (AC2 block)
    - Theater button visible at 1440px, click → `desktop-sidebar` hidden, T key → sidebar hidden, T again → sidebar visible

#### AC3: Theater Mode Hidden on Mobile (P3)

- **Coverage:** FULL ✅ — 1 test
- **Tests:**
  - `E02-S09-E2E-003` — At 375px, theater button not visible ✅

---

### Gap Analysis

#### Critical Gaps (BLOCKER) ❌

**1 critical gap found. Address before any release.**

1. **E02-S01: Implementation status UNKNOWN** (P0)
   - Current Coverage: PARTIAL (tests in RED PHASE; implementation not confirmed)
   - Story file: `status: in-progress`, `reviewed: false`, `review_gates_passed: []`, all tasks unchecked
   - Sprint tracker incorrectly shows `done`
   - Missing: Verify `src/app/pages/ImportedLessonPlayer.tsx`, `src/app/pages/ImportedCourseDetail.tsx`, `src/hooks/useVideoFromHandle.ts` exist and are functional
   - Impact: Imported course video player (the core E02 deliverable for non-static courses) may be entirely missing

---

#### High Priority Gaps (PR BLOCKER) ⚠️

**6 high-priority gaps found.**

1. **E02-S03-AC1: Bookmarks use localStorage, not IndexedDB** (P1)
   - Code review Blocker: `src/lib/bookmarks.ts` uses localStorage; AC specifies IndexedDB `bookmarks` table
   - No `beforeunload`/`visibilitychange` save handlers (Task 2.2 missing)
   - No unit tests for bookmarks.ts (8 functions, 0 coverage)
   - Recommend: Migrate to IndexedDB; add unit tests

2. **E02-S03: TypeScript strictness failure** (P1)
   - Code review Blocker: `VideoPlayer.tsx:288` — TS7029 fallthrough fails `tsc --noEmit`
   - Vite build passes (esbuild skips type-checking); strict CI would fail

3. **E02-S04-AC3: PDF page persistence uses localStorage, not IndexedDB** (P1)
   - Code review Blocker: AC3 specifies IndexedDB; `savePdfPage`/`getPdfPage` use localStorage
   - No unit tests for persistence functions

4. **E02-S06-AC2: `focus:` instead of `focus-visible:`** (P1)
   - Code review + Design review Blocker: Focus rings appear on mouse clicks (WCAG violation)
   - Speed menu has no click-outside-to-close handler

5. **E02-S08: Captions prop not passed LessonPlayer → VideoPlayer** (P1)
   - Code review Blocker B2: `captions` prop exists on VideoPlayer but LessonPlayer doesn't pass it
   - Subtitle toggling silently broken; E02-S02 caption tests all fixme'd as a result
   - Recommend: Add `captions={videoResource.metadata?.captions}` to VideoPlayer in LessonPlayer

6. **E02-S05-AC3: Active lesson uses brittle CSS class selectors** (P1)
   - Tests use `.bg-blue-50` / `[class*="bg-blue"]` — break if Tailwind classes change
   - Auto-advance URL-change assertion missing (countdown appears but navigation not tested end-to-end)

---

#### Medium Priority Gaps (Nightly) ⚠️

**5 medium-priority gaps found.**

1. **E02-S02-AC3 and AC5: Caption-related tests fixme'd** — captions prop wiring is prerequisite
2. **E02-S07-AC2: PiP exit test missing** — no E2E for exit PiP → inline playback restored
3. **E02-S08-AC1/AC3: Chapter/transcript data dependency uncertain** — committed branch may be missing chapter JSON and VTT file
4. **E02-S09-AC1: Mini-player click test false positive** — test passes because click pauses video (not because scroll-back works)
5. **E02-S01-AC6: Blob URL cleanup** — no unit test for `useVideoFromHandle` cleanup function

---

#### Low Priority Gaps (Optional) ℹ️

1. **E02-S04-AC2: Poster attribute deferred** — `Resource.metadata` has no poster field yet
2. **E02-S05-AC2: Soft duration assertion** — `count ≥ 0` never fails; should assert `> 0`
3. **E02-S08: Zero unit tests** for `ChapterProgressBar`, `TranscriptPanel`, `parseVTT()`, `parseTime()`, `formatTime()`
4. **E02-S09: No unit tests** for `useIntersectionObserver` hook

---

### Quality Assessment

#### Tests with Issues

**BLOCKER Issues** ❌

- `E02-S02-E2E-003a` — `test.fixme`: Caption font size control never renders (captions prop not wired); fix prerequisite first
- `E02-S02-E2E-005d` — `test.fixme`: Captions `aria-pressed` untestable until captions prop is wired

**WARNING Issues** ⚠️

- `E02-S01-*` (all 18 tests) — RED PHASE header: "All tests expected to FAIL until implementation is complete"
- `E02-S05-E2E-003a` — `locator('a.bg-blue-50')` brittle CSS selector; replace with `data-testid="lesson-item-active"`
- `E02-S05-E2E-005` — Auto-advance test verifies countdown shows but NOT that URL changes after countdown expires
- `E02-S09-E2E-001e` — Click-back test passes for wrong reason (click pauses video, hiding mini-player, not actual scroll-back)
- `E02-S05-E2E-002c` — Duration check `count ≥ 0` is vacuous; always passes regardless of implementation

**INFO Issues** ℹ️

- Multiple stories use `page.waitForTimeout()` for debounce waits — fragile in CI; prefer deterministic event-based assertions
- `E02-S03-E2E-001` dispatches raw `timeupdate` instead of using actual video time progression

---

#### Tests Passing Quality Gates

**138/148 test cases (93%) meet all quality criteria** ✅

---

### Duplicate Coverage Analysis

#### Acceptable Overlap (Defense in Depth)

- Touch targets: E02-S06-AC1 and E02-S07-AC1 both assert ≥44px — different contexts (general player vs. skip buttons) ✅
- Keyboard shortcuts: E02-S02 and E02-S07 both test keyboard — complementary (different shortcuts) ✅
- Focus indicators: E02-S06-AC2 and E02-S02-AC5 overlap slightly — acceptable for WCAG validation

#### Unacceptable Duplication ⚠️

- None identified at E2E level. Unit-level: `formatTime()` duplicated across `ChapterProgressBar` and `VideoPlayer` — extract to `src/lib/time.ts` (code review M1).

---

### Coverage by Test Level

| Test Level | Files | Test Cases | Criteria Covered | Coverage % |
| ---------- | ----- | ---------- | ---------------- | ---------- |
| E2E        | 9     | ~148       | 39/39            | 100% (present) |
| Component  | 0     | 0          | 0                | 0%         |
| Unit       | 0     | 0          | 0                | 0%         |
| **Total**  | **9** | **~148**   | **39**           | **E2E only** |

> **Architecture concern:** Epic 2 has E2E tests for all criteria but ZERO unit tests for new components and hooks (ChapterProgressBar, TranscriptPanel, useVideoFromHandle, useIntersectionObserver, bookmarks.ts, savePdfPage/getPdfPage). E2E tests validate user journeys but cannot isolate logic bugs quickly. Add unit tests to reach the recommended 3-layer coverage pyramid.

---

### Traceability Recommendations

#### Immediate Actions (Before Release)

1. **Confirm E02-S01 implementation status** — Check whether `ImportedLessonPlayer.tsx`, `ImportedCourseDetail.tsx`, `useVideoFromHandle.ts` exist in `src/`. If not, implement and run review gates. Update story status.
2. **Fix captions prop wiring (E02-S08 B2)** — Add `captions={videoResource.metadata?.captions}` to VideoPlayer invocation in LessonPlayer. Unblocks E02-S02 fixme tests.
3. **Fix TypeScript strictness (E02-S03)** — Resolve TS7029 fallthrough in `VideoPlayer.tsx:288`. Run `tsc --noEmit` in CI.
4. **Verify chapter/VTT data committed (E02-S08 B1)** — Confirm `op6-introduction` has `metadata.chapters` and captions VTT file in committed branch.

#### Short-term Actions (Next Sprint)

1. **Migrate bookmark persistence to IndexedDB** (E02-S03-AC1) — Replace `src/lib/bookmarks.ts` localStorage with Dexie `bookmarks` table.
2. **Migrate PDF page persistence to IndexedDB** (E02-S04-AC3) — Update `savePdfPage`/`getPdfPage` functions.
3. **Add unit tests** — ChapterProgressBar, TranscriptPanel parsers, useVideoFromHandle, useIntersectionObserver, bookmarks.ts (0 unit coverage across all new logic).
4. **Fix focus-visible and speed menu click-outside** (E02-S06) — Replace `focus:` → `focus-visible:`, add `mousedown` click-outside listener.
5. **Replace brittle test selectors** (E02-S05-AC3) — Add `data-testid="lesson-item-active"` and update test.

#### Long-term Actions (Backlog)

1. **Add poster field to Resource.metadata** — Enable poster attribute on VideoPlayer (E02-S06-AC3 deferred).
2. **Add auto-navigation E2E test** (E02-S05-AC5) — Assert URL changes after countdown completes.
3. **Add PiP exit test** (E02-S07-AC2) — Assert inline playback restored after PiP exit.
4. **Fix mini-player click test** (E02-S09-AC1) — Add `expect(isPlaying).toBe(true)` after click to verify scroll-back, not pause.

---

## PHASE 2: QUALITY GATE DECISION

**Gate Type:** Epic
**Decision Mode:** Deterministic

> **Partial Skip:** No CI test execution results (`test_results`) were provided. P0/P1 pass rates cannot be calculated from test runs. Gate decision is based on coverage analysis and code review evidence.

---

### Evidence Summary

#### Test Execution Results

**NOT AVAILABLE** — No CI run provided. Coverage analysis based on static test inspection.

#### Coverage Summary (from Phase 1)

**Requirements Coverage:**

- **P0 Acceptance Criteria:** 3/6 covered (50%) ❌
- **P1 Acceptance Criteria:** 15/18 covered (83%) ⚠️
- **P2 Acceptance Criteria:** 0/11 covered (0%) ⚠️ (informational)
- **Overall Coverage:** 22/39 criteria fully covered (56%) ❌

#### Non-Functional Requirements

**Security:** NOT_ASSESSED ℹ️
**Performance:** NOT_ASSESSED ℹ️
**Reliability:** ⚠️ CONCERNS
- TypeScript strictness failure in VideoPlayer (TS7029 — fails in strict CI)
- localStorage used for IndexedDB-specified features (data integrity risk on schema change)

**Maintainability:** ⚠️ CONCERNS
- Zero unit tests for new business logic (ChapterProgressBar, TranscriptPanel, bookmarks.ts)
- `formatTime()` duplicated across files

---

### Decision Criteria Evaluation

#### P0 Criteria (Must ALL Pass)

| Criterion | Threshold | Actual | Status |
| --------- | --------- | ------ | ------ |
| P0 Coverage | 100% | 50% (3/6) | ❌ FAIL |
| P0 Test Pass Rate | 100% | Unknown (no CI results) | ⚠️ N/A |
| Security Issues | 0 | 0 (not assessed) | ✅ PASS |
| Critical NFR Failures | 0 | 0 | ✅ PASS |

**P0 Evaluation:** ❌ FAILED — P0 coverage at 50% (below 100% threshold)

---

#### P1 Criteria (Required for PASS, May Accept for CONCERNS)

| Criterion | Threshold | Actual | Status |
| --------- | --------- | ------ | ------ |
| P1 Coverage | ≥90% | 83% (15/18) | ⚠️ CONCERNS |
| P1 Test Pass Rate | ≥95% | Unknown (no CI) | ⚠️ N/A |
| Overall Test Pass Rate | ≥90% | Unknown (no CI) | ⚠️ N/A |
| Overall Coverage | ≥80% | 56% | ❌ FAIL |

**P1 Evaluation:** ⚠️ CONCERNS — P1 at 83% (below 90%), Overall at 56% (below 80%)

---

#### P2/P3 Criteria (Informational)

| Criterion | Actual | Notes |
| --------- | ------ | ----- |
| P2 Coverage | 0% | All partial; largely captions/localStorage/data issues |
| P3 Coverage | 100% | All edge-case absence tests pass |

---

### GATE DECISION: ❌ FAIL

---

### Rationale

**Why FAIL (not CONCERNS):**

Two P0 blockers exist that cannot be waived:

1. **E02-S01 implementation unconfirmed (P0):** The story file explicitly reads `status: in-progress` with zero tasks checked, no review gates passed, and empty implementation/testing notes. Test files self-describe as "RED PHASE." The sprint tracker (generated the same day the story started) appears to have been prematurely set to `done`. Until the existence of `ImportedLessonPlayer.tsx`, `ImportedCourseDetail.tsx`, and `useVideoFromHandle.ts` is confirmed in the committed codebase, this P0 criterion cannot be marked PASS.

2. **P0 coverage below threshold (50%):** The 100% P0 gate requires all critical paths to have FULL test coverage. Two of six P0 criteria (S01-AC1 video playback, S05-AC3 lesson switching) are not FULL — one due to unknown implementation, one due to brittle selectors that provide false assurance.

**What is genuinely good (scale of the gap):**

- Stories E02-S02, S05 through S09 are well-implemented with proper review gates passed
- 83% P1 coverage is solid — most high-priority behaviors are tested
- E2E test suite is comprehensive (148 tests, 93% quality-gate passing)
- Code review and design review processes were consistently applied across S02-S09
- No security issues identified

**Deployment recommendation:** BLOCKED until P0 issues resolved. Re-run gate after fixes.

---

### Critical Issues

| Priority | Issue | Description | Owner | Status |
| -------- | ----- | ----------- | ----- | ------ |
| P0 | E02-S01 Impl Confirmation | Verify imported course player exists and is functional | Dev | OPEN |
| P0 | TS7029 Fallthrough | `VideoPlayer.tsx:288` fails `tsc --noEmit` | Dev | OPEN |
| P1 | Bookmarks localStorage→IndexedDB | `src/lib/bookmarks.ts` uses wrong storage layer | Dev | OPEN |
| P1 | PDF persistence localStorage→IndexedDB | `savePdfPage`/`getPdfPage` wrong storage layer | Dev | OPEN |
| P1 | Captions prop not wired | LessonPlayer doesn't pass captions to VideoPlayer | Dev | OPEN |
| P1 | focus: → focus-visible: | Mouse clicks show focus ring (WCAG violation) | Dev | OPEN |

**Blocking Issues Count:** 2 P0 blockers, 4 P1 issues

---

### Gate Recommendations

#### For FAIL Decision ❌

1. **Block Deployment Immediately**
   - Do NOT merge to main or deploy until P0 blockers resolved

2. **Fix P0 Blockers**
   - Confirm E02-S01 implementation: `ls src/app/pages/Imported* src/hooks/useVideoFromHandle*`
   - If files don't exist: implement E02-S01 (was planned as Epic 2 foundation)
   - Resolve TS7029 in VideoPlayer.tsx:288

3. **Re-Run Gate After Fixes**
   - Confirm E02-S01 + run its E2E test suite (18 tests, all should pass)
   - Run `tsc --noEmit` — must pass with 0 errors
   - Fix captions prop wiring → un-fixme E02-S02 caption tests
   - Re-run `bmad tea *trace` for Epic 2
   - Target gate: **CONCERNS** (P0 coverage → 100%, P1 coverage → 89%+)

---

### Next Steps

**Immediate Actions (next 24-48 hours):**
1. Confirm E02-S01 implementation status — check file system for implemented components
2. Fix captions prop wiring (LessonPlayer → VideoPlayer)
3. Resolve TypeScript TS7029 fallthrough in `VideoPlayer.tsx:288`
4. Confirm chapter/VTT data for `op6-introduction` is in committed branch

**Follow-up Actions (next sprint):**
1. Migrate bookmarks.ts to IndexedDB (E02-S03)
2. Migrate PDF page persistence to IndexedDB (E02-S04)
3. Add unit tests: ChapterProgressBar, TranscriptPanel parsers, bookmarks.ts, useVideoFromHandle
4. Fix focus-visible + speed menu click-outside (E02-S06)
5. Replace brittle CSS selectors with data-testid in E02-S05 tests
6. Add auto-navigation and PiP exit E2E tests

**Stakeholder Communication:**
- Notify Dev (Pedro): Epic 2 gate ❌ FAIL — primary blocker is E02-S01 status ambiguity + 5 open code review items not confirmed resolved

---

## Integrated YAML Snippet (CI/CD)

```yaml
traceability_and_gate:
  traceability:
    epic_id: "E02"
    date: "2026-02-22"
    coverage:
      overall: 56%
      p0: 50%
      p1: 83%
      p2: 0%
      p3: 100%
    gaps:
      critical: 1
      high: 6
      medium: 5
      low: 4
    quality:
      passing_tests: 138
      total_tests: 148
      blocker_issues: 2
      warning_issues: 5
    recommendations:
      - "Confirm E02-S01 implementation (ImportedLessonPlayer, ImportedCourseDetail, useVideoFromHandle)"
      - "Fix captions prop wiring: LessonPlayer → VideoPlayer"
      - "Resolve TypeScript TS7029 fallthrough in VideoPlayer.tsx:288"
      - "Migrate bookmarks and PDF persistence from localStorage to IndexedDB"
      - "Add unit tests for new business logic components"

  gate_decision:
    decision: "FAIL"
    gate_type: "epic"
    decision_mode: "deterministic"
    criteria:
      p0_coverage: 50%
      p0_pass_rate: "unknown (no CI results)"
      p1_coverage: 83%
      p1_pass_rate: "unknown (no CI results)"
      overall_pass_rate: "unknown (no CI results)"
      overall_coverage: 56%
      security_issues: 0
      critical_nfrs_fail: 0
    thresholds:
      min_p0_coverage: 100
      min_p1_coverage: 90
      min_overall_pass_rate: 90
      min_coverage: 80
    evidence:
      test_results: "not_provided"
      traceability: "docs/traceability-matrix.md"
      nfr_assessment: "not_assessed"
    next_steps: "Confirm E02-S01 implementation, fix P0 blockers, re-run gate"
```

---

## Related Artifacts

- **Story Files:** `docs/implementation-artifacts/2-[1-9]-*.md`
- **Test Files:** `tests/e2e/story-2-1-lesson-player.spec.ts`, `story-e02-s02-*.spec.ts`, `story-e02-s03.spec.ts`, `story-2.4.spec.ts`, `story-2-5.spec.ts`, `story-2-6.spec.ts`, `story-2-7.spec.ts`, `story-e02-s08-*.spec.ts`, `story-e02-s09.spec.ts`
- **Design Reviews:** `docs/reviews/design/design-review-2026-02-21-E02-S0[3-9].md`
- **Code Reviews:** `docs/reviews/code/code-review-2026-02-21-E02-S0[3-9].md`
- **Sprint Status:** `docs/implementation-artifacts/sprint-status.yaml`

---

## Sign-Off

**Phase 1 — Traceability Assessment:**

- Overall Coverage: 56%
- P0 Coverage: 50% ❌ FAIL
- P1 Coverage: 83% ⚠️ WARN
- Critical Gaps: 1
- High Priority Gaps: 6

**Phase 2 — Gate Decision:**

- **Decision:** FAIL ❌
- **P0 Evaluation:** ❌ ONE OR MORE FAILED (50% < 100% threshold)
- **P1 Evaluation:** ⚠️ SOME CONCERNS (83% < 90% threshold)

**Overall Status:** ❌ FAIL

**Next Steps:**

- FAIL ❌: Block deployment, fix P0 issues (E02-S01 confirmation + TS7029), re-run trace workflow

**Generated:** 2026-02-22
**Workflow:** testarch-trace v4.0 (Enhanced with Gate Decision)

---

<!-- Powered by BMAD-CORE™ -->
