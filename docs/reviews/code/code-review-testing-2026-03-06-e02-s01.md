# Test Coverage Review: E02-S01 — Lesson Player Page with Video Playback

**Review Date**: 2026-03-06
**Reviewed By**: Claude Code (code-review-testing agent)

## AC Coverage Table

| AC# | Description | Unit Test | E2E Test | Verdict |
|-----|-------------|-----------|----------|---------|
| 1 | Video renders via blob URL, title + course name, clean layout, paused state | `useVideoFromHandle.test.ts:40-49`; `ImportedLessonPlayer.test.tsx:99-110,137-148` | `story-2-1-lesson-player.spec.ts:196-252` | **Partial** — paused state not asserted in unit tests |
| 2 | Error state, file picker button, back button, no crash | `ImportedLessonPlayer.test.tsx:113-135` | `story-2-1-lesson-player.spec.ts:259-325` | **Covered** |
| 3 | Permission re-request flow: granted loads video, denied shows error | `useVideoFromHandle.test.ts:51-77` | `story-2-1-lesson-player.spec.ts:332-358` | **Partial** — no unit test for `permission-denied` message variant in component |
| 4 | Course detail lists videos/PDFs with metadata, nav links, back link | `ImportedCourseDetail.test.tsx:107-163` | `story-2-1-lesson-player.spec.ts:365-502` | **Partial** — PDF page count not asserted in unit tests; empty-course state untested |
| 5 | Responsive layout: full width video, 44px touch targets | None (layout not testable in jsdom) | `story-2-1-lesson-player.spec.ts:509-568` | **Covered** (E2E only — acceptable) |
| 6 | Blob URL cleanup on unmount/handle change | `useVideoFromHandle.test.ts:91-116` | `story-2-1-lesson-player.spec.ts:575-611` | **Covered** |

**Coverage**: 4/6 ACs fully covered | 2 partial

## Findings

### High Priority

- **`ImportedLessonPlayer.test.tsx` — no test for `permission-denied` message variant (confidence: 85)**: Component renders different copy for `permission-denied` vs `file-not-found` but tests only mock `file-not-found`. Fix: Add test with `{ error: 'permission-denied' }` mock.

- **`ImportedCourseCard.test.tsx` — card click navigation never tested (confidence: 90)**: AC-4 requires card navigate on click. `handleCardClick` and `handleCardKeyDown` both implemented but neither `useNavigate` mocked nor navigation asserted. Fix: Add click→navigate and keyboard→navigate tests.

### Medium

- **`ImportedCourseDetail.test.tsx:42-51` — PDF page count never asserted (confidence: 80)**: Fixture has `pageCount: 12`, component renders it, but no test asserts `12 pages`.

- **`ImportedCourseDetail.test.tsx` — zero-duration video branch not asserted (confidence: 75)**: `mockVideos[1]` has `duration: 0`, component conditionally renders duration, no test asserts absence.

- **`schema.test.ts` — no dedicated CRUD tests for `progress`/`bookmarks` tables (confidence: 78)**: Tables confirmed to exist but compound PK `[courseId+videoId]` never tested functionally.

- **`ImportedLessonPlayer.test.tsx:50` — shared mutable state (confidence: 72)**: Module-level `mockVideoRecord` mutated per-test creates fragile coupling.

### Nits

- **`ImportedCourseCard.test.tsx:74-111` (confidence: 60)**: Tests assert Tailwind class names — implementation details that break on rename.
- **`ImportedLessonPlayer.test.tsx:130-134` (confidence: 65)**: Raw DOM query `querySelector('a[href*="..."]')` instead of `getByRole('link')`.
- **`schema.test.ts:61-63` (confidence: 55)**: Hardcoded version number assertion breaks on every migration.
- **`useVideoFromHandle.test.ts` (confidence: 50)**: No test for `queryPermission → 'denied'` shortcut path.

### Edge Cases to Consider

1. `handleLocateFile` cancel path — no test that error state persists after cancelled picker
2. `ImportedLessonPlayer` with `courseId` present but course not in Zustand store
3. `ImportedCourseDetail` empty-course state ("No content found") has no unit test
4. `useVideoFromHandle` handle-change race condition — `createObjectURL` call count not verified
5. Loading state UI — mock resolves synchronously, loading render never surfaced

---

ACs: 4/6 covered (2 partial) | Findings: 10 | Blockers: 0 | High: 2 | Medium: 4 | Nits: 4
