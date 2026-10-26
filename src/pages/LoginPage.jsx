// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Card from '../components/Card';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { loginUser } from '../services/supabaseService';
import { setUser } from '../store/authSlice';
import './LoginPage.css';

import bgImage from '../assets/ravel-background.webp.jpeg';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    auditorId: '',
    password: '',
    keepLoggedIn: false,
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userFullName, setUserFullName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (errorMessage) setErrorMessage('');
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const inputIdentifier = formData.auditorId.trim();
    if (!inputIdentifier || !formData.password) {
      setErrorMessage('Please enter both your Email / Auditor ID and Password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const userCredentials = await loginUser({
        identifier: inputIdentifier,
        password: formData.password,
      });

      const sessionData = {
        ...userCredentials,
        isLoggedIn: true,
        loginTimestamp: new Date().toISOString(),
      };

      localStorage.setItem('ravel_user', JSON.stringify(sessionData));
      dispatch(setUser(sessionData));

      if (formData.keepLoggedIn) {
        localStorage.setItem('ravel_auditor_id', userCredentials.auditorId);
        localStorage.setItem('ravel_keep_logged_in', 'true');
      } else {
        localStorage.removeItem('ravel_auditor_id');
        localStorage.removeItem('ravel_keep_logged_in');
      }

      setUserFullName(userCredentials.fullName);
      setIsSubmitting(false);
      setIsLoggedIn(true);

      setTimeout(() => {
        navigate('/canvas');
      }, 1200);

    } catch (err) {
      console.error('Login error:', err);
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Invalid credentials or login failed. Please check your credentials.');
    }
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'auto',
      }}
    >
      <Card className="login-card">
        <div className="login-header">
          <div className="brand-logo-container" style={{ marginBottom: '12px' }}>
            <Logo iconSize={80} scale={1.8} showText={false} />
          </div>
          <h1 className="brand-name">Ravel</h1>
          <h2 className="login-title">Auditor Portal Access</h2>
          <p className="brand-subtitle">
            Forensic Audit & Relationship Mapping Platform
          </p>
        </div>

        {errorMessage && (
          <div
            style={{
              padding: '10px 12px',
              marginBottom: '16px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '4px',
              color: '#f87171',
              fontSize: '0.82rem',
              textAlign: 'center',
            }}
          >
            {errorMessage}
          </div>
        )}

        {isLoggedIn ? (
          <div className="success-screen">
            <div className="success-icon">✓</div>
            <h2>Welcome Back, {userFullName}!</h2>
            <p>Loading Investigation Canvas...</p>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="login-form">
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label htmlFor="auditorId" className="form-label" style={{ display: 'block', marginBottom: '6px' }}>
                Institutional Email or Auditor ID <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="auditorId"
                name="auditorId"
                placeholder="name@institution.com or AUD-1234"
                value={formData.auditorId}
                onChange={handleInputChange}
                required
                className="form-input"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  color: '#ffffff',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  pointerEvents: 'auto',
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label htmlFor="password" className="form-label" style={{ display: 'block', marginBottom: '6px' }}>
                Password <span className="required-star">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="form-input"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  color: '#ffffff',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  pointerEvents: 'auto',
                }}
              />
            </div>

            <div className="form-options" style={{ marginBottom: '16px' }}>
              <label className="checkbox-container" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="keepLoggedIn"
                  checked={formData.keepLoggedIn}
                  onChange={handleInputChange}
                  className="checkbox-input"
                />
                <span className="checkbox-text" style={{ fontSize: '13px' }}>Keep me logged in</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Authenticating...' : 'Log In'}
            </Button>
          </form>
        )}

        <div className="login-footer" style={{ marginTop: '16px' }}>
          <p className="account-prompt">
            Don't have an auditor account? <Link to="/signup" className="inline-link">Sign Up</Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;