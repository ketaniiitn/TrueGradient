import { Plus, ChevronLeft } from "lucide-react";
import { useState } from "react";

export default function Sidebar({ className = "" }) {
  const [collapsed, setCollapsed] = useState(false);

  const conversations = [
    {
      id: "1",
      title: "Explain quantum computing in simp...",
      preview: "That's an interesting point. Here's what I th...",
      timestamp: "Today",
    },
  ]

  return (
    <aside
      className={`bg-white border-r-2 border-gray-200 flex flex-col transition-all duration-200 ${className} ${
        collapsed ? 'w-19' : 'w-64'
      }`}
    >
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

      {/* Conversations List - allow wrapping and let outer page scroll instead of inner slider */}
      <div className="flex-1">
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
