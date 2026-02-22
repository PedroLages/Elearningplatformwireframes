import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, FileWarning, FolderSearch } from 'lucide-react'
import { db } from '@/db/schema'
import { useVideoFromHandle } from '@/hooks/useVideoFromHandle'
import { VideoPlayer } from '@/app/components/figma/VideoPlayer'
import { Button } from '@/app/components/ui/button'
import type { ImportedCourse, ImportedVideo } from '@/data/types'

export function ImportedLessonPlayer() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()

  const [course, setCourse] = useState<ImportedCourse | null | undefined>(undefined)
  const [video, setVideo] = useState<ImportedVideo | null | undefined>(undefined)

  useEffect(() => {
    if (!courseId) { setCourse(null); return }
    let cancelled = false
    db.importedCourses.get(courseId)
      .then(c => { if (!cancelled) setCourse(c ?? null) })
      .catch(() => { if (!cancelled) setCourse(null) })
    return () => { cancelled = true }
  }, [courseId])

  useEffect(() => {
    if (!lessonId) { setVideo(null); return }
    let cancelled = false
    db.importedVideos.get(lessonId)
      .then(v => { if (!cancelled) setVideo(v ?? null) })
      .catch(() => { if (!cancelled) setVideo(null) })
    return () => { cancelled = true }
  }, [lessonId])

  const { blobUrl, error, loading } = useVideoFromHandle(video?.fileHandle)

  async function handleLocateFile() {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'Video files',
            accept: { 'video/*': ['.mp4', '.mkv', '.avi', '.webm'] },
          },
        ],
        multiple: false,
      })
      if (lessonId) {
        await db.importedVideos.update(lessonId, { fileHandle })
        // Re-fetch the updated video record to trigger hook re-run
        const updated = await db.importedVideos.get(lessonId)
        setVideo(updated ?? null)
      }
    } catch {
      // User cancelled the picker — do nothing
    }
  }

  // Loading state (initial Dexie query in flight or blob URL loading)
  if (video === undefined || loading) {
    return (
      <div
        data-testid="lesson-player-content"
        className="flex items-center justify-center h-full text-muted-foreground"
      >
        <span className="text-sm">Loading…</span>
      </div>
    )
  }

  // Video record not found in Dexie
  if (video === null) {
    return (
      <div
        data-testid="lesson-player-content"
        className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground"
      >
        <p>Video not found.</p>
        <Link
          to={`/imported-courses/${courseId}`}
          className="text-sm text-brand hover:underline"
        >
          Back to Course
        </Link>
      </div>
    )
  }

  return (
    <div data-testid="lesson-player-content" className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b shrink-0">
        <Link
          to={`/imported-courses/${courseId}`}
          className="inline-flex items-center justify-center p-3 -ml-3 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Back to Course"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Link>
        <div className="flex flex-col min-w-0">
          <span
            data-testid="lesson-header-title"
            className="font-semibold text-sm truncate"
          >
            {video.filename}
          </span>
          {course && (
            <span
              data-testid="lesson-header-course"
              className="text-xs text-muted-foreground truncate"
            >
              {course.name}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {error ? (
          <div
            data-testid="lesson-error-state"
            className="flex flex-col items-center justify-center h-full gap-6 px-4"
          >
            <div className="flex flex-col items-center gap-3 text-center max-w-sm">
              <FileWarning className="size-12 text-muted-foreground" aria-hidden="true" />
              <h1 className="font-semibold text-lg text-balance">Video file not found</h1>
              <p className="text-sm text-muted-foreground">
                {error === 'permission-denied'
                  ? 'Permission was denied. Grant access to play this video.'
                  : 'Would you like to locate it?'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleLocateFile} size="lg" className="gap-2">
                <FolderSearch className="size-4" aria-hidden="true" />
                Locate File
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to={`/imported-courses/${courseId}`}>Back to Course</Link>
              </Button>
            </div>
          </div>
        ) : blobUrl ? (
          <VideoPlayer
            src={blobUrl}
            title={video.filename}
            courseId={courseId}
            lessonId={lessonId}
          />
        ) : null}
      </div>
    </div>
  )
}
