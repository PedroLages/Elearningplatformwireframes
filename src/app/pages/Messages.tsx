import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Search, Send } from "lucide-react";

const conversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    lastMessage: "Thanks for your help with the assignment!",
    time: "2m ago",
    unread: 2,
  },
  {
    id: 2,
    name: "Mike Chen",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    lastMessage: "When is the next class?",
    time: "1h ago",
    unread: 0,
  },
  {
    id: 3,
    name: "Emily Davis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    lastMessage: "Great presentation today!",
    time: "3h ago",
    unread: 1,
  },
];

export function Messages() {
  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-gray-600">Chat with instructors and classmates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-120px)]">
        {/* Conversations List */}
        <Card className="bg-white rounded-3xl border-0 shadow-sm p-6 lg:col-span-1">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search messages..."
              className="pl-10 bg-gray-50 border-0"
            />
          </div>

          <div className="space-y-2">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={conv.avatar} />
                  <AvatarFallback>{conv.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm truncate">{conv.name}</h3>
                    <span className="text-xs text-gray-500">{conv.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <div className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {conv.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Chat Area */}
        <Card className="bg-white rounded-3xl border-0 shadow-sm p-6 lg:col-span-2 flex flex-col">
          <div className="flex items-center gap-3 pb-4 border-b mb-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">Sarah Johnson</h3>
              <p className="text-sm text-gray-500">Active now</p>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a conversation to start messaging
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-gray-50 border-0"
            />
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
