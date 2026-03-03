/**
 * E2E tests for Story E04-S03: Automatic Study Session Logging
 *
 * Acceptance criteria:
 *   AC1: Create session on content mount with course/content metadata
 *   AC2: Record session end on navigation/visibility change
 *   AC3: Auto-pause after 5min idle, resume on activity
 *   AC4: Display aggregate total study time across courses
 *   AC5: Detect and close orphaned sessions on app load
 *
 * These tests follow RED-GREEN-REFACTOR TDD:
 *   - RED: All tests fail initially (feature not implemented)
 *   - GREEN: Implement minimum code to make tests pass
 *   - REFACTOR: Clean up while keeping tests green
 */
import { test, expect } from '../support/fixtures'

test.describe('Story E04-S03: Automatic Study Session Logging', () => {
  test.beforeEach(async ({ page, localStorage }) => {
    // Seed localStorage to prevent sidebar overlay (from MEMORY.md)
    await page.goto('/')
    await localStorage.seed({ 'eduvi-sidebar-v1': 'false' })
    await page.reload()
  })

  test('AC1: creates session record when user enters lesson player', async ({
    page,
    indexedDB,
  }) => {
    // GIVEN a user navigates into a course's focused content interface
    // (Assume we have a course imported and can navigate to a lesson)
    // TODO: Seed course data with indexedDB.seedImportedCourses()

    // WHEN the content interface mounts
    // Navigate to lesson player (route TBD, likely /courses/:courseId/:lessonId)
    await page.goto('/') // Placeholder — update to actual lesson route

    // THEN a new study session record is created with metadata
    const sessionExists = await page.evaluate(async () => {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('ElearningDB')
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })

      // Check if studySessions store exists and has records
      if (!db.objectStoreNames.contains('studySessions')) {
        db.close()
        return false
      }

      const tx = db.transaction('studySessions', 'readonly')
      const store = tx.objectStore('studySessions')
      const countReq = store.count()

      const count = await new Promise<number>((resolve, reject) => {
        countReq.onsuccess = () => resolve(countReq.result)
        countReq.onerror = () => reject(countReq.error)
      })

      db.close()
      return count > 0
    })

    expect(sessionExists).toBe(true)

    // AND session has required fields: date, start timestamp, courseId, contentItemId
    const session = await page.evaluate(async () => {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('ElearningDB')
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })

      const tx = db.transaction('studySessions', 'readonly')
      const store = tx.objectStore('studySessions')
      const getAllReq = store.getAll()

      const sessions = await new Promise<any[]>((resolve, reject) => {
        getAllReq.onsuccess = () => resolve(getAllReq.result)
        getAllReq.onerror = () => reject(getAllReq.error)
      })

      db.close()
      return sessions[0]
    })

    expect(session).toBeDefined()
    expect(session).toHaveProperty('startTimestamp')
    expect(session).toHaveProperty('courseId')
    expect(session).toHaveProperty('contentItemId')
    expect(session).toHaveProperty('date')
  })

  test('AC2: records session end timestamp on navigation away', async ({
    page,
  }) => {
    // GIVEN an active study session is in progress
    // TODO: Start a session by navigating to lesson player

    // WHEN the user navigates away
    await page.goto('/')
    await page.goto('/courses') // Navigate away from lesson player

    // THEN session end timestamp is recorded
    const sessionHasEndTime = await page.evaluate(async () => {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('ElearningDB')
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })

      if (!db.objectStoreNames.contains('studySessions')) {
        db.close()
        return false
      }

      const tx = db.transaction('studySessions', 'readonly')
      const store = tx.objectStore('studySessions')
      const sessions = await new Promise<any[]>((resolve, reject) => {
        const req = store.getAll()
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error)
      })

      db.close()

      if (sessions.length === 0) return false
      const lastSession = sessions[sessions.length - 1]
      return lastSession.endTimestamp !== undefined && lastSession.endTimestamp !== null
    })

    expect(sessionHasEndTime).toBe(true)

    // AND duration is calculated
    const sessionHasDuration = await page.evaluate(async () => {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('ElearningDB')
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })

      const tx = db.transaction('studySessions', 'readonly')
      const sessions = await new Promise<any[]>((resolve, reject) => {
        const req = tx.objectStore('studySessions').getAll()
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error)
      })

      db.close()
      const lastSession = sessions[sessions.length - 1]
      return typeof lastSession.duration === 'number' && lastSession.duration > 0
    })

    expect(sessionHasDuration).toBe(true)
  })

  test('AC3: auto-pauses session after 5 minutes of inactivity', async ({
    page,
  }) => {
    // GIVEN an active study session is in progress
    // TODO: Start session by navigating to lesson player

    // WHEN the user is idle for more than 5 minutes
    // Fast-forward time using page.clock (Playwright's clock API)
    await page.clock.install({ time: Date.now() })
    await page.clock.fastForward('5:01') // 5 minutes 1 second

    // THEN the session is automatically paused
    const sessionIsPaused = await page.evaluate(() => {
      // Check Zustand store for paused state
      // This assumes a global store or window property (TBD during implementation)
      const state = (window as any).sessionStore?.getState?.()
      return state?.isSessionPaused === true
    })

    expect(sessionIsPaused).toBe(true)

    // AND when user resumes activity, session continues
    await page.mouse.move(100, 100) // Simulate activity
    await page.waitForTimeout(100)

    const sessionIsResumed = await page.evaluate(() => {
      const state = (window as any).sessionStore?.getState?.()
      return state?.isSessionPaused === false
    })

    expect(sessionIsResumed).toBe(true)
  })

  test('AC4: displays aggregate total study time across all courses', async ({
    page,
    indexedDB,
  }) => {
    // GIVEN multiple study sessions have been logged across different courses
    await page.goto('/')

    // Seed study sessions into IndexedDB
    await page.evaluate(async () => {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('ElearningDB')
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })

      // Create studySessions store if it doesn't exist (will fail, but shows intent)
      // In reality, Dexie schema must define this first

      const sessions = [
        {
          id: 'session-1',
          courseId: 'course-1',
          startTimestamp: Date.now() - 7200000, // 2 hours ago
          endTimestamp: Date.now() - 3600000,   // 1 hour ago
          duration: 3600, // 1 hour in seconds
        },
        {
          id: 'session-2',
          courseId: 'course-2',
          startTimestamp: Date.now() - 1800000, // 30 min ago
          endTimestamp: Date.now(),
          duration: 1800, // 30 min in seconds
        },
      ]

      if (db.objectStoreNames.contains('studySessions')) {
        const tx = db.transaction('studySessions', 'readwrite')
        const store = tx.objectStore('studySessions')
        for (const session of sessions) {
          store.put(session)
        }
        await new Promise<void>((resolve, reject) => {
          tx.oncomplete = () => resolve()
          tx.onerror = () => reject(tx.error)
        })
      }

      db.close()
    })

    await page.reload()

    // WHEN the user views their total study time
    // (Location TBD — could be Overview, Reports, or dedicated Stats widget)
    // For now, check if data is calculable

    // THEN aggregate total is displayed
    const totalStudyTime = await page.evaluate(async () => {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('ElearningDB')
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })

      if (!db.objectStoreNames.contains('studySessions')) {
        db.close()
        return 0
      }

      const tx = db.transaction('studySessions', 'readonly')
      const sessions = await new Promise<any[]>((resolve, reject) => {
        const req = tx.objectStore('studySessions').getAll()
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error)
      })

      db.close()

      return sessions.reduce((total, s) => total + (s.duration || 0), 0)
    })

    expect(totalStudyTime).toBe(3600 + 1800) // 1.5 hours in seconds
  })

  test('AC5: detects and closes orphaned sessions on app load', async ({
    page,
  }) => {
    // GIVEN orphaned session records exist (start time but no end time)
    await page.goto('/')

    await page.evaluate(async () => {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('ElearningDB')
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })

      const orphanedSession = {
        id: 'orphaned-session-1',
        courseId: 'course-1',
        startTimestamp: Date.now() - 86400000, // 24 hours ago
        endTimestamp: null,
        lastActivityTimestamp: Date.now() - 86000000, // ~23h50m ago
      }

      if (db.objectStoreNames.contains('studySessions')) {
        const tx = db.transaction('studySessions', 'readwrite')
        tx.objectStore('studySessions').put(orphanedSession)
        await new Promise<void>((resolve, reject) => {
          tx.oncomplete = () => resolve()
          tx.onerror = () => reject(tx.error)
        })
      }

      db.close()
    })

    // WHEN the application next loads
    await page.reload()
    await page.waitForTimeout(500) // Allow cleanup logic to run

    // THEN orphaned sessions are closed with last activity timestamp
    const orphanedSessionClosed = await page.evaluate(async () => {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('ElearningDB')
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })

      if (!db.objectStoreNames.contains('studySessions')) {
        db.close()
        return false
      }

      const tx = db.transaction('studySessions', 'readonly')
      const session = await new Promise<any>((resolve, reject) => {
        const req = tx.objectStore('studySessions').get('orphaned-session-1')
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error)
      })

      db.close()

      if (!session) return false
      return session.endTimestamp !== null && session.endTimestamp === session.lastActivityTimestamp
    })

    expect(orphanedSessionClosed).toBe(true)
  })
})
