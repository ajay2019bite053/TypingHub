import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExclamationTriangle,
  faTimes,
  faTrophy
} from '@fortawesome/free-solid-svg-icons';
import { useCompetition } from '../contexts/CompetitionContext';
import TypingEngine from '../components/common/TypingEngine';
import Toast, { ToastType } from '../components/Toast/Toast';
import './CompetitionTypingTest.css';

interface CompetitionTestData {
  secretId: string;
  name: string;
  competitionId: string;
  passage?: string; // Optional passage field
}

const CompetitionTypingTest: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { submitCompetitionResult } = useCompetition();

  const [competitionData, setCompetitionData] = useState<CompetitionTestData | null>(null);
  const [showWarning, setShowWarning] = useState(true);
  const [testCompleted, setTestCompleted] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    type: ToastType;
    message: string;
  }>({
    show: false,
    type: 'info',
    message: ''
  });
  
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Get competition data from location state
    const data = location.state?.competitionData;
    if (!data) {
      showToast('error', 'No competition data found. Please join the competition first.');
      navigate('/');
      return;
    }
    setCompetitionData(data);
  }, [location.state, navigate]);

  const handleStartTest = () => {
    setShowWarning(false);
  };

    const handleTestComplete = async (testResults: any) => {
    if (!competitionData || testCompleted) return;
    
    setTestCompleted(true);
    
          // Debug: Log the test results and competition data
      console.log('Test Results received:', testResults);
      console.log('Test Results keys:', Object.keys(testResults));
      console.log('Test Results values:', Object.values(testResults));
      console.log('Test Results types:', {
        grossSpeed: typeof testResults.grossSpeed,
        netSpeed: typeof testResults.netSpeed,
        accuracy: typeof testResults.accuracy,
        mistakes: typeof testResults.mistakes,
        backspaces: typeof testResults.backspaces,
        totalWords: typeof testResults.totalWords,
        correctWords: typeof testResults.correctWords,
        incorrectWords: typeof testResults.incorrectWords,
        timeTaken: typeof testResults.timeTaken
      });
      console.log('Competition Data:', competitionData);
    
    // Validate competition data
    if (!competitionData.secretId) {
      console.error('Missing competition secretId:', competitionData);
      showToast('error', 'Competition data is incomplete. Please try again.');
      return;
    }
    
          // Prepare the data to be sent with better fallbacks
      const submissionData = {
        secretId: competitionData.secretId,
        name: competitionData.name, // Add name field for backend validation
        grossSpeed: Number(testResults.grossSpeed || testResults.netSpeed || 0),
        netSpeed: Number(testResults.netSpeed || 0),
        accuracy: Number(testResults.accuracy || 0),
        wordAccuracy: Number(testResults.accuracy || 0), // Use accuracy for wordAccuracy
        mistakes: Number(testResults.mistakes || 0),
        backspaces: Number(testResults.backspaces || 0),
        totalWords: Number(testResults.totalWords || 0),
        correctWords: Number(testResults.correctWords || 0),
        incorrectWords: Number(testResults.incorrectWords || 0),
        timeTaken: Number(testResults.timeTaken || 600) // 10 minutes in seconds
      };
    
    // Validate required fields
    if (!submissionData.secretId || submissionData.netSpeed < 0 || submissionData.accuracy < 0) {
      console.error('Missing required fields:', submissionData);
      showToast('error', 'Test results are incomplete. Please try again.');
      return;
    }
    
    console.log('Submitting competition result with data:', submissionData);
    
    setIsSubmitting(true);
      
      try {
        // Submit comprehensive competition result
        const result = await submitCompetitionResult(submissionData);

      if (result.success) {
        // Debug logging to see what we're receiving
        const resultData = result.data;
        console.log('Competition result response:', result);
        console.log('Result data:', resultData);
        
        // Show simple success message without detailed results
        showToast('success', '🎉 Test submitted successfully! Redirecting to home page...');
        
        // Redirect to home page immediately (within 1 second)
        setTimeout(() => {
          navigate('/');
        }, 1000); // 1 second delay
      } else {
        console.error('Competition result submission failed:', result);
        showToast('error', result.message || 'Failed to submit test result');
      }
    } catch (error) {
      console.error('Error submitting competition result:', error);
      showToast('error', 'Error submitting test result. Please contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showToast = (type: ToastType, message: string) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: 'info', message: '' });
    }, 5000);
  };

  const handleExit = () => {
    if (window.confirm('Are you sure you want to exit? You cannot retake the competition test.')) {
      navigate('/');
    }
  };

  if (!competitionData) {
    return (
      <div className="competition-test-loading">
        <div className="loading-spinner"></div>
        <p>Loading competition test...</p>
      </div>
    );
  }

  // Competition test configuration - 10 minutes
  const competitionConfig = {
    testName: 'Weekly Competition Test',
    timeLimit: 600, // 10 minutes (600 seconds)
    passageCategory: 'general',
    customPassage: competitionData?.passage || 'Welcome to TypingHub Weekly Competition! This is a test passage for the typing competition. Participants will be tested on their typing speed and accuracy using this text. The competition aims to improve typing skills and provide a platform for users to showcase their abilities. Good luck to all participants!',
    qualificationCriteria: {
      minWpm: 20,
      minAccuracy: 80
    },
    onTestComplete: handleTestComplete // Callback for when test is completed
  };
  
  console.log('Competition config:', competitionConfig);

  return (
    <>
      <Helmet>
        <title>Competition Typing Test - TypingHub</title>
        <meta name="description" content="Weekly typing competition test" />
      </Helmet>

      {showWarning ? (
        <div className="competition-test-container">
          <div className="competition-test-header">
            <div className="header-left">
              <h1>
                <FontAwesomeIcon icon={faTrophy} />
                Weekly Competition Test
              </h1>
              <p>Welcome, {competitionData.name} (ID: {competitionData.secretId})</p>
            </div>
            <div className="header-right">
              <button 
                className="leaderboard-btn" 
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                style={{
                  background: '#1976d2',
                  border: 'none',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginRight: '10px',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
              >
                🏆 Leaderboard
              </button>
              <button className="exit-btn" onClick={handleExit}>
                <FontAwesomeIcon icon={faTimes} />
                Exit
              </button>
            </div>
          </div>

          <div className="competition-warning">
            <div className="warning-content">
              <h3>
                <FontAwesomeIcon icon={faExclamationTriangle} />
                Important Instructions
              </h3>
              <ul>
                <li>You can only attempt this test once</li>
                <li>Test duration is 10 minutes</li>
                <li>No backspace, delete, or arrow keys allowed</li>
                <li>Test will end automatically when time expires</li>
                <li>Results will be final and cannot be changed</li>
                <li>Make sure you have a stable internet connection</li>
              </ul>
              <button className="start-test-btn" onClick={handleStartTest}>
                Start Test
              </button>
            </div>
          </div>
          
          {/* Leaderboard Section */}
          {showLeaderboard && (
            <div className="leaderboard-section" style={{
              background: 'white',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0'
            }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#333', textAlign: 'center' }}>
                🏆 Current Leaderboard
              </h3>
              <div style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center', marginBottom: '20px' }}>
                Complete the test to see your rank!
              </div>
            </div>
          )}
        </div>
      ) : (
        isSubmitting ? (
          <div className="submission-loading" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '50vh',
            background: 'white',
            borderRadius: '15px',
            padding: '40px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e0e0e0'
          }}>
            <div className="loading-spinner" style={{
              width: '50px',
              height: '50px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #1976d2',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '20px'
            }}></div>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
              Submitting Test Results...
            </h3>
            <p style={{ margin: '0', color: '#666', textAlign: 'center' }}>
              Please wait while we process your results and redirect you to the home page.
            </p>
          </div>
        ) : (
          <TypingEngine 
            config={competitionConfig}
            hideFeedbackModal={true}
            hideDurationSelector={true}
            onTestComplete={handleTestComplete}
          />
        )
      )}

      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ show: false, type: 'info', message: '' })}
        />
      )}
    </>
  );
};

export default CompetitionTypingTest;
