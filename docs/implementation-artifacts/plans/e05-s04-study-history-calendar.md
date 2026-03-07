# E05-S04: Study History Calendar — Implementation Plan

## Context

Epic 5 (Study Streaks & Daily Goals) has 3 completed stories establishing the data layer: study-log in localStorage, freeze days config, streak snapshots, and study goals. Story 5.4 adds a **month-view calendar** to the Overview page so learners can see study patterns, click days for session details, and distinguish freeze days visually.

The existing `StudyStreakCalendar` is a GitHub-style heatmap (weeks × 7 rows). This new component is a **traditional month calendar grid** — different UI, but same data source (`getStudyLog()`, `getFreezeDays()`).

## Approach

Build a `StudyHistoryCalendar` component using the **shadcn/ui Calendar** (react-day-picker wrapper) as the foundation, enhanced with custom day rendering for activity highlights, freeze day indicators, and a Popover for day details. Place it on the Overview page in the Engagement Zone alongside the existing streak heatmap.

## Files to Create

| File | Purpose |
|------|---------|
| `src/app/components/StudyHistoryCalendar.tsx` | Main calendar widget |
| `src/lib/studyCalendar.ts` | Pure helper: aggregate study-log actions by date for a given month |

## Files to Modify

| File | Change |
|------|--------|
| `src/app/pages/Overview.tsx` | Add `StudyHistoryCalendar` to Engagement Zone |

## Existing Code to Reuse

| What | Location |
|------|----------|
| `getStudyLog()` | `src/lib/studyLog.ts:49` — all study actions, sorted descending |
| `getFreezeDays()` | `src/lib/studyLog.ts:98` — freeze day indices (0-6) |
| `toLocalDateString()` | `src/lib/dateUtils.ts` / re-exported from studyLog — DST-safe YYYY-MM-DD |
| `Calendar` (shadcn) | `src/app/components/ui/calendar.tsx` — react-day-picker DayPicker wrapper |
| `Popover` | `src/app/components/ui/popover.tsx` — Radix popover for day details |
| `CustomEvent('study-log-updated')` | Event pattern for live updates without reload |

## Implementation Steps

### Task 1: Data helper — `src/lib/studyCalendar.ts`

Create a pure function that aggregates study-log actions for a given month:

```ts
interface DayStudyData {
  date: string            // YYYY-MM-DD
  sessions: Array<{
    courseId: string
    timestamp: string
    type: string
  }>
  isFreezeDay: boolean
}

function getMonthStudyData(year: number, month: number): Map<string, DayStudyData>
```

- Reads `getStudyLog()` once, filters to target month
- Groups actions by date using `toLocalDateString()`
- Marks freeze days via `getFreezeDays()` (check `day.getDay()` against config)
- Returns a Map keyed by YYYY-MM-DD for O(1) lookups during render

### Task 2: Calendar component — `src/app/components/StudyHistoryCalendar.tsx`

Build on the shadcn Calendar (react-day-picker):

1. **Month navigation**: Use DayPicker's built-in `month` + `onMonthChange` props for prev/next control
2. **Day highlighting**: Use DayPicker's `modifiers` + `modifiersClassNames` to style:
   - Days with activity: green dot/background (`data-has-activity="true"`)
   - Freeze days without activity: distinct indicator (`data-freeze-day="true"`)
3. **Day click → Popover**: Use `onDayClick` to set selected day, show Popover with session list
4. **Popover content**:
   - If sessions exist: list each with course name, duration (derived from timestamp gaps or action type), timestamp
   - If no sessions: "No study sessions on this day" empty state
5. **Live updates**: Listen to `'study-log-updated'` CustomEvent to refresh data
6. **`data-testid="study-history-calendar"`** on the container
7. **`data-testid="day-detail-popover"`** on the popover content

### Task 3: Responsive design

- DayPicker cells default to `size-8` (32px) — override to `min-w-[44px] min-h-[44px]` on mobile for WCAG touch targets
- Use `@media (max-width: 640px)` or Tailwind responsive classes
- Calendar fits within card container with horizontal scroll fallback if needed

### Task 4: Overview page integration

Add the calendar to the Engagement Zone in `Overview.tsx`:
- Place below the Study Streak heatmap section, or as a new row
- Wrap in a Card with "Study History" heading
- Use the same `motion.section` animation pattern as siblings

### Task 5: Freeze day visual distinction (AC5)

- In the DayPicker `components.DayButton` custom renderer, check if the date is a freeze day
- Add a snowflake icon (Snowflake from lucide-react) or distinct bg color (e.g., `bg-blue-50`)
- Set `data-freeze-day="true"` attribute for E2E testing

### Task 6: Granular commits

After each task, commit as a save point:
1. `feat(E05-S04): add study calendar data helper`
2. `feat(E05-S04): add StudyHistoryCalendar component with month view`
3. `feat(E05-S04): add day detail popover with session list`
4. `feat(E05-S04): add freeze day visual distinction`
5. `feat(E05-S04): integrate calendar into Overview page`
6. `style(E05-S04): responsive design and touch targets`

## Verification

1. **Unit tests**: Test `getMonthStudyData()` with seeded data — correct grouping, freeze day marking
2. **E2E tests**: Run `npx playwright test tests/e2e/story-e05-s04.spec.ts --project chromium` — all 7 ATDD specs should pass
3. **Manual check**: `npm run dev` → Overview page → verify calendar renders, month nav works, day click shows popover
4. **Build**: `npm run build` — no TypeScript errors
