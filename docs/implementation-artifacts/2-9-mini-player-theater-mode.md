---
story_id: E02-S09
story_name: "Mini-Player & Theater Mode"
status: done
started: 2026-02-21
completed: 2026-02-21
reviewed: true
review_started: 2026-02-21
review_gates_passed: [build, lint, unit-tests, e2e-tests, design-review, code-review]
---

# Story 2.9: Mini-Player & Theater Mode

## Story

As a learner,
I want the video to follow me as I scroll and an option to widen the viewing area,
so that I can keep watching while reading materials below and maximize the video when I want focus.

## Acceptance Criteria

**AC1 — Mini-player on scroll:**
Given the user is watching a video and scrolls down past the player
When the main video player leaves the viewport
Then a mini-player appears fixed in the bottom-right corner (320px wide)
And the original player area shows a placeholder to prevent layout shift
And clicking the mini-player scrolls back to the full player
And the mini-player disappears when video is paused or the user scrolls back up

**AC2 — Theater mode:**
Given the user clicks the theater mode button or presses T
When theater mode activates
Then the course sidebar (ModuleAccordion) is hidden
And the video and content area expand to use the full available width
And pressing T again or clicking the button exits theater mode
And the mobile Sheet navigation remains accessible

**AC3 — Theater mode hidden on mobile:**
Given the user is in theater mode on mobile (< 1280px)
When the sidebar is already hidden by default
Then the theater mode button is not shown (sidebar already hidden)

## Tasks / Subtasks

- [ ] Task 1: Create `useIntersectionObserver` hook (AC: 1)
  - [ ] 1.1 New file `src/app/hooks/useIntersectionObserver.ts`
  - [ ] 1.2 Follow `useMediaQuery.ts` pattern — initialize state sync, clean up on unmount

- [ ] Task 2: Add theater mode props + T shortcut to VideoPlayer (AC: 2, 3)
  - [ ] 2.1 Add `onPlayStateChange?`, `theaterMode?`, `onTheaterModeToggle?` to `VideoPlayerProps`
  - [ ] 2.2 Call `onPlayStateChange?(next)` in play/pause handlers
  - [ ] 2.3 Add `t` key shortcut → calls `onTheaterModeToggle?.()`
  - [ ] 2.4 Add theater button (`hidden xl:flex h-11 w-11`) next to PiP/fullscreen

- [ ] Task 3: Mini-player scroll behavior in LessonPlayer (AC: 1)
  - [ ] 3.1 Add `isTheaterMode`, `isVideoPlaying` state + `videoWrapperRef`
  - [ ] 3.2 Use `useIntersectionObserver(videoWrapperRef, { threshold: 0.3 })`
  - [ ] 3.3 Derive `isMiniPlayer = !isVideoIntersecting && isVideoPlaying`
  - [ ] 3.4 Add scroll-back handler with `prefers-reduced-motion` check
  - [ ] 3.5 Wrap VideoPlayer in positional div + spacer div

- [ ] Task 4: Theater mode sidebar toggle in LessonPlayer (AC: 2, 3)
  - [ ] 4.1 Wire `isTheaterMode` toggle to desktop sidebar class
  - [ ] 4.2 Mobile Sheet remains untouched

## Implementation Notes

- Mini-player: CSS-only repositioning — same `<video>` element, `position: static` → `position: fixed bottom-4 right-4 w-80 z-50`
- Spacer: `<div className="w-full aspect-video mb-5">` prevents layout shift
- `isMiniPlayer = !isVideoIntersecting && isVideoPlaying` — pausing auto-hides mini-player
- Theater mode: page-level `useState` in `LessonPlayer` (Approach A — no Layout coupling)
- Desktop sidebar theater toggle: `isTheaterMode ? "hidden" : "hidden xl:block"`
- Mobile Sheet (lines ~292–312 in LessonPlayer): untouched by theater mode
- Touch targets: `h-11 w-11` (≥44px, per S07 convention)
- `prefers-reduced-motion`: check before using smooth scroll in `handleMiniPlayerClick`
- Theater button: `hidden xl:flex` — invisible on mobile (sidebar already hidden below xl)

## Testing Notes

- ATDD tests in `tests/e2e/story-e02-s09.spec.ts` — 9 RED tests covering all 3 ACs
- Mini-player scroll behavior requires IntersectionObserver mock in Playwright
- Theater button visibility tested at 1280px+ (desktop) and 375px (mobile)

## Design Review Feedback

Report: `docs/reviews/design/design-review-2026-02-21-E02-S09.md`

**Verdict: BLOCKED — 1 blocker, 2 high, 3 medium**

**B1 — Invisible click trap (blocker)**: `inset-0` carries `top: 0; left: 0` into the fixed mini-player state. The wrapper measures 320×884px (full viewport height) covering the entire left column. Fix: add `top-auto left-auto` to the isMiniPlayer fixed class string in LessonPlayer.tsx:262.

**H1 — WCAG 4.1.2 violation**: Mini-player wrapper is `<div tabIndex=0 onClick>` with no role or label. Screen readers cannot identify or activate it. Fix: add `role="button"` + `aria-label="Return to video"` + handle Enter/Space in onKeyDown, or use a `<button>` element.

**H2 — Observer options instability**: `{ threshold: 0.3 }` inline literal → observer reconnected every render. Fix: `useMemo(() => ({ threshold: 0.3 }), [])` at call site.

## Code Review Feedback

Report: `docs/reviews/code/code-review-2026-02-21-E02-S09.md`

**Verdict: BLOCKED — 1 blocker, 3 high, 3 medium**

**Blocker — Mini-player click pauses video**: Clicking the mini-player wrapper bubbles to `<video onClick={togglePlayPause}>`, pausing the video. E2E test passes accidentally (pause hides mini-player, not scroll-back). Fix: `e.stopPropagation()` in the mini-player onClick handler.

**High 1 — T key double-toggle**: Wrapper `onKeyDown` + VideoPlayer `window` listener both fire when focus is inside VideoPlayer controls → double-toggle → no net change. Fix: remove the `onKeyDown` T handler from the wrapper div; VideoPlayer already handles T via `onTheaterModeToggle`.

**High 2 — Options object instability** (same as H2 above — fix at the hook level by destructuring primitives as deps or memoize at call site).

**High 3 — Inline `onTheaterModeToggle` prop**: New function reference each render causes VideoPlayer's keyboard effect to re-subscribe on every render. Fix: `useCallback(() => setIsTheaterMode(prev => !prev), [])`.

**Medium** — `tabIndex={0}` always (should be conditional on `isMiniPlayer`); no unit tests for `useIntersectionObserver`; relative import path instead of `@/` alias.

## Challenges and Lessons Learned

- **Event bubbling through `<video>`**: Clicking the mini-player wrapper bubbled into the video element's `onClick={togglePlayPause}`, pausing the video every time. The E2E test passed accidentally because pause itself hides the mini-player. Fix: `e.stopPropagation()` on the mini-player click handler. Lesson: when overlaying a clickable wrapper on a video element, always stop propagation.

- **T key double-toggle from two handlers**: Having `onKeyDown` on the wrapper div AND a `window`-level listener in VideoPlayer both handling `'t'` caused React to batch two functional state updates that cancelled each other — theater mode could never activate when focus was inside VideoPlayer controls. Fix: remove the wrapper's `onKeyDown` for T; the window listener is sufficient. Lesson: global keyboard shortcuts should live in exactly one place; don't split them between React synthetic events and window listeners.

- **Inline options object recreates IntersectionObserver on every render**: Passing `{ threshold: 0.3 }` as an inline literal to a hook with `options` in its `useEffect` deps creates a new observer reference ~4×/second during video playback. Fix: destructure primitive values inside the hook so callers can't accidentally trigger churn. Lesson: hooks that accept object options should destructure primitives as deps, not accept the object itself.

- **Anchor + inner-div pattern for layout stability**: Instead of a conditional spacer div, using an outer flow-preserving anchor with `aspect-video` and an inner div that switches between `relative` and `position: fixed` eliminates layout shift cleanly. This is now a known-good pattern for sticky/floating media elements.

## Implementation Plan

See [plan](../../.claude/plans/sunny-snacking-dongarra.md) for implementation approach.
