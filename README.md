# Collaborative Coding Platform (Full-Stack MERN)

CollabCode is an interactive in-browser collaborative coding platform built using the complete **MERN Stack** (MongoDB, Express.js, ReactJS, Node.js). It provides real-time workspace rooms, syntax-highlighted code editing, debounced auto-saving, synchronized chat discussions, room join codes, and JWT-authenticated session security.

---

## 🌟 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 (Vite) |
| **Routing & State** | React Router v7, React Context API |
| **Code Editor** | Monaco Editor (`@monaco-editor/react`) |
| **HTTP Client** | Axios (with Request Interceptor for JWT) |
| **Backend Runtime** | Node.js |
| **Web Framework** | Express.js |
| **Database** | MongoDB (Local / Atlas) via Mongoose ODM |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`) & `bcryptjs` |
| **Concurrent Runner** | `concurrently` (dev workflow) |

---

## 🚀 Key Features

1. **Authentication & Authorization**:
   - Secure registration and login with bcrypt password hashing.
   - Stateless JWT authentication sent via `Authorization: Bearer <token>`.
   - Protected client-side routes redirecting unauthenticated users to `/login`.
2. **Dashboard & Room Management**:
   - Real-time room list fetched directly from MongoDB for the active user.
   - Create room with language starter templates (JavaScript, Python, C++).
   - Join room instantly using a 6-character unique alphanumeric code.
   - Room deletion reserved strictly for room owners.
3. **Editor Workspace**:
   - Integrated full-screen Monaco Editor.
   - **Real In-Browser JavaScript Execution**: Clicking **▶ Run** executes JavaScript code in a sandboxed iframe (`sandbox="allow-scripts"`), capturing `console.log`, `console.warn`, and `console.error` via `postMessage` with an automatic 5-second infinite-loop timeout protection.
   - **Simulated Execution for Python & C++**: Displays output with `"Execution for this language is simulated."`
   - **Debounced auto-save (2 seconds)**: Updates code in MongoDB upon typing pauses without spamming the API.
   - Manual **Save** button for immediate persistence.
   - **Polling synchronization (3 seconds)**: Synchronizes room code and chat messages between multiple users.
4. **Room Chat & Members**:
   - Live room discussion with timestamps and user identification.
   - Collaborators sidebar dynamically reflecting joined participants.

---

## 🛠️ Step-by-Step Setup & Running

### 1. Prerequisites
- **Node.js** (v18+ or v20+)
- **MongoDB** running locally on port 27017 or a MongoDB Atlas connection string.

### 2. Environment Variables
Frontend `.env` (located at project root):
```env
VITE_API_URL=http://localhost:5000/api
```

Backend `.env` (located in `server/.env`):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/coding_platform
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=7d
```

### 3. Install Dependencies
From the project root:
```bash
# Install frontend & root dependencies
npm install

# Install backend dependencies
npm install --prefix server
```

### 4. Seed Database with Demo Data
To insert 2 demo users, 2 rooms, and demo chat messages:
```bash
npm run seed
```
Demo accounts:
- **Email**: `alex@example.com` | **Password**: `password123`
- **Email**: `priya@example.com` | **Password**: `password123`

### 5. Start the Application
Run both frontend and backend concurrently with a single command:
```bash
npm run dev
```

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`

---

## 📡 RESTful API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/health` | Health status check | No |
| `POST` | `/api/auth/signup` | Register a new user | No |
| `POST` | `/api/auth/login` | Login user & return JWT | No |
| `GET` | `/api/auth/me` | Fetch active user profile | Yes |
| `GET` | `/api/rooms` | Get rooms for logged-in user | Yes |
| `POST` | `/api/rooms` | Create a new coding room | Yes |
| `GET` | `/api/rooms/:id` | Get room details by MongoDB ID | Yes |
| `PUT` | `/api/rooms/:id` | Update code, name, or language | Yes |
| `DELETE` | `/api/rooms/:id` | Delete room (Owner only) | Yes |
| `POST` | `/api/rooms/join` | Join room via 6-character roomCode | Yes |
| `GET` | `/api/rooms/:id/messages`| Fetch chat messages of room | Yes |
| `POST` | `/api/rooms/:id/messages`| Post a message to room chat | Yes |

---

## 🎯 Demo Walkthrough (Viva / Presentation)

1. **Sign Up / Login**:
   - Navigate to `http://localhost:5173/login`.
   - Enter `alex@example.com` and `password123`.
   - Notice the JWT saved to `localStorage` and dynamic Navbar greeting ("Hi, Alex Johnson").
2. **Dashboard**:
   - Observe real MongoDB rooms loaded dynamically.
   - Click **+ Create Room** to launch a new room with a unique 6-character code.
3. **Editor & Auto-save**:
   - Open any room.
   - Modify the code in the Monaco Editor. Notice the header displays `"Saving..."` and then `"Saved"` after 2 seconds.
4. **Chat & Polling**:
   - Send messages in the chat panel. Messages are stored in MongoDB.
   - Open an incognito window, log in as `priya@example.com`, join the room using the room code, and observe messages updating every 3 seconds.
5. **Delete Room**:
   - Return to the dashboard and test deleting a room you own using the trash can button.
