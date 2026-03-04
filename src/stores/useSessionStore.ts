import { create } from 'zustand'
import { db } from '@/db'
import type { StudySession } from '@/data/types'
import { persistWithRetry } from '@/lib/persistWithRetry'

interface SessionState {
  activeSession: StudySession | null
  sessions: StudySession[]
  isLoading: boolean
  error: string | null

  startSession: (courseId: string, contentItemId: string, sessionType: 'video' | 'pdf' | 'mixed') => Promise<void>
  updateLastActivity: (timestamp?: string) => void
  pauseSession: () => Promise<void>
  resumeSession: () => void
  endSession: () => Promise<void>
  loadSessionStats: (courseId?: string) => Promise<void>
  recoverOrphanedSessions: () => Promise<void>
  getTotalStudyTime: (courseId?: string) => number
}

export const useSessionStore = create<SessionState>((set, get) => ({
  activeSession: null,
  sessions: [],
  isLoading: false,
  error: null,

  startSession: async (courseId: string, contentItemId: string, sessionType: 'video' | 'pdf' | 'mixed') => {
    const { activeSession, endSession } = get()

    // End any existing active session first
    if (activeSession) {
      await endSession()
    }

    const now = new Date().toISOString()
    const newSession: StudySession = {
      id: crypto.randomUUID(),
      courseId,
      contentItemId,
      startTime: now,
      endTime: undefined,
      duration: 0,
      idleTime: 0,
      videosWatched: [],
      lastActivity: now,
      sessionType,
    }

    // Optimistic update
    set({ activeSession: newSession, error: null })

    try {
      await persistWithRetry(async () => {
        await db.studySessions.add(newSession)
      })
    } catch (error) {
      // Rollback on failure
      set({ activeSession: null, error: 'Failed to start session' })
      console.error('[SessionStore] Failed to start session:', error)
    }
  },

  updateLastActivity: (timestamp?: string) => {
    const { activeSession } = get()
    if (!activeSession) return

    const now = timestamp || new Date().toISOString()
    set({
      activeSession: { ...activeSession, lastActivity: now },
    })
  },

  pauseSession: async () => {
    const { activeSession } = get()
    if (!activeSession) return

    const now = new Date().toISOString()
    const lastActivityTime = new Date(activeSession.lastActivity).getTime()
    const currentTime = new Date(now).getTime()
    const activeSeconds = Math.floor((currentTime - lastActivityTime) / 1000)

    const updatedSession: StudySession = {
      ...activeSession,
      duration: activeSession.duration + activeSeconds,
      lastActivity: now,
    }

    // Optimistic update
    set({ activeSession: updatedSession, error: null })

    try {
      await persistWithRetry(async () => {
        await db.studySessions.put(updatedSession)
      })
    } catch (error) {
      // Rollback on failure
      set({ activeSession, error: 'Failed to pause session' })
      console.error('[SessionStore] Failed to pause session:', error)
    }
  },

  resumeSession: () => {
    const { activeSession } = get()
    if (!activeSession) return

    const now = new Date().toISOString()
    set({
      activeSession: { ...activeSession, lastActivity: now },
    })
  },

  endSession: async () => {
    const { activeSession } = get()
    if (!activeSession) return

    const now = new Date().toISOString()
    const lastActivityTime = new Date(activeSession.lastActivity).getTime()
    const currentTime = new Date(now).getTime()
    const activeSeconds = Math.floor((currentTime - lastActivityTime) / 1000)

    const closedSession: StudySession = {
      ...activeSession,
      endTime: now,
      duration: activeSession.duration + activeSeconds,
    }

    // Optimistic update
    set({ activeSession: null, error: null })

    try {
      await persistWithRetry(async () => {
        await db.studySessions.put(closedSession)
      })
    } catch (error) {
      // Rollback on failure
      set({ activeSession, error: 'Failed to end session' })
      console.error('[SessionStore] Failed to end session:', error)
    }
  },

  loadSessionStats: async (courseId?: string) => {
    set({ isLoading: true, error: null })
    try {
      let sessions: StudySession[]
      if (courseId) {
        sessions = await db.studySessions.where({ courseId }).toArray()
      } else {
        sessions = await db.studySessions.toArray()
      }
      set({ sessions, isLoading: false })
    } catch (error) {
      set({ isLoading: false, error: 'Failed to load session stats' })
      console.error('[SessionStore] Failed to load sessions:', error)
    }
  },

  recoverOrphanedSessions: async () => {
    try {
      // Find sessions where endTime is undefined (orphaned)
      const orphanedSessions = await db.studySessions
        .filter(session => session.endTime === undefined)
        .toArray()

      if (orphanedSessions.length === 0) {
        console.log('[SessionStore] No orphaned sessions to recover')
        return
      }

      // Close each orphaned session with lastActivity timestamp
      for (const session of orphanedSessions) {
        const lastActivityTime = new Date(session.lastActivity).getTime()
        const startTime = new Date(session.startTime).getTime()
        const totalSeconds = Math.floor((lastActivityTime - startTime) / 1000)

        const closedSession: StudySession = {
          ...session,
          endTime: session.lastActivity,
          duration: Math.max(session.duration, totalSeconds), // Use calculated if greater
        }

        await db.studySessions.put(closedSession)
      }

      console.log(`[SessionStore] Recovered ${orphanedSessions.length} orphaned session(s)`)
    } catch (error) {
      console.error('[SessionStore] Failed to recover orphaned sessions:', error)
    }
  },

  getTotalStudyTime: (courseId?: string) => {
    const { sessions } = get()

    let filteredSessions = sessions
    if (courseId) {
      filteredSessions = sessions.filter(s => s.courseId === courseId)
    }

    return filteredSessions.reduce((total, session) => {
      // Only count completed sessions (with endTime)
      return session.endTime ? total + session.duration : total
    }, 0)
  },
}))
