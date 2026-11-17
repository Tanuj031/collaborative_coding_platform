// seed.js – Seed database with realistic developer users, rooms, and conversations
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');

const connectDB = require('./config/db');
const User = require('./models/User');
const Room = require('./models/Room');
const Message = require('./models/Message');

const seed = async () => {
  await connectDB();

  // Clear existing collections
  await Promise.all([User.deleteMany({}), Room.deleteMany({}), Message.deleteMany({})]);

  // 1. Create Demo Users (password for all demo users: Demo@123)
  // Password will be automatically hashed once by the User model's pre-save hook
  const usersData = [
    { name: 'Alex Johnson', email: 'alex@example.com', password: 'Demo@123' },
    { name: 'Priya Sharma', email: 'priya@example.com', password: 'Demo@123' },
    { name: 'Rohan Mehta', email: 'rohan@example.com', password: 'Demo@123' },
    { name: 'Sneha Kulkarni', email: 'sneha@example.com', password: 'Demo@123' },
    { name: 'Arjun Nair', email: 'arjun@example.com', password: 'Demo@123' },
    { name: 'Meera Iyer', email: 'meera@example.com', password: 'Demo@123' },
  ];

  const createdUsers = {};
  for (const u of usersData) {
    const userDoc = await User.create({ name: u.name, email: u.email, password: u.password });
    createdUsers[u.email] = userDoc;
  }

  const alex = createdUsers['alex@example.com'];
  const priya = createdUsers['priya@example.com'];
  const rohan = createdUsers['rohan@example.com'];
  const sneha = createdUsers['sneha@example.com'];
  const arjun = createdUsers['arjun@example.com'];
  const meera = createdUsers['meera@example.com'];

  // Helper for generating unique 6-char alphanumeric room codes
  const usedCodes = new Set();
  const genCode = (prefix = '') => {
    let code = '';
    do {
      code = (prefix + Math.random().toString(36).substring(2, 8)).substring(0, 6).toUpperCase();
    } while (usedCodes.has(code) || code.length !== 6);
    usedCodes.add(code);
    return code;
  };

  // 2. Define Rooms with realistic starter code
  const roomsData = [
    // Existing Python Room
    {
      name: 'Algorithm Practice - Python',
      language: 'python',
      roomCode: 'PYTH01',
      owner: alex._id,
      members: [alex._id, priya._id, arjun._id],
      code: `# Algorithm Practice - Python
# Two Sum Problem (O(n) single-pass hash map solution)

def two_sum(nums, target):
    """
    Find two numbers in the list that sum to target.
    Returns their 0-based indices.
    """
    lookup = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in lookup:
            return [lookup[complement], i]
        lookup[num] = i
    return []

# Test execution
nums = [2, 7, 11, 15]
target = 9
indices = two_sum(nums, target)
print(f"Target: {target}")
print(f"Indices: {indices}")
print(f"Values: {nums[indices[0]]} + {nums[indices[1]]} = {target}")
`
    },

    // 1. JS Fundamentals
    {
      name: 'JS Fundamentals',
      language: 'javascript',
      roomCode: 'JSFUND',
      owner: rohan._id,
      members: [rohan._id, sneha._id, arjun._id],
      code: `// JS Fundamentals: Closures, Counter Factory & Array Methods

// 1. Closure: Counter Factory encapsulating private state
function createCounter(initialValue = 0) {
  let count = initialValue; // Private variable enclosed in closure

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
    reset: () => {
      count = initialValue;
      return count;
    }
  };
}

const counterA = createCounter(10);
console.log("Counter A (+1):", counterA.increment()); // 11
console.log("Counter A (+1):", counterA.increment()); // 12
console.log("Counter A (-1):", counterA.decrement()); // 11

// 2. Array Methods: map, filter, reduce
const developers = [
  { name: "Rohan", yearsExp: 4, role: "Fullstack" },
  { name: "Sneha", yearsExp: 6, role: "Frontend" },
  { name: "Arjun", yearsExp: 2, role: "Junior Dev" },
  { name: "Meera", yearsExp: 5, role: "Backend" }
];

// Map: Extract formatted names
const summaries = developers.map(dev => \`\${dev.name} (\${dev.role})\`);
console.log("Team summaries:", summaries);

// Filter: Developers with >= 4 years experience
const seniorDevs = developers.filter(dev => dev.yearsExp >= 4);
console.log("Senior devs count:", seniorDevs.length);

// Reduce: Calculate total team experience
const totalExperience = developers.reduce((acc, dev) => acc + dev.yearsExp, 0);
console.log("Total team experience:", totalExperience, "years");
`
    },

    // 2. Async JavaScript Lab
    {
      name: 'Async JavaScript Lab',
      language: 'javascript',
      roomCode: 'ASYNC1',
      owner: sneha._id,
      members: [sneha._id, rohan._id, meera._id],
      code: `// Async JavaScript Lab: Promises, Async/Await & Error Handling

// Helper utility: promisified sleep timer
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Simulated async network request returning a Promise
function fetchUserProfile(userId) {
  return new Promise((resolve, reject) => {
    if (!userId) {
      reject(new Error("User ID is required"));
      return;
    }
    setTimeout(() => {
      resolve({
        id: userId,
        name: "Sneha Kulkarni",
        repositories: ["react-dashboard", "collab-code", "node-service"],
        status: "active"
      });
    }, 400);
  });
}

// Asynchronous workflow using async/await with try/catch
async function runDashboard() {
  console.log("Starting async data retrieval...");
  try {
    await sleep(250); // Simulate network latency
    const user = await fetchUserProfile("usr_771");
    console.log(\`Fetched user: \${user.name}\`);
    console.log(\`Public Repos: \${user.repositories.join(", ")}\`);
    return user;
  } catch (error) {
    console.error("Network request failed:", error.message);
  } finally {
    console.log("Async request lifecycle finished.");
  }
}

runDashboard();
`
    },

    // 3. Debounce & Throttle
    {
      name: 'Debounce & Throttle',
      language: 'javascript',
      roomCode: 'DBTH01',
      owner: arjun._id,
      members: [arjun._id, sneha._id, alex._id, priya._id],
      code: `// Debounce & Throttle Implementations with Practical Examples

/**
 * Debounce: Delays execution until 'delay' ms have passed
 * since the last invocation. Ideal for search inputs & auto-save.
 */
function debounce(fn, delay = 300) {
  let timerId = null;
  return function (...args) {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
      timerId = null;
    }, delay);
  };
}

/**
 * Throttle: Guarantees 'fn' runs at most once per 'limit' ms.
 * Ideal for scroll listeners, resize events, and game loops.
 */
function throttle(fn, limit = 300) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Usage examples
const handleSearch = debounce((query) => {
  console.log(\`[DEBOUNCE] API request dispatched for query: "\${query}"\`);
}, 300);

const handleScroll = throttle((scrollY) => {
  console.log(\`[THROTTLE] Scroll position updated to: \${scrollY}px\`);
}, 200);

// Simulated rapid calls
handleSearch("React");
handleSearch("React H");
handleSearch("React Hooks"); // Only this final call executes after 300ms

handleScroll(50);  // Fires immediately
handleScroll(120); // Dropped (throttled)
`
    },

    // 4. React Hooks Practice
    {
      name: 'React Hooks Practice',
      language: 'javascript',
      roomCode: 'RHOOKS',
      owner: meera._id,
      members: [meera._id, rohan._id, priya._id],
      code: `// React Hooks Practice: Custom useLocalStorage & Counter Component
// (Simulated standalone implementation of custom Hook patterns)

// Custom Hook pattern: Sync state to window.localStorage
function useLocalStorage(key, initialValue) {
  const readValue = () => {
    try {
      const item = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      return item ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.warn(\`Error reading key "\${key}":\`, err);
      return initialValue;
    }
  };

  let storedValue = readValue();

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      storedValue = valueToStore;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
      console.log(\`[useLocalStorage] Stored "\${key}":\`, valueToStore);
    } catch (err) {
      console.error(\`Error persisting key "\${key}":\`, err);
    }
  };

  return [storedValue, setValue];
}

// Simulated Counter component utilizing custom hook
function CounterDemo() {
  const [count, setCount] = useLocalStorage("app_counter", 0);
  console.log("Current persistent count:", count);

  // Simulate increment action with functional updater
  setCount((prev) => (typeof prev === "number" ? prev + 1 : 1));
}

CounterDemo();
`
    },

    // 5. Node.js REST API
    {
      name: 'Node.js REST API',
      language: 'javascript',
      roomCode: 'EXPRES',
      owner: alex._id,
      members: [alex._id, rohan._id, meera._id, arjun._id],
      code: `// Node.js REST API: Minimal In-Memory Express Controller Simulation

// In-memory data store
const usersDB = [
  { id: 1, name: "Rohan Mehta", email: "rohan@example.com", role: "developer" },
  { id: 2, name: "Sneha Kulkarni", email: "sneha@example.com", role: "admin" }
];

// GET /api/users handler
function getUsers(req, res) {
  console.log("GET /api/users - Returning user list");
  return { status: 200, data: usersDB };
}

// POST /api/users handler with input validation
function createUser(req, res) {
  const { name, email, role = "member" } = req.body || {};

  if (!name || !email) {
    return { status: 400, error: "Validation Error: 'name' and 'email' are required." };
  }

  const newUser = {
    id: usersDB.length + 1,
    name,
    email,
    role,
    createdAt: new Date().toISOString()
  };

  usersDB.push(newUser);
  console.log(\`POST /api/users - Created user #\${newUser.id}: \${newUser.name}\`);
  return { status: 201, data: newUser };
}

// Test pipeline
console.log("1. Initial Users:", getUsers());
console.log("2. Create Arjun:", createUser({ body: { name: "Arjun Nair", email: "arjun@example.com" } }));
console.log("3. Total Users Now:", usersDB.length);
`
    },

    // 6. DOM Manipulation
    {
      name: 'DOM Manipulation',
      language: 'javascript',
      roomCode: 'DOMM01',
      owner: priya._id,
      members: [priya._id, sneha._id, arjun._id],
      code: `// DOM Manipulation: Vanilla JS Dynamic Task Manager

function initTodoApp(mountSelector = "#app") {
  const root = document.querySelector(mountSelector) || document.body;

  // 1. Build structure using createElement
  const card = document.createElement("div");
  card.className = "todo-container";

  const heading = document.createElement("h3");
  heading.textContent = "Interactive Task List";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Add a new task...";

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Add Task";

  const ul = document.createElement("ul");
  ul.className = "todo-list";

  // 2. Event listener for task addition
  const onAddTask = () => {
    const text = input.value.trim();
    if (!text) return;

    const li = document.createElement("li");
    li.textContent = text;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✕";
    deleteBtn.addEventListener("click", () => li.remove());

    li.appendChild(deleteBtn);
    ul.appendChild(li);
    input.value = "";
  };

  submitBtn.addEventListener("click", onAddTask);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") onAddTask();
  });

  card.append(heading, input, submitBtn, ul);
  root.appendChild(card);
  console.log("Todo App successfully mounted to DOM.");
}

if (typeof document !== "undefined") {
  initTodoApp();
}
`
    }
  ];

  const createdRooms = [];
  for (const r of roomsData) {
    const roomDoc = await Room.create(r);
    createdRooms.push(roomDoc);
  }

  // 3. Create Chat Messages with natural developer discussions
  // Timestamps spread across the last 2 days (48 hours)
  const now = Date.now();
  const hoursAgo = (h) => new Date(now - h * 3600 * 1000);

  const messagesByRoom = [
    // Room 0: Algorithm Practice - Python
    {
      room: createdRooms[0]._id,
      messages: [
        { sender: alex._id, text: "Welcome to the Python room! Let's solve Two Sum efficiently.", time: hoursAgo(46) },
        { sender: priya._id, text: "Hey Alex! Should we start with the brute force or go straight to hash map?", time: hoursAgo(42) },
        { sender: arjun._id, text: "Definitely single-pass hash map for O(n) runtime and O(n) space.", time: hoursAgo(38) },
        { sender: alex._id, text: "Agreed. Check if complement is in lookup before inserting current index.", time: hoursAgo(30) },
        { sender: priya._id, text: "Tested with duplicates and negative values, all test cases pass.", time: hoursAgo(24) },
        { sender: arjun._id, text: "Execution time is around 32ms. Super fast.", time: hoursAgo(16) },
        { sender: priya._id, text: "Clean and readable code. We can move to 3Sum next.", time: hoursAgo(8) },
        { sender: alex._id, text: "Thanks team, saving this solution to our study repo.", time: hoursAgo(2) },
      ]
    },

    // Room 1: JS Fundamentals
    {
      room: createdRooms[1]._id,
      messages: [
        { sender: rohan._id, text: "Hey team! Setting up closures. Quick question: what's the core difference between closures and scope?", time: hoursAgo(47) },
        { sender: sneha._id, text: "Lexical scope is the accessibility of variables at write time; a closure is the function retaining access to that scope even after outer returns.", time: hoursAgo(44) },
        { sender: arjun._id, text: "Notice how createCounter encapsulates count. External code cannot mutate it directly.", time: hoursAgo(36) },
        { sender: rohan._id, text: "Should we use a for loop or reduce to calculate the total years of experience?", time: hoursAgo(28) },
        { sender: sneha._id, text: "Suggesting reduce instead of a for loop here, it makes the aggregation much more declarative.", time: hoursAgo(22) },
        { sender: arjun._id, text: "Remember to pass 0 as the initial accumulator value, otherwise the first object is used as acc.", time: hoursAgo(15) },
        { sender: sneha._id, text: "Code review: looks very clean. Map, filter, and reduce are all clearly showcased.", time: hoursAgo(7) },
        { sender: rohan._id, text: "Updated and ran the code. Output is 17 years. Thanks for the review!", time: hoursAgo(1) },
      ]
    },

    // Room 2: Async JavaScript Lab
    {
      room: createdRooms[2]._id,
      messages: [
        { sender: sneha._id, text: "Working on runDashboard(). Having an issue where user profile returns undefined.", time: hoursAgo(45) },
        { sender: meera._id, text: "Found a bug with a missing await in front of fetchUserProfile('usr_771').", time: hoursAgo(40) },
        { sender: sneha._id, text: "Ah good catch! It was logging the pending Promise object instead of resolved data.", time: hoursAgo(34) },
        { sender: rohan._id, text: "Added the sleep helper using Promise with setTimeout to simulate 250ms network latency.", time: hoursAgo(26) },
        { sender: meera._id, text: "Make sure everything is wrapped in try/catch so network rejections don't crash the thread.", time: hoursAgo(18) },
        { sender: rohan._id, text: "Does the finally block execute even if catch throws or returns early?", time: hoursAgo(12) },
        { sender: sneha._id, text: "Yes! finally always executes. Great for resetting loading spinners.", time: hoursAgo(5) },
        { sender: meera._id, text: "Console output verified: profile and repos logged in exact sequence.", time: hoursAgo(1) },
      ]
    },

    // Room 3: Debounce & Throttle
    {
      room: createdRooms[3]._id,
      messages: [
        { sender: arjun._id, text: "Why is my debounce firing twice on search input?", time: hoursAgo(44) },
        { sender: alex._id, text: "Check if you are creating a new debounced function inside every render instead of caching it.", time: hoursAgo(39) },
        { sender: sneha._id, text: "Also ensure clearTimeout is called before storing the new timerId in the closure.", time: hoursAgo(32) },
        { sender: arjun._id, text: "That was it! Storing timerId in the outer closure solved the double trigger.", time: hoursAgo(25) },
        { sender: priya._id, text: "For throttle, is leading edge execution better than trailing edge?", time: hoursAgo(19) },
        { sender: alex._id, text: "Leading edge feels much more immediate for scroll events and button clicks.", time: hoursAgo(13) },
        { sender: sneha._id, text: "Added ...args spread forwarding so DOM synthetic events are preserved.", time: hoursAgo(6) },
        { sender: arjun._id, text: "Both utilities tested with simulated events. Thanks everyone for the fixes!", time: hoursAgo(2) },
      ]
    },

    // Room 4: React Hooks Practice
    {
      room: createdRooms[4]._id,
      messages: [
        { sender: meera._id, text: "Building the custom useLocalStorage hook. Any pitfalls with JSON.parse?", time: hoursAgo(43) },
        { sender: rohan._id, text: "If the stored key has invalid JSON or was stored as plain string, it throws. Wrap in try/catch.", time: hoursAgo(37) },
        { sender: priya._id, text: "Also guard with typeof window !== 'undefined' so it doesn't break in SSR.", time: hoursAgo(31) },
        { sender: meera._id, text: "Added the window guard and fallback value. Works without errors now.", time: hoursAgo(23) },
        { sender: rohan._id, text: "Does setValue support functional updates like setCount(prev => prev + 1)?", time: hoursAgo(17) },
        { sender: meera._id, text: "Yes! Added value instanceof Function check in setValue.", time: hoursAgo(10) },
        { sender: priya._id, text: "Tested CounterDemo. State persists across page reloads in localStorage.", time: hoursAgo(4) },
        { sender: rohan._id, text: "Great implementation. Very clean custom hook pattern.", time: hoursAgo(1) },
      ]
    },

    // Room 5: Node.js REST API
    {
      room: createdRooms[5]._id,
      messages: [
        { sender: alex._id, text: "Drafting minimal Express REST controllers with in-memory usersDB array.", time: hoursAgo(45) },
        { sender: rohan._id, text: "Make sure POST /api/users validates that both name and email are present.", time: hoursAgo(38) },
        { sender: meera._id, text: "Added 400 Bad Request if req.body is missing required fields.", time: hoursAgo(30) },
        { sender: arjun._id, text: "Are we returning 201 Created for the POST response status code?", time: hoursAgo(22) },
        { sender: alex._id, text: "Yes, 201 for resource creation, and 200 for GET requests. Follows REST conventions.", time: hoursAgo(16) },
        { sender: rohan._id, text: "Tested invalid payload; returns validation error message in JSON properly.", time: hoursAgo(9) },
        { sender: meera._id, text: "Array push and auto-incrementing ID working smoothly.", time: hoursAgo(3) },
        { sender: alex._id, text: "Solid setup. Easy to migrate to Mongoose models whenever needed.", time: hoursAgo(1) },
      ]
    },

    // Room 6: DOM Manipulation
    {
      room: createdRooms[6]._id,
      messages: [
        { sender: priya._id, text: "Starting the vanilla JS Todo List using createElement and event listeners.", time: hoursAgo(46) },
        { sender: sneha._id, text: "Attach the delete event listener to each li item right when creating it.", time: hoursAgo(39) },
        { sender: arjun._id, text: "Added keydown listener on the text input so pressing Enter adds the task.", time: hoursAgo(33) },
        { sender: priya._id, text: "Input wasn't clearing after click; added input.value = '' after append.", time: hoursAgo(24) },
        { sender: sneha._id, text: "Notice we don't need e.preventDefault() because it's not inside a form tag.", time: hoursAgo(17) },
        { sender: arjun._id, text: "Good observation. No accidental page refresh can happen.", time: hoursAgo(11) },
        { sender: priya._id, text: "Tested adding and removing tasks. DOM elements clean up cleanly.", time: hoursAgo(5) },
        { sender: sneha._id, text: "Awesome teamwork! Ready for demo.", time: hoursAgo(1) },
      ]
    }
  ];

  for (const group of messagesByRoom) {
    for (const msg of group.messages) {
      await Message.create({
        room: group.room,
        sender: msg.sender,
        text: msg.text,
        createdAt: msg.time
      });
    }
  }

  console.log('🚀 Seed data inserted successfully!');
  console.log(`Users created: ${usersData.length}`);
  console.log(`Rooms created: ${roomsData.length}`);
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
