import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Clear error for this specific field when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }

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

  // Email format validation helper
  const isValidEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Institutional Email is required';
    } else if (!isValidEmailFormat(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g., name@institution.com)';
    }

    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization Name is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (passwordStrength.label !== 'Strong') {
      newErrors.password = 'Password must be at least 10 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms to proceed';
    }

    return newErrors;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
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
          <form onSubmit={handleFormSubmit} className="signup-form" noValidate>
            <div className="form-grid">
              {/* Column 1 */}
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="role" className="form-label">Assigned Role</label>
                  <div className="select-wrapper">
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="form-input form-select"
                    >
                      <option value="Auditor">Auditor</option>
                      <option value="Senior Auditor">Senior Auditor</option>
                      <option value="Admin">Admin</option>
                    </select>
                    <span className="dropdown-icon">▼</span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Create Password <span className="required-star">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-input ${errors.password ? 'input-error' : ''}`}
                  />
                  {errors.password && <span className="field-error-text">{errors.password}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password <span className="required-star">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                  />
                  {errors.confirmPassword && <span className="field-error-text">{errors.confirmPassword}</span>}
                </div>

                {formData.password && (
                  <div className="strength-meter">
                    <div className={`strength-bar ${passwordStrength.class}`}></div>
                    <span className="strength-text">Strength: {passwordStrength.label}</span>
                  </div>
                )}
              </div>

              {/* Column 2 */}
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="fullName" className="form-label">
                    Full Name <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`form-input ${errors.fullName ? 'input-error' : ''}`}
                  />
                  {errors.fullName && <span className="field-error-text">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Institutional Email <span className="required-star">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="name@institution.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${errors.email ? 'input-error' : ''}`}
                  />
                  {errors.email && <span className="field-error-text">{errors.email}</span>}
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
                    className="form-input"
                  />
                </div>
              </div>

              {/* Column 3 */}
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="organizationName" className="form-label">
                    Organization Name <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="organizationName"
                    name="organizationName"
                    placeholder="e.g., Auditing Co."
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    className={`form-input ${errors.organizationName ? 'input-error' : ''}`}
                  />
                  {errors.organizationName && <span className="field-error-text">{errors.organizationName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="industry" className="form-label">Organization Industry</label>
                  <div className="select-wrapper">
                    <select
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="form-input form-select"
                    >
                      <option value="Financial Services">Financial Services</option>
                      <option value="Government">Government</option>
                      <option value="Law Enforcement">Law Enforcement</option>
                      <option value="Non-Profit">Non-Profit</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Legal">Legal</option>
                    </select>
                    <span className="dropdown-icon">▼</span>
                  </div>
                </div>

                <div className="form-group compliance-group">
                  <label className="form-label">
                    Compliance Agreement <span className="required-star">*</span>
                  </label>
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">
                      I agree to the <a href="#terms" className="inline-link">Terms of Service</a> and <a href="#policy" className="inline-link">Data Handling Policy</a>.
                    </span>
                  </label>
                  {errors.agreeToTerms && <span className="field-error-text">{errors.agreeToTerms}</span>}
                </div>
              </div>
            </div>

            <div className="submit-section">
              <Button
                type="submit"
                variant="primary"
                className="btn-submit"
                disabled={isSubmitting}
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