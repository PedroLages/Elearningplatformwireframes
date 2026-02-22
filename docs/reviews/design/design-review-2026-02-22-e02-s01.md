# Design Review: E02-S01 — Lesson Player Page with Video Playback

**Date:** 2026-02-22 (re-run after blocker fixes)
**Reviewer:** design-review agent (Playwright MCP)
**Verdict:** PASS — No blockers. Previous blocker (`<button>` inside `<Link>`) confirmed resolved.

---

## Summary

The `<article tabIndex={0}>` navigation pattern is correctly applied across all CourseCard variants (library, overview, progress). The `<button>` inside `<a>` HTML violation is confirmed fixed. Focus rings appear correctly on library/overview cards via keyboard navigation. The Lesson Player and Course Detail pages present cleanly at all viewports.

No blockers found. Several high-priority touch target issues and one `aria-disabled` misuse logged below.

---

## Findings

### Blockers

None.

### High Priority

- **[CourseCard.tsx:344, ImportedCourseCard.tsx:237] Info button touch target 28x28px**: The info overlay button uses `p-1.5` (6px padding each side) + `size-4` (16px icon) = 28px total. WCAG 2.1 SC 2.5.5 requires 44x44px minimum. Confirmed at all viewports via Playwright measurement. Fix: Increase to `p-3` or use `size-6` icon for larger tap area.

- **[ImportedLessonPlayer.tsx:89] Back arrow 40px touch target**: Back link uses `p-3` (12px padding each side) + `size-4` (16px icon) = 40px. Below 44px minimum. Fix: Increase to `p-3.5` or use `size-5` icon.

- **[ImportedLessonPlayer.tsx:129,133] Error state buttons 40px**: `size="lg"` button height = `h-10` = 40px. Below 44px minimum. Fix: Use `size="xl"` if available, or add `py-3` override to reach 44px.

### Medium

- **[ImportedCourseDetail.tsx:112] `aria-disabled="true"` on `<div>`**: The PDF item uses `aria-disabled="true"` on a non-interactive element. `aria-disabled` is only meaningful on interactive roles (buttons, links, inputs). Assistive technologies may ignore or misreport this. Fix: Use `role="listitem"` with a `<span>` for the "coming soon" indicator, or wrap in a `<button disabled>` if future interaction is planned.

- **[CourseCard.tsx:560-566, 615] `cursor-default` on interactive article**: The `cursor-default` class on the card creates a mismatch — the card scales up on hover (implying clickability) but shows a default cursor. The comment explains this is intentional (outer article handles navigation), but it may confuse users. Consider `cursor-pointer` to match the hover scale effect's intent.

- **[ImportedCourseDetail.tsx:69-75] Back to Courses link touch target**: The "Back to Courses" link has `py-2 -my-2` = 8px padding. Total height ~40px. Below 44px minimum.

### Nits

- **[CourseCard.tsx:220] Progress bar uses inline `style` prop**: `style={{ width: \`${completionPercent}%\` }}` — minor inconsistency with the Tailwind-only approach. Could be replaced with a CSS custom property approach.

---

## Visual Verification

- Background: `rgb(250, 245, 238)` = `#FAF5EE` ✅ correct warm off-white
- Overview card `aria-label` set to course title ✅
- Library/overview `<article>` wrapper renders `focus-visible:ring-2 focus-visible:ring-brand` on keyboard focus ✅
- Progress card `<article>` has `aria-label` with title + completion% ✅
- Lesson player header shows video title ✅
- Lesson player header Back button shows `aria-label="Back to Course"` ✅
- Error state `<h1>` heading present ✅
- Error state buttons stacked on mobile, row on `sm:` ✅
- Course detail page content list renders `rounded-xl border bg-card` items ✅
- No console errors at any viewport ✅

---

## Responsive Testing

| Viewport | Result |
|----------|--------|
| 375px mobile | Pass (no horizontal scroll, error buttons stack correctly) |
| 768px tablet | Pass (course grid 3-column, info button accessible) |
| 1440px desktop | Pass (full lesson player layout correct) |
