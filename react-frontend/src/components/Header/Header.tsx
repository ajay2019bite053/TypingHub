import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '../../utils/fontAwesomeIcons';

import './Header.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.mobile-menu-btn') && !target.closest('.nav-links')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
              <img 
                src="/images/Main_LOGO.webp" 
                alt="TypingHub Logo" 
                width={70}
                height={70}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = target.src.replace('.webp', '.png');
                }}
              />
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
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            type="button"
          >
            <FontAwesomeIcon 
              icon={isMenuOpen ? icons.faTimes : icons.faBars} 
              className="hamburger-icon"
            />
          </button>

          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}> 
            <Link to="/" title="Home" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-home"></i>
              <span>Home</span>
            </Link>

            <Link to="/live-typing-test" className="live-typing-test-btn" onClick={() => setIsMenuOpen(false)}>
              <span className="blinking-dot"></span>
              <span>Live Typing Test</span>
            </Link>

            <Link to="/typing-test" title="Take a Typing Test" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-keyboard"></i>
              <span>Typing Test</span>
            </Link>
          
            <Link to="/exam-wise-test" title="Exam Specific Tests" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-file-alt"></i>
              <span>Exam Wise Test</span>
            </Link>
          
            <Link to="/create-test" title="Advanced Mode" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-cog"></i>
              <span>Advanced Mode</span>
            </Link>
          
            <Link to="/typing-course" title="Learn Typing" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-graduation-cap"></i>
              <span>Typing Course</span>
            </Link>

            <Link to="/products" title="Typing Essentials" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-shopping-bag"></i>
              <span>Typing Essential</span>
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header; 