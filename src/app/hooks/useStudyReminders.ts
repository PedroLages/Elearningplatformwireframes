import { useEffect, useRef, useCallback } from 'react'
import {
  getReminderSettings,
  getNotificationPermission,
  sendDailyReminder,
  sendStreakAtRiskNotification,
  isStreakAtRisk,
  hasNotifiedToday,
  markNotifiedToday,
  LAST_DAILY_KEY,
  LAST_RISK_KEY,
  type StudyReminderSettings,
} from '@/lib/studyReminders'
import { getCurrentStreak } from '@/lib/studyLog'

/**
 * Scheduling hook for study reminders.
 * Mounts in Layout.tsx — runs intervals while tab is open.
 */
export function useStudyReminders(): void {
  const settingsRef = useRef<StudyReminderSettings>(getReminderSettings())
  const dailyIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const riskIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearIntervals = useCallback(() => {
    if (dailyIntervalRef.current) {
      clearInterval(dailyIntervalRef.current)
      dailyIntervalRef.current = null
    }
    if (riskIntervalRef.current) {
      clearInterval(riskIntervalRef.current)
      riskIntervalRef.current = null
    }
  }, [])

  const startIntervals = useCallback(() => {
    clearIntervals()

    const settings = settingsRef.current
    if (!settings.enabled || getNotificationPermission() !== 'granted') return

    // Daily reminder check — every 60s
    if (settings.dailyReminder) {
      dailyIntervalRef.current = setInterval(() => {
        if (hasNotifiedToday(LAST_DAILY_KEY)) return

        const now = new Date()
        const parts = settings.dailyReminderTime.split(':')
        const targetH = parseInt(parts[0], 10)
        const targetM = parseInt(parts[1], 10)
        if (Number.isNaN(targetH) || Number.isNaN(targetM)) return

        const currentMinutes = now.getHours() * 60 + now.getMinutes()
        const targetMinutes = targetH * 60 + targetM

        // Fire if current time is at or just past target (within 2-minute window)
        const diff = currentMinutes - targetMinutes
        if (diff >= 0 && diff <= 1) {
          sendDailyReminder(getCurrentStreak())
          markNotifiedToday(LAST_DAILY_KEY)
        }
      }, 60_000)
    }

    // Streak-at-risk check — every 5 minutes
    if (settings.streakAtRisk) {
      riskIntervalRef.current = setInterval(() => {
        if (hasNotifiedToday(LAST_RISK_KEY)) return

        if (isStreakAtRisk()) {
          sendStreakAtRiskNotification(getCurrentStreak())
          markNotifiedToday(LAST_RISK_KEY)
        }
      }, 300_000)
    }
  }, [clearIntervals])

  useEffect(() => {
    settingsRef.current = getReminderSettings()
    startIntervals()

    function handleSettingsUpdate() {
      settingsRef.current = getReminderSettings()
      startIntervals()
    }

    window.addEventListener('study-reminders-updated', handleSettingsUpdate)

    return () => {
      clearIntervals()
      window.removeEventListener('study-reminders-updated', handleSettingsUpdate)
    }
  }, [startIntervals, clearIntervals])
}
