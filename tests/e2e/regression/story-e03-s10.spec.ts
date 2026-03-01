/**
 * Story 3.10: Note Export — ATDD Acceptance Tests
 *
 * Tests verify:
 *   - AC1: Export action available on Notes page and presents export options
 *   - AC2: Notes exported as Markdown with YAML frontmatter (title, course, tags, dates)
 *   - AC3: Timestamps, images, and rich formatting preserved in Markdown export
 *   - AC4: Multi-note export bundles files with sanitized filenames
 *   - AC5: Export summary shows count, size, and any failures
 */
import { test, expect } from '../support/fixtures'
import { navigateAndWait } from '../support/helpers/navigation'

const NOTES_URL = '/notes'

/** Suppress sidebar overlay and navigate to notes page. */
async function goToNotes(page: Parameters<typeof navigateAndWait>[0]) {
  await page.addInitScript(() => {
    localStorage.setItem('eduvi-sidebar-v1', 'false')
  })
  await navigateAndWait(page, NOTES_URL)
}

/** Seed notes into IndexedDB for export testing. */
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
            id: 'note-1',
            courseId: 'operative-six',
            videoId: 'op6-introduction',
            content: '<h1>Introduction Notes</h1><p>Key concepts from the intro video.</p>',
            tags: ['introduction', 'fundamentals'],
            createdAt: '2026-02-28T10:00:00.000Z',
            updatedAt: '2026-02-28T11:00:00.000Z',
          },
          {
            id: 'note-2',
            courseId: 'operative-six',
            videoId: 'op6-pillars-of-influence',
            content:
              '<p>Timestamp link: <a href="video://op6-pillars-of-influence#t=120">[02:00]</a></p><p>Important concept here.</p>',
            tags: ['influence', 'psychology'],
            timestamp: 120,
            createdAt: '2026-03-01T09:00:00.000Z',
            updatedAt: '2026-03-01T09:30:00.000Z',
          },
          {
            id: 'note-3',
            courseId: 'design-thinking-101',
            videoId: 'dt-empathy-mapping',
            content: '<p>Empathy mapping techniques and best practices.</p>',
            tags: ['design-thinking', 'empathy'],
            createdAt: '2026-02-27T14:30:00.000Z',
            updatedAt: '2026-02-27T15:00:00.000Z',
          },
        ]

        for (const note of notes) {
          store.put(note)
        }

        tx.oncomplete = () => {
          db.close()
          resolve()
        }
        tx.onerror = () => {
          db.close()
          reject(tx.error)
        }
      }
      request.onerror = () => reject(request.error)
    })
  })
}

// ────────────────────────────────────────────────────────────────
// AC1: Export action available and presents options
// ────────────────────────────────────────────────────────────────

test.describe('AC1: Export action on Notes page', () => {
  test('export button is visible on the Notes page', async ({ page }) => {
    await goToNotes(page)
    await seedNotes(page)
    await page.reload()
    await page.waitForLoadState('domcontentloaded')

    const exportButton = page.getByTestId('export-notes-button')
    await expect(exportButton).toBeVisible()
  })

  test('clicking export opens an options dialog', async ({ page }) => {
    await goToNotes(page)
    await seedNotes(page)
    await page.reload()
    await page.waitForLoadState('domcontentloaded')

    await page.getByTestId('export-notes-button').click()

    const dialog = page.getByTestId('export-notes-dialog')
    await expect(dialog).toBeVisible()

    // Should present export scope options (all notes vs course-specific)
    await expect(dialog.getByText(/all notes/i)).toBeVisible()
  })
})

// ────────────────────────────────────────────────────────────────
// AC2: Markdown export with YAML frontmatter
// ────────────────────────────────────────────────────────────────

test.describe('AC2: Markdown with YAML frontmatter', () => {
  test('exported file contains YAML frontmatter with required fields', async ({ page }) => {
    await goToNotes(page)
    await seedNotes(page)
    await page.reload()
    await page.waitForLoadState('domcontentloaded')

    // Trigger export and wait for download
    const downloadPromise = page.waitForEvent('download')
    await page.getByTestId('export-notes-button').click()
    await page.getByTestId('export-notes-dialog').getByTestId('confirm-export').click()

    const download = await downloadPromise
    const content = await (await download.createReadStream())
      .toArray()
      .then(chunks => Buffer.concat(chunks).toString('utf-8'))

    // YAML frontmatter should contain required metadata
    expect(content).toContain('---')
    expect(content).toMatch(/tags:/)
    expect(content).toMatch(/created:/)
    expect(content).toMatch(/updated:/)
    expect(content).toMatch(/course:/)
    expect(content).toMatch(/title:/)
    expect(content).toMatch(/video:/)
  })
})

// ────────────────────────────────────────────────────────────────
// AC3: Rich content preserved in export
// ────────────────────────────────────────────────────────────────

test.describe('AC3: Timestamps and rich formatting preserved', () => {
  test('timestamp links are preserved in exported Markdown', async ({ page }) => {
    await goToNotes(page)
    await seedNotes(page)
    await page.reload()
    await page.waitForLoadState('domcontentloaded')

    const downloadPromise = page.waitForEvent('download')
    await page.getByTestId('export-notes-button').click()
    await page.getByTestId('export-notes-dialog').getByTestId('confirm-export').click()

    const download = await downloadPromise
    const content = await (await download.createReadStream())
      .toArray()
      .then(chunks => Buffer.concat(chunks).toString('utf-8'))

    // Timestamp should be preserved in some recognizable format
    expect(content).toMatch(/\[?\d{1,2}:\d{2}\]?/)
  })
})

// ────────────────────────────────────────────────────────────────
// AC4: Multi-note bundle with sanitized filenames
// ────────────────────────────────────────────────────────────────

test.describe('AC4: Multi-note bundled export', () => {
  test('multiple notes export as a downloadable bundle', async ({ page }) => {
    await goToNotes(page)
    await seedNotes(page)
    await page.reload()
    await page.waitForLoadState('domcontentloaded')

    const downloadPromise = page.waitForEvent('download')
    await page.getByTestId('export-notes-button').click()
    await page.getByTestId('export-notes-dialog').getByTestId('confirm-export').click()

    const download = await downloadPromise
    const filename = download.suggestedFilename()

    // Multi-note export should produce a ZIP or combined file
    expect(filename).toMatch(/\.(zip|md)$/i)
    // Filename should be sanitized (no special characters that break filesystems)
    expect(filename).not.toMatch(/[<>:"/\\|?*]/)
    // ZIP filename or contained files should reference course/lesson content
    expect(filename.toLowerCase()).toMatch(/notes/)
  })
})

// ────────────────────────────────────────────────────────────────
// AC5: Export summary with count and size
// ────────────────────────────────────────────────────────────────

test.describe('AC5: Export completion summary', () => {
  test('summary shows number of notes exported after completion', async ({ page }) => {
    await goToNotes(page)
    await seedNotes(page)
    await page.reload()
    await page.waitForLoadState('domcontentloaded')

    await page.getByTestId('export-notes-button').click()
    await page.getByTestId('export-notes-dialog').getByTestId('confirm-export').click()

    // After export completes, summary should be visible
    const summary = page.getByTestId('export-summary')
    await expect(summary).toBeVisible({ timeout: 10000 })

    // Should show count of exported notes
    await expect(summary).toContainText(/3/)
    await expect(summary).toContainText(/total size/i)
  })

  test('empty state shows helpful message when no notes to export', async ({ page }) => {
    await goToNotes(page)
    // Don't seed notes — empty state

    await page.getByTestId('export-notes-button').click()

    // Should indicate no notes available for export
    await expect(page.getByText(/no notes/i)).toBeVisible()
  })
})
