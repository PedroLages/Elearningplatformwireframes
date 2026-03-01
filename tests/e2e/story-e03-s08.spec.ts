/**
 * Story 3.8: Global Notes Dashboard — ATDD Acceptance Tests
 *
 * Tests verify:
 *   - AC1: Notes page displays all notes across courses with context
 *   - AC2: Full-text search filters notes in real-time with highlights
 *   - AC3: Tag-based filtering with AND semantics when combined with search
 *   - AC4: Sort controls (Most Recent, Oldest First, By Course)
 *   - AC5: Expand note card with full content and "Open in Lesson" navigation
 *
 * RED phase — these tests are written before implementation and should fail initially.
 */
import { test, expect } from '../support/fixtures'
import { navigateAndWait } from '../support/helpers/navigation'

const NOTES_URL = '/notes'

/** Suppress sidebar overlay and navigate to Notes page. */
async function goToNotes(page: Parameters<typeof navigateAndWait>[0]) {
  await page.addInitScript(() => {
    localStorage.setItem('eduvi-sidebar-v1', 'false')
  })
  await navigateAndWait(page, NOTES_URL)
}

/** Seed notes into IndexedDB across two courses. */
async function seedNotes(page: Parameters<typeof navigateAndWait>[0]) {
  await page.evaluate(() => {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('ElearningDB')
      request.onsuccess = () => {
        const db = request.result
        if (!db.objectStoreNames.contains('notes')) {
          db.close()
          reject(new Error('notes store not found'))
          return
        }
        const tx = db.transaction('notes', 'readwrite')
        const store = tx.objectStore('notes')

        const notes = [
          {
            id: 'global-note-1',
            courseId: 'operative-six',
            videoId: 'op6-introduction',
            content: '<p>Introduction notes about the operative training program.</p>',
            timestamp: 30,
            createdAt: '2026-02-18T10:00:00.000Z',
            updatedAt: '2026-02-28T10:00:00.000Z',
            tags: ['overview', 'training'],
          },
          {
            id: 'global-note-2',
            courseId: 'operative-six',
            videoId: 'op6-pillars-of-influence',
            content: '<p>Key takeaways from the pillars of influence lesson.</p>',
            timestamp: 120,
            createdAt: '2026-02-19T14:30:00.000Z',
            updatedAt: '2026-02-27T09:00:00.000Z',
            tags: ['influence', 'psychology'],
          },
          {
            id: 'global-note-3',
            courseId: 'authority',
            videoId: 'authority-lesson-01-communication-laws',
            content: '<p>Communication laws and strategies for authority building.</p>',
            timestamp: 60,
            createdAt: '2026-02-20T08:00:00.000Z',
            updatedAt: '2026-02-26T15:00:00.000Z',
            tags: ['communication', 'training'],
          },
          {
            id: 'global-note-4',
            courseId: 'authority',
            videoId: 'authority-lesson-02-composure-confidence',
            content: '<p>Composure techniques and confidence building exercises.</p>',
            timestamp: 45,
            createdAt: '2026-02-21T11:00:00.000Z',
            updatedAt: '2026-02-25T12:00:00.000Z',
            tags: ['confidence', 'psychology'],
          },
        ]

        for (const note of notes) {
          store.put(note)
        }

        tx.oncomplete = () => { db.close(); resolve() }
        tx.onerror = () => { db.close(); reject(tx.error) }
      }
      request.onerror = () => reject(request.error)
    })
  })
}

/** Clear all notes from IndexedDB. */
async function clearNotes(page: Parameters<typeof navigateAndWait>[0]) {
  await page.evaluate(() => {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('ElearningDB')
      request.onsuccess = () => {
        const db = request.result
        if (!db.objectStoreNames.contains('notes')) {
          db.close()
          resolve()
          return
        }
        const tx = db.transaction('notes', 'readwrite')
        tx.objectStore('notes').clear()
        tx.oncomplete = () => { db.close(); resolve() }
        tx.onerror = () => { db.close(); reject(tx.error) }
      }
      request.onerror = () => reject(request.error)
    })
  })
}

test.describe('AC1: Notes page displays all notes across courses', () => {
  test('navigates to Notes page via sidebar', async ({ page }) => {
    await goToNotes(page)

    // Notes nav link should be active
    const navLink = page.getByRole('link', { name: /notes/i })
    await expect(navLink).toBeVisible()
  })

  test('displays note cards with course context', async ({ page }) => {
    await goToNotes(page)
    await seedNotes(page)
    await page.reload()

    // Total note count in header
    await expect(page.getByText(/my notes/i)).toBeVisible()
    await expect(page.getByText('4')).toBeVisible()

    // Note cards show course title, lesson title, content preview, tags, date
    await expect(page.getByText('The Operative - Six')).toBeVisible()
    await expect(page.getByText('Authority')).toBeVisible()
    await expect(page.getByText(/introduction notes about/i)).toBeVisible()
    await expect(page.getByText(/communication laws and strategies/i)).toBeVisible()
  })

  test('notes are sorted by most recently updated first', async ({ page }) => {
    await goToNotes(page)
    await seedNotes(page)
    await page.reload()

    // First card should be the most recently updated note (global-note-1, Feb 28)
    const noteCards = page.locator('[data-testid="note-card"]')
    await expect(noteCards.first()).toContainText(/introduction notes about/i)
  })

  test('shows tags as badges on note cards', async ({ page }) => {
    await goToNotes(page)
    await seedNotes(page)
    await page.reload()

    await expect(page.getByText('overview')).toBeVisible()
    await expect(page.getByText('training').first()).toBeVisible()
    await expect(page.getByText('influence')).toBeVisible()
    await expect(page.getByText('psychology').first()).toBeVisible()
  })

  test('shows empty state when no notes exist', async ({ page }) => {
    await goToNotes(page)
    await clearNotes(page)
    await page.reload()

    await expect(page.getByText(/no notes/i)).toBeVisible()
  })
})

test.describe('AC2: Full-text search filters notes in real-time', () => {
  test('search input filters notes by content', async ({ page }) => {
    await goToNotes(page)
    await seedNotes(page)
    await page.reload()

    const searchInput = page.getByRole('searchbox').or(page.getByPlaceholder(/search/i))
    await searchInput.fill('influence')

    // Should show the pillars of influence note
    await expect(page.getByText(/pillars of influence/i)).toBeVisible()

    // Should NOT show unrelated notes
    await expect(page.getByText(/composure techniques/i)).not.toBeVisible()
  })

  test('highlights matching terms in search results', async ({ page }) => {
    await goToNotes(page)
    await seedNotes(page)
    await page.reload()

    const searchInput = page.getByRole('searchbox').or(page.getByPlaceholder(/search/i))
    await searchInput.fill('influence')

    // Highlighted matches should use <mark> elements
    await expect(page.locator('mark').filter({ hasText: /influence/i })).toBeVisible()
  })

  test('shows no results empty state', async ({ page }) => {
    await goToNotes(page)
    await seedNotes(page)
    await page.reload()

    const searchInput = page.getByRole('searchbox').or(page.getByPlaceholder(/search/i))
    await searchInput.fill('xyznonexistent')

    await expect(page.getByText(/no results/i)).toBeVisible()
  })
})

test.describe('AC3: Tag-based filtering', () => {
  test('clicking a tag badge filters notes to that tag', async ({ page }) => {
    await goToNotes(page)
    await seedNotes(page)
    await page.reload()

    // Click the "psychology" tag
    await page.getByText('psychology').first().click()

    // Should show notes with "psychology" tag (note-2 and note-4)
    await expect(page.getByText(/pillars of influence/i)).toBeVisible()
    await expect(page.getByText(/composure techniques/i)).toBeVisible()

    // Should NOT show notes without "psychology" tag
    await expect(page.getByText(/introduction notes about/i)).not.toBeVisible()
  })

  test('active tag filter is visually indicated', async ({ page }) => {
    await goToNotes(page)
    await seedNotes(page)
    await page.reload()

    // Click a tag in the filter bar
    await page.getByText('training').first().click()

    // Active tag should have distinct styling (blue background)
    const activeChip = page.locator('[data-active="true"]').or(
      page.locator('.bg-blue-600'),
    )
    await expect(activeChip.filter({ hasText: 'training' })).toBeVisible()
  })

  test('clearing tag filter returns all notes', async ({ page }) => {
    await goToNotes(page)
    await seedNotes(page)
    await page.reload()

    // Activate filter
    await page.getByText('training').first().click()
    // Click again to deactivate
    await page.getByText('training').first().click()

    // All 4 notes should be visible again
    const noteCards = page.locator('[data-testid="note-card"]')
    await expect(noteCards).toHaveCount(4)
  })

  test('tag filter AND search combine with AND semantics', async ({ page }) => {
    await goToNotes(page)
    await seedNotes(page)
    await page.reload()

    // Filter by "training" tag (matches note-1 and note-3)
    await page.getByText('training').first().click()

    // Then search for "operative" (matches only note-1 from "training" tagged notes)
    const searchInput = page.getByRole('searchbox').or(page.getByPlaceholder(/search/i))
    await searchInput.fill('operative')

    // Only note-1 should match both criteria
    await expect(page.getByText(/introduction notes about/i)).toBeVisible()
    await expect(page.getByText(/communication laws/i)).not.toBeVisible()
  })
})

test.describe('AC4: Sort controls', () => {
  test('sort dropdown displays with default "Most Recent"', async ({ page }) => {
    await goToNotes(page)
    await seedNotes(page)
    await page.reload()

    const sortTrigger = page.getByRole('combobox').or(page.getByRole('button', { name: /sort|most recent/i }))
    await expect(sortTrigger).toBeVisible()
    await expect(sortTrigger).toContainText(/most recent/i)
  })

  test('sorting by "Oldest First" reverses order', async ({ page }) => {
    await goToNotes(page)
    await seedNotes(page)
    await page.reload()

    // Open sort dropdown and select Oldest First
    const sortTrigger = page.getByRole('combobox').or(page.getByRole('button', { name: /sort|most recent/i }))
    await sortTrigger.click()
    await page.getByText(/oldest first/i).click()

    // First card should now be the oldest updated note (global-note-4, Feb 25)
    const noteCards = page.locator('[data-testid="note-card"]')
    await expect(noteCards.first()).toContainText(/composure techniques/i)
  })

  test('sorting by "By Course" groups notes under course headings', async ({ page }) => {
    await goToNotes(page)
    await seedNotes(page)
    await page.reload()

    // Open sort dropdown and select By Course
    const sortTrigger = page.getByRole('combobox').or(page.getByRole('button', { name: /sort|most recent/i }))
    await sortTrigger.click()
    await page.getByText(/by course/i).click()

    // Course group headings should appear
    await expect(page.getByRole('heading', { name: /authority/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /operative/i })).toBeVisible()
  })
})

test.describe('AC5: Expand note card with navigation', () => {
  test('clicking note card expands to show full content', async ({ page }) => {
    await goToNotes(page)
    await seedNotes(page)
    await page.reload()

    // Click first note card to expand
    await page.locator('[data-testid="note-card"]').first().click()

    // Full TipTap content should render
    await expect(
      page.locator('.ProseMirror').filter({ hasText: /introduction notes about the operative training program/i }),
    ).toBeVisible()
  })

  test('"Open in Lesson" button navigates to source video', async ({ page }) => {
    await goToNotes(page)
    await seedNotes(page)
    await page.reload()

    // Expand the first note card
    await page.locator('[data-testid="note-card"]').first().click()

    // Click "Open in Lesson" button
    await page.getByRole('button', { name: /open in lesson/i }).or(
      page.getByRole('link', { name: /open in lesson/i }),
    ).click()

    // Should navigate to lesson player with notes panel and timestamp
    await expect(page).toHaveURL(/courses\/operative-six\/op6-introduction/)
    await expect(page).toHaveURL(/panel=notes/)
    await expect(page).toHaveURL(/t=30/)
  })

  test('timestamp in expanded note seeks video when clicked', async ({ page }) => {
    await goToNotes(page)
    await seedNotes(page)
    await page.reload()

    // Expand note with timestamp
    await page.locator('[data-testid="note-card"]').first().click()

    // Timestamp link should be visible (0:30 for 30 seconds)
    const timestampLink = page.getByText('0:30')
    await expect(timestampLink).toBeVisible()
  })
})
