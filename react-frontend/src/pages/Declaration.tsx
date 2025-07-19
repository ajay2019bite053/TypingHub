import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faShieldAlt, faUserTie, faClipboardCheck, faArrowUp, faBook, faHeadset, faRocket, faChartBar, faCertificate, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/Footer/Footer';
import './Declaration.css';

const sidebarLinks = [
  { id: 'purpose', label: 'Purpose & Mission' },
  { id: 'commitments', label: 'Our Commitments' },
  { id: 'quality', label: 'Quality Assurance' },
  { id: 'fairness', label: 'Fair Practice' },
  { id: 'transparency', label: 'Transparency' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'support', label: 'User Support' },
  { id: 'updates', label: 'Platform Updates' },
  { id: 'compliance', label: 'Legal Compliance' },
  { id: 'feedback', label: 'User Feedback' },
];

const Declaration: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState('purpose');

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setShowScrollTop(scrollTop > 300);
      // Highlight active section in sidebar
      let found = 'purpose';
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
    <div id="declaration-modern-page" className="declaration-page">
      <Helmet>
        <title>Declaration - TypingHub.in 📜</title>
        <meta name="description" content="Read about TypingHub.in's commitments, standards, and policies for providing quality typing education and practice." />
        <meta name="keywords" content="TypingHub declaration, typing test standards, typing practice policies" />
      </Helmet>
      {/* Hero Section */}
      <div className="declaration-hero-section">
        <div className="declaration-hero-content">
          <h1>Our Declaration & Commitments</h1>
          <p>We promise to deliver the highest standards in typing education, practice, and support for all government exam aspirants.</p>
        </div>
      </div>
      {/* Main Content Grid */}
      <div className="declaration-modern-content">
        {/* Sidebar */}
        <aside className="declaration-modern-sidebar">
          <div className="declaration-modern-sidebar-card">
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
        <div className="declaration-modern-sections">
          {/* 1. Purpose & Mission */}
          <section id="purpose" className="modern-panel-card declaration-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#1976d2' }}>
              <FontAwesomeIcon icon={faRocket} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">Purpose & Mission</h2>
            <p>TypingHub.in is dedicated to providing high-quality typing practice and assessment tools to help individuals improve their typing skills and prepare for various government examinations.</p>
            <div className="commitment-card">
              <h4><FontAwesomeIcon icon={faLightbulb} style={{ color: '#fbc02d', marginRight: 8 }} /> Mission Statement</h4>
              <p>To provide accessible, reliable, and comprehensive typing practice resources that empower users to excel in their typing tests and professional endeavors.</p>
            </div>
          </section>
          {/* 2. Our Commitments */}
          <section id="commitments" className="modern-panel-card declaration-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#43a047' }}>
              <FontAwesomeIcon icon={faClipboardCheck} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">Our Commitments</h2>
            <ul>
              <li>Providing accurate and reliable typing tests</li>
              <li>Maintaining platform availability and performance</li>
              <li>Ensuring data security and privacy</li>
              <li>Offering comprehensive learning resources</li>
              <li>Delivering timely support and assistance</li>
            </ul>
            <div className="commitment-card">
              <h4><FontAwesomeIcon icon={faChartBar} style={{ color: '#1976d2', marginRight: 8 }} /> Platform Availability</h4>
              <p>We strive to maintain 99.9% uptime for our services, with scheduled maintenance during off-peak hours.</p>
            </div>
            <div className="commitment-card">
              <h4><FontAwesomeIcon icon={faHeadset} style={{ color: '#43a047', marginRight: 8 }} /> Response Time</h4>
              <p>Support tickets are addressed within 24 hours, with critical issues receiving priority attention.</p>
            </div>
          </section>
          {/* 3. Quality Assurance */}
          <section id="quality" className="modern-panel-card declaration-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#fbc02d' }}>
              <FontAwesomeIcon icon={faCertificate} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">Quality Assurance</h2>
            <ul>
              <li>Regular testing and validation of typing passages</li>
              <li>Continuous monitoring of system performance</li>
              <li>Periodic audits of test accuracy</li>
              <li>Implementation of user feedback</li>
            </ul>
            <div className="commitment-card">
              <h4><FontAwesomeIcon icon={faShieldAlt} style={{ color: '#fbc02d', marginRight: 8 }} /> Accuracy Measurement</h4>
              <p>Our typing tests use standardized algorithms to ensure consistent and fair evaluation of speed and accuracy.</p>
            </div>
          </section>
          {/* 4. Fair Practice */}
          <section id="fairness" className="modern-panel-card declaration-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#8e24aa' }}>
              <FontAwesomeIcon icon={faUserTie} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">Fair Practice</h2>
            <ul>
              <li>Standardized test conditions</li>
              <li>Transparent evaluation criteria</li>
              <li>Equal access to resources</li>
              <li>Non-discriminatory practices</li>
            </ul>
            <div className="commitment-card">
              <h4><FontAwesomeIcon icon={faShieldAlt} style={{ color: '#8e24aa', marginRight: 8 }} /> Test Integrity</h4>
              <p>We implement various security measures to prevent unfair practices and maintain test credibility.</p>
            </div>
          </section>
          {/* 5. Transparency */}
          <section id="transparency" className="modern-panel-card declaration-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#1976d2' }}>
              <FontAwesomeIcon icon={faBook} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">Transparency</h2>
            <ul>
              <li>Clear display of all charges</li>
              <li>No hidden fees or costs</li>
              <li>Transparent refund policies</li>
            </ul>
            <div className="commitment-card">
              <h4><FontAwesomeIcon icon={faChartBar} style={{ color: '#1976d2', marginRight: 8 }} /> Performance Evaluation</h4>
              <p>All typing test results are calculated using transparent methods, with detailed breakdowns available to users.</p>
            </div>
          </section>
          {/* 6. Accessibility */}
          <section id="accessibility" className="modern-panel-card declaration-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#43a047' }}>
              <FontAwesomeIcon icon={faClipboardCheck} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">Accessibility</h2>
            <ul>
              <li>Supporting multiple devices and browsers</li>
              <li>Providing keyboard navigation options</li>
              <li>Offering content in multiple languages</li>
              <li>Implementing accessibility standards</li>
            </ul>
            <div className="commitment-card">
              <h4><FontAwesomeIcon icon={faLightbulb} style={{ color: '#fbc02d', marginRight: 8 }} /> Universal Access</h4>
              <p>Our platform is designed to be usable by people with different abilities and technical backgrounds.</p>
            </div>
          </section>
          {/* 7. User Support */}
          <section id="support" className="modern-panel-card declaration-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#fbc02d' }}>
              <FontAwesomeIcon icon={faHeadset} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">User Support</h2>
            <ul>
              <li>Email support: support@typinghub.in</li>
              <li>Live chat assistance</li>
              <li>Help documentation</li>
              <li>Video tutorials</li>
            </ul>
            <div className="commitment-card">
              <h4><FontAwesomeIcon icon={faHeadset} style={{ color: '#43a047', marginRight: 8 }} /> Response Guarantee</h4>
              <p>We aim to respond to all support queries within 24 hours, with most issues resolved within 48 hours.</p>
            </div>
          </section>
          {/* 8. Platform Updates */}
          <section id="updates" className="modern-panel-card declaration-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#8e24aa' }}>
              <FontAwesomeIcon icon={faChartBar} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">Platform Updates</h2>
            <ul>
              <li>Regular feature updates</li>
              <li>Security patches</li>
              <li>Performance optimizations</li>
              <li>Content additions</li>
            </ul>
            <div className="commitment-card">
              <h4><FontAwesomeIcon icon={faChartBar} style={{ color: '#8e24aa', marginRight: 8 }} /> Update Communication</h4>
              <p>All significant platform changes are communicated to users in advance through email notifications and platform announcements.</p>
            </div>
          </section>
          {/* 9. Legal Compliance */}
          <section id="compliance" className="modern-panel-card declaration-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#1976d2' }}>
              <FontAwesomeIcon icon={faShieldAlt} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">Legal Compliance</h2>
            <ul>
              <li>Data protection regulations</li>
              <li>Privacy laws</li>
              <li>Consumer protection guidelines</li>
              <li>Educational standards</li>
            </ul>
            <div className="commitment-card">
              <h4><FontAwesomeIcon icon={faCertificate} style={{ color: '#1976d2', marginRight: 8 }} /> Certification Standards</h4>
              <p>Our typing certificates comply with relevant educational and professional standards while clearly stating their scope and limitations.</p>
            </div>
          </section>
          {/* 10. User Feedback */}
          <section id="feedback" className="modern-panel-card declaration-modern-section">
            <div className="modern-panel-icon-wrapper" style={{ background: '#43a047' }}>
              <FontAwesomeIcon icon={faLightbulb} className="modern-panel-icon" />
            </div>
            <h2 className="modern-panel-title">User Feedback</h2>
            <ul>
              <li>Regular user surveys</li>
              <li>Feature request system</li>
              <li>Bug reporting channels</li>
              <li>Community discussions</li>
            </ul>
            <div className="commitment-card">
              <h4><FontAwesomeIcon icon={faLightbulb} style={{ color: '#fbc02d', marginRight: 8 }} /> Continuous Improvement</h4>
              <p>User feedback is regularly reviewed and incorporated into our development roadmap to enhance the platform.</p>
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
      <Footer />
    </div>
  );
};

export default Declaration; 
 