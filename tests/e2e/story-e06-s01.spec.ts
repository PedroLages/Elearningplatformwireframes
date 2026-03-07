/**
 * ATDD — E06-S01: Create Learning Challenges
 *
 * Failing acceptance tests mapped to each AC.
 * These will turn green as the feature is implemented.
 */
import { test, expect } from '../support/fixtures'
import { navigateAndWait } from '../support/helpers/navigation'

/** Navigate to the Challenges page. */
async function goToChallenges(page: import('@playwright/test').Page) {
  await navigateAndWait(page, '/challenges')
  await page
    .waitForSelector('h1', { state: 'visible', timeout: 10000 })
    .catch(() => {})
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
    await goToChallenges(page)

    // Open create challenge form
    const createBtn = page.getByRole('button', { name: /create challenge/i })
    await expect(createBtn).toBeVisible()
    await createBtn.click()

    // Verify all form fields are present
    await expect(page.getByLabel(/challenge name/i)).toBeVisible()
    await expect(page.getByLabel(/challenge type/i)).toBeVisible()
    await expect(page.getByLabel(/target/i)).toBeVisible()
    await expect(page.getByLabel(/deadline/i)).toBeVisible()
  })

  // ── AC 2: Type selection updates target label ────────────────────
  test('AC2: selecting completion type shows "videos" as target unit', async ({
    page,
  }) => {
    await goToChallenges(page)

    const createBtn = page.getByRole('button', { name: /create challenge/i })
    await createBtn.click()

    // Select completion-based type
    await page.getByLabel(/challenge type/i).click()
    await page.getByRole('option', { name: /completion/i }).click()

    // Target label should reflect the type
    await expect(page.getByLabel(/target.*videos/i)).toBeVisible()
  })

  test('AC2: selecting time type shows "hours" as target unit', async ({
    page,
  }) => {
    await goToChallenges(page)

    const createBtn = page.getByRole('button', { name: /create challenge/i })
    await createBtn.click()

    await page.getByLabel(/challenge type/i).click()
    await page.getByRole('option', { name: /time/i }).click()

    await expect(page.getByLabel(/target.*hours/i)).toBeVisible()
  })

  test('AC2: selecting streak type shows "days" as target unit', async ({
    page,
  }) => {
    await goToChallenges(page)

    const createBtn = page.getByRole('button', { name: /create challenge/i })
    await createBtn.click()

    await page.getByLabel(/challenge type/i).click()
    await page.getByRole('option', { name: /streak/i }).click()

    await expect(page.getByLabel(/target.*days/i)).toBeVisible()
  })

  // ── AC 3: Valid submission saves to IndexedDB ────────────────────
  test('AC3: submitting valid form saves challenge and shows success toast', async ({
    page,
  }) => {
    await goToChallenges(page)

    const createBtn = page.getByRole('button', { name: /create challenge/i })
    await createBtn.click()

    // Fill the form with valid data
    await page.getByLabel(/challenge name/i).fill('Complete 5 Videos')
    await page.getByLabel(/challenge type/i).click()
    await page.getByRole('option', { name: /completion/i }).click()
    await page.getByLabel(/target/i).fill('5')

    // Set deadline to 7 days from now
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 7)
    const dateStr = futureDate.toISOString().split('T')[0]
    await page.getByLabel(/deadline/i).fill(dateStr)

    // Submit
    await page.getByRole('button', { name: /^(create|save|submit)/i }).click()

    // Success toast
    const toast = page
      .locator('[data-sonner-toast]')
      .filter({ hasText: /challenge.*created|created.*challenge/i })
    await expect(toast).toBeVisible({ timeout: 10000 })

    // Verify challenge appears in the list
    await expect(page.getByText('Complete 5 Videos')).toBeVisible()
  })

  // ── AC 4: Invalid submission shows inline errors ─────────────────
  test('AC4: empty name shows validation error', async ({ page }) => {
    await goToChallenges(page)

    const createBtn = page.getByRole('button', { name: /create challenge/i })
    await createBtn.click()

    // Leave name empty, fill other fields
    await page.getByLabel(/challenge type/i).click()
    await page.getByRole('option', { name: /completion/i }).click()
    await page.getByLabel(/target/i).fill('5')

    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 7)
    await page.getByLabel(/deadline/i).fill(futureDate.toISOString().split('T')[0])

    // Submit
    await page.getByRole('button', { name: /^(create|save|submit)/i }).click()

    // Inline error for name field
    await expect(page.getByText(/name is required|enter a name/i)).toBeVisible()
  })

  test('AC4: zero target value shows validation error', async ({ page }) => {
    await goToChallenges(page)

    const createBtn = page.getByRole('button', { name: /create challenge/i })
    await createBtn.click()

    await page.getByLabel(/challenge name/i).fill('My Challenge')
    await page.getByLabel(/challenge type/i).click()
    await page.getByRole('option', { name: /completion/i }).click()
    await page.getByLabel(/target/i).fill('0')

    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 7)
    await page.getByLabel(/deadline/i).fill(futureDate.toISOString().split('T')[0])

    await page.getByRole('button', { name: /^(create|save|submit)/i }).click()

    await expect(page.getByText(/must be greater than zero|target.*positive/i)).toBeVisible()
  })

  test('AC4: past deadline shows validation error', async ({ page }) => {
    await goToChallenges(page)

    const createBtn = page.getByRole('button', { name: /create challenge/i })
    await createBtn.click()

    await page.getByLabel(/challenge name/i).fill('My Challenge')
    await page.getByLabel(/challenge type/i).click()
    await page.getByRole('option', { name: /completion/i }).click()
    await page.getByLabel(/target/i).fill('5')

    // Set deadline in the past
    await page.getByLabel(/deadline/i).fill('2020-01-01')

    await page.getByRole('button', { name: /^(create|save|submit)/i }).click()

    await expect(page.getByText(/deadline.*future|past.*deadline/i)).toBeVisible()
  })

  // ── AC 5: Accessibility ──────────────────────────────────────────
  test('AC5: form fields have associated labels and are keyboard navigable', async ({
    page,
  }) => {
    await goToChallenges(page)

    const createBtn = page.getByRole('button', { name: /create challenge/i })
    await createBtn.click()

    // Verify labels are associated (getByLabel succeeds only with proper label association)
    const nameInput = page.getByLabel(/challenge name/i)
    await expect(nameInput).toBeVisible()

    // Keyboard navigation: Tab through fields
    await nameInput.focus()
    await page.keyboard.press('Tab')

    // Next field should receive focus (type select)
    const typeSelect = page.getByLabel(/challenge type/i)
    await expect(typeSelect).toBeFocused()
  })

  test('AC5: validation errors are announced via aria-live', async ({
    page,
  }) => {
    await goToChallenges(page)

    const createBtn = page.getByRole('button', { name: /create challenge/i })
    await createBtn.click()

    // Submit empty form to trigger errors
    await page.getByRole('button', { name: /^(create|save|submit)/i }).click()

    // Check for aria-live region containing error messages
    const liveRegion = page.locator('[aria-live="polite"], [aria-live="assertive"], [role="alert"]')
    await expect(liveRegion.first()).toBeVisible()
  })
})
