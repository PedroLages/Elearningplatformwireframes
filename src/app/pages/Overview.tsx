import { Link } from "react-router"
import { BookOpen, FileText, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Progress } from "@/app/components/ui/progress"
import { allCourses } from "@/data/courses"
import {
  getCoursesInProgress,
  getCompletedCourses,
  getTotalCompletedLessons,
  getTotalStudyNotes,
} from "@/lib/progress"

function formatCategory(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function Overview() {
  const inProgress = getCoursesInProgress(allCourses)
  const completed = getCompletedCourses(allCourses)
  const completedLessons = getTotalCompletedLessons()
  const studyNotes = getTotalStudyNotes()

  const statsCards = [
    {
      label: "Courses Started",
      value: inProgress.length + completed.length,
      icon: BookOpen,
    },
    {
      label: "Lessons Completed",
      value: completedLessons,
      icon: CheckCircle,
    },
    {
      label: "Study Notes",
      value: studyNotes,
      icon: FileText,
    },
    {
      label: "Courses Completed",
      value: completed.length,
      icon: CheckCircle,
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Overview</h1>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Continue Studying */}
      {inProgress.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Continue Studying</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inProgress.map((course) => (
              <Link key={course.id} to={`/courses/${course.id}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    {course.coverImage ? (
                      <img
                        src={course.coverImage}
                        alt={course.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-blue-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatCategory(course.category)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Progress value={course.completionPercent} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{course.completionPercent}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Courses */}
      <section>
        <h2 className="text-lg font-semibold mb-4">All Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {allCourses.map((course) => (
            <Link key={course.id} to={`/courses/${course.id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  {course.coverImage ? (
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-32 object-cover rounded-t-xl"
                    />
                  ) : (
                    <div className="w-full h-32 bg-blue-100 dark:bg-blue-900/30 rounded-t-xl flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-blue-600" />
                    </div>
                  )}
                  <div className="p-4">
                    <span className="text-xs text-blue-600 font-medium">
                      {formatCategory(course.category)}
                    </span>
                    <h3 className="font-medium mt-1 text-sm truncate">{course.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {course.modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
