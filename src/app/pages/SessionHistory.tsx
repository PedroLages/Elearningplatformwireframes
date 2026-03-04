import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router'
import { History, ChevronDown, ChevronUp, X } from 'lucide-react'
import { db } from '@/db'
import { EmptyState } from '@/app/components/EmptyState'
import type { StudySession, ImportedCourse, ImportedVideo } from '@/data/types'

// Extended session type that includes denormalized display fields
// (may be present when seeded directly, otherwise resolved from related tables)
interface DisplaySession extends StudySession {
  courseTitle?: string
  contentSummary?: string
  contentItems?: Array<{ id: string; title: string; timestamp: number }>
}

const PAGE_SIZE = 20

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

function formatTime(timestamp: string | number): string {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

function formatDate(timestamp: string | number): string {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function toDate(timestamp: string | number): Date {
  return typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp)
}

export function SessionHistory() {
  const [sessions, setSessions] = useState<DisplaySession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [courseFilter, setCourseFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  // Load sessions and resolve display names
  useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const allSessions = await db.studySessions.toArray() as DisplaySession[]

        // Only show completed sessions (with endTime)
        const completed = allSessions.filter(s => s.endTime != null)

        // Build lookup maps for name resolution (for sessions without denormalized fields)
        const courses = await db.importedCourses.toArray()
        const videos = await db.importedVideos.toArray()
        const courseMap = new Map<string, ImportedCourse>(courses.map(c => [c.id, c]))
        const videoMap = new Map<string, ImportedVideo>(videos.map(v => [v.id, v]))

        // Resolve display names where missing
        for (const session of completed) {
          if (!session.courseTitle) {
            const course = courseMap.get(session.courseId)
            if (course) session.courseTitle = course.name
          }
          if (!session.contentSummary && session.videosWatched?.length) {
            session.contentSummary = session.videosWatched
              .map(vid => videoMap.get(vid)?.filename ?? vid)
              .join(', ')
          }
        }

        // Sort reverse chronological
        completed.sort((a, b) => toDate(b.startTime).getTime() - toDate(a.startTime).getTime())

        setSessions(completed)
      } catch (error) {
        console.error('[SessionHistory] Failed to load sessions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  // Unique courses for filter dropdown
  const courseOptions = useMemo(() => {
    const seen = new Map<string, string>()
    for (const s of sessions) {
      if (!seen.has(s.courseId)) {
        seen.set(s.courseId, s.courseTitle || s.courseId)
      }
    }
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }))
  }, [sessions])

  // Apply filters
  const filteredSessions = useMemo(() => {
    let result = sessions

    if (courseFilter) {
      result = result.filter(s => s.courseId === courseFilter)
    }

    if (startDate) {
      const start = new Date(startDate + 'T00:00:00')
      result = result.filter(s => toDate(s.startTime) >= start)
    }

    if (endDate) {
      const end = new Date(endDate + 'T23:59:59.999')
      result = result.filter(s => toDate(s.startTime) <= end)
    }

    return result
  }, [sessions, courseFilter, startDate, endDate])

  // Paginated slice
  const visibleSessions = filteredSessions.slice(0, visibleCount)
  const hasMore = visibleCount < filteredSessions.length

  const handleClearFilter = useCallback(() => {
    setCourseFilter('')
  }, [])

  const handleShowMore = useCallback(() => {
    setVisibleCount(prev => prev + PAGE_SIZE)
  }, [])

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [courseFilter, startDate, endDate])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Study Session History</h1>

      {sessions.length === 0 ? (
        <EmptyState
          icon={History}
          title="No Study Sessions Yet"
          description="Start learning to see your study history here"
          actionLabel="Browse Courses"
          actionHref="/courses"
        />
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="course-filter" className="text-sm font-medium">
                Filter by course
              </label>
              <select
                id="course-filter"
                value={courseFilter}
                onChange={e => setCourseFilter(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="">All Courses</option>
                {courseOptions.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {courseFilter && (
              <button
                onClick={handleClearFilter}
                className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent"
              >
                <X className="h-3 w-3" />
                Clear filter
              </button>
            )}

            <div className="flex flex-col gap-1">
              <label htmlFor="start-date" className="text-sm font-medium">
                Start date
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="end-date" className="text-sm font-medium">
                End date
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Session List */}
          <div className="space-y-3">
            {visibleSessions.map(session => (
              <div
                key={session.id}
                data-testid="session-entry"
                role="button"
                tabIndex={0}
                onClick={() => setExpandedId(prev => (prev === session.id ? null : session.id))}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedId(prev => (prev === session.id ? null : session.id)) } }}
                className="cursor-pointer rounded-[24px] border border-border bg-card p-4 transition-colors hover:bg-accent/50"
              >
                <div className="flex w-full items-center justify-between text-left">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(session.startTime)}
                    </span>
                    <span className="font-semibold">
                      {session.courseTitle || session.courseId}
                    </span>
                    <span className="text-sm font-medium text-brand">
                      {formatDuration(session.duration)}
                    </span>
                  </div>
                  {expandedId === session.id ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                {/* Content summary (hidden when expanded to avoid duplicate text) */}
                {session.contentSummary && expandedId !== session.id && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {session.contentSummary}
                  </p>
                )}

                {/* Expanded details */}
                {expandedId === session.id && (
                  <div className="mt-4 border-t border-border pt-4 space-y-3">
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="text-muted-foreground">Start: </span>
                        <span>{formatTime(session.startTime)}</span>
                      </div>
                      {session.endTime && (
                        <div>
                          <span className="text-muted-foreground">End: </span>
                          <span>{formatTime(session.endTime)}</span>
                        </div>
                      )}
                    </div>

                    {/* Content items */}
                    {session.contentItems && session.contentItems.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Content Accessed</h4>
                        <ul className="space-y-1">
                          {session.contentItems.map(item => (
                            <li key={item.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{item.title}</span>
                              <span className="text-xs text-muted-foreground/70">
                                {toDate(item.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Videos watched (from real sessions without contentItems) */}
                    {!session.contentItems && session.videosWatched?.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Videos Watched</h4>
                        <ul className="space-y-1">
                          {session.videosWatched.map(vid => (
                            <li key={vid} className="text-sm text-muted-foreground">
                              {vid}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Link
                      to={`/courses/${session.courseId}`}
                      onClick={e => e.stopPropagation()}
                      className="inline-flex items-center text-sm font-medium text-brand hover:underline"
                    >
                      Resume Course
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Show more */}
          {hasMore && (
            <div className="flex justify-center">
              <button
                onClick={handleShowMore}
                className="rounded-xl border border-border px-6 py-2 text-sm font-medium hover:bg-accent"
              >
                Show more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
