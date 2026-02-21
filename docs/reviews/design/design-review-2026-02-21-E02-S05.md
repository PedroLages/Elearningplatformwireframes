# Design Review: E02-S05 — Course Structure Navigation
**Date:** 2026-02-21
**Reviewer:** Design Review Agent (Playwright MCP)

## Summary

Tested LessonPlayer at `/courses/operative-six/op6-introduction` across desktop (1440px), tablet (768px), and mobile (375px).

## Findings

### Blockers (must fix)
1. **Missing SheetTitle** — `LessonPlayer.tsx:237`: `<h3>` inside `SheetContent` should be `<SheetTitle>` for proper accessibility. Import `SheetTitle` from `@/app/components/ui/sheet`.

### High Priority (should fix)
2. **Menu button touch target** — `LessonPlayer.tsx:230`: Add `h-11 w-11` to reach 44px minimum touch target.
3. **Cancel button touch target** — `AutoAdvanceCountdown.tsx:47`: Change `size="sm"` to `size="default"` for 44px height.
4. **Memoize callbacks** — `LessonPlayer.tsx:211-215`: `onAdvance` and `onCancel` are inline arrows. Wrap in `useCallback` to prevent countdown timer resets on parent re-render.
5. **Import paths** — `LessonPlayer.tsx:4-14`: Replace relative `'../components/...'` imports with `'@/app/components/...'`.

### Medium (fix when possible)
6. **Heading hierarchy** — `LessonPlayer.tsx:366`: Change sidebar `<h3>Course Content</h3>` to `<h2>` for proper heading structure.
7. **Mark Complete touch target** — `LessonPlayer.tsx:250`: Add `min-h-[44px]` to the toggle button.
8. **Redundant wrapper** — `AutoAdvanceCountdown.tsx:19-21`: Remove `handleCancel` useCallback wrapper, pass `onCancel` directly.
9. **prefers-reduced-motion** — Skip auto-navigation (not just animation) when user has set reduced motion preference.
