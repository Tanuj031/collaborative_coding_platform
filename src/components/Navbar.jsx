// Navbar component: Responsive navigation bar using Flexbox
// Shown on all pages except /room/:id (collaborative editor room)
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  // Hook to track mobile menu toggle state (open / closed)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hook to inspect the active URL route
  const location = useLocation();

  // Hide the Navbar when inside a coding room (/room/:id)
  // This allows the code editor to utilize the full viewport
  if (location.pathname.startsWith('/room/')) {
    return null;
  }

  // Helper to toggle mobile menu open/close
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  // Close mobile menu when a navigation item is clicked
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

        {/* Desktop Navigation Links (Flexbox) */}
        <nav className="navbar-desktop">
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            </li>
          </ul>

          {/* Action / Auth Buttons */}
          <div className="nav-auth-group">
            <Link to="/login" className="btn btn-outline">Log In</Link>
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
          </div>
        </nav>

        {/* Mobile Hamburger Toggle Button */}
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

      {/* Mobile Collapsible Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <ul className="mobile-links">
            <li>
              <Link to="/" className="mobile-nav-link" onClick={handleNavLinkClick}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="mobile-nav-link" onClick={handleNavLinkClick}>
                Dashboard
              </Link>
            </li>
          </ul>

          <div className="mobile-auth-group">
            <Link to="/login" className="btn btn-outline" onClick={handleNavLinkClick}>
              Log In
            </Link>
            <Link to="/signup" className="btn btn-primary" onClick={handleNavLinkClick}>
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
