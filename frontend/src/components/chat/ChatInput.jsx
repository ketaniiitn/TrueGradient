import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { Send } from "lucide-react";

const ChatInput = forwardRef(function ChatInput({
  className = "",
  onSendMessage,
  placeholder = "Ask me anything...",
  maxLength = 2000,
  isTyping = false,
}, ref) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus()
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isTyping) return; 
    if (message.trim() && onSendMessage) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`border-t border-gray-200 bg-white ${className}`}>
      <div className="max-w-4xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={`w-full resize-none border rounded-2xl px-4 py-3 pr-14 
focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 
min-h-[50px] max-h-40 text-sm placeholder-gray-400 
+ shadow-[0_-4px_6px_rgba(0,0,0,0.1)]`}

              rows={1}
              maxLength={maxLength}
            />

            {/* Send button positioned at bottom-right inside the relative wrapper */}
            <button
              type="submit"
              disabled={!message.trim() || isTyping}
              aria-label="Send message"
              className={`absolute right-3 bottom-3 p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-full transition-colors shadow-sm ${isTyping ? 'border-2 border-red-500 !bg-red-500 animate-pulse' : ''}`}
            >
              <Send size={16} />
            </button>
          </div>

          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>
              {message.length}/{maxLength}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
});

export default ChatInput;
