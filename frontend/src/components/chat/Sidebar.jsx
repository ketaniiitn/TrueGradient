import { Plus, ChevronLeft, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Sidebar({ className = "", mobile = false, open = false, onClose }) {
  const [collapsed, setCollapsed] = useState(false);

  // Close on ESC when mobile drawer is open
  useEffect(() => {
    if (!mobile || !open) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [mobile, open, onClose]);

  const conversations = [
    {
      id: "1",
      title: "Explain quantum computing in simp...",
      preview: "That's an interesting point. Here's what I th...",
      timestamp: "Today",
    },
  ]

  const widthClass = collapsed ? 'w-19' : 'w-64';

  return (
    <aside
      className={`bg-white border-r-2 border-gray-200 flex flex-col transition-all duration-200 ${widthClass} ${className} 
      ${mobile ? `fixed inset-y-0 left-0 z-40 transform ${open ? 'translate-x-0' : '-translate-x-full'} shadow-lg md:relative md:translate-x-0` : ''}`}
      aria-label="Sidebar navigation"
      aria-hidden={mobile ? !open : false}
      role="navigation"
    >
      {/* Mobile close button overlay area */}
      {mobile && (
        <div className="absolute top-2 right-2 md:hidden">
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X size={18} />
          </button>
        </div>
      )}
      {/* Header */}
  <div className={`relative flex items-center p-3 border-b border-gray-200 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        <h2 className={`text-lg font-semibold text-gray-900 transition-opacity ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
          Conversations
        </h2>
        <button
          onClick={() => setCollapsed((s) => !s)}
          className={`p-1 hover:bg-gray-100 rounded ${collapsed ? 'absolute left-1/2 -translate-x-1/2 z-20 bg-white shadow-sm' : ''}`}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft size={20} className={`text-gray-600 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* New Chat Button */}
      <div className={`p-3 ${collapsed ? 'flex items-center justify-center' : ''}`}>
        <button
          className={`${
            collapsed ? 'p-2 rounded-xl' : 'w-full py-2 px-4 rounded-xl'
          } bg-blue-500 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2 transition-colors`}
          title="New Chat"
        >
          <Plus size={18} />
          {!collapsed && <span>New Chat</span>}
        </button>
      </div>

  {/* Conversations List - scrollable if overflow */}
  <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`p-3 hover:bg-blue-50/40 cursor-pointer border-b border-gray-100 flex items-start gap-3 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            {/* avatar / avatar letter when collapsed */}
            <div className={`w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-700 flex-shrink-0`}>
              {conversation.title.charAt(0)}
            </div>

            {!collapsed && (
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-sm mb-1">{conversation.title}</h3>
                <p className="text-xs text-gray-600 mb-2">{conversation.preview}</p>
                <span className="text-xs text-gray-500">{conversation.timestamp}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}
