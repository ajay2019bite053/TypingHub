import React, { useState } from 'react';
import './CertificateVerification.css';

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
      <div className="verification-container">
        <div className="verification-header">
          <h1>Certificate Verification</h1>
          <p>Enter the verification code to verify a typing certificate</p>
        </div>

        <div className="verification-form-container">
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
              />
            </div>

            {error && (
              <div className="error-message">
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
          <div className="certificate-result">
            <div className="result-header">
              <h2>✅ Certificate Verified</h2>
              <p>This certificate is authentic and has been verified</p>
            </div>

            <div className="certificate-details">
              <div className="certificate-card">
                <div className="certificate-header">
                  <h3>TYPING CERTIFICATE</h3>
                </div>
                
                <div className="certificate-content">
                  <div className="user-info">
                    <p>This is to certify that</p>
                    <h4>{certificate.userName}</h4>
                    <p>has successfully completed the typing test with</p>
                  </div>

                  <div className="performance-stats">
                    <div className="stat">
                      <span className="value">{certificate.typingSpeed}</span>
                      <span className="label">WPM</span>
                    </div>
                    <div className="stat">
                      <span className="value">{certificate.accuracy}%</span>
                      <span className="label">Accuracy</span>
                    </div>
                  </div>

                  <div className="certificate-meta">
                    <p><strong>Certificate ID:</strong> {certificate.certificateId}</p>
                    <p><strong>Test Date:</strong> {new Date(certificate.testDate).toLocaleDateString()}</p>
                    <p><strong>Verification Code:</strong> {verificationCode}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="verification-info">
              <h4>About Certificate Verification</h4>
              <ul>
                <li>Each certificate has a unique verification code</li>
                <li>Verification codes are case-sensitive</li>
                <li>Certificates are permanently stored and verifiable</li>
                <li>This verification confirms the authenticity of the certificate</li>
              </ul>
            </div>
          </div>
        )}

        {!verified && !loading && (
          <div className="verification-info-section">
            <h3>How to Verify a Certificate</h3>
            <div className="info-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Get the Verification Code</h4>
                  <p>Ask the certificate holder for their verification code</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Enter the Code</h4>
                  <p>Type the verification code in the input field above</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Verify</h4>
                  <p>Click "Verify Certificate" to check authenticity</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateVerification; 