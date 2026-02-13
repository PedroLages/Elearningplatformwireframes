import { useParams, Link, useNavigate } from "react-router"
import { useMemo, useState, useCallback } from "react"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Textarea } from "../components/ui/textarea"
import { VideoPlayer } from "../components/figma/VideoPlayer"
import { PdfViewer } from "../components/figma/PdfViewer"
import { LessonList } from "../components/figma/LessonList"
import { ResourceBadge } from "../components/figma/ResourceBadge"
import { allCourses } from "@/data/courses"
import { getResourceUrl } from "@/lib/media"
import {
  getProgress,
  markLessonComplete,
  markLessonIncomplete,
  saveVideoPosition,
  saveNote,
  getNote,
  isLessonComplete,
} from "@/lib/progress"

export function LessonPlayer() {
  const { courseId, lessonId } = useParams<{
    courseId: string
    lessonId: string
  }>()
  const navigate = useNavigate()

  const course = allCourses.find((c) => c.id === courseId)

  const { lesson, allLessons, currentIndex } = useMemo(() => {
    if (!course) return { lesson: null, allLessons: [], currentIndex: -1 }
    const all = course.modules.flatMap((m) => m.lessons)
    const idx = all.findIndex((l) => l.id === lessonId)
    return { lesson: all[idx] ?? null, allLessons: all, currentIndex: idx }
  }, [course, lessonId])

  const progress = course ? getProgress(course.id) : null
  const [completed, setCompleted] = useState(() =>
    courseId && lessonId ? isLessonComplete(courseId, lessonId) : false
  )
  const [noteText, setNoteText] = useState(() =>
    courseId && lessonId ? getNote(courseId, lessonId) : ""
  )

  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  const videoResource = lesson?.resources.find((r) => r.type === "video")
  const pdfResources = lesson?.resources.filter((r) => r.type === "pdf") ?? []

  const handleTimeUpdate = useCallback(
    (time: number) => {
      if (courseId && lessonId && Math.floor(time) % 5 === 0) {
        saveVideoPosition(courseId, lessonId, time)
      }
    },
    [courseId, lessonId]
  )

  const handleVideoEnded = useCallback(() => {
    if (courseId && lessonId && !completed) {
      markLessonComplete(courseId, lessonId)
      setCompleted(true)
    }
  }, [courseId, lessonId, completed])

  const toggleComplete = () => {
    if (!courseId || !lessonId) return
    if (completed) {
      markLessonIncomplete(courseId, lessonId)
      setCompleted(false)
    } else {
      markLessonComplete(courseId, lessonId)
      setCompleted(true)
    }
  }

  const handleNoteChange = (value: string) => {
    setNoteText(value)
    if (courseId && lessonId) {
      saveNote(courseId, lessonId, value)
    }
  }

  if (!course || !lesson) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <h2 className="text-xl font-semibold mb-2">Lesson Not Found</h2>
        <Link to="/courses">
          <Button>Back to Courses</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Link
          to={`/courses/${courseId}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {course.shortTitle}
        </Link>

        {/* Video Player */}
        {videoResource && (
          <div className="mb-5">
            <VideoPlayer
              src={getResourceUrl(videoResource)}
              title={lesson.title}
              initialPosition={
                progress?.lastWatchedLesson === lessonId
                  ? progress.lastVideoPosition
                  : undefined
              }
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
            />
          </div>
        )}

        {/* Lesson Header */}
        <div className="bg-card rounded-2xl shadow-sm p-5 mb-5">
          <div className="flex items-start justify-between mb-3">
            <h1 className="text-xl font-bold">{lesson.title}</h1>
            <button
              onClick={toggleComplete}
              aria-label={completed ? "Mark lesson incomplete" : "Mark lesson complete"}
              className="flex items-center gap-1.5 text-sm shrink-0 cursor-pointer"
            >
              {completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground/40" />
              )}
              <span className={completed ? "text-green-600" : "text-muted-foreground"}>
                {completed ? "Completed" : "Mark Complete"}
              </span>
            </button>
          </div>

          {lesson.description && (
            <p className="text-sm text-muted-foreground mb-3">{lesson.description}</p>
          )}

          {lesson.keyTopics.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {lesson.keyTopics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs text-blue-700 dark:text-blue-300"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}

          {lesson.resources.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {lesson.resources.map((r) => (
                <ResourceBadge key={r.id} type={r.type} />
              ))}
            </div>
          )}
        </div>

        {/* Tabs: PDFs / Notes */}
        <Tabs defaultValue={pdfResources.length > 0 ? "materials" : "notes"}>
          <TabsList>
            {pdfResources.length > 0 && (
              <TabsTrigger value="materials">
                Materials ({pdfResources.length})
              </TabsTrigger>
            )}
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          {pdfResources.length > 0 && (
            <TabsContent value="materials" className="mt-4 space-y-4">
              {pdfResources.map((pdf) => (
                <PdfViewer
                  key={pdf.id}
                  src={getResourceUrl(pdf)}
                  title={pdf.title}
                />
              ))}
            </TabsContent>
          )}

          <TabsContent value="notes" className="mt-4">
            <div className="bg-card rounded-2xl shadow-sm p-5">
              <h3 className="text-sm font-semibold mb-3">Your Notes</h3>
              <Textarea
                value={noteText}
                onChange={(e) => handleNoteChange(e.target.value)}
                aria-label="Lesson notes"
                placeholder="Write your notes for this lesson..."
                className="min-h-[200px] resize-y"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Prev / Next Navigation */}
        <div className="flex items-center justify-between mt-6 mb-8">
          {prevLesson ? (
            <Button
              variant="outline"
              onClick={() =>
                navigate(`/courses/${courseId}/${prevLesson.id}`)
              }
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
          ) : (
            <div />
          )}
          {nextLesson ? (
            <Button
              onClick={() =>
                navigate(`/courses/${courseId}/${nextLesson.id}`)
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* Sidebar Lesson List */}
      <div className="hidden xl:block w-72 bg-card rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Course Content</h3>
        </div>
        <LessonList
          modules={course.modules}
          courseId={course.id}
          activeLessonId={lessonId}
          completedLessons={progress?.completedLessons ?? []}
        />
      </div>
    </div>
  )
}
