import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  getReminderSettings,
  saveReminderSettings,
  getNotificationPermission,
  requestNotificationPermission,
  sendDailyReminder,
  sendStreakAtRiskNotification,
  getLastStudyTimestamp,
  isStreakAtRisk,
  hasNotifiedToday,
  markNotifiedToday,
  LAST_DAILY_KEY,
  LAST_RISK_KEY,
} from '@/lib/studyReminders'

// Mock studyLog — isolate from the real study log implementation
vi.mock('@/lib/studyLog', () => ({
  getStreakPauseStatus: vi.fn(() => null),
  getStudyLog: vi.fn(() => []),
}))

// Access the mocked functions for per-test control
import { getStreakPauseStatus, getStudyLog } from '@/lib/studyLog'
const mockGetStreakPauseStatus = vi.mocked(getStreakPauseStatus)
const mockGetStudyLog = vi.mocked(getStudyLog)

describe('studyReminders', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
    // Reset mocks to defaults
    mockGetStreakPauseStatus.mockReturnValue(null)
    mockGetStudyLog.mockReturnValue([])
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  // ── Settings CRUD ──

  describe('getReminderSettings', () => {
    it('returns defaults when nothing stored', () => {
      expect(getReminderSettings()).toEqual({
        enabled: false,
        dailyReminder: false,
        dailyReminderTime: '09:00',
        streakAtRisk: false,
      })
    })

    it('returns defaults when localStorage has invalid JSON', () => {
      localStorage.setItem('study-reminders', 'not-json')
      expect(getReminderSettings()).toEqual({
        enabled: false,
        dailyReminder: false,
        dailyReminderTime: '09:00',
        streakAtRisk: false,
      })
    })

    it('merges stored values with defaults', () => {
      localStorage.setItem('study-reminders', JSON.stringify({ enabled: true }))
      const settings = getReminderSettings()
      expect(settings.enabled).toBe(true)
      expect(settings.dailyReminderTime).toBe('09:00')
    })
  })

  describe('saveReminderSettings', () => {
    it('persists settings to localStorage', () => {
      const settings = {
        enabled: true,
        dailyReminder: true,
        dailyReminderTime: '14:30',
        streakAtRisk: false,
      }
      saveReminderSettings(settings)
      expect(JSON.parse(localStorage.getItem('study-reminders')!)).toEqual(settings)
    })

    it('dispatches study-reminders-updated event', () => {
      const handler = vi.fn()
      window.addEventListener('study-reminders-updated', handler)
      saveReminderSettings(getReminderSettings())
      window.removeEventListener('study-reminders-updated', handler)
      expect(handler).toHaveBeenCalledOnce()
    })
  })

  // ── Notification permission helpers ──

  describe('getNotificationPermission', () => {
    it('returns "unsupported" when Notification is undefined', () => {
      vi.stubGlobal('Notification', undefined)
      expect(getNotificationPermission()).toBe('unsupported')
    })

    it('returns Notification.permission when available', () => {
      vi.stubGlobal('Notification', { permission: 'granted' })
      expect(getNotificationPermission()).toBe('granted')
    })

    it('returns "default" for fresh browser state', () => {
      vi.stubGlobal('Notification', { permission: 'default' })
      expect(getNotificationPermission()).toBe('default')
    })
  })

  describe('requestNotificationPermission', () => {
    it('returns "unsupported" when Notification is undefined', async () => {
      vi.stubGlobal('Notification', undefined)
      expect(await requestNotificationPermission()).toBe('unsupported')
    })

    it('resolves with the result of requestPermission', async () => {
      vi.stubGlobal('Notification', {
        permission: 'default',
        requestPermission: vi.fn().mockResolvedValue('granted'),
      })
      expect(await requestNotificationPermission()).toBe('granted')
    })

    it('resolves "denied" when user denies', async () => {
      vi.stubGlobal('Notification', {
        permission: 'default',
        requestPermission: vi.fn().mockResolvedValue('denied'),
      })
      expect(await requestNotificationPermission()).toBe('denied')
    })
  })

  // ── AC4: Notification senders with streak count ──

  /** Create a constructable Notification mock that tracks instances */
  function mockNotificationGranted() {
    const instances: Array<{ title: string; options: NotificationOptions }> = []
    class MockNotification {
      static permission: NotificationPermission = 'granted'
      title: string
      options: NotificationOptions
      constructor(title: string, options: NotificationOptions = {}) {
        this.title = title
        this.options = options
        instances.push({ title, options })
      }
    }
    vi.stubGlobal('Notification', MockNotification)
    return instances
  }

  describe('sendDailyReminder', () => {
    it('does not send when permission is not granted', () => {
      vi.stubGlobal('Notification', { permission: 'denied' })
      sendDailyReminder(5)
      // If it tried to construct, it would throw — no error means it bailed out
    })

    it('sends notification with streak count in body when streak > 0', () => {
      const instances = mockNotificationGranted()
      sendDailyReminder(7)
      expect(instances).toHaveLength(1)
      expect(instances[0].title).toBe('Time to study!')
      expect(instances[0].options.body).toContain('7-day streak')
      expect(instances[0].options.tag).toBe('levelup-daily-reminder')
    })

    it('sends encouraging message when streak is 0', () => {
      const instances = mockNotificationGranted()
      sendDailyReminder(0)
      expect(instances[0].options.body).toContain('Start a new streak today')
    })
  })

  // ── AC5: Streak-at-risk notifications ──

  describe('sendStreakAtRiskNotification', () => {
    it('does not send when permission is not granted', () => {
      vi.stubGlobal('Notification', { permission: 'denied' })
      sendStreakAtRiskNotification(5)
    })

    it('sends notification with streak count', () => {
      const instances = mockNotificationGranted()
      sendStreakAtRiskNotification(12)
      expect(instances).toHaveLength(1)
      expect(instances[0].title).toBe('Your streak is still alive!')
      expect(instances[0].options.body).toContain('12-day streak')
      expect(instances[0].options.tag).toBe('levelup-streak-at-risk')
    })
  })

  // ── AC5: Streak-at-risk detection ──

  describe('getLastStudyTimestamp', () => {
    it('returns null when study log is empty', () => {
      expect(getLastStudyTimestamp()).toBeNull()
    })

    it('returns timestamp of most recent entry', () => {
      const ts = '2026-03-07T10:00:00.000Z'
      mockGetStudyLog.mockReturnValue([{ type: 'lesson_complete', courseId: 'c1', timestamp: ts }])
      expect(getLastStudyTimestamp()).toBe(new Date(ts).getTime())
    })
  })

  describe('isStreakAtRisk', () => {
    it('returns false when streak is paused', () => {
      mockGetStreakPauseStatus.mockReturnValue({
        enabled: true,
        startDate: new Date().toISOString(),
        days: 2,
      })
      expect(isStreakAtRisk()).toBe(false)
    })

    it('returns false when no study log entries exist', () => {
      expect(isStreakAtRisk()).toBe(false)
    })

    it('returns false when last study was less than 22 hours ago', () => {
      const recentTs = new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString() // 10 hours ago
      mockGetStudyLog.mockReturnValue([
        { type: 'lesson_complete', courseId: 'c1', timestamp: recentTs },
      ])
      expect(isStreakAtRisk()).toBe(false)
    })

    it('returns true when last study was 22+ hours ago', () => {
      const oldTs = new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString() // 23 hours ago
      mockGetStudyLog.mockReturnValue([
        { type: 'lesson_complete', courseId: 'c1', timestamp: oldTs },
      ])
      expect(isStreakAtRisk()).toBe(true)
    })

    it('returns true at exactly 22 hours', () => {
      const exactTs = new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString()
      mockGetStudyLog.mockReturnValue([
        { type: 'lesson_complete', courseId: 'c1', timestamp: exactTs },
      ])
      expect(isStreakAtRisk()).toBe(true)
    })
  })

  // ── Multi-tab dedup ──

  describe('hasNotifiedToday / markNotifiedToday', () => {
    it('returns false when key not set', () => {
      expect(hasNotifiedToday(LAST_DAILY_KEY)).toBe(false)
    })

    it('returns true after marking', () => {
      markNotifiedToday(LAST_DAILY_KEY)
      expect(hasNotifiedToday(LAST_DAILY_KEY)).toBe(true)
    })

    it('returns false for a different key', () => {
      markNotifiedToday(LAST_DAILY_KEY)
      expect(hasNotifiedToday(LAST_RISK_KEY)).toBe(false)
    })

    it('returns false when stored date is from yesterday', () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      localStorage.setItem(LAST_DAILY_KEY, yesterday)
      expect(hasNotifiedToday(LAST_DAILY_KEY)).toBe(false)
    })
  })
})
