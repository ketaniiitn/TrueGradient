import { MessageSquare } from "lucide-react";

export default function SuggestionCards({ className = "", onSuggestionClick }) {
  const suggestions = [
    { id: "1", text: "Explain quantum computing in simple terms" },
    { id: "2", text: "Write a Python function to sort a list" },
    { id: "3", text: "What are the benefits of meditation?" },
    { id: "4", text: "Help me plan a weekend trip to Paris" },
  ]

  const handleSuggestionClick = (suggestion) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion)
    }
  }

  return (
  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-3xl w-full mx-auto ${className}`}>
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.id}
          onClick={() => handleSuggestionClick(suggestion.text)}
          className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all text-left group"
        >
          <MessageSquare size={18} className="text-black group-hover:text-blue-900 flex-shrink-0" />
          <span className="text-black group-hover:text-blue-900 text-sm font-semibold">{suggestion.text}</span>
        </button>
      ))}
    </div>
  )
}
