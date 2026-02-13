const STORAGE_KEY = "study-log"

export interface StudyAction {
  type: "lesson_complete" | "video_progress" | "note_saved" | "course_started"
  courseId: string
  lessonId?: string
  timestamp: string
  metadata?: Record<string, unknown>
}

function getLog(): StudyAction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLog(log: StudyAction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(log))
}

export function logStudyAction(action: StudyAction) {
  const log = getLog()
  log.push(action)
  // Keep last 1000 entries to prevent localStorage bloat
  if (log.length > 1000) {
    log.splice(0, log.length - 1000)
  }
  saveLog(log)
}

export function getStudyLog(): StudyAction[] {
  return getLog().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function getStudyLogForCourse(courseId: string): StudyAction[] {
  return getStudyLog().filter((a) => a.courseId === courseId)
}

export function getActionsPerDay(days = 30): { date: string; count: number }[] {
  const log = getLog()
  const now = new Date()
  const counts: Record<string, number> = {}

  for (let i = 0; i < days; i++) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    counts[d.toISOString().split("T")[0]] = 0
  }

  for (const action of log) {
    const date = action.timestamp.split("T")[0]
    if (date in counts) {
      counts[date]++
    }
  }

  return Object.entries(counts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function getRecentActions(limit = 20): StudyAction[] {
  return getStudyLog().slice(0, limit)
}
