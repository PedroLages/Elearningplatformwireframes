import { Link } from "react-router"
import { Clock, CheckCircle, PlayCircle } from "lucide-react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Progress } from "@/app/components/ui/progress"
import { Badge } from "@/app/components/ui/badge"
import { allCourses } from "@/data/courses"
import {
  getCoursesInProgress,
  getCompletedCourses,
  getNotStartedCourses,
  getCourseCompletionPercent,
} from "@/lib/progress"

export default function MyClass() {
  const inProgress = getCoursesInProgress(allCourses)
  const completed = getCompletedCourses(allCourses)
  const notStarted = getNotStartedCourses(allCourses)

  const hasAnyCourses =
    inProgress.length > 0 || completed.length > 0 || notStarted.length > 0

  if (!hasAnyCourses) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">My Progress</h1>
        <div className="text-center py-12 text-muted-foreground">
          <p>No courses available. Check back later!</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Progress</h1>

      {inProgress.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            In Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgress.map((course) => (
              <Link key={course.id} to={`/courses/${course.id}`}>
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-0">
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-36 object-cover rounded-t-xl"
                    />
                    <div className="p-4">
                      <Badge variant="secondary" className="mb-2">
                        {course.category}
                      </Badge>
                      <h3 className="font-medium">{course.title}</h3>
                      <div className="flex items-center gap-2 mt-3">
                        <Progress
                          value={course.completionPercent}
                          className="h-2 flex-1"
                        />
                        <span className="text-sm font-medium">
                          {course.completionPercent}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Last studied{" "}
                        {new Date(
                          course.progress.lastAccessedAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Completed
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completed.map((course) => (
              <Link key={course.id} to={`/courses/${course.id}`}>
                <Card className="hover:shadow-md transition-shadow h-full border-green-200 dark:border-green-800">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={course.coverImage}
                        alt={course.title}
                        className="w-full h-36 object-cover rounded-t-xl"
                      />
                      <div className="absolute top-2 right-2 bg-green-600 text-white rounded-full p-1">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="p-4">
                      <Badge variant="secondary" className="mb-2">
                        {course.category}
                      </Badge>
                      <h3 className="font-medium">{course.title}</h3>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-2 font-medium">
                        Completed
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {notStarted.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-muted-foreground" />
            Not Started
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notStarted.map((course) => (
              <Link key={course.id} to={`/courses/${course.id}`}>
                <Card className="hover:shadow-md transition-shadow h-full opacity-80 hover:opacity-100">
                  <CardContent className="p-0">
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-36 object-cover rounded-t-xl"
                    />
                    <div className="p-4">
                      <Badge variant="secondary" className="mb-2">
                        {course.category}
                      </Badge>
                      <h3 className="font-medium">{course.title}</h3>
                      <p className="text-xs text-muted-foreground mt-2">
                        {course.modules.reduce(
                          (sum, m) => sum + m.lessons.length,
                          0
                        )}{" "}
                        lessons
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
