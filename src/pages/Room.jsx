// Room Page (Part 3 Polish): Full collaborative coding environment
// Includes responsive slide-over drawers for participants and chat on mobile (<768px),
// Monaco editor, output console, and lifted state management.
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import {
  rooms as initialRooms,
  users as mockUsers,
  messages as initialMessages
} from '../data/mockData';

// Subcomponents
import UserList from '../components/UserList';
import ChatPanel from '../components/ChatPanel';
import OutputPanel from '../components/OutputPanel';
import './Room.css';

// Starter templates for code editor
const STARTER_CODES = {
  javascript: `// JavaScript Collaborative Environment
function greet(name) {
  return \`Hello, \${name}! Welcome to CollabCode.\`;
}

console.log(greet("Developer"));
`,
  python: `# Python Collaborative Environment
def greet(name):
    return f"Hello, {name}! Welcome to CollabCode."

print(greet("Developer"))
`,
  cpp: `// C++ Collaborative Environment
#include <iostream>
#include <string>

int main() {
    std::string name = "Developer";
    std::cout << "Hello, " << name << "! Welcome to CollabCode." << std::endl;
    return 0;
}
`
};

export default function Room() {
  // 1. URL Route parameter
  const { id } = useParams();

  // Find matching room details from mockData (if any)
  const currentRoom = initialRooms.find((r) => r.id === id);

  // 2. Lifted State Management
  // Code editor content
  const [code, setCode] = useState(
    currentRoom ? currentRoom.code : STARTER_CODES.javascript
  );

  // Active programming language
  const [language, setLanguage] = useState(
    currentRoom ? currentRoom.language : 'javascript'
  );

  // Monaco Editor theme ('vs-dark' or 'light')
  const [editorTheme, setEditorTheme] = useState('vs-dark');

  // Clipboard copy state feedback
  const [isCopied, setIsCopied] = useState(false);

  // Output terminal execution state
  const [output, setOutput] = useState(
    'Console initialized. Click "▶ Run" to execute code.'
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isOutputCollapsed, setIsOutputCollapsed] = useState(false);

  // Chat panel state
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [messages, setMessages] = useState(() => {
    const roomMsgs = initialMessages.filter((m) => m.roomId === id);
    return roomMsgs.length > 0 ? roomMsgs : initialMessages;
  });

  // Mobile drawer states (< 768px)
  const [isUsersDrawerOpen, setIsUsersDrawerOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);

  // Current user representation for own messages
  const currentUser = { id: 'u1', name: 'Alex Johnson', color: '#3b82f6' };

  // 3. Handlers
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(STARTER_CODES[newLang] || '// Start typing...');
  };

  const toggleEditorTheme = () => {
    setEditorTheme((prev) => (prev === 'vs-dark' ? 'light' : 'vs-dark'));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleRunCode = () => {
    if (isRunning) return;

    if (isOutputCollapsed) {
      setIsOutputCollapsed(false);
    }

    setIsRunning(true);
    setOutput('Compiling and executing...');

    setTimeout(() => {
      setIsRunning(false);

      if (language === 'python') {
        setOutput('Hello, Developer! Welcome to CollabCode.\n\n[Process completed successfully in 120ms with exit code 0]');
      } else if (language === 'cpp') {
        setOutput('Hello, Developer! Welcome to CollabCode.\n\n[Binary built and executed in 45ms with exit code 0]');
      } else {
        setOutput('Hello, Developer! Welcome to CollabCode.\n\n[Process exited with status 0 in 75ms]');
      }
    }, 1000);
  };

  const handleClearOutput = () => {
    setOutput('');
  };

  const handleSendMessage = (text) => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    const newMessage = {
      id: `msg-${Date.now()}`,
      roomId: id,
      userId: currentUser.id,
      userName: currentUser.name,
      userColor: currentUser.color,
      text: text,
      timestamp: formattedTime
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  const closeMobileDrawers = () => {
    setIsUsersDrawerOpen(false);
    setIsChatDrawerOpen(false);
  };

  const displayName = currentRoom ? currentRoom.name : `Room ${id}`;

  return (
    <div
      className={`room-layout ${!isChatOpen ? 'chat-collapsed' : ''} ${
        isOutputCollapsed ? 'output-collapsed' : ''
      }`}
    >
      {/* 1. Top Toolbar */}
      <header className="room-toolbar">
        <div className="toolbar-left">
          <Link to="/dashboard" className="toolbar-back-link" title="Return to Dashboard">
            ← Dashboard
          </Link>

          <div className="toolbar-room-title">
            <h1 title={displayName}>{displayName}</h1>
            <span className="toolbar-room-id">#{id}</span>
          </div>
        </div>

        <div className="toolbar-controls">
          {/* Mobile Drawer Trigger Buttons (visible only <768px) */}
          <button
            type="button"
            className="btn btn-outline toolbar-btn mobile-drawer-btn"
            onClick={() => {
              setIsUsersDrawerOpen(true);
              setIsChatDrawerOpen(false);
            }}
            title="Open Participants"
          >
            👥 Users
          </button>

          <button
            type="button"
            className="btn btn-outline toolbar-btn mobile-drawer-btn"
            onClick={() => {
              setIsChatDrawerOpen(true);
              setIsUsersDrawerOpen(false);
            }}
            title="Open Chat"
          >
            💬 Chat
          </button>

          {/* Language Selector */}
          <select
            className="toolbar-select"
            value={language}
            onChange={handleLanguageChange}
            aria-label="Select programming language"
          >
            <option value="javascript">JS</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>

          {/* Theme Toggle */}
          <button
            type="button"
            className="btn btn-outline toolbar-btn"
            onClick={toggleEditorTheme}
            title="Toggle Editor Theme"
          >
            {editorTheme === 'vs-dark' ? '☀️' : '🌙'}
          </button>

          {/* Copy Link */}
          <button
            type="button"
            className={`btn btn-outline toolbar-btn ${isCopied ? 'copy-success-badge' : ''}`}
            onClick={handleCopyLink}
            title="Copy Link"
          >
            {isCopied ? '✓' : '🔗'}
          </button>

          {/* Run Code */}
          <button
            type="button"
            className="btn toolbar-btn toolbar-run-btn"
            onClick={handleRunCode}
            disabled={isRunning}
          >
            {isRunning ? '...' : '▶ Run'}
          </button>
        </div>
      </header>

      {/* 2. Left Sidebar: Active Collaborators (Slide-over drawer on mobile) */}
      <aside
        className={`room-sidebar-area ${isUsersDrawerOpen ? 'drawer-open' : ''}`}
      >
        <div className="drawer-mobile-header">
          <span>👥 Collaborators</span>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={() => setIsUsersDrawerOpen(false)}
            aria-label="Close participants drawer"
          >
            ×
          </button>
        </div>
        <UserList users={mockUsers} />
      </aside>

      {/* 3. Center: Monaco Editor */}
      <main className="room-editor-area">
        <Editor
          height="100%"
          language={language === 'cpp' ? 'cpp' : language}
          theme={editorTheme}
          value={code}
          onChange={(newVal) => setCode(newVal || '')}
          options={{
            fontSize: 14,
            fontFamily: "'Fira Code', 'Courier New', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            lineNumbers: 'on',
            renderWhitespace: 'selection'
          }}
        />
      </main>

      {/* 4. Bottom: Output Console Panel */}
      <section className="room-output-area">
        <OutputPanel
          output={output}
          isRunning={isRunning}
          onClear={handleClearOutput}
          isCollapsed={isOutputCollapsed}
          onToggleCollapse={() => setIsOutputCollapsed((prev) => !prev)}
        />
      </section>

      {/* 5. Right: Chat Panel (Slide-over drawer on mobile) */}
      <aside
        className={`room-chat-area ${isChatDrawerOpen ? 'drawer-open' : ''}`}
      >
        <div className="drawer-mobile-header">
          <span>💬 Live Discussion</span>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={() => setIsChatDrawerOpen(false)}
            aria-label="Close chat drawer"
          >
            ×
          </button>
        </div>
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          currentUserId={currentUser.id}
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen((prev) => !prev)}
        />
      </aside>

      {/* Mobile Drawer Backdrop Overlay */}
      {(isUsersDrawerOpen || isChatDrawerOpen) && (
        <div
          className="drawer-backdrop"
          onClick={closeMobileDrawers}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
