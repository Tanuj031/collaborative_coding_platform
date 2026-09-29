// ChatPanel component: In-room messaging sidebar with auto-scrolling
// Differentiates own messages from teammates and handles real-time send events
import React, { useState, useRef, useEffect } from 'react';
import './ChatPanel.css';

export default function ChatPanel({
  messages = [],
  onSendMessage,
  currentUserId = 'u1',
  isOpen = true,
  onToggle
}) {
  // Controlled chat input state
  const [inputText, setInputText] = useState('');

  // 1. Ref targeting the bottom anchor of the message list for auto-scrolling
  const messagesEndRef = useRef(null);

  // 2. Auto-scroll function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 3. Trigger auto-scroll whenever the messages array updates
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle message submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Dispatch message to parent component (Room.jsx)
    onSendMessage(inputText.trim());
    setInputText('');
  };

  // Allow sending with 'Enter' key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Render minimal collapsed strip when chat is closed
  if (!isOpen) {
    return (
      <div
        className="chat-panel-collapsed"
        onClick={onToggle}
        title="Open Room Chat"
        role="button"
        tabIndex={0}
      >
        <button
          type="button"
          className="chat-collapsed-btn"
          aria-label="Expand Chat"
        >
          💬
        </button>
        <span className="chat-vertical-label">
          CHAT ({messages.length})
        </span>
      </div>
    );
  }

  return (
    <div className="chat-panel-container" aria-label="Room Chat Panel">
      {/* Header */}
      <div className="chat-panel-header">
        <div className="chat-header-title">
          <span>💬 Room Chat</span>
          <span className="chat-badge">{messages.length}</span>
        </div>

        <button
          type="button"
          className="chat-toggle-btn"
          onClick={onToggle}
          title="Collapse Chat"
          aria-label="Collapse Chat"
        >
          ▶
        </button>
      </div>

      {/* Messages Stream */}
      <ul className="chat-messages-list">
        {messages.length === 0 ? (
          <li className="chat-empty-hint">No messages yet. Say hello!</li>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.userId === currentUserId;

            return (
              <li
                key={msg.id}
                className={`chat-message-row ${isOwn ? 'message-own' : 'message-other'}`}
              >
                {/* Message Meta Info */}
                <div className="message-meta">
                  {!isOwn && (
                    <span
                      className="message-sender-name"
                      style={{ color: msg.userColor || 'var(--primary-accent)' }}
                    >
                      {msg.userName}
                    </span>
                  )}
                  <span className="message-timestamp">{msg.timestamp}</span>
                </div>

                {/* Message Bubble Content */}
                <div className="message-bubble">{msg.text}</div>
              </li>
            );
          })
        )}
        {/* Invisible scroll target at bottom of list */}
        <div ref={messagesEndRef} />
      </ul>

      {/* Message Input Footer */}
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          className="input chat-input-field"
          placeholder="Type a message... (Enter to send)"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          className="btn btn-primary chat-send-btn"
          disabled={!inputText.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
