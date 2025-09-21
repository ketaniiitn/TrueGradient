import { Plus, ChevronLeft } from "lucide-react";

export default function Sidebar({ className = "" }) {
  const conversations = [
    {
      id: "1",
      title: "Explain quantum computing in simp...",
      preview: "That's an interesting point. Here's what I th...",
      timestamp: "Today",
    },
  ]

  return (
    <aside className={`w-80 bg-white border-r border-gray-200 flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
        <button className="p-1 hover:bg-gray-100 rounded">
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
          <Plus size={18} />
          New Chat
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <div key={conversation.id} className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
            <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">{conversation.title}</h3>
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{conversation.preview}</p>
            <span className="text-xs text-gray-500">{conversation.timestamp}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}
