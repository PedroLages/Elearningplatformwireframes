import { 
  Clock, 
  CheckCircle2, 
  Award, 
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Palette,
  Globe,
  Plus
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

// Mock data
const stats = [
  {
    label: "Course in Progress",
    value: "18",
    icon: Clock,
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    label: "Course Completed",
    value: "97",
    icon: CheckCircle2,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    label: "Certificates Earned",
    value: "62",
    icon: Award,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    label: "Community Support",
    value: "245",
    icon: MessageCircle,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
];

const currentCourses = [
  {
    id: 1,
    title: "UX Design Certificate",
    icon: "🎨",
    lessons: { completed: 18, total: 40 },
    duration: "24h 13m 28s",
    instructor: {
      name: "Sloan",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
  },
  {
    id: 2,
    title: "SEO Experts from Zero",
    icon: "📊",
    lessons: { completed: 21, total: 23 },
    duration: "10h 0m 0s",
    instructor: {
      name: "Mckinney",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
  },
  {
    id: 3,
    title: "Project Management",
    icon: "📁",
    lessons: { completed: 7, total: 35 },
    duration: "17h 59m 0s",
    instructor: {
      name: "Johnson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
  },
];

const recommendedCourses = [
  {
    id: 1,
    title: "Front-end Development",
    category: "HTML",
    lessons: 30,
    duration: "83 Hours",
    color: "bg-gradient-to-br from-green-200 to-green-300",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    title: "SEO Experts from Zero",
    category: "Search Digital",
    lessons: 25,
    duration: "18 Hours",
    color: "bg-gradient-to-br from-blue-200 to-blue-300",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Learn Creative Design",
    category: "UI Design",
    lessons: 35,
    duration: "95 Hours",
    color: "bg-gradient-to-br from-yellow-200 to-orange-200",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
  },
];

const upcomingTests = [
  {
    id: 1,
    title: "Basic Computer",
    subtitle: "Class Text 5",
    date: "16 May",
    icon: "💻",
    color: "bg-purple-100",
  },
  {
    id: 2,
    title: "UI/UX Design",
    subtitle: "Class Text 2",
    date: "22 May",
    icon: "🎨",
    color: "bg-pink-100",
  },
  {
    id: 3,
    title: "English Language",
    subtitle: "Class Text 1",
    date: "24 May",
    icon: "📚",
    color: "bg-blue-100",
  },
  {
    id: 4,
    title: "Time Management",
    subtitle: "Class Text 3",
    date: "28 May",
    icon: "⏰",
    color: "bg-orange-100",
  },
];

const communityGroups = [
  {
    id: 1,
    name: "Design Community, USA",
    members: "112K Members",
    icon: "🎨",
    color: "bg-teal-500",
  },
  {
    id: 2,
    name: "SEO Helpline 24/7",
    members: "78K Members",
    icon: "📈",
    color: "bg-purple-600",
  },
  {
    id: 3,
    name: "UI/UX Worldwide",
    members: "498K Members",
    icon: "🌐",
    color: "bg-blue-600",
  },
  {
    id: 4,
    name: "UI Hunter",
    members: "212K Members",
    icon: "🎯",
    color: "bg-indigo-600",
  },
];

export function Overview() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content - Left Side */}
      <div className="lg:col-span-2 space-y-6">
        {/* Stats Cards */}
        <Card className="bg-white p-6 rounded-3xl border-0 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`${stat.bgColor} ${stat.color} p-1.5 rounded-lg`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-gray-600">{stat.label}</span>
                  </div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Course You're Taking */}
        <Card className="bg-white p-6 rounded-3xl border-0 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Course You're Taking</h2>
          
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 text-sm text-gray-500 font-medium mb-4 px-2">
            <div className="col-span-4">Course Title</div>
            <div className="col-span-3">Lessons Completed</div>
            <div className="col-span-3">Duration</div>
            <div className="col-span-2">Instructor</div>
          </div>

          {/* Course Items */}
          <div className="space-y-4">
            {currentCourses.map((course) => {
              const percentage = Math.round((course.lessons.completed / course.lessons.total) * 100);
              
              return (
                <div key={course.id} className="grid grid-cols-12 gap-4 items-center bg-gray-50 rounded-xl p-4">
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-2xl">
                      {course.icon}
                    </div>
                    <span className="font-medium">{course.title}</span>
                  </div>
                  
                  <div className="col-span-3">
                    <div className="text-sm font-semibold mb-1">
                      {course.lessons.completed}/{course.lessons.total} ({percentage}%)
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                  
                  <div className="col-span-3">
                    <span className="text-sm text-gray-600">{course.duration}</span>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={course.instructor.avatar} />
                        <AvatarFallback>{course.instructor.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{course.instructor.name}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recommended Courses */}
        <Card className="bg-white p-6 rounded-3xl border-0 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recommended for you</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedCourses.map((course) => (
              <div key={course.id} className="rounded-2xl overflow-hidden border">
                <div className={`${course.color} h-32 flex items-center justify-center`}>
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-24 h-24 object-contain"
                  />
                </div>
                <div className="p-4 bg-white">
                  <div className="text-xs text-orange-500 font-medium mb-1">
                    {course.category}
                  </div>
                  <h3 className="font-semibold mb-2">{course.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span>{course.lessons} Lessons</span>
                    <span>|</span>
                    <span>{course.duration}</span>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Enroll Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-6">
        {/* Upcoming Tests */}
        <Card className="bg-white p-6 rounded-3xl border-0 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Upcoming Tests</h2>
          
          <div className="space-y-3 mb-4">
            {upcomingTests.map((test) => (
              <div key={test.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div className={`${test.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl`}>
                  {test.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{test.title}</h3>
                  <p className="text-xs text-gray-500">{test.subtitle}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-orange-500 font-medium">{test.date}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>

          <Button className="w-full bg-gray-900 hover:bg-gray-800 rounded-xl">
            See All Upcoming Tests
          </Button>
        </Card>

        {/* Community Groups */}
        <Card className="bg-white p-6 rounded-3xl border-0 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Community Groups</h2>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {communityGroups.map((group) => (
              <div key={group.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div className={`${group.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl`}>
                  {group.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{group.name}</h3>
                  <p className="text-xs text-gray-500">{group.members}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
