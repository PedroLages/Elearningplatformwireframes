import { test } from '@playwright/test'

test('Week 3 - All Polish & Delight features', async ({ page }) => {
  // Listen for errors
  page.on('console', msg => console.log('Browser:', msg.text()))
  page.on('pageerror', err => console.error('Page error:', err.message))

  await page.goto('/', { waitUntil: 'networkidle' })

  // Add comprehensive test data
  await page.evaluate(() => {
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
    const sixDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Course progress with varied completion states
    const progress = {
      // Completed course (100%)
      'operative-six': {
        courseId: 'operative-six',
        completedLessons: ['lesson-1', 'lesson-2', 'lesson-3', 'lesson-4', 'lesson-5', 'lesson-6', 'lesson-7', 'lesson-8', 'lesson-9', 'lesson-10', 'lesson-11', 'lesson-12', 'lesson-13', 'lesson-14', 'lesson-15'],
        lastWatchedLesson: 'lesson-15',
        notes: {
          'lesson-1': 'Excellent foundation',
          'lesson-5': 'Key behavioral patterns',
          'lesson-10': 'Advanced techniques'
        },
        startedAt: sevenDaysAgo.toISOString(),
        lastAccessedAt: oneDayAgo.toISOString()
      },
      // In-progress course (~60%)
      '6mx': {
        courseId: '6mx',
        completedLessons: ['lesson-1', 'lesson-2', 'lesson-3', 'lesson-4', 'lesson-5', 'lesson-6'],
        lastWatchedLesson: 'lesson-7',
        notes: {
          'lesson-3': 'Important concepts to review',
          'lesson-5': 'Practical applications'
        },
        startedAt: fiveDaysAgo.toISOString(),
        lastAccessedAt: now.toISOString()
      },
      // In-progress course (~30%)
      'behavior-skills': {
        courseId: 'behavior-skills',
        completedLessons: ['lesson-1', 'lesson-2', 'lesson-3'],
        lastWatchedLesson: 'lesson-4',
        notes: {
          'lesson-1': 'Great starting point'
        },
        startedAt: fourDaysAgo.toISOString(),
        lastAccessedAt: twoDaysAgo.toISOString()
      },
      // Just started course (~10%)
      'authority': {
        courseId: 'authority',
        completedLessons: ['lesson-1'],
        lastWatchedLesson: 'lesson-2',
        notes: {},
        startedAt: threeDaysAgo.toISOString(),
        lastAccessedAt: threeDaysAgo.toISOString()
      }
    }

    // Study log with 7-day streak
    const studyLog = [
      // Today
      { type: 'lesson_complete', courseId: '6mx', lessonId: 'lesson-6', timestamp: now.toISOString() },
      { type: 'video_progress', courseId: '6mx', lessonId: 'lesson-7', timestamp: now.toISOString() },

      // Yesterday
      { type: 'lesson_complete', courseId: 'operative-six', lessonId: 'lesson-15', timestamp: oneDayAgo.toISOString() },
      { type: 'note_saved', courseId: 'operative-six', lessonId: 'lesson-10', timestamp: oneDayAgo.toISOString() },

      // 2 days ago
      { type: 'lesson_complete', courseId: 'behavior-skills', lessonId: 'lesson-3', timestamp: twoDaysAgo.toISOString() },
      { type: 'lesson_complete', courseId: 'behavior-skills', lessonId: 'lesson-2', timestamp: twoDaysAgo.toISOString() },

      // 3 days ago
      { type: 'lesson_complete', courseId: 'authority', lessonId: 'lesson-1', timestamp: threeDaysAgo.toISOString() },
      { type: 'course_started', courseId: 'authority', timestamp: threeDaysAgo.toISOString() },

      // 4 days ago
      { type: 'lesson_complete', courseId: 'behavior-skills', lessonId: 'lesson-1', timestamp: fourDaysAgo.toISOString() },
      { type: 'note_saved', courseId: 'behavior-skills', lessonId: 'lesson-1', timestamp: fourDaysAgo.toISOString() },

      // 5 days ago
      { type: 'lesson_complete', courseId: '6mx', lessonId: 'lesson-5', timestamp: fiveDaysAgo.toISOString() },
      { type: 'lesson_complete', courseId: '6mx', lessonId: 'lesson-4', timestamp: fiveDaysAgo.toISOString() },

      // 6 days ago
      { type: 'lesson_complete', courseId: '6mx', lessonId: 'lesson-3', timestamp: sixDaysAgo.toISOString() },
      { type: 'note_saved', courseId: '6mx', lessonId: 'lesson-3', timestamp: sixDaysAgo.toISOString() },

      // 7 days ago
      { type: 'lesson_complete', courseId: '6mx', lessonId: 'lesson-2', timestamp: sevenDaysAgo.toISOString() },
      { type: 'lesson_complete', courseId: '6mx', lessonId: 'lesson-1', timestamp: sevenDaysAgo.toISOString() },
    ]

    localStorage.setItem('course-progress', JSON.stringify(progress))
    localStorage.setItem('study-log', JSON.stringify(studyLog))
  })

  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(3000)

  // Take full page screenshot to show all Week 3 features
  await page.screenshot({
    path: 'tests/screenshots/week3-full-desktop.png',
    fullPage: true
  })

  // Take viewport screenshot showing above-fold content
  await page.screenshot({
    path: 'tests/screenshots/week3-hero.png',
    fullPage: false
  })
})
