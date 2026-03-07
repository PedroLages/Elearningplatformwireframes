/**
 * ATDD — E06-S01: Create Learning Challenges
 *
 * Acceptance tests mapped to each AC.
 */
import { test, expect } from '../support/fixtures'
import { navigateAndWait } from '../support/helpers/navigation'

/** Navigate to the Challenges page. */
async function goToChallenges(page: import('@playwright/test').Page) {
  await navigateAndWait(page, '/challenges')
  await page.waitForSelector('h1', { state: 'visible', timeout: 10000 }).catch(() => {})
}

/** Open the Create Challenge dialog from the page header button. */
async function openCreateDialog(page: import('@playwright/test').Page) {
  await goToChallenges(page)
  // Use first() because there are two "Create Challenge" buttons (header + empty state)
  await page
    .getByRole('button', { name: /create challenge/i })
    .first()
    .click()
  // Wait for dialog to appear
  await expect(page.getByRole('dialog')).toBeVisible()
}

/** Fill the type select (Radix Select) */
async function selectType(page: import('@playwright/test').Page, type: RegExp) {
  await page.getByLabel(/challenge type/i).click()
  await page.getByRole('option', { name: type }).click()
}

test.describe('Create Learning Challenges (E06-S01)', () => {
  test.beforeEach(async ({ page }) => {
    // Close tablet sidebar overlay
    await page.addInitScript(() => {
      localStorage.setItem('eduvi-sidebar-v1', 'false')
    })
  })

  // ── AC 1: Form displays all required fields ──────────────────────
  test('AC1: create challenge form has name, type, target, and deadline fields', async ({
    page,
  }) => {
    await openCreateDialog(page)

    await expect(page.getByLabel(/challenge name/i)).toBeVisible()
    await expect(page.getByLabel(/challenge type/i)).toBeVisible()
    await expect(page.getByLabel(/target/i)).toBeVisible()
    await expect(page.getByLabel(/deadline/i)).toBeVisible()
  })

  // ── AC 2: Type selection updates target label ────────────────────
  test('AC2: selecting completion type shows "videos" as target unit', async ({ page }) => {
    await openCreateDialog(page)
    await selectType(page, /completion/i)
    await expect(page.getByLabel(/target.*videos/i)).toBeVisible()
  })

  test('AC2: selecting time type shows "hours" as target unit', async ({ page }) => {
    await openCreateDialog(page)
    await selectType(page, /time/i)
    await expect(page.getByLabel(/target.*hours/i)).toBeVisible()
  })

  test('AC2: selecting streak type shows "days" as target unit', async ({ page }) => {
    await openCreateDialog(page)
    await selectType(page, /streak/i)
    await expect(page.getByLabel(/target.*days/i)).toBeVisible()
  })

  // ── AC 3: Valid submission saves to IndexedDB ────────────────────
  test('AC3: submitting valid form saves challenge and shows success toast', async ({ page }) => {
    await openCreateDialog(page)

    // Fill the form with valid data
    await page.getByLabel(/challenge name/i).fill('Complete 5 Videos')
    await selectType(page, /completion/i)
    await page.getByLabel(/target/i).fill('5')

    // Set deadline to 7 days from now
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 7)
    await page.getByLabel(/deadline/i).fill(futureDate.toISOString().split('T')[0])

    // Submit via the dialog's submit button
    await page
      .getByRole('dialog')
      .getByRole('button', { name: /create challenge/i })
      .click()

    // Success toast
    const toastEl = page
      .locator('[data-sonner-toast]')
      .filter({ hasText: /challenge.*created|created.*challenge/i })
    await expect(toastEl).toBeVisible({ timeout: 10000 })

    // Verify challenge appears in the list
    await expect(page.getByText('Complete 5 Videos')).toBeVisible()
  })

  // ── AC 4: Invalid submission shows inline errors ─────────────────
  test('AC4: empty name shows validation error', async ({ page }) => {
    await openCreateDialog(page)

    // Leave name empty, fill other fields
    await selectType(page, /completion/i)
    await page.getByLabel(/target/i).fill('5')

    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 7)
    await page.getByLabel(/deadline/i).fill(futureDate.toISOString().split('T')[0])

    // Submit
    await page
      .getByRole('dialog')
      .getByRole('button', { name: /create challenge/i })
      .click()

    // Inline error for name field
    await expect(page.getByText(/name is required/i)).toBeVisible()
  })

  test('AC4: zero target value shows validation error', async ({ page }) => {
    await openCreateDialog(page)

    await page.getByLabel(/challenge name/i).fill('My Challenge')
    await selectType(page, /completion/i)
    await page.getByLabel(/target/i).fill('0')

    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 7)
    await page.getByLabel(/deadline/i).fill(futureDate.toISOString().split('T')[0])

    await page
      .getByRole('dialog')
      .getByRole('button', { name: /create challenge/i })
      .click()

    await expect(page.getByText(/must be greater than zero/i)).toBeVisible()
  })

  test('AC4: past deadline shows validation error', async ({ page }) => {
    await openCreateDialog(page)

    await page.getByLabel(/challenge name/i).fill('My Challenge')
    await selectType(page, /completion/i)
    await page.getByLabel(/target/i).fill('5')

    // Set deadline in the past
    await page.getByLabel(/deadline/i).fill('2020-01-01')

    await page
      .getByRole('dialog')
      .getByRole('button', { name: /create challenge/i })
      .click()

    await expect(page.getByText(/deadline must be in the future/i)).toBeVisible()
  })

  // ── AC 5: Accessibility ──────────────────────────────────────────
  test('AC5: form fields have associated labels and are keyboard navigable', async ({ page }) => {
    await openCreateDialog(page)

    // Verify labels are associated (getByLabel succeeds only with proper label association)
    const nameInput = page.getByLabel(/challenge name/i)
    await expect(nameInput).toBeVisible()

    // Keyboard navigation: Tab through fields
    await nameInput.focus()
    await page.keyboard.press('Tab')

    // Next field should receive focus (type select trigger)
    const typeSelect = page.getByLabel(/challenge type/i)
    await expect(typeSelect).toBeFocused()
  })

  test('AC5: validation errors are announced via aria-live', async ({ page }) => {
    await openCreateDialog(page)

    // Submit empty form to trigger errors
    await page
      .getByRole('dialog')
      .getByRole('button', { name: /create challenge/i })
      .click()

    // Check for role="alert" elements containing error messages
    const alerts = page.locator('[role="alert"]')
    await expect(alerts.first()).toBeVisible()
    // Should have multiple validation errors
    await expect(alerts).toHaveCount(4) // name, type, target, deadline
  })
})
