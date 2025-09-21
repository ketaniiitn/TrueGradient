// Side-effect helper for simulating assistant typing with a delay.
// Keeps slice lean. Could be replaced later with real API streaming logic.
import { startAssistantTyping, finishAssistantTyping, sendUserMessage, startConversation } from './slices/chatSlice';

function buildMockReply(userContent) {
  if (!userContent) return 'Hello! How can I assist you?';
  return `You said: "${userContent.slice(0,80)}". Here's a mock response from the AI.`;
}

// simulateAssistantReply dispatches user message (starting new or existing convo)
// then shows typing placeholder and replaces it after a delay with mock content
export function simulateAssistantReply(message, { isNewConversation, delayMs = 1200 }) {
  return async (dispatch, getState) => {
    if (!message) return;
    if (isNewConversation) {
      dispatch(startConversation(message));
    } else {
      dispatch(sendUserMessage(message));
    }
    // Show typing placeholder only (assistant reply is deferred until after delay)
    dispatch(startAssistantTyping());
    await new Promise(r => setTimeout(r, delayMs));
    const final = buildMockReply(message);
    dispatch(finishAssistantTyping({ finalContent: final }));
  };
}
