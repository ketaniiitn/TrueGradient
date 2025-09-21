import React from 'react';

export default function GlobalLoader({ show }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" aria-label="Loading" />
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    </div>
  );
}
