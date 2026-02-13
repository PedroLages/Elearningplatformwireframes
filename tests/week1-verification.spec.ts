import { test } from '@playwright/test'

test('Week 1 - Capture fully loaded Overview page', async ({ page }) => {
  await page.goto('/')

  // Wait for loading state to complete (500ms + buffer)
  await page.waitForTimeout(1000)

  // Take screenshot
  await page.screenshot({
    path: 'tests/screenshots/week1-complete-desktop.png',
    fullPage: true
  })
})
