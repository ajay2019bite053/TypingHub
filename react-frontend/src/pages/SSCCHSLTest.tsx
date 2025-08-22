import React from 'react';
import TypingEngine from '../components/common/TypingEngine';

  const config = {
  testName: 'SSC CHSL',
  timeLimit: 600,
  passageCategory: 'SSC CHSL',
    qualificationCriteria: {
    minWpm: 25,
      minAccuracy: 85
    }
  };

const SSCCHSLTest = () => (
  <div>
    <TypingEngine config={config} />
    
    {/* Comprehensive SSC CHSL Typing Test Information */}
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
          SSC CHSL Typing Test
        </h1>
        <p style={{
          fontSize: '18px',
          opacity: '0.95',
          lineHeight: '1.6',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          Qualifying skill test for Lower Division Clerk (LDC) and Junior Secretariat Assistant (JSA) positions. 
          Assesses typing speed and accuracy in English or Hindi as chosen during application.
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
          📋 SSC CHSL Typing Test Basic Details
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
              <strong>10 minutes</strong> for most candidates
            </p>
            <p style={{ color: '#666', margin: '5px 0 0 0', fontSize: '14px' }}>
              +5 min for scribe eligible, 20 min for visually handicapped
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
              <strong>1750 key depressions</strong> in 10 minutes
            </p>
            <p style={{ color: '#666', margin: '5px 0 0 0', fontSize: '14px' }}>
              English: ~10,500/hour, Hindi: ~9,000/hour
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
              Necessary to pass but doesn't contribute to merit
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
              🌐 Medium Choice
            </h4>
            <p style={{ color: '#333', margin: 0, fontSize: '15px' }}>
              <strong>English or Hindi</strong> - Choice is final
            </p>
            <p style={{ color: '#666', margin: '5px 0 0 0', fontSize: '14px' }}>
              Cannot be changed after application
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
              📊 Speed Requirements by Language
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
                <span style={{ fontWeight: '600', color: '#2e7d32' }}>🇬🇧 English</span>
                <span style={{ background: '#4caf50', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '14px' }}>35 WPM</span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '15px',
                alignItems: 'center',
                padding: '12px 0'
              }}>
                <span style={{ fontWeight: '600', color: '#2e7d32' }}>🇮🇳 Hindi</span>
                <span style={{ background: '#ff9800', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '14px' }}>30 WPM</span>
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
                <strong>Note:</strong> Speed requirements are approximately 10,500 key depressions per hour for English and 9,000 for Hindi.
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
              📋 Key Test Features
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
                <span><strong>Online Interface:</strong> Computer-based test with practice interface</span>
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
                <span><strong>Error Calculation:</strong> Up to two decimal places precision</span>
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
                <span><strong>Medium Lock:</strong> Language choice cannot be changed after application</span>
              </li>
              <li style={{
                padding: '10px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#4caf50', fontSize: '18px' }}>✓</span>
                <span><strong>Qualifying Nature:</strong> Must pass to proceed in selection process</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Test Pattern & Content Section */}
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
              🎯 Test Content Focus
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
                <span><strong>Official Documents:</strong> Letters, reports, and clerical work</span>
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#ff9800', fontSize: '16px' }}>•</span>
                <span><strong>Data Entry:</strong> Tables, forms, and structured content</span>
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#ff9800', fontSize: '16px' }}>•</span>
                <span><strong>Administrative:</strong> Government correspondence and notices</span>
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#ff9800', fontSize: '16px' }}>•</span>
                <span><strong>Practical:</strong> Real-world clerical scenarios</span>
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
              💻 Test Interface Details
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
                <span><strong>Computer-Based:</strong> Online typing interface</span>
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#ff9800', fontSize: '16px' }}>•</span>
                <span><strong>Practice Interface:</strong> Same as actual test environment</span>
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#ff9800', fontSize: '16px' }}>•</span>
                <span><strong>Error Tracking:</strong> Real-time accuracy monitoring</span>
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#ff9800', fontSize: '16px' }}>•</span>
                <span><strong>Time Display:</strong> Countdown timer visible during test</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Special Accommodations Section */}
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
          ♿ Special Time Accommodations
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '25px'
        }}>
          <div style={{
            background: '#f3e5f5',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #ce93d8'
          }}>
            <h4 style={{
              color: '#6a1b9a',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ⏰ Standard Candidates
            </h4>
            <p style={{ color: '#333', margin: 0, fontSize: '16px', fontWeight: '600' }}>
              <strong>10 minutes</strong> for the typing test
            </p>
            <p style={{ color: '#666', margin: '8px 0 0 0', fontSize: '14px' }}>
              Regular time allocation for most SSC CHSL candidates
            </p>
          </div>
          
          <div style={{
            background: '#f3e5f5',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #ce93d8'
          }}>
            <h4 style={{
              color: '#6a1b9a',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📝 Scribe Eligible
            </h4>
            <p style={{ color: '#333', margin: 0, fontSize: '16px', fontWeight: '600' }}>
              <strong>15 minutes</strong> (10 + 5 extra)
            </p>
            <p style={{ color: '#666', margin: '8px 0 0 0', fontSize: '14px' }}>
              Additional 5 minutes for candidates eligible for scribe assistance
            </p>
          </div>
          
          <div style={{
            background: '#f3e5f5',
          padding: '20px',
            borderRadius: '12px',
            border: '1px solid #ce93d8'
          }}>
            <h4 style={{
              color: '#6a1b9a',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              👁️ Visually Handicapped
            </h4>
            <p style={{ color: '#333', margin: 0, fontSize: '16px', fontWeight: '600' }}>
              <strong>20 minutes</strong> for the typing test
            </p>
            <p style={{ color: '#666', margin: '8px 0 0 0', fontSize: '14px' }}>
              Extended time allocation for visually impaired candidates
            </p>
          </div>
        </div>
      </div>

      {/* Preparation Tips Section */}
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
          🎯 Preparation Tips & Strategies
        </h2>
        
        <div style={{
          background: '#ffebee',
          padding: '25px',
          borderRadius: '12px',
          border: '1px solid #ffcdd2'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '20px'
          }}>
            <div>
              <h4 style={{
                color: '#c62828',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                💻 Practice Recommendations
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
                  <span>Practice on <strong>computer interface</strong> similar to actual test</span>
                </li>
                <li style={{
                  padding: '6px 0',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <span style={{ color: '#f44336', fontSize: '14px' }}>•</span>
                  <span>Focus on <strong>official documents</strong> and clerical content</span>
                </li>
                <li style={{
                  padding: '6px 0',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <span style={{ color: '#f44336', fontSize: '14px' }}>•</span>
                  <span>Practice <strong>both languages</strong> if undecided on medium</span>
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
                ⚡ Speed Building
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
                  <span>Start with <strong>accuracy</strong>, then increase speed gradually</span>
                </li>
                <li style={{
                  padding: '6px 0',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <span style={{ color: '#f44336', fontSize: '14px' }}>•</span>
                  <span>Use <strong>touch typing</strong> techniques for efficiency</span>
                </li>
                <li style={{
                  padding: '6px 0',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <span style={{ color: '#f44336', fontSize: '14px' }}>•</span>
                  <span>Practice <strong>timed sessions</strong> to build endurance</span>
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
          The SSC CHSL typing test is conducted for posts like <strong>Lower Division Clerk (LDC)</strong>, 
          <strong>Data Entry Operator (DEO)</strong>, and <strong>Postal Assistant</strong>. 
          <strong>Choose your language medium carefully</strong> as it cannot be changed after application. 
          Focus on clerical work content and practice regularly to achieve the required speed and accuracy standards.
        </p>
      </div>
    </div>
  </div>
);

export default SSCCHSLTest; 