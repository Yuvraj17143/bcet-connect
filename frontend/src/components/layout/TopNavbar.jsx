import { useAuth } from "@/context/AuthContext";
import {
  Bell,
  Search,
  Menu,
  X,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  ChevronDown,
  Sparkles,
  MessageCircle,
  Calendar,
  Briefcase,
  HeartHandshake,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function TopNavbar({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [searchFocused, setSearchFocused] = useState(false);

  // Example notifications (replace with API)
  const notifications = [
    {
      id: 1,
      type: "job",
      title: "New job posted",
      text: "TCS – Senior Developer Role",
      time: "2m ago",
      unread: true,
    },
    {
      id: 2,
      type: "community",
      title: "New Comment",
      text: "Riya replied on your post",
      time: "1h ago",
      unread: true,
    },
    {
      id: 3,
      type: "event",
      title: "Event Reminder",
      text: "Alumni Meet 2024",
      time: "3h ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Notification Icon Mapping
  const getIcon = (type) => {
    switch (type) {
      case "job":
        return <Briefcase className="text-blue-600" size={18} />;
      case "event":
        return <Calendar className="text-purple-600" size={18} />;
      case "community":
        return <MessageCircle className="text-green-600" size={18} />;
      case "mentorship":
        return <HeartHandshake className="text-orange-600" size={18} />;
      default:
        return <Bell size={18} />;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border-b border-gray-200 dark:border-gray-800 shadow-md">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 gap-4">

        {/* ==== LEFT SECTION ==== */}
        <div className="flex items-center gap-4 flex-1 min-w-0">

          {/* Mobile Side Menu */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
          >
            <Menu size={20} className="text-gray-700 dark:text-gray-300" />
          </button>

          {/* Brand */}
          <div className="hidden md:flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-md animate-pulse-slow">
              <Sparkles className="text-white" size={16} />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              BCET Connect
            </h1>
          </div>

          {/* Search */}
          <div className="hidden md:flex w-full max-w-md">
            <div
              className={`relative w-full transition-all ${
                searchFocused ? "scale-[1.02]" : ""
              }`}
            >
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search jobs, alumni, communities…"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                text-sm dark:text-white focus:ring-2 focus:ring-primary/40 outline-none transition-all"
              />
            </div>
          </div>

        </div>

        {/* ==== RIGHT SECTION ==== */}
        <div className="flex items-center gap-2 md:gap-3">

          {/* AI Assistant */}
          <Button
            onClick={() => navigate("/ai")}
            className="hidden md:flex items-center gap-2 bg-gradient-to-br from-purple-600 to-indigo-600 
            hover:scale-[1.05] active:scale-[0.97] transition-transform text-white rounded-full px-4 py-2 shadow-lg"
          >
            <Sparkles size={16} />
            <span className="text-sm">Ask AI</span>
          </Button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
          >
            {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
            >
              <Bell size={20} className="text-gray-700 dark:text-gray-300" />

              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-semibold shadow-md animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />

                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50 animate-slide-down">
                  
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-between">
                    <h3 className="font-semibold">Notifications</h3>
                    <X size={16} className="cursor-pointer" onClick={() => setShowNotifications(false)} />
                  </div>

                  {/* List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`flex gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all
                          ${n.unread ? "bg-blue-50/40 dark:bg-blue-900/20" : ""}
                        `}
                      >
                        <div className="mt-1">{getIcon(n.type)}</div>

                        <div className="flex-1">
                          <p className="text-sm font-semibold">{n.title}</p>
                          <p className="text-xs text-gray-500">{n.text}</p>
                          <span className="text-[10px] text-gray-400">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40">
                    <button className="text-sm text-primary hover:underline">
                      View all →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold shadow-md ring-2 ring-primary/20">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>

              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>

              <ChevronDown
                size={16}
                className={`hidden lg:block transition-transform ${showProfileMenu ? "rotate-180" : ""}`}
              />
            </button>

            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />

                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden animate-slide-down z-50">

                  {/* User Info */}
                  <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-primary/10 to-secondary/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold shadow-md">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1">
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <User size={16} />
                      My Profile
                    </button>

                    <button className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                      <Settings size={16} />
                      Settings
                    </button>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition font-medium border-t border-gray-200 dark:border-gray-700"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search…"
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full focus:ring-2 focus:ring-primary/40 outline-none"
          />
        </div>
      </div>
    </header>
  );
}
