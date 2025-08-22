import React from 'react';
import TypingEngine from '../components/common/TypingEngine';

  const config = {
  testName: 'RRB NTPC',
  timeLimit: 600,
  passageCategory: 'RRB NTPC',
    qualificationCriteria: {
      minWpm: 25,
    minAccuracy: 85
    }
  };

const RRBNTPCTest = () => (
  <div>
    <TypingEngine config={config} />
    
    {/* Comprehensive RRB NTPC Typing Test Information */}
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
          RRB NTPC Typing Test
        </h1>
        <p style={{
          fontSize: '18px',
          opacity: '0.95',
          lineHeight: '1.6',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          Qualifying skill test for Account Clerk Cum Typist and Junior Clerk Cum Typist positions. 
          Computer-based typing test assessing speed and accuracy in English or Hindi.
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
          📋 RRB NTPC Typing Test Basic Details
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
              Must meet speed requirement to proceed
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
              <strong>Computer-based</strong> typing test
            </p>
            <p style={{ color: '#666', margin: '5px 0 0 0', fontSize: '14px' }}>
              Personal computer provided for test
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
              Hindi candidates get Krutidev/Mangal font
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
                <span style={{ background: '#4caf50', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '14px' }}>30 WPM</span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '15px',
                alignItems: 'center',
                padding: '12px 0'
              }}>
                <span style={{ fontWeight: '600', color: '#2e7d32' }}>🇮🇳 Hindi</span>
                <span style={{ background: '#ff9800', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '14px' }}>25 WPM</span>
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
                <strong>Note:</strong> Speed requirements are minimum standards that must be achieved to qualify.
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
              📋 Minimum Word Requirements
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
                <span style={{ background: '#4caf50', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '14px' }}>300 words</span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '15px',
                alignItems: 'center',
                padding: '12px 0'
              }}>
                <span style={{ fontWeight: '600', color: '#2e7d32' }}>🇮🇳 Hindi</span>
                <span style={{ background: '#ff9800', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '14px' }}>250 words</span>
              </div>
            </div>
            
            <div style={{
              background: '#ffebee',
              padding: '15px',
              borderRadius: '8px',
              marginTop: '15px',
              border: '1px solid #ffcdd2'
            }}>
              <p style={{ color: '#c62828', margin: 0, fontSize: '14px', fontWeight: '500' }}>
                <strong>Warning:</strong> Failure to meet minimum word count results in disqualification.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Test Rules & Restrictions Section */}
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
          ⚠️ Test Rules & Restrictions
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
              🚫 Restricted Tools
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
                <span style={{ color: '#ff9800', fontSize: '16px' }}>❌</span>
                <span><strong>No Backspace:</strong> Editing tools are disabled</span>
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#ff9800', fontSize: '16px' }}>❌</span>
                <span><strong>No Spell Check:</strong> Auto-correction is disabled</span>
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#ff9800', fontSize: '16px' }}>❌</span>
                <span><strong>No Copy-Paste:</strong> Manual typing only</span>
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#ff9800', fontSize: '16px' }}>❌</span>
                <span><strong>No External Tools:</strong> Only basic typing interface</span>
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
              ✅ Allowed Actions
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
                <span style={{ color: '#4caf50', fontSize: '16px' }}>✓</span>
                <span><strong>Retyping:</strong> Can retype if finished early</span>
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#4caf50', fontSize: '16px' }}>✓</span>
                <span><strong>Font Selection:</strong> Hindi candidates get Krutidev/Mangal</span>
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#4caf50', fontSize: '16px' }}>✓</span>
                <span><strong>Language Choice:</strong> English or Hindi selection</span>
              </li>
              <li style={{
                padding: '8px 0',
                color: '#333',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ color: '#4caf50', fontSize: '16px' }}>✓</span>
                <span><strong>Full Time Usage:</strong> Complete 10-minute duration</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Error Calculation Section */}
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
          📊 Error Calculation & Evaluation
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
              🎯 Error Categories
            </h3>
            <div style={{
              background: '#f3e5f5',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #ce93d8'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '15px',
                alignItems: 'center',
                marginBottom: '15px',
                padding: '12px 0',
                borderBottom: '1px solid #e1bee7'
              }}>
                <span style={{ fontWeight: '600', color: '#6a1b9a' }}>🔴 Full Mistakes</span>
                <span style={{ background: '#f44336', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '14px' }}>Major errors</span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '15px',
                alignItems: 'center',
                padding: '12px 0'
              }}>
                <span style={{ fontWeight: '600', color: '#6a1b9a' }}>🟡 Half Mistakes</span>
                <span style={{ background: '#ff9800', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '14px' }}>Minor errors</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 style={{
              color: '#6a1b9a',
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '15px'
            }}>
              📈 Error Tolerance
            </h3>
            <div style={{
              background: '#f3e5f5',
          padding: '20px',
              borderRadius: '12px',
              border: '1px solid #ce93d8'
            }}>
              <p style={{ color: '#333', margin: '0 0 15px 0', lineHeight: '1.6' }}>
                <strong>Error Percentage:</strong> Up to 5% errors may be ignored during evaluation.
              </p>
              <p style={{ color: '#333', margin: '0 0 15px 0', lineHeight: '1.6' }}>
                <strong>Precision:</strong> Errors calculated up to two decimal places for accuracy.
              </p>
              <p style={{ color: '#333', margin: 0, lineHeight: '1.6' }}>
                <strong>Focus:</strong> Primary emphasis on meeting speed requirements.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Exemptions & Special Cases Section */}
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
          ♿ Exemptions & Special Cases
        </h2>
        
        <div style={{
          background: '#ffebee',
          padding: '25px',
          borderRadius: '12px',
          border: '1px solid #ffcdd2'
        }}>
          <h3 style={{
            color: '#c62828',
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '15px'
          }}>
            📋 Permanent Disability Exemptions
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #ffcdd2'
            }}>
              <h4 style={{
                color: '#c62828',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                👁️ Blindness
              </h4>
              <p style={{ color: '#333', margin: 0, lineHeight: '1.6' }}>
                Candidates with permanent blindness may be exempt from the typing test with proper medical certification.
              </p>
            </div>
            
            <div style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #ffcdd2'
            }}>
              <h4 style={{
                color: '#c62828',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                🧠 Cerebral Palsy
              </h4>
              <p style={{ color: '#333', margin: 0, lineHeight: '1.6' }}>
                Candidates with cerebral palsy affecting motor skills may be exempt with appropriate medical documentation.
              </p>
            </div>
          </div>
          
          <div style={{
            background: '#fff3e0',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #ffcc02'
          }}>
            <p style={{ color: '#e65100', margin: 0, fontSize: '14px', fontWeight: '500' }}>
              <strong>Important:</strong> All exemption requests must be supported by proper medical certification from authorized medical authorities. 
              The final decision rests with the Railway Recruitment Board.
            </p>
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
          The RRB NTPC typing test is conducted for <strong>Account Clerk Cum Typist</strong> and 
          <strong>Junior Clerk Cum Typist</strong> positions. <strong>No editing tools are available</strong> during the test, 
          so practice typing without backspace or spell check. <strong>Choose your language carefully</strong> and ensure you meet 
          the minimum word count requirements to avoid disqualification.
        </p>
      </div>
    </div>
  </div>
);

export default RRBNTPCTest; 