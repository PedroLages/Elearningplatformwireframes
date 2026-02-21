# Design Review: E02-S06 — Video Player UX Fixes & Accessibility

**Date**: 2026-02-21
**Story**: E02-S06
**Reviewer**: Design Review Agent (Playwright MCP)
**Route tested**: `/courses/authority/lesson-1`
**Viewports**: 375px (mobile), 768px (tablet), 1440px (desktop)

## Findings

### Blockers

**B1 — `Button` needs `React.forwardRef`** (`src/app/components/ui/button.tsx`)
The `speedTriggerRef` in VideoPlayer.tsx is always null because `Button` is a plain function component. Focus return on Escape works as a browser side-effect right now but is fragile. Wrap `Button` with `React.forwardRef` to make it reliable.

### High Priority

**H1 — Slider thumbs have no accessible name** (`src/app/components/ui/slider.tsx`)
The `aria-label` prop lands on the root `<div>` but the focusable `<SliderPrimitive.Thumb>` has no label. Thread the `aria-label` down to the `Thumb` element.

**H2 — Player container focus ring uses `focus:` not `focus-visible:`** (`VideoPlayer.tsx:489`)
Replace `focus:outline focus:outline-2 focus:outline-blue-600 focus:outline-offset-2` with `focus-visible:` equivalents to prevent the ring from appearing on mouse clicks.

**H3 — Duplicate Play button in tab order** (`VideoPlayer.tsx:536`)
Add `tabIndex={-1}` and `aria-hidden="true"` to the center overlay play button. The bottom bar button already covers keyboard users; the center button is for mouse/touch only.

## Verdict

**3 issues found**: 1 Blocker, 3 High Priority
