import React from 'react';
import TypingEngine from '../components/common/TypingEngine';

  const config = {
  testName: 'Superintendent',
  timeLimit: 900,
  passageCategory: 'Superintendent',
    qualificationCriteria: {
    minWpm: 27,
    minAccuracy: 80
    }
  };

const SuperintendentTest = () => (
  <div>
    <TypingEngine config={config} />
    
    {/* Comprehensive Superintendent Typing Test Information */}
    <div style={{
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '0 20px'
    }}>
      {/* Main Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1976d2, #1565c0)',
        color: '#fff',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center',
        marginBottom: '30px',
        boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)'
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: '700',
          marginBottom: '15px',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          Superintendent Typing Test
        </h1>
        <p style={{
          fontSize: '18px',
          opacity: '0.95',
          lineHeight: '1.6',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          Typing/DEST Test for Office Superintendent and Senior Administrative Posts (CBSE/SSC CGL Level Equivalent). 
          Qualifying nature test assessing data entry speed and accuracy.
        </p>
      </div>

      {/* Basic Details Section */}
      <div style={{
        background: '#fff',
        border: '2px solid #e3f2fd',
        borderRadius: '16px',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 4px 20px rgba(25, 118, 210, 0.1)'
      }}>
        <h2 style={{
          color: '#1976d2',
          fontSize: '24px',
          fontWeight: '700',
          marginBottom: '20px',
          borderBottom: '3px solid #1976d2',
          paddingBottom: '10px'
        }}>
          📋 Superintendent Typing Test Basic Details
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div style={{
            background: '#f8fafc',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e3f2fd'
          }}>
            <h4 style={{
              color: '#1565c0',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ⏱️ Time Duration
            </h4>
            <p style={{ color: '#333', margin: 0, fontSize: '15px' }}>
              <strong>15 minutes</strong> for the typing test
            </p>
            <p style={{ color: '#666', margin: '5px 0 0 0', fontSize: '14px' }}>
              Extended time for comprehensive assessment
            </p>
          </div>
          
          <div style={{
            background: '#f8fafc',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e3f2fd'
          }}>
            <h4 style={{
              color: '#1565c0',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🎯 Test Nature
            </h4>
            <p style={{ color: '#333', margin: 0, fontSize: '15px' }}>
              <strong>Qualifying only</strong> - No marks awarded
            </p>
            <p style={{ color: '#666', margin: '5px 0 0 0', fontSize: '14px' }}>
              Must clear to proceed in selection process
            </p>
          </div>
          
          <div style={{
            background: '#f8fafc',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e3f2fd'
          }}>
            <h4 style={{
              color: '#1565c0',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ⌨️ Key Depressions
            </h4>
            <p style={{ color: '#333', margin: 0, fontSize: '15px' }}>
              <strong>2000 key depressions</strong> in passage
            </p>
            <p style={{ color: '#666', margin: '5px 0 0 0', fontSize: '14px' }}>
              Comprehensive typing task requirement
            </p>
          </div>
          
          <div style={{
            background: '#f8fafc',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e3f2fd'
          }}>
            <h4 style={{
              color: '#1565c0',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              💻 Test Platform
            </h4>
            <p style={{ color: '#333', margin: 0, fontSize: '15px' }}>
              <strong>SSC/CBSE computer system</strong>
            </p>
            <p style={{ color: '#666', margin: '5px 0 0 0', fontSize: '14px' }}>
              SSC software provided for test
            </p>
          </div>
        </div>
      </div>

      {/* Speed Requirements Section */}
      <div style={{
        background: '#fff',
        border: '2px solid #4caf50',
        borderRadius: '16px',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)'
      }}>
        <h2 style={{
          color: '#2e7d32',
          fontSize: '24px',
          fontWeight: '700',
          marginBottom: '20px',
          borderBottom: '3px solid #4caf50',
          paddingBottom: '10px'
        }}>
          🚀 Speed Requirements & Standards
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '25px'
        }}>
          <div>
            <h3 style={{
              color: '#2e7d32',
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '15px'
            }}>
              📊 Speed Requirements
            </h3>
            <div style={{
              background: '#f1f8e9',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #c8e6c9'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '15px',
                alignItems: 'center',
                marginBottom: '15px',
                padding: '12px 0',
                borderBottom: '1px solid #e8f5e8'
              }}>
                <span style={{ fontWeight: '600', color: '#2e7d32' }}>⚡ Minimum Speed</span>
                <span style={{ background: '#4caf50', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '14px' }}>27 WPM</span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '15px',
                alignItems: 'center',
                padding: '12px 0'
              }}>
                <span style={{ fontWeight: '600', color: '#2e7d32' }}>🎯 Target Speed</span>
                <span style={{ background: '#ff9800', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '14px' }}>30+ WPM</span>
              </div>
            </div>
            
            <div style={{
              background: '#e8f5e8',
              padding: '15px',
              borderRadius: '8px',
              marginTop: '15px',
              border: '1px solid #c8e6c9'
            }}>
              <p style={{ color: '#2e7d32', margin: 0, fontSize: '14px', fontWeight: '500' }}>
                <strong>Note:</strong> 27 WPM is considered sufficient, but higher speed improves chances.
              </p>
            </div>
          </div>
          
          <div>
            <h3 style={{
              color: '#2e7d32',
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '15px'
            }}>
              📋 Accuracy Requirements
            </h3>
            <div style={{
              background: '#f1f8e9',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #c8e6c9'
            }}>
              <p style={{ color: '#333', margin: '0 0 15px 0', lineHeight: '1.6' }}>
                <strong>Minimum Accuracy:</strong> At least 80%+ correct typing required.
              </p>
              <p style={{ color: '#333', margin: '0 0 15px 0', lineHeight: '1.6' }}>
                <strong>Focus Areas:</strong> Punctuation, capitalization, and formatting accuracy.
              </p>
              <p style={{ color: '#333', margin: 0, lineHeight: '1.6' }}>
                <strong>Case Sensitivity:</strong> Capital/small letters and punctuation matter significantly.
              </p>
            </div>
          </div>
          </div>
        </div>
        
      {/* Final Note Section */}
        <div style={{
        background: 'linear-gradient(135deg, #e3f2fd, #f8fafc)',
        border: '2px solid #90caf9',
        borderRadius: '16px',
        padding: '30px',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(144, 202, 249, 0.2)'
        }}>
          <h3 style={{
            color: '#1565c0',
          fontSize: '22px',
            fontWeight: '600',
          marginBottom: '15px'
          }}>
          💡 Key Points to Remember
          </h3>
          <p style={{
            color: '#333',
          fontSize: '16px',
          lineHeight: '1.6',
            margin: 0,
          maxWidth: '800px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          The Superintendent typing test is conducted for <strong>Office Superintendent</strong> and 
          <strong>Senior Administrative Posts</strong> at <strong>CBSE/SSC CGL level equivalent</strong>. 
          Focus on <strong>long passage typing</strong> with 2000 key depressions in 15 minutes. 
          <strong>Accuracy is crucial</strong> - maintain proper punctuation, capitalization, and formatting. 
          Practice regularly with administrative content and build typing endurance for better performance.
        </p>
      </div>
    </div>
  </div>
);

export default SuperintendentTest; 
 