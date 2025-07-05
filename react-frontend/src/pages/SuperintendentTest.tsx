import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getCharacterHighlights, normalizeQuotes, isPunctuation, sanitizeInput, formatTime, calculateWordsPerLine } from '../utils/typingUtils';
import { passageService } from '../services/api';
import { API_CONFIG } from '../config/api';
import { Passage } from '../types/Passage';
import './SuperintendentTest.css';

interface Settings {
  mode: 'Paper Typing' | 'Screen Typing';
}

const SuperintendentTest: React.FC = () => {
  const [passages, setPassages] = useState<Passage[]>([]);
  const [selectedPassage, setSelectedPassage] = useState<number>(0);
  const [passageWords, setPassageWords] = useState<string[]>([]);
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [settings, setSettings] = useState<Settings>({ mode: 'Paper Typing' });
  const [wordsPerLine, setWordsPerLine] = useState<number>(0);
  const [currentLine, setCurrentLine] = useState<number>(0);
  const [metrics, setMetrics] = useState({
    grossSpeed: 0,
    netSpeed: 0,
    accuracy: 0,
    mistakes: 0,
    totalWords: 0,
    correctWords: 0,
    incorrectWords: 0,
  });
  const [feedback, setFeedback] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  const typingAreaRef = useRef<HTMLTextAreaElement>(null);
  const sampleTextRef = useRef<HTMLDivElement>(null);
  const sampleTextContainerRef = useRef<HTMLDivElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const wordElementsRef = useRef<HTMLSpanElement[]>([]);

  const fetchPassages = async () => {
    try {
      const data = await passageService.getByTest('Superintendent');
      setPassages(data);
      if (data.length > 0) {
        setSelectedPassage(0);
        setPassageWords(data[0].content.trim().split(/\s+/));
      }
    } catch (error) {
      console.error('Error fetching passages:', error);
      alert('Failed to load passages. Please ensure server is running.');
    }
  };

  const normalizeQuotes = (text: string): string => {
    return text
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"');
  };

  const sanitizeInput = (input: string): string => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isPunctuation = (char: string): boolean => {
    return /[.,!?;:'"()/]/.test(char);
  };

  const getCharacterHighlights = (expected: string, typed: string) => {
    const normalizedExpected = normalizeQuotes(expected);
    const normalizedTyped = normalizeQuotes(typed);
    const result = [];
    let typedIndex = 0;

    for (let i = 0; i < normalizedExpected.length; i++) {
      if (typedIndex < normalizedTyped.length) {
        if (normalizedExpected[i] === normalizedTyped[typedIndex]) {
          result.push({ char: normalizedExpected[i], status: 'correct' });
          typedIndex++;
        } else {
          if (i + 1 < normalizedExpected.length && typedIndex < normalizedTyped.length && 
              normalizedExpected[i + 1] === normalizedTyped[typedIndex]) {
            result.push({ char: normalizedExpected[i], status: 'wrong' });
          } else {
            result.push({ char: normalizedExpected[i], status: 'wrong' });
            typedIndex++;
          }
        }
      } else {
        result.push({ char: normalizedExpected[i], status: 'wrong' });
      }
    }

    while (typedIndex < normalizedTyped.length) {
      result.push({ char: normalizedTyped[typedIndex], status: 'wrong' });
      typedIndex++;
    }

    return result;
  };

  const calculateWordsPerLine = useCallback(() => {
    if (!sampleTextContainerRef.current || !sampleTextRef.current) return;

    const containerWidth = sampleTextContainerRef.current.clientWidth;
    const tempSpan = document.createElement('span');
    tempSpan.style.fontSize = '18px';
    tempSpan.style.fontFamily = "'Times New Roman', Times, serif";
    tempSpan.style.visibility = 'hidden';
    tempSpan.textContent = passageWords.join(' ');
    sampleTextRef.current.appendChild(tempSpan);

    const words = passageWords;
    let currentLineWidth = 0;
    let wordCount = 0;
    let totalWords = 0;
    const lineHeight = 28;

    words.forEach(word => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word';
      wordSpan.textContent = word + ' ';
      tempSpan.appendChild(wordSpan);
      const wordWidth = wordSpan.offsetWidth;

      if (currentLineWidth + wordWidth > containerWidth - 20) {
        totalWords += wordCount;
        wordCount = 0;
        currentLineWidth = 0;
      }
      currentLineWidth += wordWidth;
      wordCount++;
    });

    totalWords += wordCount;
    const calculatedWordsPerLine = Math.floor(totalWords / (tempSpan.offsetHeight / lineHeight)) || 1;
    setWordsPerLine(calculatedWordsPerLine);
    tempSpan.remove();
  }, [passageWords]);

  const updateWordHighlight = useCallback(() => {
    if (settings.mode !== 'Screen Typing') return;

    wordElementsRef.current.forEach((word, index) => {
      if (word) {
        word.classList.remove('current-word');
        if (index === currentWordIndex) word.classList.add('current-word');
      }
    });

    const lineNumber = Math.floor(currentWordIndex / wordsPerLine);
    if (lineNumber > currentLine) {
      setCurrentLine(lineNumber);
      const lineHeight = 28;
      if (sampleTextContainerRef.current) {
        const containerHeight = sampleTextContainerRef.current.clientHeight;
        const contentHeight = sampleTextRef.current?.offsetHeight || 0;
        const maxScroll = contentHeight - containerHeight;
        if (sampleTextContainerRef.current.scrollTop < maxScroll) {
          sampleTextContainerRef.current.scrollTop += lineHeight;
        }
      }
    }
  }, [currentWordIndex, wordsPerLine, currentLine, settings.mode]);

  const updateLetterHighlight = useCallback(() => {
    if (settings.mode !== 'Screen Typing' || !typingAreaRef.current) return;

    const typedText = typingAreaRef.current.value;
    const typedWordsCurrent = typedText.trim().split(/\s+/);

    wordElementsRef.current.forEach((word, wordIndex) => {
      if (!word) return;
      const chars = word.querySelectorAll('span');
      chars.forEach(char => char.classList.remove('correct-char', 'incorrect-char'));

      if (wordIndex <= currentWordIndex) {
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
    });
  }, [currentWordIndex, passageWords, settings.mode]);

  const calculateResults = useCallback(() => {
    if (!typingAreaRef.current) return metrics;

    const elapsedTimeSeconds = startTime ? (Date.now() - startTime) / 1000 : 0;
    const elapsedTimeMinutes = Math.max(elapsedTimeSeconds / 60, 0.0167);
    const typedText = normalizeQuotes(typingAreaRef.current.value);
    const totalChars = typedText.length;
    let correctChars = 0;
    const typedWordsCurrent = typedText.trim().split(/\s+/);
    const expectedText = normalizeQuotes(passageWords.slice(0, typedWordsCurrent.length).join(' '));
    let punctuationMistakes = 0;

    for (let i = 0; i < typedText.length; i++) {
      if (i < expectedText.length) {
        if (typedText[i] === expectedText[i]) correctChars++;
        else if (isPunctuation(expectedText[i]) || isPunctuation(typedText[i])) punctuationMistakes++;
      } else if (isPunctuation(typedText[i])) punctuationMistakes++;
    }

    for (let i = typedText.length; i < expectedText.length; i++) {
      if (isPunctuation(expectedText[i])) punctuationMistakes++;
    }

    const nonPunctuationMistakes = (totalChars - correctChars) - punctuationMistakes;
    const mistakes = nonPunctuationMistakes + (punctuationMistakes * 0.5);
    const grossWords = totalChars / 5;
    const grossWpm = grossWords / elapsedTimeMinutes;
    const netWords = correctChars / 5;
    const netWpm = netWords / elapsedTimeMinutes;
    const accuracyPercent = totalChars > 0 ? Math.min(100, (correctChars / totalChars) * 100) : 0;

    return {
      grossSpeed: Math.round(grossWpm),
      netSpeed: Math.round(netWpm),
      accuracy: Math.round(accuracyPercent),
      mistakes: parseFloat(mistakes.toFixed(1)),
      totalWords: typedWords.length,
      correctWords: metrics.correctWords,
      incorrectWords: metrics.incorrectWords,
    };
  }, [startTime, passageWords, typedWords.length, metrics]);

  const generateFeedback = useCallback(() => {
    const { grossSpeed, netSpeed, accuracy } = metrics;
    let feedback = '';

    if (accuracy < 70) {
      feedback += 'Pehle accuracy par focus karo, phir speed apne aap badhegi.';
    } else if (accuracy < 90) {
      feedback += 'Achhi accuracy hai, thodi aur improve karo!';
    } else {
      feedback += 'Accuracy toh shandaar hai! Ab speed par dhyan do.';
    }

    if (accuracy >= 70) {
      if (grossSpeed === 0) {
        feedback += ' Typing start karo—practice se hi progress hogi!';
      } else if (grossSpeed <= 19) {
        feedback += ' Shuruaat ho chuki hai, ab roz thoda practice karo!';
      } else if (grossSpeed <= 29) {
        feedback += ' Achhi progress hai, lekin 30 WPM tak pahunchne ke liye lagataar typing karo!';
      } else if (grossSpeed <= 34) {
        feedback += ' Bas thoda aur push karo, 30 WPM bilkul paas hai!';
      } else if (grossSpeed <= 44) {
        feedback += ' Great job! Aapki typing speed government standards ke kareeb hai!';
      } else if (grossSpeed <= 59) {
        feedback += ' Bahut badhiya! Aap pro level ke kareeb ho!';
      } else {
        feedback += ' Excellent speed! Aap typing master banne wale ho!';
      }

      if (netSpeed < grossSpeed * 0.8) {
        feedback += ' Lekin thoda consistency laao, net speed aur badh sakti hai!';
      }
    }

    if (accuracy < 80) {
      feedback += ' Accuracy below 80%! You need to improve to qualify for Superintendent.';
    }

    setFeedback(feedback);
    setShowFeedback(true);
  }, [metrics]);

  const startTimer = () => {
    if (!isRunning && passages.length > 0) {
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
    }
  };

  const pauseTimer = () => {
    if (isRunning) {
      clearInterval(timerIntervalRef.current);
      setIsRunning(false);
      if (typingAreaRef.current) {
        typingAreaRef.current.disabled = true;
      }
    } else {
      startTimer();
    }
  };

  const submitTest = () => {
    clearInterval(timerIntervalRef.current);
    setIsRunning(false);
    if (typingAreaRef.current) {
      typingAreaRef.current.disabled = true;
    }
    const results = calculateResults();
    setMetrics(results);
    generateFeedback();
    resetTest();
  };

  const resetTest = () => {
    setCurrentWordIndex(0);
    setCurrentLine(0);
    setTypedWords([]);
    if (typingAreaRef.current) {
      typingAreaRef.current.value = '';
    }
    if (sampleTextContainerRef.current) {
      sampleTextContainerRef.current.scrollTop = 0;
    }
    setTimeLeft(timeLeft);
    displayPassage();
  };

  const handlePassageSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value);
    setSelectedPassage(index);
    setPassageWords(passages[index].content.trim().split(/\s+/));
    resetTest();
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings({ ...settings, mode: e.target.value as Settings['mode'] });
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeLeft(parseInt(e.target.value));
    resetTest();
  };

  const handleTyping = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isRunning) return;

    const typedText = e.target.value;
    
    if (settings.mode === 'Screen Typing') {
      updateLetterHighlight();
    }
    
    const results = calculateResults();
    setMetrics(results);
  }, [isRunning, settings.mode, updateLetterHighlight, calculateResults]);

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

      if (settings.mode === 'Screen Typing') {
        updateWordHighlight();
        updateLetterHighlight();
      }

      const results = calculateResults();
      setMetrics(results);

      if (currentWordIndex >= passageWords.length) {
        submitTest();
      }
    } else if (e.key === 'Backspace') {
      const typedText = typingAreaRef.current?.value || '';
      if (typedText.endsWith(' ') && currentWordIndex > 0 && typedWords.length > 0) {
        e.preventDefault();
        setCurrentWordIndex(prev => prev - 1);
        const newTypedWords = [...typedWords];
        const lastWord = newTypedWords.pop();
        setTypedWords(newTypedWords);
        
        if (typingAreaRef.current) {
          typingAreaRef.current.value = newTypedWords.join(' ') + (newTypedWords.length > 0 ? ' ' : '') + (lastWord || '');
        }

        let correctCount = 0;
        let incorrectCount = 0;
        newTypedWords.forEach((word, idx) => {
          if (word === passageWords[idx]) correctCount++;
          else incorrectCount++;
        });

        setMetrics(prev => ({
          ...prev,
          correctWords: correctCount,
          incorrectWords: incorrectCount,
        }));

        if (settings.mode === 'Screen Typing') {
          updateWordHighlight();
          updateLetterHighlight();
        }

        const results = calculateResults();
        setMetrics(results);
      }
    }
  }, [isRunning, currentWordIndex, passageWords, typedWords, settings.mode, updateWordHighlight, updateLetterHighlight, calculateResults]);

  useEffect(() => {
    fetchPassages();
  }, []);

  useEffect(() => {
    calculateWordsPerLine();
    window.addEventListener('resize', calculateWordsPerLine);
    return () => window.removeEventListener('resize', calculateWordsPerLine);
  }, [calculateWordsPerLine]);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const displayPassage = useCallback(() => {
    if (!sampleTextRef.current) return;

    sampleTextRef.current.innerHTML = '';
    wordElementsRef.current = [];

    passageWords.forEach((word, index) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word';
      wordSpan.innerHTML = word.split('').map(char => `<span>${sanitizeInput(char)}</span>`).join('');
      
      if (settings.mode === 'Screen Typing' && index === currentWordIndex) {
        wordSpan.classList.add('current-word');
      }
      
      sampleTextRef.current?.appendChild(wordSpan);
      sampleTextRef.current?.appendChild(document.createTextNode(' '));
      wordElementsRef.current.push(wordSpan);
    });

    calculateWordsPerLine();
  }, [passageWords, currentWordIndex, settings.mode, calculateWordsPerLine]);

  useEffect(() => {
    displayPassage();
  }, [displayPassage]);

  return (
    <div className="main-content">
      <div id="typing-test-page">
        <div className="test-container">
          <div className="test-main">
            <div className="test-header">
              <div className="selector-group">
                <label htmlFor="passage-selector" className="selector-label">Select Passage</label>
                <select
                  id="passage-selector"
                  value={selectedPassage}
                  onChange={handlePassageSelect}
                  disabled={isRunning}
                >
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
                  value={settings.mode}
                  onChange={handleModeChange}
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
                  value={timeLeft}
                  onChange={handleDurationChange}
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
            >
              <p ref={sampleTextRef} className="sample-text"></p>
            </div>
            <textarea
              ref={typingAreaRef}
              placeholder="Start typing here..."
              disabled={!isRunning}
              onChange={handleTyping}
              onKeyDown={handleKeyDown}
              onPaste={e => e.preventDefault()}
              onCopy={e => e.preventDefault()}
              onCut={e => e.preventDefault()}
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
                onClick={resetTest}
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
    </div>
  );
};

export default SuperintendentTest; 
 