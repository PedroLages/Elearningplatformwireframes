# Design Review: E05-S05 — Study Reminders & Notifications

**Date**: 2026-03-07
**Reviewed By**: Claude Code (design-review agent via Playwright MCP)
**Affected Route**: `/settings`

## Executive Summary

The Study Reminders card is well-structured and all AC flows work correctly. Primary concerns are two WCAG AA contrast failures on status text colors and missing touch-target sizing on switch rows and time input.

## Blockers

**B1 — WCAG AA contrast failure: "Notifications enabled" status text**
- Location: `ReminderSettings.tsx:83` — `text-green-600`
- Contrast ratio: 3.30:1 against white (requires 4.5:1)
- Fix: Use `text-green-700`

**B2 — WCAG AA contrast failure: "permission denied" warning text**
- Location: `ReminderSettings.tsx:94` — `text-amber-600`
- Contrast ratio: 3.19:1 against white (requires 4.5:1)
- Fix: Use `text-amber-700`

## High Priority

**H1 — Touch targets below 44px on all switch rows**
- All three switch rows render at 18px height
- Fix: Add `min-h-[44px]` to each flex row

**H2 — Time input touch target and focus ring inconsistency**
- Input measures 35px tall (< 44px). Focus ring uses `focus:ring-1` vs 3px on switches
- Fix: Add `h-11` and use `focus:ring-2`

**H3 — Status messages lack `aria-live` region**
- Screen readers receive no announcement when permission status changes
- Fix: Wrap status area in `<div aria-live="polite" aria-atomic="true">`

## Medium

- M1: Sub-toggle section appears without animation (design principles specify 250-350ms reveals)
- M2: `prefers-reduced-motion` — N/A (no animations currently)
- M3: `CardTitle` h3 skips h2 — pre-existing across all Settings cards

## Nits

- N1: `w-32` fixed width may clip on 320px viewports
- N2: Redundant `aria-label` alongside `<Label htmlFor>` on switches

## Accessibility Checklist

| Check | Status |
|-------|--------|
| Text contrast ≥4.5:1 | FAIL |
| Keyboard navigation | PASS |
| Focus indicators | PASS |
| ARIA labels | PASS |
| `aria-live` for dynamic content | FAIL |
| Touch targets ≥44px | FAIL |
| Semantic HTML | PASS |
