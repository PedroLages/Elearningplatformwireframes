import { Card } from "../components/ui/card";
import { TrendingUp, TrendingDown, BookOpen, Award, Clock, Target } from "lucide-react";

const stats = [
  {
    label: "Total Learning Hours",
    value: "247h",
    change: "+12%",
    trend: "up",
    icon: Clock,
  },
  {
    label: "Completed Courses",
    value: "97",
    change: "+8%",
    trend: "up",
    icon: BookOpen,
  },
  {
    label: "Certificates Earned",
    value: "62",
    change: "+15%",
    trend: "up",
    icon: Award,
  },
  {
    label: "Average Score",
    value: "87%",
    change: "-2%",
    trend: "down",
    icon: Target,
  },
];

const recentActivity = [
  {
    id: 1,
    course: "UX Design Certificate",
    action: "Completed Lesson 18",
    date: "Today at 2:30 PM",
    score: "92%",
  },
  {
    id: 2,
    course: "SEO Experts from Zero",
    action: "Quiz Completed",
    date: "Yesterday at 4:15 PM",
    score: "88%",
  },
  {
    id: 3,
    course: "Project Management",
    action: "Assignment Submitted",
    date: "Feb 10, 2026",
    score: "95%",
  },
];

export function Reports() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Learning Reports</h1>
        <p className="text-gray-600">Track your progress and performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
          
          return (
            <Card key={stat.label} className="bg-white rounded-3xl border-0 shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  stat.trend === "up" ? "bg-green-50" : "bg-red-50"
                }`}>
                  <Icon className={`w-6 h-6 ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  <TrendIcon className="w-4 h-4" />
                  {stat.change}
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="bg-white rounded-3xl border-0 shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{activity.course}</h3>
                <p className="text-sm text-gray-600">{activity.action}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{activity.score}</div>
                <div className="text-xs text-gray-500">Score</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Performance Chart Placeholder */}
      <Card className="bg-white rounded-3xl border-0 shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Learning Progress</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl text-gray-400">
          Performance chart visualization would go here
        </div>
      </Card>
    </div>
  );
}
