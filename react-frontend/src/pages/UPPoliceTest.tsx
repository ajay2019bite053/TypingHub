import React from 'react';
import TypingEngine from '../components/common/TypingEngine';

const config = {
  testName: 'UP Police',
  timeLimit: 600,
  passageCategory: 'UP Police',
  qualificationCriteria: {
    minWpm: 25,
    minAccuracy: 85
  }
};

const UPPoliceTest = () => (
  <div>
    <TypingEngine config={config} />
    
    {/* UP Police Typing Test Information */}
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
          UP Police Typing Test Information
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
                <strong>Minimum Speed:</strong> 30 WPM
              </li>
              <li style={{
                padding: '8px 0',
                borderBottom: '1px solid #f0f0f0',
                color: '#333'
              }}>
                <strong>Minimum Accuracy:</strong> 80-85%
              </li>
              <li style={{
                padding: '8px 0',
                borderBottom: '1px solid #f0f0f0',
                color: '#333'
              }}>
                <strong>Time Duration:</strong> 15 minutes
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333'
              }}>
                <strong>Key Depressions:</strong> 2250 in 15 minutes
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
                <strong>Content:</strong> Legal documents, police reports
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
                <strong>Evaluation:</strong> Speed and accuracy combined
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
            The UP Police typing test is conducted for various police department posts including 
            Constable, Head Constable, and other clerical positions. The test includes legal 
            documents, police reports, and official communications. Candidates should practice 
            typing police-related content and legal terminology to improve their performance.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default UPPoliceTest; 