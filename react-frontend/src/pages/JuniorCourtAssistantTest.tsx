import React, { useState, useEffect, useRef } from 'react';
import './JuniorCourtAssistantTest.css';

interface Passage {
  title: string;
  content: string;
}

const JuniorCourtAssistantTest: React.FC = () => {
  const [passages, setPassages] = useState<Passage[]>([]);
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

  const fetchPassages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/passages/test/Junior%20Court%20Assistant');
      if (!response.ok) throw new Error(`Failed to fetch passages: ${response.status}`);
      const data = await response.json();
      setPassages(data);
      if (data.length > 0) setSelectedPassage(0);
    } catch (error) {
      console.error('Error fetching passages:', error);
      setPassages([]);
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

  const calculateWordsPerLine = () => {
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
  };

  const displayPassage = () => {
    if (!passages[selectedPassage]?.content) return;

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

    calculateWordsPerLine();
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

  const calculateResults = () => {
    const elapsedTimeSeconds = startTime ? (Date.now() - startTime) / 1000 : 0;
    const elapsedTimeMinutes = Math.max(elapsedTimeSeconds / 60, 0.0167);
    const typedText = normalizeQuotes(typingText);
    const totalCharsTyped = typedText.length;
    let correctCharsCount = 0;

    const typedWordsCurrent = typedText.trim().split(/\s+/);
    const expectedText = normalizeQuotes(passageWords.slice(0, typedWordsCurrent.length).join(' '));
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

    const nonPunctuationMistakes = (totalCharsTyped - correctCharsCount) - punctuationMistakes;
    const totalMistakes = nonPunctuationMistakes + (punctuationMistakes * 0.5);

    const grossWords = totalCharsTyped / 5;
    const grossWpm = grossWords / elapsedTimeMinutes;
    const netWords = correctCharsCount / 5;
    const netWpm = netWords / elapsedTimeMinutes;
    const accuracyPercent = totalCharsTyped > 0 ? Math.min(100, (correctCharsCount / totalCharsTyped) * 100) : 0;

    setTotalChars(totalCharsTyped);
    setCorrectChars(correctCharsCount);
    setMistakes(totalMistakes);
    
    return {
      grossWpm: Math.round(grossWpm),
      netWpm: Math.round(netWpm),
      accuracy: Math.round(accuracyPercent),
      mistakes: totalMistakes.toFixed(1),
      totalWords: typedWordsCurrent.length,
      correctWords: correctWordsCount,
      incorrectWords: incorrectWordsCount
    };
  };

  const generateFeedback = (results: ReturnType<typeof calculateResults>) => {
    const { grossWpm, netWpm, accuracy } = results;
    let feedbackText = '';

    if (accuracy < 70) {
      feedbackText += 'Pehle accuracy par focus karo, phir speed apne aap badhegi.';
    } else if (accuracy < 90) {
      feedbackText += 'Achhi accuracy hai, thodi aur improve karo!';
    } else {
      feedbackText += 'Accuracy toh shandaar hai! Ab speed par dhyan do.';
    }

    if (accuracy >= 70) {
      if (grossWpm === 0) {
        feedbackText += ' Typing start karo—practice se hi progress hogi!';
      } else if (grossWpm <= 19) {
        feedbackText += ' Shuruaat ho chuki hai, ab roz thoda practice karo!';
      } else if (grossWpm <= 29) {
        feedbackText += ' Achhi progress hai, lekin 30 WPM tak pahunchne ke liye lagataar typing karo!';
      } else if (grossWpm <= 34) {
        feedbackText += ' Bas thoda aur push karo, 30 WPM bilkul paas hai!';
      } else if (grossWpm <= 44) {
        feedbackText += ' Great job! Aapki typing speed government standards ke kareeb hai!';
      } else if (grossWpm <= 59) {
        feedbackText += ' Bahut badhiya! Aap pro level ke kareeb ho!';
      } else {
        feedbackText += ' Excellent speed! Aap typing master banne wale ho!';
      }

      if (netWpm < grossWpm * 0.8) {
        feedbackText += ' Lekin thoda consistency laao, net speed aur badh sakti hai!';
      }
    }

    if (accuracy < 80) {
      feedbackText += ' Accuracy below 80%! You need to improve to qualify for Junior Court Assistant.';
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

  const handleTypingInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isRunning) return;
    
    const typedText = e.target.value;
    setTypingText(typedText);
    
    const words = typedText.trim().split(/\s+/);
    const currentWord = words[currentWordIndex] || '';
    
    setTypedWords(words.slice(0, currentWordIndex));
    updateLetterHighlight();
    calculateResults();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isRunning) return;

    if (e.key === ' ') {
      const typedText = typingText;
      const lastChar = typedText[typedText.length - 1];
      
      if (lastChar === ' ') {
        e.preventDefault();
        return;
      }

      const currentWord = typedText.trim().split(/\s+/).pop() || '';
      if (!currentWord) {
        e.preventDefault();
        return;
      }

      if (currentWordIndex < passageWords.length) {
        const expectedWord = passageWords[currentWordIndex];
        if (currentWord === expectedWord) {
          setCorrectWordsCount(prev => prev + 1);
        } else {
          setIncorrectWordsCount(prev => prev + 1);
        }
        setCurrentWordIndex(prev => prev + 1);
        updateWordHighlight();
        updateLetterHighlight();
        calculateResults();

        if (currentWordIndex >= passageWords.length - 1) {
          submitTest();
        }
      }
    } else if (e.key === 'Backspace') {
      const typedText = typingText;
      const cursorPosition = e.currentTarget.selectionStart;
      
      if (cursorPosition > 0 && typedText[cursorPosition - 1] === ' ' && currentWordIndex > 0) {
        setCurrentWordIndex(prev => prev - 1);
        if (typedWords.length > 0) {
          const lastWord = typedWords[typedWords.length - 1];
          if (lastWord === passageWords[currentWordIndex - 1]) {
            setCorrectWordsCount(prev => prev - 1);
          } else {
            setIncorrectWordsCount(prev => prev - 1);
          }
          setTypedWords(prev => prev.slice(0, -1));
        }
        updateWordHighlight();
        updateLetterHighlight();
        calculateResults();
      }
    }
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
            onChange={handleTypingInput}
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
            <span>{calculateResults().grossWpm} wpm</span>
          </div>
          <div className="metric-block">
            <span>Net Speed:</span>
            <span>{calculateResults().netWpm} wpm</span>
          </div>
          <div className="metric-block">
            <span>Accuracy:</span>
            <span>{calculateResults().accuracy}%</span>
          </div>
          <div className="metric-block">
            <span>Mistakes:</span>
            <span>{calculateResults().mistakes}</span>
          </div>
          <div className="metric-block">
            <span>Total Words:</span>
            <span>{calculateResults().totalWords}</span>
          </div>
          <div className="metric-block">
            <span>Correct Words:</span>
            <span>{calculateResults().correctWords}</span>
          </div>
          <div className="metric-block">
            <span>Incorrect Words:</span>
            <span>{calculateResults().incorrectWords}</span>
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

export default JuniorCourtAssistantTest; 
 