# Design Review: E05-S01 — Daily Study Streak Counter

**Date**: 2026-03-05
**Route**: `/` (Overview)
**Files reviewed**: StudyStreak.tsx, StudyStreakCalendar.tsx, Overview.tsx, tailwind.css

## Findings

### Blocker
1. **`window.location.reload()` after pause** — StudyStreakCalendar.tsx:49
   - Forces full page reload, unacceptable UX

### High Priority
2. **Calendar cells not keyboard-reachable** — StudyStreakCalendar.tsx:93-115
   - Calendar day cells are not focusable via keyboard
3. **Mobile calendar touch targets (21x21px)** — StudyStreakCalendar.tsx:82
   - Below 44x44px minimum for touch targets

### Medium
4. **Streak count contrast 3.37:1** — StudyStreak.tsx:55
   - Below 4.5:1 WCAG AA for normal text
5. **Calendar inner card uses `rounded-2xl` not `rounded-[24px]`** — StudyStreakCalendar.tsx:67
   - Inconsistent with design token standard
6. **Redundant "Study Streak" label for screen readers** — StudyStreak.tsx:52

### Nitpick
7. **`motion-reduce:animate-none` redundant with global rule** — StudyStreak.tsx:47
8. **700ms clear timeout vs 600ms animation** — StudyStreak.tsx:17
