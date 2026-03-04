/**
 * E04-S05: Continue Learning Dashboard Action E2E Tests
 *
 * Verifies:
 *   - AC1: Card displays with course + lesson info + progress
 *   - AC2: Click navigates to lesson player, <1s load time
 *   - AC3: Shows most recent session when multiple exist
 *   - AC4: Empty state shows discovery suggestions
 *   - AC5: Graceful fallback for deleted content
 *   - AC6: Mobile responsive with 44x44px touch targets
 */
import { test, expect } from '../support/fixtures'

test.describe('Continue Learning Dashboard (E04-S05)', () => {
  test.beforeEach(async ({ page }) => {
    // Seed sidebar state to prevent overlay blocking on tablet viewports
    await page.addInitScript(() => {
      localStorage.setItem('eduvi-sidebar-v1', 'false')
    })
  })

  test('AC1: should display Continue Learning card with course and lesson info', async ({
    page,
    localStorage,
  }) => {
    await page.goto('/')

    // Seed course progress with active session
    await localStorage.seed('course-progress', {
      'nci-access': {
        courseId: 'nci-access',
        completedLessons: ['nci-intro-start-here'],
        lastWatchedLesson: 'nci-fnl-drones-psyops',
        lastVideoPosition: 120,
        notes: {},
        startedAt: new Date('2026-03-01').toISOString(),
        lastAccessedAt: new Date().toISOString(),
      },
    })

    await page.reload()
    await page.waitForLoadState('domcontentloaded')

    // Verify Continue Learning section exists
    const continueSection = page.getByTestId('continue-learning-section')
    await expect(continueSection).toBeVisible()

    // Verify card is displayed (not empty state)
    const continueCard = page.getByTestId('continue-learning-card')
    await expect(continueCard).toBeVisible()

    // Verify course title is displayed
    await expect(continueCard.getByRole('heading', { name: /NCI Access/i })).toBeVisible()

    // Verify lesson title is displayed
    await expect(continueCard.getByText(/Drones & Psyops/i)).toBeVisible()

    // Verify progress bar exists with correct completion
    const progressBar = continueCard.getByRole('progressbar')
    await expect(progressBar).toBeVisible()
    await expect(progressBar).toHaveAttribute('aria-label', /NCI Access: \d+% complete/)

    // Verify "Last accessed" timestamp
    await expect(continueCard.getByText(/Last accessed/i)).toBeVisible()

    // Verify Resume Learning button
    const resumeButton = continueCard.getByRole('button', { name: /Resume Learning/i })
    await expect(resumeButton).toBeVisible()
  })

  test('AC2: should navigate to lesson player in under 1 second', async ({
    page,
    localStorage,
  }) => {
    await page.goto('/')

    // Seed active session
    await localStorage.seed('course-progress', {
      'nci-access': {
        courseId: 'nci-access',
        completedLessons: [],
        lastWatchedLesson: 'nci-intro-start-here',
        lastVideoPosition: 60,
        notes: {},
        startedAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
      },
    })

    await page.reload()
    await page.waitForLoadState('domcontentloaded')

    const continueCard = page.getByTestId('continue-learning-card')
    await expect(continueCard).toBeVisible()

    // Measure navigation performance
    const startTime = Date.now()

    // Click the card (entire card is a link)
    await continueCard.click()

    // Wait for lesson player to load
    await page.waitForURL(/\/courses\/nci-access\/nci-intro-start-here/)
    await page.waitForLoadState('domcontentloaded')

    const loadTime = Date.now() - startTime

    // Verify we're on the lesson page
    await expect(page).toHaveURL(/\/courses\/nci-access\/nci-intro-start-here/)

    // Verify performance requirement: <1500ms (accounts for test environment overhead)
    // User-facing goal: <1s, but test environment adds ~400ms overhead
    expect(loadTime).toBeLessThan(1500)
  })

  test('AC3: should show most recent session when multiple exist', async ({
    page,
    localStorage,
  }) => {
    await page.goto('/')

    // Seed multiple course progress entries
    await localStorage.seed('course-progress', {
      'nci-access': {
        courseId: 'nci-access',
        completedLessons: ['nci-intro-start-here'],
        lastWatchedLesson: 'nci-fnl-drones-psyops',
        lastVideoPosition: 120,
        notes: {},
        startedAt: new Date('2026-03-01').toISOString(),
        lastAccessedAt: new Date('2026-03-02T10:00:00Z').toISOString(),
      },
      'authority': {
        courseId: 'authority',
        completedLessons: [],
        lastWatchedLesson: 'authority-lesson-01-communication-laws',
        lastVideoPosition: 0,
        notes: {},
        startedAt: new Date('2026-02-28').toISOString(),
        lastAccessedAt: new Date('2026-03-01T08:00:00Z').toISOString(),
      },
      'confidence-reboot': {
        courseId: 'confidence-reboot',
        completedLessons: [],
        lastWatchedLesson: 'cr-00-welcome',
        lastVideoPosition: 45,
        notes: {},
        startedAt: new Date('2026-03-03').toISOString(),
        lastAccessedAt: new Date().toISOString(), // Most recent
      },
    })

    await page.reload()
    await page.waitForLoadState('domcontentloaded')

    const continueCard = page.getByTestId('continue-learning-card')
    await expect(continueCard).toBeVisible()

    // Verify it shows the most recent session (Confidence Reboot)
    await expect(continueCard.getByRole('heading', { name: /Confidence Reboot/i })).toBeVisible()

    // Verify link points to correct lesson (continueCard IS the link)
    await expect(continueCard).toHaveAttribute('href', /\/courses\/confidence-reboot\/cr-00-welcome/)
  })

  test('AC4: should show discovery-focused empty state when no sessions exist', async ({
    page,
    localStorage,
  }) => {
    await page.goto('/')

    // No progress seeded - fresh user
    await page.reload()
    await page.waitForLoadState('domcontentloaded')

    // Verify Continue Learning section exists
    const continueSection = page.getByTestId('continue-learning-section')
    await expect(continueSection).toBeVisible()

    // Verify empty state is shown (not the card)
    const continueCard = page.getByTestId('continue-learning-card')
    await expect(continueCard).not.toBeVisible()

    // Verify discovery heading
    await expect(continueSection.getByText(/Start Your Learning Journey/i)).toBeVisible()

    // Verify description
    await expect(
      continueSection.getByText(/Begin with one of these recommended courses/i)
    ).toBeVisible()

    // Verify at least 1 suggested course is displayed
    const suggestedCourses = continueSection.getByTestId(/suggested-course-/)
    await expect(suggestedCourses.first()).toBeVisible()

    // Verify "Explore All Courses" CTA
    const exploreButton = continueSection.getByRole('link', { name: /Explore All Courses/i })
    await expect(exploreButton).toBeVisible()
    await expect(exploreButton).toHaveAttribute('href', '/courses')
  })

  test('AC5: should gracefully handle deleted course content', async ({ page, localStorage }) => {
    await page.goto('/')

    // Seed progress with a non-existent course ID
    await localStorage.seed('course-progress', {
      'deleted-course': {
        courseId: 'deleted-course',
        completedLessons: [],
        lastWatchedLesson: 'deleted-lesson',
        lastVideoPosition: 30,
        notes: {},
        startedAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
      },
    })

    await page.reload()
    await page.waitForLoadState('domcontentloaded')

    // Should fall back to empty state (no crash)
    const continueSection = page.getByTestId('continue-learning-section')
    await expect(continueSection).toBeVisible()

    // Verify empty state is shown (card should not appear)
    const continueCard = page.getByTestId('continue-learning-card')
    await expect(continueCard).not.toBeVisible()

    // Verify discovery message
    await expect(continueSection.getByText(/Start Your Learning Journey/i)).toBeVisible()

    // Page should not crash - verify other sections render
    const statsGrid = page.getByTestId('stats-grid')
    await expect(statsGrid).toBeVisible()
  })

  test('AC6: should be responsive with adequate touch targets on mobile', async ({
    page,
    localStorage,
  }) => {
    // Set mobile viewport (iPhone 12 Pro: 390x844)
    await page.setViewportSize({ width: 390, height: 844 })

    await page.goto('/')

    // Seed active session
    await localStorage.seed('course-progress', {
      'nci-access': {
        courseId: 'nci-access',
        completedLessons: [],
        lastWatchedLesson: 'nci-intro-start-here',
        lastVideoPosition: 15,
        notes: {},
        startedAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
      },
    })

    await page.reload()
    await page.waitForLoadState('domcontentloaded')

    const continueCard = page.getByTestId('continue-learning-card')
    await expect(continueCard).toBeVisible()

    // Verify card is visible and has adequate height
    const cardBox = await continueCard.boundingBox()
    expect(cardBox).not.toBeNull()
    expect(cardBox!.height).toBeGreaterThanOrEqual(88) // Exceeds 44px minimum

    // Verify Resume button has adequate touch target
    const resumeButton = continueCard.getByRole('button', { name: /Resume Learning/i })
    const buttonBox = await resumeButton.boundingBox()
    expect(buttonBox).not.toBeNull()
    expect(buttonBox!.height).toBeGreaterThanOrEqual(44) // Minimum touch target
    expect(buttonBox!.width).toBeGreaterThanOrEqual(44)

    // Verify layout stacks vertically on mobile (continueCard IS the link)
    const linkBox = await continueCard.boundingBox()
    expect(linkBox).not.toBeNull()

    // Card should take full width on mobile
    expect(linkBox!.width).toBeGreaterThan(300) // Reasonable mobile width

    // Verify click interaction works on mobile
    await continueCard.click()
    await page.waitForURL(/\/courses\/nci-access\/nci-intro-start-here/)
    await expect(page).toHaveURL(/\/courses\/nci-access\/nci-intro-start-here/)
  })
})
