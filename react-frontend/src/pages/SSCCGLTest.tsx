import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getCharacterHighlights, normalizeQuotes, isPunctuation, sanitizeInput, formatTime, calculateWordsPerLine } from '../utils/typingUtils';
import { passageService } from '../services/api';
import { useTyping } from '../contexts/TypingContext';
import './SSCCGLTest.css';

interface TestStats {
  grossSpeed: number;
  netSpeed: number;
  accuracy: number;
  mistakes: number;
  totalWords: number;
  correctWords: number;
  incorrectWords: number;
}

const SSCCGLTest: React.FC = () => {
  const {
    passages,
    setPassages,
    selectedPassage,
    setSelectedPassage,
    typingStats,
    updateTypingStats,
    resetTypingStats,
    examMode,
    setExamMode
  } = useTyping();

  const [passageWords, setPassageWords] = useState<string[]>([]);
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [stats, setStats] = useState<TestStats>({
    grossSpeed: 0,
    netSpeed: 0,
    accuracy: 0,
    mistakes: 0,
    totalWords: 0,
    correctWords: 0,
    incorrectWords: 0
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const typingAreaRef = useRef<HTMLTextAreaElement>(null);
  const sampleTextRef = useRef<HTMLDivElement>(null);

  const fetchPassages = useCallback(async () => {
    try {
      const data = await passageService.getByTest('SSC CGL');
      setPassages(data);
      if (data.length > 0) {
        setPassageWords(data[0].content.trim().split(/\s+/));
      }
    } catch (error) {
      console.error('Error fetching passages:', error);
    }
  }, [setPassages]);

  useEffect(() => {
    fetchPassages();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      resetTypingStats();
    };
  }, [fetchPassages, resetTypingStats]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTestComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [isRunning]);

  const handleTestComplete = useCallback(() => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const timeTaken = startTime ? (Date.now() - startTime) / 1000 : 0;
    const grossWPM = Math.round((typedWords.length / timeTaken) * 60);
    const accuracy = Math.round((typingStats.correctWords / typedWords.length) * 100);
    const netWPM = Math.round(grossWPM * (accuracy / 100));

    updateTypingStats({
      grossSpeed: grossWPM,
      netSpeed: netWPM,
      accuracy,
    });

    setShowFeedback(true);
    setFeedbackText(generateFeedback(grossWPM, netWPM, accuracy));
  }, [startTime, typedWords.length, typingStats.correctWords, updateTypingStats]);

  const generateFeedback = (grossWPM: number, netWPM: number, accuracy: number) => {
    let feedback = `Test Complete!\n\nGross Speed: ${grossWPM} WPM\nNet Speed: ${netWPM} WPM\nAccuracy: ${accuracy}%`;
    
    if (accuracy < 90) {
      feedback += '\n\nTip: Focus on accuracy over speed. Try to maintain at least 90% accuracy.';
    }
    if (netWPM < 30) {
      feedback += '\n\nTip: Practice regular typing exercises to improve your speed.';
    }
    
    return feedback;
  };

  const startTest = () => {
    if (!isRunning && passages.length > 0) {
      setIsRunning(true);
      setStartTime(Date.now());
      if (typingAreaRef.current) {
        typingAreaRef.current.disabled = false;
        typingAreaRef.current.focus();
      }
    }
  };

  const pauseTest = () => {
    if (isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsRunning(false);
      if (typingAreaRef.current) typingAreaRef.current.disabled = true;
    } else {
      startTest();
    }
  };

  const restartTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setTimeLeft(900);
    setStats({
      grossSpeed: 0,
      netSpeed: 0,
      accuracy: 0,
      mistakes: 0,
      totalWords: 0,
      correctWords: 0,
      incorrectWords: 0
    });
    setTypedWords([]);
    setShowFeedback(false);
    if (typingAreaRef.current) {
      typingAreaRef.current.value = '';
      typingAreaRef.current.disabled = true;
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div id="typing-test-page">
      <div className="test-container">
        <div className="test-main">
          <div className="test-header">
            <div className="selector-group">
              <label htmlFor="passage-selector" className="selector-label">Select Passage</label>
              <select id="passage-selector">
                {passages.map((passage, index) => (
                  <option key={passage._id} value={index}>
                    {`Passage ${index + 1}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="selector-group">
              <label htmlFor="exam-mode-selector" className="selector-label">Mode of Exam</label>
              <select 
                id="exam-mode-selector"
                value={examMode}
                onChange={(e) => setExamMode(e.target.value as 'Paper Typing' | 'Screen Typing')}
              >
                <option value="Paper Typing">Paper Typing</option>
                <option value="Screen Typing">Screen Typing</option>
              </select>
            </div>
            <div className="selector-group">
              <label htmlFor="timer-duration" className="selector-label">Duration</label>
              <select id="timer-duration">
                <option value="900">15 min</option>
                <option value="1200">20 min</option>
              </select>
            </div>
            <div id="timer" className="timer">{formatTime(timeLeft)}</div>
          </div>

          <div id="sample-text-container" className="sample-text-container" ref={sampleTextRef}>
            <p id="sample-text" className="sample-text">
              {passageWords.join(' ')}
            </p>
          </div>

          <textarea
            ref={typingAreaRef}
            id="typing-area"
            placeholder="Start typing here..."
            disabled={!isRunning}
          />

          <div className="control-buttons">
            <button 
              id="start-test" 
              className="btn btn-primary"
              onClick={startTest}
              disabled={isRunning}
            >
              Start
            </button>
            <button 
              id="stop-test" 
              className="btn btn-danger"
              onClick={pauseTest}
              disabled={!isRunning}
            >
              {isRunning ? 'Pause' : 'Resume'}
            </button>
            <button 
              id="restart-test" 
              className="btn btn-success"
              onClick={restartTest}
              disabled={!isRunning && timeLeft === 900}
            >
              Restart
            </button>
          </div>
        </div>

        <div className="result-section">
          <div className="result-header">
            <h3>RESULT</h3>
          </div>
          <div className="metric-block">
            <span>Gross Speed:</span>
            <span><span id="live-gross-speed">{stats.grossSpeed}</span> wpm</span>
          </div>
          <div className="metric-block">
            <span>Net Speed:</span>
            <span><span id="live-net-speed">{stats.netSpeed}</span> wpm</span>
          </div>
          <div className="metric-block">
            <span>Accuracy:</span>
            <span><span id="live-accuracy">{stats.accuracy}</span>%</span>
          </div>
          <div className="metric-block">
            <span>Mistakes:</span>
            <span id="live-mistakes">{stats.mistakes}</span>
          </div>
          <div className="metric-block">
            <span>Total Words:</span>
            <span id="live-total-words">{stats.totalWords}</span>
          </div>
          <div className="metric-block">
            <span>Correct Words:</span>
            <span id="live-correct-words">{stats.correctWords}</span>
          </div>
          <div className="metric-block">
            <span>Incorrect Words:</span>
            <span id="live-incorrect-words">{stats.incorrectWords}</span>
          </div>
          {showFeedback && (
            <div id="feedback-container" className="feedback-container show">
              <p id="feedback-text" className="feedback-text">{feedbackText}</p>
              <button 
                id="feedback-cancel" 
                className="feedback-cancel"
                onClick={() => setShowFeedback(false)}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SSCCGLTest; 