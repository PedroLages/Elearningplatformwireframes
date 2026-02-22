# Unified Design Review Report

**Date:** 2026-02-22
**Files Reviewed:** CourseCard.tsx, ImportedCourseCard.tsx, ImportedCourseDetail.tsx, ImportedLessonPlayer.tsx
**Review Sources:** Web Interface Guidelines, Frontend Design Quality, UI/UX Design Intelligence

---

## Executive Summary

**18 unique findings** across 4 files from 3 review perspectives. The codebase shows strong fundamentals (shared hooks, aria attributes, responsive images, motion-reduce support) but suffers from **token discipline drift** between the unified CourseCard and its imported counterpart. The most impactful issues are hardcoded `blue-600` values that bypass the design system, and hover/transition parity gaps visible when both card types appear on the same page.

| Severity | Count |
|----------|-------|
| Critical | 2 |
| Warning | 12 |
| Nitpick | 10 |
| Strength | 15 |

---

## Critical Findings

### C1. `<div onClick>` navigation wrapper lacks keyboard accessibility
**File:** `CourseCard.tsx:627`
**Sources:** Web Interface Guidelines, Frontend Design

The progress variant wraps the card in `<div onClick={() => navigate(lessonLink)}>` with no `tabIndex`, `role`, `onKeyDown`, or `aria-label`. Keyboard users cannot activate this card. The library/overview variants correctly use `<article tabIndex={0} onKeyDown={...}>`.

**Fix:** Replace with `<article>` matching the library/overview pattern, or use a `<Link>` wrapper.

---

### C2. `transition-all` anti-pattern (6 instances)
**File:** CourseCard.tsx (lines 248, 346, 364, 600), ImportedCourseCard.tsx (lines 237, 280)
**Source:** Web Interface Guidelines

`transition-all` animates every CSS property change, including layout-triggering properties. The guidelines require listing properties explicitly.

**Fix:** Replace with specific transition properties:
- Line 248: `transition-[filter,transform]`
- Lines 346, 364, 237: `transition-[opacity,background-color,transform]`
- Line 280: `transition-[filter,transform]`
- Line 600: `transition-[box-shadow,transform]`

---

## Warning Findings

### W1. Hardcoded `text-blue-600` bypasses design token system (7 instances)
**Files:** ImportedCourseCard.tsx:162,298 | ImportedCourseDetail.tsx:53,88,91 | ImportedLessonPlayer.tsx:80
**Sources:** Frontend Design, UI/UX Design Intelligence

CourseCard consistently uses `text-brand` / `ring-brand` / `group-hover:text-brand`. The imported files hardcode `blue-600` which won't adapt in dark mode (where `--brand` maps to `blue-500`).

| Location | Current | Should Be |
|----------|---------|-----------|
| ImportedCourseCard.tsx:162 | `focus-visible:ring-blue-600` | `focus-visible:ring-brand` |
| ImportedCourseCard.tsx:298 | `group-hover:text-blue-600` | `group-hover:text-brand` |
| ImportedCourseDetail.tsx:53 | `text-blue-600` | `text-brand` |
| ImportedCourseDetail.tsx:88 | `text-blue-600` | `text-brand` |
| ImportedCourseDetail.tsx:91 | `group-hover:text-blue-600` | `group-hover:text-brand` |
| ImportedLessonPlayer.tsx:80 | `text-blue-600` | `text-brand` |

---

### W2. Hover/transition parity gap between card components
**File:** ImportedCourseCard.tsx:162
**Sources:** Frontend Design, UI/UX Design Intelligence

Both cards appear on the same Courses page but animate differently:

| Property | CourseCard | ImportedCourseCard |
|----------|-----------|-------------------|
| Shadow | `hover:shadow-xl` | `hover:shadow-2xl` |
| Scale syntax | `hover:scale-[1.02]` | `hover:[transform:scale(1.02)]` |
| Transition | `transition-all` | `transition-shadow` (scale isn't animated!) |

The ImportedCourseCard scale change snaps instantly rather than easing smoothly.

**Fix:** Align ImportedCourseCard to `hover:shadow-xl hover:scale-[1.02] transition-all duration-300`.

---

### W3. Font weight inconsistency between card titles
**File:** ImportedCourseCard.tsx:298
**Source:** UI/UX Design Intelligence

CourseCard uses `font-semibold` for all h3 titles; ImportedCourseCard uses `font-bold`. Creates visible weight discrepancy on the same page.

**Fix:** Change `font-bold` to `font-semibold`.

---

### W4. `<img>` elements missing explicit width/height (CLS risk)
**File:** CourseCard.tsx:394,421,436
**Source:** Web Interface Guidelines

Three `<img>` tags lack `width` and `height` attributes, causing cumulative layout shift as images load.

**Fix:** Add `width` and `height` matching the rendered dimensions (or aspect-ratio equivalent).

---

### W5. Library variant image missing `loading="lazy"`
**File:** CourseCard.tsx:431
**Source:** Frontend Design

The library variant (most image-rich srcSet) lacks `loading="lazy"` while overview and progress variants include it. On the Courses page with many cards, all library images load eagerly.

**Fix:** Add `loading="lazy"` to the library variant `<img>`.

---

### W6. Decorative icons missing `aria-hidden="true"` (4 instances)
**Files:** CourseCard.tsx:309,443,498 | ImportedCourseCard.tsx:169
**Source:** Web Interface Guidelines

| Location | Icon |
|----------|------|
| CourseCard.tsx:309 | `<CheckCircle>` in overlay |
| CourseCard.tsx:443 | `<BookOpen>` placeholder |
| CourseCard.tsx:498 | `<Clock>` in overview metadata |
| ImportedCourseCard.tsx:169 | `<FolderOpen>` placeholder |

**Fix:** Add `aria-hidden="true"` to each.

---

### W7. No horizontal padding on mobile
**File:** ImportedCourseDetail.tsx:61
**Sources:** Frontend Design, UI/UX Design Intelligence

`max-w-3xl mx-auto py-8` has no `px-*` value. Content touches viewport edges on narrow screens.

**Fix:** Add `px-4 sm:px-6`.

---

### W8. Back link touch target below 44px
**File:** ImportedCourseDetail.tsx:63-67
**Source:** Frontend Design

"Back to Courses" link with `text-sm` + `size-4` icon renders ~20-24px tall. Below the 44px minimum touch target.

**Fix:** Add `py-2` or `min-h-[44px] inline-flex items-center`.

---

### W9. Disabled PDF rows lack accessible explanation
**File:** ImportedCourseDetail.tsx:105
**Sources:** Frontend Design, UI/UX Design Intelligence

PDF items use `opacity-75 cursor-not-allowed` but no `aria-disabled`, title, or visible text explaining why they're non-interactive.

**Fix:** Add `aria-disabled="true"` and a "PDF viewer coming soon" badge or `title` attribute.

---

### W10. "Loading..." uses ASCII dots instead of ellipsis
**Files:** ImportedCourseDetail.tsx:44 | ImportedLessonPlayer.tsx:65
**Source:** Web Interface Guidelines

Loading states should use the proper ellipsis character `...`.

**Fix:** Change `Loading...` to `Loading...` in both files.

---

### W11. Hardcoded relative time formatting
**File:** CourseCard.tsx:47-71
**Source:** Web Interface Guidelines

`formatRelativeTime()` hardcodes English strings ("minutes ago", "hours ago"). Should use `Intl.RelativeTimeFormat` for locale-aware output.

---

### W12. Template literal className bypasses `cn()`/`twMerge`
**File:** CourseCard.tsx:173,294,407
**Source:** Frontend Design

Badge classes use `` `border-0 text-xs ${categoryColors[...]}` `` instead of `cn('border-0 text-xs', categoryColors[...])`. If the dynamic value ever contained a conflicting utility, `twMerge` couldn't resolve it.

---

### W13. Course 404 state is sparse vs. sibling page
**File:** ImportedCourseDetail.tsx:49-57
**Source:** UI/UX Design Intelligence

"Course not found." with a plain link. Compare with ImportedLessonPlayer's rich error state (icon, heading, description, two buttons). Inconsistent error UX quality across related pages.

---

## Nitpick Findings

| # | File:Line | Finding |
|---|-----------|---------|
| N1 | CourseCard.tsx:459/488/535, ImportedCourseDetail.tsx:70, ImportedLessonPlayer.tsx:126 | Headings missing `text-wrap: balance` or `text-pretty` |
| N2 | CourseCard.tsx:336-374 | Duplicated info button render (only differs by `bottom-2` vs `bottom-3`) |
| N3 | CourseCard.tsx:523-528 | Difficulty badge color ternary chain should be a lookup map |
| N4 | CourseCard.tsx:600 | `cursor-default` on clickable card (deliberate but worth documenting) |
| N5 | ImportedCourseCard.tsx:305 | `gap-1.5` (6px) breaks 8px grid; prefer `gap-2` |
| N6 | ImportedCourseCard.tsx:164 | Double `rounded-[24px]` on article + Card |
| N7 | ImportedCourseDetail.tsx:84 | Content list items lack `active:` pressed state |
| N8 | ImportedCourseDetail.tsx/ImportedLessonPlayer.tsx | "Back to Courses" vs "Back to course" casing inconsistency |
| N9 | ImportedCourseCard.tsx:247,303 | `toLocaleDateString()` without explicit locale parameter |
| N10 | CourseCard.tsx:601 | `!scale-[1.05]` uses `!important` modifier (works but heavy-handed) |

---

## Strengths Worth Preserving

| # | Pattern | Location |
|---|---------|----------|
| S1 | Shared `useCourseCardPreview` hook ensures consistent preview timing | Both cards |
| S2 | `motion-reduce:hover:scale-100` respects prefers-reduced-motion | CourseCard.tsx:600 |
| S3 | `focus-visible:opacity-100` on hidden info buttons ensures keyboard discovery | Both cards |
| S4 | Excellent error recovery UX with "Locate File" action | ImportedLessonPlayer.tsx:121-141 |
| S5 | `<picture>` + srcSet + WebP with PNG fallback | CourseCard.tsx:410-433 |
| S6 | Proper `cancelled` flag in async effects prevents state-after-unmount | All files |
| S7 | `min-w-0` on flex child enables text truncation | ImportedLessonPlayer.tsx:99 |
| S8 | Consistent `w-72 p-4` popover sizing | Both cards |
| S9 | Dialog structure identical between components | Both cards |
| S10 | Semantic category badge color differentiation (emerald/blue/amber/red/purple) | CourseCard.tsx:36-43 |
| S11 | Status badge dropdown with aria-label and current-selection indicator | ImportedCourseCard.tsx:192-228 |
| S12 | Responsive `flex-col sm:flex-row` action buttons | ImportedLessonPlayer.tsx:133 |
| S13 | `tabular-nums` on duration display | ImportedCourseDetail.tsx:95 |
| S14 | Blob URL lifecycle properly managed (create/revoke) | ImportedLessonPlayer.tsx via hook |
| S15 | Lazy video preview loading (only queries DB after 1s hover) | ImportedCourseCard.tsx:79-95 |

---

## Priority Action Plan

### Must Fix (before merge)
1. **C1** -- Add keyboard support to progress variant card wrapper
2. **W1** -- Replace all `blue-600` with `brand` token (7 instances, 4 files)
3. **W2** -- Align ImportedCourseCard hover/transition to match CourseCard
4. **W6** -- Add `aria-hidden="true"` to 4 decorative icons

### Should Fix (high impact, low effort)
5. **W3** -- Change `font-bold` to `font-semibold` in ImportedCourseCard
6. **W7** -- Add `px-4` to ImportedCourseDetail page container
7. **W8** -- Increase back link touch target
8. **W9** -- Add disabled explanation to PDF rows
9. **W10** -- Fix ellipsis characters in loading states
10. **C2** -- Replace `transition-all` with explicit properties

### Nice to Have
11. **W4** -- Add width/height to images
12. **W5** -- Add lazy loading to library variant image
13. **W11** -- Use Intl.RelativeTimeFormat
14. **W12** -- Use `cn()` for dynamic className composition
15. **W13** -- Enhance 404 state in ImportedCourseDetail
