import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search, Star, Clock, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const allCourses = [
  {
    id: 1,
    title: "Complete Python Bootcamp",
    category: "Programming",
    instructor: "Dr. Angela Yu",
    rating: 4.8,
    students: 1250,
    duration: "42 Hours",
    price: "$89.99",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Advanced JavaScript",
    category: "Programming",
    instructor: "Maximilian Schwarzmüller",
    rating: 4.9,
    students: 2100,
    duration: "52 Hours",
    price: "$94.99",
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Graphic Design Masterclass",
    category: "Design",
    instructor: "Lindsay Marsh",
    rating: 4.7,
    students: 890,
    duration: "35 Hours",
    price: "$79.99",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    title: "Data Science & Machine Learning",
    category: "Data Science",
    instructor: "Jose Portilla",
    rating: 4.9,
    students: 3200,
    duration: "65 Hours",
    price: "$99.99",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    title: "Digital Marketing 2024",
    category: "Marketing",
    instructor: "Phil Ebiner",
    rating: 4.6,
    students: 1580,
    duration: "28 Hours",
    price: "$69.99",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    title: "The Complete Web Developer",
    category: "Programming",
    instructor: "Rob Percival",
    rating: 4.8,
    students: 2850,
    duration: "48 Hours",
    price: "$89.99",
    image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=400&h=300&fit=crop",
  },
];

export function Courses() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">All Courses</h1>
        <p className="text-gray-600">Browse and enroll in courses</p>
      </div>

      <Card className="bg-white rounded-3xl border-0 shadow-sm p-6 mb-6">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for courses..."
              className="pl-10 bg-gray-50 border-0"
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">Search</Button>
        </div>
      </Card>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="programming">Programming</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCourses.map((course) => (
              <Card key={course.id} className="bg-white rounded-3xl border-0 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="text-xs text-blue-600 font-medium mb-2">
                    {course.category}
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">by {course.instructor}</p>
                  
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.students}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">{course.price}</span>
                    <Button className="bg-blue-600 hover:bg-blue-700">Enroll</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="programming">
          <div className="text-center py-12 text-gray-500">
            Programming courses filtered view
          </div>
        </TabsContent>

        <TabsContent value="design">
          <div className="text-center py-12 text-gray-500">
            Design courses filtered view
          </div>
        </TabsContent>

        <TabsContent value="marketing">
          <div className="text-center py-12 text-gray-500">
            Marketing courses filtered view
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
