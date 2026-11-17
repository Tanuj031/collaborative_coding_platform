// Navbar component: Responsive navigation bar using Flexbox
import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, token, logout } = useContext(AuthContext);

  if (location.pathname.startsWith('/room/')) {
    return null;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo" onClick={handleNavLinkClick}>
          <span className="logo-badge">&lt;/&gt;</span>
          <span className="logo-text">Collab<span className="logo-accent">Code</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-desktop">
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link">Home</Link>
            </li>
            {token && (
              <li>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
              </li>
            )}
          </ul>

          {/* Action / Auth Buttons */}
          <div className="nav-auth-group">
            {token ? (
              <>
                <span style={{ color: '#94a3b8', fontSize: '0.9rem', marginRight: '0.5rem' }}>
                  Hi, {user?.name || 'User'}
                </span>
                <button type="button" className="btn btn-outline" onClick={logout}>
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">Log In</Link>
                <Link to="/signup" className="btn btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className={`hamburger-btn ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Mobile Collapsible Dropdown */}
      {isMobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <ul className="mobile-links">
            <li>
              <Link to="/" className="mobile-nav-link" onClick={handleNavLinkClick}>
                Home
              </Link>
            </li>
            {token && (
              <li>
                <Link to="/dashboard" className="mobile-nav-link" onClick={handleNavLinkClick}>
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          <div className="mobile-auth-group">
            {token ? (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  logout();
                  handleNavLinkClick();
                }}
              >
                Log Out
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline" onClick={handleNavLinkClick}>
                  Log In
                </Link>
                <Link to="/signup" className="btn btn-primary" onClick={handleNavLinkClick}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
