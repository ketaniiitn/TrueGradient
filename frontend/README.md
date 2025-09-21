# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

### Responsiveness & UI Improvements

Recent updates added:
1. Mobile sidebar drawer with accessible toggle (hamburger in header) and overlay.
2. Off-canvas animation and ESC key support to close the sidebar on mobile.
3. Responsive grid for suggestion cards (1 / 2 / 3 columns at sm / lg breakpoints).
4. Chat dashboard layout now uses separate mobile and desktop sidebars to avoid layout shift.
5. Auth pages (Sign In / Sign Up) have improved padding and scalable typography on small screens.
6. Added improved focus-visible outline and scaffold for future dark mode.

Usage notes:
- To enable dark mode scaffold later, you can toggle a `dark-auto` class on the body.
- Mobile menu state is handled inside `ChatDashboard.jsx` and passed to `Header` / `Sidebar`.

Feel free to adjust breakpoints in `tailwind.config.js` if you need custom screen sizes.

### Phase 2: Chat Interface Architecture

Components:
- `MessageList.jsx` – Renders ordered messages with role-based styling, auto-scroll to latest.
- `ChatInput.jsx` – ForwardRef capable input with Enter submit and Shift+Enter newline.
- `Sidebar.jsx` – Dynamic conversations list (select, new chat) supporting mobile drawer.
- `SuggestionCards.jsx` – Triggers creation of a new conversation with a mock bot reply.
- `ChatDashboard.jsx` – Orchestrates conversation state (local for now) and layout.

Conversation Model:
```
{
	id: string,
	title: string,
	messages: [{ id, role: 'user'|'assistant'|'system', content }],
	updatedAt: number
}
```

Behavior:
- Clicking a suggestion starts a conversation (user + mock assistant reply).
- Sending a message in an existing conversation appends user + mock assistant messages.
- New Chat resets active selection (welcome + suggestions appear again).
- Conversations array is kept sorted by `updatedAt` (most recent first).

Future Extension Ideas:
- Persist conversations to backend / localStorage.
- Streaming assistant replies.
- Edit / regenerate message flows.
- Token usage integration via existing Redux chat slice.

### ChatSession Page
`ChatSession.jsx` is an isolated page for an individual chat workflow (separate from `ChatDashboard.jsx`). It:
- Maintains its own local conversation state.
- Uses `MessageListModern` with action buttons (copy, feedback, more).
- Is routed at `/chat` via protected route.
- Keeps the same responsive layout and mobile sidebar behavior.
