// NotFound Page: 404 handler with a return to home action
import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-card">
        {/* Large 404 Accent Heading */}
        <div className="notfound-code">404</div>

        <h1>Page Not Found</h1>
        <p className="notfound-desc">
          The collaborative workspace or page you are looking for does not exist,
          has been moved, or the link has expired.
        </p>

        {/* Action Buttons */}
        <div className="notfound-actions">
          <Link to="/" className="btn btn-primary">
            ← Go Home
          </Link>
          <Link to="/dashboard" className="btn btn-outline">
            Browse Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
