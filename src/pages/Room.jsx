// Room Page: Real-time collaborative coding environment with sandboxed JS execution, polling and debounced auto-save
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

// Subcomponents
import UserList from '../components/UserList';
import ChatPanel from '../components/ChatPanel';
import OutputPanel from '../components/OutputPanel';
import './Room.css';

const STARTER_CODES = {
  javascript: `// JavaScript Collaborative Environment\nfunction greet(name) {\n  return \`Hello, \${name}! Welcome to CollabCode.\`;\n}\n\nconsole.log(greet("Developer"));\n`,
  python: `# Python Collaborative Environment\ndef greet(name):\n    return f"Hello, {name}! Welcome to CollabCode."\n\nprint(greet("Developer"))\n`,
  cpp: `// C++ Collaborative Environment\n#include <iostream>\n#include <string>\n\nint main() {\n    std::string name = "Developer";\n    std::cout << "Hello, " << name << "! Welcome to CollabCode." << std::endl;\n    return 0;\n}\n`
};

// Generates the sandboxed iframe HTML document
const createSandboxHtml = (userCode) => {
  const safeCode = userCode.replace(/<\/script>/gi, '<\\/script>');
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body>
  <div id="app"></div>
  <script>
  (function() {
    function serializeArg(arg) {
      if (arg === null) return 'null';
      if (arg === undefined) return 'undefined';
      if (typeof arg === 'function') return '[Function: ' + (arg.name || 'anonymous') + ']';
      if (typeof arg === 'symbol') return arg.toString();
      if (arg instanceof Error) return arg.stack || arg.toString();
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch (e) {
          return Object.prototype.toString.call(arg);
        }
      }
      return String(arg);
    }

    function dispatchConsole(type, args) {
      try {
        var formatted = Array.prototype.slice.call(args).map(serializeArg).join(' ');
        window.parent.postMessage({
          source: 'collabcode-sandbox',
          type: type,
          text: formatted
        }, '*');
      } catch (err) {}
    }

    // Override standard console methods
    console.log = function() { dispatchConsole('log', arguments); };
    console.warn = function() { dispatchConsole('warn', arguments); };
    console.error = function() { dispatchConsole('error', arguments); };

    // Catch global unhandled runtime errors
    window.onerror = function(message, source, lineno, colno, error) {
      var errString = error && error.stack ? error.stack : (message + ' (line ' + lineno + ')');
      dispatchConsole('error', [errString]);
      return true;
    };

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', function(event) {
      var reason = event.reason;
      var errString = reason && reason.stack ? reason.stack : String(reason);
      dispatchConsole('error', ['Unhandled Promise Rejection: ' + errString]);
    });

    try {
      ${safeCode}
    } catch (err) {
      dispatchConsole('error', [err && err.stack ? err.stack : String(err)]);
    } finally {
      window.parent.postMessage({
        source: 'collabcode-sandbox',
        type: 'done'
      }, '*');
    }
  })();
  <\/script>
</body>
</html>`;
};

export default function Room() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [room, setRoom] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isRoomLoading, setIsRoomLoading] = useState(true);
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const [output, setOutput] = useState('Console initialized. Click "▶ Run" to execute code.');
  const [isRunning, setIsRunning] = useState(false);
  const [isOutputCollapsed, setIsOutputCollapsed] = useState(false);

  const [isChatOpen, setIsChatOpen] = useState(true);
  const [messages, setMessages] = useState([]);

  const [isUsersDrawerOpen, setIsUsersDrawerOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);

  // Refs for tracking code & execution timeouts
  const codeRef = useRef(code);
  codeRef.current = code;
  const initialRoomCodeRef = useRef('');
  const isInitialLoad = useRef(true);

  const sandboxIframeRef = useRef(null);
  const runnerTimeoutRef = useRef(null);
  const runnerSettleTimeoutRef = useRef(null);
  const logsAccumulatorRef = useRef([]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (runnerTimeoutRef.current) clearTimeout(runnerTimeoutRef.current);
      if (runnerSettleTimeoutRef.current) clearTimeout(runnerSettleTimeoutRef.current);
    };
  }, []);

  // 1. Fetch Room Details & Messages
  const fetchRoomData = async () => {
    try {
      const res = await api.get(`/rooms/${id}`);
      const roomData = res.data;
      setRoom(roomData);
      const roomLang = roomData.language || 'javascript';
      setLanguage(roomLang);

      if (isInitialLoad.current) {
        const initialCode =
          roomData.code !== undefined && roomData.code !== null && roomData.code !== ''
            ? roomData.code
            : STARTER_CODES[roomLang] || '';
        setCode(initialCode);
        initialRoomCodeRef.current = initialCode;
        isInitialLoad.current = false;
      }
    } catch (err) {
      console.error('Error fetching room:', err);
    } finally {
      setIsRoomLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/rooms/${id}/messages`);
      const formatted = res.data.map((m) => ({
        id: m._id,
        roomId: m.room,
        userId: m.sender?._id || m.sender,
        userName: m.sender?.name || 'User',
        userColor: '#3b82f6',
        text: m.text,
        timestamp: new Date(m.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }));
      setMessages(formatted);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchRoomData();
    fetchMessages();
  }, [id]);

  // Polling every 3 seconds for room updates and chat messages
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchMessages();
      api.get(`/rooms/${id}`).then((res) => {
        setRoom(res.data);
      }).catch(() => { });
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [id]);

  // Listen for postMessage from sandboxed iframe
  useEffect(() => {
    const handleSandboxMessage = (event) => {
      if (!event.data || event.data.source !== 'collabcode-sandbox') return;

      const { type, text } = event.data;

      if (type === 'done') {
        // Wait a short settle window to capture any immediate async Promise / setTimeout logs
        if (runnerSettleTimeoutRef.current) clearTimeout(runnerSettleTimeoutRef.current);
        runnerSettleTimeoutRef.current = setTimeout(() => {
          setIsRunning(false);
          if (runnerTimeoutRef.current) clearTimeout(runnerTimeoutRef.current);
          setOutput((prev) => {
            if (!prev || !prev.trim()) {
              return '(Code executed successfully with no console output)';
            }
            return prev;
          });
        }, 700);
        return;
      }

      let line = text;
      if (type === 'error') {
        line = `[ERROR] ${text}`;
      } else if (type === 'warn') {
        line = `[WARN] ${text}`;
      }

      logsAccumulatorRef.current.push(line);
      setOutput(logsAccumulatorRef.current.join('\n'));
    };

    window.addEventListener('message', handleSandboxMessage);
    return () => {
      window.removeEventListener('message', handleSandboxMessage);
    };
  }, []);

  // Save code and language API call
  const saveCodeToBackend = async (codeToSave, langToSave) => {
    try {
      setIsSaving(true);
      await api.put(`/rooms/${id}`, {
        code: codeToSave,
        language: langToSave || language
      });
      setSaveStatus('Saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      setSaveStatus('Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  // Debounced auto-save (2 seconds after typing stops)
  useEffect(() => {
    if (isInitialLoad.current || isRoomLoading) return;
    setSaveStatus('Saving...');
    const timer = setTimeout(() => {
      saveCodeToBackend(code, language);
    }, 2000);

    return () => clearTimeout(timer);
  }, [code]);

  // Checks whether the user hasn't edited the initial snippet
  const isUntouchedStarter = (currentCode) => {
    if (!currentCode || !currentCode.trim()) return true;
    const trimmed = currentCode.trim();
    if (trimmed === initialRoomCodeRef.current.trim()) return true;
    return Object.values(STARTER_CODES).some((s) => s.trim() === trimmed);
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);

    let newCode = code;
    if (isUntouchedStarter(code)) {
      newCode = STARTER_CODES[newLang] || '';
      setCode(newCode);
      initialRoomCodeRef.current = newCode;
    }

    saveCodeToBackend(newCode, newLang);
  };

  const toggleEditorTheme = () => {
    setEditorTheme((prev) => (prev === 'vs-dark' ? 'light' : 'vs-dark'));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(room?.roomCode || window.location.href);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  // Run Code logic: Sandboxed iframe for JS, simulated output with note for Python/C++
  const handleRunCode = () => {
    if (isRunning) return;
    if (isOutputCollapsed) setIsOutputCollapsed(false);

    setIsRunning(true);
    setOutput('');

    // Clear previous execution timers
    if (runnerTimeoutRef.current) clearTimeout(runnerTimeoutRef.current);
    if (runnerSettleTimeoutRef.current) clearTimeout(runnerSettleTimeoutRef.current);

    // 1. Python Simulation
    if (language === 'python') {
      setTimeout(() => {
        setIsRunning(false);
        setOutput(
          'Execution for this language is simulated.\n\nTarget: 9\nIndices: [0, 1]\nValues: 2 + 7 = 9\n\n[Process completed successfully in 120ms with exit code 0]'
        );
      }, 700);
      return;
    }

    // 2. C++ Simulation
    if (language === 'cpp') {
      setTimeout(() => {
        setIsRunning(false);
        setOutput(
          'Execution for this language is simulated.\n\nHello, Developer! Welcome to CollabCode.\n\n[Binary built and executed in 45ms with exit code 0]'
        );
      }, 700);
      return;
    }

    // 3. Real JavaScript Execution in sandboxed iframe
    logsAccumulatorRef.current = [];

    // Reset iframe sandbox
    if (sandboxIframeRef.current) {
      sandboxIframeRef.current.srcdoc = '';
    }

    // 5-second timeout to stop infinite loops
    runnerTimeoutRef.current = setTimeout(() => {
      if (sandboxIframeRef.current) {
        sandboxIframeRef.current.srcdoc = '';
      }
      setIsRunning(false);
      setOutput((prev) => {
        const timeoutMsg = '\n⚠️ [Error: Execution timed out after 5 seconds (possible infinite loop detected)]';
        return prev ? prev + timeoutMsg : timeoutMsg.trim();
      });
    }, 5000);

    // Inject code into sandbox
    const sandboxHtml = createSandboxHtml(code);
    setTimeout(() => {
      if (sandboxIframeRef.current) {
        sandboxIframeRef.current.srcdoc = sandboxHtml;
      }
    }, 50);
  };

  const handleSendMessage = async (text) => {
    try {
      const res = await api.post(`/rooms/${id}/messages`, { text });
      const newMsg = {
        id: res.data._id,
        roomId: res.data.room,
        userId: res.data.sender?._id || user?.id,
        userName: res.data.sender?.name || user?.name || 'You',
        userColor: '#3b82f6',
        text: res.data.text,
        timestamp: new Date(res.data.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setMessages((prev) => [...prev, newMsg]);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const closeMobileDrawers = () => {
    setIsUsersDrawerOpen(false);
    setIsChatDrawerOpen(false);
  };

  const displayName = room?.name || `Room ${id}`;

  return (
    <div
      className={`room-layout ${!isChatOpen ? 'chat-collapsed' : ''} ${isOutputCollapsed ? 'output-collapsed' : ''
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
            <span className="toolbar-room-id">Code: {room?.roomCode || id}</span>
            {saveStatus && (
              <span style={{ fontSize: '0.75rem', color: '#38bdf8', marginLeft: '0.5rem' }}>
                {saveStatus}
              </span>
            )}
          </div>
        </div>

        <div className="toolbar-controls">
          {/* Save Code Button */}
          <button
            type="button"
            className="btn btn-outline toolbar-btn"
            onClick={() => saveCodeToBackend(code, language)}
            disabled={isSaving}
            title="Save code now"
          >
            💾 Save
          </button>

          {/* Mobile Drawer Trigger Buttons */}
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
            <option value="javascript">JavaScript</option>
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

          {/* Copy Room Code */}
          <button
            type="button"
            className={`btn btn-outline toolbar-btn ${isCopied ? 'copy-success-badge' : ''}`}
            onClick={handleCopyLink}
            title="Copy Room Join Code"
          >
            {isCopied ? '✓' : '🔑'}
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

      {/* 2. Left Sidebar: Collaborators */}
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
        <UserList users={room?.members || []} />
      </aside>

      {/* 3. Center: Monaco Editor */}
      <main className="room-editor-area">
        {isRoomLoading ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#94a3b8'
            }}
          >
            Loading workspace...
          </div>
        ) : (
          <Editor
            key={language}
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
        )}
      </main>

      {/* 4. Bottom: Output Console Panel */}
      <section className="room-output-area">
        <OutputPanel
          output={output}
          isRunning={isRunning}
          onClear={() => setOutput('')}
          isCollapsed={isOutputCollapsed}
          onToggleCollapse={() => setIsOutputCollapsed((prev) => !prev)}
        />
      </section>

      {/* 5. Right: Chat Panel */}
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
          currentUserId={user?.id || user?._id}
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

      {/* Sandboxed iframe runner for executing JavaScript safely */}
      <iframe
        ref={sandboxIframeRef}
        sandbox="allow-scripts"
        style={{ display: 'none' }}
        title="collabcode-sandbox-runner"
      />
    </div>
  );
}
