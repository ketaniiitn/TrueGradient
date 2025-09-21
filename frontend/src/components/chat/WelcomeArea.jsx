import { Sparkles } from "lucide-react";

export default function WelcomeArea({ className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center px-8 ${className}`}>
      {/* AI Icon */}
      <div className="mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <Sparkles size={32} className="text-blue-600" />
        </div>
      </div>

      {/* Welcome Text */}
      <h1 className="text-3xl font-semibold text-gray-900 mb-4">Welcome to AI Chat</h1>
      <p className="text-gray-600 text-lg max-w-2xl leading-relaxed">
        Start a conversation with our AI assistant. Ask questions, get help with tasks, or explore ideas together.
      </p>
    </div>
  )
}
