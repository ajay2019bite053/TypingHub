import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Login from './Login';
import './LoginPage.css';
// Add FontAwesome for icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';

// Update FloatingShapes to use blurred blobs instead of geometric shapes
const FloatingBlobs: React.FC = () => (
  <div className="floating-blobs-bg">
    <span className="blob blob1" />
    <span className="blob blob2" />
    <span className="blob blob3" />
  </div>
);

// Update SlidingParticles to randomize position and direction, and add cursor repulsion
const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

const SlidingParticles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const particles = Array.from(document.querySelectorAll('.particle')) as HTMLElement[];
    const handleMouseMove = (e: MouseEvent) => {
      particles.forEach((p) => {
        const rect = p.getBoundingClientRect();
        const dx = rect.left + rect.width / 2 - e.clientX;
        const dy = rect.top + rect.height / 2 - e.clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          const angle = Math.atan2(dy, dx);
          const moveX = Math.cos(angle) * (80 - dist);
          const moveY = Math.sin(angle) * (80 - dist);
          p.style.transform = `translate(${moveX}px, ${moveY}px)`;
        } else {
          p.style.transform = '';
        }
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="sliding-particles-bg" ref={containerRef}>
      {Array.from({ length: 32 }).map((_, i) => {
        const top = getRandom(5, 90);
        const left = getRandom(0, 95);
        const duration = getRandom(4, 8);
        const size = getRandom(7, 14);
        const colorIdx = i % 6;
        return (
          <span
            key={i}
            className={`particle particle-${colorIdx}`}
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDuration: `${duration}s`,
              animationDelay: `${getRandom(0, 6)}s`,
            }}
          />
        );
      })}
    </div>
  );
};

// Dynamic greeting
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

const LoginPage: React.FC = () => {
  const [greeting, setGreeting] = useState(getGreeting());
  useEffect(() => {
    const interval = setInterval(() => setGreeting(getGreeting()), 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'login' | 'register'>('login');

  const handleOpenModal = (type: 'login' | 'register') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    // Don't navigate away - stay on admin page
  };

  return (
    <>
      <Helmet>
        <title>Admin Login - TypingHub</title>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
        <meta name="googlebot" content="noindex, nofollow" />
        <meta name="description" content="Admin access only" />
        <meta property="og:robots" content="noindex, nofollow" />
        <meta name="twitter:robots" content="noindex, nofollow" />
      </Helmet>
      <div className="admin-page">
        <SlidingParticles />
        <FloatingBlobs />
        <div className="admin-container" style={{ marginTop: 0 }}>
          {/* Branding Section */}
          <div className="admin-branding">
            <h2 className="brand-title">{greeting}, Admin! <span className="greeting-emoji" role="img" aria-label="smile">😊</span></h2>
            <img src="/images/Main_LOGO.png" alt="TypingHub Logo" className="admin-logo" />
            <span className="brand-title-sub">TypingHub Admin</span>
          </div>
          {/* Info Alert */}
          <div className="admin-info-alert">
            <span role="img" aria-label="info">⚠️</span> For Admin Use Only – Only authorized personnel allowed
          </div>
          {/* Illustration/Icon */}
          <div className="admin-illustration">
            <FontAwesomeIcon icon={faShieldAlt} size="4x" className="admin-shield-icon" />
          </div>
          <div className="admin-header">
            <h1>Admin Panel</h1>
            <p>Welcome to the administration area</p>
          </div>
          <div className="admin-options">
            <div className="option-card">
              <h3>Login</h3>
              <p>Access your admin dashboard</p>
              <button 
                className="admin-btn login-btn"
                onClick={() => handleOpenModal('login')}
              >
                Login
              </button>
            </div>
            <div className="option-card">
              <h3>Register</h3>
              <p>Create a new admin account</p>
              <button 
                className="admin-btn register-btn"
                onClick={() => handleOpenModal('register')}
              >
                Register
              </button>
            </div>
          </div>
          <div className="admin-footer">
            <button 
              className="back-btn"
              onClick={() => navigate('/')}
            >
              ← Back to Home
            </button>
          </div>
        </div>
        <Login 
          isOpen={isModalOpen} 
          onClose={handleClose}
          modalType={modalType}
        />
      </div>
    </>
  );
};

export default LoginPage; 