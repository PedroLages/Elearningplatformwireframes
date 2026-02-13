import { useState, useEffect, useCallback } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  BarChart3,
  Settings as SettingsIcon,
  Search,
  Bell,
  ChevronDown,
  Library,
  Sun,
  Moon,
  Info,
  Notebook,
} from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useTheme } from "next-themes";
import { allCourses } from "@/data/courses";
import { getTotalCompletedLessons, getCompletedCourses } from "@/lib/progress";
import { SearchCommandPalette } from "./figma/SearchCommandPalette";
import { KeyboardShortcutsDialog } from "./figma/KeyboardShortcutsDialog";

const navigation = [
  { name: "Overview", path: "/", icon: LayoutDashboard },
  { name: "My Progress", path: "/my-class", icon: BookOpen },
  { name: "Courses", path: "/courses", icon: GraduationCap },
  { name: "Library", path: "/library", icon: Library },
  { name: "Journal", path: "/messages", icon: Notebook },
  { name: "About", path: "/instructors", icon: Info },
  { name: "Reports", path: "/reports", icon: BarChart3 },
  { name: "Settings", path: "/settings", icon: SettingsIcon },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const [searchOpen, setSearchOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;

      // Cmd+K / Ctrl+K -> Open search
      if (isMod && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
        return;
      }

      // Cmd+, / Ctrl+, -> Navigate to Settings
      if (isMod && e.key === ",") {
        e.preventDefault();
        navigate("/settings");
        return;
      }

      // ? -> Show keyboard shortcuts (only when not in an input/textarea/contenteditable)
      if (e.key === "?" && !isMod) {
        const target = e.target as HTMLElement;
        const tagName = target.tagName.toLowerCase();
        const isEditable =
          tagName === "input" ||
          tagName === "textarea" ||
          target.isContentEditable;
        if (!isEditable) {
          e.preventDefault();
          setShortcutsOpen(true);
        }
      }
    },
    [navigate],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex h-screen bg-background">
      {/* Skip to content link for keyboard/screen-reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white focus:outline-none"
      >
        Skip to content
      </a>

      {/* Sidebar */}
      <aside
        className="w-[220px] bg-card rounded-[24px] m-6 p-6 flex flex-col"
        aria-label="Sidebar"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div
            className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
            aria-hidden="true"
          >
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl">Eduvi</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1" aria-label="Main navigation">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Progress Widget */}
        <div
          className="mt-auto bg-muted rounded-xl p-4 text-center"
          role="status"
          aria-label="Course progress summary"
        >
          <p className="text-sm font-semibold">
            {getCompletedCourses(allCourses).length}/{allCourses.length} courses
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {getTotalCompletedLessons()} lessons completed
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header
          className="bg-card rounded-[24px] m-6 mb-0 p-4 px-6 flex items-center justify-between"
          role="banner"
        >
          {/* Search trigger */}
          <div className="relative w-96" role="search" aria-label="Site search">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center w-full pl-10 pr-4 py-2 bg-muted rounded-md text-sm text-muted-foreground hover:bg-accent transition-colors text-left cursor-pointer"
              aria-label="Open search (Cmd+K)"
              aria-keyshortcuts="Meta+K Control+K"
            >
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                aria-hidden="true"
              />
              <span>Search...</span>
              <kbd className="ml-auto hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground">
                <span className="text-xs">&#8984;</span>K
              </kbd>
            </button>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-accent"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              <Sun
                className="w-5 h-5 text-muted-foreground dark:hidden"
                aria-hidden="true"
              />
              <Moon
                className="w-5 h-5 text-muted-foreground hidden dark:block"
                aria-hidden="true"
              />
            </button>

            <button
              className="relative p-2 rounded-lg hover:bg-accent"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
            </button>

            <div
              className="flex items-center gap-3 pl-4 border-l border-border"
              role="group"
              aria-label="User profile"
            >
              <Avatar className="w-10 h-10">
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <div className="font-semibold text-sm">Student</div>
              </div>
              <ChevronDown
                className="w-4 h-4 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main id="main-content" className="flex-1 overflow-auto p-6 pt-6">
          <Outlet />
        </main>
      </div>

      {/* Search Command Palette */}
      <SearchCommandPalette open={searchOpen} onOpenChange={setSearchOpen} />

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog
        open={shortcutsOpen}
        onOpenChange={setShortcutsOpen}
      />
    </div>
  );
}
