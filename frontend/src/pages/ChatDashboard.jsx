"use client"

import { useRef, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectConversations, setActiveConversation } from '../store/slices/chatSlice';
import { simulateAssistantReply } from '../store/chatEffects';
import Header from "../components/chat/Header";
import Sidebar from "../components/chat/Sidebar";
import WelcomeArea from "../components/chat/WelcomeArea";
import SuggestionCards from "../components/chat/SuggestionCards";
import ChatInput from "../components/chat/ChatInput";

export default function ChatDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const conversations = useSelector(selectConversations);
  const inputRef = useRef(null);

  const goToChat = (initialPrompt) => {
    if (!initialPrompt) return;
    // Use simulateAssistantReply with isNewConversation true so typing placeholder appears
    dispatch(simulateAssistantReply(initialPrompt, { isNewConversation: true }));
    navigate('/chat');
  };

  const handleSendMessage = (message) => {
    if (!message.trim()) return;
    goToChat(message.trim());
  };

  const handleSuggestionClick = (suggestion) => {
    goToChat(suggestion);
  };

  return (
  <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
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
        {/* Dashboard no longer shows past conversations locally; using ChatSession for active chats */}
        <Sidebar
          conversations={conversations.map(c => ({ id: c.id, title: c.title, latestMessage: c.messages[c.messages.length-1]?.content, updatedAt: c.updatedAt }))}
          activeId={null}
          onSelect={(id) => { dispatch(setActiveConversation(id)); navigate('/chat'); }}
          onNewChat={() => { /* already blank dashboard */ }}
          className="hidden md:flex"
        />
        <Sidebar
          mobile
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          conversations={conversations.map(c => ({ id: c.id, title: c.title, latestMessage: c.messages[c.messages.length-1]?.content, updatedAt: c.updatedAt }))}
          activeId={null}
          onSelect={(id) => { dispatch(setActiveConversation(id)); setMobileMenuOpen(false); navigate('/chat'); }}
          onNewChat={() => {}}
          className="md:hidden"
        />

        {/* Chat Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col py-4 sm:py-6 px-2 sm:px-6 overflow-y-auto">
            <div className="flex-1 flex flex-col items-center justify-center mb-8">
              <WelcomeArea />
            </div>
            <SuggestionCards className="pb-6" onSuggestionClick={handleSuggestionClick} />
          </div>

          <div className="border-t border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <ChatInput onSendMessage={handleSendMessage} ref={inputRef} />
          </div>
        </main>
      </div>
    </div>
  )
}
