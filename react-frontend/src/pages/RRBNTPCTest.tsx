import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getCharacterHighlights, normalizeQuotes, isPunctuation, sanitizeInput, formatTime, calculateWordsPerLine } from '../utils/typingUtils';
import type { Passage as PassageType } from '../types/Passage';
import './RRBNTPCTest.css';

const RRBNTPCTest: React.FC = () => {
  const [passages, setPassages] = useState<PassageType[]>([]);
  const [selectedPassage, setSelectedPassage] = useState<number>(0);
  const [examMode, setExamMode] = useState<string>('Paper Typing');
  const [duration, setDuration] = useState<number>(600); // 10 minutes in seconds
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [typingText, setTypingText] = useState<string>('');
  const [passageWords, setPassageWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [totalChars, setTotalChars] = useState<number>(0);
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [correctWordsCount, setCorrectWordsCount] = useState<number>(0);
  const [incorrectWordsCount, setIncorrectWordsCount] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wordsPerLine, setWordsPerLine] = useState<number>(0);
  const [currentLine, setCurrentLine] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [metrics, setMetrics] = useState({
    grossSpeed: 0,
    netSpeed: 0,
    accuracy: 0, 
    mistakes: 0,
    totalWords: 0,
    correctWords: 0,
    incorrectWords: 0,
  });

  const sampleTextRef = useRef<HTMLDivElement>(null);
  const typingAreaRef = useRef<HTMLTextAreaElement>(null);
  const sampleTextContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    fetchPassages();
  }, []);

  useEffect(() => {
    if (passages.length > 0) {
      displayPassage();
    }
  }, [selectedPassage, passages]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            submitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  useEffect(() => {
    const handleResize = () => {
      calculateWordsPerLine(passageWords, sampleTextContainerRef, sampleTextRef, setWordsPerLine);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [passageWords]);

  const fetchPassages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/passages/test/RRB%20NTPC');
      if (!response.ok) throw new Error(`Failed to fetch passages: ${response.status}`);
      const data = await response.json();
      setPassages(data);
      if (data.length > 0) setSelectedPassage(0);
    } catch (error) {
      console.error('Error fetching passages:', error);
      setPassages([]);
      }
    };

  const displayPassage = () => {
    if (passages.length === 0) return;
    const words = passages[selectedPassage].content.trim().split(/\s+/);
    setPassageWords(words);

    if (sampleTextRef.current) {
      sampleTextRef.current.innerHTML = '';
      words.forEach((word, index) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        wordSpan.innerHTML = word.split('').map(char => 
          `<span>${sanitizeInput(char)}</span>`
        ).join('');
        
        if (examMode === 'Screen Typing' && index === currentWordIndex) {
          wordSpan.classList.add('current-word');
        }
        
        sampleTextRef.current?.appendChild(wordSpan);
        sampleTextRef.current?.appendChild(document.createTextNode(' '));
      });
    }

    calculateWordsPerLine(words, sampleTextContainerRef, sampleTextRef, setWordsPerLine);
  };

  const updateWordHighlight = () => {
    if (examMode !== 'Screen Typing' || !sampleTextRef.current) return;

    const wordElements = sampleTextRef.current.querySelectorAll('.word');
    wordElements.forEach((word, index) => {
      word.classList.remove('current-word');
      if (index === currentWordIndex) word.classList.add('current-word');
    });

    const lineNumber = Math.floor(currentWordIndex / wordsPerLine);
    if (lineNumber > currentLine) {
      setCurrentLine(lineNumber);
      const lineHeight = 28;
      if (sampleTextContainerRef.current) {
        const containerHeight = sampleTextContainerRef.current.clientHeight;
        const contentHeight = sampleTextRef.current.offsetHeight;
        const maxScroll = contentHeight - containerHeight;
        if (sampleTextContainerRef.current.scrollTop < maxScroll) {
          sampleTextContainerRef.current.scrollTop += lineHeight;
        }
      }
    }
  };

  const updateLetterHighlight = () => {
    if (examMode !== 'Screen Typing' || !sampleTextRef.current) return;

    const typedText = typingText;
    const typedWordsCurrent = typedText.trim().split(/\s+/);
    const wordElements = sampleTextRef.current.querySelectorAll('.word');

    wordElements.forEach((word, wordIndex) => {
      const chars = word.querySelectorAll('span');
      chars.forEach(char => char.classList.remove('correct-char', 'incorrect-char'));
    });

    for (let wordIndex = 0; wordIndex <= currentWordIndex; wordIndex++) {
      const wordElement = wordElements[wordIndex];
      if (!wordElement) continue;

      const chars = wordElement.querySelectorAll('span');
      const typedWord = wordIndex < typedWordsCurrent.length ? typedWordsCurrent[wordIndex] : '';
      const expectedWord = passageWords[wordIndex] || '';
      const highlights = getCharacterHighlights(expectedWord, typedWord);

      chars.forEach((char, charIndex) => {
        if (charIndex < highlights.length) {
          const highlight = highlights[charIndex];
          if (highlight.status === 'correct') char.classList.add('correct-char');
          else char.classList.add('incorrect-char');
        }
      });
    }
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
    }
  }, [isRunning, currentWordIndex, passageWords, typedWords, calculateResults]);

  const generateFeedback = (results: ReturnType<typeof calculateResults>) => {
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

    if (accuracy < 80) {
      feedbackText += ' Accuracy below 80%! You need to improve to qualify for RRB NTPC.';
    }

    setFeedback(feedbackText);
    setShowFeedback(true);
  };

  const startTest = () => {
    if (passages.length === 0 || !passages.some(p => p.title && p.content)) {
      alert('No passages available. Please contact the admin.');
      return;
    }

    setIsRunning(true);
    setStartTime(Date.now());
    if (typingAreaRef.current) {
      typingAreaRef.current.disabled = false;
      typingAreaRef.current.focus();
    }
    setTimeLeft(duration);
  };

  const pauseTest = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
      setIsRunning(false);
      if (typingAreaRef.current) {
        typingAreaRef.current.disabled = true;
      }
    } else {
      startTest();
    }
  };

  const restartTest = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setStartTime(null);
    setTypingText('');
    setCurrentWordIndex(0);
    setCurrentLine(0);
    setTypedWords([]);
    setTotalChars(0);
    setCorrectChars(0);
    setMistakes(0);
    setCorrectWordsCount(0);
    setIncorrectWordsCount(0);
    setTimeLeft(duration);
    setShowFeedback(false);
    setFeedback('');
    if (sampleTextContainerRef.current) {
      sampleTextContainerRef.current.scrollTop = 0;
    }
    if (typingAreaRef.current) {
      typingAreaRef.current.disabled = true;
      typingAreaRef.current.value = '';
    }
    setExamMode('Paper Typing');
    displayPassage();
  };

  const submitTest = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    if (typingAreaRef.current) {
      typingAreaRef.current.disabled = true;
    }
    const results = calculateResults();
    generateFeedback(results);
    setCurrentWordIndex(0);
    setCurrentLine(0);
    setTypedWords([]);
    setTotalChars(0);
    setCorrectChars(0);
    setMistakes(0);
    setCorrectWordsCount(0);
    setIncorrectWordsCount(0);
    if (sampleTextContainerRef.current) {
      sampleTextContainerRef.current.scrollTop = 0;
    }
    displayPassage();
  };

  return (
    <div className="main-content">
      <div className="test-container">
        <div className="test-main">
      <div className="test-header">
            <div className="selector-group">
              <label htmlFor="passage-selector" className="selector-label">Select Passage</label>
              <select 
                id="passage-selector"
                value={selectedPassage}
                onChange={(e) => setSelectedPassage(Number(e.target.value))}
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
              <label htmlFor="exam-mode-selector" className="selector-label">Mode of Exam</label>
              <select
                id="exam-mode-selector"
                value={examMode}
                onChange={(e) => setExamMode(e.target.value)}
                disabled={isRunning}
              >
                <option value="Paper Typing">Paper Typing</option>
                <option value="Screen Typing">Screen Typing</option>
              </select>
            </div>
            <div className="selector-group">
              <label htmlFor="timer-duration" className="selector-label">Duration</label>
              <select
                id="timer-duration"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                disabled={isRunning}
              >
                <option value="600">10 min</option>
                <option value="900">15 min</option>
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
            onClick={() => !isRunning && startTest()}
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
              disabled={!isRunning && timeLeft === duration}
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
    </div>
  );
};

export default RRBNTPCTest; 