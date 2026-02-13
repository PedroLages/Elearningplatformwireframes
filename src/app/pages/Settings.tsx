import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { User, Mail, Bell, Lock, Globe, CreditCard } from "lucide-react";

export function Settings() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <Card className="bg-white rounded-3xl border-0 shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5" />
            <h2 className="text-xl font-bold">Profile Information</h2>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop" />
              <AvatarFallback>RF</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" className="mb-2">Change Photo</Button>
              <p className="text-xs text-gray-500">JPG or PNG, max 2MB</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="Robert" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Fox" className="mt-2" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="robert.fox@example.com" className="mt-2" />
            </div>
            
            <div>
              <Label htmlFor="bio">Bio</Label>
              <textarea 
                id="bio"
                rows={4}
                className="w-full mt-2 px-3 py-2 border rounded-lg resize-none"
                placeholder="Tell us about yourself..."
                defaultValue="Passionate learner exploring web development and design."
              />
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
          </div>
        </Card>

        {/* Quick Settings */}
        <div className="space-y-6">
          {/* Notifications */}
          <Card className="bg-white rounded-3xl border-0 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5" />
              <h2 className="font-bold">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Email Notifications</p>
                  <p className="text-xs text-gray-500">Receive course updates</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Push Notifications</p>
                  <p className="text-xs text-gray-500">Get alerts on your device</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Weekly Report</p>
                  <p className="text-xs text-gray-500">Summary of your progress</p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          {/* Language */}
          <Card className="bg-white rounded-3xl border-0 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5" />
              <h2 className="font-bold">Language</h2>
            </div>
            
            <select className="w-full px-3 py-2 border rounded-lg">
              <option>English (US)</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </Card>

          {/* Security */}
          <Card className="bg-white rounded-3xl border-0 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5" />
              <h2 className="font-bold">Security</h2>
            </div>
            
            <Button variant="outline" className="w-full mb-2">
              Change Password
            </Button>
            <Button variant="outline" className="w-full">
              Two-Factor Authentication
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
