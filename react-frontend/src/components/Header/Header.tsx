import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header>
        <nav>
          <div className="nav-brand">
            <a 
              href="https://typinghub.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="logo-link"
            >
              <img src="/images/Main_LOGO.png" alt="TypingHub Logo" />
            </a>
            <a 
              href="https://typinghub.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="domain-link"
            >
              TypingHub.in
            </a>
          </div>

          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>

          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}> 
            <Link to="/" title="Home">
              <i className="fas fa-home"></i>
              <span>Home</span>
            </Link>

            <Link to="/live-typing-test" className="live-typing-test-btn">
              <span className="blinking-dot"></span>
              <span>Live Typing Test</span>
            </Link>

            <Link to="/typing-test" title="Take a Typing Test">
              <i className="fas fa-keyboard"></i>
              <span>Typing Test</span>
            </Link>
          
            <Link to="/exam-wise-test" title="Exam Specific Tests">
              <i className="fas fa-file-alt"></i>
              <span>Exam Wise Test</span>
            </Link>
          
            <Link to="/create-test" title="Advanced Mode">
              <i className="fas fa-cog"></i>
              <span>Advanced Mode</span>
            </Link>
          
            <Link to="/typing-course" title="Learn Typing">
              <i className="fas fa-graduation-cap"></i>
              <span>Typing Course</span>
            </Link>

            <Link to="/verify-certificate" title="Verify Certificate">
              <i className="fas fa-certificate"></i>
              <span>Verify Certificate</span>
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header; 