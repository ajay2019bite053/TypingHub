import React, { useState, useEffect } from 'react';
import './CertificateModal.css';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  testResults: {
    wpm: number;
    accuracy: number;
    userName: string;
    userId: string;
  } | null;
}

interface Certificate {
  id: string;
  verificationCode: string;
  userName: string;
  typingSpeed: number;
  accuracy: number;
  testDate: string;
  downloadUrl: string;
}

const CertificateModal: React.FC<CertificateModalProps> = ({ 
  isOpen, 
  onClose, 
  testResults 
}) => {
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (isOpen && testResults) {
      checkExistingCertificate();
    }
  }, [isOpen, testResults]);

  const checkExistingCertificate = async () => {
    if (!testResults?.userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/certificates/user/${testResults.userId}`);
      const data = await response.json();

      if (data.success) {
        setCertificate(data.certificate);
      }
    } catch (err) {
      console.error('Error checking certificate:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateCertificate = async () => {
    if (!testResults) return;

    setGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: testResults.userId,
          userName: testResults.userName,
          typingSpeed: testResults.wpm,
          accuracy: testResults.accuracy
        })
      });

      const data = await response.json();

      if (data.success) {
        setCertificate(data.certificate);
      } else {
        setError(data.message || 'Failed to generate certificate');
      }
    } catch (err) {
      console.error('Error generating certificate:', err);
      setError('Failed to generate certificate');
    } finally {
      setGenerating(false);
    }
  };

  const downloadCertificate = async () => {
    if (!certificate) return;

    try {
      const response = await fetch(`/api/certificates/download/${certificate.id}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `typing-certificate-${certificate.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError('Failed to download certificate');
      }
    } catch (err) {
      console.error('Error downloading certificate:', err);
      setError('Failed to download certificate');
    }
  };

  const copyVerificationCode = () => {
    if (certificate?.verificationCode) {
      navigator.clipboard.writeText(certificate.verificationCode);
      // You could add a toast notification here
    }
  };

  if (!isOpen) return null;

  return (
    <div className="certificate-modal-overlay">
      <div className="certificate-modal">
        <div className="certificate-modal-header">
          <h2>Typing Certificate</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="certificate-modal-content">
          {loading ? (
            <div className="loading">Checking certificate status...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : certificate ? (
            <div className="certificate-display">
              <div className="certificate-preview">
                <div className="certificate-header">
                  <h3>TYPING CERTIFICATE</h3>
                </div>
                <div className="certificate-body">
                  <p>This is to certify that</p>
                  <h4>{certificate.userName}</h4>
                  <p>has successfully completed the typing test with</p>
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
                </div>
                <div className="certificate-footer">
                  <p>Certificate ID: {certificate.id}</p>
                  <p>Verification Code: {certificate.verificationCode}</p>
                  <p>Date: {new Date(certificate.testDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="certificate-actions">
                <button 
                  className="download-btn"
                  onClick={downloadCertificate}
                >
                  Download PDF
                </button>
                <button 
                  className="copy-btn"
                  onClick={copyVerificationCode}
                >
                  Copy Verification Code
                </button>
                <div className="verification-info">
                  <p>Share this verification code to verify your certificate:</p>
                  <p className="verification-code">{certificate.verificationCode}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="generate-certificate">
              <div className="test-results">
                <h3>Test Results</h3>
                <div className="results-grid">
                  <div className="result-item">
                    <span className="label">Speed:</span>
                    <span className="value">{testResults?.wpm} WPM</span>
                  </div>
                  <div className="result-item">
                    <span className="label">Accuracy:</span>
                    <span className="value">{testResults?.accuracy}%</span>
                  </div>
                </div>
              </div>

              <div className="certificate-info">
                <h4>Generate Your Certificate</h4>
                <p>Create an official typing certificate with your test results. This certificate can be downloaded as a PDF and verified online.</p>
              </div>

              <button 
                className="generate-btn"
                onClick={generateCertificate}
                disabled={generating}
              >
                {generating ? 'Generating...' : 'Generate Certificate'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateModal; 