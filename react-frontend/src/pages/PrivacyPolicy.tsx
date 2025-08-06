import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faUserShield, faUser, faDatabase, faLock, faCookieBite, faUserSecret, faUserFriends, faSyncAlt, faEnvelope, faArrowUp, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import './PrivacyPolicy.css';
import { Link } from 'react-router-dom';

const sidebarLinks = [
  { id: 'overview', label: 'Overview' },
  { id: 'collection', label: 'Information Collection' },
  { id: 'usage', label: 'Information Usage' },
  { id: 'sharing', label: 'Information Sharing' },
  { id: 'security', label: 'Data Security' },
  { id: 'cookies', label: 'Cookies & Tracking' },
  { id: 'rights', label: 'Your Rights' },
  { id: 'children', label: `Children's Privacy` },
  { id: 'changes', label: 'Policy Changes' },
  { id: 'contact', label: 'Contact Us' },
];

const PrivacyPolicy: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setShowScrollTop(scrollTop > 300);
      // Highlight active section in sidebar
      let found = 'overview';
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
    <div id="privacy-modern-page" className="privacy-page">
      <Helmet>
        <title>Privacy Policy - TypingHub.in 🔒</title>
        <meta name="description" content="Learn how TypingHub.in collects, uses, and protects your personal information." />
        <meta name="keywords" content="TypingHub privacy, data protection, user privacy" />
      </Helmet>
      {/* Hero Section */}
      <div className="privacy-hero-section">
        <div className="privacy-hero-content">
          <h1>Privacy Policy 🔒</h1>
          <p>Learn how we collect, use, and protect your personal information at TypingHub.in.</p>
        </div>
      </div>
      {/* Main Content Grid */}
      <div className="privacy-modern-content">
        {/* Sidebar */}
        <aside className="privacy-modern-sidebar">
          <div className="privacy-modern-sidebar-card">
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
        <div className="privacy-modern-sections">
          {/* 1. Overview */}
          <section id="overview" className="modern-panel-card privacy-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#1976d2' }}>
              <FontAwesomeIcon icon={faUserShield} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">Overview</h2>
            <p>At TypingHub.in, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>
            <h3>Scope</h3>
            <p>This policy applies to all information collected through:</p>
            <ul>
              <li>Our website (typinghub.in)</li>
              <li>Our typing tests and courses</li>
              <li>User accounts and profiles</li>
              <li>Customer support interactions</li>
            </ul>
            <div className="important-notice">
              <h4><FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#ff9800', marginRight: 8 }} /> Your Consent</h4>
              <p>By using our services, you consent to the collection and use of information in accordance with this policy.</p>
            </div>
          </section>
          {/* 2. Information Collection */}
          <section id="collection" className="modern-panel-card privacy-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#43a047' }}>
              <FontAwesomeIcon icon={faUser} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">Information Collection</h2>
            <h3>Personal Information</h3>
            <p>We collect the following types of personal information:</p>
            <ul>
              <li>Name and email address</li>
              <li>Account credentials</li>
              <li>Profile information</li>
              <li>Payment details (for premium services)</li>
            </ul>
            <h3>Usage Data</h3>
            <p>We automatically collect:</p>
            <ul>
              <li>Typing test results and statistics</li>
              <li>Course progress and performance</li>
              <li>Device and browser information</li>
              <li>IP address and location data</li>
            </ul>
            <div className="important-notice">
              <h4><FontAwesomeIcon icon={faDatabase} style={{ color: '#ff9800', marginRight: 8 }} /> Data Minimization</h4>
              <p>We only collect information that is necessary to provide and improve our services.</p>
            </div>
          </section>
          {/* 3. Information Usage */}
          <section id="usage" className="modern-panel-card privacy-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#fbc02d' }}>
              <FontAwesomeIcon icon={faUserFriends} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">Information Usage</h2>
            <h3>Primary Uses</h3>
            <p>We use your information to:</p>
            <ul>
              <li>Provide and maintain our services</li>
              <li>Track your typing progress</li>
              <li>Generate certificates</li>
              <li>Process payments</li>
              <li>Send important notifications</li>
            </ul>
            <h3>Secondary Uses</h3>
            <p>Additional uses include:</p>
            <ul>
              <li>Improving our services</li>
              <li>Analyzing user behavior</li>
              <li>Personalizing content</li>
              <li>Preventing fraud</li>
            </ul>
            <div className="important-notice">
              <h4><FontAwesomeIcon icon={faEnvelope} style={{ color: '#ff9800', marginRight: 8 }} /> Marketing Communications</h4>
              <p>You can opt out of marketing emails at any time through your account settings or by clicking the unsubscribe link in our emails.</p>
            </div>
          </section>
          {/* 4. Information Sharing */}
          <section id="sharing" className="modern-panel-card privacy-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#8e24aa' }}>
              <FontAwesomeIcon icon={faUserSecret} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">Information Sharing</h2>
            <h3>Third-Party Service Providers</h3>
            <p>We may share information with:</p>
            <ul>
              <li>Payment processors</li>
              <li>Analytics providers</li>
              <li>Cloud storage services</li>
              <li>Customer support tools</li>
            </ul>
            <h3>Legal Requirements</h3>
            <p>We may disclose information:</p>
            <ul>
              <li>To comply with laws</li>
              <li>To respond to legal requests</li>
              <li>To protect our rights</li>
              <li>In emergency situations</li>
            </ul>
            <div className="important-notice">
              <h4><FontAwesomeIcon icon={faLock} style={{ color: '#ff9800', marginRight: 8 }} /> Data Protection</h4>
              <p>We require all third-party service providers to respect the security of your personal data and treat it in accordance with applicable laws.</p>
            </div>
          </section>
          {/* 5. Data Security */}
          <section id="security" className="modern-panel-card privacy-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#1976d2' }}>
              <FontAwesomeIcon icon={faLock} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">Data Security</h2>
            <h3>Security Measures</h3>
            <p>We implement various security measures:</p>
            <ul>
              <li>SSL/TLS encryption</li>
              <li>Secure data storage</li>
              <li>Regular security audits</li>
              <li>Access controls</li>
            </ul>
            <h3>Data Retention</h3>
            <p>We retain your information:</p>
            <ul>
              <li>As long as your account is active</li>
              <li>As needed to provide services</li>
              <li>As required by law</li>
            </ul>
            <div className="important-notice">
              <h4><FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#ff9800', marginRight: 8 }} /> Security Notice</h4>
              <p>While we implement strong security measures, no method of transmission over the internet is 100% secure.</p>
            </div>
          </section>
          {/* 6. Cookies & Tracking */}
          <section id="cookies" className="modern-panel-card privacy-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#43a047' }}>
              <FontAwesomeIcon icon={faCookieBite} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">Cookies & Tracking</h2>
            <h3>Cookie Usage</h3>
            <p>We use cookies for:</p>
            <ul>
              <li>Authentication</li>
              <li>Preferences</li>
              <li>Analytics</li>
              <li>Performance monitoring</li>
            </ul>
            <h3>Cookie Control</h3>
            <p>You can control cookies through:</p>
            <ul>
              <li>Browser settings</li>
              <li>Our cookie preferences tool</li>
              <li>Third-party opt-out tools</li>
            </ul>
            <div className="important-notice">
              <h4><FontAwesomeIcon icon={faCookieBite} style={{ color: '#ff9800', marginRight: 8 }} /> Cookie Notice</h4>
              <p>By using our website, you consent to the use of cookies in accordance with this policy.</p>
            </div>
          </section>
          {/* 7. Your Rights */}
          <section id="rights" className="modern-panel-card privacy-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#fbc02d' }}>
              <FontAwesomeIcon icon={faUserShield} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">Your Rights</h2>
            <h3>Data Rights</h3>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request data deletion</li>
              <li>Restrict processing</li>
              <li>Data portability</li>
            </ul>
            <h3>Exercise Your Rights</h3>
            <p>To exercise these rights:</p>
            <ul>
              <li>Use account settings</li>
              <li>Contact our support team</li>
              <li>Submit a formal request</li>
            </ul>
            <div className="important-notice">
              <h4><FontAwesomeIcon icon={faEnvelope} style={{ color: '#ff9800', marginRight: 8 }} /> Response Time</h4>
              <p>We will respond to all legitimate data rights requests within 30 days.</p>
            </div>
          </section>
          {/* 8. Children's Privacy */}
          <section id="children" className="modern-panel-card privacy-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#8e24aa' }}>
              <FontAwesomeIcon icon={faUserFriends} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">Children's Privacy</h2>
            <p>Our services are not intended for children under 12 years of age. We do not knowingly collect personal information from children under 12.</p>
            <h3>Age Restrictions</h3>
            <ul>
              <li>Users must be 12+ to create an account</li>
              <li>Special protections for young users</li>
            </ul>
            <div className="important-notice">
              <h4><FontAwesomeIcon icon={faUserShield} style={{ color: '#ff9800', marginRight: 8 }} /> Parental Rights</h4>
              <p>Parents can review, delete, or refuse further collection of their child's information by contacting us.</p>
            </div>
          </section>
          {/* 9. Policy Changes */}
          <section id="changes" className="modern-panel-card privacy-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#1976d2' }}>
              <FontAwesomeIcon icon={faSyncAlt} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">Policy Changes</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by:</p>
            <ul>
              <li>Posting the new policy on this page</li>
              <li>Updating the "Last Updated" date</li>
              <li>Sending an email notification</li>
            </ul>
            <div className="important-notice">
              <h4><FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#ff9800', marginRight: 8 }} /> Review Changes</h4>
              <p>We encourage you to review this policy periodically for any changes.</p>
            </div>
          </section>
          {/* 10. Contact Us */}
          <section id="contact" className="modern-panel-card privacy-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#43a047' }}>
              <FontAwesomeIcon icon={faEnvelope} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <ul>
              <li>Email: Contact@typinghub.in</li>
              <li>Contact Form: <Link to="/contact-us">Contact Us</Link></li>
            </ul>
            <div className="important-notice">
              <h4><FontAwesomeIcon icon={faUserShield} style={{ color: '#ff9800', marginRight: 8 }} /> Data Protection Officer</h4>
              <p>For specific privacy concerns, you can reach our Data Protection Officer at dpo@typinghub.in</p>
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

export default PrivacyPolicy; 