import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer/Footer';
import './Declaration.css';

const Declaration: React.FC = () => {
  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="main-content">
      <Helmet>
        <title>Declaration - TypingHub.in 📜</title>
        <meta name="description" content="Read about TypingHub.in's commitments, standards, and policies for providing quality typing education and practice." />
        <meta name="keywords" content="TypingHub declaration, typing test standards, typing practice policies" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Serif:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="container">
        <div className="panel">
      <div className="declaration-hero-section">
        <div className="declaration-hero-content">
          <h1>Declaration 📜</h1>
          <p>Our commitments and promises to provide quality typing services and maintain high standards.</p>
        </div>
      </div>

      <div className="declaration-content">
        <aside className="declaration-nav">
          <div className="declaration-nav-list">
            <h2>Contents</h2>
            <ul>
              <li><a href="#purpose" className="active">Purpose & Mission</a></li>
              <li><a href="#commitments">Our Commitments</a></li>
              <li><a href="#quality">Quality Assurance</a></li>
              <li><a href="#fairness">Fair Practice</a></li>
              <li><a href="#transparency">Transparency</a></li>
              <li><a href="#accessibility">Accessibility</a></li>
              <li><a href="#support">User Support</a></li>
              <li><a href="#updates">Platform Updates</a></li>
              <li><a href="#compliance">Legal Compliance</a></li>
              <li><a href="#feedback">User Feedback</a></li>
        </ul>
          </div>
        </aside>

        <div className="declaration-sections">
          <section id="purpose" className="declaration-section">
            <h2>1. Purpose & Mission</h2>
            <p>TypingHub.in is dedicated to providing high-quality typing practice and assessment tools to help individuals improve their typing skills and prepare for various government examinations.</p>
            
            <h3>1.1 Our Vision</h3>
            <p>To be the leading online platform for typing skill development and assessment in India, helping millions achieve their career goals through improved typing proficiency.</p>

            <div className="commitment-card">
              <h4>Mission Statement</h4>
              <p>To provide accessible, reliable, and comprehensive typing practice resources that empower users to excel in their typing tests and professional endeavors.</p>
            </div>
          </section>

          <section id="commitments" className="declaration-section">
            <h2>2. Our Commitments</h2>
            <h3>2.1 To Our Users</h3>
            <ul>
              <li>Providing accurate and reliable typing tests</li>
              <li>Maintaining platform availability and performance</li>
              <li>Ensuring data security and privacy</li>
              <li>Offering comprehensive learning resources</li>
              <li>Delivering timely support and assistance</li>
            </ul>

            <h3>2.2 Service Standards</h3>
            <div className="commitment-card">
              <h4>Platform Availability</h4>
              <p>We strive to maintain 99.9% uptime for our services, with scheduled maintenance during off-peak hours.</p>
            </div>
            <div className="commitment-card">
              <h4>Response Time</h4>
              <p>Support tickets are addressed within 24 hours, with critical issues receiving priority attention.</p>
            </div>
          </section>

          <section id="quality" className="declaration-section">
            <h2>3. Quality Assurance</h2>
            <p>We maintain high standards through:</p>
            <ul>
              <li>Regular testing and validation of typing passages</li>
              <li>Continuous monitoring of system performance</li>
              <li>Periodic audits of test accuracy</li>
              <li>Implementation of user feedback</li>
            </ul>

            <h3>3.1 Testing Standards</h3>
            <div className="commitment-card">
              <h4>Accuracy Measurement</h4>
              <p>Our typing tests use standardized algorithms to ensure consistent and fair evaluation of speed and accuracy.</p>
            </div>
          </section>

          <section id="fairness" className="declaration-section">
            <h2>4. Fair Practice</h2>
            <p>We are committed to providing equal opportunities to all users through:</p>
            <ul>
              <li>Standardized test conditions</li>
              <li>Transparent evaluation criteria</li>
              <li>Equal access to resources</li>
              <li>Non-discriminatory practices</li>
            </ul>

            <h3>4.1 Anti-Cheating Measures</h3>
            <div className="commitment-card">
              <h4>Test Integrity</h4>
              <p>We implement various security measures to prevent unfair practices and maintain test credibility.</p>
            </div>
          </section>

          <section id="transparency" className="declaration-section">
            <h2>5. Transparency</h2>
            <h3>5.1 Pricing</h3>
            <ul>
              <li>Clear display of all charges</li>
              <li>No hidden fees or costs</li>
              <li>Transparent refund policies</li>
            </ul>

            <h3>5.2 Results and Metrics</h3>
            <div className="commitment-card">
              <h4>Performance Evaluation</h4>
              <p>All typing test results are calculated using transparent methods, with detailed breakdowns available to users.</p>
            </div>
          </section>

          <section id="accessibility" className="declaration-section">
            <h2>6. Accessibility</h2>
            <p>We are committed to making our platform accessible to all users by:</p>
            <ul>
              <li>Supporting multiple devices and browsers</li>
              <li>Providing keyboard navigation options</li>
              <li>Offering content in multiple languages</li>
              <li>Implementing accessibility standards</li>
            </ul>

            <div className="commitment-card">
              <h4>Universal Access</h4>
              <p>Our platform is designed to be usable by people with different abilities and technical backgrounds.</p>
            </div>
          </section>

          <section id="support" className="declaration-section">
            <h2>7. User Support</h2>
            <h3>7.1 Support Channels</h3>
            <ul>
              <li>Email support: support@typinghub.in</li>
              <li>Live chat assistance</li>
              <li>Help documentation</li>
              <li>Video tutorials</li>
            </ul>

            <div className="commitment-card">
              <h4>Response Guarantee</h4>
              <p>We aim to respond to all support queries within 24 hours, with most issues resolved within 48 hours.</p>
            </div>
          </section>

          <section id="updates" className="declaration-section">
            <h2>8. Platform Updates</h2>
            <p>We continuously improve our platform through:</p>
            <ul>
              <li>Regular feature updates</li>
              <li>Security patches</li>
              <li>Performance optimizations</li>
              <li>Content additions</li>
            </ul>

            <div className="commitment-card">
              <h4>Update Communication</h4>
              <p>All significant platform changes are communicated to users in advance through email notifications and platform announcements.</p>
            </div>
          </section>

          <section id="compliance" className="declaration-section">
            <h2>9. Legal Compliance</h2>
            <h3>9.1 Regulatory Standards</h3>
            <ul>
              <li>Data protection regulations</li>
              <li>Privacy laws</li>
              <li>Consumer protection guidelines</li>
              <li>Educational standards</li>
            </ul>

            <div className="commitment-card">
              <h4>Certification Standards</h4>
              <p>Our typing certificates comply with relevant educational and professional standards while clearly stating their scope and limitations.</p>
            </div>
          </section>

          <section id="feedback" className="declaration-section">
            <h2>10. User Feedback</h2>
            <p>We value user input and incorporate it through:</p>
            <ul>
              <li>Regular user surveys</li>
              <li>Feature request system</li>
              <li>Bug reporting channels</li>
              <li>Community discussions</li>
            </ul>

            <div className="commitment-card">
              <h4>Continuous Improvement</h4>
              <p>User feedback is regularly reviewed and incorporated into our development roadmap to enhance the platform.</p>
          </div>

            <p className="last-updated">Last Updated: March 15, 2024</p>
          </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Declaration; 
 