// Dashboard Page: Lists real active coding rooms from backend API
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import RoomCard from '../components/RoomCard';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [roomsList, setRoomsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const [newRoomData, setNewRoomData] = useState({
    name: '',
    language: 'javascript'
  });
  const [createError, setCreateError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [joinError, setJoinError] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      setFetchError('');
      const res = await api.get('/rooms');
      setRoomsList(res.data);
    } catch (err) {
      setFetchError('Failed to load rooms. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomData.name.trim()) {
      setCreateError('Room name is required.');
      return;
    }

    const starterSnippets = {
      javascript: '// Start coding in JavaScript...\nconsole.log("Hello, CollabCode!");\n',
      python: '# Start coding in Python...\nprint("Hello, CollabCode!")\n',
      cpp: '// Start coding in C++...\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, CollabCode!" << std::endl;\n    return 0;\n}\n'
    };

    try {
      setIsCreating(true);
      setCreateError('');
      const payload = {
        name: newRoomData.name.trim(),
        language: newRoomData.language,
        code: starterSnippets[newRoomData.language] || '// Welcome\n'
      };
      const res = await api.post('/rooms', payload);
      setRoomsList((prev) => [res.data, ...prev]);
      setNewRoomData({ name: '', language: 'javascript' });
      setIsCreateModalOpen(false);
      navigate(`/room/${res.data._id}`);
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Failed to create room.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinWithCode = async (e) => {
    e.preventDefault();
    if (!roomCodeInput.trim()) {
      setJoinError('Please enter a 6-character room code.');
      return;
    }

    try {
      setIsJoining(true);
      setJoinError('');
      const res = await api.post('/rooms/join', {
        roomCode: roomCodeInput.trim()
      });
      setIsJoinModalOpen(false);
      setRoomCodeInput('');
      navigate(`/room/${res.data.roomId}`);
    } catch (err) {
      setJoinError(err.response?.data?.message || 'Invalid room code.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      await api.delete(`/rooms/${roomId}`);
      setRoomsList((prev) => prev.filter((r) => (r._id || r.id) !== roomId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete room.');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title-area">
          <h1>Welcome back, {user?.name || 'Developer'} 👋</h1>
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

      {fetchError && (
        <div style={{ color: '#ef4444', marginBottom: '1rem' }}>
          {fetchError} <button onClick={fetchRooms}>Retry</button>
        </div>
      )}

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
            <RoomCard
              key={room._id || room.id}
              room={room}
              currentUserId={user?.id || user?._id}
              onDelete={handleDeleteRoom}
            />
          ))}
        </div>
      ) : (
        <div className="rooms-empty-state">
          <span className="empty-icon">📂</span>
          <h3>No Active Rooms Found</h3>
          <p>You haven't created or joined any rooms yet.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Your First Room
          </button>
        </div>
      )}

      {/* "Create Room" Modal */}
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
              <div className="form-group">
                <label htmlFor="room-name" className="form-label">
                  Room Name
                </label>
                <input
                  id="room-name"
                  type="text"
                  className="input"
                  placeholder="e.g. React & Express Fullstack"
                  value={newRoomData.name}
                  onChange={(e) => {
                    setNewRoomData({ ...newRoomData, name: e.target.value });
                    setCreateError('');
                  }}
                  autoFocus
                />
                {createError && <span className="modal-error">{createError}</span>}
              </div>

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

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isCreating}>
                  {isCreating ? 'Launching...' : 'Launch Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* "Join with Code" Modal */}
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
                  Enter 6-Character Room Code
                </label>
                <input
                  id="room-code-input"
                  type="text"
                  className="input"
                  placeholder="e.g. A1B2C3"
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
                <button type="submit" className="btn btn-primary" disabled={isJoining}>
                  {isJoining ? 'Joining...' : 'Join Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
