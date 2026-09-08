import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import theme from '../theme';
import Button from '../components/Button';
import Card from '../components/Card';
import Logo from '../components/Logo';
import './LoginPage.css';

import bgImage from '../assets/ravel-background.webp.jpeg';

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    auditorId: '',
    password: '',
    keepLoggedIn: false,
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (errorMessage) setErrorMessage('');

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    // Fetch registered user details from localStorage
    const storedUserJSON = localStorage.getItem('ravel_registered_user');

    if (!storedUserJSON) {
      setIsSubmitting(false);
      setErrorMessage('No account found. Please sign up first.');
      return;
    }

    const registeredUser = JSON.parse(storedUserJSON);

    const inputIdentifier = formData.auditorId.trim().toLowerCase();
    const validAuditorId = registeredUser.auditorId?.toLowerCase();
    const validEmail = registeredUser.email?.toLowerCase();

    const isIdentifierValid = inputIdentifier === validAuditorId || inputIdentifier === validEmail;
    const isPasswordValid = formData.password === registeredUser.password;

    if (!isIdentifierValid || !isPasswordValid) {
      setIsSubmitting(false);
      setErrorMessage('Invalid Auditor ID/Email or Password.');
      return;
    }

    // Save active session details
    const userCredentials = {
      auditorId: registeredUser.auditorId,
      fullName: registeredUser.fullName,
      role: registeredUser.role,
      isLoggedIn: true,
      loginTimestamp: new Date().toISOString(),
    };

    localStorage.setItem('ravel_user', JSON.stringify(userCredentials));

    if (formData.keepLoggedIn) {
      localStorage.setItem('ravel_auditor_id', formData.auditorId);
      localStorage.setItem('ravel_keep_logged_in', 'true');
    } else {
      localStorage.removeItem('ravel_auditor_id');
      localStorage.removeItem('ravel_keep_logged_in');
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsLoggedIn(true);

      setTimeout(() => {
        navigate('/entities');
      }, 1200);
    }, 500);
  };

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Card className="login-card">
        <div className="login-header">
          <Logo showText={false} iconSize={80} />
          <h1 className="brand-name">Ravel</h1>
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
            <h2>Login Successful!</h2>
            <p>Redirecting to dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="auditorId" className="form-label">
                Auditor ID / Email
              </label>
              <input
                type="text"
                id="auditorId"
                name="auditorId"
                placeholder="Auditor ID / Email"
                value={formData.auditorId}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-options">
              <a href="#forgot-password" className="inline-link">
                Forgot Password?
              </a>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="keepLoggedIn"
                  checked={formData.keepLoggedIn}
                  onChange={handleInputChange}
                  className="checkbox-input"
                />
                <span>Keep me logged in</span>
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

        <div className="login-footer">
          <p className="account-prompt">
            Don't have an account?{' '}
            <span
              className="btn-signup"
              onClick={() => navigate('/signup')}
            >
              Sign up
            </span>
          </p>

          <p className="help-caption">
            Need help? <a href="#docs" className="inline-link">Check the documentation</a>.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;