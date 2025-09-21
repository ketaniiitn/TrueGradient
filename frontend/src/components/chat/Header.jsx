import { Bell, Link, ChevronDown, User } from "lucide-react";

export default function Header({ className = "" }) {
  return (
    <header className={`flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 ${className}`}>
      {/* Left side - Logo */}
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-900">AI Chat</h1>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-4">
        {/* Link with count */}
        <div className="flex items-center gap-2 text-blue-600">
          <Link size={18} />
          <span className="text-sm font-medium">1,249</span>
        </div>

        {/* Notification bell */}
        <div className="relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            1
          </span>
        </div>

        {/* Admin dropdown */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <span className="text-sm font-medium text-gray-900">Admin</span>
          <ChevronDown size={16} className="text-gray-600" />
        </div>
      </div>
    </header>
  )
}
