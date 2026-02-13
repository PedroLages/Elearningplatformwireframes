import { test, expect } from '@playwright/test'

test('Week 4 - Progress Chart visualization', async ({ page }) => {
  // Listen for errors
  page.on('console', msg => console.log('Browser:', msg.text()))
  page.on('pageerror', err => console.error('Page error:', err.message))

  await page.goto('/', { waitUntil: 'networkidle' })

  // Add comprehensive test data with varied activity across 14 days
  await page.evaluate(() => {
    const now = new Date()

    // Helper to create date N days ago
    const daysAgo = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000)

    // Course progress data
    const progress = {
      'operative-six': {
        courseId: 'operative-six',
        completedLessons: ['lesson-1', 'lesson-2', 'lesson-3', 'lesson-4', 'lesson-5'],
        lastWatchedLesson: 'lesson-5',
        notes: {
          'lesson-1': 'Foundation concepts',
          'lesson-3': 'Key patterns'
        },
        startedAt: daysAgo(13).toISOString(),
        lastAccessedAt: now.toISOString()
      },
      '6mx': {
        courseId: '6mx',
        completedLessons: ['lesson-1', 'lesson-2', 'lesson-3'],
        lastWatchedLesson: 'lesson-4',
        notes: {
          'lesson-2': 'Important review'
        },
        startedAt: daysAgo(10).toISOString(),
        lastAccessedAt: daysAgo(1).toISOString()
      }
    }

    // Study log with varied activity across 14 days
    // Pattern: 5 actions on day 0, 3 on day 1, 4 on day 2, etc.
    const studyLog = [
      // Today (5 actions)
      { type: 'lesson_complete', courseId: 'operative-six', lessonId: 'lesson-5', timestamp: now.toISOString() },
      { type: 'video_progress', courseId: 'operative-six', lessonId: 'lesson-5', timestamp: now.toISOString() },
      { type: 'note_saved', courseId: 'operative-six', lessonId: 'lesson-3', timestamp: now.toISOString() },
      { type: 'video_progress', courseId: '6mx', lessonId: 'lesson-4', timestamp: now.toISOString() },
      { type: 'note_saved', courseId: '6mx', lessonId: 'lesson-2', timestamp: now.toISOString() },

      // 1 day ago (3 actions)
      { type: 'lesson_complete', courseId: 'operative-six', lessonId: 'lesson-4', timestamp: daysAgo(1).toISOString() },
      { type: 'video_progress', courseId: 'operative-six', lessonId: 'lesson-4', timestamp: daysAgo(1).toISOString() },
      { type: 'lesson_complete', courseId: '6mx', lessonId: 'lesson-3', timestamp: daysAgo(1).toISOString() },

      // 2 days ago (4 actions)
      { type: 'lesson_complete', courseId: 'operative-six', lessonId: 'lesson-3', timestamp: daysAgo(2).toISOString() },
      { type: 'video_progress', courseId: 'operative-six', lessonId: 'lesson-3', timestamp: daysAgo(2).toISOString() },
      { type: 'lesson_complete', courseId: '6mx', lessonId: 'lesson-2', timestamp: daysAgo(2).toISOString() },
      { type: 'note_saved', courseId: 'operative-six', lessonId: 'lesson-1', timestamp: daysAgo(2).toISOString() },

      // 3 days ago (2 actions)
      { type: 'lesson_complete', courseId: 'operative-six', lessonId: 'lesson-2', timestamp: daysAgo(3).toISOString() },
      { type: 'video_progress', courseId: 'operative-six', lessonId: 'lesson-2', timestamp: daysAgo(3).toISOString() },

      // 4 days ago (6 actions - peak day)
      { type: 'lesson_complete', courseId: 'operative-six', lessonId: 'lesson-1', timestamp: daysAgo(4).toISOString() },
      { type: 'video_progress', courseId: 'operative-six', lessonId: 'lesson-1', timestamp: daysAgo(4).toISOString() },
      { type: 'course_started', courseId: 'operative-six', timestamp: daysAgo(4).toISOString() },
      { type: 'lesson_complete', courseId: '6mx', lessonId: 'lesson-1', timestamp: daysAgo(4).toISOString() },
      { type: 'video_progress', courseId: '6mx', lessonId: 'lesson-1', timestamp: daysAgo(4).toISOString() },
      { type: 'course_started', courseId: '6mx', timestamp: daysAgo(4).toISOString() },

      // 5 days ago (1 action - low activity)
      { type: 'video_progress', courseId: '6mx', lessonId: 'lesson-1', timestamp: daysAgo(5).toISOString() },

      // 6 days ago (3 actions)
      { type: 'video_progress', courseId: 'operative-six', lessonId: 'lesson-1', timestamp: daysAgo(6).toISOString() },
      { type: 'note_saved', courseId: 'operative-six', lessonId: 'lesson-1', timestamp: daysAgo(6).toISOString() },
      { type: 'video_progress', courseId: '6mx', lessonId: 'lesson-1', timestamp: daysAgo(6).toISOString() },

      // 7 days ago (4 actions)
      { type: 'video_progress', courseId: 'operative-six', lessonId: 'lesson-1', timestamp: daysAgo(7).toISOString() },
      { type: 'note_saved', courseId: 'operative-six', lessonId: 'lesson-1', timestamp: daysAgo(7).toISOString() },
      { type: 'video_progress', courseId: '6mx', lessonId: 'lesson-1', timestamp: daysAgo(7).toISOString() },
      { type: 'note_saved', courseId: '6mx', lessonId: 'lesson-1', timestamp: daysAgo(7).toISOString() },

      // 8 days ago (2 actions)
      { type: 'video_progress', courseId: 'operative-six', lessonId: 'lesson-1', timestamp: daysAgo(8).toISOString() },
      { type: 'video_progress', courseId: '6mx', lessonId: 'lesson-1', timestamp: daysAgo(8).toISOString() },

      // 9 days ago (1 action)
      { type: 'video_progress', courseId: '6mx', lessonId: 'lesson-1', timestamp: daysAgo(9).toISOString() },

      // 10 days ago (5 actions)
      { type: 'video_progress', courseId: 'operative-six', lessonId: 'lesson-1', timestamp: daysAgo(10).toISOString() },
      { type: 'note_saved', courseId: 'operative-six', lessonId: 'lesson-1', timestamp: daysAgo(10).toISOString() },
      { type: 'video_progress', courseId: '6mx', lessonId: 'lesson-1', timestamp: daysAgo(10).toISOString() },
      { type: 'note_saved', courseId: '6mx', lessonId: 'lesson-1', timestamp: daysAgo(10).toISOString() },
      { type: 'course_started', courseId: '6mx', timestamp: daysAgo(10).toISOString() },

      // 11 days ago (3 actions)
      { type: 'video_progress', courseId: 'operative-six', lessonId: 'lesson-1', timestamp: daysAgo(11).toISOString() },
      { type: 'video_progress', courseId: '6mx', lessonId: 'lesson-1', timestamp: daysAgo(11).toISOString() },
      { type: 'note_saved', courseId: '6mx', lessonId: 'lesson-1', timestamp: daysAgo(11).toISOString() },

      // 12 days ago (2 actions)
      { type: 'video_progress', courseId: 'operative-six', lessonId: 'lesson-1', timestamp: daysAgo(12).toISOString() },
      { type: 'video_progress', courseId: '6mx', lessonId: 'lesson-1', timestamp: daysAgo(12).toISOString() },

      // 13 days ago (4 actions)
      { type: 'video_progress', courseId: 'operative-six', lessonId: 'lesson-1', timestamp: daysAgo(13).toISOString() },
      { type: 'note_saved', courseId: 'operative-six', lessonId: 'lesson-1', timestamp: daysAgo(13).toISOString() },
      { type: 'course_started', courseId: 'operative-six', timestamp: daysAgo(13).toISOString() },
      { type: 'video_progress', courseId: '6mx', lessonId: 'lesson-1', timestamp: daysAgo(13).toISOString() },
    ]

    localStorage.setItem('course-progress', JSON.stringify(progress))
    localStorage.setItem('study-log', JSON.stringify(studyLog))
  })

  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(3000)

  // Verify progress chart is visible
  const chartTitle = await page.getByText('Learning Activity')
  await expect(chartTitle).toBeVisible()

  // Verify chart description
  const chartDescription = await page.getByText('Your study activity over the last 14 days')
  await expect(chartDescription).toBeVisible()

  // Scroll to the chart section
  await chartTitle.scrollIntoViewIfNeeded()
  await page.waitForTimeout(1000)

  // Take screenshot of the chart section
  const chartCard = page.locator('.recharts-wrapper').first()
  await chartCard.screenshot({
    path: 'tests/screenshots/week4-chart-only.png'
  })

  // Take full page screenshot to show all Week 4 features
  await page.screenshot({
    path: 'tests/screenshots/week4-full-desktop.png',
    fullPage: true
  })

  // Scroll back to top and take viewport screenshot
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(500)
  await page.screenshot({
    path: 'tests/screenshots/week4-hero.png',
    fullPage: false
  })

  console.log('✅ Week 4 Progress Chart test completed successfully')
})
