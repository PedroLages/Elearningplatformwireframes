/**
 * E05-S04: Study History Calendar E2E Tests
 *
 * Verifies:
 *   - AC1: Month-view calendar with study day highlights
 *   - AC2: Month navigation (prev/next)
 *   - AC3: Day detail popover with session list
 *   - AC4: Empty day detail state
 *   - AC5: Freeze day visual distinction
 *   - AC6: Mobile responsiveness (44×44px touch targets)
 */
import { test, expect } from '../support/fixtures'

function makeStudyEntry(daysAgo: number, courseId = 'course-1') {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(12, 0, 0, 0)
  return {
    type: 'lesson_complete' as const,
    courseId,
    timestamp: d.toISOString(),
  }
}

test.describe('Study History Calendar (E05-S04)', () => {
  test.beforeEach(async ({ page }) => {
    // Prevent sidebar overlay on narrow viewports
    await page.addInitScript(() => {
      localStorage.setItem('eduvi-sidebar-v1', 'false')
    })
  })

  test('AC1: month-view calendar renders for current month', async ({ page, localStorage }) => {
    await page.goto('/')
    await localStorage.seed('study-log', [
      makeStudyEntry(0),
      makeStudyEntry(2),
      makeStudyEntry(5),
    ])
    await page.reload()
    await page.waitForSelector('[data-testid="stats-grid"]', { state: 'visible', timeout: 10000 })

    const calendar = page.getByTestId('study-history-calendar')
    await expect(calendar).toBeVisible()

    // Should display current month name and year
    const now = new Date()
    const monthYear = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    await expect(calendar.getByText(monthYear)).toBeVisible()
  })

  test('AC1: days with study sessions are highlighted', async ({ page, localStorage }) => {
    await page.goto('/')
    await localStorage.seed('study-log', [
      makeStudyEntry(0),
      makeStudyEntry(1),
      makeStudyEntry(3),
    ])
    await page.reload()
    await page.waitForSelector('[data-testid="stats-grid"]', { state: 'visible', timeout: 10000 })

    const calendar = page.getByTestId('study-history-calendar')
    const highlightedDays = calendar.locator('[data-has-activity="true"]')
    await expect(highlightedDays).toHaveCount(3)
  })

  test('AC2: navigate to previous and next month', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="study-history-calendar"]', {
      state: 'visible',
      timeout: 15000,
    })

    const calendar = page.getByTestId('study-history-calendar')
    const prevBtn = calendar.getByRole('button', { name: /previous/i })
    const nextBtn = calendar.getByRole('button', { name: /next/i })

    // Navigate to previous month
    await prevBtn.click()
    const prevMonth = new Date()
    prevMonth.setMonth(prevMonth.getMonth() - 1)
    const prevMonthYear = prevMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    await expect(calendar.getByText(prevMonthYear)).toBeVisible()

    // Navigate back to current month
    await nextBtn.click()
    const now = new Date()
    const currentMonthYear = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    await expect(calendar.getByText(currentMonthYear)).toBeVisible()
  })

  test('AC3: clicking a day with sessions shows detail popover', async ({ page, localStorage }) => {
    await page.goto('/')
    await localStorage.seed('study-log', [makeStudyEntry(0, 'course-1')])
    await page.reload()
    await page.waitForSelector('[data-testid="stats-grid"]', { state: 'visible', timeout: 10000 })

    const calendar = page.getByTestId('study-history-calendar')

    // Click today's cell (has activity)
    const todayCell = calendar.locator('[data-has-activity="true"]').first()
    await todayCell.click()

    // Popover should appear with session details
    const popover = page.getByTestId('day-detail-popover')
    await expect(popover).toBeVisible()

    // Should show course name
    await expect(popover.getByText(/course/i)).toBeVisible()
  })

  test('AC4: clicking a day with no sessions shows empty state', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="stats-grid"]', { state: 'visible', timeout: 10000 })

    const calendar = page.getByTestId('study-history-calendar')

    // Click a day without activity
    const inactiveDay = calendar.locator('[data-has-activity="false"]').first()
    await inactiveDay.click()

    const popover = page.getByTestId('day-detail-popover')
    await expect(popover).toBeVisible()
    await expect(popover.getByText(/no study sessions/i)).toBeVisible()
  })

  test('AC5: freeze days are visually distinguished', async ({ page, localStorage }) => {
    await page.goto('/')
    // Set Monday (1) and Wednesday (3) as freeze days
    await localStorage.seed('study-streak-freeze-days', { freezeDays: [1, 3] })
    await localStorage.seed('study-log', [])
    await page.reload()
    await page.waitForSelector('[data-testid="stats-grid"]', { state: 'visible', timeout: 10000 })

    const calendar = page.getByTestId('study-history-calendar')
    const freezeDayCells = calendar.locator('[data-freeze-day="true"]')

    // At least some freeze days should be present in the current month view
    const count = await freezeDayCells.count()
    expect(count).toBeGreaterThan(0)
  })

  test('AC6: calendar is responsive with adequate touch targets', async ({
    page,
    localStorage,
  }) => {
    await page.goto('/')
    await localStorage.seed('study-log', [makeStudyEntry(0)])

    // Set mobile viewport and reload to pick up seeded data
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    await page.waitForSelector('[data-testid="stats-grid"]', { state: 'visible', timeout: 10000 })

    const calendar = page.getByTestId('study-history-calendar')
    await expect(calendar).toBeVisible()

    // Day cells should have minimum 44×44px touch targets
    // Select a day button (has data-has-activity attr), not nav buttons
    const dayCell = calendar.locator('[data-has-activity]').first()
    const box = await dayCell.boundingBox()
    expect(box).toBeTruthy()
    expect(box!.width).toBeGreaterThanOrEqual(44)
    expect(box!.height).toBeGreaterThanOrEqual(44)
  })
})
