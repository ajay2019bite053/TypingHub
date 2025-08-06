import React, { useState } from 'react';
import './CertificateVerification.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCertificate, faCheckCircle, faSearch, faUser, faIdCard, faCalendarAlt, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

interface CertificateData {
  userName: string;
  typingSpeed: number;
  accuracy: number;
  testDate: string;
  certificateId: string;
}

const CertificateVerification: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setError('Please enter a verification code');
      return;
    }

    setLoading(true);
    setError(null);
    setVerified(false);

    try {
      const response = await fetch(`/api/certificates/verify/${verificationCode.trim()}`);
      const data = await response.json();

      if (data.success) {
        setCertificate(data.certificate);
        setVerified(true);
      } else {
        setError(data.message || 'Invalid verification code');
        setCertificate(null);
      }
    } catch (err) {
      console.error('Error verifying certificate:', err);
      setError('Failed to verify certificate');
      setCertificate(null);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setVerificationCode('');
    setCertificate(null);
    setError(null);
    setVerified(false);
  };

  return (
    <div className="certificate-verification-page">
      <div className="certificate-content">
        <h1>Verify a Typing Certificate</h1>
        <p style={{ marginBottom: 24 }}>
          Instantly check the authenticity of any TypingHub certificate using its unique verification code.
        </p>
        <div className="features-grid">
          <div className="feature-card">
            <FontAwesomeIcon icon={faCertificate} style={{ fontSize: '24px', color: '#1976d2', marginBottom: '10px' }} />
            <h3>Official Certificate</h3>
            <p>All certificates are digitally signed and verifiable</p>
          </div>
          <div className="feature-card">
            <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '24px', color: '#43a047', marginBottom: '10px' }} />
            <h3>Instant Verification</h3>
            <p>Get results in seconds, 24x7</p>
          </div>
          <div className="feature-card">
            <FontAwesomeIcon icon={faSearch} style={{ fontSize: '24px', color: '#fbc02d', marginBottom: '10px' }} />
            <h3>Unique Code</h3>
            <p>Each certificate has a unique code for verification</p>
          </div>
        </div>
        <div className="verification-form-card">
          <form onSubmit={handleVerification} className="verification-form">
            <div className="input-group">
              <label htmlFor="verificationCode">Verification Code</label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code (e.g., VC-ABC123DEF)"
                className="verification-input"
                disabled={loading}
                autoFocus
              />
            </div>
            {error && (
              <div className="error-message" style={{ marginBottom: 8 }}>
                <FontAwesomeIcon icon={faTimesCircle} style={{ color: '#d6001c', marginRight: 6 }} />
                {error}
              </div>
            )}
            <div className="form-actions">
              <button
                type="submit"
                className="verify-btn"
                disabled={loading || !verificationCode.trim()}
              >
                {loading ? 'Verifying...' : 'Verify Certificate'}
              </button>
              {verified && (
                <button
                  type="button"
                  className="reset-btn"
                  onClick={resetForm}
                >
                  Verify Another
                </button>
              )}
            </div>
          </form>
        </div>
        {verified && certificate && (
          <div className="certificate-result-card">
            <div className="result-header">
              <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#43a047', fontSize: 32, marginBottom: 8 }} />
              <h2 style={{ margin: 0 }}>Certificate Verified</h2>
              <p style={{ color: '#43a047', marginBottom: 12 }}>This certificate is authentic and has been verified</p>
            </div>
            <div className="certificate-details-grid">
              <div className="certificate-detail">
                <FontAwesomeIcon icon={faUser} style={{ color: '#1976d2', marginRight: 6 }} />
                <span><strong>Name:</strong> {certificate.userName}</span>
              </div>
              <div className="certificate-detail">
                <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#43a047', marginRight: 6 }} />
                <span><strong>Speed:</strong> {certificate.typingSpeed} WPM</span>
              </div>
              <div className="certificate-detail">
                <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#43a047', marginRight: 6 }} />
                <span><strong>Accuracy:</strong> {certificate.accuracy}%</span>
              </div>
              <div className="certificate-detail">
                <FontAwesomeIcon icon={faIdCard} style={{ color: '#8e24aa', marginRight: 6 }} />
                <span><strong>Certificate ID:</strong> {certificate.certificateId}</span>
              </div>
              <div className="certificate-detail">
                <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#fbc02d', marginRight: 6 }} />
                <span><strong>Test Date:</strong> {new Date(certificate.testDate).toLocaleDateString()}</span>
              </div>
              <div className="certificate-detail">
                <FontAwesomeIcon icon={faSearch} style={{ color: '#1976d2', marginRight: 6 }} />
                <span><strong>Verification Code:</strong> {verificationCode}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateVerification; 