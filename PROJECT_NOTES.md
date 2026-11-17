# Project Notes — Full-Stack MERN Collaborative Coding Platform

## 1. File Architecture & Directory Breakdown

```
coding_platform/
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic using Mongoose
│   ├── controllers/
│   │   ├── authController.js     # Signup, Login, and me route handlers
│   │   └── roomController.js     # Room CRUD, Join logic, and Room Messages
│   ├── middleware/
│   │   └── auth.js               # JWT verification Bearer token middleware
│   ├── models/
│   │   ├── Message.js            # Mongoose schema for chat messages
│   │   ├── Room.js               # Mongoose schema for rooms (with unique 6-char code)
│   │   └── User.js               # Mongoose schema for users with bcrypt password hashing
│   ├── routes/
│   │   ├── auth.js               # Express routing for /api/auth
│   │   └── rooms.js              # Express routing for /api/rooms
│   ├── .env                      # Environment secrets (PORT, MONGO_URI, JWT_SECRET)
│   ├── .env.example              # Template environment configuration
│   ├── package.json              # Server dependencies and runner scripts
│   ├── seed.js                   # Seed script populating demo users, rooms & messages
│   └── server.js                 # Express server entry point, CORS, and central error handler
├── src/
│   ├── api/
│   │   └── api.js                # Axios instance with VITE_API_URL and request interceptor for JWT
│   ├── components/
│   │   ├── ChatPanel.jsx         # Chat messages display and message posting
│   │   ├── Navbar.jsx            # Dynamic navigation displaying user state and logout
│   │   ├── OutputPanel.jsx       # Terminal output console for simulated executions
│   │   ├── ProtectedRoute.jsx    # Route guard redirecting unauthorized visitors to /login
│   │   ├── RoomCard.jsx          # Room item in dashboard with Owner delete capability
│   │   └── UserList.jsx          # Displays active room members
│   ├── context/
│   │   └── AuthContext.jsx       # Context API managing token, user state, login, and signup
│   ├── pages/
│   │   ├── Dashboard.jsx         # Loads user rooms, create room modal, join with code modal
│   │   ├── Landing.jsx           # Public landing page with CTA
│   │   ├── Login.jsx             # User login form communicating with /api/auth/login
│   │   ├── NotFound.jsx          # 404 page
│   │   ├── Room.jsx              # Code editor (Monaco), auto-save (debounced 2s), chat polling (3s)
│   │   └── Signup.jsx            # User registration communicating with /api/auth/signup
│   ├── App.jsx                   # React Router layout wrapping pages with AuthProvider & ProtectedRoutes
│   └── main.jsx                  # React DOM mount point
├── .env                          # Frontend environment variables (VITE_API_URL)
├── .env.example                  # Template frontend environment variables
├── api-tests.http                # HTTP request collection for testing endpoints directly
├── package.json                  # Root runner script running concurrently
└── README.md                     # Comprehensive project documentation
```

---

## 2. Full Request-Response Flow
```
[User Action in React UI]
           │
           ▼
[Axios Client (src/api/api.js)] ─── Interceptor adds Bearer JWT Header
           │
           ▼ (HTTP Request over Network)
[Express Server (server.js)] ──── Uses CORS & JSON body parser
           │
           ▼
[Express Route (routes/rooms.js)]
           │
           ▼
[Auth Middleware (middleware/auth.js)] ─── Decodes and verifies JWT
           │
           ▼
[Controller (controllers/roomController.js)] ─── Business logic & validation
           │
           ▼
[Mongoose Model (models/Room.js)] ─── Enforces schema and types
           │
           ▼
[MongoDB Database] ─── Executes query / stores document
           │
           ▼
[JSON Response returned to React UI & updates React State]
```

---

## 3. How JWT Authentication Works
1. **Signup/Login**: The client sends user credentials (`email`, `password`) to `/api/auth/login`.
2. **Verification & Hashing**: The controller verifies the credentials. `bcrypt.compare` checks the plaintext password against the hashed password in MongoDB.
3. **Token Generation**: Upon successful validation, `jwt.sign()` generates a signed JSON Web Token containing the user's ID and an expiration (`7d`).
4. **Client Storage**: The React client receives the token and saves it in `localStorage`.
5. **Protected API Calls**: For every subsequent request, the Axios request interceptor attaches the token to the header:
   `Authorization: Bearer <TOKEN>`
6. **Middleware Verification**: The `protect` middleware uses `jwt.verify(token, process.env.JWT_SECRET)` to authenticate the user and attach `req.user = { id: decoded.id }` to the request object.

---

## 4. 15 Viva Questions and Answers

### 1. What is REST and what makes an API RESTful?
**Answer**: REST (Representational State Transfer) is an architectural style for networked applications. A RESTful API uses standard HTTP methods (GET, POST, PUT, DELETE), stateless communication, and standard HTTP response status codes returning representations (typically JSON).

### 2. What are the key HTTP methods and their purposes?
**Answer**:
- `GET`: Retrieve data without causing side-effects.
- `POST`: Submit data to create a new resource.
- `PUT`: Replace or update an existing resource.
- `DELETE`: Remove a specified resource.

### 3. What is Express middleware and how does it work?
**Answer**: Middleware functions are functions that have access to the request object (`req`), response object (`res`), and the `next` function in the application’s request-response cycle. They can execute code, modify `req` and `res`, end the request, or call `next()` to pass control to the next handler.

### 4. What is a JWT (JSON Web Token) and why is it used?
**Answer**: A JWT is an open standard (RFC 7519) that defines a compact, self-contained way for securely transmitting information between parties as a JSON object. It is digitally signed, making it tamper-proof and allowing stateless authentication without storing sessions in the server memory.

### 5. Why should passwords never be stored in plain text? How does bcrypt help?
**Answer**: Storing plain text passwords exposes user credentials in the event of a database breach. Bcrypt is a cryptographic hash function that uses a salt (random data added to the password) and key stretching (work factor) to protect against rainbow table and brute-force attacks.

### 6. What is Mongoose and why do we use schemas in a NoSQL database?
**Answer**: Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. Although MongoDB is schema-less, Mongoose enforces structure, type checking, validation, and middleware (hooks) at the application level to ensure data integrity.

### 7. What is CORS and why is it needed?
**Answer**: CORS (Cross-Origin Resource Sharing) is a browser security mechanism that restricts cross-origin HTTP requests. When the frontend runs on port 5173 and backend on port 5000, CORS middleware in Express allows the frontend origin to safely communicate with the API.

### 8. What is the React Context API and when should it be used?
**Answer**: The Context API provides a way to pass data through the component tree without having to pass props down manually at every level (prop drilling). It is ideal for global state like authentication data, themes, or user preferences.

### 9. What is short polling and how does it differ from WebSockets?
**Answer**: Short polling repeatedly sends HTTP requests at a fixed time interval (e.g. every 3 seconds via `setInterval`) to check for updates. WebSockets establish an open, bidirectional, persistent TCP connection allowing real-time data push with minimal overhead. Polling is simpler to implement without special protocols.

### 10. What is debouncing and why is it used in the code editor?
**Answer**: Debouncing limits the rate at which a function is executed by delaying invocation until a certain amount of time (e.g., 2000ms) has passed since the last event. In the code editor, it avoids spamming the backend with HTTP PUT requests on every single keystroke.

### 11. SQL vs NoSQL: What is the primary difference?
**Answer**: SQL databases are relational, table-based, and have fixed schemas with ACID transactions (e.g., PostgreSQL, MySQL). NoSQL databases (like MongoDB) are document-oriented, flexible, store data in JSON-like structures (BSON), and scale horizontally more easily.

### 12. What does `app.use(express.json())` do in Express?
**Answer**: It is a built-in middleware function in Express that parses incoming requests with JSON payloads and populates `req.body` with the parsed JavaScript object.

### 13. What is the difference between client-side routing and server-side routing?
**Answer**: Server-side routing causes the browser to request a whole new HTML page from the server on navigation. Client-side routing (via React Router) intercepts link clicks, updates the browser URL with the HTML5 History API, and dynamically swaps React components without refreshing the page.

### 14. How does central error handling work in Express?
**Answer**: Central error handling is achieved with a middleware function that takes four arguments: `(err, req, res, next)`. When an error is passed to `next(err)`, Express skips all remaining normal middlewares and passes control directly to this error handler to return a standardized error response.

### 15. What are React Protected Routes and how do they guard access?
**Answer**: A Protected Route checks authentication state (e.g., the presence of a valid JWT in Context or localStorage). If authenticated, it renders child routes via `<Outlet />`; otherwise, it redirects the visitor to the login page using `<Navigate to="/login" replace />`.

### 16. How does the in-browser JavaScript execution sandbox work?
**Answer**: The client renders an isolated `<iframe>` with `sandbox="allow-scripts"`. The user's code is wrapped in a script that overrides `console.log`, `console.warn`, and `console.error` to intercept console arguments. These formatted strings are dispatched back to the parent React application using `window.parent.postMessage()`. To prevent infinite loops (like `while(true){}`), a 5-second timer kills the iframe's `srcdoc` if execution does not finish in time. Other languages like Python and C++ display a simulated execution notice.
