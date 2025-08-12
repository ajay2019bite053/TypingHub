import { useState, useEffect, useRef, useCallback } from 'react';
import { API_CONFIG } from '../config/api';

interface TypingStats {
  grossSpeed: number;
  netSpeed: number;
  accuracy: number;
  mistakes: number;
  timeTaken: number;
  backspaces: number;
  totalWords: number;
  correctWords: number;
  incorrectWords: number;
  timePerWord: string;
  wordsPerMinute: number;
  correctChars: number;
  totalChars: number;
  mistakeRate: number;
  isQualified: boolean;
  idleTime: number;
  normalMistakes?: number;
  punctuationMistakes?: number;
  extraChars?: number;
  missingChars?: number;
  effectiveSpeed?: number;
}

interface TestConfig {
  testName: string;
  timeLimit: number;
  passageCategory: string;
  qualificationCriteria: {
    minWpm: number;
    minAccuracy: number;
  };
  customPassage?: string; // Optional custom passage content
}

const SSC_CONSTANTS = {
  CHARS_PER_WORD: 5,
  MISTAKE_PENALTY: 5,
  PUNCTUATION_MISTAKE_WEIGHT: 0.5,
  MIN_TEST_TIME: 60
};

export const useTypingTest = (config: TestConfig) => {
  // State variables
  const [passages, setPassages] = useState<any[]>([]);
  const [selectedPassageIndex, setSelectedPassageIndex] = useState(0);
  const [passageWords, setPassageWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [totalChars, setTotalChars] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [correctWordsCount, setCorrectWordsCount] = useState(0);
  const [incorrectWordsCount, setIncorrectWordsCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [selectedDuration, setSelectedDuration] = useState(config.timeLimit);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<{
    feedback: string;
    suggestions: string[];
    stats: Partial<TypingStats>;
  }>({
    feedback: '',
    suggestions: [],
    stats: {}
  });
  const [wordsPerLine, setWordsPerLine] = useState(0);
  const [wordElements, setWordElements] = useState<HTMLSpanElement[]>([]);
  const [backspaceCount, setBackspaceCount] = useState(0);
  const [punctuationMistakes, setPunctuationMistakes] = useState(0);
  const [extraChars, setExtraChars] = useState(0);
  const [missingChars, setMissingChars] = useState(0);
  const [totalWords, setTotalWords] = useState<number>(0);
  const [typingStats, setTypingStats] = useState<TypingStats>({
    grossSpeed: 0,
    netSpeed: 0,
    accuracy: 0,
    mistakes: 0,
    timeTaken: 0,
    backspaces: 0,
    totalWords: 0,
    correctWords: 0,
    incorrectWords: 0,
    timePerWord: '0s',
    wordsPerMinute: 0,
    correctChars: 0,
    totalChars: 0,
    mistakeRate: 0,
    isQualified: false,
    idleTime: 0
  });
  const [typedText, setTypedText] = useState('');
  const [lastKeypressTime, setLastKeypressTime] = useState<number>(Date.now());
  const [idleTime, setIdleTime] = useState<number>(0);
  const [examMode, setExamMode] = useState<'Paper Typing' | 'Screen Typing'>('Screen Typing');

  // Refs
  const timerIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const typingAreaRef = useRef<HTMLTextAreaElement>(null);
  const sampleTextContainerRef = useRef<HTMLDivElement>(null);
  const sampleTextRef = useRef<HTMLParagraphElement>(null);
  const idleCheckIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const IDLE_THRESHOLD = 10;

  // Utility functions
  const sanitizeInput = (input: string) => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  };

  const normalizeQuotes = (text: string) => {
    return text
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isPunctuation = (char: string) => {
    return /[.,!?;:'"()/]/.test(char);
  };

  // Check if a word is fully typed (has space after it or is the last word)
  const isWordFullyTyped = (text: string, wordIndex: number, words: string[]): boolean => {
    // If it's the last word and text ends with space, it's complete
    if (wordIndex === words.length - 1) {
      return text.endsWith(' ');
    }
    
    // If it's not the last word, check if there's a space after this word
    const wordStart = text.indexOf(words[wordIndex]);
    if (wordStart === -1) return false;
    
    const wordEnd = wordStart + words[wordIndex].length;
    return text[wordEnd] === ' ';
  };

  // Calculate typing stats
  const calculateTypingStats = useCallback((
    correctChars: number,
    totalChars: number,
    normalMistakes: number,
    backspaceCount: number,
    totalWords: number,
    correctWords: number,
    incorrectWords: number,
    startTime: number | null,
    punctuationMistakes: number = 0
  ): TypingStats => {
    const currentTime = Date.now();
    const timeInMinutes = Math.max(0.0166667, (currentTime - (startTime || currentTime)) / 60000);
    const timeInSeconds = Math.round((currentTime - (startTime || currentTime)) / 1000);
    
    const totalMistakes = normalMistakes + (punctuationMistakes * 0.5);
    const grossSpeed = Math.max(0, Math.round((correctChars / SSC_CONSTANTS.CHARS_PER_WORD) / timeInMinutes));
    const mistakePenalty = Math.min(correctChars, totalMistakes * SSC_CONSTANTS.MISTAKE_PENALTY);
    const netSpeed = Math.max(0, Math.round(
      ((correctChars - mistakePenalty) / SSC_CONSTANTS.CHARS_PER_WORD) / timeInMinutes
    ));
    const accuracy = totalChars === 0 ? 0 : Math.round((correctChars / totalChars) * 100);
    const wordsPerMinute = Math.max(0, Math.round((correctChars / SSC_CONSTANTS.CHARS_PER_WORD) / (timeInSeconds / 60)));
    const timePerWord = totalWords > 0 ? (timeInSeconds / totalWords).toFixed(2) + 's' : '0s';
    
    const stats: TypingStats = {
      grossSpeed,
      netSpeed,
      accuracy,
      mistakes: Math.round(totalMistakes),
      timeTaken: timeInSeconds,
      backspaces: backspaceCount,
      totalWords: Math.max(0, totalWords),
      correctWords,
      incorrectWords,
      timePerWord,
      wordsPerMinute,
      correctChars,
      totalChars,
      mistakeRate: totalChars === 0 ? 0 : Math.round((totalMistakes / totalChars) * 100),
      isQualified: timeInSeconds >= SSC_CONSTANTS.MIN_TEST_TIME && 
                   grossSpeed >= config.qualificationCriteria.minWpm && 
                   accuracy >= config.qualificationCriteria.minAccuracy,
      idleTime: 0
    };

    return stats;
  }, [config.qualificationCriteria]);

  // Fetch passages from API
  const fetchPassages = useCallback(async () => {
    // If custom passage is provided, use it instead of fetching from API
    if (config.customPassage) {
      const customPassage = {
        id: 0,
        title: 'Custom Passage',
        content: config.customPassage
      };
      setPassages([customPassage]);
      console.log('Using custom passage:', customPassage);
      return;
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/passages/test/${encodeURIComponent(config.passageCategory)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch passages: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.length > 0) {
        setPassages(data);
        console.log('Passages fetched successfuly:', data);
      } else {
        console.warn('Using default passages as no valid passages were returned from the API');
      }
    } catch (error) {
      console.warn('Using default passages due to API error:', error);
    }
  }, [config.passageCategory, config.customPassage]);

  // Display selected passage
  const displayPassage = useCallback(() => {
    console.log('Displaying passage:', selectedPassageIndex);
    const passage = passages[selectedPassageIndex];
    if (passage?.content) {
      const words = passage.content.trim().split(/\s+/);
      setPassageWords(words);
      setCurrentWordIndex(0);
      setCurrentLine(0);
      setTypedWords([]);
      setTotalChars(0);
      setCorrectChars(0);
      setMistakes(0);
      setCorrectWordsCount(0);
      setIncorrectWordsCount(0);
      setShowFeedback(false);

      if (sampleTextRef.current) {
        console.log('Building word elements');
        sampleTextRef.current.innerHTML = '';
        const elements: HTMLSpanElement[] = [];
        words.forEach((word: string, index: number) => {
          const wordSpan = document.createElement('span');
          wordSpan.className = 'word';
          wordSpan.innerHTML = word.split('').map((char: string) => 
            `<span>${sanitizeInput(char)}</span>`
          ).join('');
          if (index === 0 && examMode === 'Screen Typing') {
            wordSpan.classList.add('current-word');
          }
          sampleTextRef.current?.appendChild(wordSpan);
          sampleTextRef.current?.appendChild(document.createTextNode(' '));
          elements.push(wordSpan);
        });
        setWordElements(elements);
        calculateWordsPerLine();
      } else {
        console.warn('sampleTextRef is not available');
      }
    } else {
      console.warn('No passage content available');
    }
  }, [passages, selectedPassageIndex, examMode]);

  // Calculate words per line
  const calculateWordsPerLine = useCallback(() => {
    if (sampleTextRef.current && sampleTextContainerRef.current) {
      const containerWidth = sampleTextContainerRef.current.clientWidth;
      const wordSpan = document.createElement('span');
      wordSpan.style.visibility = 'hidden';
      wordSpan.style.position = 'absolute';
      wordSpan.innerText = 'typingtest';
      sampleTextRef.current.appendChild(wordSpan);
      const wordWidth = wordSpan.offsetWidth;
      sampleTextRef.current.removeChild(wordSpan);
      const wordsPerLine = Math.floor(containerWidth / (wordWidth + 10));
      setWordsPerLine(wordsPerLine);
    }
  }, []);

  // Word and character highlighting
  const updateWordHighlight = useCallback(() => {
    if (examMode === 'Paper Typing') {
      wordElements.forEach((word) => {
        word.classList.remove('current-word');
      });
      return;
    }

    // Get current typing position
    const typedText = typingAreaRef.current?.value || '';
    const typedWordsCurrent = typedText.trim().split(/\s+/);
    const currentTypingWordIndex = Math.max(0, typedWordsCurrent.length - 1);

    wordElements.forEach((word, index) => {
      word.classList.remove('current-word');
      if (index === currentTypingWordIndex) {
        word.classList.add('current-word');
      }
    });

    const lineNumber = Math.floor(currentTypingWordIndex / wordsPerLine);
    if (lineNumber > currentLine && sampleTextContainerRef.current) {
      setCurrentLine(lineNumber);
      // Autoscrolling disabled - user will scroll manually
      // const lineHeight = 28;
      // const containerHeight = sampleTextContainerRef.current.clientHeight;
      // const contentHeight = sampleTextRef.current?.offsetHeight || 0;
      // const maxScroll = contentHeight - containerHeight;

      // if (sampleTextContainerRef.current.scrollTop < maxScroll) {
      //   sampleTextContainerRef.current.scrollTop += lineHeight;
      // }
    }
  }, [currentLine, wordElements, wordsPerLine, examMode]);

  const getCharacterHighlights = (expected: string, typed: string) => {
    const normalizedExpected = normalizeQuotes(expected);
    const normalizedTyped = normalizeQuotes(typed);
    const result: { char: string; status: 'correct' | 'wrong' }[] = [];
    let typedIndex = 0;

    for (let i = 0; i < normalizedExpected.length; i++) {
      if (typedIndex < normalizedTyped.length) {
        if (normalizedExpected[i] === normalizedTyped[typedIndex]) {
          result.push({ char: normalizedExpected[i], status: 'correct' });
          typedIndex++;
        } else {
          if (i + 1 < normalizedExpected.length && 
              typedIndex < normalizedTyped.length && 
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

  const updateLetterHighlight = useCallback(() => {
    if (!typingAreaRef.current) return;

    if (examMode === 'Paper Typing') {
      wordElements.forEach((word) => {
        const chars = word.querySelectorAll('span');
        chars.forEach(char => {
          char.classList.remove('correct-char', 'incorrect-char');
        });
      });
      return;
    }

    const typedText = typingAreaRef.current.value;
    const typedWordsCurrent = typedText.trim().split(/\s+/);

    // Clear all highlights first
    wordElements.forEach((word, wordIndex) => {
      const chars = word.querySelectorAll('span');
      chars.forEach(char => {
        char.classList.remove('correct-char', 'incorrect-char');
      });
    });

    // Highlight all typed words (not just up to currentWordIndex)
    for (let wordIndex = 0; wordIndex < typedWordsCurrent.length && wordIndex < wordElements.length; wordIndex++) {
      const wordElement = wordElements[wordIndex];
      if (!wordElement) continue;

      const chars = wordElement.querySelectorAll('span');
      const typedWord = typedWordsCurrent[wordIndex];
      const expectedWord = passageWords[wordIndex] || '';

      const highlights = getCharacterHighlights(expectedWord, typedWord);

      chars.forEach((char, charIndex) => {
        if (charIndex < highlights.length) {
          const highlight = highlights[charIndex];
          if (highlight.status === 'correct') {
            char.classList.add('correct-char');
          } else {
            char.classList.add('incorrect-char');
          }
        }
      });
    }
  }, [passageWords, wordElements, examMode]);

  // Test control functions
  const startTest = useCallback(() => {
    if (isRunning || passages.length === 0) return;
    
    setIsRunning(true);
    const now = Date.now();
    setStartTime(now);
    setTimeLeft(selectedDuration);
    
    setCorrectChars(0);
    setTotalChars(0);
    setMistakes(0);
    setBackspaceCount(0);
    setTotalWords(0);
    setCorrectWordsCount(0);
    setIncorrectWordsCount(0);
    
    if (typingAreaRef.current) {
      typingAreaRef.current.readOnly = false;
      typingAreaRef.current.focus();
    }
    
    const initialStats = calculateTypingStats(0, 0, 0, 0, 0, 0, 0, now);
    setTypingStats(initialStats);
  }, [isRunning, passages.length, calculateTypingStats, selectedDuration]);

  const pauseTest = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      if (typingAreaRef.current) {
        typingAreaRef.current.disabled = true;
      }
    } else {
      startTest();
    }
  }, [isRunning, startTest]);

  const restartTest = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsRunning(false);
    setTypedWords([]);
    setTypedText('');
    setCurrentWordIndex(0);
    setCorrectWordsCount(0);
    setIncorrectWordsCount(0);
    setBackspaceCount(0);
    setTotalChars(0);
    setCorrectChars(0);
    setMistakes(0);
    setPunctuationMistakes(0);
    setExtraChars(0);
    setMissingChars(0);
    setStartTime(null);
    setTotalWords(0);
    setTimeLeft(selectedDuration);
    if (typingAreaRef.current) {
      typingAreaRef.current.value = '';
      typingAreaRef.current.readOnly = true;
      typingAreaRef.current.blur();
    }
    displayPassage();
    updateWordHighlight();
    updateLetterHighlight();
    setIdleTime(0);
    setLastKeypressTime(Date.now());
  }, [displayPassage, updateWordHighlight, updateLetterHighlight, selectedDuration]);

  const submitTest = useCallback(() => {
    if (!isRunning) return;
    
    setIsRunning(false);
    if (typingAreaRef.current) {
      typingAreaRef.current.readOnly = true;
    }
    
    setShowFeedback(true);
    document.body.classList.add('feedback-open');
    const container = document.querySelector('.typing-test-container');
    if (container) {
      container.classList.add('feedback-open');
    }
  }, [isRunning]);

  const handleCloseFeedback = useCallback(() => {
    setShowFeedback(false);
    document.body.style.overflow = '';
    document.body.classList.remove('feedback-open');
    const container = document.querySelector('.typing-test-container');
    if (container) {
      container.classList.remove('feedback-open');
    }
    restartTest();
  }, [restartTest]);

  // Event handlers
  const handlePassageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPassageIndex(parseInt(e.target.value));
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDuration = parseInt(e.target.value);
    setSelectedDuration(newDuration);
    setTimeLeft(newDuration);
    
    if (!isRunning) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      setTypedWords([]);
      setTypedText('');
      setCurrentWordIndex(0);
      setCorrectWordsCount(0);
      setIncorrectWordsCount(0);
      setBackspaceCount(0);
      setTotalChars(0);
      setCorrectChars(0);
      setMistakes(0);
      setPunctuationMistakes(0);
      setExtraChars(0);
      setMissingChars(0);
      setStartTime(null);
      setTotalWords(0);
      setIdleTime(0);
      setLastKeypressTime(Date.now());
      
      if (typingAreaRef.current) {
        typingAreaRef.current.value = '';
        typingAreaRef.current.readOnly = true;
        typingAreaRef.current.blur();
      }
      
      displayPassage();
      updateWordHighlight();
      updateLetterHighlight();
    }
  };

  const handleExamModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExamMode(e.target.value as 'Paper Typing' | 'Screen Typing');
  };

  const handleTypingChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isRunning) return;
    
    const newText = normalizeQuotes(e.target.value);
    setTypedText(newText);
    
    const passageText = passageWords.join(' ');
    
    const counters = {
      correctChars: 0,
      totalChars: newText.length,
      normalMistakes: 0,
      punctuationMistakes: 0,
      correctWords: 0,
      incorrectWords: 0
    };
    
    // Character-by-character comparison
    for (let i = 0; i < newText.length; i++) {
      const typedChar = newText[i];
      const expectedChar = passageText[i];
      
      if (expectedChar) {
        if (typedChar === expectedChar) {
          counters.correctChars++;
        } else {
          if (isPunctuation(expectedChar)) {
            counters.punctuationMistakes++;
          } else {
            counters.normalMistakes++;
          }
        }
      } else {
        counters.normalMistakes++;
      }
    }
    
    // Smart word completion detection
    const typedWords = newText.trim().split(/\s+/);
    const passageWordsArray = passageText.trim().split(/\s+/);
    
    if (typedWords.length === 1 && typedWords[0] === '') {
      setTotalWords(0);
    } else {
      setTotalWords(typedWords.length);
      
      // Check completed words (words that have been fully typed)
      for (let i = 0; i < typedWords.length; i++) {
        if (i < passageWordsArray.length) {
          const typedWord = typedWords[i];
          const expectedWord = passageWordsArray[i];
          
          // Check if this word is complete (has space after it or is last word)
          const isWordComplete = isWordFullyTyped(newText, i, typedWords);
          
          if (isWordComplete) {
            if (typedWord === expectedWord) {
              counters.correctWords++;
            } else {
              counters.incorrectWords++;
            }
          }
        } else {
          counters.incorrectWords++;
        }
      }
    }

    setCorrectChars(counters.correctChars);
    setTotalChars(counters.totalChars);
    setMistakes(counters.normalMistakes);
    setPunctuationMistakes(counters.punctuationMistakes);
    setCorrectWordsCount(counters.correctWords);
    setIncorrectWordsCount(counters.incorrectWords);
    
    const newStats = calculateTypingStats(
      counters.correctChars,
      counters.totalChars,
      counters.normalMistakes,
      backspaceCount,
      typedWords.length || 0,
      counters.correctWords,
      counters.incorrectWords,
      startTime,
      counters.punctuationMistakes
    );

    setTypingStats(newStats);
    updateLetterHighlight();
    updateWordHighlight();
  }, [isRunning, passageWords, updateLetterHighlight, updateWordHighlight, calculateTypingStats, startTime, backspaceCount]);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    // Better user feedback with toast notification instead of alert
    console.warn('Pasting is disabled during typing test');
    // You can integrate with a toast notification system here
  };

  const handleCopy = (e: React.ClipboardEvent) => {
    e.preventDefault();
    console.warn('Copying is disabled during typing test');
  };

  const handleCut = (e: React.ClipboardEvent) => {
    e.preventDefault();
    console.warn('Cutting is disabled during typing test');
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Enhanced keyboard shortcuts blocking
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isRunning) return;

    setLastKeypressTime(Date.now());

    if (e.key === 'Backspace') {
      setBackspaceCount(prev => prev + 1);
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      return;
    }

    // Natural spacebar behavior - no restrictions
    if (e.key === ' ') {
      // Allow spacebar to work naturally
      // Word completion will be detected in handleTypingChange
      return;
    }
  }, [isRunning]);

  // Enhanced drag and drop prevention
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    console.warn('Drag and drop is disabled during typing test');
  };

  // Effects
  useEffect(() => {
    console.log('Component mounted');
    fetchPassages();
    
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (sampleTextRef.current) {
        sampleTextRef.current.innerHTML = '';
      }
      setWordElements([]);
    };
  }, [fetchPassages]);

  useEffect(() => {
    if (passages.length > 0) {
      displayPassage();
    }
  }, [passages.length, displayPassage]);

  useEffect(() => {
    const handleResize = () => {
      if (sampleTextRef.current && sampleTextContainerRef.current) {
        calculateWordsPerLine();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateWordsPerLine]);

  useEffect(() => {
    displayPassage();
  }, [selectedPassageIndex, displayPassage]);

  useEffect(() => {
    updateWordHighlight();
    updateLetterHighlight();
  }, [examMode, updateWordHighlight, updateLetterHighlight]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
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
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isRunning, submitTest]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isRunning) {
      idleCheckIntervalRef.current = setInterval(() => {
        const currentTime = Date.now();
        const timeSinceLastKeypress = (currentTime - lastKeypressTime) / 1000;
        
        if (timeSinceLastKeypress > IDLE_THRESHOLD) {
          setIdleTime(prev => prev + 1);
        }
      }, 1000);
    }
    
    return () => {
      if (idleCheckIntervalRef.current) {
        clearInterval(idleCheckIntervalRef.current);
      }
    };
  }, [isRunning, lastKeypressTime]);

  return {
    // State
    passages,
    selectedPassageIndex,
    isRunning,
    timeLeft,
    selectedDuration,
    showFeedback,
    feedback,
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
    handleDragStart,
    handleDrop,
    
    // Config
    config
  };
}; 