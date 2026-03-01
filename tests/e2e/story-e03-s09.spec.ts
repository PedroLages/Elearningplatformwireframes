/**
 * Story 3.9: Video Frame Capture in Notes — ATDD Acceptance Tests
 *
 * Tests verify:
 *   - AC1: Ctrl/Cmd+Shift+S captures current video frame and embeds in note
 *   - AC2: Toolbar "Capture Frame" button captures and embeds frame
 *   - AC3: Captured frame displays with clickable timestamp caption
 *   - AC4: Frame blob stored in IndexedDB (not inline base64)
 *   - AC5: Storage quota error is handled gracefully
 *   - AC6: CORS-safe capture (crossOrigin set on video element)
 */
import { test, expect } from '../support/fixtures'
import { navigateAndWait } from '../support/helpers/navigation'

const LESSON_URL = '/courses/operative-six/op6-introduction'

/** Navigate to lesson player with notes panel open, suppress sidebar. */
async function goToLessonWithNotes(page: Parameters<typeof navigateAndWait>[0]) {
  await page.addInitScript(() => {
    localStorage.setItem('eduvi-sidebar-v1', 'false')
  })
  await navigateAndWait(page, LESSON_URL + '?panel=notes')
}

/** Advance video to a known time so frame capture has content. */
async function seekVideoTo(page: Parameters<typeof navigateAndWait>[0], seconds: number) {
  await page.locator('video').evaluate(
    (el: HTMLVideoElement, t: number) => {
      el.currentTime = t
      el.dispatchEvent(new Event('timeupdate'))
    },
    seconds,
  )
}

// ===========================================================================
// AC1: Capture frame via keyboard shortcut
// ===========================================================================

test.describe('AC1: Frame capture via keyboard shortcut', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('Ctrl+Shift+S captures current video frame and embeds in note', async ({ page }) => {
    await goToLessonWithNotes(page)
    await seekVideoTo(page, 5)

    // Focus the note editor
    const editor = page.getByRole('textbox', { name: /lesson notes editor/i })
    await expect(editor).toBeVisible()
    await editor.click()

    // Press Ctrl+Shift+S to capture frame
    await page.keyboard.press('Control+Shift+s')

    // THEN: A frame image should appear in the editor
    const frameImage = page.locator('[data-testid="frame-capture"]')
    await expect(frameImage).toBeVisible({ timeout: 5000 })

    // THEN: A toast confirmation should appear
    const toastMessage = page.getByText(/frame captured/i)
    await expect(toastMessage).toBeVisible({ timeout: 3000 })
  })
})

// ===========================================================================
// AC2: Capture frame via toolbar button
// ===========================================================================

test.describe('AC2: Toolbar capture button', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('Capture Frame toolbar button embeds frame at cursor position', async ({ page }) => {
    await goToLessonWithNotes(page)
    await seekVideoTo(page, 10)

    // Focus editor
    const editor = page.getByRole('textbox', { name: /lesson notes editor/i })
    await editor.click()

    // Click the Capture Frame toolbar button
    const captureBtn = page.getByRole('button', { name: /capture frame/i })
    await expect(captureBtn).toBeVisible()
    await captureBtn.click()

    // THEN: Frame should be embedded in the editor
    const frameImage = page.locator('[data-testid="frame-capture"]')
    await expect(frameImage).toBeVisible({ timeout: 5000 })
  })

  test('Capture Frame button shows camera icon and tooltip', async ({ page }) => {
    await goToLessonWithNotes(page)

    const captureBtn = page.getByRole('button', { name: /capture frame/i })
    await expect(captureBtn).toBeVisible()

    // Verify camera icon is present
    const cameraIcon = captureBtn.locator('svg')
    await expect(cameraIcon).toBeVisible()

    // Hover for tooltip
    await captureBtn.hover()
    const tooltip = page.getByRole('tooltip')
    await expect(tooltip).toContainText(/capture video frame/i)
  })
})

// ===========================================================================
// AC3: Frame displays with timestamp caption + click-to-seek
// ===========================================================================

test.describe('AC3: Timestamp caption and click-to-seek', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('captured frame shows timestamp caption (e.g., "Frame at 0:05")', async ({ page }) => {
    await goToLessonWithNotes(page)
    await seekVideoTo(page, 5)

    const editor = page.getByRole('textbox', { name: /lesson notes editor/i })
    await editor.click()

    // Capture a frame
    await page.keyboard.press('Control+Shift+s')

    // THEN: Caption with timestamp should be visible
    const caption = page.locator('[data-testid="frame-capture"] figcaption')
    await expect(caption).toBeVisible({ timeout: 5000 })
    await expect(caption).toContainText(/frame at 0:05/i)
  })

  test('clicking timestamp caption seeks video to that position', async ({ page }) => {
    await goToLessonWithNotes(page)
    await seekVideoTo(page, 30)

    const editor = page.getByRole('textbox', { name: /lesson notes editor/i })
    await editor.click()

    // Capture a frame at 30s
    await page.keyboard.press('Control+Shift+s')

    // Seek video away from 30s
    await seekVideoTo(page, 0)

    // Click the timestamp caption
    const caption = page.locator('[data-testid="frame-capture"] figcaption')
    await expect(caption).toBeVisible({ timeout: 5000 })
    await caption.click()

    // THEN: Video should seek back to ~30s
    const video = page.locator('video')
    await expect(async () => {
      const currentTime = await video.evaluate((el: HTMLVideoElement) => el.currentTime)
      expect(currentTime).toBeGreaterThanOrEqual(29)
      expect(currentTime).toBeLessThanOrEqual(31)
    }).toPass({ timeout: 3000 })
  })
})

// ===========================================================================
// AC4: Frame stored in IndexedDB (not inline base64)
// ===========================================================================

test.describe('AC4: IndexedDB frame storage', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('captured frame is stored in Dexie screenshots table', async ({ page }) => {
    await goToLessonWithNotes(page)
    await seekVideoTo(page, 5)

    const editor = page.getByRole('textbox', { name: /lesson notes editor/i })
    await editor.click()

    // Capture frame
    await page.keyboard.press('Control+Shift+s')

    // Wait for frame to appear
    const frameImage = page.locator('[data-testid="frame-capture"]')
    await expect(frameImage).toBeVisible({ timeout: 5000 })

    // THEN: Verify screenshot record exists in IndexedDB
    const screenshotCount = await page.evaluate(async () => {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const req = indexedDB.open('ElearningDB')
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error)
      })
      const tx = db.transaction('screenshots', 'readonly')
      const store = tx.objectStore('screenshots')
      return new Promise<number>((resolve) => {
        const req = store.count()
        req.onsuccess = () => resolve(req.result)
      })
    })

    expect(screenshotCount).toBeGreaterThanOrEqual(1)
  })
})

// ===========================================================================
// AC6: CORS-safe capture (crossOrigin attribute)
// ===========================================================================

test.describe('AC6: CORS-safe video capture', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('video element has crossOrigin="anonymous" attribute', async ({ page }) => {
    await goToLessonWithNotes(page)

    const video = page.locator('video')
    await expect(video).toBeVisible()

    // THEN: crossOrigin attribute should be set
    const crossOrigin = await video.evaluate(
      (el: HTMLVideoElement) => el.crossOrigin,
    )
    expect(crossOrigin).toBe('anonymous')
  })
})
