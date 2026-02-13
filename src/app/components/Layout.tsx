import { Outlet, Link, useLocation } from "react-router";
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  MessageSquare, 
  Users, 
  BarChart3, 
  Settings as SettingsIcon,
  Search,
  Bell,
  ChevronDown
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const navigation = [
  { name: "Overview", path: "/", icon: LayoutDashboard },
  { name: "My Class", path: "/my-class", icon: BookOpen },
  { name: "Courses", path: "/courses", icon: GraduationCap },
  { name: "Messages", path: "/messages", icon: MessageSquare },
  { name: "Instructors", path: "/instructors", icon: Users },
  { name: "Reports", path: "/reports", icon: BarChart3 },
  { name: "Settings", path: "/settings", icon: SettingsIcon },
];

export function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#FAF5EE]">
      {/* Sidebar */}
      <aside className="w-[220px] bg-white rounded-[24px] m-6 p-6 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl">Eduvi</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Premium Card */}
        <div className="mt-auto bg-blue-50 rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-1">Go premium</h3>
          <p className="text-xs text-gray-600 mb-3">
            Explore 500+ courses with lifetime membership
          </p>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-xs h-9">
            Get Access
          </Button>
          <div className="mt-3 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&h=150&fit=crop" 
              alt="Premium illustration"
              className="w-24 h-24 object-contain"
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white rounded-[24px] m-6 mb-0 p-4 px-6 flex items-center justify-between">
          {/* Search */}
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search"
              className="pl-10 bg-gray-50 border-0"
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            <button className="relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <Badge className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1.5 py-0 min-w-5 h-5 flex items-center justify-center">
                3
              </Badge>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l">
              <Avatar className="w-10 h-10">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
                <AvatarFallback>RF</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <div className="font-semibold text-sm">Robert Fox</div>
                <div className="text-xs text-gray-500">#10532</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
