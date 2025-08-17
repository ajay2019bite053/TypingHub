import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCopy, 
  faCheck,
  faExclamationTriangle,
  faKey,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import './SecretIdPopup.css';

interface SecretIdPopupProps {
  isOpen: boolean;
  secretId: string;
  onClose: () => void;
}

const SecretIdPopup: React.FC<SecretIdPopupProps> = ({ isOpen, secretId, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds auto-close

  // Auto-close timer
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(30);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(secretId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="secret-id-popup-overlay" onClick={onClose}>
      <div className="secret-id-popup" onClick={(e) => e.stopPropagation()}>
        <div className="secret-id-popup-header">
          <FontAwesomeIcon icon={faKey} className="secret-id-icon" />
          <h2>Your Secret ID</h2>
          <div className="auto-close-timer">
            Auto-close in {timeLeft}s
          </div>
        </div>

        <div className="secret-id-popup-content">
          <div className="secret-id-alert">
            <FontAwesomeIcon icon={faShieldAlt} className="alert-icon" />
            <div className="alert-content">
              <h4>🔐 Keep This Secret ID Safe!</h4>
              <p>This is your unique access key for the live competition. Save it securely - you'll need it to join the competition when it goes live!</p>
            </div>
          </div>

          <div className="secret-id-display">
            <div className="secret-id-label">Your Secret ID:</div>
            <div className="secret-id-value">
              <span className="secret-id-text">{secretId}</span>
              <button 
                className="copy-btn"
                onClick={handleCopy}
                title="Copy Secret ID"
              >
                <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                {copied ? ' Copied!' : ' Copy'}
              </button>
            </div>
          </div>

          <div className="secret-id-instructions">
            <h4>📋 Important Instructions:</h4>
            <ul>
              <li>✅ Save this Secret ID in a safe place</li>
              <li>⏰ You'll need it when the competition goes live</li>
              <li>🔑 Enter it along with your name to join the competition</li>
              <li>⚠️ You can only attempt the competition once</li>
              <li>💡 Don't share this ID with anyone else</li>
            </ul>
          </div>

          <div className="secret-id-warning">
            <FontAwesomeIcon icon={faExclamationTriangle} className="warning-icon" />
            <span>This popup will close automatically in {timeLeft} seconds</span>
          </div>
        </div>

        <div className="secret-id-popup-footer">
          <button className="close-btn" onClick={onClose}>
            Got it! Close Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecretIdPopup;

