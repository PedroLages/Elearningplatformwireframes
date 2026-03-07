import { db } from '@/db'
import { getCurrentStreak } from '@/lib/studyLog'
import type { Challenge } from '@/data/types'

/**
 * Count completed content items since the challenge was created.
 * Uses the `status` index on contentProgress for efficient querying.
 */
export async function calculateCompletionProgress(challenge: Challenge): Promise<number> {
  return db.contentProgress
    .where('status')
    .equals('completed')
    .filter(p => new Date(p.updatedAt).getTime() >= new Date(challenge.createdAt).getTime())
    .count()
}

/**
 * Sum study session durations since challenge creation, converted to hours.
 * Uses the `duration` field (active seconds, idle time excluded).
 */
export async function calculateTimeProgress(challenge: Challenge): Promise<number> {
  const sessions = await db.studySessions
    .where('startTime')
    .above(challenge.createdAt)
    .filter(s => s.endTime !== undefined)
    .toArray()

  const totalSeconds = sessions.reduce((sum, s) => sum + s.duration, 0)
  return totalSeconds / 3600
}

/**
 * Read current streak from study-log localStorage.
 * Streak is global (not scoped to challenge creation date).
 */
export function calculateStreakProgress(): number {
  return getCurrentStreak()
}

/** Dispatch to the appropriate calculator based on challenge type. */
export async function calculateProgress(challenge: Challenge): Promise<number> {
  switch (challenge.type) {
    case 'completion':
      return calculateCompletionProgress(challenge)
    case 'time':
      return calculateTimeProgress(challenge)
    case 'streak':
      return calculateStreakProgress()
  }
}
