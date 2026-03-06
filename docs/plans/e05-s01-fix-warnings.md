# Plan: Fix E05-S01 — All Review Findings + Remaining Warnings

Previous session's fixes were lost (never committed). This plan re-applies all v1 fixes and adds the v2 warning fixes in a single pass.

## Files to Change

| File | Changes |
|------|---------|
| `src/lib/studyLog.ts` | UTC fix, DST fix, `getStreakSnapshot()` (parse-once), export `toLocalDateStr` |
| `src/app/components/StudyStreak.tsx` | `cn()`, `size-*`, contrast, timeout, remove redundant `motion-reduce:animate-none` |
| `src/app/components/StudyStreakCalendar.tsx` | Remove reload blocker, `cn()`, `<button>` cells, touch targets, responsive grid, ARIA, event listener |
| `src/app/pages/Overview.tsx` | Remove key-remount pattern |
| `src/lib/__tests__/studyLog.test.ts` | Add 27+ unit tests for streak functions + `getStreakSnapshot` |
| `tests/e2e/story-e05-s01.spec.ts` | Add live increment, reduced-motion, pulse animation tests |

## Implementation Steps

### Step 1: studyLog.ts — Full rewrite of streak section

**UTC timezone fix**: Replace all `toISOString().split('T')[0]` with `toLocalDateStr()`:
- Add exported `toLocalDateStr(date: Date): string` using `getFullYear/getMonth/getDate`
- Add internal `parseLocalDate(dateStr: string): Date` using `new Date(y, m-1, d)`
- Replace in: `getActionsPerDay`, `getStudyDays`, `getCurrentStreak`, `calculateStreakFromDate`, `getStudyActivity`

**DST fix**:
- `calculateStreakFromDate`: use `parseLocalDate(startDate)` instead of `new Date(startDate)`
- `getLongestStreak`: use `parseLocalDate()` for date parsing, `Math.round` instead of `Math.floor`

**Parse-once pattern (W1)**: Add `getStreakSnapshot()`:
- Extract internal helpers: `studyDaysFromLog`, `currentStreakFromDays`, `longestStreakFromDays`, `activityFromLog`
- `getStreakSnapshot(activityDays)` calls `getLog()` once, derives everything
- Keep existing public functions as thin wrappers for backward compatibility

### Step 2: StudyStreak.tsx — UI fixes

- Import `cn` from `@/app/components/ui/utils`
- `getFlameSize`: `'w-12 h-12'` → `'size-12'` (all sizes)
- Flame className: string interpolation → `cn()` call
- Remove `motion-reduce:animate-none` (tw-animate-css handles it)
- Contrast: `text-orange-600 dark:text-orange-500` → `text-orange-700 dark:text-orange-400`
- Icon: `w-full h-full` → `size-full`
- Timeout: 700 → 600ms

### Step 3: StudyStreakCalendar.tsx — Blocker fix + accessibility + W2

- Import `cn`, `useCallback`, `useEffect`
- **Remove `window.location.reload()`** — replace with `forceUpdate` state + `CustomEvent` dispatch
- **Move event listener inside component (W2)**: Add `study-log-updated` listener with version counter to trigger re-reads
- Use `getStreakSnapshot()` instead of 4 separate calls
- Calendar cells: `<div>` → `<button type="button">` with `cn()` for className
- Touch targets: add `min-h-[44px] min-w-[44px]`
- Focus styles: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`
- `rounded-2xl` → `rounded-[24px]`
- Grid: `grid-cols-10` → `grid-cols-6 sm:grid-cols-10`
- `role="group"` + `aria-label`
- Pause icon: `h-3 w-3` → `size-3`, legend: `w-4 h-4` → `size-4`
- Date parsing: `new Date(day.date)` → `new Date(day.date + 'T00:00:00')`

### Step 4: Overview.tsx — Remove key-remount (W2)

- Remove `streakVersion` state and its event listener
- Remove `key={streakVersion}` from `<StudyStreakCalendar>`

### Step 5: Unit tests — studyLog.test.ts

Add imports: `getCurrentStreak, getLongestStreak, getStudyActivity, getStreakSnapshot, setStreakPause, getStreakPauseStatus, clearStreakPause, toLocalDateStr`

Add `seedStudyDays` helper at module scope.

Add test suites:
- `toLocalDateStr` (2 tests)
- `getCurrentStreak` (10 tests): empty, today only, yesterday only, 2+ days ago, consecutive from today/yesterday, gap, non-lesson_complete, active pause, expired pause
- `getLongestStreak` (7 tests): no activity, single day, consecutive, gaps, persistence, stored vs computed, updates stored
- `getStudyActivity` (4 tests): N days, active/inactive, only lesson_complete
- `streak pause` (3 tests): null, set/retrieve, clear
- `getStreakSnapshot` (3 tests): empty log, snapshot matches individual functions, parse-once consistency

### Step 6: E2E tests — story-e05-s01.spec.ts

Add 3 new tests:
1. **AC2: Live increment** — seed 0 streak, inject entry + dispatch `study-log-updated`, assert streak=1 without reload
2. **AC2: Reduced motion** — emulate `reducedMotion: 'reduce'`, inject entry, assert animation-duration < 1ms
3. **AC4: Positive pulse** (W3) — inject entry, assert `streak-flame` has `animate-streak-pulse` class

### Step 7: Build + test verification

- `npm run build`
- `npm run test:unit -- --run`
- `npx playwright test tests/e2e/story-e05-s01.spec.ts --project=chromium`

### Step 8: Commit all changes

Stage and commit everything to prevent loss.
