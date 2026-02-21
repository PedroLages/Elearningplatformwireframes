# Design Review: E02-S04 — PDF Viewer with Page Navigation

**Date**: 2026-02-21
**Reviewer**: Claude Code (design-review agent via Playwright MCP)
**Changed Files**:
- `src/app/components/figma/PdfViewer.tsx` — New component
- `src/app/pages/LessonPlayer.tsx` — PdfViewer integration
- `src/lib/pdfWorker.ts` — Worker setup
- `src/lib/progress.ts` — `savePdfPage`/`getPdfPage` persistence

**Affected Routes Tested**:
- `/courses/operative-six/op6-introduction` — Video + 1-page PDF in Materials tab
- `/courses/operative-six/op6-resources` — PDF-only lesson, 1 primary + 4 secondary PDFs

**Viewports Tested**: 375px (mobile), 768px (tablet), 1440px (desktop)

## Executive Summary

The PDF viewer is well-constructed with strong accessibility foundations — correct semantic roles, ARIA labels on every control, keyboard shortcuts, and screen reader announcements. Two issues require attention before merge: a layout bug causing content area heights to ignore fixed-height utility classes, and touch target sizes below 44px minimum.

## What Works Well

1. **Semantic accessibility is exemplary.** `role="document"`, `role="toolbar"`, ARIA labels on all interactive elements, `aria-live="polite"` for announcements.
2. **Keyboard shortcuts comprehensive and well-guarded.** PageDown/Up, Home/End, +/-, with INPUT tag guard.
3. **Zoom dropdown interaction is clean.** Correct ARIA attributes, outside-click dismissal.
4. **PDF renders via react-pdf with text layer.** Canvas, text layer, and annotation layer all present. Text is selectable.
5. **Responsive hiding of fit controls is correct.** Hidden at 375px, visible at 768px+.
6. **Primary PDF promotion logic is sound.** First PDF hoisted to primary for PDF-only lessons.
7. **Persistence implementation is solid.** Keyed by resourceId with 500ms debounce.

## Findings

### Blockers

**B1 — Content area height ungoverned: `flex-1` overrides fixed-height utilities**
- **Location**: PdfViewer.tsx:444
- **Evidence**: Content area computed 1762px at desktop (expected ≤800px). `flex-1` wins over `h-[800px]`.
- **Fix**: Remove `flex-1` from the content div. Keep `h-[400px] sm:h-[500px] lg:h-[700px] xl:h-[800px]` or switch to `max-h-*`.

### High Priority

**H1 — Toolbar buttons 32x32px — below 44x44px touch target minimum**
- **Location**: PdfViewer.tsx:292-438 — all `size="icon"` buttons
- **Fix**: Change `h-8 w-8` to `h-10 w-10` or `h-11 w-11`.

**H2 — Page input triggers navigation on every keystroke (multi-digit entry impossible)**
- **Location**: PdfViewer.tsx:230-235
- **Fix**: Use draft/commit pattern — local state for input, commit on blur/Enter.

**H3 — Contrast failure: page indicator 4.06:1 (WCAG AA requires 4.5:1)**
- **Location**: PdfViewer.tsx:319-322 — muted-foreground on bg-muted
- **Fix**: Use `text-foreground/70` or darker color for "/" and total pages.

**H4 — Mobile toolbar wraps to two rows at 375px without visual divider**
- **Location**: PdfViewer.tsx:288 — toolbar flex-wrap
- **Fix**: Reduce gap, collapse controls, or add `border-t` separator.

### Medium

**M1 — Error fallback uses `rounded-2xl` (16px) instead of `rounded-[24px]`** (PdfViewer.tsx:254)

**M2 — Zoom dropdown button uses `rounded` (4px) instead of `rounded-lg` (8px)** (PdfViewer.tsx:359)

**M3 — Page input uses `rounded` (4px) instead of `rounded-lg` (8px)** (PdfViewer.tsx:317)

**M4 — LessonPlayer.tsx uses relative imports instead of `@/` alias** (pre-existing)

### Nits

**N1 — `courseId`/`resourceId` props accepted but unused** (PdfViewer.tsx:24-26)

**N2 — `displayZoom()` not wrapped in useCallback** (PdfViewer.tsx:243-250)

**N3 — `handlePageInputChange`/`handlePageInputKeyDown` not wrapped in useCallback** (PdfViewer.tsx:230-241)

## Accessibility Checklist

| Check | Status | Notes |
|-------|--------|-------|
| Text contrast ≥4.5:1 | Fail | Page indicator: 4.06:1 |
| Keyboard navigation | Pass | All shortcuts work |
| Focus indicators | Pass | Blue ring visible |
| ARIA labels | Pass | All buttons labeled |
| Semantic HTML | Pass | Correct roles |
| Live region | Pass | Announces page/zoom changes |

## Responsive Verification

| Viewport | Result | Notes |
|----------|--------|-------|
| Desktop 1440px | Partial pass | Content height ungoverned |
| Tablet 768px | Partial pass | Same height issue |
| Mobile 375px | Partial pass | Toolbar wraps, 32px touch targets |

**Issues found: 13 | Blockers: 1 | High: 4 | Medium: 4 | Nits: 3**
