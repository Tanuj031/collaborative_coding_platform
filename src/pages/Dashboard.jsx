// Dashboard Page: Lists active coding rooms, allows creating new rooms and joining by room code
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { rooms as initialRooms } from '../data/mockData';
import RoomCard from '../components/RoomCard';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();

  // 1. Rooms state initialized with mockData
  const [roomsList, setRoomsList] = useState(initialRooms);

  // Initial render loading state to show skeleton effect
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data fetching delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // 2. Modal display toggles
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // 3. Create Room form state
  const [newRoomData, setNewRoomData] = useState({
    name: '',
    language: 'javascript',
    description: ''
  });
  const [createError, setCreateError] = useState('');

  // 4. Join by code form state
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [joinError, setJoinError] = useState('');

  // Handle Create Room submit
  const handleCreateRoom = (e) => {
    e.preventDefault();

    // Basic validation
    if (!newRoomData.name.trim()) {
      setCreateError('Room name is required.');
      return;
    }

    // Default template code snippets based on selected language
    const starterSnippets = {
      javascript: '// Start coding in JavaScript...\nconsole.log("Hello, CollabCode!");\n',
      python: '# Start coding in Python...\nprint("Hello, CollabCode!")\n',
      cpp: '// Start coding in C++...\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, CollabCode!" << std::endl;\n    return 0;\n}\n'
    };

    // Create new room object
    const createdRoom = {
      id: `room-${Date.now().toString().slice(-4)}`,
      name: newRoomData.name.trim(),
      language: newRoomData.language,
      description: newRoomData.description.trim() || 'Collaborative coding session.',
      createdBy: 'You',
      participantsCount: 1,
      createdAt: new Date().toISOString(),
      code: starterSnippets[newRoomData.language] || '// Welcome to your new room\n'
    };

    // Prepend new room to state to instantly show it at the front of the grid
    setRoomsList((prev) => [createdRoom, ...prev]);

    // Reset and close modal
    setNewRoomData({ name: '', language: 'javascript', description: '' });
    setCreateError('');
    setIsCreateModalOpen(false);
  };

  // Handle Join by Room Code submit
  const handleJoinWithCode = (e) => {
    e.preventDefault();

    if (!roomCodeInput.trim()) {
      setJoinError('Please enter a valid room code.');
      return;
    }

    const targetCode = roomCodeInput.trim();
    setIsJoinModalOpen(false);
    setRoomCodeInput('');
    setJoinError('');

    // Navigate to the target room route
    navigate(`/room/${targetCode}`);
  };

  return (
    <div className="dashboard-container">
      {/* 1. Header with Welcome Message and Action Buttons */}
      <div className="dashboard-header">
        <div className="dashboard-title-area">
          <h1>Welcome back, Developer 👋</h1>
          <p>Collaborate in active sessions or launch a new real-time room.</p>
        </div>

        <div className="dashboard-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setIsJoinModalOpen(true)}
          >
            # Join with Code
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Create Room
          </button>
        </div>
      </div>

      {/* 2. Room Grid, Loading Skeletons, or Empty State */}
      {isLoading ? (
        <div className="rooms-grid" aria-label="Loading rooms">
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton-card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="skeleton-shimmer skeleton-line"></div>
                <div className="skeleton-shimmer skeleton-badge"></div>
              </div>
              <div>
                <div className="skeleton-shimmer skeleton-desc"></div>
                <div className="skeleton-shimmer skeleton-desc" style={{ width: '70%' }}></div>
              </div>
              <div className="skeleton-footer">
                <div className="skeleton-shimmer" style={{ width: '80px', height: '14px' }}></div>
                <div className="skeleton-shimmer skeleton-btn"></div>
              </div>
            </div>
          ))}
        </div>
      ) : roomsList.length > 0 ? (
        <div className="rooms-grid">
          {roomsList.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <div className="rooms-empty-state">
          <span className="empty-icon">📂</span>
          <h3>No Active Rooms Found</h3>
          <p>There are no live rooms right now. Create one to get started!</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Your First Room
          </button>
        </div>
      )}

      {/* 3. "Create Room" Modal */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Coding Room</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsCreateModalOpen(false)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="modal-form">
              {/* Room Name */}
              <div className="form-group">
                <label htmlFor="room-name" className="form-label">
                  Room Name
                </label>
                <input
                  id="room-name"
                  type="text"
                  className="input"
                  placeholder="e.g. React Hooks Deep Dive"
                  value={newRoomData.name}
                  onChange={(e) => {
                    setNewRoomData({ ...newRoomData, name: e.target.value });
                    setCreateError('');
                  }}
                  autoFocus
                />
                {createError && <span className="modal-error">{createError}</span>}
              </div>

              {/* Language Selection */}
              <div className="form-group">
                <label htmlFor="room-language" className="form-label">
                  Primary Language
                </label>
                <select
                  id="room-language"
                  className="input"
                  value={newRoomData.language}
                  onChange={(e) =>
                    setNewRoomData({ ...newRoomData, language: e.target.value })
                  }
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                </select>
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="room-desc" className="form-label">
                  Description (Optional)
                </label>
                <input
                  id="room-desc"
                  type="text"
                  className="input"
                  placeholder="What is this session focused on?"
                  value={newRoomData.description}
                  onChange={(e) =>
                    setNewRoomData({ ...newRoomData, description: e.target.value })
                  }
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Launch Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. "Join with Code" Modal */}
      {isJoinModalOpen && (
        <div className="modal-overlay" onClick={() => setIsJoinModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Join Room with Code</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsJoinModalOpen(false)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleJoinWithCode} className="modal-form">
              <div className="form-group">
                <label htmlFor="room-code-input" className="form-label">
                  Enter Room Code
                </label>
                <input
                  id="room-code-input"
                  type="text"
                  className="input"
                  placeholder="e.g. room-101"
                  value={roomCodeInput}
                  onChange={(e) => {
                    setRoomCodeInput(e.target.value);
                    setJoinError('');
                  }}
                  autoFocus
                />
                {joinError && <span className="modal-error">{joinError}</span>}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsJoinModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Join Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
