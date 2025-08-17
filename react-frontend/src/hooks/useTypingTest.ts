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
  // Enhanced metrics for perfect analysis
  normalMistakes: number;
  punctuationMistakes: number;
  extraChars: number;
  missingChars: number;
  effectiveSpeed: number;
  wordAccuracy?: number; // Word-based accuracy for user display
}

interface TestConfig {
  testName: string;
  timeLimit: number;
  passageCategory: string;
  qualificationCriteria: {
    minWpm: number;
    minAccuracy: number;
  };
  customPassage?: string;
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
    idleTime: 0,
    // Enhanced metrics
    normalMistakes: 0,
    punctuationMistakes: 0,
    extraChars: 0,
    missingChars: 0,
    effectiveSpeed: 0
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
  const backgroundProcessRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const IDLE_THRESHOLD = 10;

  // Background processing for smooth typing
  const startBackgroundProcessing = useCallback(() => {
    if (backgroundProcessRef.current) {
      clearInterval(backgroundProcessRef.current);
    }

    backgroundProcessRef.current = setInterval(() => {
      // Background tasks for smooth performance
      if (isRunning) {
        // Update idle time
        const currentTime = Date.now();
        const timeSinceLastKeypress = (currentTime - lastKeypressTime) / 1000;
        
        if (timeSinceLastKeypress > IDLE_THRESHOLD) {
          setIdleTime(prev => prev + 1);
        }
      }
    }, 1000); // Run every second
  }, [isRunning, lastKeypressTime]);

  // Stop background processing
  const stopBackgroundProcessing = useCallback(() => {
    if (backgroundProcessRef.current) {
      clearInterval(backgroundProcessRef.current);
      backgroundProcessRef.current = undefined;
    }
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

  // Calculate typing stats - PERFECT LOGIC IMPLEMENTATION
  const calculateTypingStats = useCallback((
    correctChars: number,
    totalChars: number,
    mistakes: number,
    backspaceCount: number,
    totalWords: number,
    correctWords: number,
    incorrectWords: number,
    startTime: number | null,
    punctuationMistakes: number
  ): TypingStats => {
    const currentTime = Date.now();
    const timeInMinutes = Math.max(0.0166667, (currentTime - (startTime || currentTime)) / 60000);
    const timeInSeconds = Math.round((currentTime - (startTime || currentTime)) / 1000);
    
    // PERFECT ACCURACY CALCULATION (Industry Standard)
    // Character-based accuracy (primary, industry standard)
    const accuracy = totalChars === 0 ? 0 : 
                    Math.round((correctChars / totalChars) * 100);
    
    // Word-based accuracy (secondary, user-friendly)
    const wordAccuracy = totalWords === 0 ? 0 : 
                         Math.round((correctWords / totalWords) * 100);
    
    // PERFECT SPEED CALCULATIONS (Industry Standard)
    // Gross Speed: Raw typing speed (total characters / 5 / time)
    const grossSpeed = Math.max(0, Math.round((totalChars / 5) / timeInMinutes));
    
    // Net Speed: Effective speed after accuracy penalty
    const netSpeed = Math.max(0, Math.round(grossSpeed * (accuracy / 100)));
    
    // PERFECT MISTAKE COUNTING
    const totalMistakes = mistakes + (punctuationMistakes * 0.5);
    const characterMistakes = totalChars - correctChars;
    
    // PERFECT TIME CALCULATIONS
    const wordsPerMinute = Math.max(0, Math.round((correctChars / 5) / (timeInSeconds / 60)));
    const timePerWord = totalWords > 0 ? (timeInSeconds / totalWords).toFixed(2) + 's' : '0s';
    
    // PERFECT MISTAKE RATE
    const mistakeRate = totalChars === 0 ? 0 : Math.round((totalMistakes / totalChars) * 100);
    
    // PERFECT QUALIFICATION CHECK
    const isQualified = timeInSeconds >= SSC_CONSTANTS.MIN_TEST_TIME && 
                       grossSpeed >= config.qualificationCriteria.minWpm && 
                       accuracy >= config.qualificationCriteria.minAccuracy;
    
    // Debug logging for troubleshooting
    console.log('🔍 PERFECT LOGIC DEBUG:', {
      // Input values
      correctChars,
      totalChars,
      mistakes,
      totalWords,
      correctWords,
      incorrectWords,
      timeInMinutes,
      timeInSeconds,
      
      // Calculated values
      accuracy,
      wordAccuracy,
      grossSpeed,
      netSpeed,
      totalMistakes,
      characterMistakes,
      mistakeRate,
      isQualified
    });
    
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
      mistakeRate,
      isQualified,
      idleTime: 0,
      // Additional metrics for comprehensive analysis
      normalMistakes: mistakes,
      punctuationMistakes,
      extraChars: Math.max(0, totalChars - passageWords.join(' ').length),
      missingChars: Math.max(0, passageWords.join(' ').length - totalChars),
      effectiveSpeed: netSpeed
    };

    return stats;
  }, [config.qualificationCriteria, passageWords]);

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
        console.log('Passages fetched successfully:', data);
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
    }
  }, [currentLine, wordElements, wordsPerLine, examMode]);

  // Calculate word similarity for smart word alignment
  const calculateWordSimilarity = (word1: string, word2: string): number => {
    if (word1 === word2) return 1.0;
    if (word1.length === 0 || word2.length === 0) return 0.0;
    
    // Simple similarity based on common characters
    const set1 = new Set(word1.toLowerCase());
    const set2 = new Set(word2.toLowerCase());
    
    const intersection = new Set(Array.from(set1).filter(x => set2.has(x)));
    const union = new Set([...Array.from(set1), ...Array.from(set2)]);
    
    return intersection.size / union.size;
  };

  const getCharacterHighlights = (expected: string, typed: string) => {
    const normalizedExpected = normalizeQuotes(expected);
    const normalizedTyped = normalizeQuotes(typed);
    const result: { char: string; status: 'correct' | 'wrong' }[] = [];
    
    // PERFECT CHARACTER ALIGNMENT LOGIC
    // Handle case where typed word is longer/shorter than expected
    const maxLength = Math.max(normalizedExpected.length, normalizedTyped.length);
    
    for (let i = 0; i < maxLength; i++) {
      if (i < normalizedExpected.length && i < normalizedTyped.length) {
        // Both characters exist - compare them
        if (normalizedExpected[i] === normalizedTyped[i]) {
          result.push({ char: normalizedExpected[i], status: 'correct' });
        } else {
          result.push({ char: normalizedExpected[i], status: 'wrong' });
        }
      } else if (i < normalizedExpected.length) {
        // Expected character exists but typed doesn't - missing character
        result.push({ char: normalizedExpected[i], status: 'wrong' });
      } else {
        // Typed character exists but expected doesn't - extra character
        // Don't add to result as we're highlighting the expected passage
      }
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

    // SMART WORD ALIGNMENT FOR BETTER HIGHLIGHTING
    let passageIndex = 0;
    
    for (let i = 0; i < typedWordsCurrent.length && passageIndex < wordElements.length; i++) {
      const typedWord = typedWordsCurrent[i];
      
      // SMART LOCAL SEARCH - Only check 2-3 words around current position
      const searchWindow = 2; // Check 2 words before and after current position
      let bestMatchIndex = -1;
      let bestMatchScore = 0;
      
      // Look for the best match in a small window around current position
      const startIndex = Math.max(0, passageIndex - searchWindow);
      const endIndex = Math.min(wordElements.length, passageIndex + searchWindow + 1);
      
      for (let j = startIndex; j < endIndex; j++) {
        const expectedWord = passageWords[j] || '';
        const matchScore = calculateWordSimilarity(typedWord, expectedWord);
        
        if (matchScore > bestMatchScore) {
          bestMatchScore = matchScore;
          bestMatchIndex = j;
        }
      }
      
      if (bestMatchIndex >= 0 && bestMatchScore > 0.5) {
        // Found a good match - highlight it
        const wordElement = wordElements[bestMatchIndex];
        if (wordElement) {
          const chars = wordElement.querySelectorAll('span');
          const expectedWord = passageWords[bestMatchIndex] || '';
          
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
          
          passageIndex = bestMatchIndex + 1; // Move to next passage word
        }
      }
      // If no good match found in local window, skip highlighting (extra word)
    }
  }, [passageWords, wordElements, examMode]);

  // Test control functions
  const startTest = useCallback(() => {
    if (isRunning) return;
    
    setIsRunning(true);
    setStartTime(Date.now());
    setTimeLeft(selectedDuration);
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
    setTotalWords(0);
    setIdleTime(0);
    setLastKeypressTime(Date.now());
    
    if (typingAreaRef.current) {
      typingAreaRef.current.value = '';
      typingAreaRef.current.readOnly = false;
      typingAreaRef.current.focus();
    }
    
    startBackgroundProcessing();
  }, [isRunning, selectedDuration, startBackgroundProcessing]);

  const pauseTest = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      if (typingAreaRef.current) {
        typingAreaRef.current.disabled = true;
      }
      stopBackgroundProcessing();
    } else {
      startTest();
    }
  }, [isRunning, startTest, stopBackgroundProcessing]);

  const restartTest = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    stopBackgroundProcessing();
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
  }, [displayPassage, updateWordHighlight, updateLetterHighlight, selectedDuration, stopBackgroundProcessing]);

  const submitTest = useCallback(() => {
    if (!isRunning) return;
    
    setIsRunning(false);
    stopBackgroundProcessing();
    
    if (typingAreaRef.current) {
      typingAreaRef.current.readOnly = true;
    }
    
    const newStats = calculateTypingStats(
      correctChars,
      totalChars,
      mistakes,
      backspaceCount,
      totalWords,
      correctWordsCount,
      incorrectWordsCount,
      startTime,
      punctuationMistakes
    );

    setTypingStats(newStats);
    
    setShowFeedback(true);
    document.body.classList.add('feedback-open');
    const container = document.querySelector('.typing-test-container');
    if (container) {
      container.classList.add('feedback-open');
    }
  }, [isRunning, calculateTypingStats, correctChars, totalChars, mistakes, backspaceCount, totalWords, correctWordsCount, incorrectWordsCount, startTime, punctuationMistakes]);

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
    
    // PERFECT CHARACTER AND WORD COUNTING
    const counters = {
      correctChars: 0,
      totalChars: 0, // Will be calculated properly
      normalMistakes: 0,
      punctuationMistakes: 0,
      correctWords: 0,
      incorrectWords: 0
    };
    
    // PERFECT WORD PROCESSING
    const typedWords = newText.trim().split(/\s+/).filter(word => word.length > 0);
    const passageWordsArray = passageText.trim().split(/\s+/);
    
    let totalCorrectChars = 0;
    let totalMistakes = 0;
    let totalExpectedChars = 0;
    
    // PERFECT WORD-BY-WORD ANALYSIS WITH SMART ALIGNMENT
    let passageIndex = 0;
    
    for (let i = 0; i < typedWords.length; i++) {
      const typedWord = typedWords[i];
      
      // SMART LOCAL SEARCH - Only check 2-3 words around current position
      const searchWindow = 2; // Check 2 words before and after current position
      let bestMatchIndex = -1;
      let bestMatchScore = 0;
      
      // Look for the best match in a small window around current position
      const startIndex = Math.max(0, passageIndex - searchWindow);
      const endIndex = Math.min(passageWordsArray.length, passageIndex + searchWindow + 1);
      
      for (let j = startIndex; j < endIndex; j++) {
        const expectedWord = passageWordsArray[j];
        const matchScore = calculateWordSimilarity(typedWord, expectedWord);
        
        if (matchScore > bestMatchScore) {
          bestMatchScore = matchScore;
          bestMatchIndex = j;
        }
      }
      
      if (bestMatchIndex >= 0 && bestMatchScore > 0.5) {
        // Found a good match - process it
        const expectedWord = passageWordsArray[bestMatchIndex];
        passageIndex = bestMatchIndex + 1; // Move to next passage word
        
        // PERFECT CHARACTER COMPARISON
        const minLength = Math.min(typedWord.length, expectedWord.length);
        let wordCorrectChars = 0;
        let wordMistakes = 0;
        
        // Compare each character
        for (let j = 0; j < minLength; j++) {
          if (typedWord[j] === expectedWord[j]) {
            wordCorrectChars++;
          } else {
            wordMistakes++;
          }
        }
        
        // Count extra characters as mistakes
        if (typedWord.length > expectedWord.length) {
          wordMistakes += (typedWord.length - expectedWord.length);
        }
        
        // Count missing characters as mistakes
        if (typedWord.length < expectedWord.length) {
          wordMistakes += (expectedWord.length - typedWord.length);
        }
        
        totalCorrectChars += wordCorrectChars;
        totalMistakes += wordMistakes;
        totalExpectedChars += expectedWord.length;
        
        // PERFECT WORD ACCURACY
        if (typedWord === expectedWord) {
          counters.correctWords++;
        } else {
          counters.incorrectWords++;
        }
        
        // PERFECT MISTAKE CATEGORIZATION
        if (wordMistakes > 0) {
          // Check if mistakes are punctuation-related
          const punctuationMistakesInWord = Array.from(typedWord).filter(char => 
            isPunctuation(char) && !expectedWord.includes(char)
          ).length;
          
          counters.punctuationMistakes += punctuationMistakesInWord;
          counters.normalMistakes += (wordMistakes - punctuationMistakesInWord);
        }
      } else {
        // No good match found in local window - count as extra word
        counters.normalMistakes += typedWord.length;
        counters.incorrectWords++;
        totalMistakes += typedWord.length;
        // Don't advance passageIndex - stay at current position
      }
    }
    
    // PERFECT FINAL COUNTS - Calculate totalChars properly
    counters.correctChars = totalCorrectChars;
    counters.totalChars = totalExpectedChars; // Use expected passage length, not typed text length
    
    // Debug logging for character counting fix
    console.log('🔍 CHARACTER COUNTING DEBUG:', {
      typedText: newText,
      typedTextLength: newText.length,
      typedWords: typedWords,
      passageWords: passageWordsArray,
      totalExpectedChars,
      totalCorrectChars,
      totalMistakes,
      finalTotalWords: typedWords.length
    });
    
    // Set total words (only non-empty words)
    const finalTotalWords = typedWords.length;
    
    // Update all state variables
    setCorrectChars(counters.correctChars);
    setTotalChars(counters.totalChars);
    setMistakes(counters.normalMistakes);
    setPunctuationMistakes(counters.punctuationMistakes);
    setCorrectWordsCount(counters.correctWords);
    setIncorrectWordsCount(counters.incorrectWords);
    setTotalWords(finalTotalWords);
    
    // PERFECT STATS CALCULATION
    const newStats = calculateTypingStats(
      counters.correctChars,
      counters.totalChars,
      counters.normalMistakes,
      backspaceCount,
      finalTotalWords,
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
      if (backgroundProcessRef.current) {
        clearInterval(backgroundProcessRef.current);
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
