import React from 'react';
import TypingEngine from '../components/common/TypingEngine';

  const config = {
  testName: 'Superintendent',
  timeLimit: 600,
  passageCategory: 'Superintendent',
    qualificationCriteria: {
    minWpm: 25,
      minAccuracy: 85
    }
  };

const SuperintendentTest = () => (
  <div>
    <TypingEngine config={config} />
    
    {/* Superintendent Typing Test Information */}
    <div style={{
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '0 20px'
    }}>
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e3f2fd',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 2px 8px rgba(25, 118, 210, 0.1)'
      }}>
        <h2 style={{
          color: '#1976d2',
          fontSize: '28px',
          fontWeight: '700',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          Superintendent Typing Test Information
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '25px'
        }}>
          <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{
              color: '#1976d2',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '12px'
            }}>
              Test Requirements
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{
                padding: '8px 0',
                borderBottom: '1px solid #f0f0f0',
                color: '#333'
              }}>
                <strong>Minimum Speed:</strong> 35 WPM
              </li>
              <li style={{
                padding: '8px 0',
                borderBottom: '1px solid #f0f0f0',
                color: '#333'
              }}>
                <strong>Minimum Accuracy:</strong> 85%+
              </li>
              <li style={{
                padding: '8px 0',
                borderBottom: '1px solid #f0f0f0',
                color: '#333'
              }}>
                <strong>Time Duration:</strong> 10 minutes
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333'
              }}>
                <strong>Key Depressions:</strong> 1500 in 10 minutes
              </li>
            </ul>
          </div>
          
          <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{
              color: '#1976d2',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '12px'
            }}>
              Test Pattern
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{
                padding: '8px 0',
                borderBottom: '1px solid #f0f0f0',
                color: '#333'
              }}>
                <strong>Language:</strong> English and Hindi
              </li>
              <li style={{
                padding: '8px 0',
                borderBottom: '1px solid #f0f0f0',
                color: '#333'
              }}>
                <strong>Content:</strong> Advanced administrative work
              </li>
              <li style={{
                padding: '8px 0',
                borderBottom: '1px solid #f0f0f0',
                color: '#333'
              }}>
                <strong>Format:</strong> Computer-based typing
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333'
              }}>
                <strong>Evaluation:</strong> Higher accuracy priority
              </li>
            </ul>
          </div>
        </div>
        
        <div style={{
          background: '#e3f2fd',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #90caf9'
        }}>
          <h3 style={{
            color: '#1565c0',
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '12px'
          }}>
            Important Notes:
          </h3>
          <p style={{
            color: '#333',
            margin: 0,
            lineHeight: '1.6'
          }}>
            The Superintendent typing test is conducted for senior administrative positions 
            in various government departments. The test requires higher accuracy and focuses 
            on advanced administrative content, policy documents, and official communications. 
            Candidates should practice typing complex administrative documents.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default SuperintendentTest; 
 