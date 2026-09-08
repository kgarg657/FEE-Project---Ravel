import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import theme from '../theme';
import Button from '../components/Button';
import Card from '../components/Card';
import Logo from '../components/Logo'; // Imported Logo component
import './LoginPage.css';

import bgImage from '../assets/ravel-background.webp.jpeg';

const LoginPage = () => {
    const navigate = useNavigate();

    // Form inputs always start empty when page loads or refreshes
    const [formData, setFormData] = useState({
        auditorId: '',
        password: '',
        keepLoggedIn: false,
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // 1. Save authentication details in LocalStorage
        const userCredentials = {
            auditorId: formData.auditorId,
            password: formData.password,
            isLoggedIn: true,
            loginTimestamp: new Date().toISOString(),
        };

        localStorage.setItem('ravel_user', JSON.stringify(userCredentials));

        if (formData.keepLoggedIn) {
            localStorage.setItem('ravel_auditor_id', formData.auditorId);
            localStorage.setItem('ravel_password', formData.password);
            localStorage.setItem('ravel_keep_logged_in', 'true');
        } else {
            localStorage.removeItem('ravel_auditor_id');
            localStorage.removeItem('ravel_password');
            localStorage.removeItem('ravel_keep_logged_in');
        }

        // 2. Clear state immediately
        setFormData({
            auditorId: '',
            password: '',
            keepLoggedIn: false,
        });

        // 3. Display success screen
        setTimeout(() => {
            setIsSubmitting(false);
            setIsLoggedIn(true);

            setTimeout(() => {
                // window.location.href = '/dashboard';
            }, 1500);
        }, 600);
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
                    <p className="account-prompt">Don't have an account?</p>
                    <Button
                        variant="outline"
                        className="btn-signup"
                        onClick={() => navigate('/signup')}
                    >
                        Sign up
                    </Button>

                    <p className="help-caption">
                        Need help? <a href="#docs" className="inline-link">Check the documentation</a>.
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;
