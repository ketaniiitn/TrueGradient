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
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto ${className}`}>
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.id}
          onClick={() => handleSuggestionClick(suggestion.text)}
          className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all text-left group"
        >
          <MessageSquare size={18} className="text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
          <span className="text-gray-700 group-hover:text-gray-900 text-sm">{suggestion.text}</span>
        </button>
      ))}
    </div>
  )
}
