// RoomCard component: Displays a summary card for an active coding room with delete option for owner
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RoomCard.css';

export default function RoomCard({ room, currentUserId, onDelete }) {
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.stopPropagation();
    navigate(`/room/${room._id || room.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${room.name}"?`)) {
      onDelete(room._id || room.id);
    }
  };

  const getLanguageClass = (language) => {
    switch (language?.toLowerCase()) {
      case 'python':
        return 'badge-python';
      case 'javascript':
        return 'badge-javascript';
      case 'cpp':
      case 'c++':
        return 'badge-cpp';
      default:
        return 'badge-default';
    }
  };

  const isOwner =
    currentUserId &&
    (room.owner?._id === currentUserId || room.owner === currentUserId);

  return (
    <div
      className="card room-card"
      onClick={() => navigate(`/room/${room._id || room.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/room/${room._id || room.id}`)}
    >
      <div className="room-card-header">
        <h3 className="room-name">{room.name}</h3>
        <span className={`language-badge ${getLanguageClass(room.language)}`}>
          {room.language}
        </span>
      </div>

      <p className="room-description" style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
        Code: <strong style={{ color: '#38bdf8' }}>{room.roomCode}</strong>
      </p>

      <div className="room-card-footer">
        <div className="room-members-count">
          <span className="members-icon">👥</span>
          <span>{room.members?.length || 1} joined</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {isOwner && (
            <button
              type="button"
              className="btn btn-outline"
              style={{ borderColor: '#ef4444', color: '#ef4444', padding: '0.3rem 0.6rem' }}
              onClick={handleDelete}
              title="Delete Room"
            >
              🗑️
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary room-join-btn"
            onClick={handleJoin}
          >
            Open Room
          </button>
        </div>
      </div>
    </div>
  );
}
