import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import './TermsOfService.css';

const TermsOfService: React.FC = () => {
  useEffect(() => {
    // Smooth scrolling for navigation
    const handleNavClick = (e: MouseEvent) => {
      const link = e.target as HTMLAnchorElement;
      if (link.matches('.terms-nav-list a')) {
        e.preventDefault();
        const targetId = link.getAttribute('href')?.substring(1);
        if (targetId) {
          const targetSection = document.getElementById(targetId);
          targetSection?.scrollIntoView({ behavior: 'smooth' });

          // Update active link
          document.querySelectorAll('.terms-nav-list a').forEach(a => a.classList.remove('active'));
          link.classList.add('active');
        }
      }
    };

    // Highlight current section on scroll
    const handleScroll = () => {
      const sections = document.querySelectorAll('.terms-section');
      let currentSection = '';

      sections.forEach((section) => {
        const sectionElement = section as HTMLElement;
        const sectionTop = sectionElement.offsetTop;
        const sectionHeight = sectionElement.clientHeight;
        if (window.pageYOffset >= sectionTop - 100) {
          currentSection = sectionElement.getAttribute('id') || '';
        }
      });

      document.querySelectorAll('.terms-nav-list a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href')?.substring(1) === currentSection) {
          link.classList.add('active');
        }
      });
    };

    document.addEventListener('click', handleNavClick);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('click', handleNavClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <main className="main-content">
      <Helmet>
        <title>Terms of Service - TypingHub.in 📋</title>
        <meta name="description" content="Read TypingHub.in's Terms of Service to understand your rights and responsibilities while using our platform." />
        <meta name="keywords" content="TypingHub terms, typing test terms, typing course agreement" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Serif:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="terms-hero-section">
        <div className="terms-hero-content">
          <h1>Terms of Service 📋</h1>
          <p>Please read these terms carefully before using TypingHub.in's services.</p>
        </div>
      </div>

      <div className="terms-content">
        <aside className="terms-nav">
          <div className="terms-nav-list">
            <h2>Contents</h2>
            <ul>
              <li><a href="#acceptance" className="active">Acceptance of Terms</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#accounts">User Accounts</a></li>
              <li><a href="#conduct">User Conduct</a></li>
              <li><a href="#content">Content</a></li>
              <li><a href="#payments">Payments</a></li>
              <li><a href="#termination">Termination</a></li>
              <li><a href="#liability">Liability</a></li>
              <li><a href="#intellectual">Intellectual Property</a></li>
              <li><a href="#modifications">Modifications</a></li>
            </ul>
          </div>
        </aside>

        <div className="terms-sections">
          <section id="acceptance" className="terms-section">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using TypingHub.in, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
            
            <div className="important-notice">
              <h4>Important Notice</h4>
              <p>These terms constitute a legally binding agreement between you and TypingHub.in. Please review them carefully before proceeding.</p>
            </div>
          </section>

          <section id="services" className="terms-section">
            <h2>2. Services</h2>
            <h3>2.1 Service Description</h3>
            <p>TypingHub.in provides:</p>
            <ul>
              <li>Online typing tests and practice sessions</li>
              <li>Typing courses and tutorials</li>
              <li>Performance tracking and analytics</li>
              <li>Typing certificates upon completion</li>
            </ul>

            <h3>2.2 Service Availability</h3>
            <p>While we strive to provide uninterrupted service, we do not guarantee that:</p>
            <ul>
              <li>The service will be available at all times</li>
              <li>The service will be error-free</li>
              <li>Any defects will be corrected immediately</li>
            </ul>

            <div className="important-notice">
              <h4>Service Modifications</h4>
              <p>We reserve the right to modify, suspend, or discontinue any part of our services without prior notice.</p>
            </div>
          </section>

          <section id="accounts" className="terms-section">
            <h2>3. User Accounts</h2>
            <h3>3.1 Account Creation</h3>
            <ul>
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for maintaining account security</li>
              <li>You must be at least 13 years old to create an account</li>
            </ul>

            <h3>3.2 Account Responsibilities</h3>
            <p>You are responsible for:</p>
            <ul>
              <li>All activities under your account</li>
              <li>Maintaining password confidentiality</li>
              <li>Updating your account information</li>
              <li>Reporting unauthorized access</li>
            </ul>
          </section>

          <section id="conduct" className="terms-section">
            <h2>4. User Conduct</h2>
            <h3>4.1 Prohibited Activities</h3>
            <p>You agree not to:</p>
            <ul>
              <li>Use automated tools or bots</li>
              <li>Attempt to manipulate test results</li>
              <li>Share account credentials</li>
              <li>Violate any applicable laws</li>
              <li>Interfere with platform security</li>
            </ul>
            
            <div className="important-notice">
              <h4>Zero Tolerance Policy</h4>
              <p>Any violation of these conduct guidelines may result in immediate account termination.</p>
            </div>
          </section>

          <section id="content" className="terms-section">
            <h2>5. Content</h2>
            <h3>5.1 Platform Content</h3>
            <p>All content provided on TypingHub.in is:</p>
            <ul>
              <li>Protected by intellectual property rights</li>
              <li>For personal, non-commercial use only</li>
              <li>Subject to change without notice</li>
            </ul>
            
            <h3>5.2 User-Generated Content</h3>
            <p>By submitting content to our platform, you:</p>
            <ul>
              <li>Grant us a license to use the content</li>
              <li>Warrant that you have necessary rights</li>
              <li>Accept responsibility for the content</li>
            </ul>
          </section>

          <section id="payments" className="terms-section">
            <h2>6. Payments</h2>
            <h3>6.1 Pricing</h3>
            <ul>
              <li>All prices are in Indian Rupees (INR)</li>
              <li>Prices are subject to change</li>
              <li>Applicable taxes will be added</li>
            </ul>
            
            <h3>6.2 Refunds</h3>
            <div className="important-notice">
              <h4>Refund Policy</h4>
              <p>Refunds are processed according to our refund policy, available upon request. Generally, refunds are only provided for technical issues preventing service access.</p>
            </div>
          </section>

          <section id="termination" className="terms-section">
            <h2>7. Termination</h2>
            <h3>7.1 Account Termination</h3>
            <p>We may terminate or suspend your account if you:</p>
            <ul>
              <li>Violate these terms</li>
              <li>Provide false information</li>
              <li>Engage in prohibited activities</li>
              <li>Fail to pay required fees</li>
            </ul>
            
            <h3>7.2 Effect of Termination</h3>
            <p>Upon termination:</p>
            <ul>
              <li>Access to services will cease</li>
              <li>Unused credits may be forfeited</li>
              <li>Content may be deleted</li>
            </ul>
          </section>

          <section id="liability" className="terms-section">
            <h2>8. Liability</h2>
            <h3>8.1 Limitation of Liability</h3>
            <p>TypingHub.in is not liable for:</p>
            <ul>
              <li>Indirect or consequential damages</li>
              <li>Loss of data or profits</li>
              <li>Service interruptions</li>
              <li>Third-party actions</li>
            </ul>

            <div className="important-notice">
              <h4>Disclaimer</h4>
              <p>Our services are provided "as is" without any warranty, express or implied.</p>
            </div>
          </section>

          <section id="intellectual" className="terms-section">
            <h2>9. Intellectual Property</h2>
            <h3>9.1 Ownership</h3>
            <p>All rights are reserved for:</p>
            <ul>
              <li>Platform design and layout</li>
              <li>Content and materials</li>
              <li>Logos and trademarks</li>
              <li>Software and technology</li>
            </ul>

            <h3>9.2 Usage Rights</h3>
            <p>Users are granted limited license to:</p>
            <ul>
              <li>Access and use services</li>
              <li>Download permitted materials</li>
              <li>Print certificates earned</li>
            </ul>
          </section>

          <section id="modifications" className="terms-section">
            <h2>10. Modifications to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website.</p>
            
            <h3>10.1 Notification of Changes</h3>
            <ul>
              <li>Major changes will be announced via email</li>
              <li>Continued use implies acceptance</li>
              <li>Regular review is recommended</li>
            </ul>

            <div className="important-notice">
              <h4>Your Responsibility</h4>
              <p>It is your responsibility to review these terms periodically for changes.</p>
            </div>

            <p className="last-updated">Last Updated: March 15, 2024</p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default TermsOfService; 
 