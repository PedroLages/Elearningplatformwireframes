import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Clock, Users, Video } from "lucide-react";

const classes = [
  {
    id: 1,
    title: "Advanced Web Development",
    instructor: "Sarah Johnson",
    time: "10:00 AM - 12:00 PM",
    day: "Monday, Wednesday, Friday",
    students: 24,
    status: "ongoing",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Digital Marketing Fundamentals",
    instructor: "Mike Chen",
    time: "2:00 PM - 4:00 PM",
    day: "Tuesday, Thursday",
    students: 32,
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    title: "UI/UX Design Bootcamp",
    instructor: "Emily Davis",
    time: "9:00 AM - 11:00 AM",
    day: "Monday, Thursday",
    students: 18,
    status: "ongoing",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
  },
];

export function MyClass() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Classes</h1>
        <p className="text-gray-600">Manage and join your enrolled classes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <Card key={cls.id} className="bg-white rounded-3xl border-0 shadow-sm overflow-hidden">
            <img 
              src={cls.image} 
              alt={cls.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                cls.status === 'ongoing' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {cls.status === 'ongoing' ? 'Ongoing' : 'Upcoming'}
              </div>
              
              <h3 className="font-bold text-lg mb-2">{cls.title}</h3>
              <p className="text-sm text-gray-600 mb-4">by {cls.instructor}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{cls.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{cls.students} Students</span>
                </div>
              </div>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Video className="w-4 h-4 mr-2" />
                Join Class
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
