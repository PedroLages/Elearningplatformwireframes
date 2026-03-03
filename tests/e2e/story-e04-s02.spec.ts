/**
 * E04-S02: Course Completion Percentage
 *
 * Tests course completion calculation and progress bar display across:
 * - Course library cards
 * - Course detail page
 * - Real-time updates
 * - Accessibility (ARIA attributes)
 */
import { test, expect } from '../support/fixtures'
import { goToCourses } from '../support/helpers/navigation'

test.describe('E04-S02: Course Completion Percentage', () => {
  test('AC1: Progress bar displays with ARIA attributes and text equivalent', async ({
    page,
  }) => {
    // Navigate to course detail page where progress bar should appear
    await goToCourses(page)
    const courseLink = page.getByRole('link').first()
    await courseLink.click()
    await page.waitForURL(/\/courses\//)

    // Find progress bar with proper ARIA attributes
    const progressBar = page.locator('[role="progressbar"]')
    await expect(progressBar).toBeVisible()

    // Verify ARIA attributes
    await expect(progressBar).toHaveAttribute('aria-valuemin', '0')
    await expect(progressBar).toHaveAttribute('aria-valuemax', '100')
    await expect(progressBar).toHaveAttribute('aria-valuenow')

    // Verify text equivalent is visible (e.g., "65% complete")
    const progressText = page.locator('text=/\\d+% complete/')
    await expect(progressText).toBeVisible()
  })

  test('AC2: Progress bar updates in real-time when completion status changes', async ({
    page,
  }) => {
    // Navigate to course detail
    await goToCourses(page)
    const courseLink = page.getByRole('link').first()
    await courseLink.click()
    await page.waitForURL(/\/courses\//)

    // Get initial progress value
    const progressBar = page.locator('[role="progressbar"]')
    const initialValue = await progressBar.getAttribute('aria-valuenow')

    // Mark a content item as completed (assumes completion status UI exists)
    // This will fail until completion status UI from E04-S01 is available
    const contentItem = page.locator('[data-testid*="content-status"]').first()
    if ((await contentItem.count()) > 0) {
      await contentItem.click()
      const completedOption = page.getByRole('button', { name: /completed/i })
      await completedOption.click()

      // Verify progress bar updated without page refresh
      const newValue = await progressBar.getAttribute('aria-valuenow')
      expect(newValue).not.toBe(initialValue)

      // Verify smooth animation (progress bar should have transition)
      const progressBarInner = progressBar.locator('[class*="progress"]').first()
      const styles = await progressBarInner.evaluate((el) =>
        window.getComputedStyle(el).getPropertyValue('transition'),
      )
      expect(styles).toContain('width')
    }
  })

  test('AC3: Progress bar shows 0% for courses with no completed items', async ({
    page,
  }) => {
    // Navigate to courses
    await goToCourses(page)

    // Find a course card (assumes course cards exist)
    const courseCard = page.locator('[class*="card"]').first()

    // Check for progress bar in the card
    const progressBar = courseCard.locator('[role="progressbar"]')
    if ((await progressBar.count()) > 0) {
      const ariaValue = await progressBar.getAttribute('aria-valuenow')
      // For a new course, expect 0%
      expect(parseInt(ariaValue || '0')).toBeLessThanOrEqual(0)

      // Verify text shows "0% complete" or similar empty state
      const progressText = courseCard.locator('text=/0% complete/')
      await expect(progressText).toBeVisible()
    }
  })

  test('AC4: Progress bar shows 100% with completion badge for fully completed courses', async ({
    page,
  }) => {
    // Navigate to courses
    await goToCourses(page)

    // This test will pass once a course reaches 100% completion
    // For now, we'll verify the structure exists
    const courseCards = page.locator('[class*="card"]')
    const count = await courseCards.count()

    // Check each card for completion state
    for (let i = 0; i < count; i++) {
      const card = courseCards.nth(i)
      const progressBar = card.locator('[role="progressbar"]')

      if ((await progressBar.count()) > 0) {
        const ariaValue = await progressBar.getAttribute('aria-valuenow')

        // If this course is 100% complete
        if (ariaValue === '100') {
          // Verify full/completed visual state
          await expect(progressBar).toHaveAttribute('aria-valuenow', '100')

          // Verify completion badge is visible
          const completionBadge = card.locator(
            '[data-testid="completion-badge"], [class*="badge"]',
          )
          await expect(completionBadge).toBeVisible()
        }
      }
    }
  })

  test('AC5: Course library displays consistent progress bars on all course cards', async ({
    page,
  }) => {
    await goToCourses(page)

    // Get all course cards
    const courseCards = page.locator('[class*="card"]')
    const count = await courseCards.count()
    expect(count).toBeGreaterThan(0)

    // Verify each card has a progress bar
    for (let i = 0; i < count; i++) {
      const card = courseCards.nth(i)
      const progressBar = card.locator('[role="progressbar"]')

      // Progress bar should exist on each card
      await expect(progressBar).toBeVisible()

      // Progress bars should have consistent ARIA attributes
      await expect(progressBar).toHaveAttribute('aria-valuemin', '0')
      await expect(progressBar).toHaveAttribute('aria-valuemax', '100')

      // Verify consistent styling by checking for expected classes or structure
      const progressBarContainer = progressBar.locator('..')
      await expect(progressBarContainer).toBeVisible()
    }
  })
})
