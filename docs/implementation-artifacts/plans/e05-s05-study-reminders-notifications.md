# E05-S05: Study Reminders & Notifications — Implementation Plan

## Context

LevelUp's Epic 5 (Study Streaks & Daily Goals) is 4/6 stories done. Stories 5.1–5.4 built streak tracking, pause/freeze, goals, and a history calendar — all using **localStorage + pure lib functions + CustomEvents**. E05-S05 adds browser notification reminders to help learners maintain their study habits and streaks. This is the first feature in the codebase to use the **Browser Notifications API**.

## Design Decisions

1. **localStorage only** (no Dexie) — consistent with all Epic 5 features
2. **Tab-open scheduling** via `setInterval` in a hook mounted in Layout.tsx — no Service Worker (future enhancement)
3. **Native `<input type="time">`** — accessible by default, no extra dependency
4. **Multi-tab dedup** — store `lastDailyReminderDate` and `lastStreakRiskDate` in localStorage to prevent duplicate notifications across tabs

## Files

### New Files

| # | File | Purpose |
|---|------|---------|
| 1 | `src/lib/studyReminders.ts` | Pure functions: storage CRUD, permission helpers, notification senders, streak-at-risk check |
| 2 | `src/app/hooks/useStudyReminders.ts` | Scheduling hook: daily reminder interval (60s check) + streak-at-risk monitor (5min check) |
| 3 | `src/app/components/figma/ReminderSettings.tsx` | Settings UI: master toggle, permission flow, daily reminder + time picker, streak-at-risk toggle |

### Modified Files

| # | File | Change |
|---|------|--------|
| 4 | `src/app/pages/Settings.tsx` | Add `<ReminderSettings />` card between Appearance and Data Management |
| 5 | `src/app/components/Layout.tsx` | Mount `useStudyReminders()` hook (1 line) |
| 6 | `tests/e2e/story-e05-s05.spec.ts` | Fix AC7 test seed shape (`enabled`/`startDate`/`days` not `isPaused`/`pausedAt`/`freezeDaysRemaining`) |

## Data Structure

```typescript
// localStorage key: 'study-reminders'
interface StudyReminderSettings {
  enabled: boolean           // Master toggle
  dailyReminder: boolean     // Daily sub-toggle
  dailyReminderTime: string  // "HH:MM", default "09:00"
  streakAtRisk: boolean      // Streak-at-risk sub-toggle
}

// Dedup keys (also in localStorage):
// 'study-reminders-last-daily': "YYYY-MM-DD"
// 'study-reminders-last-risk': "YYYY-MM-DD"
```

## Implementation Order

### Task 1: `src/lib/studyReminders.ts` — Core lib functions
- `getReminderSettings()` / `saveReminderSettings()` with defaults merge
- `requestNotificationPermission()` wrapping `Notification.requestPermission()` with API-unavailable fallback
- `getNotificationPermission()` returning current permission state
- `sendDailyReminder(currentStreak)` — `new Notification("Time to study!", { body: "You're on a {n}-day streak!" })`
- `sendStreakAtRiskNotification()` — supportive tone, ~2 hours warning
- `getLastStudyTimestamp()` — reads study-log, returns most recent timestamp
- `isStreakAtRisk()` — 22+ hours since last study AND pause NOT active (reads `getStreakPauseStatus()` from studyLog.ts)
- Multi-tab dedup helpers: `hasNotifiedToday(key)` / `markNotifiedToday(key)`

### Task 2: `src/app/hooks/useStudyReminders.ts` — Scheduling hook
- Reads settings on mount, re-reads on `study-reminders-updated` event
- Daily: `setInterval(60_000)` — checks if current time matches target (±60s window), hasn't fired today
- Streak-at-risk: `setInterval(300_000)` — calls `isStreakAtRisk()`, hasn't fired today
- Clears intervals on unmount or when `enabled` toggled off
- Also listens to `study-log-updated` to reset streak-at-risk "fired" state when user studies

### Task 3: `src/app/components/figma/ReminderSettings.tsx` — Settings UI
- Card with `data-testid="reminders-section"`, Bell icon in header
- Master Switch: "Enable reminders" — on click, calls `requestNotificationPermission()`
  - Granted → show `data-testid="notification-permission-status"` (green check + "Notifications enabled"), reveal sub-toggles
  - Denied → show `data-testid="permission-denied-guidance"` with "browser settings" text, revert toggle
- Daily reminder Switch + `<input type="time">` wrapped in `data-testid="reminder-time-picker"`
- Streak-at-risk Switch with "22-hour" description text
- When streak paused: show "paused" text, disable streak-at-risk toggle
- All changes call `saveReminderSettings()` immediately (no save button)

### Task 4: Wire into Settings.tsx
- Import and add `<ReminderSettings />` between Appearance and Data Management cards

### Task 5: Wire into Layout.tsx
- Import and call `useStudyReminders()` in Layout component

### Task 6: Fix ATDD test seed + run tests
- AC7 test seeds `{ isPaused, pausedAt, freezeDaysRemaining }` but actual StreakPause shape is `{ enabled, startDate, days }` — fix seed data
- Run `npx playwright test tests/e2e/story-e05-s05.spec.ts` to verify all pass

## AC Mapping

| AC | Implementation |
|----|---------------|
| AC1 (permission prompt) | ReminderSettings master Switch → `requestNotificationPermission()` → show status/guidance |
| AC2 (daily time config) | Daily Switch + `<input type="time">` → saved to `study-reminders.dailyReminderTime` |
| AC3 (streak-at-risk) | `isStreakAtRisk()` in lib, polled by hook every 5min |
| AC4 (daily notification) | `sendDailyReminder(currentStreak)` fired by hook when time matches |
| AC5 (risk notification) | `sendStreakAtRiskNotification()` fired by hook when `isStreakAtRisk()` returns true |
| AC6 (disable) | Master toggle off → `saveReminderSettings({enabled:false})` → hook clears intervals |
| AC7 (pause suppression) | `isStreakAtRisk()` checks `getStreakPauseStatus()?.enabled` → returns false if paused |

## Verification

1. `npm run build` — no TypeScript errors
2. `npx playwright test tests/e2e/story-e05-s05.spec.ts` — all 6 ATDD tests pass
3. Manual: Open Settings → toggle reminders → verify permission prompt appears
4. Manual: Set daily reminder 1 min from now → verify notification fires
5. Manual: Seed 23-hour-old study log → verify streak-at-risk notification fires
6. Manual: Pause streak → verify streak-at-risk does NOT fire
