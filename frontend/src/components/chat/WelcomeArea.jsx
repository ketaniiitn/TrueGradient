import { Sparkles } from "lucide-react";

export default function WelcomeArea({ className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center px-8 ${className}`}>
      {/* AI Icon */}
      <div className="mb-8">
        <div className=" flex items-center justify-center">
          <Sparkles size={70} className="text-blue-500" />
        </div>
      </div>

      {/* Welcome Text */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to AI Chat</h1>
      <p className="text-gray-600 text-base max-w-2xl leading-relaxed">
        Start a conversation with our AI assistant. Ask questions, get help with tasks, or explore ideas together.
      </p>
    </div>
  )
}
