# CollabCode - Frontend Viva Preparation & Project Notes

This document covers the complete frontend architecture of **CollabCode**, a real-time collaborative coding platform built with **React (Vite)**, **React Router**, **Monaco Editor**, and **Vanilla CSS**.

---

## Task 1: Project Setup, Folder Structure, Routing, and Mock Data

### 1. What Was Built
Set up the React application using Vite and installed `react-router-dom` and `@monaco-editor/react`. Established a modular folder structure (`components`, `pages`, `data`, `styles`), configured client-side routing with placeholder views, and created mock data for rooms, users, and messages.

### 2. Files Involved
- `package.json`
- `index.html`
- `src/main.jsx`
- `src/App.jsx`
- `src/data/mockData.js`
- `src/pages/Landing.jsx` & `src/pages/Landing.css`
- `src/pages/Login.jsx` & `src/pages/Login.css`
- `src/pages/Signup.jsx` & `src/pages/Signup.css`
- `src/pages/Dashboard.jsx` & `src/pages/Dashboard.css`
- `src/pages/Room.jsx` & `src/pages/Room.css`
- `src/pages/NotFound.jsx` & `src/pages/NotFound.css`

### 3. How It Works
1. `src/main.jsx` mounts the root component `<App />` into the DOM inside `div#root` using `createRoot()`.
2. `src/App.jsx` wraps the route tree in `<BrowserRouter>`.
3. `<Routes>` checks the browser's current URL against each `<Route path="..." element={<Component />} />` and renders the matching page.
4. If a user navigates to `/room/:id`, the dynamic parameter `:id` is captured and made available to `Room.jsx`.
5. If no route matches, the wildcard path `*` renders the `NotFound` page.
6. `src/data/mockData.js` exports static arrays (`rooms`, `users`, `messages`) used across the app to simulate backend responses.

### 4. React Concepts Used
- **Client-Side Routing (`react-router-dom`)**: Used in `src/App.jsx` (`BrowserRouter`, `Routes`, `Route`) to enable single-page navigation without reloading the browser.
- **Dynamic Route Parameters**: Defined in `src/App.jsx` (`path="/room/:id"`).
- **Module Exports / Imports**: Used in `src/data/mockData.js` (named `export const rooms = [...]`) and imported in pages.

### 5. Key Code Snippet
From `src/App.jsx`:
```jsx
// Main application routing layout
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Room from './pages/Room';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      {/* Global Navbar appears on all pages, auto-hidden in rooms */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/room/:id" element={<Room />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 6. Viva Questions & Answers
1. **Q: What is the purpose of `<BrowserRouter>` in React?**
   *A:* It uses the HTML5 History API (`pushState`, `replaceState`, `popstate`) to keep the UI in sync with the current URL without triggering a full page reload.
2. **Q: What is a dynamic route parameter like `:id` in React Router?**
   *A:* It is a URL placeholder that matches any value in that segment. For example, `/room/room-101` matches `/room/:id`, and the value `"room-101"` can be accessed via `useParams()`.
3. **Q: Why do we use Vite instead of Create React App (CRA)?**
   *A:* Vite uses native ES Modules (ESM) in development and Rollup for production builds, providing near-instant server startup and fast Hot Module Replacement (HMR).
4. **Q: What is the purpose of the wildcard route `path="*"`?**
   *A:* It acts as a fallback route that catches any URL not explicitly defined, rendering a custom 404 Not Found component.
5. **Q: Why use mock data instead of calling an actual backend in this project phase?**
   *A:* Mock data decouples frontend UI and state development from backend implementation, allowing us to build, verify, and test user interactions independently.

---

## Task 2: Global CSS Variables, Reusable Classes, and Responsive Navbar

### 1. What Was Built
Defined a comprehensive dark theme design system in `global.css` using CSS custom properties (variables), reset styles, and reusable utility classes (`.btn`, `.btn-primary`, `.btn-outline`, `.input`, `.card`). Created a responsive `Navbar` component with desktop navigation and an animated mobile hamburger menu.

### 2. Files Involved
- `src/styles/global.css`
- `src/components/Navbar.jsx`
- `src/components/Navbar.css`
- `index.html` (Google Fonts Inter preconnect and stylesheet links)

### 3. How It Works
1. `global.css` defines CSS custom properties (`--bg-color`, `--surface-color`, `--primary-accent`, etc.) under the `:root` pseudo-class.
2. Reusable classes (`.btn`, `.card`, `.input`) reference these variables so UI components maintain visual consistency.
3. In `Navbar.jsx`, `useLocation()` reads the current pathname (`location.pathname`).
4. If `location.pathname.startsWith('/room/')`, the Navbar returns `null`, hiding itself inside coding rooms so the editor can use the full viewport.
5. On mobile screens ($\le 768\text{px}$), the desktop navigation hides via media query and a hamburger button appears. Clicking it toggles `isMobileMenuOpen` (`useState`), showing or hiding the mobile menu.

### 4. React Concepts Used
- **`useState`**: Used in `src/components/Navbar.jsx` (`const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);`) to toggle the mobile drawer.
- **`useLocation`**: Used in `src/components/Navbar.jsx` from `react-router-dom` to inspect the current path and conditionally render.
- **Conditional Rendering**: Used in `src/components/Navbar.jsx` (`if (location.pathname.startsWith('/room/')) return null;` and `{isMobileMenuOpen && <div className="navbar-mobile-menu">...</div>}`).
- **Event Handling**: Used in `src/components/Navbar.jsx` (`onClick={toggleMobileMenu}`).

### 5. Key Code Snippet
From `src/components/Navbar.jsx`:
```jsx
// Hide Navbar inside active coding rooms to give full screen to editor
const location = useLocation();
if (location.pathname.startsWith('/room/')) {
  return null;
}

// Mobile toggle state
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

const toggleMobileMenu = () => {
  setIsMobileMenuOpen((prevState) => !prevState);
};

// Return header with responsive nav and conditional mobile dropdown
return (
  <header className="navbar-header">
    <div className="navbar-container">
      <Link to="/" className="navbar-logo">CollabCode</Link>
      <button className={`hamburger-btn ${isMobileMenuOpen ? 'open' : ''}`} onClick={toggleMobileMenu}>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>
    </div>
    {isMobileMenuOpen && <div className="navbar-mobile-menu">...</div>}
  </header>
);
```

### 6. Viva Questions & Answers
1. **Q: Why use CSS variables (`:root { --var-name: value }`) instead of hardcoded hex values?**
   *A:* CSS variables allow centralized theming, easy global adjustments, and consistent palette reuse without repeating colors across multiple files.
2. **Q: How does `useLocation()` work in React Router?**
   *A:* `useLocation()` returns the current location object representing the active URL, including its `pathname`, `search`, and `hash`.
3. **Q: Why does returning `null` from a component prevent rendering?**
   *A:* In React, returning `null` tells the reconciler not to mount or display any DOM nodes for that component during that render cycle.
4. **Q: What is the advantage of using functional updater syntax: `setIsMobileMenuOpen(prev => !prev)`?**
   *A:* It guarantees you are toggling against the most up-to-date state value, preventing race conditions that can occur with asynchronous state updates.
5. **Q: Why do we use `<Link>` from React Router instead of regular `<a href="...">`?**
   *A:* `<Link>` intercepts navigation and updates browser history via client-side routing, preventing a full page refresh and preserving application state.

---

## Task 3: Public Pages (Landing, Login, and Signup with Validation)

### 1. What Was Built
Implemented the `Landing` page featuring a hero section with dual CTAs, a 4-card feature highlights grid, and a footer. Built centered `Login` and `Signup` pages featuring controlled form inputs, comprehensive validation (empty fields, email regex, password length $\ge 6$, password match), inline error messages, and programmatic redirection to `/dashboard`.

### 2. Files Involved
- `src/pages/Landing.jsx` & `src/pages/Landing.css`
- `src/pages/Login.jsx` & `src/pages/Login.css`
- `src/pages/Signup.jsx` & `src/pages/Signup.css`

### 3. How It Works
1. `Landing.jsx` renders static feature information and routes visitors to `/signup` or `/dashboard`.
2. `Login.jsx` and `Signup.jsx` store form inputs in an object state (`formData`) via `useState`.
3. An `onChange` handler reads `e.target.name` and `e.target.value`, updating only the changed property via computed property names: `[name]: value`.
4. When the user submits the form, `e.preventDefault()` halts browser submission.
5. A helper function `validateForm()` checks validation rules and returns an `errors` object. If errors exist, they are stored in state and displayed under the respective inputs.
6. If the form is valid, `navigate('/dashboard')` programmatically directs the user to the Dashboard.

### 4. React Concepts Used
- **Controlled Components / Controlled Inputs**: Form input values are tied to React state (`value={formData.email}`) and updated via `onChange`.
- **`useState`**: Used in `Login.jsx` and `Signup.jsx` for both `formData` and `errors`.
- **`useNavigate`**: Used to programmatically navigate to `/dashboard` upon successful validation.
- **Lists and Keys**: Used in `Landing.jsx` to map over the `features` array (`features.map(item => <div key={item.id} ...>)`).
- **Form Event Handling**: `e.preventDefault()` used to prevent native browser page reload on submit.

### 5. Key Code Snippet
From `src/pages/Login.jsx`:
```jsx
// Controlled form state and validation logic
const [formData, setFormData] = useState({ email: '', password: '' });
const [errors, setErrors] = useState({});
const navigate = useNavigate();

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
  if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
};

const handleSubmit = (e) => {
  e.preventDefault();
  const formValidationErrors = validateForm();
  if (Object.keys(formValidationErrors).length > 0) {
    setErrors(formValidationErrors);
    return;
  }
  navigate('/dashboard');
};
```

### 6. Viva Questions & Answers
1. **Q: What is a controlled input in React?**
   *A:* A controlled input has its value driven by React state (`value={state}`) and updates through event handlers (`onChange`), giving the component complete control over user input.
2. **Q: Why is `e.preventDefault()` called inside form submit handlers?**
   *A:* By default, submitting an HTML form sends an HTTP POST/GET request and reloads the browser. `e.preventDefault()` cancels this default behavior so React can handle validation and routing.
3. **Q: How does `useNavigate()` differ from the `<Link>` component?**
   *A:* `<Link>` is a declarative JSX element rendered in the UI for user clicks, while `useNavigate()` is an imperative hook used inside JavaScript functions (e.g., after validation or async calls).
4. **Q: Why must every item in a `.map()` list have a unique `key` prop?**
   *A:* React uses the `key` prop to identify which items have changed, been added, or been removed during Virtual DOM reconciliation, optimizing re-renders.
5. **Q: How does dynamic object property updating work in `setFormData(prev => ({ ...prev, [name]: value }))`?**
   *A:* ES6 computed property names `[name]` evaluate the string stored in the input's `name` attribute (e.g., `"email"` or `"password"`), updating that specific key while copying existing state with the spread operator (`...prev`).

---

## Task 4: Dashboard Page, RoomCard, and Create/Join Modals

### 1. What Was Built
Constructed the `Dashboard` page with an active rooms grid rendered via `.map()` using modular `RoomCard` components. Implemented a "Create Room" modal with form controls to append new rooms to state, a "Join with Code" modal to route to arbitrary room IDs, and an empty state view when no rooms exist.

### 2. Files Involved
- `src/pages/Dashboard.jsx` & `src/pages/Dashboard.css`
- `src/components/RoomCard.jsx` & `src/components/RoomCard.css`
- `src/data/mockData.js`

### 3. How It Works
1. `Dashboard.jsx` initializes `roomsList` state from `mockData.rooms`.
2. If `roomsList.length > 0`, it renders a CSS Grid of `<RoomCard />` items; otherwise, an empty state container is displayed.
3. Clicking a `RoomCard` or its "Join Room" button triggers `navigate(\`/room/${room.id}\`)`.
4. Clicking "+ Create Room" sets `isCreateModalOpen` to `true`, displaying the modal.
5. When the user submits the create form, a new room object with boilerplate code and a unique timestamp ID is created and prepended to state (`setRoomsList(prev => [createdRoom, ...prev])`), immediately updating the grid.
6. The "Join with Code" modal accepts a code (e.g., `room-101`) and navigates directly to `/room/:code`.

### 4. React Concepts Used
- **State Initialization from Mock Data**: `const [roomsList, setRoomsList] = useState(initialRooms);` in `Dashboard.jsx`.
- **Props Passing**: `Dashboard.jsx` passes each room object into `<RoomCard key={room.id} room={room} />`.
- **Event Propagation Prevention (`e.stopPropagation`)**: Used in `RoomCard.jsx` on the Join button so clicking the button doesn't trigger the card's outer click event twice.
- **Conditional Rendering (Ternary Operator)**: Toggles between rooms grid and empty state (`roomsList.length > 0 ? (...) : (...)`).
- **Modal Portals / Conditional Overlays**: `{isCreateModalOpen && <div className="modal-overlay">...</div>}`.

### 5. Key Code Snippet
From `src/pages/Dashboard.jsx`:
```jsx
// Creating a new room and prepending to state
const handleCreateRoom = (e) => {
  e.preventDefault();
  if (!newRoomData.name.trim()) {
    setCreateError('Room name is required.');
    return;
  }
  const createdRoom = {
    id: `room-${Date.now().toString().slice(-4)}`,
    name: newRoomData.name.trim(),
    language: newRoomData.language,
    description: newRoomData.description.trim() || 'Collaborative coding session.',
    createdBy: 'You',
    participantsCount: 1,
    createdAt: new Date().toISOString(),
    code: starterSnippets[newRoomData.language] || '// Welcome\n'
  };
  // Prepend new room to instantly show it at the front of the grid
  setRoomsList((prev) => [createdRoom, ...prev]);
  setIsCreateModalOpen(false);
};
```

### 6. Viva Questions & Answers
1. **Q: Why do we use `e.stopPropagation()` inside `RoomCard.jsx`?**
   *A:* Because both the outer card `<div>` and the inner `<button>` have click handlers. `e.stopPropagation()` prevents the click event from bubbling up to parent containers.
2. **Q: What is immutability in React state and how is it maintained when adding a room?**
   *A:* Immutability means never modifying existing state directly (e.g., `roomsList.push(newRoom)`). We maintain it by creating a new array using the spread operator: `setRoomsList(prev => [newRoom, ...prev])`.
3. **Q: Why does React need state updates to be immutable?**
   *A:* React uses shallow reference equality checks (`prevRef === newRef`) to decide if a re-render is necessary. Mutating an existing array does not change its reference, causing React to miss the update.
4. **Q: How does the "Join with Code" functionality work without a backend?**
   *A:* It reads the entered code and executes `navigate('/room/' + code)`. React Router matches the dynamic `/room/:id` route, mounting `Room.jsx` with that parameter.
5. **Q: What is the difference between props and state?**
   *A:* State is mutable data managed locally within a component; props are read-only properties passed down from parent to child.

---

## Task 5: Room Page Layout, Monaco Editor, Toolbar, and UserList

### 1. What Was Built
Implemented the primary collaborative workspace layout using full-screen CSS Grid. Integrated the Monaco Code Editor (`@monaco-editor/react`) with dynamic language and theme switching. Built a top toolbar with room title, language selector, theme toggle, copy link with temporary feedback, run action, and a 200px `UserList` sidebar showing active participants.

### 2. Files Involved
- `src/pages/Room.jsx` & `src/pages/Room.css`
- `src/components/UserList.jsx` & `src/components/UserList.css`
- `src/data/mockData.js`

### 3. How It Works
1. `Room.jsx` retrieves the `:id` parameter from the URL using `useParams()`.
2. It searches `mockData.rooms` for matching room details to set the initial code and language. If not found, it defaults to JavaScript starter code.
3. The full-screen CSS Grid defines explicit grid areas:
   - `"toolbar toolbar"`
   - `"sidebar editor"`
   - `"sidebar output"`
4. `<Editor />` receives `language`, `theme`, and `value={code}`. When the user types, `onChange` updates `code` state.
5. When the user changes the language dropdown, `handleLanguageChange` updates the `language` state and replaces the editor's content with starter template code for that language.
6. The "Copy Link" button copies `window.location.href` to the clipboard via `navigator.clipboard.writeText()` and temporarily sets `isCopied` to `true` for 2 seconds using `setTimeout`.
7. `UserList.jsx` maps over the users array, calculating initials and applying their assigned color to avatar badges alongside a green presence indicator dot.

### 4. React Concepts Used
- **`useParams`**: Extracted the room ID from the URL (`const { id } = useParams();`).
- **Third-Party Component Integration**: Integrated `<Editor />` from `@monaco-editor/react`.
- **Props Passing**: Passed `mockUsers` into `<UserList users={mockUsers} />`.
- **Controlled Select**: Language selector `<select value={language} onChange={...}>`.
- **Timer Handling (`setTimeout`)**: Used for the 2-second copy notification reset.

### 5. Key Code Snippet
From `src/pages/Room.jsx`:
```jsx
// Room initialization, route parameters, and clipboard copy action
const { id } = useParams();
const currentRoom = initialRooms.find((r) => r.id === id);

const [code, setCode] = useState(currentRoom ? currentRoom.code : STARTER_CODES.javascript);
const [language, setLanguage] = useState(currentRoom ? currentRoom.language : 'javascript');
const [isCopied, setIsCopied] = useState(false);

const handleCopyLink = () => {
  navigator.clipboard.writeText(window.location.href);
  setIsCopied(true);
  setTimeout(() => {
    setIsCopied(false);
  }, 2000);
};
```

### 6. Viva Questions & Answers
1. **Q: What is Monaco Editor and why is it used?**
   *A:* Monaco Editor is the code editor engine that powers VS Code. It provides syntax highlighting, auto-completion, line numbers, and indentation out of the box in the browser.
2. **Q: How does `useParams()` extract values from the URL?**
   *A:* React Router's route configuration defines parameters using colons (e.g. `/room/:id`). `useParams()` returns an object of key/value pairs parsed from the current URL.
3. **Q: Why is CSS Grid beneficial for an IDE layout over Flexbox?**
   *A:* CSS Grid handles 2-dimensional layouts (simultaneous rows and columns) with named template areas, ensuring toolbars, sidebars, and editors maintain fixed or fluid proportions without nested wrappers.
4. **Q: What browser API is used to copy text to the clipboard?**
   *A:* The asynchronous `navigator.clipboard.writeText()` API.
5. **Q: How do we change language syntax dynamically in Monaco Editor?**
   *A:* By passing the updated language state string (e.g., `'javascript'`, `'python'`, `'cpp'`) to the `language` prop of the `<Editor />` component.

---

## Task 6: ChatPanel, Auto-Scroll, Fake Run Output, and Lifted State

### 1. What Was Built
Added a collapsible right-hand `ChatPanel` with auto-scrolling to the latest message, message alignment differentiation (own messages right, others left with colored names), and timestamp display. Built a collapsible bottom `OutputPanel` with a fake run simulation and clear action. Lifted all shared state up to `Room.jsx`.

### 2. Files Involved
- `src/components/ChatPanel.jsx` & `src/components/ChatPanel.css`
- `src/components/OutputPanel.jsx` & `src/components/OutputPanel.css`
- `src/pages/Room.jsx` & `src/pages/Room.css`

### 3. How It Works
1. **Lifting State Up**: `messages`, `output`, `isRunning`, and collapse states are defined in `Room.jsx` and passed down to `ChatPanel` and `OutputPanel` via props.
2. **Chat Message Submission**: When the user sends a message (via button click or `Enter` key), `handleSendMessage` in `Room.jsx` creates a new message object with timestamp and appends it to `messages` state.
3. **Auto-Scroll with `useRef` & `useEffect`**: In `ChatPanel.jsx`, an invisible `div` at the bottom of the message list has `ref={messagesEndRef}`. A `useEffect` hook triggers `messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })` whenever the `messages` array changes.
4. **Run Simulation**: Clicking "▶ Run" sets `isRunning` to `true` and shows *"Compiling and executing..."*. A `setTimeout` after 1000ms sets `isRunning` to `false` and outputs simulated execution text according to the selected language.
5. **Collapsible Panels**: Toggling chat or output modifies CSS Grid classes (`chat-collapsed`, `output-collapsed`), reducing column/row sizes.

### 4. React Concepts Used
- **Lifting State Up**: State stored in parent `Room.jsx` and shared with children (`ChatPanel`, `OutputPanel`).
- **`useRef`**: Targets the bottom anchor DOM element in `ChatPanel.jsx` without triggering re-renders.
- **`useEffect`**: Runs side effects (scrolling to bottom) in response to `messages` state updates.
- **Keyboard Event Handling**: Capturing `onKeyDown` for `Enter` (without `Shift`) to submit chat messages.
- **Simulated Asynchronous Operations**: `setTimeout` used to simulate server execution latency.

### 5. Key Code Snippet
From `src/components/ChatPanel.jsx`:
```jsx
// Auto-scroll implementation using useRef and useEffect
const messagesEndRef = useRef(null);

const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
};

// Scroll down whenever the messages array updates
useEffect(() => {
  if (isOpen) {
    scrollToBottom();
  }
}, [messages, isOpen]);
```

### 6. Viva Questions & Answers
1. **Q: What is "Lifting State Up" in React and why do we do it?**
   *A:* Lifting state up means moving state to the closest common ancestor when two or more sibling components need to access or modify the same data.
2. **Q: What is the difference between `useState` and `useRef`?**
   *A:* Updating `useState` triggers a component re-render. Mutating `useRef.current` persists values across renders without causing a re-render; it is also used for direct DOM references.
3. **Q: When does `useEffect` run?**
   *A:* By default, after every completed render. When provided with a dependency array (e.g. `[messages]`), it only runs after renders where one of the dependencies has changed.
4. **Q: Why do we use optional chaining (`messagesEndRef.current?.scrollIntoView`)?**
   *A:* To safely call the function only if `messagesEndRef.current` is not `null` or `undefined`, preventing runtime TypeError crashes.
5. **Q: How does `ChatPanel` know if a message is an "own" message or from someone else?**
   *A:* It checks `msg.userId === currentUserId`. If true, it applies `.message-own` (right-aligned in blue); otherwise `.message-other` (left-aligned with colored sender name).

---

## Task 7: Responsiveness, Slide-Over Drawers, NotFound, and Loading State

### 1. What Was Built
Polished transitions, focus rings, and hover states across the application. Added an animated loading skeleton on `Dashboard.jsx`. Styled the `NotFound` 404 page with a primary "Go Home" CTA. Created mobile slide-over drawers for the participants list and chat panel with backdrop overlays for screens below 768px.

### 2. Files Involved
- `src/pages/Dashboard.jsx` & `src/pages/Dashboard.css`
- `src/pages/Room.jsx` & `src/pages/Room.css`
- `src/pages/NotFound.jsx` & `src/pages/NotFound.css`
- `src/styles/global.css`

### 3. How It Works
1. **Loading Skeletons**: `Dashboard.jsx` initializes `isLoading` to `true`. A `useEffect` sets it to `false` after 600ms. While `true`, skeleton cards with a CSS shimmer animation (`@keyframes shimmer`) render in place of the room cards.
2. **Mobile Slide-Over Drawers (<768px)**:
   - On screens $\le 768\text{px}$, CSS media queries hide the desktop sidebar/chat columns and adjust the grid to a single column (`grid-template-columns: 1fr`).
   - The toolbar reveals **"👥 Users"** and **"💬 Chat"** buttons.
   - Clicking a button sets `isUsersDrawerOpen` or `isChatDrawerOpen` to `true`, adding `.drawer-open` which applies `transform: translateX(0)` to slide the drawer into view.
   - A `.drawer-backdrop` overlay covers the editor and closes the drawers when tapped.
3. **NotFound Page**: Renders a centered dark card with a gradient 404 header and a `<Link to="/" className="btn btn-primary">` to return home.

### 4. React Concepts Used
- **Cleanup in `useEffect`**:
  ```jsx
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer); // Cleanup function
  }, []);
  ```
- **Conditional Class Application**: Toggling `.drawer-open` via template literals:
  `className={`room-sidebar-area ${isUsersDrawerOpen ? 'drawer-open' : ''}`}`.
- **Pure Functions in Rendering**: Fixed impure `new Date().getFullYear()` call by extracting `CURRENT_YEAR` as an external constant, complying with React purity rules.

### 5. Key Code Snippet
From `src/pages/Room.jsx`:
```jsx
// Mobile drawer toggle buttons and slide-over markup
<button
  type="button"
  className="btn btn-outline toolbar-btn mobile-drawer-btn"
  onClick={() => { setIsUsersDrawerOpen(true); setIsChatDrawerOpen(false); }}
>
  👥 Users
</button>

{/* Slide-over sidebar container */}
<aside className={`room-sidebar-area ${isUsersDrawerOpen ? 'drawer-open' : ''}`}>
  <div className="drawer-mobile-header">
    <span>👥 Collaborators</span>
    <button className="drawer-close-btn" onClick={() => setIsUsersDrawerOpen(false)}>×</button>
  </div>
  <UserList users={mockUsers} />
</aside>

{/* Backdrop overlay */}
{(isUsersDrawerOpen || isChatDrawerOpen) && (
  <div className="drawer-backdrop" onClick={closeMobileDrawers} />
)}
```

### 6. Viva Questions & Answers
1. **Q: Why is it important to return a cleanup function from `useEffect`?**
   *A:* If the component unmounts before an asynchronous timer or subscription completes, the cleanup function cancels it (e.g. `clearTimeout`), preventing memory leaks and updates to unmounted components.
2. **Q: What is a loading skeleton and why is it preferred over a spinner?**
   *A:* A skeleton mimics the layout of content before it loads, reducing perceived latency and visual layout shifts (CLS) compared to a generic spinning wheel.
3. **Q: How do CSS transforms (`translateX`) optimize drawer animations compared to animating `left` or `width`?**
   *A:* CSS `transform` is GPU-accelerated and only triggers compositing, avoiding browser layout recalculations and repaints, resulting in smooth 60fps animations.
4. **Q: What does "impure function during render" mean in React?**
   *A:* A component render must be pure: given the same inputs (props and state), it should always return the same JSX without side effects. Calling `new Date()` or `Math.random()` during render is non-deterministic.
5. **Q: How does the drawer backdrop improve mobile UX?**
   *A:* It provides clear visual hierarchy by dimming the background and follows mobile touch conventions by letting users tap anywhere outside the drawer to dismiss it.

---

## Component Tree

```
App
├── BrowserRouter
│   ├── Navbar (Hidden if URL starts with "/room/")
│   └── Routes
│       ├── Route "/" ───────────────────> Landing
│       │                                    └── Feature Cards (mapped)
│       ├── Route "/login" ──────────────> Login
│       ├── Route "/signup" ─────────────> Signup
│       ├── Route "/dashboard" ──────────> Dashboard
│       │                                    ├── Skeletons (if loading)
│       │                                    ├── RoomCard (mapped over roomsList)
│       │                                    │     └── [props: room]
│       │                                    ├── Create Room Modal
│       │                                    └── Join Code Modal
│       ├── Route "/room/:id" ───────────> Room
│       │                                    ├── UserList (Sidebar / Mobile Drawer)
│       │                                    │     └── [props: users]
│       │                                    ├── Editor (Monaco Editor)
│       │                                    │     └── [props: language, theme, value, onChange]
│       │                                    ├── OutputPanel (Console)
│       │                                    │     └── [props: output, isRunning, onClear, isCollapsed, onToggleCollapse]
│       │                                    └── ChatPanel (Sidebar / Mobile Drawer)
│       │                                          └── [props: messages, onSendMessage, currentUserId, isOpen, onToggle]
│       └── Route "*" ───────────────────> NotFound
```

---

## Data Flow Summary

| Component | State Owned | Props Received | Callbacks / Actions Passed Down |
| :--- | :--- | :--- | :--- |
| **`App`** | None | None | None (defines client-side routes) |
| **`Navbar`** | `isMobileMenuOpen` | None | Reads route from `useLocation` |
| **`Landing`** | None | None | Navigation links |
| **`Login`** | `formData`, `errors` | None | Triggers `navigate('/dashboard')` |
| **`Signup`** | `formData`, `errors` | None | Triggers `navigate('/dashboard')` |
| **`Dashboard`** | `roomsList`, `isLoading`, `isCreateModalOpen`, `isJoinModalOpen`, `newRoomData`, `roomCodeInput` | None | Passes `room` to `<RoomCard />` |
| **`RoomCard`** | None | `room` | Triggers `navigate('/room/' + room.id)` |
| **`Room`** (Root Workspace) | `code`, `language`, `editorTheme`, `isCopied`, `output`, `isRunning`, `isOutputCollapsed`, `messages`, `isChatOpen`, `isUsersDrawerOpen`, `isChatDrawerOpen` | None (reads `:id` via `useParams`) | **Lifts state**; passes state & updater handlers down to children |
| **`UserList`** | None | `users` | Renders user avatars and online indicators |
| **`ChatPanel`** | `inputText` | `messages`, `currentUserId`, `isOpen`, `onToggle` | Calls `onSendMessage(text)` |
| **`OutputPanel`** | None | `output`, `isRunning`, `isCollapsed`, `onToggleCollapse` | Calls `onClear()` |
| **`NotFound`** | None | None | Navigates to `/` or `/dashboard` |

---

## 10 General Viva Questions & Answers

1. **Q: Why did you choose React for this project?**
   *A:* React's component-based architecture allows us to break down complex UIs (editor, chat, participants, dashboard) into reusable, independent components. Its declarative state model ensures the DOM updates efficiently whenever state changes.

2. **Q: What is the Virtual DOM and how does it work?**
   *A:* The Virtual DOM is a lightweight in-memory JavaScript representation of the actual DOM. When state changes, React creates a new Virtual DOM tree, compares it with the previous tree (diffing algorithm), and applies only the necessary changes to the real DOM (reconciliation).

3. **Q: What is Vite and why is it faster than Webpack?**
   *A:* Webpack bundles the entire application before serving it. Vite leverages browser-native ES Modules (ESM) to serve source files on demand without bundling during development, and uses esbuild (written in Go) for pre-bundling dependencies.

4. **Q: What is a Single Page Application (SPA)?**
   *A:* An SPA serves a single `index.html` file. Instead of requesting new HTML pages from the server on navigation, client-side JavaScript dynamically rewrites the DOM, providing faster, desktop-like transitions.

5. **Q: What are React Hooks and why were they introduced?**
   *A:* Hooks (`useState`, `useEffect`, `useRef`, etc.) were introduced in React 16.8 to allow functional components to manage local state and lifecycle side effects without writing ES6 class components.

6. **Q: What is the difference between props and state?**
   *A:* State is private, mutable data managed internally by a component. Props are read-only inputs passed from a parent component to configure child components.

7. **Q: What is prop drilling and did you encounter it?**
   *A:* Prop drilling occurs when data must be passed through multiple intermediate components that don't need it themselves. In this project, state was lifted directly to `Room.jsx` and passed down just one level to immediate children (`ChatPanel`, `OutputPanel`, `UserList`), keeping prop passing clean and direct.

8. **Q: How does form handling work without a backend?**
   *A:* We use controlled components where inputs are bound to React state. Validation is executed via regular expressions and conditional checks on the client side, followed by programmatic redirection via `useNavigate()`.

9. **Q: How would you add real-time synchronization to this editor?**
   *A:* By integrating WebSockets using **Socket.IO**. When user edits code in Monaco, an event with the change delta is emitted to a server and broadcast to all connected clients in the same room.

10. **Q: How do you handle merge conflicts when multiple users type simultaneously?**
    *A:* By using **CRDTs** (Conflict-free Replicated Data Types) via libraries like **Yjs** or Operational Transformation (OT). Yjs integrates directly with Monaco Editor (`y-monaco`) to mathematically resolve concurrent edits without data loss.

---

## Future Scope

1. **Backend Integration (Node.js & Express)**:
   - Replace static mock data with a REST/GraphQL API.
   - Connect to MongoDB or PostgreSQL to persist user profiles, room configurations, and code snapshots.

2. **Real-Time Synchronization (Socket.IO & Yjs)**:
   - Implement **Yjs** with `y-websocket` and `y-monaco` bindings for peer-to-peer or server-mediated conflict-free collaborative editing with multi-cursor indicators.
   - Real-time WebSocket broadcasting for live chat messages and user presence.

3. **Real Authentication & Authorization**:
   - Secure registration and login using JSON Web Tokens (JWT) or OAuth (GitHub/Google login).
   - Role-based room access control (Host, Editor, Read-only Spectator).

4. **In-Browser Code Execution (Docker Sandbox / Piston API)**:
   - Replace fake execution with an isolated backend execution environment using Docker containers or the Piston API to safely compile and run Python, JavaScript, and C++ code with stdout, stderr, and execution limits.

5. **Audio/Video Communication (WebRTC)**:
   - Add peer-to-peer audio and video streaming using WebRTC for real-time pair programming interviews.
