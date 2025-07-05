import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  faBackspace
} from '@fortawesome/free-solid-svg-icons';
import './TypingTest.css';

interface Passage {
  _id?: string;
  title: string;
  content: string;
  testTypes?: string[];
}

interface TestSettings {
  mode: 'Paper Typing' | 'Screen Typing';
}

interface FeedbackResults {
  wpm: number;
  netWpm: number;
  accuracy: number;
  mistakes: number;
  timeTaken: number;
  totalWords: number;
  correctWords: number;
  incorrectWords: number;
  totalChars: number;
  backspaceCount: number;
}

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
  effectiveSpeed?: number; // Speed after applying mistake penalties
}

const API_BASE_URL = 'http://localhost:5000/api';

// Default passages to use when backend is unavailable
const DEFAULT_PASSAGES = [
  {
    title: "Sample Passage 1",
    content: "The quick brown fox jumps over the lazy dog. This is a sample passage for typing practice. Typing is an essential skill in today's digital world. Regular practice can help improve your speed and accuracy."
  },
  {
    title: "Sample Passage 2",
    content: "Practice makes perfect. The more you type, the better you become. Focus on accuracy first, then gradually increase your speed. Remember to maintain proper posture while typing."
  }
];

// Add SSC calculation constants
const SSC_CONSTANTS = {
  CHARS_PER_WORD: 5,
  TEST_DURATION: 10, // 10 minutes for SSC
  MISTAKE_PENALTY: 5, // 5 characters per mistake
  PUNCTUATION_MISTAKE_WEIGHT: 0.5, // Half weight for punctuation mistakes
  MIN_ACCURACY: 80, // Minimum required accuracy
  MIN_SPEED: 35, // Minimum required speed (WPM)
  MIN_TEST_TIME: 60 // Minimum test duration in seconds
};

const TypingTest = () => {
  // State variables
  const [passages, setPassages] = useState(DEFAULT_PASSAGES);
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
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes default
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
  const [results, setResults] = useState({
    wpm: 0,
    accuracy: 0,
    mistakes: 0,
    timeTaken: 0
  });
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
  const idleCheckIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const IDLE_THRESHOLD = 10; // 10 seconds threshold for idle time

  // Refs
  const timerIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const typingAreaRef = useRef<HTMLTextAreaElement>(null);
  const sampleTextContainerRef = useRef<HTMLDivElement>(null);
  const sampleTextRef = useRef<HTMLParagraphElement>(null);

  // Move calculateTypingStats inside the component
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
    // Calculate time metrics
    const currentTime = Date.now();
    const timeInMinutes = Math.max(0.0166667, (currentTime - (startTime || currentTime)) / 60000);
    const timeInSeconds = Math.round((currentTime - (startTime || currentTime)) / 1000);
    
    // Calculate mistakes
    const totalMistakes = normalMistakes + (punctuationMistakes * 0.5);
    
    // Calculate Gross Speed (WPM)
    const grossSpeed = Math.max(0, Math.round((correctChars / SSC_CONSTANTS.CHARS_PER_WORD) / timeInMinutes));
    
    // Calculate Net Speed (WPM) - ensure it's not negative
    const mistakePenalty = Math.min(correctChars, totalMistakes * SSC_CONSTANTS.MISTAKE_PENALTY);
    const netSpeed = Math.max(0, Math.round(
      ((correctChars - mistakePenalty) / SSC_CONSTANTS.CHARS_PER_WORD) / timeInMinutes
    ));
    
    // Calculate Accuracy - if no chars typed, accuracy is 0
    const accuracy = totalChars === 0 ? 0 : Math.round((correctChars / totalChars) * 100);
    
    // Calculate Words Per Minute
    const wordsPerMinute = Math.max(0, Math.round((correctChars / SSC_CONSTANTS.CHARS_PER_WORD) / (timeInSeconds / 60)));
    
    // Calculate Time Per Word
    const timePerWord = totalWords > 0 ? (timeInSeconds / totalWords).toFixed(2) + 's' : '0s';
    
    const stats: TypingStats = {
      grossSpeed,
      netSpeed,
      accuracy, // Just the number without % sign
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
                   grossSpeed >= SSC_CONSTANTS.MIN_SPEED && 
                   accuracy >= SSC_CONSTANTS.MIN_ACCURACY,
      idleTime: 0 // Adding back the idleTime property with a default value
    };

    return stats;
  }, []);

  // Fetch passages from API
  const fetchPassages = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/passages/test/Typing%20Test');
      if (!response.ok) {
        throw new Error(`Failed to fetch passages: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.length > 0) {
        setPassages(data);
        console.log('Passages fetched successfully:', data);
      } else {
        console.warn('Using default passages as no valid passages were returned from the API');
      }
    } catch (error) {
      console.warn('Using default passages due to API error:', error);
    }
  }, []);

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

      // Clear and rebuild word elements
      if (sampleTextRef.current) {
        console.log('Building word elements');
        sampleTextRef.current.innerHTML = '';
        const elements: HTMLSpanElement[] = [];
        words.forEach((word, index) => {
          const wordSpan = document.createElement('span');
          wordSpan.className = 'word';
          wordSpan.innerHTML = word.split('').map(char => 
            `<span>${sanitizeInput(char)}</span>`
          ).join('');
          if (index === 0) wordSpan.classList.add('current-word');
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
  }, [passages, selectedPassageIndex]);

  // Initialize component
  useEffect(() => {
    console.log('Component mounted');
    fetchPassages();
    
    return () => {
      // Cleanup on unmount
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      // Clear word elements
      if (sampleTextRef.current) {
        sampleTextRef.current.innerHTML = '';
      }
      setWordElements([]);
    };
  }, [fetchPassages]);

  // Separate effect for passage display
  useEffect(() => {
    if (passages.length > 0) {
      displayPassage();
    }
  }, [passages.length, displayPassage]);

  // Move calculateWordsPerLine before its usage
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

  // Handle window resize with cleanup
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

  // Update passage when selection changes
  useEffect(() => {
    displayPassage();
  }, [selectedPassageIndex, displayPassage]);

  // Timer effect
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
  }, [isRunning]);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  // Word and character highlighting
  const updateWordHighlight = useCallback(() => {
    wordElements.forEach((word, index) => {
      word.classList.remove('current-word');
      if (index === currentWordIndex) {
        word.classList.add('current-word');
      }
    });

    const lineNumber = Math.floor(currentWordIndex / wordsPerLine);
    if (lineNumber > currentLine && sampleTextContainerRef.current) {
      setCurrentLine(lineNumber);
      const lineHeight = 28;
      const containerHeight = sampleTextContainerRef.current.clientHeight;
      const contentHeight = sampleTextRef.current?.offsetHeight || 0;
      const maxScroll = contentHeight - containerHeight;

      if (sampleTextContainerRef.current.scrollTop < maxScroll) {
        sampleTextContainerRef.current.scrollTop += lineHeight;
      }
    }
  }, [currentWordIndex, currentLine, wordElements, wordsPerLine]);

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

    const typedText = typingAreaRef.current.value;
    const typedWordsCurrent = typedText.trim().split(/\s+/);

    wordElements.forEach((word, wordIndex) => {
      const chars = word.querySelectorAll('span');
      chars.forEach(char => {
        char.classList.remove('correct-char', 'incorrect-char');
      });
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
          if (highlight.status === 'correct') {
            char.classList.add('correct-char');
          } else {
            char.classList.add('incorrect-char');
          }
        }
      });
    }
  }, [currentWordIndex, passageWords, wordElements]);

  // Calculate results
  const calculateResults = useCallback(() => {
    if (!startTime) return;

    const timeInMinutes = Math.max(1, (Date.now() - startTime) / 60000);
    const timeInSeconds = Math.round((Date.now() - startTime) / 1000);
    
    // SSC Gross Speed Calculation
    // Formula: (Correct Characters / 5) / Time in Minutes
    const grossSpeed = Math.round((correctChars / SSC_CONSTANTS.CHARS_PER_WORD) / timeInMinutes);
    
    // SSC Net Speed Calculation
    // Formula: ((Correct Chars - (Mistakes × 5)) / 5) / Time in Minutes
    const netSpeed = Math.round(
      ((correctChars - (mistakes * SSC_CONSTANTS.MISTAKE_PENALTY)) / SSC_CONSTANTS.CHARS_PER_WORD) / timeInMinutes
    );
    
    // SSC Accuracy Calculation
    // Formula: (Correct Characters / Total Characters) × 100
    const accuracy = Math.round((correctChars / Math.max(1, totalChars)) * 100);
    
    // SSC Words per Minute (based on actual words typed)
    const wordsPerMinute = Math.round(totalWords / (timeInSeconds / 60));
    
    // Time per Word (for detailed analysis)
    const timePerWord = totalWords > 0 ? (timeInSeconds / totalWords).toFixed(2) : '0';

    // Calculate SSC-specific metrics
    const sscMetrics = {
      grossSpeed,
      netSpeed,
      accuracy,
      mistakes,
      timeInSeconds,
      totalWords,
      correctWords: correctWordsCount,
      incorrectWords: incorrectWordsCount,
      // Additional SSC metrics
      mistakeRate: totalChars > 0 ? (mistakes / totalChars * 100).toFixed(2) : '0',
      wordsPerMinute,
      timePerWord: timePerWord + 's',
      // SSC qualification check
      isQualified: grossSpeed >= SSC_CONSTANTS.MIN_SPEED && accuracy >= SSC_CONSTANTS.MIN_ACCURACY
    };

    // Helper function to update metrics
    const updateMetric = (id: string, value: string | number) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value.toString();
      }
    };

    // Update both live and result metrics with SSC standards
    const metrics = [
      // Speed metrics
      { id: 'live-gross-speed', value: grossSpeed },
      { id: 'result-gross-speed', value: grossSpeed },
      { id: 'live-net-speed', value: netSpeed },
      { id: 'result-net-speed', value: netSpeed },
      
      // Accuracy metrics
      { id: 'live-accuracy', value: accuracy },
      { id: 'result-accuracy', value: accuracy },
      
      // Mistake metrics
      { id: 'live-mistakes', value: mistakes },
      { id: 'result-mistakes', value: mistakes },
      { id: 'live-mistake-rate', value: sscMetrics.mistakeRate + '%' },
      { id: 'result-mistake-rate', value: sscMetrics.mistakeRate + '%' },
      
      // Word metrics
      { id: 'live-total-words', value: totalWords },
      { id: 'result-total-words', value: totalWords },
      { id: 'live-correct-words', value: correctWordsCount },
      { id: 'result-correct-words', value: correctWordsCount },
      { id: 'live-incorrect-words', value: incorrectWordsCount },
      { id: 'result-incorrect-words', value: incorrectWordsCount },
      
      // Time metrics
      { id: 'live-time-taken', value: formatTime(timeInSeconds) },
      { id: 'result-time-taken', value: formatTime(timeInSeconds) },
      { id: 'live-time-per-word', value: timePerWord + 's' },
      { id: 'result-time-per-word', value: timePerWord + 's' },
      { id: 'live-words-per-minute', value: wordsPerMinute },
      { id: 'result-words-per-minute', value: wordsPerMinute },
      
      // SSC qualification status
      { id: 'live-qualified', value: sscMetrics.isQualified ? 'Qualified' : 'Not Qualified' },
      { id: 'result-qualified', value: sscMetrics.isQualified ? 'Qualified' : 'Not Qualified' }
    ];

    metrics.forEach(({ id, value }) => updateMetric(id, value));

    // Update typing stats state with SSC metrics
    setTypingStats({
      grossSpeed,
      netSpeed,
      accuracy,
      mistakes,
      timeTaken: timeInSeconds,
      backspaces: backspaceCount,
      totalWords,
      correctWords: correctWordsCount,
      incorrectWords: incorrectWordsCount,
      timePerWord: timePerWord + 's',
      wordsPerMinute,
      correctChars,
      totalChars,
      mistakeRate: parseFloat(sscMetrics.mistakeRate),
      isQualified: sscMetrics.isQualified,
      idleTime
    });

    // Log detailed SSC metrics for debugging
    console.log('SSC Typing Test Metrics:', {
      grossSpeed,
      netSpeed,
      accuracy,
      mistakes,
      mistakeRate: sscMetrics.mistakeRate + '%',
      timeInSeconds,
      totalWords,
      correctWords: correctWordsCount,
      incorrectWords: incorrectWordsCount,
      wordsPerMinute,
      timePerWord: timePerWord + 's',
      isQualified: sscMetrics.isQualified,
      // Raw data for verification
      correctChars,
      totalChars,
      timeInMinutes
    });
  }, [startTime, correctChars, totalChars, mistakes, backspaceCount, totalWords, correctWordsCount, incorrectWordsCount]);

  // Generate feedback
  const generateFeedback = useCallback((stats: TypingStats) => {
    const { grossSpeed, netSpeed, accuracy, mistakes, backspaces, totalWords, correctWords, incorrectWords, timePerWord, wordsPerMinute, isQualified } = stats;
    
    let feedback = '';
    let suggestions = [];

    // Speed feedback
    if (grossSpeed < 35) {
      feedback += 'Your typing speed is below the SSC requirement of 35 WPM. ';
      suggestions.push('Practice regularly to improve your speed.');
    } else if (grossSpeed >= 35 && grossSpeed < 40) {
      feedback += 'Your typing speed meets the minimum requirement but can be improved. ';
      suggestions.push('Focus on maintaining accuracy while gradually increasing speed.');
    } else {
      feedback += 'Great typing speed! ';
    }

    // Accuracy feedback
    if (accuracy < 80) {
      feedback += 'Your accuracy is below the required 80%. ';
      suggestions.push('Slow down slightly to improve accuracy.');
    } else if (accuracy >= 80 && accuracy < 90) {
      feedback += 'Your accuracy is acceptable but can be improved. ';
      suggestions.push('Practice with focus on reducing mistakes.');
    } else {
      feedback += 'Excellent accuracy! ';
    }

    // Mistake analysis
    if (mistakes > 0) {
      feedback += `You made ${mistakes} mistakes. `;
      if (mistakes > 5) {
        suggestions.push('Try to reduce mistakes by typing more carefully.');
      }
    }

    // Backspace analysis
    if (backspaces > totalWords) {
      suggestions.push('You\'re using backspace too frequently. Try to type more deliberately.');
    }

    // Word analysis
    if (correctWords < totalWords * 0.8) {
      suggestions.push('Focus on typing complete words correctly rather than individual characters.');
    }

    // Qualification status
    if (isQualified) {
      feedback += 'Congratulations! You meet the SSC qualification criteria.';
    } else {
      feedback += 'You need to improve to meet the SSC qualification criteria.';
    }

    return {
      feedback,
      suggestions,
      stats: {
        grossSpeed,
        netSpeed,
        accuracy,
        mistakes,
        backspaces,
        totalWords,
        correctWords,
        incorrectWords,
        timePerWord,
        wordsPerMinute,
        isQualified
      }
    };
  }, []);

  // Test control functions
  const startTest = useCallback(() => {
    if (isRunning || passages.length === 0) return;
    
    setIsRunning(true);
    const now = Date.now();
    setStartTime(now);
    
    // Reset all counters
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
    
    // Initial calculation
    const initialStats = calculateTypingStats(0, 0, 0, 0, 0, 0, 0, now);
    setTypingStats(initialStats);
  }, [isRunning, passages.length, calculateTypingStats]);

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
    if (typingAreaRef.current) {
      typingAreaRef.current.value = '';
      typingAreaRef.current.readOnly = true;
      typingAreaRef.current.blur();
    }
    displayPassage();
    updateWordHighlight();
    updateLetterHighlight();
    calculateResults();
    setIdleTime(0);
    setLastKeypressTime(Date.now());
  }, [displayPassage, updateWordHighlight, updateLetterHighlight, calculateResults]);

  const handleCloseFeedback = useCallback(() => {
    setShowFeedback(false);
    document.body.style.overflow = ''; // Restore natural scrolling
  }, []);

  const submitTest = useCallback(() => {
    if (!isRunning) return;
    
    setIsRunning(false);
    if (typingAreaRef.current) {
      typingAreaRef.current.readOnly = true;
    }
    
    // Generate final feedback using current typingStats
    const finalFeedback = generateFeedback(typingStats);
    setFeedback(finalFeedback);
    setShowFeedback(true);
  }, [isRunning, typingStats, generateFeedback]);

  // Event handlers
  const handlePassageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPassageIndex(parseInt(e.target.value));
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDuration = parseInt(e.target.value);
    setTimeLeft(newDuration);
    if (!isRunning) {
      restartTest();
    }
  };

  const handleTypingChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isRunning) return;
    
    const newText = normalizeQuotes(e.target.value);
    setTypedText(newText);
    
    // Get passage text
    const passageText = passageWords.join(' ');
    
    // Initialize counters
    const counters = {
      correctChars: 0,
      totalChars: newText.length,
      normalMistakes: 0,
      punctuationMistakes: 0,
      correctWords: 0,
      incorrectWords: 0
    };
    
    // Compare each character
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
        // Extra character typed
        counters.normalMistakes++;
      }
    }
    
    // Word-level comparison
    const typedWords = newText.trim().split(/\s+/);
    const passageWordsArray = passageText.trim().split(/\s+/);
    
    // Only count non-empty words
    if (typedWords.length === 1 && typedWords[0] === '') {
      setTotalWords(0);
    } else {
      setTotalWords(typedWords.length);
      
      // Compare words
      for (let i = 0; i < typedWords.length; i++) {
        if (i < passageWordsArray.length) {
      if (typedWords[i] === passageWordsArray[i]) {
            counters.correctWords++;
      } else {
            counters.incorrectWords++;
      }
        } else {
          counters.incorrectWords++;
        }
      }
    }

    // Update states
    setCorrectChars(counters.correctChars);
    setTotalChars(counters.totalChars);
    setMistakes(counters.normalMistakes);
    setPunctuationMistakes(counters.punctuationMistakes);
    setCorrectWordsCount(counters.correctWords);
    setIncorrectWordsCount(counters.incorrectWords);
    
    // Calculate stats
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

    // Update live metrics in the DOM
    const updateMetric = (id: string, value: string | number) => {
      const element = document.getElementById(id);
      if (element) {
        if (id === 'live-accuracy') {
          element.textContent = value.toString().replace('%', '');
        } else {
          element.textContent = value.toString();
        }
      }
    };

    // Update all live metrics
    updateMetric('live-gross-speed', newStats.grossSpeed);
    updateMetric('live-net-speed', newStats.netSpeed);
    updateMetric('live-accuracy', newStats.accuracy);
    updateMetric('live-mistakes', newStats.mistakes);
    updateMetric('live-backspaces', backspaceCount);
    updateMetric('live-total-words', newStats.totalWords);
    updateMetric('live-correct-words', newStats.correctWords);
    updateMetric('live-incorrect-words', newStats.incorrectWords);

    // Debug logging for live updates
    console.log('Live Metrics Update:', {
      input: {
        text: newText,
        length: newText.length,
        words: typedWords
      },
      metrics: {
        grossSpeed: newStats.grossSpeed,
        netSpeed: newStats.netSpeed,
        accuracy: newStats.accuracy,
        mistakes: newStats.mistakes,
        backspaces: backspaceCount,
        totalWords: newStats.totalWords,
        correctWords: newStats.correctWords,
        incorrectWords: newStats.incorrectWords,
        idleTime: idleTime // Keep tracking in logs but not in UI
      }
    });

    setTypingStats(newStats);
    updateLetterHighlight();
  }, [isRunning, passageWords, updateLetterHighlight, calculateTypingStats, startTime, backspaceCount]);

  // Update metrics display without idle time
  const updateMetrics = useCallback(() => {
    const updateMetric = (id: string, value: string | number) => {
      const element = document.getElementById(id);
      if (element) {
        const cleanValue = value.toString().replace(/%/g, '');
        // Add percentage sign only for accuracy-related metrics
        if (id.includes('accuracy')) {
          element.textContent = `${cleanValue}%`;
        } else {
          element.textContent = cleanValue;
        }
      }
    };

    // Update all metrics
    updateMetric('live-gross-speed', typingStats.grossSpeed);
    updateMetric('live-net-speed', typingStats.netSpeed);
    updateMetric('live-accuracy', typingStats.accuracy);
    updateMetric('result-accuracy', typingStats.accuracy);
    updateMetric('live-mistakes', typingStats.mistakes);
    updateMetric('live-backspaces', backspaceCount);
    updateMetric('live-total-words', typingStats.totalWords);
    updateMetric('live-correct-words', typingStats.correctWords);
    updateMetric('live-incorrect-words', typingStats.incorrectWords);
  }, [typingStats, backspaceCount]);

  // Add effect to update metrics whenever typingStats changes
  useEffect(() => {
    updateMetrics();
  }, [updateMetrics, typingStats]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isRunning) return;

    // Update last keypress time for any key
    setLastKeypressTime(Date.now());

    if (e.key === 'Backspace') {
      setBackspaceCount(prev => prev + 1);
      console.log('Backspace pressed - count:', backspaceCount + 1);
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      return;
    }

    if (e.key === ' ') {
      const typedText = e.currentTarget.value;
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
        setTotalWords(prev => prev + 1);

        if (currentWordIndex + 1 >= passageWords.length) {
          submitTest();
        }
      }
    }
  }, [isRunning, currentWordIndex, passageWords, typedWords, updateWordHighlight, updateLetterHighlight, calculateResults, submitTest]);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    alert('Pasting text is disabled.');
  };

  const handleCopy = (e: React.ClipboardEvent) => {
    e.preventDefault();
    alert('Copying text is disabled.');
  };

  const handleCut = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const getFeedbackMessage = (wpm: number, accuracy: number) => {
    let message = '';
    let detailMessage = '';

    // Main feedback based on WPM and accuracy
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

    // Additional concise feedback
    if (accuracy < 85) {
      detailMessage += " Try to type slower but correctly.";
    }
    if (wpm < 20) {
      detailMessage += " Build muscle memory with regular practice.";
    }
    if (mistakes > 10) {
      detailMessage += " Take your time to avoid mistakes.";
    }

    return { message, detailMessage };
  };

  // Update useEffect for feedback generation
  useEffect(() => {
    if (showFeedback) {
      const newFeedback = generateFeedback(typingStats);
      setFeedback(newFeedback);
    }
  }, [typingStats, showFeedback, generateFeedback]);

  // Update button click handlers
  const handleStartClick = useCallback(() => {
    startTest();
  }, [startTest]);

  const handleSubmitClick = useCallback(() => {
    submitTest();
  }, [submitTest]);

  // Add idle time checker
  useEffect(() => {
    if (isRunning) {
      // Check for idle time every second
      idleCheckIntervalRef.current = setInterval(() => {
        const currentTime = Date.now();
        const timeSinceLastKeypress = (currentTime - lastKeypressTime) / 1000; // Convert to seconds
        
        if (timeSinceLastKeypress > IDLE_THRESHOLD) {
          setIdleTime(prev => prev + 1); // Increment idle time by 1 second
        }
      }, 1000);
    }
    
    return () => {
      if (idleCheckIntervalRef.current) {
        clearInterval(idleCheckIntervalRef.current);
      }
    };
  }, [isRunning, lastKeypressTime]);

  return (
    <div className="typing-test-container">
      <Helmet>
        <title>SSC Typing Test - Practice for SSC CGL/CHSL Typing Test</title>
        <meta name="description" content="Free online SSC typing test practice platform. Improve your typing speed and accuracy for SSC CGL, CHSL, and other government exams. Real-time feedback and detailed analysis." />
        <meta name="keywords" content="SSC typing test, SSC CGL typing, SSC CHSL typing, government exam typing, typing practice, typing speed test, typing accuracy, typing tutor" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="SSC Typing Test Practice" />
        <meta property="og:description" content="Practice typing for SSC exams with real-time feedback and detailed analysis." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://your-domain.com/typing-test" />
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
                <label htmlFor="timer-duration" className="selector-label">
                  <FontAwesomeIcon icon={faClock} className="icon" /> Duration
                </label>
              <select
                id="timer-duration"
                value={timeLeft}
                onChange={handleDurationChange}
                disabled={isRunning}
              >
                <option value={120}>2 min</option>
                <option value={300}>5 min</option>
                <option value={600}>10 min</option>
                <option value={900}>15 min</option>
              </select>
            </div>
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
            className={`typing-area ${!isRunning ? 'blurred' : ''}`}
            placeholder={isRunning ? "Start typing here..." : "Click 'Start' to begin typing test"}
            style={{ 
              cursor: isRunning ? 'text' : 'not-allowed',
              backgroundColor: isRunning ? '#fff' : '#f5f5f5'
            }}
          />

          <div className="control-buttons">
            <button
              className="btn btn-primary"
              onClick={handleStartClick}
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
            <button
              className="btn btn-danger"
              onClick={handleSubmitClick}
              disabled={!isRunning}
            >
                <FontAwesomeIcon icon={faCheck} className="icon" /> Submit
            </button>
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
            <span><span id="live-gross-speed">0</span> wpm</span>
          </div>
          <div className="metric-block">
              <span>
                <FontAwesomeIcon icon={faKeyboard} className="icon" /> Net Speed:
              </span>
            <span><span id="live-net-speed">0</span> wpm</span>
          </div>
          <div className="metric-block">
              <span>
                <FontAwesomeIcon icon={faCheck} className="icon" /> Accuracy:
              </span>
            <span id="live-accuracy">0</span>
          </div>
          <div className="metric-block">
              <span>
                <FontAwesomeIcon icon={faExclamationTriangle} className="icon" /> Mistakes:
              </span>
            <span id="live-mistakes">0</span>
          </div>
          <div className="metric-block">
              <span>
                <FontAwesomeIcon icon={faBackspace} className="icon" /> Backspaces:
              </span>
            <span id="live-backspaces">0</span>
          </div>
          <div className="metric-block">
              <span>
                <FontAwesomeIcon icon={faFileAlt} className="icon" /> Total Words:
              </span>
            <span id="live-total-words">0</span>
          </div>
          <div className="metric-block">
              <span>
                <FontAwesomeIcon icon={faCheck} className="icon" /> Correct Words:
              </span>
            <span id="live-correct-words">0</span>
          </div>
          <div className="metric-block">
              <span>
                <FontAwesomeIcon icon={faExclamationTriangle} className="icon" /> Incorrect Words:
              </span>
            <span id="live-incorrect-words">0</span>
          </div>
        </div>

          {showFeedback && (
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
      </div>
    </div>
  );
};

export default TypingTest; 