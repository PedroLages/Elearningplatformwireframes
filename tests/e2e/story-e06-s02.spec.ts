/**
 * ATDD tests for E06-S02: Track Challenge Progress
 *
 * RED phase — these tests define acceptance criteria and should FAIL
 * until the feature is implemented.
 */
import { test, expect } from '../support/fixtures'
import { createChallenge } from '../support/fixtures/factories/challenge-factory'
import type { Page } from '@playwright/test'

const DB_NAME = 'ElearningDB'

// ── Helpers ─────────────────────────────────────────────

async function goToChallenges(page: Page) {
  await page.goto('/challenges')
  await page.waitForLoadState('load')
}

/** Seed records into a named IndexedDB store with retry for Dexie init */
async function seedStore(page: Page, storeName: string, records: unknown[]) {
  await page.evaluate(
    async ({ dbName, store, data, maxRetries, retryDelay }) => {
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        const result = await new Promise<'ok' | 'store-missing'>((resolve, reject) => {
          const request = indexedDB.open(dbName)
          request.onsuccess = () => {
            const db = request.result
            if (!db.objectStoreNames.contains(store)) {
              db.close()
              resolve('store-missing')
              return
            }
            const tx = db.transaction(store, 'readwrite')
            const objectStore = tx.objectStore(store)
            for (const item of data) {
              objectStore.put(item)
            }
            tx.oncomplete = () => {
              db.close()
              resolve('ok')
            }
            tx.onerror = () => {
              db.close()
              reject(tx.error)
            }
          }
          request.onerror = () => reject(request.error)
        })
        if (result === 'ok') return
        await new Promise(r => setTimeout(r, retryDelay))
      }
      throw new Error(`Store "${store}" not found after ${maxRetries} retries`)
    },
    { dbName: DB_NAME, store: storeName, data: records, maxRetries: 10, retryDelay: 200 }
  )
}

// ── Setup ───────────────────────────────────────────────

test.beforeEach(async ({ page }) => {
  // Prevent tablet sidebar overlay from blocking interactions
  await page.addInitScript(() => {
    localStorage.setItem('eduvi-sidebar-v1', 'false')
  })
})

test.afterEach(async ({ page, indexedDB }) => {
  try {
    await indexedDB.clearStore('challenges')
    await indexedDB.clearStore('studySessions')
    await indexedDB.clearStore('contentProgress')
  } catch {
    // Page may already be closed
  }
})

// ── AC1: Dashboard widget displays active challenges ────

test.describe('AC1: Challenge dashboard widget', () => {
  test('displays active challenge with name, type icon, progress bar, percentage, and remaining time', async ({
    page,
  }) => {
    const challenge = createChallenge({
      name: 'Complete 10 Videos',
      type: 'completion',
      targetValue: 10,
      currentProgress: 3,
    })

    await goToChallenges(page)
    await seedStore(page, 'challenges', [challenge])
    await page.reload()

    // Challenge name visible
    await expect(page.getByText('Complete 10 Videos')).toBeVisible()

    // Progress bar exists
    await expect(page.getByRole('progressbar')).toBeVisible()

    // Percentage displayed (30%)
    await expect(page.getByText('30%')).toBeVisible()

    // Remaining time shown
    await expect(page.getByText(/remaining|days left/i)).toBeVisible()
  })
})

// ── AC2: Completion-based progress ──────────────────────

test.describe('AC2: Completion-based challenge progress', () => {
  test('counts completed videos since challenge creation date', async ({ page }) => {
    const createdAt = '2026-03-01T00:00:00.000Z'
    const challenge = createChallenge({
      name: 'Watch 5 Videos',
      type: 'completion',
      targetValue: 5,
      currentProgress: 0,
      createdAt,
    })

    await goToChallenges(page)
    await seedStore(page, 'challenges', [challenge])

    // Seed 3 completed content items after challenge creation
    const completedItems = [
      {
        courseId: 'course-1',
        itemId: 'lesson-1',
        status: 'completed',
        updatedAt: '2026-03-02T10:00:00.000Z',
      },
      {
        courseId: 'course-1',
        itemId: 'lesson-2',
        status: 'completed',
        updatedAt: '2026-03-03T10:00:00.000Z',
      },
      {
        courseId: 'course-2',
        itemId: 'lesson-3',
        status: 'completed',
        updatedAt: '2026-03-04T10:00:00.000Z',
      },
    ]
    await seedStore(page, 'contentProgress', completedItems)
    await page.reload()

    // Progress should reflect 3/5 = 60%
    await expect(page.getByText('60%')).toBeVisible()
  })
})

// ── AC3: Time-based progress ────────────────────────────

test.describe('AC3: Time-based challenge progress', () => {
  test('sums study session durations since challenge creation date', async ({ page }) => {
    const createdAt = '2026-03-01T00:00:00.000Z'
    const challenge = createChallenge({
      name: 'Study 10 Hours',
      type: 'time',
      targetValue: 10,
      currentProgress: 0,
      createdAt,
    })

    await goToChallenges(page)
    await seedStore(page, 'challenges', [challenge])

    // Seed study sessions totaling 4 hours (14400 seconds) after creation
    const sessions = [
      {
        id: crypto.randomUUID(),
        courseId: 'course-1',
        contentItemId: 'lesson-1',
        startTime: '2026-03-02T09:00:00.000Z',
        endTime: '2026-03-02T11:00:00.000Z',
        duration: 7200, // 2 hours
        idleTime: 0,
        videosWatched: [],
        lastActivity: '2026-03-02T11:00:00.000Z',
        sessionType: 'video',
      },
      {
        id: crypto.randomUUID(),
        courseId: 'course-1',
        contentItemId: 'lesson-2',
        startTime: '2026-03-03T14:00:00.000Z',
        endTime: '2026-03-03T16:00:00.000Z',
        duration: 7200, // 2 hours
        idleTime: 0,
        videosWatched: [],
        lastActivity: '2026-03-03T16:00:00.000Z',
        sessionType: 'video',
      },
    ]
    await seedStore(page, 'studySessions', sessions)
    await page.reload()

    // Progress should reflect 4/10 = 40%
    await expect(page.getByText('40%')).toBeVisible()
  })
})

// ── AC4: Streak-based progress ──────────────────────────

test.describe('AC4: Streak-based challenge progress', () => {
  test('reads streak count since challenge creation date', async ({ page }) => {
    const createdAt = '2026-03-01T00:00:00.000Z'
    const challenge = createChallenge({
      name: 'Maintain 30-Day Streak',
      type: 'streak',
      targetValue: 30,
      currentProgress: 0,
      createdAt,
    })

    await goToChallenges(page)
    await seedStore(page, 'challenges', [challenge])

    // Seed a 7-day streak via study log localStorage
    const studyLog = Array.from({ length: 7 }, (_, i) => {
      const date = new Date('2026-03-01')
      date.setDate(date.getDate() + i)
      return {
        type: 'lesson_complete',
        timestamp: date.toISOString(),
        courseId: 'course-1',
        lessonId: `lesson-${i + 1}`,
      }
    })

    await page.evaluate(log => {
      localStorage.setItem('study-log', JSON.stringify(log))
    }, studyLog)
    await page.reload()

    // Progress should reflect 7/30 ≈ 23%
    await expect(page.getByText('23%')).toBeVisible()
  })
})

// ── AC5: Expired challenges ─────────────────────────────

test.describe('AC5: Expired challenges', () => {
  test('shows expired challenge with muted style, separated from active', async ({ page }) => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const expiredDeadline = yesterday.toISOString().split('T')[0]

    const expiredChallenge = createChallenge({
      name: 'Expired Challenge',
      type: 'completion',
      targetValue: 20,
      currentProgress: 5,
      deadline: expiredDeadline,
    })

    const activeChallenge = createChallenge({
      name: 'Active Challenge',
      type: 'time',
      targetValue: 10,
      currentProgress: 2,
      deadline: '2030-12-31',
    })

    await goToChallenges(page)
    await seedStore(page, 'challenges', [expiredChallenge, activeChallenge])
    await page.reload()

    // Both challenges visible
    await expect(page.getByText('Expired Challenge')).toBeVisible()
    await expect(page.getByText('Active Challenge')).toBeVisible()

    // Expired section or group exists
    await expect(page.getByText(/expired/i)).toBeVisible()

    // Expired challenge has muted/dimmed styling (opacity or muted class)
    const expiredCard = page.getByText('Expired Challenge').locator('closest=[data-testid]')
    // This will need to be refined once implementation data-testids are known
  })
})

// ── AC6: Empty state ────────────────────────────────────

test.describe('AC6: Empty state', () => {
  test('displays empty state with message and CTA when no active challenges exist', async ({
    page,
  }) => {
    await goToChallenges(page)

    // Empty state message
    await expect(page.getByText(/no.*challenge|create.*first/i)).toBeVisible()

    // CTA button linking to create challenge
    await expect(
      page.getByRole('button', { name: /create.*challenge|new.*challenge/i })
    ).toBeVisible()
  })
})
