import { getStudyLog } from './studyLog'

export function getStudyStreak(): {
  current: number
  longest: number
  lastStudyDate: string | null
} {
  const logs = getStudyLog()
  if (logs.length === 0) {
    return { current: 0, longest: 0, lastStudyDate: null }
  }

  // Get unique study dates
  const studyDates = new Set(logs.map(log => new Date(log.timestamp).toDateString()))

  const sortedDates = Array.from(studyDates)
    .map(d => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime())

  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 1

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // Check if studied today or yesterday for current streak
  const lastStudy = sortedDates[0]
  lastStudy.setHours(0, 0, 0, 0)

  if (lastStudy.getTime() === today.getTime() || lastStudy.getTime() === yesterday.getTime()) {
    currentStreak = 1

    // Count consecutive days
    for (let i = 1; i < sortedDates.length; i++) {
      const current = new Date(sortedDates[i])
      current.setHours(0, 0, 0, 0)

      const prev = new Date(sortedDates[i - 1])
      prev.setHours(0, 0, 0, 0)

      const diffDays = (prev.getTime() - current.getTime()) / (1000 * 60 * 60 * 24)

      if (diffDays === 1) {
        currentStreak++
      } else {
        break
      }
    }
  }

  // Calculate longest streak
  for (let i = 1; i < sortedDates.length; i++) {
    const current = new Date(sortedDates[i])
    current.setHours(0, 0, 0, 0)

    const prev = new Date(sortedDates[i - 1])
    prev.setHours(0, 0, 0, 0)

    const diffDays = (prev.getTime() - current.getTime()) / (1000 * 60 * 60 * 24)

    if (diffDays === 1) {
      tempStreak++
    } else {
      longestStreak = Math.max(longestStreak, tempStreak)
      tempStreak = 1
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak, currentStreak)

  return {
    current: currentStreak,
    longest: longestStreak,
    lastStudyDate: sortedDates[0]?.toISOString() || null,
  }
}
