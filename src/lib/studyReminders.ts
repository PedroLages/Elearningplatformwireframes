import { getStreakPauseStatus, getCurrentStreak, getStudyLog } from './studyLog'

// ── Storage keys ──
const SETTINGS_KEY = 'study-reminders'
const LAST_DAILY_KEY = 'study-reminders-last-daily'
const LAST_RISK_KEY = 'study-reminders-last-risk'

// ── Types ──
export interface StudyReminderSettings {
  enabled: boolean
  dailyReminder: boolean
  dailyReminderTime: string // "HH:MM"
  streakAtRisk: boolean
}

const DEFAULTS: StudyReminderSettings = {
  enabled: false,
  dailyReminder: false,
  dailyReminderTime: '09:00',
  streakAtRisk: false,
}

// ── Settings CRUD ──

export function getReminderSettings(): StudyReminderSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return { ...DEFAULTS }
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULTS }
  }
}

export function saveReminderSettings(settings: StudyReminderSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  window.dispatchEvent(new CustomEvent('study-reminders-updated'))
}

// ── Notification permission helpers ──

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (typeof Notification === 'undefined') return 'unsupported'
  return Notification.permission
}

export async function requestNotificationPermission(): Promise<
  NotificationPermission | 'unsupported'
> {
  if (typeof Notification === 'undefined') return 'unsupported'
  const result = await Notification.requestPermission()
  return result
}

// ── Notification senders ──

export function sendDailyReminder(currentStreak: number): void {
  if (getNotificationPermission() !== 'granted') return
  const body =
    currentStreak > 0
      ? `Keep your ${currentStreak}-day streak going! Your daily study session awaits.`
      : 'Start a new streak today! Every journey begins with one step.'
  new Notification('Time to study!', {
    body,
    icon: '/favicon.svg',
    tag: 'levelup-daily-reminder',
  })
}

export function sendStreakAtRiskNotification(currentStreak: number): void {
  if (getNotificationPermission() !== 'granted') return
  new Notification('Your streak is still alive!', {
    body: `You've been away for a while — a quick session will keep your ${currentStreak}-day streak going.`,
    icon: '/favicon.svg',
    tag: 'levelup-streak-at-risk',
  })
}

// ── Streak-at-risk detection ──

export function getLastStudyTimestamp(): number | null {
  const log = getStudyLog()
  if (log.length === 0) return null
  // getStudyLog returns sorted desc by timestamp
  return new Date(log[0].timestamp).getTime()
}

export function isStreakAtRisk(): boolean {
  // If streak is paused, no risk
  const pause = getStreakPauseStatus()
  if (pause?.enabled) return false

  const lastTs = getLastStudyTimestamp()
  if (lastTs === null) return false

  const hoursSince = (Date.now() - lastTs) / (1000 * 60 * 60)
  return hoursSince >= 22
}

// ── Multi-tab dedup ──

function todayString(): string {
  return new Date().toISOString().slice(0, 10)
}

export function hasNotifiedToday(key: string): boolean {
  return localStorage.getItem(key) === todayString()
}

export function markNotifiedToday(key: string): void {
  localStorage.setItem(key, todayString())
}

// Re-export constants for the hook
export { LAST_DAILY_KEY, LAST_RISK_KEY }

