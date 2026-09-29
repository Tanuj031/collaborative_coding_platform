// Login Page: Controlled form with client-side validation
// Navigates to /dashboard on successful submit
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  // Navigation hook to redirect users after submission
  const navigate = useNavigate();

  // Controlled form state for inputs
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // State to hold validation error messages
  const [errors, setErrors] = useState({});

  // Generic input change handler for controlled inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field as soon as the user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form inputs against project requirements
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 1. Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // 2. Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const formValidationErrors = validateForm();

    // If there are errors, set them in state and halt submission
    if (Object.keys(formValidationErrors).length > 0) {
      setErrors(formValidationErrors);
      return;
    }

    // On valid submission, proceed to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to resume your collaborative coding sessions.</p>
        </div>

        {/* Controlled Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className={`input ${errors.email ? 'input-error' : ''}`}
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className={`input ${errors.password ? 'input-error' : ''}`}
              placeholder="Enter your password (min. 6 characters)"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {/* Submit Action */}
          <button type="submit" className="btn btn-primary auth-submit-btn">
            Sign In
          </button>
        </form>

        {/* Switch Route Prompt */}
        <div className="auth-footer-prompt">
          Don't have an account?
          <Link to="/signup">Create account</Link>
        </div>
      </div>
    </div>
  );
}
