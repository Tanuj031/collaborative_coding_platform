// Main application component configuring client-side routing
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Page components
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Room from './pages/Room';
import NotFound from './pages/NotFound';

// Navigation Bar component
import Navbar from './components/Navbar';

export default function App() {
  return (
    <BrowserRouter>
      {/* Global Navigation Bar (automatically hidden on /room/:id) */}
      <Navbar />

      {/* Route definitions for application navigation */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/room/:id" element={<Room />} />
        {/* Wildcard 404 handler */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
