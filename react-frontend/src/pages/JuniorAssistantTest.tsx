import React from 'react';
import TypingEngine from '../components/common/TypingEngine';

  const config = {
  testName: 'Junior Assistant',
  timeLimit: 600,
  passageCategory: 'Junior Assistant',
    qualificationCriteria: {
      minWpm: 25,
    minAccuracy: 85
    }
  };

const JuniorAssistantTest = () => (
  <div>
    <TypingEngine config={config} />
    
    {/* Comprehensive Junior Assistant Typing Test Information */}
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
          Junior Assistant Typing Test
        </h1>
        <p style={{
          fontSize: '18px',
          opacity: '0.95',
          lineHeight: '1.6',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          Qualifying skill test for LDC/JSA/PA/SA positions (CBSE/SSC CHSL Level). 
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
          📋 Junior Assistant Typing Test Basic Details
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
              <strong>10 minutes</strong> for the typing test
            </p>
            <p style={{ color: '#666', margin: '5px 0 0 0', fontSize: '14px' }}>
              Standard time allocation for all candidates
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
              🌐 Language Options
            </h4>
            <p style={{ color: '#333', margin: 0, fontSize: '15px' }}>
              <strong>English or Hindi</strong> - Choice available
            </p>
            <p style={{ color: '#666', margin: '5px 0 0 0', fontSize: '14px' }}>
              Selected during application form filling
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
              <strong>SSC/CBSE software</strong> provided
            </p>
            <p style={{ color: '#666', margin: '5px 0 0 0', fontSize: '14px' }}>
              Computer-based typing interface
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
          </div>
          
          <div>
            <h3 style={{
              color: '#2e7d32',
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '15px'
            }}>
              ⌨️ Key Depressions per Hour
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
                <span style={{ background: '#4caf50', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '14px' }}>~10,500 KDPH</span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '15px',
                alignItems: 'center',
                padding: '12px 0'
              }}>
                <span style={{ fontWeight: '600', color: '#2e7d32' }}>🇮🇳 Hindi</span>
                <span style={{ background: '#ff9800', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '14px' }}>~9,000 KDPH</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Required Skills Section */}
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
          🎯 Required Skills for Junior Assistant
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
              💻 Technical Skills
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
                <span><strong>Practical Knowledge:</strong> English/Hindi typing experience</span>
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#ff9800', fontSize: '16px' }}>•</span>
                <span><strong>Touch Typing:</strong> Basic practice for accuracy + speed</span>
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#ff9800', fontSize: '16px' }}>•</span>
                <span><strong>Keyboard Layout:</strong> QWERTY keyboard knowledge</span>
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#ff9800', fontSize: '16px' }}>•</span>
                <span><strong>Font Familiarity:</strong> Krutidev/Mangal for Hindi</span>
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
              📝 Content Skills
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
                <span><strong>Official Documents:</strong> Letters, reports, forms</span>
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#ff9800', fontSize: '16px' }}>•</span>
                <span><strong>Administrative:</strong> Office work and clerical tasks</span>
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#ff9800', fontSize: '16px' }}>•</span>
                <span><strong>Current Affairs:</strong> General knowledge topics</span>
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#ff9800', fontSize: '16px' }}>•</span>
                <span><strong>Simple Articles:</strong> Easy-to-understand content</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Guidelines Section */}
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
          📋 Guidelines for Junior Assistant Typing Test
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '25px'
        }}>
          <div>
            <h3 style={{
              color: '#6a1b9a',
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '15px'
            }}>
              🖥️ Test Platform Rules
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{
                padding: '10px 0',
                borderBottom: '1px solid #e1bee7',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#9c27b0', fontSize: '18px' }}>✓</span>
                <span><strong>Software:</strong> SSC/CBSE provided software only</span>
              </li>
              <li style={{
                padding: '10px 0',
                borderBottom: '1px solid #e1bee7',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#9c27b0', fontSize: '18px' }}>✓</span>
                <span><strong>Language:</strong> Use only selected language from form</span>
              </li>
              <li style={{
                padding: '10px 0',
                borderBottom: '1px solid #e1bee7',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#9c27b0', fontSize: '18px' }}>✓</span>
                <span><strong>Passage:</strong> Moderate difficulty level content</span>
              </li>
              <li style={{
                padding: '10px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#9c27b0', fontSize: '18px' }}>✓</span>
                <span><strong>Retyping:</strong> Not required, use extra time for corrections</span>
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
              🎯 Accuracy Requirements
            </h3>
            <div style={{
              background: '#f3e5f5',
          padding: '20px',
              borderRadius: '12px',
              border: '1px solid #ce93d8'
            }}>
              <p style={{ color: '#333', margin: '0 0 15px 0', lineHeight: '1.6' }}>
                <strong>High Accuracy Priority:</strong> Only high speed is not sufficient for qualification.
              </p>
              <p style={{ color: '#333', margin: '0 0 15px 0', lineHeight: '1.6' }}>
                <strong>Error Tolerance:</strong> Approximately 8-10% errors allowed (category-wise relaxation possible).
              </p>
              <p style={{ color: '#333', margin: 0, lineHeight: '1.6' }}>
                <strong>Focus Areas:</strong> Both speed and accuracy must be maintained together.
              </p>
            </div>
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
          🎯 Junior Assistant Typing Test Preparation Tips
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
                ⏰ Daily Practice Schedule
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
                  <span><strong>Daily Practice:</strong> Minimum 1-2 hours typing practice</span>
                </li>
                <li style={{
                  padding: '6px 0',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <span style={{ color: '#f44336', fontSize: '14px' }}>•</span>
                  <span><strong>Software Use:</strong> Typing software or online mock tests</span>
                </li>
                <li style={{
                  padding: '6px 0',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <span style={{ color: '#f44336', fontSize: '14px' }}>•</span>
                  <span><strong>Focus Priority:</strong> Accuracy over speed initially</span>
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
                💡 Technical Tips
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
                  <span><strong>Proper Posture:</strong> Wrists lightly on keyboard, fingers positioned</span>
                </li>
                <li style={{
                  padding: '6px 0',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <span style={{ color: '#f44336', fontSize: '14px' }}>•</span>
                  <span><strong>Hindi Fonts:</strong> Practice Krutidev/Mangal fonts</span>
                </li>
                <li style={{
                  padding: '6px 0',
            color: '#333',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <span style={{ color: '#f44336', fontSize: '14px' }}>•</span>
                  <span><strong>QWERTY Layout:</strong> Master keyboard positioning</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* PwD Guidelines Section */}
      <div style={{
        background: '#fff',
        border: '2px solid #00bcd4',
        borderRadius: '16px',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 4px 20px rgba(0, 188, 212, 0.1)'
      }}>
        <h2 style={{
          color: '#00695c',
          fontSize: '24px',
          fontWeight: '700',
          marginBottom: '20px',
          borderBottom: '3px solid #00bcd4',
          paddingBottom: '10px'
        }}>
          ♿ PwD / OH Candidate Guidelines
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '25px'
        }}>
          <div style={{
            background: '#e0f2f1',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #80cbc4'
          }}>
            <h4 style={{
              color: '#00695c',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🦴 Orthopedically Handicapped (OH)
            </h4>
            <p style={{ color: '#333', margin: 0, lineHeight: '1.6' }}>
              <strong>Exemption:</strong> May be exempted from typing test with proper medical certificate.
            </p>
          </div>
          
          <div style={{
            background: '#e0f2f1',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #80cbc4'
          }}>
            <h4 style={{
              color: '#00695c',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ♿ PwBD Candidates
            </h4>
            <p style={{ color: '#333', margin: 0, lineHeight: '1.6' }}>
              <strong>Extra Time:</strong> May be provided up to 5 minutes additional time.
            </p>
          </div>
          
          <div style={{
            background: '#e0f2f1',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #80cbc4'
          }}>
            <h4 style={{
              color: '#00695c',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              👁️ Visually Handicapped
            </h4>
            <p style={{ color: '#333', margin: 0, lineHeight: '1.6' }}>
              <strong>Support:</strong> Passage reader and scribe facilities available.
            </p>
          </div>
        </div>
      </div>

      {/* Important Instructions Section */}
      <div style={{
        background: '#fff',
        border: '2px solid #ff5722',
        borderRadius: '16px',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 4px 20px rgba(255, 87, 34, 0.1)'
      }}>
        <h2 style={{
          color: '#bf360c',
          fontSize: '24px',
          fontWeight: '700',
          marginBottom: '20px',
          borderBottom: '3px solid #ff5722',
          paddingBottom: '10px'
        }}>
          ⚠️ Important Instructions
        </h2>
        
        <div style={{
          background: '#fff3e0',
          padding: '25px',
          borderRadius: '12px',
          border: '1px solid #ffcc02'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            <div>
              <h4 style={{
                color: '#bf360c',
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
                  <span style={{ color: '#ff5722', fontSize: '14px' }}>•</span>
                  <span><strong>Documents:</strong> Admit Card + Photo ID mandatory</span>
                </li>
                <li style={{
                  padding: '6px 0',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <span style={{ color: '#ff5722', fontSize: '14px' }}>•</span>
                  <span><strong>Reporting:</strong> 30 minutes before test time</span>
                </li>
                <li style={{
                  padding: '6px 0',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <span style={{ color: '#ff5722', fontSize: '14px' }}>•</span>
                  <span><strong>Certificates:</strong> Educational, caste certificates required</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 style={{
                color: '#bf360c',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                📝 After Test
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
                  <span style={{ color: '#ff5722', fontSize: '14px' }}>•</span>
                  <span><strong>Hand Writing:</strong> May be asked to write passage portion</span>
                </li>
                <li style={{
                  padding: '6px 0',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <span style={{ color: '#ff5722', fontSize: '14px' }}>•</span>
                  <span><strong>Verification:</strong> For authenticity confirmation</span>
                </li>
                <li style={{
                  padding: '6px 0',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <span style={{ color: '#ff5722', fontSize: '14px' }}>•</span>
                  <span><strong>Cooperation:</strong> Follow all instructions carefully</span>
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
          The Junior Assistant typing test is conducted for <strong>LDC/JSA/PA/SA</strong> positions at 
          <strong>CBSE/SSC CHSL level</strong>. <strong>Choose your language carefully</strong> during application as it cannot be changed. 
          Focus on <strong>both accuracy and speed</strong> - high speed alone is not sufficient for qualification. 
          Practice regularly with proper typing software and maintain correct posture for better performance.
        </p>
      </div>
    </div>
  </div>
);

export default JuniorAssistantTest; 
 