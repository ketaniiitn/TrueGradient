"use client"

import { useState } from "react"
import Header from "../components/chat/Header";
import Sidebar from "../components/chat/Sidebar";
import WelcomeArea from "../components/chat/WelcomeArea";
import SuggestionCards from "../components/chat/SuggestionCards";
import ChatInput from "../components/chat/ChatInput";

export default function ChatDashboard() {
  const [messages, setMessages] = useState([])

  const handleSendMessage = (message) => {
    setMessages((prev) => [...prev, message])
    // Here you would typically send the message to your AI service
    console.log("Sending message:", message)
  }

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Chat Area */}
        <main className="flex-1 flex flex-col">
          {/* Welcome Content */}
          <div className="flex-1 flex flex-col justify-center py-8">
            <WelcomeArea className="mb-12" />
            <SuggestionCards className="px-8" onSuggestionClick={handleSuggestionClick} />
          </div>

          {/* Chat Input */}
          <ChatInput onSendMessage={handleSendMessage} />
        </main>
      </div>
    </div>
  )
}
