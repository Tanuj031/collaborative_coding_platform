// UserList component: Displays collaborators present in the active coding room
import React from 'react';
import './UserList.css';

export default function UserList({ users = [] }) {
  // Helper to get initials from a user's full name (e.g. Alex Johnson -> AJ)
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <aside className="userlist-container" aria-label="Room Participants">
      {/* Sidebar Section Header */}
      <div className="userlist-header">
        <span className="userlist-title">Collaborators</span>
        <span className="userlist-badge">{users.length}</span>
      </div>

      {/* List of active users */}
      <ul className="userlist-items">
        {users.map((user) => (
          <li key={user.id} className="user-item">
            <div className="user-avatar-wrapper">
              {/* Colored avatar circle with initials */}
              <div
                className="user-avatar"
                style={{ backgroundColor: user.color || 'var(--primary-accent)' }}
              >
                {getInitials(user.name)}
              </div>
              {/* Green online presence indicator */}
              <span className="online-dot" title="Online"></span>
            </div>

            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role || 'Member'}</span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
