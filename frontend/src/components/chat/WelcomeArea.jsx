import { Sparkles } from "lucide-react";

export default function WelcomeArea({ className = "" }) {
  return (
  <div className={`flex flex-col items-center justify-center text-center px-4 sm:px-8 ${className}`}>
      {/* AI Icon */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-center">
          <Sparkles className="text-blue-500 w-16 h-16 sm:w-20 sm:h-20" />
        </div>
      </div>

      {/* Welcome Text */}
  <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Welcome to AI Chat</h1>
  <p className="text-gray-600 text-sm sm:text-base max-w-2xl leading-relaxed">
        Start a conversation with our AI assistant. Ask questions, get help with tasks, or explore ideas together.
      </p>
    </div>
  )
}
