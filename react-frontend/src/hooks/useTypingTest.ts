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

  // IMPROVED Word and character highlighting
  const updateWordHighlight = useCallback(() => {
    if (examMode === 'Paper Typing') {
      wordElements.forEach((word) => {
        word.classList.remove('current-word');
      });
      return;
    }

    // IMPROVED current typing position detection
    const typedText = typingAreaRef.current?.value || '';
    const typedWordsCurrent = typedText.trim().split(/\s+/);
    
         // Calculate current word position based on improved logic
     let currentTypingWordIndex = 0;
     let passageIndex = 0;
     
     for (let i = 0; i < typedWordsCurrent.length && passageIndex < wordElements.length; i++) {
       const typedWord = typedWordsCurrent[i];
       
       // ONLY CHECK CURRENT WORD
       const currentExpectedWord = passageWords[passageIndex] || '';
       
       if (currentExpectedWord) {
         const matchScore = calculateWordSimilarity(typedWord, currentExpectedWord);
         
         if (matchScore > 0.6) {
           // Found a good match with current word
           passageIndex = passageIndex + 1;
           currentTypingWordIndex = passageIndex;
         } else {
           // No match - stay at current position
           currentTypingWordIndex = passageIndex;
           break;
         }
       } else {
         // No more words in passage
         currentTypingWordIndex = passageIndex;
         break;
       }
     }

    // Update current word highlighting
    wordElements.forEach((word, index) => {
      word.classList.remove('current-word');
      if (index === currentTypingWordIndex) {
        word.classList.add('current-word');
      }
    });

    // Update line scrolling
    const lineNumber = Math.floor(currentTypingWordIndex / wordsPerLine);
    if (lineNumber > currentLine && sampleTextContainerRef.current) {
      setCurrentLine(lineNumber);
    }
  }, [currentLine, wordElements, wordsPerLine, examMode, passageWords]);

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

  // REAL-TIME CHARACTER HIGHLIGHTING FUNCTION
  const updateRealTimeCharacterHighlight = useCallback((typedText: string) => {
    if (examMode === 'Paper Typing') return;

    // Clear all highlights first
    wordElements.forEach((word) => {
      const chars = word.querySelectorAll('span');
      chars.forEach(char => {
        char.classList.remove('correct-char', 'incorrect-char');
      });
    });

    const typedWords = typedText.trim().split(/\s+/);
    let passageIndex = 0;

    // Process completed words
    for (let i = 0; i < typedWords.length - 1; i++) {
      const typedWord = typedWords[i];
      const currentExpectedWord = passageWords[passageIndex] || '';
      
      if (currentExpectedWord) {
        const matchScore = calculateWordSimilarity(typedWord, currentExpectedWord);
        
        if (matchScore > 0.6) {
          // Highlight completed word
          const wordElement = wordElements[passageIndex];
          if (wordElement) {
            const chars = wordElement.querySelectorAll('span');
            
            // PERFECT character highlighting for completed words with smart alignment
            let typedIndex = 0;
            let expectedIndex = 0;
            
            // Clear all highlights first
            chars.forEach(char => {
              char.classList.remove('correct-char', 'incorrect-char');
            });
            
            while (typedIndex < typedWord.length && expectedIndex < currentExpectedWord.length) {
              if (expectedIndex < chars.length) {
                if (typedWord[typedIndex] === currentExpectedWord[expectedIndex]) {
                  // Characters match - highlight green
                  chars[expectedIndex].classList.add('correct-char');
                  typedIndex++;
                  expectedIndex++;
                } else {
                  // Characters don't match - check for extra character
                  let extraCharFound = false;
                  let missingCharFound = false;
                  
                  // Check if next typed character matches current expected
                  if (typedIndex + 1 < typedWord.length && 
                      typedWord[typedIndex + 1] === currentExpectedWord[expectedIndex]) {
                    // Extra character detected - skip current typed character
                    extraCharFound = true;
                    typedIndex++;
                  }
                  // Check if current typed character matches next expected
                  else if (expectedIndex + 1 < currentExpectedWord.length && 
                           typedWord[typedIndex] === currentExpectedWord[expectedIndex + 1]) {
                    // Missing character detected
                    missingCharFound = true;
                    chars[expectedIndex].classList.add('incorrect-char');
                    expectedIndex++;
                  }
                  
                  if (!extraCharFound && !missingCharFound) {
                    // Simple mismatch
                    chars[expectedIndex].classList.add('incorrect-char');
                    typedIndex++;
                    expectedIndex++;
                  }
                }
              } else {
                break;
              }
            }
            
            // Highlight remaining expected characters as wrong
            while (expectedIndex < currentExpectedWord.length && expectedIndex < chars.length) {
              chars[expectedIndex].classList.add('incorrect-char');
              expectedIndex++;
            }
          }
          passageIndex++;
        }
      }
    }

    // REAL-TIME HIGHLIGHTING FOR CURRENT WORD
    const currentTypedWord = typedWords[typedWords.length - 1] || '';
    const currentExpectedWord = passageWords[passageIndex] || '';
    
    if (currentTypedWord && currentExpectedWord) {
      const wordElement = wordElements[passageIndex];
      if (wordElement) {
        const chars = wordElement.querySelectorAll('span');
        
        // Clear highlights
        chars.forEach(char => {
          char.classList.remove('correct-char', 'incorrect-char');
        });
        
        // Real-time character highlighting
        let typedIndex = 0;
        let expectedIndex = 0;
        
        while (typedIndex < currentTypedWord.length && expectedIndex < currentExpectedWord.length) {
          if (expectedIndex < chars.length) {
            if (currentTypedWord[typedIndex] === currentExpectedWord[expectedIndex]) {
              // Characters match - highlight green
              chars[expectedIndex].classList.add('correct-char');
              typedIndex++;
              expectedIndex++;
            } else {
              // Characters don't match - check for extra character
              let extraCharFound = false;
              let missingCharFound = false;
              
              // Check if next typed character matches current expected
              if (typedIndex + 1 < currentTypedWord.length && 
                  currentTypedWord[typedIndex + 1] === currentExpectedWord[expectedIndex]) {
                // Extra character detected - skip current typed character
                extraCharFound = true;
                typedIndex++;
              }
              // Check if current typed character matches next expected
              else if (expectedIndex + 1 < currentExpectedWord.length && 
                       currentTypedWord[typedIndex] === currentExpectedWord[expectedIndex + 1]) {
                // Missing character detected
                missingCharFound = true;
                chars[expectedIndex].classList.add('incorrect-char');
                expectedIndex++;
              }
              
              if (!extraCharFound && !missingCharFound) {
                // Simple mismatch
                chars[expectedIndex].classList.add('incorrect-char');
                typedIndex++;
                expectedIndex++;
              }
            }
          } else {
            break;
          }
        }
        
        // Highlight remaining expected characters as wrong
        while (expectedIndex < currentExpectedWord.length && expectedIndex < chars.length) {
          chars[expectedIndex].classList.add('incorrect-char');
          expectedIndex++;
        }
      }
    }
  }, [wordElements, passageWords, examMode]);





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
    setIdleTime(0);
    setLastKeypressTime(Date.now());
  }, [displayPassage, updateWordHighlight, selectedDuration, stopBackgroundProcessing]);

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
    
    // Character and word counting
    const counters = {
      correctChars: 0,
      totalChars: 0,
      normalMistakes: 0,
      punctuationMistakes: 0,
      correctWords: 0,
      incorrectWords: 0
    };
    
    const typedWords = newText.trim().split(/\s+/).filter(word => word.length > 0);
    const passageWordsArray = passageText.trim().split(/\s+/);
    
    let totalCorrectChars = 0;
    let totalMistakes = 0;
    let totalExpectedChars = 0;
    
    let passageIndex = 0;
    
    for (let i = 0; i < typedWords.length; i++) {
      const typedWord = typedWords[i];
      
      const currentExpectedWord = passageWordsArray[passageIndex];
      let bestMatchIndex = -1;
      let bestMatchScore = 0;
      
      if (currentExpectedWord) {
        const matchScore = calculateWordSimilarity(typedWord, currentExpectedWord);
        
        if (matchScore > 0.6) {
          bestMatchIndex = passageIndex;
          bestMatchScore = matchScore;
        }
      }
      
      if (bestMatchIndex >= 0 && bestMatchScore > 0.6) {
        const expectedWord = passageWordsArray[bestMatchIndex];
        passageIndex = bestMatchIndex + 1;
        
        // Smart character comparison
        let typedIndex = 0;
        let expectedIndex = 0;
        let wordCorrectChars = 0;
        let wordMistakes = 0;
        
        while (typedIndex < typedWord.length && expectedIndex < expectedWord.length) {
          if (typedWord[typedIndex] === expectedWord[expectedIndex]) {
            // Characters match
            wordCorrectChars++;
            typedIndex++;
            expectedIndex++;
          } else {
            // Characters don't match - check for extra character
            let extraCharFound = false;
            let missingCharFound = false;
            
            // Check if next typed character matches current expected
            if (typedIndex + 1 < typedWord.length && 
                typedWord[typedIndex + 1] === expectedWord[expectedIndex]) {
              // Extra character detected - skip current typed character
              extraCharFound = true;
              wordMistakes++; // Count extra character as mistake
              typedIndex++;
            }
            // Check if current typed character matches next expected
            else if (expectedIndex + 1 < expectedWord.length && 
                     typedWord[typedIndex] === expectedWord[expectedIndex + 1]) {
              // Missing character detected
              missingCharFound = true;
              wordMistakes++; // Count missing character as mistake
              expectedIndex++;
            }
            
            if (!extraCharFound && !missingCharFound) {
              // Simple mismatch
              wordMistakes++;
              typedIndex++;
              expectedIndex++;
            }
          }
        }
        
        // Count remaining extra characters as mistakes
        while (typedIndex < typedWord.length) {
          wordMistakes++;
          typedIndex++;
        }
        
        // Count remaining missing characters as mistakes
        while (expectedIndex < expectedWord.length) {
          wordMistakes++;
          expectedIndex++;
        }
        
        totalCorrectChars += wordCorrectChars;
        totalMistakes += wordMistakes;
        totalExpectedChars += expectedWord.length;
        
        // IMPROVED WORD ACCURACY
        if (typedWord === expectedWord) {
          counters.correctWords++;
        } else {
          counters.incorrectWords++;
        }
        
        // IMPROVED MISTAKE CATEGORIZATION
        if (wordMistakes > 0) {
          // Check if mistakes are punctuation-related
          const punctuationMistakesInWord = Array.from(typedWord).filter(char => 
            isPunctuation(char) && !expectedWord.includes(char)
          ).length;
          
          counters.punctuationMistakes += punctuationMistakesInWord;
          counters.normalMistakes += (wordMistakes - punctuationMistakesInWord);
        }
      } else {
        // No good match found - count as extra word
        counters.normalMistakes += typedWord.length;
        counters.incorrectWords++;
        totalMistakes += typedWord.length;
        // Don't advance passageIndex - stay at current position
      }
    }
    
            counters.correctChars = totalCorrectChars;
        counters.totalChars = totalExpectedChars;
        
        const finalTotalWords = typedWords.length;
        
        // Update state variables
    setCorrectChars(counters.correctChars);
    setTotalChars(counters.totalChars);
    setMistakes(counters.normalMistakes);
    setPunctuationMistakes(counters.punctuationMistakes);
    setCorrectWordsCount(counters.correctWords);
    setIncorrectWordsCount(counters.incorrectWords);
    setTotalWords(finalTotalWords);
    
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
        
        // Real-time highlighting
        requestAnimationFrame(() => {
          updateRealTimeCharacterHighlight(newText);
          updateWordHighlight();
        });
  }, [isRunning, passageWords, updateWordHighlight, calculateTypingStats, startTime, backspaceCount, updateRealTimeCharacterHighlight]);



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
  }, [examMode, updateWordHighlight]);

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
