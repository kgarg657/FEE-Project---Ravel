import React, { useState } from 'react';
import { 
  ChevronDown, 
  Database, 
  Network, 
  UserCheck, 
  LineChart 
} from 'lucide-react';
import Logo from '../components/Logo';
import './Landing.css';

import imgDashboard from '../assets/auditor-dashboard.png';
import imgCanvas from '../assets/investigation-canvas.png';
import imgRegistry from '../assets/entity-registry.png';
import imgAnalytics from '../assets/deep-analytics.png';

export default function Landing({ onNavigate }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [contact, setContact] = useState({ name: '', email: '', msg: '' });

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const closeDropdowns = () => setActiveDropdown(null);

  const handleLogoClick = () => {
    window.location.reload();
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContact({ name: '', email: '', msg: '' });
    }, 4000);
  };

  return (
    <div className="landing-page" onClick={closeDropdowns}>
      {/* 1. Navbar */}
      <header className="landing-nav" onClick={(e) => e.stopPropagation()}>
        <div className="landing-nav-brand" onClick={handleLogoClick} title="Reload Page">
          <Logo />
        </div>

        <nav className="landing-nav-links">
          {/* Product Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => toggleDropdown('platform')}
              className={`nav-dropdown-btn ${activeDropdown === 'platform' ? 'active' : ''}`}
            >
              Product <ChevronDown size={13} />
            </button>

            {activeDropdown === 'platform' && (
              <div className="mega-dropdown-panel" style={{ left: '-60px', width: '420px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div className="dropdown-col-title">Capabilities</div>
                  <ul className="dropdown-item-list">
                    <li className="dropdown-item" onClick={() => onNavigate('/canvas')}>Graph Visualizer</li>
                    <li className="dropdown-item" onClick={() => onNavigate('/registry')}>Master Entity Registry</li>
                    <li className="dropdown-item" onClick={() => onNavigate('/analytics')}>Deep Analytics</li>
                  </ul>
                </div>
                <div>
                  <div className="dropdown-col-title">Engine</div>
                  <ul className="dropdown-item-list">
                    <li className="dropdown-item" style={{ color: '#64748b' }}>BFS Path Tracing</li>
                    <li className="dropdown-item" style={{ color: '#64748b' }}>Cycle Detection</li>
                    <li className="dropdown-item" style={{ color: '#64748b' }}>Entity Resolution</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Solutions Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => toggleDropdown('solutions')}
              className={`nav-dropdown-btn ${activeDropdown === 'solutions' ? 'active' : ''}`}
            >
              Solutions <ChevronDown size={13} />
            </button>

            {activeDropdown === 'solutions' && (
              <div className="mega-dropdown-panel" style={{ left: '-80px', width: '380px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
                <div>
                  <div className="dropdown-col-title">Use Cases</div>
                  <ul className="dropdown-item-list">
                    <li className="dropdown-item" onClick={() => onNavigate('/canvas')} style={{ color: '#38bdf8', fontWeight: 600 }}>
                      Financial Crime
                    </li>
                    {['Counter Fraud', 'AML / CTF', 'Supply Chain'].map((item, i) => (
                      <li key={i} className="dropdown-item" style={{ color: '#64748b' }}>
                        <span>{item}</span>
                        <span className="coming-soon-tag">Soon</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="dropdown-col-title" style={{ color: '#64748b' }}>Industry</div>
                  <ul className="dropdown-item-list" style={{ fontSize: '12px', color: '#94a3b8' }}>
                    <li>Banking</li>
                    <li>Insurance</li>
                    <li>Public Sector</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Resources Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => toggleDropdown('resources')}
              className={`nav-dropdown-btn ${activeDropdown === 'resources' ? 'active' : ''}`}
            >
              Resources <ChevronDown size={13} />
            </button>

            {activeDropdown === 'resources' && (
              <div className="mega-dropdown-panel" style={{ left: '-60px', width: '300px' }}>
                <div className="dropdown-col-title">Forensic Guides</div>
                <ul className="dropdown-item-list">
                  <li className="dropdown-item" onClick={() => onNavigate('/analytics')}>What is Entity Resolution?</li>
                  <li className="dropdown-item" onClick={() => onNavigate('/analytics')}>Multi-Hop Graph Analytics</li>
                </ul>
              </div>
            )}
          </div>
        </nav>

        <div className="nav-actions">
          <button onClick={scrollToContact} className="nav-dropdown-btn">
            Contact Us
          </button>
          <button onClick={() => onNavigate('/signup')} className="btn-signup">
            Sign Up
          </button>
          <button onClick={() => onNavigate('/login')} className="btn-login">
            Log In
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="hero-wrapper">
        <div className="hero-content">
          <h1 className="hero-heading">
            Ravel: Untangle the Web of Internal Fraud
          </h1>
          <p className="hero-subtext">
            Automatically map relationships, detect hidden links, and expose shell vendor schemes with our powerful graph-based audit platform. Bridging SQL silos and graph visualization.
          </p>
          <div className="hero-buttons">
            <button onClick={() => onNavigate('/canvas')} className="btn-hero-primary">
              Get Started (Internal Auditors Only)
            </button>
            <button onClick={() => onNavigate('/analytics')} className="btn-hero-secondary">
              Explore Case Studies
            </button>
          </div>
        </div>
      </section>

      {/* 3. Process Section */}
      <section className="process-section">
        <h2 className="section-title">Expose Hidden Risks, Fast</h2>
        <p className="section-subtitle">Breakdown to set of internal forensic audit platform.</p>

        <div className="process-pipeline">
          <div className="process-card">
            <div className="process-card-icon"><Database size={18} /></div>
            <div className="process-card-text">Ingest Employee, Vendor, Invoice data</div>
          </div>

          <div className="process-arrow">→</div>

          <div className="process-card">
            <div className="process-card-icon"><Network size={18} /></div>
            <div className="process-card-text">Rule-Engine suggests connections (GST, Ref IDs, Contacts)</div>
          </div>

          <div className="process-arrow">→</div>

          <div className="process-card">
            <div className="process-card-icon"><UserCheck size={18} /></div>
            <div className="process-card-text">Human-in-the-Loop Approval</div>
          </div>

          <div className="process-arrow">→</div>

          <div className="process-card">
            <div className="process-card-icon"><LineChart size={18} /></div>
            <div className="process-card-text">Visual Analytics & Recursive CTE Path Tracing</div>
          </div>
        </div>
      </section>

      {/* 4. Unified Platform Showcase */}
      <section className="showcase-section">
        <h2 className="section-title">A Unified Platform for Forensic Investigation</h2>
        <p className="section-subtitle">Must-4 mock investigation with 4 internal pages.</p>

        <div className="showcase-grid">
          <div className="showcase-card" onClick={() => onNavigate('/analytics')}>
            <img src={imgDashboard} alt="Auditor Dashboard" className="showcase-img" />
            <div className="showcase-info">
              <div className="showcase-card-title">1. Auditor Dashboard</div>
              <div className="showcase-card-desc">Risk summaries & anomaly triggers</div>
            </div>
          </div>

          <div className="showcase-card" onClick={() => onNavigate('/canvas')}>
            <img src={imgCanvas} alt="Investigation Canvas" className="showcase-img" />
            <div className="showcase-info">
              <div className="showcase-card-title">2. Investigation Canvas</div>
              <div className="showcase-card-desc">Interactive React Flow graph with suggested lines</div>
            </div>
          </div>

          <div className="showcase-card" onClick={() => onNavigate('/registry')}>
            <img src={imgRegistry} alt="Entity Registry" className="showcase-img" />
            <div className="showcase-info">
              <div className="showcase-card-title">3. Master Entity Registry</div>
              <div className="showcase-card-desc">Tabular search & unified records</div>
            </div>
          </div>

          <div className="showcase-card" onClick={() => onNavigate('/analytics')}>
            <img src={imgAnalytics} alt="Deep Analytics" className="showcase-img" />
            <div className="showcase-info">
              <div className="showcase-card-title">4. Deep Analytics</div>
              <div className="showcase-card-desc">Recursive CTE outputs & circular loops</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Contact Anchor Section */}
      <section id="contact" className="contact-section">
        <div className="contact-box">
          <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '4px' }}>Contact Audit Team</h2>
          <p className="section-subtitle" style={{ textAlign: 'left', marginBottom: '24px' }}>Have inquiries regarding forensic integration?</p>

          {submitted ? (
            <div style={{ color: '#00bcd4', fontSize: '13px', fontWeight: 600 }}>Thank you. Inquiry transmitted.</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label-text">Auditor Name</label>
                <input
                  type="text"
                  required
                  className="form-control-input"
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label-text">Enterprise Email</label>
                <input
                  type="email"
                  required
                  className="form-control-input"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label-text">Audit Query</label>
                <textarea
                  rows={3}
                  required
                  className="form-control-textarea"
                  value={contact.msg}
                  onChange={(e) => setContact({ ...contact, msg: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-hero-primary" style={{ width: '100%', marginTop: '8px' }}>
                Contact Sales / Support
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="landing-footer-strip">
        <div>Security Compliance (ISO, SOC2) | Legal</div>
        <div className="footer-nav-links">
          <span className="footer-link" onClick={() => onNavigate('/canvas')}>Canvas</span>
          <span className="footer-link" onClick={() => onNavigate('/analytics')}>Analytics</span>
          <span className="footer-link" onClick={() => onNavigate('/registry')}>Registry</span>
        </div>
        <div>© 2026 Ravel Technologies. Internal Use Only.</div>
      </footer>
    </div>
  );
}