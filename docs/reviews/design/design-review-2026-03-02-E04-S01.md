# Design Review: E04-S01 — Mark Content Completion Status

**Date:** 2026-03-02
**Route tested:** `/courses/6mx`
**Viewports:** 1440px (desktop), 768px (tablet), 375px (mobile)

## Findings

### Blockers

**B1: Module-level StatusIndicator nested inside AccordionTrigger** (ModuleAccordion.tsx)
- The module-level `<StatusIndicator>` sits inside `<AccordionTrigger>`, meaning its click always toggles the accordion instead of (potentially) opening a Popover. If module-level indicators are meant to be read-only derived values, wrapping them in a `<button>` (StatusIndicator) is semantically incorrect — they should be a presentational `<span>`.

**B2: Touch target too small (< 44×44px)** (StatusIndicator.tsx)
- `p-0.5` yields ~20×20px hit area. WCAG 2.5.8 / design guidelines require minimum 44×44px touch targets. Change to `p-3` or use `min-h-[44px] min-w-[44px]` to meet requirements.

### High Priority

**H1: Uses `text-blue-500` instead of `text-blue-600`** (StatusIndicator.tsx, StatusSelector.tsx)
- The design system primary color is `blue-600`, not `blue-500`. Both files use `blue-500` for the in-progress state.

**H2: Gray indicator contrast may be insufficient** (StatusIndicator.tsx)
- `text-muted-foreground/40` for the not-started state creates low contrast against the warm background. Needs ≥3:1 for non-text UI elements per WCAG 2.1 AA.

**H4: StatusSelector option touch targets too small** (StatusSelector.tsx)
- `py-2` on selector options yields ~36px height. Bump to `py-3` for 44px minimum.

### Medium

**M2: Module-level indicator is interactive but has no action** (ModuleAccordion.tsx)
- Module indicators are derived (read-only) but rendered as clickable `<StatusIndicator>` buttons. Either make them non-interactive (`<span>`) or add a Popover for manual override.

**M3: Hardcoded color tokens** (ModuleAccordion.tsx)
- Uses `bg-blue-50`, `text-blue-700` directly instead of semantic theme tokens.

### Nits

**N1: Template literal simplification** (StatusIndicator.tsx)
- Color mapping can be simplified from template literals to direct Tailwind classes.

**N2: Per-instance TooltipProvider** (StatusIndicator.tsx)
- Each StatusIndicator wraps its own `<TooltipProvider>`. If a global provider exists, this is redundant.

**N3: Unused `completedLessons` prop** (ModuleAccordion.tsx)
- `_completedLessons` is accepted but unused (prefixed with underscore for backward compat).

## Responsive Behavior

- **Desktop (1440px):** Status indicators render correctly alongside lesson titles. Popover opens without overflow.
- **Tablet (768px):** Layout holds. Touch targets undersized (see B2).
- **Mobile (375px):** Status indicators visible. Popover may overlap screen edge on narrow viewports.

## Verdict

**BLOCKED** — 2 blockers (B1: semantic nesting, B2: touch targets) must be fixed.
