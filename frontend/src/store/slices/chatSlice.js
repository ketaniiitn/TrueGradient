import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import { apiService } from '../../services/api';

// Thunk to send a chat message to backend (placeholder endpoint)
export const sendChatMessage = createAsyncThunk(
  'chat/sendChatMessage',
  async (userMessage, { rejectWithValue }) => {
    try {
      const response = await apiService.chat.sendMessage(userMessage);
      return response; // { id, role:'assistant', content, tokens } expected shape
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to send message');
    }
  }
);

// Multi-conversation structure
// conversation: { id, title, messages: [{id, role, content}], updatedAt }
const initialState = {
  conversations: [],
  activeId: null,
  status: 'idle',
  error: null,
  tokensUsed: 0,
  isTyping: false,      // assistant typing indicator
  isLoading: false,     // global chat loading (reserved for future: fetching history, etc.)
  typingMessageId: null, // holds ID of temporary typing placeholder message
  coins: 1250, // initial coins
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    startConversation: {
      reducer(state, action) {
        const { id, title, messages } = action.payload;
        state.conversations.unshift({ id, title, messages, updatedAt: Date.now() });
        state.activeId = id;
        // Decrement coins for first message in new conversation
        if (state.coins > 0) {
          state.coins -= 1;
        }
      },
      prepare(initialPrompt) {
        const id = nanoid();
        const userMsg = { id: nanoid(), role: 'user', content: initialPrompt, createdAt: Date.now() };
        const title = initialPrompt.length > 30 ? initialPrompt.slice(0,27) + '...' : initialPrompt;
        return { payload: { id, title, messages: [userMsg] } };
      }
    },
    sendUserMessage: {
      reducer(state, action) {
        const { content } = action.payload;
        const conv = state.conversations.find(c => c.id === state.activeId);
        if (!conv) return;
        const userMsg = { id: nanoid(), role: 'user', content, createdAt: Date.now() };
        conv.messages.push(userMsg);
        // Decrement coins for each user message
        if (state.coins > 0) {
          state.coins -= 1;
        }
        conv.updatedAt = Date.now();
        if (!conv.title) conv.title = content.length > 30 ? content.slice(0,27) + '...' : content;
        // reorder conversations (active to top)
        state.conversations = [conv, ...state.conversations.filter(c => c.id !== conv.id)];
      },
      prepare(content) {
        return { payload: { content } };
      }
    },
    setActiveConversation(state, action) {
      state.activeId = action.payload;
    },
    newBlank(state) {
      state.activeId = null;
    },
    hydrateConversations(state, action) {
      // Replace entire conversations state from persisted storage
      const { conversations = [], activeId = null } = action.payload || {};
      state.conversations = conversations;
      state.activeId = activeId;
    },
    setTokensUsed(state, action) {
      state.tokensUsed = action.payload;
    },
    clearAll(state) {
      state.conversations = [];
      state.activeId = null;
      state.tokensUsed = 0;
      state.error = null;
      state.isTyping = false;
      state.typingMessageId = null;
      state.coins = 1250;
    }
    ,startAssistantTyping(state) {
      if (!state.activeId) return;
      const conv = state.conversations.find(c => c.id === state.activeId);
      if (!conv) return;
      // Avoid duplicating typing placeholder
      if (state.isTyping) return;
      const tempId = nanoid();
      conv.messages.push({ id: tempId, role: 'assistant', content: '...', __typing: true, createdAt: Date.now() });
      state.isTyping = true;
      state.typingMessageId = tempId;
    }
    ,finishAssistantTyping(state, action) {
      const { finalContent } = action.payload || {};
      if (!state.activeId) return;
      const conv = state.conversations.find(c => c.id === state.activeId);
      if (!conv) return;
      if (state.typingMessageId) {
        const idx = conv.messages.findIndex(m => m.id === state.typingMessageId);
        if (idx !== -1) {
          // Replace placeholder with final content
            conv.messages[idx] = { id: state.typingMessageId, role: 'assistant', content: finalContent || '', createdAt: Date.now() };
        }
      } else if (finalContent) {
        conv.messages.push({ id: nanoid(), role: 'assistant', content: finalContent, createdAt: Date.now() });
      }
      state.isTyping = false;
      state.typingMessageId = null;
    }
    ,setChatLoading(state, action) {
      state.isLoading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.status = 'sending';
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.status = 'idle';
        const { content, tokens = 0 } = action.payload || {};
        if (content && state.activeId) {
          const conv = state.conversations.find(c => c.id === state.activeId);
          if (conv) {
            conv.messages.push({ id: nanoid(), role: 'assistant', content });
            conv.updatedAt = Date.now();
          }
        }
        state.tokensUsed += tokens;
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload || 'Failed to send message';
      });
  }
});

export const { startConversation, sendUserMessage, setActiveConversation, newBlank, hydrateConversations, setTokensUsed, clearAll } = chatSlice.actions;
export const { startAssistantTyping, finishAssistantTyping, setChatLoading } = chatSlice.actions;

// Selectors
export const selectChat = (state) => state.chat;
export const selectConversations = (state) => state.chat.conversations;
export const selectActiveConversationId = (state) => state.chat.activeId;
export const selectActiveConversation = (state) => state.chat.conversations.find(c => c.id === state.chat.activeId) || null;
export const selectChatStatus = (state) => state.chat.status;
export const selectChatError = (state) => state.chat.error;
export const selectChatTokens = (state) => state.chat.tokensUsed;
export const selectChatTyping = (state) => state.chat.isTyping;
export const selectChatLoading = (state) => state.chat.isLoading;
export const selectChatCoins = (state) => state.chat.coins;

// Simple mock reply function (kept inside slice for prepare callbacks)
function mockBotReply(userContent) {
  if (!userContent) return 'Hello! How can I assist you?';
  return `You said: "${userContent.slice(0,80)}". Here's a mock response from the AI.`;
}

export default chatSlice.reducer;
