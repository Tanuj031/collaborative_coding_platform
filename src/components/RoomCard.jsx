// RoomCard component: Displays a summary card for an active coding room
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RoomCard.css';

export default function RoomCard({ room }) {
  // Navigation hook to open the selected room
  const navigate = useNavigate();

  // Navigate to this room's workspace
  const handleJoin = (e) => {
    // Prevent double triggers if user clicks directly on the button inside card
    e.stopPropagation();
    navigate(`/room/${room.id}`);
  };

  // Helper to map programming language to badge CSS class
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

  return (
    <div
      className="card room-card"
      onClick={() => navigate(`/room/${room.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/room/${room.id}`)}
    >
      {/* Header with Title and Language Badge */}
      <div className="room-card-header">
        <h3 className="room-name">{room.name}</h3>
        <span className={`language-badge ${getLanguageClass(room.language)}`}>
          {room.language}
        </span>
      </div>

      {/* Brief Room Description */}
      <p className="room-description">
        {room.description || 'Live pair programming session.'}
      </p>

      {/* Card Footer: Participant Count & Join Action */}
      <div className="room-card-footer">
        <div className="room-members-count">
          <span className="members-icon">👥</span>
          <span>{room.participantsCount || 1} online</span>
        </div>

        <button
          type="button"
          className="btn btn-primary room-join-btn"
          onClick={handleJoin}
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
