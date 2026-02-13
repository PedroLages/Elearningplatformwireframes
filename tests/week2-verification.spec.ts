import { test } from '@playwright/test'

test('Week 2 - Capture Overview page with engagement features', async ({ page }) => {
  // Listen for console messages to debug
  page.on('console', msg => console.log('Browser:', msg.text()))
  page.on('pageerror', err => console.error('Page error:', err.message))

  await page.goto('/')

  // Wait for loading state to complete - increased timeout
  await page.waitForTimeout(2000)

  // Take full page screenshot
  await page.screenshot({
    path: 'tests/screenshots/week2-complete-desktop.png',
    fullPage: true
  })
})
