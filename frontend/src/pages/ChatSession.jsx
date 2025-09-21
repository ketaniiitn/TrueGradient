import React, { useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectConversations, selectActiveConversation, selectActiveConversationId, selectChatTyping, newBlank, setActiveConversation } from '../store/slices/chatSlice';
import { simulateAssistantReply } from '../store/chatEffects';
import Header from '../components/chat/Header';
import Sidebar from '../components/chat/Sidebar';
import ChatInput from '../components/chat/ChatInput';
import MessageListModern from '../components/chat/MessageListModern';

// Dedicated chat session page separated from ChatDashboard.
export default function ChatSession() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const conversations = useSelector(selectConversations);
  const activeConversation = useSelector(selectActiveConversation);
  const activeId = useSelector(selectActiveConversationId);
  const isTyping = useSelector(selectChatTyping);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const inputRef = useRef(null);
  const handleSendMessage = (message) => {
    if (!message) return;
    dispatch(simulateAssistantReply(message, { isNewConversation: !activeConversation }));
  };
  const handleNewChat = () => { 
    dispatch(newBlank());
    navigate('/dashboard');
  };
  const handleSelectConversation = (id) => dispatch(setActiveConversation(id));

  // On first mount, if an initial prompt was passed, start a conversation.
  useEffect(() => {
    const initialPrompt = location.state?.initialPrompt;
    if (initialPrompt) {
      dispatch(startConversation(initialPrompt));
      navigate(location.pathname, { replace: true });
    } else if (!initialPrompt && conversations.length === 0) {
      navigate('/dashboard', { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Header onMobileMenuToggle={() => setMobileMenuOpen(o => !o)} mobileMenuOpen={mobileMenuOpen} />
      {mobileMenuOpen && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          conversations={conversations.map(c => ({ id: c.id, title: c.title, latestMessage: c.messages[c.messages.length-1]?.content, updatedAt: c.updatedAt }))}
          activeId={activeId}
          onSelect={handleSelectConversation}
          onNewChat={handleNewChat}
          className="hidden md:flex"
        />
        <Sidebar
          mobile
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          conversations={conversations.map(c => ({ id: c.id, title: c.title, latestMessage: c.messages[c.messages.length-1]?.content, updatedAt: c.updatedAt }))}
          activeId={activeId}
          onSelect={handleSelectConversation}
          onNewChat={handleNewChat}
          className="md:hidden"
        />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto py-4 sm:py-6 px-2 sm:px-6">
            {activeConversation ? (
              <MessageListModern messages={activeConversation.messages} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-500 select-none">Start typing to begin a new conversation...</div>
            )}
          </div>
          <div className="border-t border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <ChatInput onSendMessage={handleSendMessage} isTyping={isTyping} ref={inputRef} />
          </div>
        </main>
      </div>
    </div>
  );
}
// mockBotReply now lives in the chat slice for prepare callbacks
