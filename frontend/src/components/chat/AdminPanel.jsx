import React, { forwardRef } from 'react';
import { User, Settings, LogOut } from 'lucide-react';

const AdminPanel = forwardRef(function AdminPanel({ onLogout }, ref) {
  return (
    <div ref={ref} className="absolute top-16 right-6 w-56 bg-white border border-gray-200 shadow-xl rounded-2xl py-2 z-30" role="menu">
      <div className="px-4 py-2 flex items-center gap-2 text-gray-700 text-sm font-medium">
        <User size={16} className="text-blue-600" />
        Admin
      </div>
      <div className="h-px bg-gray-100 my-1" />
      <button className="w-full text-left px-4 py-2 flex items-center gap-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50" role="menuitem">
        <Settings size={16} className="text-gray-500" />
        Settings
      </button>
      <button onClick={onLogout} className="w-full text-left px-4 py-2 flex items-center gap-2 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50" role="menuitem">
        <LogOut size={16} className="text-red-500" />
        Sign Out
      </button>
    </div>
  );
});

export default AdminPanel;
