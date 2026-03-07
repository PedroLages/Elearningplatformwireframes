# E05-S05: Study Reminders & Notifications

## Context

Epic 5 (Study Streaks & Daily Goals) has 4 completed stories establishing streak counting, pause/freeze days, study goals, and history calendar. Story 5.5 adds the final engagement layer: browser notification reminders that nudge learners to maintain study habits. This is the first use of the browser Notification API in LevelUp.

## Approach

4 files — one lib module, one hook, two existing file updates. No Zustand store needed (localStorage + hook is sufficient). No service worker (ACs scope to "when browser is open").

## Files

### 1. NEW: `src/lib/studyReminders.ts` — Config CRUD

Dedicated localStorage key `study-reminders` (follows `study-streak-pause` pattern, not inside `app-settings`).

```typescript
interface ReminderConfig {
  enabled: boolean              // Master toggle
  dailyReminderEnabled: boolean // Daily time-of-day reminder
  dailyReminderTime: string     // "HH:mm" format, default "09:00"
  streakAtRiskEnabled: boolean  // 22-hour inactivity warning
}
```

Functions:
- `getReminderConfig()` — read with defaults merge
- `saveReminderConfig(partial)` — shallow merge, save, dispatch `CustomEvent('study-reminders-updated')`
- `getLastStudyTimestamp()` — reads raw `study-log` key, returns most recent timestamp
- `checkNotificationPermission()` — wraps `Notification.permission` with window guard
- `requestNotificationPermission()` — wraps `Notification.requestPermission()` with window guard

### 2. NEW: `src/app/hooks/useStudyReminders.ts` — Scheduling Hook

Side-effect-only hook mounted at Layout level. Listens for `study-reminders-updated` and `study-log-updated` events.

**Daily reminder**: Calculate ms until configured time → `setTimeout` → show `new Notification(...)` → reschedule 24h later.

**Streak-at-risk**: Check last study timestamp. If 22+ hours → notify immediately (one-shot with guard ref). If < 22h → `setTimeout` until threshold. 5-minute `setInterval` fallback for background tab timer drift.

**Pause suppression (AC7)**: Check `getStreakPauseStatus()` — skip streak-at-risk entirely when paused.

**Notification tags**: `'levelup-daily-reminder'` and `'levelup-streak-at-risk'` to prevent duplicates.

### 3. EDIT: `src/app/pages/Settings.tsx` — Reminders Card

New Card between Appearance and Data Management:

```
Card: "Study Reminders" (Bell icon)
├── Master toggle: "Enable study reminders" + Switch
├── [If denied] Alert: "Notifications blocked" + browser instructions
├── [If enabled + granted] Daily reminder toggle + <input type="time">
├── [If enabled + granted] Streak protection toggle + helper text
└── [If enabled + granted] Status badge: "Notifications active"
```

Toggle ON → `requestNotificationPermission()` → if granted, save enabled state. Toggle OFF → save disabled, hook clears timers.

Test IDs: `reminders-toggle`, `daily-reminder-toggle`, `daily-reminder-time`, `streak-at-risk-toggle`, `reminders-blocked-alert`.

### 4. EDIT: `src/app/components/Layout.tsx` — Mount Hook

Single line: `useStudyReminders()` near existing hooks.

## Notification Messages (Supportive Tone)

| Type | Title | Body |
|------|-------|------|
| Daily (streak > 0) | "Time to study!" | "Keep your {N}-day streak going! Your daily study session awaits." |
| Daily (streak = 0) | "Time to study!" | "Start a new streak today! Every journey begins with one step." |
| Streak-at-risk | "Your streak is still alive!" | "You've been away for a while — a quick session will keep your {N}-day streak going." |

## Implementation Sequence

1. Create `src/lib/studyReminders.ts` (pure functions, testable)
2. Create `src/app/hooks/useStudyReminders.ts` (scheduling logic)
3. Update `src/app/pages/Settings.tsx` (Reminders Card UI)
4. Update `src/app/components/Layout.tsx` (mount hook)

Granular commits after each step.

## Key Patterns to Reuse

- **localStorage CRUD**: `src/lib/settings.ts` — defaults + shallow merge pattern
- **CustomEvent dispatch**: `src/lib/studyLog.ts:46` — `window.dispatchEvent(new CustomEvent(...))`
- **Streak data access**: `src/lib/studyLog.ts` — `getCurrentStreak()`, `getStreakPauseStatus()`
- **Settings Card layout**: `src/app/pages/Settings.tsx` — Card/CardHeader/CardTitle/CardContent
- **Switch + Label row**: flex items-center justify-between pattern
- **Toast feedback**: `import { toast } from 'sonner'` for save confirmations

## Verification

1. **Build**: `npm run build` — no TypeScript errors
2. **Manual test flow**:
   - Settings → toggle reminders on → grant permission → see config options
   - Set daily time to 1 minute from now → wait → verify browser notification appears
   - Study log has no activity for 22+ hours → verify streak-at-risk notification
   - Pause streak → verify streak-at-risk suppressed
   - Toggle off → verify timers cleared
3. **E2E tests**: Settings UI state machine (toggle states, permission flows, config persistence)
