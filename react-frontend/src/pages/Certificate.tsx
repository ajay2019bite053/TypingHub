import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faVideo, 
  faTimes, 
  faCertificate, 
  faCheckCircle, 
  faClock, 
  faTrophy,
  faDownload,
  faPlay
} from '@fortawesome/free-solid-svg-icons';
import './Certificate.css';

const Certificate: React.FC = () => {
  const [testsCompleted, setTestsCompleted] = useState(0);
  const [showAdModal, setShowAdModal] = useState(false);
  const [adCompleted, setAdCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load test progress from localStorage
    try {
      const completed = parseInt(localStorage.getItem('testsCompleted') || '0');
      setTestsCompleted(completed);
    } catch (e) {
      console.error('Error reading testsCompleted from localStorage:', e);
    }
  }, []);

  const handleDownloadClick = () => {
    if (testsCompleted >= 3) {
      setShowAdModal(true);
    }
  };

  const handleAdEnded = () => {
    setAdCompleted(true);
  };

  const handleCloseModal = () => {
    setShowAdModal(false);
    setAdCompleted(false);
  };

  const handleTakeTest = () => {
    navigate('/typing-certificate-test');
  };

  const renderProgressDots = () => {
    const dots = [];
    for (let i = 0; i < 3; i++) {
      let className = 'progress-dot';
      if (i < testsCompleted) {
        className += ' completed';
      } else if (i === testsCompleted) {
        className += ' current';
      }
      dots.push(<div key={i} className={className} />);
    }
    return dots;
  };

  const features = [
    {
      icon: faCertificate,
      title: "Official Certificate",
      description: "Get a professionally designed certificate with your name and typing speed"
    },
    {
      icon: faTrophy,
      title: "Government Exam Ready",
      description: "Perfect for CPCT, SSC, RRB, Police and other government exams"
    },
    {
      icon: faDownload,
      title: "Instant Download",
      description: "Download your certificate immediately after completing 3 tests"
    },
    {
      icon: faCheckCircle,
      title: "Verification Code",
      description: "Each certificate includes a unique verification code for authenticity"
    }
  ];

  return (
    <div className="certificate-page">
      <div className="certificate-content">
        <h1>Earn Your Free Typing Certificate</h1>
        <p>
          Complete 3 typing tests on TypingHub to earn a personalized PDF certificate 
          with your name and typing speed. Perfect for showcasing your skills for 
          government exams like CPCT, SSC, RRB, and Police!
        </p>
        
        <div className="progress-bar">
          <p>You've completed {testsCompleted}/3 tests</p>
        </div>
        
        <p>
          Start or continue your typing tests now. Once you complete 3 tests, 
          you can download your certificate.
        </p>
        
        <div className="certificate-buttons">
          <button 
            className="btn btn-primary"
            onClick={handleTakeTest}
          >
            Take Typing Test
          </button>
          <button 
            className={`btn ${testsCompleted >= 3 ? 'btn-primary' : 'btn-disabled'}`}
            onClick={handleDownloadClick}
            disabled={testsCompleted < 3}
          >
            Download Certificate
          </button>
        </div>

        {/* New features added below */}
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <FontAwesomeIcon icon={feature.icon} style={{ fontSize: '24px', color: '#667eea', marginBottom: '10px' }} />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        {testsCompleted < 3 && (
          <div className="certificate-preview">
            <h3>What You'll Get</h3>
            <ul>
              <li>Professional PDF certificate with your name</li>
              <li>Your typing speed (WPM) and accuracy</li>
              <li>Unique verification code for authenticity</li>
              <li>Perfect for government exam applications</li>
              <li>Instant download after completing 3 tests</li>
            </ul>
          </div>
        )}
      </div>

      {showAdModal && (
        <div className="ad-modal show">
          <div className="ad-content">
            <p>Please watch the ad to download your certificate.</p>
            <video 
              controls
              onEnded={handleAdEnded}
              style={{ display: adCompleted ? 'none' : 'block' }}
            >
              <source src="/placeholder-ad.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {adCompleted && (
              <>
                <p>
                  <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#4caf50', marginRight: '8px' }} />
                  Ad completed! You can now download your certificate.
                </p>
                <a 
                  href="/certificate.pdf" 
                  download 
                  className="btn btn-success"
                  style={{ margin: '10px 0' }}
                >
                  <FontAwesomeIcon icon={faDownload} />
                  Download Certificate
                </a>
              </>
            )}
            
            <button 
              className="btn btn-primary" 
              onClick={handleCloseModal}
              style={{ marginTop: '10px' }}
            >
              <FontAwesomeIcon icon={faTimes} /> Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificate; 
 