/**
 * Story 2.7: Skip Controls, Picture-in-Picture & Shortcuts Help — ATDD Acceptance Tests
 *
 * RED PHASE: All tests are expected to FAIL until implementation is complete.
 *
 * Tests verify:
 *   - AC1: Skip buttons (±10s) in bottom-left controls, J/L keyboard shortcuts, ARIA announcements
 *   - AC2: PiP button conditionally rendered, P key toggles PiP, active state, hidden when unsupported
 *   - AC3: ? opens two-column shortcuts overlay, ? again or Esc closes, Layout handler doesn't fire
 *
 * Data seeding:
 *   - Uses allCourses data (first course with modules)
 *
 * Reference: TEA knowledge base - test-quality.md, selector-resilience.md
 */
import { test, expect } from '../support/fixtures'
import { navigateAndWait } from '../support/helpers/navigation'

// ---------------------------------------------------------------------------
// Constants — navigate to a known video lesson
// ---------------------------------------------------------------------------

async function goToFirstLesson(page: Parameters<typeof navigateAndWait>[0]) {
  await navigateAndWait(page, '/courses/operative-six/op6-introduction')
}

/** Focus the video player container so keyboard shortcuts are active */
async function focusPlayer(page: Parameters<typeof navigateAndWait>[0]) {
  const player = page.getByTestId('video-player-container')
  await player.hover()
  await player.click()
}

// ===========================================================================
// AC1: Skip Controls
// ===========================================================================

test.describe('AC1: Skip Controls', () => {
  test('skip-back and skip-forward buttons are visible in bottom-left controls', async ({
    page,
  }) => {
    // GIVEN: Video lesson is loaded
    await goToFirstLesson(page)

    // WHEN: Controls are visible
    const playerContainer = page.getByTestId('video-player-container')
    await playerContainer.hover()

    // THEN: Skip buttons appear in the left control group
    const skipBack = page.getByRole('button', { name: /skip back 10 seconds/i })
    const skipForward = page.getByRole('button', { name: /skip forward 10 seconds/i })
    await expect(skipBack).toBeVisible()
    await expect(skipForward).toBeVisible()
  })

  test('skip buttons have 44x44px touch targets', async ({ page }) => {
    // GIVEN: Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await goToFirstLesson(page)

    // WHEN: Controls are visible
    const playerContainer = page.getByTestId('video-player-container')
    await playerContainer.hover()

    // THEN: Skip buttons meet 44px minimum
    const skipBack = page.getByRole('button', { name: /skip back 10 seconds/i })
    const skipForward = page.getByRole('button', { name: /skip forward 10 seconds/i })

    const backBox = await skipBack.boundingBox()
    const fwdBox = await skipForward.boundingBox()
    expect(backBox).toBeTruthy()
    expect(fwdBox).toBeTruthy()
    expect(backBox!.width).toBeGreaterThanOrEqual(44)
    expect(backBox!.height).toBeGreaterThanOrEqual(44)
    expect(fwdBox!.width).toBeGreaterThanOrEqual(44)
    expect(fwdBox!.height).toBeGreaterThanOrEqual(44)
  })

  test('J key skips back 10 seconds with ARIA announcement', async ({ page }) => {
    // GIVEN: Video player is focused
    await goToFirstLesson(page)
    await focusPlayer(page)

    // WHEN: User presses J
    await page.keyboard.press('j')

    // THEN: ARIA live region announces the skip
    const announcement = page.locator('[role="status"][aria-live="polite"]')
    await expect(announcement).toContainText(/skipped back 10 seconds/i)
  })

  test('L key skips forward 10 seconds with ARIA announcement', async ({ page }) => {
    // GIVEN: Video player is focused
    await goToFirstLesson(page)
    await focusPlayer(page)

    // WHEN: User presses L
    await page.keyboard.press('l')

    // THEN: ARIA live region announces the skip
    const announcement = page.locator('[role="status"][aria-live="polite"]')
    await expect(announcement).toContainText(/skipped forward 10 seconds/i)
  })
})

// ===========================================================================
// AC2: Picture-in-Picture
// ===========================================================================

test.describe('AC2: Picture-in-Picture', () => {
  test('PiP button is visible when browser supports PiP', async ({ page }) => {
    // GIVEN: Video lesson is loaded (Chromium supports PiP)
    await goToFirstLesson(page)

    // WHEN: Controls are visible
    const playerContainer = page.getByTestId('video-player-container')
    await playerContainer.hover()

    // THEN: PiP button is visible
    const pipButton = page.getByRole('button', { name: /picture-in-picture/i })
    await expect(pipButton).toBeVisible()
  })

  test('P key triggers PiP mode', async ({ page }) => {
    // GIVEN: Video player is focused
    await goToFirstLesson(page)
    await focusPlayer(page)

    // WHEN: User presses P
    await page.keyboard.press('p')

    // THEN: ARIA announcement confirms PiP activation
    const announcement = page.locator('[role="status"][aria-live="polite"]')
    await expect(announcement).toContainText(/picture-in-picture/i)
  })

  test('PiP button shows active state when PiP is active', async ({ page }) => {
    // GIVEN: Video player is focused
    await goToFirstLesson(page)
    await focusPlayer(page)

    // WHEN: PiP is activated
    await page.keyboard.press('p')

    // THEN: PiP button has active/pressed styling
    const pipButton = page.getByRole('button', { name: /picture-in-picture/i })
    await expect(pipButton).toHaveAttribute('aria-pressed', 'true')
  })

  test('PiP button hidden when browser does not support PiP', async ({ page }) => {
    // GIVEN: PiP is disabled in browser
    await page.addInitScript(() => {
      Object.defineProperty(document, 'pictureInPictureEnabled', {
        value: false,
        writable: false,
      })
    })
    await goToFirstLesson(page)

    // WHEN: Controls are visible
    const playerContainer = page.getByTestId('video-player-container')
    await playerContainer.hover()

    // THEN: PiP button is NOT visible
    const pipButton = page.getByRole('button', { name: /picture-in-picture/i })
    await expect(pipButton).toHaveCount(0)
  })
})

// ===========================================================================
// AC3: Shortcuts Help Overlay
// ===========================================================================

test.describe('AC3: Shortcuts Help Overlay', () => {
  test('pressing ? opens shortcuts overlay with two-column grid', async ({ page }) => {
    // GIVEN: Video player is focused
    await goToFirstLesson(page)
    await focusPlayer(page)

    // WHEN: User presses ?
    await page.keyboard.press('Shift+/')

    // THEN: Shortcuts overlay appears with two columns
    const overlay = page.getByTestId('video-shortcuts-overlay')
    await expect(overlay).toBeVisible()

    // Verify it has a two-column grid layout
    const columns = overlay.locator('[data-column]')
    await expect(columns).toHaveCount(2)
  })

  test('shortcuts overlay displays all keyboard shortcuts', async ({ page }) => {
    // GIVEN: Shortcuts overlay is open
    await goToFirstLesson(page)
    await focusPlayer(page)
    await page.keyboard.press('Shift+/')

    // THEN: Key shortcuts are listed
    const overlay = page.getByTestId('video-shortcuts-overlay')
    await expect(overlay).toContainText('Play/Pause')
    await expect(overlay).toContainText('Skip back')
    await expect(overlay).toContainText('Skip forward')
    await expect(overlay).toContainText('Mute')
    await expect(overlay).toContainText('Fullscreen')
  })

  test('pressing ? again closes shortcuts overlay', async ({ page }) => {
    // GIVEN: Shortcuts overlay is open
    await goToFirstLesson(page)
    await focusPlayer(page)
    await page.keyboard.press('Shift+/')

    const overlay = page.getByTestId('video-shortcuts-overlay')
    await expect(overlay).toBeVisible()

    // WHEN: User presses ? again
    await page.keyboard.press('Shift+/')

    // THEN: Overlay is dismissed
    await expect(overlay).not.toBeVisible()
  })

  test('pressing Escape closes shortcuts overlay', async ({ page }) => {
    // GIVEN: Shortcuts overlay is open
    await goToFirstLesson(page)
    await focusPlayer(page)
    await page.keyboard.press('Shift+/')

    const overlay = page.getByTestId('video-shortcuts-overlay')
    await expect(overlay).toBeVisible()

    // WHEN: User presses Escape
    await page.keyboard.press('Escape')

    // THEN: Overlay is dismissed
    await expect(overlay).not.toBeVisible()
  })

  test('Layout-level ? handler does NOT fire when video overlay opens', async ({ page }) => {
    // GIVEN: Video player is focused
    await goToFirstLesson(page)
    await focusPlayer(page)

    // WHEN: User presses ?
    await page.keyboard.press('Shift+/')

    // THEN: Video shortcuts overlay is visible
    const videoOverlay = page.getByTestId('video-shortcuts-overlay')
    await expect(videoOverlay).toBeVisible()

    // AND: Layout-level keyboard shortcuts dialog is NOT visible
    const layoutDialog = page.getByRole('dialog', { name: /keyboard shortcuts/i })
    await expect(layoutDialog).toHaveCount(0)
  })
})
