import { useMemo } from 'react'
import { Link } from 'react-router'
import { BookOpen, Play, Clock, ArrowRight, AlertCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent } from '@/app/components/ui/card'
import { Progress } from '@/app/components/ui/progress'
import { Button } from '@/app/components/ui/button'
import { allCourses } from '@/data/courses'
import {
  getAllProgress,
  getCourseCompletionPercent,
  getNotStartedCourses,
} from '@/lib/progress'
import type { Course } from '@/data/types'
import type { CourseProgress } from '@/lib/progress'

function findLessonTitle(course: Course, lessonId: string): string | undefined {
  for (const mod of course.modules) {
    for (const lesson of mod.lessons) {
      if (lesson.id === lessonId) return lesson.title
    }
  }
  return undefined
}

interface ResolvedSession {
  course: Course
  progress: CourseProgress
  lessonTitle: string
  completionPercent: number
  resumeLink: string
}

interface DeletedSession {
  courseId: string
  progress: CourseProgress
}

interface SessionResult {
  resolved: ResolvedSession[]
  deleted: DeletedSession[]
}

function resolveSessionData(
  allProgress: Record<string, CourseProgress>
): SessionResult {
  const resolved: ResolvedSession[] = []
  const deleted: DeletedSession[] = []

  const sorted = Object.values(allProgress)
    .filter((p) => p.lastWatchedLesson)
    .sort(
      (a, b) =>
        new Date(b.lastAccessedAt).getTime() -
        new Date(a.lastAccessedAt).getTime()
    )

  for (const progress of sorted) {
    const course = allCourses.find((c) => c.id === progress.courseId)
    if (!course) {
      deleted.push({ courseId: progress.courseId, progress })
      continue
    }

    const lessonTitle =
      findLessonTitle(course, progress.lastWatchedLesson!) ?? 'Unknown Lesson'
    const completionPercent = getCourseCompletionPercent(
      course.id,
      course.totalLessons
    )
    const resumeLink = `/courses/${course.id}/${progress.lastWatchedLesson}?t=${progress.lastVideoPosition ?? 0}`

    resolved.push({
      course,
      progress,
      lessonTitle,
      completionPercent,
      resumeLink,
    })
  }

  return { resolved, deleted }
}

function HeroCard({ session }: { session: ResolvedSession }) {
  const { course, progress, lessonTitle, completionPercent, resumeLink } =
    session
  const lastAccessed = formatDistanceToNow(new Date(progress.lastAccessedAt), {
    addSuffix: true,
  })

  return (
    <Link
      to={resumeLink}
      data-testid="continue-learning-card"
      className="block group"
    >
      <Card className="rounded-[24px] motion-safe:hover:shadow-xl motion-safe:hover:scale-[1.01] motion-safe:transition-shadow motion-safe:duration-200 cursor-pointer overflow-hidden">
        <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {course.coverImage ? (
            <img
              src={`${course.coverImage}-320w.webp`}
              alt={course.title}
              className="size-20 rounded-xl object-cover flex-shrink-0"
              loading="lazy"
            />
          ) : (
            <div className="size-20 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
              <BookOpen aria-hidden="true" className="size-10 text-brand" />
            </div>
          )}

          <div className="flex-1 min-w-0 w-full">
            <h3 className="text-lg font-semibold truncate">{course.title}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
              <Play aria-hidden="true" className="size-3.5" />
              {lessonTitle}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex-1 min-w-0">
                <Progress
                  value={completionPercent}
                  className="h-2"
                  aria-label={`${course.title}: ${completionPercent}% complete`}
                />
              </div>
              <span className="text-sm font-medium whitespace-nowrap">
                {completionPercent}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
              <Clock aria-hidden="true" className="size-3" />
              Last accessed {lastAccessed}
            </p>
          </div>

          <Button
            variant="default"
            size="lg"
            className="rounded-xl min-h-11 min-w-11 flex-shrink-0 self-center"
            tabIndex={-1}
            aria-hidden="true"
          >
            Resume Learning
            <ArrowRight aria-hidden="true" className="size-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}

function RecentlyAccessedRow({
  sessions,
}: {
  sessions: ResolvedSession[]
}) {
  if (sessions.length === 0) return null

  return (
    <div className="mt-4" data-testid="recently-accessed-row">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Recently Accessed
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sessions.map(({ course, completionPercent, resumeLink }) => (
          <Link key={course.id} to={resumeLink}>
            <Card className="group motion-safe:hover:shadow-lg motion-safe:hover:scale-[1.01] motion-safe:transition-shadow motion-safe:duration-200 cursor-pointer rounded-2xl">
              <CardContent className="p-4 flex items-center gap-4">
                {course.coverImage ? (
                  <img
                    src={`${course.coverImage}-320w.webp`}
                    alt={course.title}
                    className="size-12 rounded-lg object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="size-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <BookOpen aria-hidden="true" className="size-6 text-brand" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate text-sm">
                    {course.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Progress
                      value={completionPercent}
                      className="h-1.5 flex-1"
                      aria-label={`${course.title}: ${completionPercent}% complete`}
                    />
                    <span className="text-xs font-medium">
                      {completionPercent}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

function DeletedContentBanner({ count }: { count: number }) {
  return (
    <div
      data-testid="content-unavailable-message"
      className="flex items-center gap-3 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4 mb-4"
    >
      <AlertCircle aria-hidden="true" className="size-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
          {count === 1
            ? 'A course you were studying is no longer available.'
            : `${count} courses you were studying are no longer available.`}
        </p>
        <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
          <Link to="/courses" className="underline hover:no-underline">
            Explore other courses
          </Link>{' '}
          to continue your learning journey.
        </p>
      </div>
    </div>
  )
}

function DiscoveryState() {
  const notStarted = getNotStartedCourses(allCourses)
  const suggested = notStarted.slice(0, 3)

  return (
    <div className="text-center py-8">
      <div className="size-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
        <BookOpen aria-hidden="true" className="size-8 text-brand" />
      </div>
      <h3 className="text-lg font-semibold mb-2">
        Start Your Learning Journey
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        Begin with one of these recommended courses
      </p>

      {suggested.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 max-w-2xl mx-auto">
          {suggested.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              data-testid={`suggested-course-${course.id}`}
            >
              <Card className="motion-safe:hover:shadow-lg motion-safe:hover:scale-[1.01] motion-safe:transition-shadow motion-safe:duration-200 cursor-pointer rounded-2xl h-full">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  {course.coverImage ? (
                    <img
                      src={`${course.coverImage}-320w.webp`}
                      alt={course.title}
                      className="size-16 rounded-xl object-cover mb-3"
                      loading="lazy"
                    />
                  ) : (
                    <div className="size-16 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                      <BookOpen aria-hidden="true" className="size-8 text-brand" />
                    </div>
                  )}
                  <h4 className="font-medium text-sm">{course.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {course.totalLessons} lessons
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Button asChild size="lg" className="rounded-xl min-h-11">
        <Link to="/courses">
          Explore All Courses
          <ArrowRight aria-hidden="true" className="size-4 ml-2" />
        </Link>
      </Button>
    </div>
  )
}

export function ContinueLearning() {
  const allProgress = getAllProgress()
  const { resolved: sessions, deleted } = useMemo(
    () => resolveSessionData(allProgress),
    [allProgress]
  )
  const heroSession = sessions[0]
  const otherSessions = sessions.slice(1)

  return (
    <section
      data-testid="continue-learning-section"
      className="mb-8"
      aria-labelledby="continue-learning-heading"
    >
      <h2 id="continue-learning-heading" className="text-lg font-semibold mb-4">
        Continue Learning
      </h2>
      {deleted.length > 0 && <DeletedContentBanner count={deleted.length} />}
      {heroSession ? (
        <>
          <HeroCard session={heroSession} />
          <RecentlyAccessedRow sessions={otherSessions} />
        </>
      ) : (
        <DiscoveryState />
      )}
    </section>
  )
}
