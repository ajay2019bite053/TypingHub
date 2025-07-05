import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import './PrivacyPolicy.css';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    // Smooth scrolling for navigation
    const handleNavClick = (e: MouseEvent) => {
      const link = e.target as HTMLAnchorElement;
      if (link.matches('.privacy-nav-list a')) {
        e.preventDefault();
        const targetId = link.getAttribute('href')?.substring(1);
        if (targetId) {
          const targetSection = document.getElementById(targetId);
          targetSection?.scrollIntoView({ behavior: 'smooth' });

          // Update active link
          document.querySelectorAll('.privacy-nav-list a').forEach(a => a.classList.remove('active'));
          link.classList.add('active');
        }
      }
    };

    // Highlight current section on scroll
    const handleScroll = () => {
      const sections = document.querySelectorAll('.privacy-section');
      let currentSection = '';

      sections.forEach((section) => {
        const sectionElement = section as HTMLElement;
        const sectionTop = sectionElement.offsetTop;
        const sectionHeight = sectionElement.clientHeight;
        if (window.pageYOffset >= sectionTop - 100) {
          currentSection = sectionElement.getAttribute('id') || '';
        }
      });

      document.querySelectorAll('.privacy-nav-list a').forEach(link => {
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
        <title>Privacy Policy - TypingHub.in 🔒</title>
        <meta name="description" content="Learn how TypingHub.in collects, uses, and protects your personal information." />
        <meta name="keywords" content="TypingHub privacy, data protection, user privacy" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Serif:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="privacy-hero-section">
        <div className="privacy-hero-content">
          <h1>Privacy Policy 🔒</h1>
          <p>Learn how we collect, use, and protect your personal information at TypingHub.in.</p>
        </div>
      </div>

      <div className="privacy-content">
        <aside className="privacy-nav">
          <div className="privacy-nav-list">
            <h2>Contents</h2>
            <ul>
              <li><a href="#overview" className="active">Overview</a></li>
              <li><a href="#collection">Information Collection</a></li>
              <li><a href="#usage">Information Usage</a></li>
              <li><a href="#sharing">Information Sharing</a></li>
              <li><a href="#security">Data Security</a></li>
              <li><a href="#cookies">Cookies & Tracking</a></li>
              <li><a href="#rights">Your Rights</a></li>
              <li><a href="#children">Children's Privacy</a></li>
              <li><a href="#changes">Policy Changes</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>
        </aside>

        <div className="privacy-sections">
          <section id="overview" className="privacy-section">
            <h2>1. Overview</h2>
            <p>At TypingHub.in, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>
            
            <h3>1.1 Scope</h3>
            <p>This policy applies to all information collected through:</p>
            <ul>
              <li>Our website (typinghub.in)</li>
              <li>Our typing tests and courses</li>
              <li>User accounts and profiles</li>
              <li>Customer support interactions</li>
            </ul>

            <div className="data-box">
              <h4>Your Consent</h4>
              <p>By using our services, you consent to the collection and use of information in accordance with this policy.</p>
            </div>
          </section>

          <section id="collection" className="privacy-section">
            <h2>2. Information Collection</h2>
            <h3>2.1 Personal Information</h3>
            <p>We collect the following types of personal information:</p>
            <ul>
              <li>Name and email address</li>
              <li>Account credentials</li>
              <li>Profile information</li>
              <li>Payment details (for premium services)</li>
            </ul>

            <h3>2.2 Usage Data</h3>
            <p>We automatically collect:</p>
            <ul>
              <li>Typing test results and statistics</li>
              <li>Course progress and performance</li>
              <li>Device and browser information</li>
              <li>IP address and location data</li>
            </ul>

            <div className="data-box">
              <h4>Data Minimization</h4>
              <p>We only collect information that is necessary to provide and improve our services.</p>
            </div>
          </section>

          <section id="usage" className="privacy-section">
            <h2>3. Information Usage</h2>
            <h3>3.1 Primary Uses</h3>
            <p>We use your information to:</p>
            <ul>
              <li>Provide and maintain our services</li>
              <li>Track your typing progress</li>
              <li>Generate certificates</li>
              <li>Process payments</li>
              <li>Send important notifications</li>
            </ul>

            <h3>3.2 Secondary Uses</h3>
            <p>Additional uses include:</p>
            <ul>
              <li>Improving our services</li>
              <li>Analyzing user behavior</li>
              <li>Personalizing content</li>
              <li>Preventing fraud</li>
            </ul>

            <div className="data-box">
              <h4>Marketing Communications</h4>
              <p>You can opt out of marketing emails at any time through your account settings or by clicking the unsubscribe link in our emails.</p>
            </div>
          </section>

          <section id="sharing" className="privacy-section">
            <h2>4. Information Sharing</h2>
            <h3>4.1 Third-Party Service Providers</h3>
            <p>We may share information with:</p>
            <ul>
              <li>Payment processors</li>
              <li>Analytics providers</li>
              <li>Cloud storage services</li>
              <li>Customer support tools</li>
            </ul>

            <h3>4.2 Legal Requirements</h3>
            <p>We may disclose information:</p>
            <ul>
              <li>To comply with laws</li>
              <li>To respond to legal requests</li>
              <li>To protect our rights</li>
              <li>In emergency situations</li>
            </ul>

            <div className="data-box">
              <h4>Data Protection</h4>
              <p>We require all third-party service providers to respect the security of your personal data and treat it in accordance with applicable laws.</p>
            </div>
          </section>

          <section id="security" className="privacy-section">
            <h2>5. Data Security</h2>
            <h3>5.1 Security Measures</h3>
            <p>We implement various security measures:</p>
            <ul>
              <li>SSL/TLS encryption</li>
              <li>Secure data storage</li>
              <li>Regular security audits</li>
              <li>Access controls</li>
            </ul>

            <h3>5.2 Data Retention</h3>
            <p>We retain your information:</p>
            <ul>
              <li>As long as your account is active</li>
              <li>As needed to provide services</li>
              <li>As required by law</li>
            </ul>

            <div className="data-box">
              <h4>Security Notice</h4>
              <p>While we implement strong security measures, no method of transmission over the internet is 100% secure.</p>
            </div>
          </section>

          <section id="cookies" className="privacy-section">
            <h2>6. Cookies & Tracking</h2>
            <h3>6.1 Cookie Usage</h3>
            <p>We use cookies for:</p>
            <ul>
              <li>Authentication</li>
              <li>Preferences</li>
              <li>Analytics</li>
              <li>Performance monitoring</li>
            </ul>

            <h3>6.2 Cookie Control</h3>
            <p>You can control cookies through:</p>
            <ul>
              <li>Browser settings</li>
              <li>Our cookie preferences tool</li>
              <li>Third-party opt-out tools</li>
            </ul>

            <div className="data-box">
              <h4>Cookie Notice</h4>
              <p>By using our website, you consent to the use of cookies in accordance with this policy.</p>
            </div>
          </section>

          <section id="rights" className="privacy-section">
            <h2>7. Your Rights</h2>
            <h3>7.1 Data Rights</h3>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request data deletion</li>
              <li>Restrict processing</li>
              <li>Data portability</li>
            </ul>

            <h3>7.2 Exercise Your Rights</h3>
            <p>To exercise these rights:</p>
            <ul>
              <li>Use account settings</li>
              <li>Contact our support team</li>
              <li>Submit a formal request</li>
            </ul>

            <div className="data-box">
              <h4>Response Time</h4>
              <p>We will respond to all legitimate data rights requests within 30 days.</p>
            </div>
          </section>

          <section id="children" className="privacy-section">
            <h2>8. Children's Privacy</h2>
            <p>Our services are not intended for children under 12 years of age. We do not knowingly collect personal information from children under 12.</p>

            <h3>8.1 Age Restrictions</h3>
            <ul>
              <li>Users must be 12+ to create an account</li>
              <li>Special protections for young users</li>
            </ul>

            <div className="data-box">
              <h4>Parental Rights</h4>
              <p>Parents can review, delete, or refuse further collection of their child's information by contacting us.</p>
            </div>
          </section>

          <section id="changes" className="privacy-section">
            <h2>9. Policy Changes</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by:</p>
            <ul>
              <li>Posting the new policy on this page</li>
              <li>Updating the "Last Updated" date</li>
              <li>Sending an email notification</li>
            </ul>

            <div className="data-box">
              <h4>Review Changes</h4>
              <p>We encourage you to review this policy periodically for any changes.</p>
            </div>
          </section>

          <section id="contact" className="privacy-section">
            <h2>10. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <ul>
              <li>Email: privacy@typinghub.in</li>
              <li>Contact Form: <a href="contact-us.html">Contact Us</a></li>
            </ul>

            <div className="data-box">
              <h4>Data Protection Officer</h4>
              <p>For specific privacy concerns, you can reach our Data Protection Officer at dpo@typinghub.in</p>
            </div>

            <p className="last-updated">Last Updated: March 15, 2024</p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy; 