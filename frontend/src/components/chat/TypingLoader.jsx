import React from 'react';

// Simple animated three dots. Tailwind-based.
export default function TypingLoader({ className = '' }) {
  return (
    <div className={`inline-flex items-center gap-1 ${className}`} aria-label="Assistant is typing">
      {[0,1,2].map(i => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}
