import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faPause,
  faRedo,
  faCheck,
  faClock,
  faKeyboard,
  faFileAlt,
  faChartLine,
  faExclamationTriangle,
  faTimes,
  faBackspace,
  faCertificate
} from '@fortawesome/free-solid-svg-icons';
import { useTypingTest } from '../../hooks/useTypingTest';
import CertificateModal from '../Certificate/CertificateModal';
import './TypingEngine.css';

interface TypingEngineProps {
  config: {
    testName: string;
    timeLimit: number;
    passageCategory: string;
    qualificationCriteria: {
      minWpm: number;
      minAccuracy: number;
    };
    customPassage?: string;
  };
  backButton?: React.ReactNode;
  hideFeedbackModal?: boolean;
  hideDurationSelector?: boolean;
}

const TypingEngine: React.FC<TypingEngineProps> = ({ config, backButton, hideFeedbackModal, hideDurationSelector }) => {
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [testResults, setTestResults] = useState<{
    wpm: number;
    accuracy: number;
    userName: string;
    userId: string;
  } | null>(null);

  const {
    // State
    passages,
    selectedPassageIndex,
    isRunning,
    timeLeft,
    selectedDuration,
    showFeedback,
    typingStats,
    typedText,
    examMode,
    startTime,
    
    // Refs
    typingAreaRef,
    sampleTextContainerRef,
    sampleTextRef,
    
    // Functions
    formatTime,
    startTest,
    pauseTest,
    restartTest,
    submitTest,
    handleCloseFeedback,
    handlePassageChange,
    handleDurationChange,
    handleExamModeChange,
    handleTypingChange,
    handleKeyDown,
    handlePaste,
    handleCopy,
    handleCut,
    handleContextMenu,
  } = useTypingTest(config);

  const handleCertificateClick = () => {
    // Get user info from localStorage or context
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setTestResults({
      wpm: typingStats.netSpeed,
      accuracy: typingStats.accuracy,
      userName: user.name || 'User',
      userId: user._id || 'anonymous'
    });
    setShowCertificateModal(true);
  };

  const getFeedbackMessage = (wpm: number, accuracy: number) => {
    let message = '';
    let detailMessage = '';

    if (wpm >= 40 && accuracy >= 95) {
      message = "Excellent Work! 🎉";
      detailMessage = "You're typing at an expert level! Keep practicing to maintain this performance.";
    } else if (wpm >= 30 && accuracy >= 90) {
      message = "Great Job! 👏";
      detailMessage = "You're typing at a professional level. A bit more practice and you'll reach expert level!";
    } else if (wpm >= 20 && accuracy >= 85) {
      message = "Good Effort! 💪";
      detailMessage = "You're making good progress. Focus on accuracy and speed will follow.";
    } else {
      message = "Keep Practicing! 📝";
      detailMessage = "Focus on accuracy first, then gradually increase your speed.";
    }

    if (accuracy < 85) {
      detailMessage += " Try to type slower but correctly.";
    }
    if (wpm < 20) {
      detailMessage += " Build muscle memory with regular practice.";
    }

    return { message, detailMessage };
  };

  return (
    <div className="typing-test-container">
      <Helmet>
        <title>{config.testName} - Practice for Government Exams</title>
        <meta name="description" content={`Free online ${config.testName} practice platform. Improve your typing speed and accuracy for government exams. Real-time feedback and detailed analysis.`} />
        <meta name="keywords" content={`${config.testName}, typing practice, typing speed test, typing accuracy, typing tutor`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content={`${config.testName} Practice`} />
        <meta property="og:description" content={`Practice typing for ${config.testName} with real-time feedback and detailed analysis.`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="test-container">
        <div className="test-main">
          <div className="test-header">
            <div className="selector-group">
                <label htmlFor="passage-selector" className="selector-label">
                  <FontAwesomeIcon icon={faFileAlt} className="icon" /> Select Passage
                </label>
              <select
                id="passage-selector"
                value={selectedPassageIndex}
                onChange={handlePassageChange}
                disabled={isRunning}
              >
                {passages.map((passage, index) => (
                  <option key={index} value={index}>
                    {passage.title || `Passage ${index + 1}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="selector-group">
                <label htmlFor="exam-mode" className="selector-label">
                  <FontAwesomeIcon icon={faKeyboard} className="icon" /> Mode of Exam
                </label>
              <select
                id="exam-mode"
                value={examMode}
                onChange={handleExamModeChange}
                disabled={isRunning}
              >
                <option value="Screen Typing">Screen Typing</option>
                <option value="Paper Typing">Paper Typing</option>
              </select>
            </div>
            {!hideDurationSelector && (
            <div className="selector-group">
                <label htmlFor="timer-duration" className="selector-label">
                  <FontAwesomeIcon icon={faClock} className="icon" /> Duration
                </label>
              <select
                id="timer-duration"
                value={selectedDuration}
                onChange={handleDurationChange}
                disabled={isRunning}
              >
                <option value={120}>2 min</option>
                <option value={300}>5 min</option>
                <option value={600}>10 min</option>
                <option value={900}>15 min</option>
              </select>
            </div>
            )}
            <div className={`timer ${timeLeft <= 30 ? 'low-time' : ''}`}>
                <FontAwesomeIcon icon={faClock} className="icon" /> {formatTime(timeLeft)}
            </div>
          </div>

          <div
            ref={sampleTextContainerRef}
            className="sample-text-container"
            tabIndex={0}
            onClick={() => !isRunning && startTest()}
          >
            <p ref={sampleTextRef} className="sample-text" />
          </div>

          <textarea
            ref={typingAreaRef}
            value={typedText}
            onChange={handleTypingChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onCopy={handleCopy}
            onCut={handleCut}
            onContextMenu={handleContextMenu}
            readOnly={!isRunning}
            className={`typing-area${showFeedback && !hideFeedbackModal ? ' blurred' : ''}`}
            placeholder={isRunning ? "Start typing here..." : "Click 'Start' to begin typing test"}
            style={{ 
              cursor: isRunning ? 'text' : 'not-allowed',
              backgroundColor: isRunning ? '#fff' : '#f5f5f5'
            }}
          />

          <div className="control-buttons">
            <button
              className="btn btn-primary"
              onClick={startTest}
              disabled={isRunning}
            >
                <FontAwesomeIcon icon={faPlay} className="icon" /> Start
            </button>
            <button
              className="btn btn-danger"
              onClick={pauseTest}
              disabled={!isRunning}
            >
                <FontAwesomeIcon icon={isRunning ? faPause : faPlay} className="icon" />
              {isRunning ? 'Pause' : 'Resume'}
            </button>
            <button
              className="btn btn-success"
              onClick={restartTest}
              disabled={!isRunning && !startTime}
            >
                <FontAwesomeIcon icon={faRedo} className="icon" /> Restart
            </button>
            {isRunning && (
              <button
                className="btn btn-danger"
                onClick={submitTest}
                disabled={!isRunning}
              >
                <FontAwesomeIcon icon={faCheck} className="icon" /> Submit
              </button>
            )}
            {!isRunning && startTime && typingStats.netSpeed > 0 && (
              <button
                className="btn btn-certificate"
                onClick={handleCertificateClick}
              >
                <FontAwesomeIcon icon={faCertificate} className="icon" /> Certificate
              </button>
            )}
            {backButton}
          </div>
        </div>

        <div className="result-section">
          <div className="result-header">
              <h3>
                <FontAwesomeIcon icon={faChartLine} className="icon" /> RESULTS
              </h3>
          </div>
          <div className="metric-block">
              <span>
                <FontAwesomeIcon icon={faKeyboard} className="icon" /> Gross Speed:
              </span>
            <span>{typingStats.grossSpeed} wpm</span>
          </div>
          <div className="metric-block">
              <span>
                <FontAwesomeIcon icon={faKeyboard} className="icon" /> Net Speed:
              </span>
            <span>{typingStats.netSpeed} wpm</span>
          </div>
          <div className="metric-block">
              <span>
                <FontAwesomeIcon icon={faCheck} className="icon" /> Accuracy:
              </span>
            <span>{typingStats.accuracy}%</span>
          </div>
          <div className="metric-block">
              <span>
                <FontAwesomeIcon icon={faExclamationTriangle} className="icon" /> Mistakes:
              </span>
            <span>{typingStats.mistakes}</span>
          </div>
          <div className="metric-block">
              <span>
                <FontAwesomeIcon icon={faBackspace} className="icon" /> Backspaces:
              </span>
            <span>{typingStats.backspaces}</span>
          </div>
          <div className="metric-block">
              <span>
                <FontAwesomeIcon icon={faFileAlt} className="icon" /> Total Words:
              </span>
            <span>{typingStats.totalWords}</span>
          </div>
          <div className="metric-block">
              <span>
                <FontAwesomeIcon icon={faCheck} className="icon" /> Correct Words:
              </span>
            <span>{typingStats.correctWords}</span>
          </div>
          <div className="metric-block">
              <span>
                <FontAwesomeIcon icon={faExclamationTriangle} className="icon" /> Incorrect Words:
              </span>
            <span>{typingStats.incorrectWords}</span>
          </div>
        </div>
      </div>

      {!hideFeedbackModal && showFeedback && (
        <div className="feedback-modal">
          <div className="feedback-content">
            <button className="feedback-close" onClick={handleCloseFeedback}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            
            <div className="feedback-message">
              {getFeedbackMessage(typingStats.grossSpeed, typingStats.accuracy).message}
            </div>
            
            <div className="feedback-detail">
              {getFeedbackMessage(typingStats.grossSpeed, typingStats.accuracy).detailMessage}
            </div>

            <div className="feedback-stats">
              <div className="stat-item">
                <div className="stat-label">Gross Speed</div>
                <div className="stat-value">{typingStats.grossSpeed} WPM</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Net Speed</div>
                <div className="stat-value">{typingStats.netSpeed} WPM</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Accuracy</div>
                <div className="stat-value">{typingStats.accuracy}%</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Mistakes</div>
                <div className="stat-value">{typingStats.mistakes}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Time Taken</div>
                <div className="stat-value">{formatTime(typingStats.timeTaken)}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Backspaces</div>
                <div className="stat-value">{typingStats.backspaces}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Total Words</div>
                <div className="stat-value">{typingStats.totalWords}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Correct Words</div>
                <div className="stat-value">{typingStats.correctWords}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Incorrect Words</div>
                <div className="stat-value">{typingStats.incorrectWords}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Time per Word</div>
                <div className="stat-value">{typingStats.timePerWord}</div>
              </div>
            </div>

            <div className="feedback-actions">
              <button className="feedback-button" onClick={handleCloseFeedback}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      <CertificateModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        testResults={testResults}
      />
    </div>
  );
};

export default TypingEngine; 