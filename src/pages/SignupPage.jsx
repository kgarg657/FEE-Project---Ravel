import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import theme from '../theme';
import Button from '../components/Button';
import Card from '../components/Card';
import Logo from '../components/Logo';
import './SignupPage.css';

import bgImage from '../assets/ravel-background.webp.jpeg';

const SignupPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        role: 'Auditor',
        password: '',
        confirmPassword: '',
        fullName: '',
        email: '',
        auditorId: '',
        organizationName: '',
        industry: 'Financial Services',
        agreeToTerms: false,
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const getPasswordStrength = (pass) => {
        if (!pass) return { label: 'None', class: '' };
        if (pass.length < 6) return { label: 'Weak', class: 'weak' };
        if (pass.length < 10) return { label: 'Medium', class: 'medium' };
        return { label: 'Strong', class: 'strong' };
    };

    const passwordStrength = getPasswordStrength(formData.password);
    const isPasswordStrong = passwordStrength.label === 'Strong';

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        setIsSubmitting(true);

        const newUser = {
            role: formData.role,
            fullName: formData.fullName,
            email: formData.email,
            auditorId: formData.auditorId || `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
            organizationName: formData.organizationName,
            industry: formData.industry,
            password: formData.password,
            createdAt: new Date().toISOString(),
        };

        localStorage.setItem('ravel_registered_user', JSON.stringify(newUser));

        setFormData({
            role: 'Auditor',
            password: '',
            confirmPassword: '',
            fullName: '',
            email: '',
            auditorId: '',
            organizationName: '',
            industry: 'Financial Services',
            agreeToTerms: false,
        });

        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);

            setTimeout(() => {
                navigate('/login');
            }, 1500);
        }, 600);
    };

    return (
        <div
            className="signup-container"
            style={{ '--bg-image': `url(${bgImage})` }}
        >
            <Card className="signup-card">
                <div className="signup-header">
                    <div className="brand-logo-container" style={{ marginBottom: '12px' }}>
                        <Logo iconSize={80} scale={1.8} showText={false} />
                    </div>
                    <h1 className="brand-name">Ravel</h1>
                    <h2 className="signup-title">Create Your Auditor Account</h2>
                    <p className="brand-subtitle">
                        Forensic Audit & Relationship Mapping Platform
                    </p>
                </div>

                {isSubmitted ? (
                    <div className="success-screen">
                        <div className="success-icon">✓</div>
                        <h2>Account Created Successfully!</h2>
                        <p>Redirecting to login page...</p>
                    </div>
                ) : (
                    <form onSubmit={handleFormSubmit} className="signup-form">
                        <div className="form-grid">
                            {/* Left Column */}
                            <div className="form-col">
                                <div className="form-group">
                                    <label htmlFor="role" className="form-label">Assigned Role</label>
                                    <div className="select-wrapper" style={{ position: 'relative' }}>
                                        <select
                                            id="role"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            className="form-input form-select"
                                            style={{ appearance: 'none', WebkitAppearance: 'none', paddingRight: '30px' }}
                                        >
                                            <option value="Auditor"> Auditor</option>
                                            <option value="Senior Auditor"> Senior Auditor</option>
                                            <option value="Admin"> Admin</option>
                                        </select>
                                        <span className="dropdown-icon" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                            ▼
                                        </span>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">Create Password</label>
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

                                <div className="form-group">
                                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="Password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                {formData.password && (
                                    <div className="strength-meter">
                                        <div className={`strength-bar ${passwordStrength.class}`}></div>
                                        <span className="strength-text">Strength: {passwordStrength.label}</span>
                                    </div>
                                )}
                            </div>

                            {/* Middle Column */}
                            <div className="form-col">
                                <div className="form-group">
                                    <label htmlFor="fullName" className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        placeholder="Full Name"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">Institutional Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="@institution.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="auditorId" className="form-label">
                                        Primary Auditor ID <span className="optional">(Optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="auditorId"
                                        name="auditorId"
                                        placeholder="e.g., AUD-1234"
                                        value={formData.auditorId}
                                        onChange={handleInputChange}
                                        className="form-input glow-input"
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="form-col">
                                <div className="form-group">
                                    <label htmlFor="organizationName" className="form-label">Organization Name</label>
                                    <input
                                        type="text"
                                        id="organizationName"
                                        name="organizationName"
                                        placeholder="e.g., Auditing Co."
                                        value={formData.organizationName}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="industry" className="form-label">Organization Industry</label>
                                    <div className="select-wrapper" style={{ position: 'relative' }}>
                                        <select
                                            id="industry"
                                            name="industry"
                                            value={formData.industry}
                                            onChange={handleInputChange}
                                            className="form-input form-select"
                                            style={{ appearance: 'none', WebkitAppearance: 'none', paddingRight: '30px' }}
                                        >
                                            <option value="Financial Services"> Financial Services</option>
                                            <option value="Government"> Government</option>
                                            <option value="Law Enforcement"> Law Enforcement</option>
                                            <option value="Non-Profit"> Non-Profit</option>
                                            <option value="Corporate">Corporate</option>
                                            <option value="Legal"> Legal</option>
                                        </select>
                                        <span className="dropdown-icon" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                            ▼
                                        </span>
                                    </div>
                                </div>

                                <div className="form-group compliance-group">
                                    <label className="form-label">Compliance Agreement</label>
                                    <label className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            name="agreeToTerms"
                                            checked={formData.agreeToTerms}
                                            onChange={handleInputChange}
                                            className="checkbox-input"
                                            required
                                        />
                                        <span className="checkbox-text">
                                            I agree to the <a href="#terms" className="inline-link">Terms of Service</a> and <a href="#policy" className="inline-link">Data Handling Policy</a>. <span className="required-tag">(Required)</span>
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="submit-section">
                            <Button
                                type="submit"
                                variant="primary"
                                className="btn-submit"
                                disabled={isSubmitting || !formData.agreeToTerms || !isPasswordStrong}
                            >
                                {isSubmitting ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </div>
                    </form>
                )}

                <div className="signup-footer">
                    <p className="account-prompt">
                        Already have an account? <Link to="/login" className="inline-link">Log In</Link>
                    </p>
                    <p className="help-caption">
                        Need help? <a href="#docs" className="inline-link">Check the documentation</a>.
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default SignupPage;