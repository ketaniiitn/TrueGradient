import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer, { hydrateConversations } from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
});

// NOTE: We deliberately removed eager hydration. Conversations will now be
// hydrated only after a successful authentication (see App-level effect).
// This prevents old chats from flashing on the sign-in / sign-up screens.

export function hydrateChatStateIfPresent() {
  try {
    const raw = localStorage.getItem('tg_chat_state_v1');
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      store.dispatch(hydrateConversations(parsed));
      return true;
    }
  } catch (_) { /* ignore hydration errors */ }
  return false;
}

// Subscribe to store changes to persist
let lastSerialized = '';
store.subscribe(() => {
  const state = store.getState().chat;
  const persist = {
    conversations: state.conversations,
    activeId: state.activeId,
  };
  const serialized = JSON.stringify(persist);
  if (serialized !== lastSerialized) {
    try {
      localStorage.setItem('tg_chat_state_v1', serialized);
      lastSerialized = serialized;
    } catch (_) { /* ignore quota */ }
  }
});
