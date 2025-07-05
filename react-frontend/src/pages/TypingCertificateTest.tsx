import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './TypingCertificateTest.css';

interface Passage {
  title: string;
  content: string;
}

const TypingCertificateTest: React.FC = () => {
  const [passages, setPassages] = useState<Passage[]>([]);
  const [passageWords, setPassageWords] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(600);
  const [isRunning, setIsRunning] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [totalChars, setTotalChars] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [correctWordsCount, setCorrectWordsCount] = useState(0);
  const [incorrectWordsCount, setIncorrectWordsCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showAdModal, setShowAdModal] = useState(false);
  const [adCompleted, setAdCompleted] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [wordsPerLine, setWordsPerLine] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const normalizeQuotes = (text: string) => {
    return text
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"');
  };

  const isPunctuation = (char: string) => {
    return /[.,!?;:'"()/]/.test(char);
  };

  const fetchPassages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/passages/test/Certificate%20Test');
      if (!response.ok) throw new Error(`Failed to fetch passages: ${response.status}`);
      const data = await response.json();
      setPassages(data);
    } catch (error) {
      console.error('Error fetching passages:', error);
      setPassages([]);
    }
  };

  const calculateResults = useCallback(() => {
    if (!startTime) return;

    const elapsedTimeSeconds = (Date.now() - startTime) / 1000;
    const elapsedTimeMinutes = Math.max(elapsedTimeSeconds / 60, 0.0167);

    const typedText = normalizeQuotes(typingText);
    const expectedText = normalizeQuotes(passageWords.slice(0, typedText.split(/\s+/).length).join(' '));

    let correctCharsCount = 0;
    let punctuationMistakes = 0;

    for (let i = 0; i < typedText.length; i++) {
      if (i < expectedText.length) {
        if (typedText[i] === expectedText[i]) correctCharsCount++;
        else if (isPunctuation(expectedText[i]) || isPunctuation(typedText[i])) punctuationMistakes++;
      } else if (isPunctuation(typedText[i])) punctuationMistakes++;
    }

    for (let i = typedText.length; i < expectedText.length; i++) {
      if (isPunctuation(expectedText[i])) punctuationMistakes++;
    }

    const nonPunctuationMistakes = (typedText.length - correctCharsCount) - punctuationMistakes;
    const totalMistakes = nonPunctuationMistakes + (punctuationMistakes * 0.5);

    setTotalChars(typedText.length);
    setCorrectChars(correctCharsCount);
    setMistakes(totalMistakes);
  }, [typingText, passageWords, startTime]);

  const startTimer = () => {
    if (!isRunning && passages.length > 0) {
      setIsRunning(true);
      setStartTime(Date.now());
      setTimeLeft(600);
    }
  };

  const pauseTimer = () => {
    setIsRunning(!isRunning);
  };

  const restartTest = () => {
    setIsRunning(false);
    setStartTime(null);
    setCurrentWordIndex(0);
    setCurrentLine(0);
    setTypedWords([]);
    setTotalChars(0);
    setCorrectChars(0);
    setMistakes(0);
    setCorrectWordsCount(0);
    setIncorrectWordsCount(0);
    setTimeLeft(600);
    setTypingText('');
    setShowAdModal(false);
    setAdCompleted(false);
  };

  const submitTest = () => {
    setIsRunning(false);
    calculateResults();
    setShowAdModal(true);
  };

  useEffect(() => {
    fetchPassages();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            submitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (isRunning) {
      calculateResults();
    }
  }, [typingText, isRunning, calculateResults]);

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isRunning) return;
    setTypingText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isRunning) return;

    if (e.key === ' ') {
      const typedText = typingText.trim();
      if (!typedText) {
        e.preventDefault();
        return;
      }

      const typedWordsCurrent = typedText.split(/\s+/);
      const currentTypedWord = typedWordsCurrent[currentWordIndex] || '';

      if (currentTypedWord) {
        setTypedWords(prev => [...prev, currentTypedWord]);
        if (currentTypedWord === passageWords[currentWordIndex]) {
          setCorrectWordsCount(prev => prev + 1);
        } else {
          setIncorrectWordsCount(prev => prev + 1);
        }
      }

      setCurrentWordIndex(prev => prev + 1);
    }
  };

  return (
    <div className="typing-test-page">
      <div className="test-container">
        <div className="test-main">
          <div className="test-header">
            <div className="selector-group">
              <label htmlFor="passage-selector" className="selector-label">Select Passage</label>
              <select
                id="passage-selector"
                onChange={(e) => {
                  const passage = passages[parseInt(e.target.value)];
                  if (passage) {
                    setPassageWords(passage.content.trim().split(/\s+/));
                    restartTest();
                  }
                }}
              >
                <option value="">Select Passage</option>
                {passages.map((passage, index) => (
                  <option key={index} value={index}>{passage.title}</option>
                ))}
              </select>
            </div>
            <div className={`timer ${timeLeft <= 30 ? 'low-time' : ''}`}>
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="sample-text-container">
            <p className="sample-text">
              {passageWords.map((word, index) => (
                <span
                  key={index}
                  className={`word ${index === currentWordIndex ? 'current-word' : ''}`}
                >
                  {word}
                </span>
              ))}
            </p>
          </div>

          <textarea
            value={typingText}
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
            placeholder="Start typing here..."
            disabled={!isRunning}
          />

          <div className="control-buttons">
            <button
              className="btn btn-primary"
              onClick={startTimer}
              disabled={isRunning}
            >
              Start
            </button>
            <button
              className="btn btn-danger"
              onClick={pauseTimer}
              disabled={!isRunning}
            >
              {isRunning ? 'Pause' : 'Resume'}
            </button>
            <button
              className="btn btn-success"
              onClick={restartTest}
              disabled={!isRunning}
            >
              Restart
            </button>
            <button
              className="btn btn-danger"
              onClick={submitTest}
              disabled={!isRunning}
            >
              Submit
            </button>
          </div>
        </div>

        <div className="result-section">
          <div className="result-header">
            <h3>RESULT</h3>
          </div>
          <div className="metric-block">
            <span>Gross Speed:</span>
            <span>{Math.round((totalChars / 5) / ((Date.now() - (startTime || Date.now())) / 60000))} wpm</span>
          </div>
          <div className="metric-block">
            <span>Net Speed:</span>
            <span>{Math.round((correctChars / 5) / ((Date.now() - (startTime || Date.now())) / 60000))} wpm</span>
          </div>
          <div className="metric-block">
            <span>Accuracy:</span>
            <span>{totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0}%</span>
          </div>
          <div className="metric-block">
            <span>Mistakes:</span>
            <span>{mistakes.toFixed(1)}</span>
          </div>
          <div className="metric-block">
            <span>Total Words:</span>
            <span>{typedWords.length}</span>
          </div>
          <div className="metric-block">
            <span>Correct Words:</span>
            <span>{correctWordsCount}</span>
          </div>
          <div className="metric-block">
            <span>Incorrect Words:</span>
            <span>{incorrectWordsCount}</span>
          </div>
        </div>
      </div>

      {showAdModal && (
        <div className="ad-modal show">
          <div className="ad-content">
            <p>Please watch the ad to download your certificate.</p>
            <video
              controls
              onEnded={() => setAdCompleted(true)}
              style={{ display: adCompleted ? 'none' : 'block' }}
            >
              <source src="/placeholder-ad.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {adCompleted && (
              <>
                <p>Ad completed! You can now download your certificate.</p>
                <a
                  href="/certificate.pdf"
                  download
                  className="btn btn-primary"
                  style={{ margin: '10px 0' }}
                >
                  Download Certificate
                </a>
              </>
            )}
            
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowAdModal(false);
                setAdCompleted(false);
              }}
              style={{ marginTop: '10px' }}
            >
              <FontAwesomeIcon icon={faTimes} /> Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypingCertificateTest; 