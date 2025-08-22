import React from 'react';
import TypingEngine from '../components/common/TypingEngine';

const config = {
  testName: 'AIIMS CRC',
  timeLimit: 600,
  passageCategory: 'AIIMS CRC',
  qualificationCriteria: {
    minWpm: 25,
    minAccuracy: 85
  }
};

const AIIMSCRCTest = () => (
  <div>
    <TypingEngine config={config} />
    
    {/* Comprehensive AIIMS CRC Typing Test Information */}
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
          AIIMS CRC Typing Test
        </h1>
        <p style={{
          fontSize: '18px',
          opacity: '0.95',
          lineHeight: '1.6',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          Essential typing assessment for various positions in AIIMS (All India Institute of Medical Sciences) 
          including clerical and administrative posts. Includes medical terminology and administrative content.
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
          📋 Test Basic Details
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
              <strong>15 minutes</strong> to complete the typing test
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
              <strong>2250 key depressions</strong> in the passage
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
              💻 Equipment
            </h4>
            <p style={{ color: '#333', margin: 0, fontSize: '15px' }}>
              <strong>AIIMS computers only</strong> - No personal devices
            </p>
          </div>
        </div>
      </div>

      {/* Requirements & Guidelines Section */}
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
          🎯 Test Requirements & Guidelines
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
              📊 Minimum Qualifying Standards
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
                marginBottom: '10px',
                padding: '8px 0',
                borderBottom: '1px solid #e8f5e8'
              }}>
                <span style={{ fontWeight: '600', color: '#2e7d32' }}>Minimum Speed</span>
                <span style={{ background: '#4caf50', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '14px' }}>35 WPM</span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '15px',
                alignItems: 'center',
                marginBottom: '10px',
                padding: '8px 0',
                borderBottom: '1px solid #e8f5e8'
              }}>
                <span style={{ fontWeight: '600', color: '#2e7d32' }}>Minimum Accuracy</span>
                <span style={{ background: '#4caf50', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '14px' }}>85%</span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '15px',
                alignItems: 'center',
                padding: '8px 0'
              }}>
                <span style={{ fontWeight: '600', color: '#2e7d32' }}>Key Depressions</span>
                <span style={{ background: '#4caf50', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '14px' }}>2250 in 15 min</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 style={{
              color: '#2e7d32',
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '15px'
            }}>
              📋 Important Guidelines
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{
                padding: '10px 0',
                borderBottom: '1px solid #e8f5e8',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#4caf50', fontSize: '18px' }}>✓</span>
                <span>AIIMS specialized software will be used for test administration</span>
              </li>
              <li style={{
                padding: '10px 0',
                borderBottom: '1px solid #e8f5e8',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#4caf50', fontSize: '18px' }}>✓</span>
                <span>Both speed and accuracy are equally important</span>
              </li>
              <li style={{
                padding: '10px 0',
                borderBottom: '1px solid #e8f5e8',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#4caf50', fontSize: '18px' }}>✓</span>
                <span>Medical terminology and administrative content are included</span>
              </li>
              <li style={{
                padding: '10px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#4caf50', fontSize: '18px' }}>✓</span>
                <span>Both English and Hindi languages are supported</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Test Pattern Section */}
      <div style={{
        background: '#fff',
        border: '2px solid #ff9800',
        borderRadius: '16px',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 4px 20px rgba(255, 152, 0, 0.1)'
      }}>
        <h2 style={{
          color: '#e65100',
          fontSize: '24px',
          fontWeight: '700',
          marginBottom: '20px',
          borderBottom: '3px solid #ff9800',
          paddingBottom: '10px'
        }}>
          📝 Test Pattern & Content
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '25px'
        }}>
          <div>
            <h3 style={{
              color: '#e65100',
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '15px'
            }}>
              🗂️ Content Type
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#ff9800', fontSize: '16px' }}>•</span>
                <span><strong>Medical Terminology:</strong> Medical terms and procedures</span>
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#ff9800', fontSize: '16px' }}>•</span>
                <span><strong>Administrative Content:</strong> Hospital procedures and rules</span>
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#ff9800', fontSize: '16px' }}>•</span>
                <span><strong>Official Communications:</strong> Medical reports and documents</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 style={{
              color: '#e65100',
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '15px'
            }}>
              🌐 Language Support
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#ff9800', fontSize: '16px' }}>•</span>
                <span><strong>English:</strong> Primary language for medical documents</span>
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#ff9800', fontSize: '16px' }}>•</span>
                <span><strong>Hindi:</strong> Regional language support</span>
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#ff9800', fontSize: '16px' }}>•</span>
                <span><strong>Format:</strong> Computer-based typing test</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Preparation & Strategies Section */}
      <div style={{
        background: '#fff',
        border: '2px solid #9c27b0',
        borderRadius: '16px',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 4px 20px rgba(156, 39, 176, 0.1)'
      }}>
        <h2 style={{
          color: '#6a1b9a',
          fontSize: '24px',
          fontWeight: '700',
          marginBottom: '20px',
          borderBottom: '3px solid #9c27b0',
          paddingBottom: '10px'
        }}>
          🚀 Preparation & Strategies
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '25px'
        }}>
          <div>
            <h3 style={{
              color: '#6a1b9a',
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '15px'
            }}>
              💡 Preparation Tips
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#9c27b0', fontSize: '16px' }}>•</span>
                <span><strong>Medical Terminology:</strong> Practice typing medical terms and phrases</span>
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#9c27b0', fontSize: '16px' }}>•</span>
                <span><strong>Balanced Approach:</strong> Focus on both speed and accuracy</span>
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#9c27b0', fontSize: '16px' }}>•</span>
                <span><strong>Hospital Documents:</strong> Familiarize with medical document formats</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 style={{
              color: '#6a1b9a',
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '15px'
            }}>
              🎯 Test Strategies
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#9c27b0', fontSize: '16px' }}>•</span>
                <span><strong>Read First:</strong> Read the entire passage before typing</span>
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#9c27b0', fontSize: '16px' }}>•</span>
                <span><strong>Maintain Rhythm:</strong> Keep consistent typing pace</span>
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#9c27b0', fontSize: '16px' }}>•</span>
                <span><strong>Error Correction:</strong> Use backspace efficiently for corrections</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Important Instructions Section */}
      <div style={{
        background: '#fff',
        border: '2px solid #f44336',
        borderRadius: '16px',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 4px 20px rgba(244, 67, 54, 0.1)'
      }}>
        <h2 style={{
          color: '#c62828',
          fontSize: '24px',
          fontWeight: '700',
          marginBottom: '20px',
          borderBottom: '3px solid #f44336',
          paddingBottom: '10px'
        }}>
          ⚠️ Important Instructions for Test Day
        </h2>
        
        <div style={{
          background: '#ffebee',
          padding: '25px',
          borderRadius: '12px',
          border: '1px solid #ffcdd2'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            <div>
              <h4 style={{
                color: '#c62828',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                📅 Before Test
              </h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                <li style={{
                  padding: '6px 0',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <span style={{ color: '#f44336', fontSize: '14px' }}>•</span>
                  <span>Arrive <strong>30 minutes</strong> before test commencement</span>
                </li>
                <li style={{
                  padding: '6px 0',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <span style={{ color: '#f44336', fontSize: '14px' }}>•</span>
                  <span>Bring all required certificates and documents</span>
                </li>
                <li style={{
                  padding: '6px 0',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <span style={{ color: '#f44336', fontSize: '14px' }}>•</span>
                  <span>Provide current passport-size photo if requested</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 style={{
                color: '#c62828',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                💻 During Test
              </h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                <li style={{
                  padding: '6px 0',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <span style={{ color: '#f44336', fontSize: '14px' }}>•</span>
                  <span>Enter personal information and confirm details</span>
                </li>
                <li style={{
                  padding: '6px 0',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <span style={{ color: '#f44336', fontSize: '14px' }}>•</span>
                  <span>Click <strong>"CONFIRM"</strong> button after verification</span>
                </li>
                <li style={{
                  padding: '6px 0',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <span style={{ color: '#f44336', fontSize: '14px' }}>•</span>
                  <span>Balance speed and accuracy throughout the test</span>
                </li>
              </ul>
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
          💡 Pro Tips for Success
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
          The AIIMS CRC typing test is conducted for various positions in AIIMS (All India Institute of 
          Medical Sciences) including clerical and administrative posts. <strong>Practice typing medical 
          terminology and administrative documents</strong> to improve your performance. Focus on maintaining 
          a balance between speed and accuracy, as both are equally important for medical institution positions.
        </p>
      </div>
    </div>
  </div>
);

export default AIIMSCRCTest; 