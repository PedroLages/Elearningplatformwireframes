import type { StreakMilestone } from '@/data/types'
import { toLocalDateString } from '@/lib/studyLog'

const STORAGE_KEY = 'streak-milestones'

export const MILESTONE_VALUES = [7, 30, 60, 100] as const

// ── Storage ──────────────────────────────────────────────────

export function getMilestones(): StreakMilestone[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveMilestones(milestones: StreakMilestone[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(milestones))
}

export function addMilestone(value: number, streakStartDate: string): StreakMilestone {
  const milestone: StreakMilestone = {
    id: crypto.randomUUID(),
    milestoneValue: value,
    earnedAt: new Date().toISOString(),
    streakStartDate,
  }
  const milestones = getMilestones()
  milestones.push(milestone)
  saveMilestones(milestones)
  return milestone
}

// ── Detection ────────────────────────────────────────────────

/**
 * Compute the start date of the current streak.
 * streak = N means the user studied every day for N days including today (or yesterday).
 * The start date is approximately `today - (N-1)` days.
 */
function getStreakStartDate(currentStreak: number): string {
  const d = new Date()
  d.setDate(d.getDate() - (currentStreak - 1))
  return toLocalDateString(d)
}

/**
 * Return milestone values that the current streak has reached
 * but haven't been celebrated in this streak instance.
 */
export function getUncelebratedMilestones(currentStreak: number): number[] {
  if (currentStreak < MILESTONE_VALUES[0]) return []

  const streakStart = getStreakStartDate(currentStreak)
  const existing = getMilestones()

  return MILESTONE_VALUES.filter(value => {
    if (currentStreak < value) return false
    // Check if already celebrated in this streak instance
    const alreadyCelebrated = existing.some(
      m => m.milestoneValue === value && m.streakStartDate === streakStart
    )
    return !alreadyCelebrated
  })
}

/**
 * Detect uncelebrated milestones, persist them, and return the list
 * so the caller can fire toasts + confetti.
 */
export function detectAndRecordMilestones(currentStreak: number): StreakMilestone[] {
  const uncelebrated = getUncelebratedMilestones(currentStreak)
  if (uncelebrated.length === 0) return []

  const streakStart = getStreakStartDate(currentStreak)
  return uncelebrated.map(value => addMilestone(value, streakStart))
}
