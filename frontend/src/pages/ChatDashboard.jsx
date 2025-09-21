"use client"

import { useState } from "react"
import Header from "../components/chat/Header";
import Sidebar from "../components/chat/Sidebar";
import WelcomeArea from "../components/chat/WelcomeArea";
import SuggestionCards from "../components/chat/SuggestionCards";
import ChatInput from "../components/chat/ChatInput";

export default function ChatDashboard() {
  const [messages, setMessages] = useState([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSendMessage = (message) => {
    setMessages((prev) => [...prev, message])
    // Here you would typically send the message to your AI service
    console.log("Sending message:", message)
  }

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion)
  }

  return (
  <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header
        onMobileMenuToggle={() => setMobileMenuOpen(o => !o)}
        mobileMenuOpen={mobileMenuOpen}
      />

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar desktop & mobile */}
        <Sidebar
          className="hidden md:flex"
        />
        <Sidebar
          mobile
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          className="md:hidden"
        />

        {/* Chat Area */}
        <main className="flex-1 flex flex-col">
          {/* Welcome Content / Messages placeholder */}
          <div className="flex-1 flex flex-col py-6 px-4 sm:px-6 overflow-y-auto">
            <div className="flex-1 flex flex-col items-center justify-center mb-8">
              <WelcomeArea />
            </div>
            <SuggestionCards className="pb-6" onSuggestionClick={handleSuggestionClick} />
          </div>

          {/* Chat Input */}
            <ChatInput onSendMessage={handleSendMessage} />
        </main>
      </div>
    </div>
  )
}
