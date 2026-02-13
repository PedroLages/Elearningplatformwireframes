import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Star, Users, BookOpen, Mail } from "lucide-react";

const instructors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    title: "Web Development Expert",
    rating: 4.9,
    students: 2450,
    courses: 12,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    specialties: ["JavaScript", "React", "Node.js"],
  },
  {
    id: 2,
    name: "Mike Chen",
    title: "Digital Marketing Strategist",
    rating: 4.8,
    students: 1890,
    courses: 8,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    specialties: ["SEO", "Social Media", "Content Marketing"],
  },
  {
    id: 3,
    name: "Emily Davis",
    title: "UI/UX Design Lead",
    rating: 4.9,
    students: 3100,
    courses: 15,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    specialties: ["Figma", "Design Systems", "User Research"],
  },
  {
    id: 4,
    name: "Robert Fox",
    title: "Data Science Professor",
    rating: 4.7,
    students: 1650,
    courses: 10,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    specialties: ["Python", "Machine Learning", "Statistics"],
  },
  {
    id: 5,
    name: "Lisa Anderson",
    title: "Business Strategy Expert",
    rating: 4.8,
    students: 2200,
    courses: 9,
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop",
    specialties: ["Management", "Leadership", "Strategy"],
  },
  {
    id: 6,
    name: "David Martinez",
    title: "Mobile Development Specialist",
    rating: 4.9,
    students: 1980,
    courses: 11,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    specialties: ["iOS", "Android", "Flutter"],
  },
];

export function Instructors() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Our Instructors</h1>
        <p className="text-gray-600">Learn from industry experts and experienced educators</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructors.map((instructor) => (
          <Card key={instructor.id} className="bg-white rounded-3xl border-0 shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={instructor.avatar} />
                <AvatarFallback>{instructor.name[0]}</AvatarFallback>
              </Avatar>
              
              <h3 className="font-bold text-lg mb-1">{instructor.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{instructor.title}</p>
              
              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{instructor.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{instructor.students}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{instructor.courses}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {instructor.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-2 w-full">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  View Profile
                </Button>
                <Button variant="outline" size="icon">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
