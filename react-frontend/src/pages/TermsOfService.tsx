import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faClipboardCheck, faShieldAlt, faBook, faUserTie, faArrowUp, faExclamationTriangle, faGavel, faUser, faBan, faFileContract, faMoneyBill, faTimesCircle, faBalanceScale, faCopyright, faEdit } from '@fortawesome/free-solid-svg-icons';
import './TermsOfService.css';

const sidebarLinks = [
  { id: 'acceptance', label: 'Acceptance of Terms' },
  { id: 'services', label: 'Services' },
  { id: 'accounts', label: 'User Accounts' },
  { id: 'conduct', label: 'User Conduct' },
  { id: 'content', label: 'Content' },
  { id: 'payments', label: 'Payments' },
  { id: 'termination', label: 'Termination' },
  { id: 'liability', label: 'Liability' },
  { id: 'intellectual', label: 'Intellectual Property' },
  { id: 'modifications', label: 'Modifications' },
];

const TermsOfService: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState('acceptance');

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setShowScrollTop(scrollTop > 300);
      // Highlight active section in sidebar
      let found = 'acceptance';
      for (const link of sidebarLinks) {
        const el = document.getElementById(link.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) found = link.id;
        }
      }
      setActiveSection(found);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="terms-modern-page" className="terms-page">
      <Helmet>
        <title>Terms of Service - TypingHub.in 📋</title>
        <meta name="description" content="Read TypingHub.in's Terms of Service to understand your rights and responsibilities while using our platform." />
        <meta name="keywords" content="TypingHub terms, typing test terms, typing course agreement" />
      </Helmet>
      {/* Hero Section */}
      <div className="terms-hero-section">
        <div className="terms-hero-content">
          <h1>Terms of Service 📋</h1>
          <p>Please read these terms carefully before using TypingHub.in's services.</p>
        </div>
      </div>
      {/* Main Content Grid */}
      <div className="terms-modern-content">
        {/* Sidebar */}
        <aside className="terms-modern-sidebar">
          <div className="terms-modern-sidebar-card">
            <h2>Contents</h2>
            <ul>
              {sidebarLinks.map(link => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className={activeSection === link.id ? 'active' : ''}
                    onClick={e => { e.preventDefault(); scrollToSection(link.id); }}
                  >
                    <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: 8, color: '#1976d2' }} />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        {/* Sections */}
        <div className="terms-modern-sections">
          {/* 1. Acceptance of Terms */}
          <section id="acceptance" className="modern-panel-card terms-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#1976d2' }}>
              <FontAwesomeIcon icon={faClipboardCheck} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">Acceptance of Terms</h2>
            <p>By accessing or using TypingHub.in, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
            <div className="important-notice">
              <h4><FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#ff9800', marginRight: 8 }} /> Important Notice</h4>
              <p>These terms constitute a legally binding agreement between you and TypingHub.in. Please review them carefully before proceeding.</p>
            </div>
          </section>
          {/* 2. Services */}
          <section id="services" className="modern-panel-card terms-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#43a047' }}>
              <FontAwesomeIcon icon={faBook} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">Services</h2>
            <h3>Service Description</h3>
            <ul>
              <li>Online typing tests and practice sessions</li>
              <li>Typing courses and tutorials</li>
              <li>Performance tracking and analytics</li>
              <li>Typing certificates upon completion</li>
            </ul>
            <h3>Service Availability</h3>
            <p>While we strive to provide uninterrupted service, we do not guarantee that:</p>
            <ul>
              <li>The service will be available at all times</li>
              <li>The service will be error-free</li>
              <li>Any defects will be corrected immediately</li>
            </ul>
            <div className="important-notice">
              <h4><FontAwesomeIcon icon={faEdit} style={{ color: '#ff9800', marginRight: 8 }} /> Service Modifications</h4>
              <p>We reserve the right to modify, suspend, or discontinue any part of our services without prior notice.</p>
            </div>
          </section>
          {/* 3. User Accounts */}
          <section id="accounts" className="modern-panel-card terms-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#fbc02d' }}>
              <FontAwesomeIcon icon={faUser} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">User Accounts</h2>
            <h3>Account Creation</h3>
            <ul>
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for maintaining account security</li>
              <li>You must be at least 13 years old to create an account</li>
            </ul>
            <h3>Account Responsibilities</h3>
            <p>You are responsible for:</p>
            <ul>
              <li>All activities under your account</li>
              <li>Maintaining password confidentiality</li>
              <li>Updating your account information</li>
              <li>Reporting unauthorized access</li>
            </ul>
          </section>
          {/* 4. User Conduct */}
          <section id="conduct" className="modern-panel-card terms-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#8e24aa' }}>
              <FontAwesomeIcon icon={faBan} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">User Conduct</h2>
            <h3>Prohibited Activities</h3>
            <p>You agree not to:</p>
            <ul>
              <li>Use automated tools or bots</li>
              <li>Attempt to manipulate test results</li>
              <li>Share account credentials</li>
              <li>Violate any applicable laws</li>
              <li>Interfere with platform security</li>
            </ul>
            <div className="important-notice">
              <h4><FontAwesomeIcon icon={faTimesCircle} style={{ color: '#ff9800', marginRight: 8 }} /> Zero Tolerance Policy</h4>
              <p>Any violation of these conduct guidelines may result in immediate account termination.</p>
            </div>
          </section>
          {/* 5. Content */}
          <section id="content" className="modern-panel-card terms-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#1976d2' }}>
              <FontAwesomeIcon icon={faFileContract} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">Content</h2>
            <h3>Platform Content</h3>
            <ul>
              <li>Protected by intellectual property rights</li>
              <li>For personal, non-commercial use only</li>
              <li>Subject to change without notice</li>
            </ul>
            <h3>User-Generated Content</h3>
            <p>By submitting content to our platform, you:</p>
            <ul>
              <li>Grant us a license to use the content</li>
              <li>Warrant that you have necessary rights</li>
              <li>Accept responsibility for the content</li>
            </ul>
          </section>
          {/* 6. Payments */}
          <section id="payments" className="modern-panel-card terms-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#43a047' }}>
              <FontAwesomeIcon icon={faMoneyBill} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">Payments</h2>
            <h3>Pricing</h3>
            <ul>
              <li>All prices are in Indian Rupees (INR)</li>
              <li>Prices are subject to change</li>
              <li>Applicable taxes will be added</li>
            </ul>
            <h3>Refunds</h3>
            <div className="important-notice">
              <h4><FontAwesomeIcon icon={faGavel} style={{ color: '#ff9800', marginRight: 8 }} /> Refund Policy</h4>
              <p>Refunds are processed according to our refund policy, available upon request. Generally, refunds are only provided for technical issues preventing service access.</p>
            </div>
          </section>
          {/* 7. Termination */}
          <section id="termination" className="modern-panel-card terms-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#fbc02d' }}>
              <FontAwesomeIcon icon={faTimesCircle} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">Termination</h2>
            <h3>Account Termination</h3>
            <p>We may terminate or suspend your account if you:</p>
            <ul>
              <li>Violate these terms</li>
              <li>Provide false information</li>
              <li>Engage in prohibited activities</li>
              <li>Fail to pay required fees</li>
            </ul>
            <h3>Effect of Termination</h3>
            <p>Upon termination:</p>
            <ul>
              <li>Access to services will cease</li>
              <li>Unused credits may be forfeited</li>
              <li>Content may be deleted</li>
            </ul>
          </section>
          {/* 8. Liability */}
          <section id="liability" className="modern-panel-card terms-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#8e24aa' }}>
              <FontAwesomeIcon icon={faBalanceScale} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">Liability</h2>
            <h3>Limitation of Liability</h3>
            <ul>
              <li>Indirect or consequential damages</li>
              <li>Loss of data or profits</li>
              <li>Service interruptions</li>
              <li>Third-party actions</li>
            </ul>
            <div className="important-notice">
              <h4><FontAwesomeIcon icon={faShieldAlt} style={{ color: '#ff9800', marginRight: 8 }} /> Disclaimer</h4>
              <p>Our services are provided "as is" without any warranty, express or implied.</p>
            </div>
          </section>
          {/* 9. Intellectual Property */}
          <section id="intellectual" className="modern-panel-card terms-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#1976d2' }}>
              <FontAwesomeIcon icon={faCopyright} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">Intellectual Property</h2>
            <h3>Ownership</h3>
            <ul>
              <li>Platform design and layout</li>
              <li>Content and materials</li>
              <li>Logos and trademarks</li>
              <li>Software and technology</li>
            </ul>
            <h3>Usage Rights</h3>
            <ul>
              <li>Access and use services</li>
              <li>Download permitted materials</li>
              <li>Print certificates earned</li>
            </ul>
          </section>
          {/* 10. Modifications to Terms */}
          <section id="modifications" className="modern-panel-card terms-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#43a047' }}>
              <FontAwesomeIcon icon={faEdit} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">Modifications to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website.</p>
            <h3>Notification of Changes</h3>
            <ul>
              <li>Major changes will be announced via email</li>
              <li>Continued use implies acceptance</li>
              <li>Regular review is recommended</li>
            </ul>
            <div className="important-notice">
              <h4><FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#ff9800', marginRight: 8 }} /> Your Responsibility</h4>
              <p>It is your responsibility to review these terms periodically for changes.</p>
            </div>
            <p className="last-updated">Last Updated: March 15, 2024</p>
          </section>
        </div>
      </div>
      {/* Scroll to Top Button */}
      <button 
        className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <FontAwesomeIcon icon={faArrowUp} />
      </button>
    </div>
  );
};

export default TermsOfService; 
 