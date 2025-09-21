import { useEffect, useRef } from 'react';
import { User, Bot, Copy, ThumbsUp, ThumbsDown, MoreHorizontal } from 'lucide-react';
import TypingLoader from './TypingLoader';

export default function MessageListModern({ messages = [], className = '' }) {
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={`w-full max-w-4xl mx-auto flex flex-col gap-8 px-4 ${className}`}>
      {messages.map(m => (
<div
  key={m.id}
  className={`flex flex-col gap-2 group ${
    m.role === 'user' ? 'p-5' : 'bg-blue-50 border rounded-xl p-5 border-blue-100'
  }`}
>

          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
                m.role === 'user' ? 'bg-gray-300 text-black' : 'bg-blue-500 text-white'
              }`}
            >
              {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium mb-1 text-gray-500">
                {m.role === 'user' ? 'You' : 'AI Assistant'}{' '}
                <span className="ml-1 text-gray-400">
                  {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
              <div
                className={`rounded-xl px-4 py-3 text-sm leading-relaxed shadow-sm border ${
                  m.role === 'user'
                    ? 'bg-white border-gray-200'
                    : 'bg-white border border-gray-200'
                } whitespace-pre-wrap break-words min-h-[40px] flex items-center`}
              >
                {m.__typing ? <TypingLoader /> : m.content}
              </div>

              {m.role !== 'user' && (
                <div className="pl-2 mt-5 flex items-center gap-3 text-[13px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex items-center gap-1 hover:text-gray-700 transition-colors" title="Copy">
                    <Copy size={16} />
                  </button>
                  <button className="flex items-center gap-1 hover:text-green-600 transition-colors" title="Good">
                    <ThumbsUp size={16} />
                  </button>
                  <button className="flex items-center gap-1 hover:text-rose-600 transition-colors" title="Bad">
                    <ThumbsDown size={16} />
                  </button>
                  <button className="flex items-center gap-1 hover:text-gray-700 transition-colors" title="More">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
