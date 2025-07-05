import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './CreateTest.css';

interface Passage {
  id: number;
  title: string;
  content: string;
}

const CreateTest: React.FC = () => {
  // Settings state
  const [showSettings, setShowSettings] = useState(true);
  const [settings, setSettings] = useState({
    language: 'English',
    duration: '600',
    mode: 'Screen Typing',
    backspace: 'Enable',
    customText: ''
  });

  // Test state
  const [passages, setPassages] = useState<Passage[]>([]);
  const [selectedPassage, setSelectedPassage] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(parseInt(settings.duration));
  const [typingText, setTypingText] = useState('');
  const [passageWords, setPassageWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wordsPerLine, setWordsPerLine] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [metrics, setMetrics] = useState({
    grossSpeed: 0,
    netSpeed: 0,
    accuracy: 0,
    mistakes: 0,
    totalWords: 0,
    correctWords: 0,
    incorrectWords: 0
  });

  // Refs
  const sampleTextRef = useRef<HTMLDivElement>(null);
  const typingAreaRef = useRef<HTMLTextAreaElement>(null);
  const sampleTextContainerRef = useRef<HTMLDivElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const wordElementsRef = useRef<HTMLSpanElement[]>([]);

  // Popup state
  const [showPopup, setShowPopup] = useState(false);

  // Settings handlers
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'Hindi') {
      setShowPopup(true);
      setSettings({ ...settings, language: 'English' });
    } else {
      setSettings({ ...settings, language: e.target.value });
    }
  };

  const handleSettingChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    setSettings({
      ...settings,
      [e.target.id]: e.target.value
    });
  };

  const handleApplySettings = async () => {
    if (settings.language === 'Hindi') {
      setShowPopup(true);
      return;
    }
    
    setTimeLeft(parseInt(settings.duration));
    setShowSettings(false);
    await fetchPassages();
  };

  // Test functionality
  const fetchPassages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/passages/test/Create%20Test');
      const fetchedPassages = response.data;
      if (settings.customText.trim()) {
        fetchedPassages.unshift({ 
          id: 0,
          title: 'Custom Passage', 
          content: settings.customText.trim() 
        });
      }
      setPassages(fetchedPassages);
      if (fetchedPassages.length > 0) {
        setSelectedPassage(0);
        setPassageWords(fetchedPassages[0].content.trim().split(/\s+/));
      }
    } catch (error) {
      console.error('Error fetching passages:', error);
      if (settings.customText.trim()) {
        setPassages([{
          id: 0,
          title: 'Custom Passage',
          content: settings.customText.trim()
        }]);
        setPassageWords(settings.customText.trim().split(/\s+/));
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const calculateResults = useCallback(() => {
    if (!typingAreaRef.current) return metrics;

    const elapsedTimeSeconds = startTime ? (Date.now() - startTime) / 1000 : 0;
    const elapsedTimeMinutes = Math.max(elapsedTimeSeconds / 60, 0.0167);
    const typedText = typingAreaRef.current.value;
    const totalChars = typedText.length;
    let correctChars = 0;
    const typedWordsCurrent = typedText.trim().split(/\s+/);
    const expectedText = passageWords.slice(0, typedWordsCurrent.length).join(' ');

    for (let i = 0; i < typedText.length; i++) {
      if (i < expectedText.length && typedText[i] === expectedText[i]) {
        correctChars++;
      }
    }

    const mistakes = totalChars - correctChars;
    const grossWords = totalChars / 5;
    const grossWpm = grossWords / elapsedTimeMinutes;
    const netWords = correctChars / 5;
    const netWpm = netWords / elapsedTimeMinutes;
    const accuracyPercent = totalChars > 0 ? Math.min(100, (correctChars / totalChars) * 100) : 0;

    return {
      grossSpeed: Math.round(grossWpm),
      netSpeed: Math.round(netWpm),
      accuracy: Math.round(accuracyPercent),
      mistakes: mistakes,
      totalWords: typedWords.length,
      correctWords: metrics.correctWords,
      incorrectWords: metrics.incorrectWords,
    };
  }, [startTime, passageWords, typedWords.length, metrics]);

  const startTest = () => {
    if (passages.length === 0) {
      alert('No passages available. Please provide custom text or contact the admin.');
      return;
    }

    setIsRunning(true);
    setStartTime(Date.now());
    if (typingAreaRef.current) {
      typingAreaRef.current.disabled = false;
      typingAreaRef.current.focus();
    }

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          submitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTest = () => {
    if (isRunning) {
      clearInterval(timerIntervalRef.current);
      setIsRunning(false);
      if (typingAreaRef.current) {
        typingAreaRef.current.disabled = true;
      }
    } else {
      startTest();
    }
  };

  const restartTest = () => {
    clearInterval(timerIntervalRef.current);
    setIsRunning(false);
    setStartTime(null);
    setTypingText('');
    setCurrentWordIndex(0);
    setCurrentLine(0);
    setTypedWords([]);
    setTimeLeft(parseInt(settings.duration));
    setShowFeedback(false);
    setFeedback('');
    if (sampleTextContainerRef.current) {
      sampleTextContainerRef.current.scrollTop = 0;
    }
    if (typingAreaRef.current) {
      typingAreaRef.current.disabled = true;
      typingAreaRef.current.value = '';
    }
    displayPassage();
  };

  const submitTest = () => {
    clearInterval(timerIntervalRef.current);
    setIsRunning(false);
    if (typingAreaRef.current) {
      typingAreaRef.current.disabled = true;
    }
    const results = calculateResults();
    setMetrics(results);
    generateFeedback(results);
    setCurrentWordIndex(0);
    setCurrentLine(0);
    setTypedWords([]);
    if (sampleTextContainerRef.current) {
      sampleTextContainerRef.current.scrollTop = 0;
    }
    displayPassage();
  };

  const handleTyping = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isRunning) return;

    const typedText = e.target.value;
    setTypingText(typedText);
    
    const results = calculateResults();
    setMetrics(results);
  }, [isRunning, calculateResults]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isRunning) return;

    if (e.key === ' ') {
      e.preventDefault();
      const typedText = typingAreaRef.current?.value.trim() || '';
      const typedWordsCurrent = typedText.split(/\s+/);
      const currentTypedWord = typedWordsCurrent[currentWordIndex] || '';

      if (!currentTypedWord && typedText === '') return;

      if (currentTypedWord) {
        setTypedWords(prev => [...prev, currentTypedWord]);
        const expectedWord = passageWords[currentWordIndex] || '';
        setMetrics(prev => ({
          ...prev,
          correctWords: prev.correctWords + (currentTypedWord === expectedWord ? 1 : 0),
          incorrectWords: prev.incorrectWords + (currentTypedWord !== expectedWord ? 1 : 0),
        }));
      }

      setCurrentWordIndex(prev => prev + 1);
      if (typingAreaRef.current) {
        typingAreaRef.current.value = typedWords.join(' ') + (currentWordIndex < passageWords.length ? ' ' : '');
      }

      const results = calculateResults();
      setMetrics(results);

      if (currentWordIndex >= passageWords.length) {
        submitTest();
      }
    } else if (e.key === 'Backspace' && settings.backspace === 'Disable') {
    e.preventDefault();
    }
  }, [isRunning, currentWordIndex, passageWords, typedWords, settings.backspace, calculateResults]);

  const generateFeedback = (results: typeof metrics) => {
    const { grossSpeed, netSpeed, accuracy } = results;
    let feedbackText = '';

    if (accuracy < 70) {
      feedbackText += 'Pehle accuracy par focus karo, phir speed apne aap badhegi.';
    } else if (accuracy < 90) {
      feedbackText += 'Achhi accuracy hai, thodi aur improve karo!';
    } else {
      feedbackText += 'Accuracy toh shandaar hai! Ab speed par dhyan do.';
    }

    if (accuracy >= 70) {
      if (grossSpeed === 0) {
        feedbackText += ' Typing start karo—practice se hi progress hogi!';
      } else if (grossSpeed <= 19) {
        feedbackText += ' Shuruaat ho chuki hai, ab roz thoda practice karo!';
      } else if (grossSpeed <= 29) {
        feedbackText += ' Achhi progress hai, lekin 30 WPM tak pahunchne ke liye lagataar typing karo!';
      } else if (grossSpeed <= 34) {
        feedbackText += ' Bas thoda aur push karo, 30 WPM bilkul paas hai!';
      } else if (grossSpeed <= 44) {
        feedbackText += ' Great job! Aapki typing speed government standards ke kareeb hai!';
      } else if (grossSpeed <= 59) {
        feedbackText += ' Bahut badhiya! Aap pro level ke kareeb ho!';
      } else {
        feedbackText += ' Excellent speed! Aap typing master banne wale ho!';
      }

      if (netSpeed < grossSpeed * 0.8) {
        feedbackText += ' Lekin thoda consistency laao, net speed aur badh sakti hai!';
      }
    }

    setFeedback(feedbackText);
    setShowFeedback(true);
  };

  const displayPassage = useCallback(() => {
    if (!sampleTextRef.current) return;

    sampleTextRef.current.innerHTML = '';
    wordElementsRef.current = [];

    passageWords.forEach((word, index) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word';
      wordSpan.innerHTML = word.split('').map(char => `<span>${char}</span>`).join('');
      
      if (settings.mode === 'Screen Typing' && index === currentWordIndex) {
        wordSpan.classList.add('current-word');
      }
      
      sampleTextRef.current?.appendChild(wordSpan);
      sampleTextRef.current?.appendChild(document.createTextNode(' '));
      wordElementsRef.current.push(wordSpan);
    });
  }, [passageWords, currentWordIndex, settings.mode]);

  useEffect(() => {
    displayPassage();
  }, [displayPassage]);

  return (
    <div className="main-content">
      {showSettings ? (
        <div className="settings-container">
          <div className="info-section">
            <h4>How to Start Custom Test</h4>
            <ul>
              <li>Select preferred language (English or Hindi)</li>
              <li>Select test duration</li>
              <li>Choose exam mode</li>
              <li>Enable/disable backspace</li>
              <li>Paste custom passage or use a default one</li>
              <li>Click "APPLY SETTINGS" to begin</li>
            </ul>

            <h4 className="why-create">Why Create a Custom Test?</h4>
            <ul>
              <li>Focus on weak areas</li>
              <li>Simulate real exams</li>
              <li>Practice your own content</li>
              <li>Track progress over time</li>
            </ul>
          </div>

          <div className="settings-form">
            <div className="form-group">
              <label htmlFor="language">Language</label>
              <select
                id="language"
                value={settings.language}
                onChange={handleLanguageChange}
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="duration">Test Duration</label>
              <select
                id="duration"
                value={settings.duration}
                onChange={handleSettingChange}
              >
                <option value="120">2 minutes</option>
                <option value="300">5 minutes</option>
                <option value="600">10 minutes</option>
                <option value="900">15 minutes</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="mode">Mode of Exam</label>
              <select
                id="mode"
                value={settings.mode}
                onChange={handleSettingChange}
              >
                <option value="Screen Typing">Screen Typing</option>
                <option value="Paper Typing">Paper Typing</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="backspace">Backspace</label>
              <select
                id="backspace"
                value={settings.backspace}
                onChange={handleSettingChange}
              >
                <option value="Enable">Enable</option>
                <option value="Disable">Disable</option>
              </select>
            </div>

        <div className="form-group">
              <label htmlFor="customText">Custom Text</label>
              <textarea
                id="customText"
                value={settings.customText}
                onChange={handleSettingChange}
                placeholder="Paste your text here..."
          />
        </div>

            <button 
              className="btn btn-primary"
              onClick={handleApplySettings}
            >
              APPLY SETTINGS
            </button>
          </div>
        </div>
      ) : (
        <div className="test-container active">
          <div className="test-main">
            <div className="test-header">
              <div className="selector-group">
                <label htmlFor="passage-selector" className="selector-label">Select Passage</label>
                <select
                  id="passage-selector"
                  value={selectedPassage}
                  onChange={(e) => setSelectedPassage(parseInt(e.target.value))}
                  disabled={isRunning}
                >
                  {passages.map((passage, index) => (
                    <option key={passage.id} value={index}>
                      {passage.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className={`timer ${timeLeft <= 30 ? 'low-time' : ''}`}>
                {formatTime(timeLeft)}
              </div>
            </div>

            <div
              ref={sampleTextContainerRef}
              className="sample-text-container"
              tabIndex={0}
            >
              <p ref={sampleTextRef} className="sample-text"></p>
            </div>

          <textarea
              ref={typingAreaRef}
              placeholder="Start typing here..."
              disabled={!isRunning}
              value={typingText}
              onChange={handleTyping}
              onKeyDown={handleKeyDown}
              onPaste={(e) => e.preventDefault()}
              onCopy={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
            />

            <div className="control-buttons">
              <button
                className="btn btn-primary"
                onClick={startTest}
                disabled={isRunning}
              >
                Start
              </button>
              <button
                className="btn btn-danger"
                onClick={pauseTest}
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
              <button
                className="btn btn-primary"
                onClick={() => setShowSettings(true)}
              >
                Back To Settings
              </button>
            </div>
          </div>

          <div className="result-section">
            <div className="result-header">
              <h3>RESULT</h3>
            </div>
            <div className="metric-block">
              <span>Gross Speed:</span>
              <span>{metrics.grossSpeed} wpm</span>
            </div>
            <div className="metric-block">
              <span>Net Speed:</span>
              <span>{metrics.netSpeed} wpm</span>
            </div>
            <div className="metric-block">
              <span>Accuracy:</span>
              <span>{metrics.accuracy}%</span>
            </div>
            <div className="metric-block">
              <span>Mistakes:</span>
              <span>{metrics.mistakes}</span>
            </div>
            <div className="metric-block">
              <span>Total Words:</span>
              <span>{metrics.totalWords}</span>
            </div>
            <div className="metric-block">
              <span>Correct Words:</span>
              <span>{metrics.correctWords}</span>
            </div>
            <div className="metric-block">
              <span>Incorrect Words:</span>
              <span>{metrics.incorrectWords}</span>
            </div>
            {showFeedback && (
              <div className="feedback-container show">
                <p className="feedback-text">{feedback}</p>
                <button
                  className="feedback-cancel"
                  onClick={() => setShowFeedback(false)}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showPopup && (
        <>
          <div className="overlay show" onClick={() => setShowPopup(false)} />
          <div className="popup show">
            <p>This feature is under development.</p>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CreateTest; 
 
 