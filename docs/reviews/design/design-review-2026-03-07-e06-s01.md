# Design Review: E06-S01 — Create Learning Challenges

**Date**: 2026-03-07
**Reviewer**: Design Review Agent (Playwright MCP)
**Viewports Tested**: 375px (mobile), 768px (tablet), 1440px (desktop)
**Route**: `/challenges`

## Executive Summary

The Challenges page and Create Challenge dialog are well-structured, functionally complete, and demonstrate strong accessibility fundamentals. All core acceptance criteria pass. Two findings require attention before merge: the dialog close button is critically undersized on mobile (16×16px), and buttons use `rounded-md` (8px) when design standard specifies `rounded-xl` (12px).

## What Works Well

1. All acceptance criteria functionally met — type-switch updates labels, validation fires, toast confirms creation
2. Accessibility fundamentals solid — proper labels, aria-invalid, aria-describedby, role="alert"
3. Form resets correctly on close and successful submission
4. Responsive layout clean — no horizontal scroll at any viewport
5. Zero console errors/warnings
6. No hardcoded colours or inline styles
7. Background colour correct (#FAF5EE)
8. Contrast passes everywhere (muted text 5.52:1 on white, 5.09:1 on body)

## Findings

### Blockers

**B1 — Dialog close button is 16×16px on mobile (touch target violation)**
WCAG 2.1 SC 2.5.5 requires minimum 44×44px on touch devices. The Radix DialogContent close button is less than one-third the required size.

### High Priority

**H1 — Button border-radius is `rounded-md` (8px) — design standard requires `rounded-xl` (12px)**
All Button elements compute to 8px border-radius. Fix in `button.tsx` buttonVariants base class.

**H2 — Submit and header CTA buttons are 36px tall on mobile (touch target violation)**
Both primary CTA buttons fall 8px short of the 44px minimum. Add `min-h-11` to Button size variants.

**H3 — No Cancel button in dialog footer**
Only submit + X icon. A secondary Cancel button improves discoverability for keyboard users.

**H4 — Primary colour token is near-black (#030213), not blue-600**
This is likely a pre-existing theme configuration issue, not introduced by this story.

### Medium

**M1 — Validation errors don't clear in real time as user corrects fields**
Errors only clear on next submit attempt. Real-time clearing would improve UX.

**M2 — Empty state button text identical to header button**
Consider differentiating copy (e.g., "Set your first goal").

**M3 — No delete/edit actions on challenge cards**
Scope gap — worth a follow-up story.

### Nits

**N1 — Icon margin `mr-1.5` (6px) instead of standard `mr-2` (8px)**
**N2 — `daysRemaining` timezone edge case worth a comment**

## Accessibility Checklist

| Check | Status |
|-------|--------|
| Text contrast ≥4.5:1 | Pass |
| Keyboard navigation | Pass |
| Focus indicators visible | Pass |
| Heading hierarchy | Pass |
| ARIA labels on icon buttons | Pass |
| Semantic HTML | Pass |
| Form labels associated | Pass |
| aria-invalid + aria-describedby | Pass |
| role="alert" on errors | Pass |
| prefers-reduced-motion | Pass |
| Touch targets ≥44×44px | Fail (B1, H2) |

## Responsive Verification

| Viewport | Status | Notes |
|----------|--------|-------|
| Desktop 1440px | Pass | Clean layout, sidebar expanded |
| Tablet 768px | Pass | Sidebar collapses, 2-column grid |
| Mobile 375px | Partial | Touch target violations (B1, H2) |

## Summary

Findings: 9 | Blockers: 1 | High: 4 | Medium: 3 | Nits: 2
