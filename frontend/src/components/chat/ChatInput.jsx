import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatInput({
  className = "",
  onSendMessage,
  placeholder = "Ask me anything...",
  maxLength = 2000,
}) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && onSendMessage) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className={`border-t border-gray-200 bg-white ${className}`}>
      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full resize-none border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[52px] max-h-32"
                rows={1}
                maxLength={maxLength}
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="absolute right-3 bottom-3 p-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>
              {message.length}/{maxLength}
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}
