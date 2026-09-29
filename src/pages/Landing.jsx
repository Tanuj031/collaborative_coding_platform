// Landing Page: Introduction to the collaborative coding platform
// Contains Hero section with CTAs, 4-card feature highlights, and a clean footer
import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

// Year constant defined outside component render cycle
const CURRENT_YEAR = new Date().getFullYear();

export default function Landing() {
  // Feature cards data definition
  const features = [
    {
      id: 'feat-1',
      icon: '⚡',
      title: 'Live Editing',
      description: 'Collaborate with teammates simultaneously in a synchronized, zero-lag code editor powered by Monaco.'
    },
    {
      id: 'feat-2',
      icon: '💬',
      title: 'Real-Time Chat',
      description: 'Discuss logic, coordinate algorithm approaches, and debug with integrated in-room team chat.'
    },
    {
      id: 'feat-3',
      icon: '🌐',
      title: 'Multi-Language',
      description: 'Seamlessly switch syntax and environments across JavaScript, Python, C++, and more.'
    },
    {
      id: 'feat-4',
      icon: '▶️',
      title: 'Run Code',
      description: 'Simulate and view code execution output immediately inside the integrated terminal console.'
    }
  ];

  return (
    <div className="landing-container">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="hero-pill">
          <span>🚀 Real-Time Collaborative Workspace</span>
        </div>

        <h1 className="hero-headline">
          Code Together, Build Faster <br />
          <span className="headline-gradient">In Real Time</span>
        </h1>

        <p className="hero-subtext">
          An interactive, browser-based coding environment designed for seamless pair programming,
          instant synchronization, algorithm practice, and technical interviews.
        </p>

        {/* Dual Call-To-Action Buttons */}
        <div className="hero-cta-group">
          <Link to="/signup" className="btn btn-primary">
            Get Started Free
          </Link>
          <Link to="/dashboard" className="btn btn-outline">
            Explore Demo Rooms →
          </Link>
        </div>
      </section>

      {/* 2. Features Grid Section */}
      <section className="features-section">
        <div className="features-header">
          <h2>Engineered for Seamless Collaboration</h2>
          <p>Everything you need for an intuitive, distraction-free coding session.</p>
        </div>

        <div className="features-grid">
          {features.map((item) => (
            <div key={item.id} className="card feature-card">
              <div className="feature-icon-wrapper">
                <span>{item.icon}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Simple Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <p>© {CURRENT_YEAR} CollabCode. Built for Web Tech College Project.</p>
          <div className="footer-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
