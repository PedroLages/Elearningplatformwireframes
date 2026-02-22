import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, Video, FileText, FolderSearch } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { db } from '@/db/schema'
import type { ImportedCourse, ImportedVideo, ImportedPdf } from '@/data/types'

function formatDuration(seconds: number): string {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = String(seconds % 60).padStart(2, '0')
    return `${h}:${String(m).padStart(2, '0')}:${s}`
  }
  const m = Math.floor(seconds / 60)
  const s = String(seconds % 60).padStart(2, '0')
  return `${m}:${s}`
}

export function ImportedCourseDetail() {
  const { courseId } = useParams<{ courseId: string }>()

  const [course, setCourse] = useState<ImportedCourse | null | undefined>(undefined)
  const [videos, setVideos] = useState<ImportedVideo[]>([])
  const [pdfs, setPdfs] = useState<ImportedPdf[]>([])

  useEffect(() => {
    if (!courseId) return
    let cancelled = false
    db.importedCourses.get(courseId)
      .then(c => { if (!cancelled) setCourse(c ?? null) })
      .catch(() => { if (!cancelled) setCourse(null) })
    db.importedVideos.where('courseId').equals(courseId).sortBy('order')
      .then(vs => { if (!cancelled) setVideos(vs) })
      .catch(() => { if (!cancelled) setVideos([]) })
    db.importedPdfs.where('courseId').equals(courseId).toArray()
      .then(ps => { if (!cancelled) setPdfs(ps) })
      .catch(() => { if (!cancelled) setPdfs([]) })
    return () => { cancelled = true }
  }, [courseId])

  if (course === undefined) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <span className="text-sm">Loading…</span>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 px-4 text-muted-foreground">
        <div className="flex flex-col items-center gap-3 text-center max-w-sm">
          <FolderSearch className="size-12" aria-hidden="true" />
          <h1 className="font-semibold text-lg text-foreground">Course not found</h1>
          <p className="text-sm">
            This course may have been removed or the link is incorrect.
          </p>
        </div>
        <Button variant="outline" size="lg" asChild>
          <Link to="/courses">Back to Courses</Link>
        </Button>
      </div>
    )
  }

  return (
    <div data-testid="imported-course-detail" className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <Link
        to="/courses"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors py-2 -my-2"
      >
        <ArrowLeft className="size-4" />
        Back to Courses
      </Link>

      <h1 data-testid="course-detail-title" className="text-2xl font-bold mb-1 text-balance">
        {course.name}
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        Imported {new Date(course.importedAt).toLocaleDateString()} &middot;{' '}
        {course.videoCount} {course.videoCount === 1 ? 'video' : 'videos'},{' '}
        {course.pdfCount} {course.pdfCount === 1 ? 'PDF' : 'PDFs'}
      </p>

      <ul data-testid="course-content-list" className="flex flex-col gap-2">
        {videos.map(video => (
          <li key={video.id} data-testid="course-content-item-video">
            <Link
              to={`/imported-courses/${courseId}/lessons/${video.id}`}
              className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-accent active:bg-accent/80 transition-colors group"
            >
              <Video
                data-testid="content-type-icon"
                className="size-5 text-brand shrink-0"
                aria-hidden="true"
              />
              <span className="flex-1 font-medium text-sm group-hover:text-brand transition-colors">
                {video.filename}
              </span>
              {video.duration > 0 && (
                <span className="text-xs text-muted-foreground tabular-nums">
                  {formatDuration(video.duration)}
                </span>
              )}
            </Link>
          </li>
        ))}

        {pdfs.map(pdf => (
          <li key={pdf.id} data-testid="course-content-item-pdf">
            <div className="flex items-center gap-3 p-4 rounded-xl border bg-card opacity-75 cursor-not-allowed" aria-disabled="true" title="PDF viewing coming soon">
              <FileText
                data-testid="content-type-icon"
                className="size-5 text-orange-500 shrink-0"
                aria-hidden="true"
              />
              <span className="flex-1 font-medium text-sm">{pdf.filename}</span>
              {pdf.pageCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  {pdf.pageCount} {pdf.pageCount === 1 ? 'page' : 'pages'}
                </span>
              )}
            </div>
          </li>
        ))}

        {videos.length === 0 && pdfs.length === 0 && (
          <li className="text-sm text-muted-foreground text-center py-8">
            No content found in this course.
          </li>
        )}
      </ul>
    </div>
  )
}
