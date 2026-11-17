// UserList component: Displays real room members
import React from 'react';
import './UserList.css';

export default function UserList({ users = [] }) {
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <aside className="userlist-container" aria-label="Room Participants">
      <div className="userlist-header">
        <span className="userlist-title">Collaborators</span>
        <span className="userlist-badge">{users.length}</span>
      </div>

      <ul className="userlist-items">
        {users.map((user) => (
          <li key={user._id || user.id || Math.random()} className="user-item">
            <div className="user-avatar-wrapper">
              <div
                className="user-avatar"
                style={{ backgroundColor: '#3b82f6' }}
              >
                {getInitials(user.name)}
              </div>
              <span className="online-dot" title="Active"></span>
            </div>

            <div className="user-info">
              <span className="user-name">{user.name || 'Anonymous'}</span>
              <span className="user-role">{user.email || 'Member'}</span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
