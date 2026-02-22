import { Link } from 'react-router'
import { CheckCircle, Clock, Play } from 'lucide-react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Progress } from '@/app/components/ui/progress'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Course } from '@/data/types'
import { getTimeRemaining, getProgress } from '@/lib/progress'

interface ProgressCourseCardProps {
  course: Course
  status: 'in-progress' | 'completed' | 'not-started'
  completionPercent?: number
  lastAccessedAt?: string
}

function formatRelativeTime(isoDate: string): string {
  const now = new Date()
  const date = new Date(isoDate)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ${days === 1 ? 'day' : 'days'} ago`
  }
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800)
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  }
  const months = Math.floor(diffInSeconds / 2592000)
  return `${months} ${months === 1 ? 'month' : 'months'} ago`
}

function getDifficultyBadgeVariant(
  difficulty: string
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'secondary' // Will style with green
    case 'intermediate':
      return 'default' // Will style with amber
    case 'advanced':
      return 'destructive' // Uses red by default
    default:
      return 'outline'
  }
}

export function ProgressCourseCard({
  course,
  status,
  completionPercent = 0,
  lastAccessedAt,
}: ProgressCourseCardProps) {
  const timeRemaining = status === 'in-progress' ? getTimeRemaining(course.id, course) : 0
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0)
  const firstLesson = course.modules[0]?.lessons[0]?.id
  const resumeLesson = getProgress(course.id).lastWatchedLesson ?? firstLesson
  const lessonLink = resumeLesson
    ? `/courses/${course.id}/${resumeLesson}`
    : `/courses/${course.id}`

  return (
    <Card
      className={`card-hover-lift h-full ${
        status === 'completed'
          ? 'border-green-200 dark:border-green-800'
          : status === 'not-started'
            ? 'opacity-80 hover:opacity-100'
            : ''
      }`}
    >
      <CardContent className="p-0 flex flex-col h-full">
        <Link to={lessonLink} className="group/img block relative" tabIndex={-1} aria-hidden="true">
          <img
            src={`${course.coverImage}-640w.webp`}
            alt={course.title}
            className="w-full h-36 object-cover rounded-t-[24px]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-t-[24px]" aria-hidden="true" />
          {status === 'completed' && (
            <div
              className="absolute top-2 right-2 bg-success text-success-foreground rounded-full p-1"
              role="status"
              aria-label="Course completed"
            >
              <CheckCircle className="w-4 h-4" aria-hidden="true" />
            </div>
          )}
          {/* Hover play overlay */}
          <div className="absolute inset-0 rounded-t-[24px] bg-black/0 group-hover/img:bg-black/35 transition-colors duration-300 flex items-center justify-center pointer-events-none">
            <div className="relative opacity-0 group-hover/img:opacity-100 scale-75 group-hover/img:scale-100 transition-all duration-300 ease-out">
              <div className="absolute -inset-3 rounded-full bg-brand/50 blur-lg" />
              <span className="play-pulse-ring absolute inset-0 rounded-full bg-white/60" />
              <div className="relative rounded-full bg-white p-4 shadow-2xl">
                <Play className="h-7 w-7 text-brand fill-brand translate-x-0.5" aria-hidden="true" />
              </div>
            </div>
          </div>
        </Link>
        <div className="p-5 flex flex-col gap-3 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="badge-entrance">
              {course.category}
            </Badge>
            <Badge
              variant={getDifficultyBadgeVariant(course.difficulty)}
              className={`badge-entrance ${
                course.difficulty.toLowerCase() === 'beginner'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 hover:bg-green-100 dark:hover:bg-green-900'
                  : course.difficulty.toLowerCase() === 'intermediate'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-900'
                    : ''
              }`}
            >
              {course.difficulty}
            </Badge>
          </div>

          <h3 className="font-semibold line-clamp-2" title={course.title}>
            {course.title}
          </h3>

          {status === 'in-progress' && (
            <>
              <div className="flex items-center gap-2">
                <Progress
                  value={completionPercent}
                  className="h-2 flex-1"
                  aria-label={`${course.title}: ${completionPercent}% complete`}
                />
                <span className="text-sm font-medium">{completionPercent}%</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                {lastAccessedAt && <span>{formatRelativeTime(lastAccessedAt)}</span>}
                {timeRemaining > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />~{timeRemaining}h remaining
                  </span>
                )}
              </div>
              <Button asChild className="button-press w-full bg-blue-600 hover:bg-blue-700 mt-auto">
                <Link to={lessonLink}>
                  Resume Learning
                </Link>
              </Button>
            </>
          )}

          {status === 'completed' && (
            <>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                Completed · {totalLessons} lessons · ~{course.estimatedHours}h
              </p>
              <Button asChild variant="outline" className="button-press w-full mt-auto">
                <Link to={lessonLink}>
                  Review Course
                </Link>
              </Button>
            </>
          )}

          {status === 'not-started' && (
            <p className="text-xs text-muted-foreground mt-auto">
              {course.modules.length} modules · {totalLessons} lessons · ~{course.estimatedHours}h
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
