import { test } from '@playwright/test'

test('Week 2 - Full page capture with all sections', async ({ page }) => {
  await page.goto('/')

  // Add test data
  await page.evaluate(() => {
    const now = new Date()
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)

    const progress = {
      'operative-six': {
        courseId: 'operative-six',
        completedLessons: ['lesson-1', 'lesson-2', 'lesson-3', 'lesson-4', 'lesson-5', 'lesson-6', 'lesson-7', 'lesson-8', 'lesson-9', 'lesson-10', 'lesson-11', 'lesson-12'],
        lastWatchedLesson: 'lesson-13',
        notes: {
          'lesson-1': 'Great introduction to operative work',
          'lesson-5': 'Key concepts about behavior analysis'
        },
        startedAt: fiveDaysAgo.toISOString(),
        lastAccessedAt: twoDaysAgo.toISOString()
      },
      '6mx': {
        courseId: '6mx',
        completedLessons: ['lesson-1', 'lesson-2', 'lesson-3'],
        lastWatchedLesson: 'lesson-4',
        notes: {},
        startedAt: threeDaysAgo.toISOString(),
        lastAccessedAt: now.toISOString()
      },
      'behavior-skills': {
        courseId: 'behavior-skills',
        completedLessons: ['lesson-1'],
        lastWatchedLesson: 'lesson-2',
        notes: {
          'lesson-1': 'Fundamentals are solid'
        },
        startedAt: fiveDaysAgo.toISOString(),
        lastAccessedAt: threeDaysAgo.toISOString()
      }
    }

    const studyLog = [
      { type: 'lesson_complete', courseId: '6mx', lessonId: 'lesson-3', timestamp: now.toISOString() },
      { type: 'lesson_complete', courseId: 'operative-six', lessonId: 'lesson-12', timestamp: twoDaysAgo.toISOString() },
      { type: 'lesson_complete', courseId: 'operative-six', lessonId: 'lesson-11', timestamp: twoDaysAgo.toISOString() },
      { type: 'note_saved', courseId: 'behavior-skills', lessonId: 'lesson-1', timestamp: threeDaysAgo.toISOString() },
      { type: 'lesson_complete', courseId: 'behavior-skills', lessonId: 'lesson-1', timestamp: threeDaysAgo.toISOString() },
      { type: 'lesson_complete', courseId: '6mx', lessonId: 'lesson-2', timestamp: threeDaysAgo.toISOString() },
      { type: 'lesson_complete', courseId: '6mx', lessonId: 'lesson-1', timestamp: threeDaysAgo.toISOString() }
    ]

    localStorage.setItem('course-progress', JSON.stringify(progress))
    localStorage.setItem('study-log', JSON.stringify(studyLog))
  })

  await page.reload()
  await page.waitForTimeout(2000)

  // Take multiple screenshots to show different sections
  await page.screenshot({
    path: 'tests/screenshots/week2-final-full.png',
    fullPage: true
  })

  // Also take a viewport screenshot showing the above-fold content
  await page.screenshot({
    path: 'tests/screenshots/week2-final-hero.png',
    fullPage: false
  })
})
