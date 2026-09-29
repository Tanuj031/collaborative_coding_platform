// Signup Page: User registration form with client-side validation
// Uses React useState hook for controlled inputs and redirects to /dashboard upon submission
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

export default function Signup() {
  // Navigation hook to redirect users to Dashboard
  const navigate = useNavigate();

  // Controlled form state for registration fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // State to hold field validation error messages
  const [errors, setErrors] = useState({});

  // Generic controlled input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error as user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Perform form validation
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 1. Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    // 2. Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // 3. Password length validation (at least 6 characters)
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    // 4. Password confirmation match
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    return newErrors;
  };

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    const formValidationErrors = validateForm();

    // Prevent navigation if any validation errors are present
    if (Object.keys(formValidationErrors).length > 0) {
      setErrors(formValidationErrors);
      return;
    }

    // On valid submission, proceed to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="signup-page-wrapper">
      <div className="signup-card">
        {/* Header */}
        <div className="signup-header">
          <h1>Create an Account</h1>
          <p>Join CollabCode to write and share code in real time.</p>
        </div>

        {/* Controlled Form */}
        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          {/* Full Name Field */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              className={`input ${errors.name ? 'input-error' : ''}`}
              placeholder="e.g. Alex Johnson"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Email Address Field */}
          <div className="form-group">
            <label htmlFor="signup-email" className="form-label">
              Email Address
            </label>
            <input
              id="signup-email"
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
            <label htmlFor="signup-password" className="form-label">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              name="password"
              className={`input ${errors.password ? 'input-error' : ''}`}
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Submit Action */}
          <button type="submit" className="btn btn-primary signup-submit-btn">
            Create Account
          </button>
        </form>

        {/* Switch Route Prompt */}
        <div className="signup-footer-prompt">
          Already have an account?
          <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}
