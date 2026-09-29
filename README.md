# CollabCode — Real-Time Collaborative Coding Platform (Frontend)

CollabCode is an in-browser collaborative coding environment built with **React**, **Vite**, **Monaco Editor**, and **Vanilla CSS**. It provides a distraction-free, synchronized workspace designed for pair programming, algorithm practice, technical interviews, and team debugging.

> **Note**: This is the frontend interface built for a college Web Technology project. All data (rooms, users, and chat messages) is driven by client-side mock data. Backend integration and live WebSocket synchronization are planned for future phases.

---

## Features Implemented

- **Landing Page**:
  - Hero section with dual call-to-action buttons (*"Get Started Free"* and *"Explore Demo Rooms"*).
  - 4-card feature highlights grid (Live Editing, Real-Time Chat, Multi-Language, Run Code).
  - Clean footer with quick links and copyright.
- **Authentication Pages (Login & Signup)**:
  - Centered dark-themed card forms with controlled inputs.
  - Client-side validation: empty field checks, email format regex, password length ($\ge 6$), and matching password confirmation.
  - Real-time inline error messages.
  - Programmatic navigation to `/dashboard` upon successful validation.
- **Dashboard & Room Management**:
  - Interactive grid displaying active rooms with custom color-coded language badges (Python, JavaScript, C++) and online member counts.
  - Initial load shimmer skeleton animation.
  - **"Create Room" Modal**: Allows choosing a room name, primary language, and description; instantly prepends the new room to state.
  - **"Join with Code" Modal**: Lets users input any room code and directly navigate to that room.
  - Empty state fallback view when no rooms exist.
- **Collaborative Coding Workspace (`/room/:id`)**:
  - **Full-Screen CSS Grid Layout**: Top toolbar, 200px participants sidebar, central editor, bottom console, and right chat panel.
  - **Monaco Code Editor**: Powered by `@monaco-editor/react` with syntax highlighting and language-specific starter code.
  - **Language Selector**: Seamlessly switch between JavaScript, Python, and C++ with dynamic template population.
  - **Theme Toggle**: Switch Monaco Editor between `vs-dark` and `light` themes.
  - **Copy Room Link**: Copies the current room URL to clipboard with 2-second visual feedback (`"✓ Copied!"`).
  - **Simulated Code Execution**: Clicking **"▶ Run"** displays an execution state for 1 second followed by language-specific simulated console output and exit codes.
  - **Collapsible Output Console**: Toggleable between expanded and collapsed states, with a **Clear** button.
  - **Live Chat Panel**: Collapsible right sidebar showing chat history, distinct right-aligned blue bubbles for own messages, left-aligned bubbles for teammate messages with colored names, timestamps, and auto-scrolling on new messages via `useRef` and `useEffect`.
  - **Responsive Mobile Drawers**: On screens below `768px`, the participants list and chat panel collapse into slide-over drawers accessible via toolbar buttons with backdrop overlays.
- **Global Responsive Navbar**:
  - Sticky glassmorphism header with desktop links and animated mobile hamburger toggle.
  - Automatically hidden inside coding rooms (`/room/:id`) to maximize editor viewport height.
- **Custom 404 NotFound Page**:
  - Polished 404 error card with a primary **"← Go Home"** action button.

---

## Tech Stack

- **Core**: React 19, JavaScript (ES6+), HTML5
- **Build Tool / Bundler**: Vite 8
- **Routing**: `react-router-dom` (v7)
- **Code Editor**: `@monaco-editor/react` (v4)
- **Styling**: Vanilla CSS (CSS Custom Properties / Variables, CSS Grid, Flexbox — no Tailwind or CSS libraries)
- **Typography**: Google Fonts Inter

---

## Prerequisites

- **Node.js**: `v18.0.0` or higher (Tested on `v24.18.0`)
- **npm**: `v9.0.0` or higher (Tested on `v11.16.0`)

---

## Step-by-Step Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd coding_platform
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## Production Build & Preview

To create and preview the optimized production build:

1. **Build the production bundle**:
   ```bash
   npm run build
   ```
   *Artifacts will be generated in the `dist/` directory.*

2. **Preview the production build locally**:
   ```bash
   npm run preview
   ```

3. **Code Quality / Linting**:
   ```bash
   npm run lint
   ```

---

## Folder Structure

```
coding_platform/
├── index.html              # HTML entry point (Google Fonts Inter preconnect and links)
├── package.json            # Project manifest, scripts, and dependencies
├── vite.config.js          # Vite build configuration with React plugin
├── PROJECT_NOTES.md        # Comprehensive viva preparation notes and architecture breakdown
├── README.md               # Project documentation, setup guide, and demo walkthrough
└── src/
    ├── main.jsx            # Application mount point (renders App into DOM)
    ├── App.jsx             # Top-level client-side router and global Navbar layout
    ├── assets/             # SVG logos and static assets
    ├── data/
    │   └── mockData.js     # Mock dataset for rooms, users, and chat messages
    ├── styles/
    │   └── global.css      # Dark theme CSS variables, reset, typography, and reusable classes
    ├── components/
    │   ├── Navbar.jsx      # Responsive navigation header with route-based hiding and hamburger menu
    │   ├── Navbar.css      # Header styles and mobile hamburger animation
    │   ├── RoomCard.jsx    # Room summary card with language badge, user count, and join action
    │   ├── RoomCard.css    # Room card styles and language-specific badge colors
    │   ├── UserList.jsx    # Active collaborators sidebar showing avatars, colors, and online indicators
    │   ├── UserList.css    # Collaborators list styling
    │   ├── ChatPanel.jsx   # Collapsible in-room chat with auto-scroll and send handlers
    │   ├── ChatPanel.css   # Chat bubble styling, timestamp layout, and message stream
    │   ├── OutputPanel.jsx # Collapsible terminal console with simulated execution output and clear button
    │   └── OutputPanel.css # Console terminal styles and running status pulse indicator
    └── pages/
        ├── Landing.jsx     # Landing page with hero section, CTAs, 4 feature cards, and footer
        ├── Landing.css     # Landing page styles and responsive features grid
        ├── Login.jsx       # Controlled sign-in card with validation and dashboard redirect
        ├── Login.css       # Login card layout and input error states
        ├── Signup.jsx      # Controlled user registration card with password match validation
        ├── Signup.css      # Signup card layout and input error states
        ├── Dashboard.jsx   # Active rooms list, skeleton loader, create/join room modals, and empty state
        ├── Dashboard.css   # Dashboard grid, modal dialogues, and skeleton shimmer animations
        ├── Room.jsx        # Full-screen IDE workspace combining Monaco, toolbar, chat, output, and drawers
        ├── Room.css        # Full-screen CSS Grid layout and mobile slide-over drawer styles
        ├── NotFound.jsx    # 404 error page with navigation back to Home
        └── NotFound.css    # 404 card styling and gradient header
```

---

## How to Demo (Click-Through Walkthrough)

Follow this step-by-step order to showcase all features during a presentation or viva:

1. **Step 1: Landing Page (`/`)**
   - Open `http://localhost:5173/`.
   - Point out the dark theme, sticky navbar, and hero section with gradient text.
   - Scroll down to show the **4 feature cards** (*Live Editing*, *Real-Time Chat*, *Multi-Language*, *Run Code*) and the footer.
   - Click the **"Get Started Free"** CTA button.

2. **Step 2: Signup Page (`/signup`)**
   - Click **"Create Account"** with empty fields $\rightarrow$ observe inline validation errors in red.
   - Enter mismatched passwords $\rightarrow$ observe the *"Passwords do not match"* message.
   - Fill in valid details and submit $\rightarrow$ observe automatic redirection to `/dashboard`.

3. **Step 3: Dashboard (`/dashboard`)**
   - Notice the **shimmer skeleton loader** that appears briefly before the room cards render.
   - Show the 3 existing mock rooms (*Python Algorithm Practice*, *JavaScript Playground*, *C++ Systems Lab*) with color-coded badges and online counts.
   - Click **"+ Create Room"**:
     - Enter a room name (e.g. `Data Structures Live`).
     - Choose `Python` from the language dropdown.
     - Click **"Launch Room"** $\rightarrow$ observe the new room card instantly prepended to the grid.
   - Click **"# Join with Code"**:
     - Type `room-101` and submit $\rightarrow$ navigates directly to `/room/room-101`.

4. **Step 4: Room Page Workspace (`/room/room-101`)**
   - **Full-Screen Layout**: Notice the global Navbar is hidden automatically to maximize screen space.
   - **Monaco Editor**: Point out the live syntax highlighting, line numbers, and initial starter code.
   - **Collaborators Sidebar**: Point out the left sidebar with 4 team members, colored initials, and green online presence dots.
   - **Language Switching**: Change the dropdown from `Python` to `JavaScript` $\rightarrow$ watch the editor instantly switch syntax and load the JavaScript starter template.
   - **Theme Toggle**: Click the **"☀️ Light"** / **"🌙 Dark"** button to toggle Monaco Editor theme.
   - **Copy Link**: Click **"🔗 Copy Link"** $\rightarrow$ observe the button switch to **"✓ Copied!"** for 2 seconds.

5. **Step 5: Chat & Code Execution**
   - **Live Chat**: Look at the right panel. Notice Alex Johnson's messages are aligned to the right in blue, while teammates' messages are on the left with colored names.
   - **Sending Messages**: Type *"Testing the two-sum logic"* in the chat input and hit `Enter` $\rightarrow$ message appends and smoothly auto-scrolls to the bottom.
   - **Run Simulation**: Click the green **"▶ Run"** button in the toolbar $\rightarrow$ the button displays `"⏳ Running..."` and the bottom terminal console shows a pulsing status indicator before displaying the simulated output.
   - **Collapsible Panels**:
     - Click **"Clear"** in the output console to reset the output.
     - Click **"▼ Collapse"** on the output console to collapse it to a slim bar.
     - Click `▶` in the chat header to collapse the chat into a slim vertical strip; click it again to expand.

6. **Step 6: Mobile Responsiveness (<768px)**
   - Open browser Developer Tools (`F12`) and toggle device toolbar (mobile mode).
   - In the Room workspace, observe the editor now occupies full screen width, with **"👥 Users"** and **"💬 Chat"** buttons in the toolbar.
   - Click **"👥 Users"** $\rightarrow$ the participants drawer slides smoothly in from the left. Tap the backdrop to close it.
   - Click **"💬 Chat"** $\rightarrow$ the discussion drawer slides in from the right. Tap `✕` to close it.

7. **Step 7: 404 Fallback Page**
   - Navigate to `http://localhost:5173/non-existent-page`.
   - Show the custom 404 card and click **"← Go Home"** to return to the landing page.

---

## Future Scope (Backend & Real-Time Sync)

- **Node.js & Express API**: Replace client-side mock data with persistent REST/GraphQL endpoints connected to MongoDB or PostgreSQL.
- **WebSocket Synchronization (Socket.IO & Yjs)**: Integrate **Yjs** with `y-websocket` and `y-monaco` to enable real-time, conflict-free multi-user code editing with shared cursors.
- **Authentication**: Secure JWT-based authentication and GitHub OAuth.
- **Isolated Code Execution**: Connect the Run button to a Dockerized sandbox environment or the Piston API to safely compile and execute user code in isolated containers.
- **Audio/Video Calls**: Add WebRTC peer-to-peer audio/video for pair programming interviews.
