import { Plus, ChevronLeft, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Sidebar({
  className = "",
  mobile = false,
  open = false,
  onClose,
  conversations = [],
  activeId = null,
  onSelect,
  onNewChat,
}) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!mobile || !open) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [mobile, open, onClose]);

  const widthClass = collapsed ? 'w-19' : 'w-64';

  return (
    <aside
      className={`bg-white border-r-2 border-gray-200 flex flex-col transition-all duration-200 ${widthClass} ${className} 
      ${mobile ? `fixed inset-y-0 left-0 z-40 transform ${open ? 'translate-x-0' : '-translate-x-full'} shadow-lg md:relative md:translate-x-0` : ''}`}
      aria-label="Sidebar navigation"
      aria-hidden={mobile ? !open : false}
      role="navigation"
    >

      {/* Header */}
  <div className={`relative flex items-center p-3  border-gray-200 ${collapsed ? 'justify-center' : 'justify-between'}`}>
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
      <div className={` ${collapsed ? 'flex border-b p-3 items-center justify-center' : 'p-5 border-b'}`}>
        <button
          onClick={() => { onNewChat?.(); if (mobile) onClose?.(); }}
          className={`${
            collapsed ? 'p-2 rounded-xl' : 'w-full py-2 px-4 rounded-2xl'
          } bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
          title="New Chat"
        >
          <Plus size={18} />
          {!collapsed && <span>New Chat</span>}
        </button>
      </div>

  {/* Conversations List - scrollable if overflow */}
  <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 && (
          <div className="text-xs text-gray-500 px-4 py-6 text-center select-none">
            No conversations yet.
          </div>
        )}
        {conversations.map((c) => {
          const isActive = c.id === activeId;
          return (
            <button
              key={c.id}
              onClick={() => { onSelect?.(c.id); if (mobile) onClose?.(); }}
              className={`w-full text-left p-3 border-b border-gray-100 flex items-start gap-3 transition-colors ${
                collapsed ? 'justify-center' : ''
              } ${isActive ? 'bg-blue-50/70' : 'hover:bg-blue-50/40'} ${isActive ? 'relative' : ''}`}
              aria-current={isActive ? 'true' : 'false'}
            >
              <div className={`w-8 h-8 rounded-md flex items-center justify-center text-sm flex-shrink-0 ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                {c.title?.charAt(0) || '?'}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-xs mb-1 truncate">{c.title || 'Untitled'}</h3>
                  {c.latestMessage && <p className="text-[11px] text-gray-600 line-clamp-2 leading-snug">{c.latestMessage}</p>}
                  {c.updatedAt && <span className="mt-1 block text-[10px] text-gray-400">{formatTimestamp(c.updatedAt)}</span>}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  )
}

function formatTimestamp(ts) {
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}
