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

const initialState = {
  messages: [
    { id: nanoid(), role: 'system', content: 'Welcome to TrueGradient AI Chat. How can I help you today?' }
  ],
  status: 'idle', // idle | sending | error
  error: null,
  tokensUsed: 0,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addUserMessage: {
      reducer(state, action) {
        state.messages.push(action.payload);
      },
      prepare(content) {
        return { payload: { id: nanoid(), role: 'user', content } };
      }
    },
    addAssistantMessage: {
      reducer(state, action) {
        state.messages.push(action.payload);
      },
      prepare(content) {
        return { payload: { id: nanoid(), role: 'assistant', content } };
      }
    },
    clearChat(state) {
      state.messages = [state.messages[0]]; // keep system message
      state.tokensUsed = 0;
      state.error = null;
    },
    setTokensUsed(state, action) {
      state.tokensUsed = action.payload;
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
        const { id = nanoid(), role = 'assistant', content, tokens = 0 } = action.payload || {};
        if (content) {
          state.messages.push({ id, role, content });
        }
        state.tokensUsed += tokens;
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload || 'Failed to send message';
      });
  }
});

export const { addUserMessage, addAssistantMessage, clearChat, setTokensUsed } = chatSlice.actions;

// Selectors
export const selectChat = (state) => state.chat;
export const selectChatMessages = (state) => state.chat.messages;
export const selectChatStatus = (state) => state.chat.status;
export const selectChatError = (state) => state.chat.error;
export const selectChatTokens = (state) => state.chat.tokensUsed;

export default chatSlice.reducer;
