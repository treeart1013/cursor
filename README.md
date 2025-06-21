# Chatmon

A frontend application for a corporate wiki AI search service. This project provides a chat-based user interface to compare responses from multiple AI models simultaneously.

## Development History

The project was developed from a detailed plan to a functional application, documented through a series of steps.

### 1. Initial Project Setup & Troubleshooting
- The project was initiated using Vue.js, scaffolding the `chatmon` with TypeScript, Vue Router, ESLint, and Prettier.
- A key initial challenge was overcoming an outdated Node.js environment, which was resolved by upgrading the Node.js version.

### 2. Scaffolding and Component Implementation
- A global dark mode theme was applied for a consistent look and feel.
- Core UI components were built: `SidebarMenu`, `ChatWindow`, `ChatInput`, `ChatHeader`, `TypingIndicator`, and `HtmlRenderer`.
- The application state (like message history) was centralized in the `HomeView.vue` parent component, passing data down to child components via props.

### 3. API Integration and Core Logic
- An API service was created in `src/services/api.ts`.
- `EventSource` was used to handle Server-Sent Events (SSE) for real-time streaming of responses from the backend AI service.

### 4. Major Feature Enhancements & Refactoring
- **Dual Chat Windows**: The UI was refactored from a single chat window to a side-by-side dual-window layout to facilitate model comparison.
- **Simultaneous API Calls**: The logic was updated to trigger two parallel API calls from a single user input, targeting `o4-mini` and `gpt-4o` models respectively.
- **Model Selection**: A model selection dropdown was added to each `ChatHeader`, allowing users to choose the AI model for each window.
- **Login and Route Protection**:
    - **Pinia** was integrated for global state management, specifically for user authentication.
    - A `LoginView.vue` page was created.
    - **Vue Router's** navigation guards were implemented to protect the main chat interface, redirecting unauthenticated users to the login page.
    - A logout feature was added to the header.

### 5. Bug Fixing and Polishing
- **Input Bug**: Fixed an issue where using Korean IME could cause the message to be sent twice.
- **Rendering Bug**: Ensured AI responses were rendered as HTML from the beginning of the stream using the `HtmlRenderer` component.
- **Layout Troubleshooting**: Resolved a persistent CSS layout issue that created an unwanted blank space on the right side of the screen.
- **UI Polish**:
    - Added a chat turn limit with a visual counter.
    - Disabled the send button during API calls to prevent multiple submissions.
    - Added placeholder text to indicate loading states or when the turn limit is reached.
- **Code Cleanup**: Removed unused files and folders from the initial project template.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
