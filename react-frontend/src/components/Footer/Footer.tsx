import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-section logo-section">
          <img src="/images/Main_LOGO.png" alt="TypingHub Logo" />
          <a 
            href="https://typinghub.in" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="domain-link"
          >
            TypingHub.in
          </a>
        </div>
        
        <div className="footer-section legal-section">
          <h3>Legal</h3>
          <div className="link-container">
            <Link to="/about-us">About Us</Link>
            <Link to="/declaration">Declaration</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/contact-us">Contact Us</Link>
          </div>
        </div>

        <div className="footer-section links-section">
          <h3>Quick Links</h3>
          <div className="link-container">
            <Link to="/typing-test">Typing Test</Link>
            <Link to="/exam-wise-test">Exam Wise Test</Link>
            <Link to="/create-test">Create Own Test</Link>
            <Link to="/typing-course">Typing Course</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/faqs">FAQs</Link>
          </div>
        </div>

        <div className="footer-section social-section">
          <h3>Social Contacts</h3>
          <div className="link-container">
            <p>Connect for Exams & Typing Updates</p>
            <div className="social-icons">
              <a href= "123"target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <i className="fab fa-whatsapp"></i>
              </a>
              <a href="https://www.instagram.com/typinghub.in/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://x.com/typinghub?t=iMSzEgwq3aHVyKXyYtZ6NA&s=09" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.youtube.com/@TypingHub-TypingPracticeforSSC" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="https://t.me/TypingHubOfficial"  target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                <i className="fab fa-telegram-plane"></i>
              </a>
            </div>
            <p className="email">
              <a href="mailto:Contact@TypingHub.in">Contact@TypingHub.in</a>
            </p>
          </div>
        </div>
      </div>
      <p className="copyright">Copyright © 2025 TypingHub.in. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer; 