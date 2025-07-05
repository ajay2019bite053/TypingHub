// Types
export interface CharacterHighlight {
  char: string;
  status: 'correct' | 'wrong';
}

// Normalize quotes (convert curly quotes to straight quotes)
export const normalizeQuotes = (text: string): string => {
  return text
    .replace(/[\u2018\u2019]/g, "'") // Replace curly single quotes with straight
    .replace(/[\u201C\u201D]/g, '"'); // Replace curly double quotes with straight
};

// Sanitize input for HTML display while preserving characters for comparison
export const sanitizeInput = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

// Format time (mm:ss)
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Debounce function
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Check if a character is punctuation
export const isPunctuation = (char: string): boolean => {
  const punctuation = /[.,!?;:'"()/]/;
  return punctuation.test(char);
};

// Intelligent character comparison
export const getCharacterHighlights = (
  expected: string,
  typed: string
): CharacterHighlight[] => {
  const normalizedExpected = normalizeQuotes(expected);
  const normalizedTyped = normalizeQuotes(typed);
  const result: CharacterHighlight[] = [];
  let typedIndex = 0;

  for (let i = 0; i < normalizedExpected.length; i++) {
    if (typedIndex < normalizedTyped.length) {
      if (normalizedExpected[i] === normalizedTyped[typedIndex]) {
        result.push({ char: normalizedExpected[i], status: 'correct' });
        typedIndex++;
      } else {
        if (
          i + 1 < normalizedExpected.length &&
          typedIndex < normalizedTyped.length &&
          normalizedExpected[i + 1] === normalizedTyped[typedIndex]
        ) {
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

// Calculate results
export const calculateTestResults = (
  typedText: string,
  expectedText: string,
  elapsedTimeSeconds: number
): {
  grossSpeed: number;
  netSpeed: number;
  accuracy: number;
  mistakes: number;
  totalWords: number;
  correctWords: number;
  incorrectWords: number;
} => {
  const elapsedTimeMinutes = Math.max(elapsedTimeSeconds / 60, 0.0167);
  const normalizedTyped = normalizeQuotes(typedText);
  const normalizedExpected = normalizeQuotes(expectedText);

  let totalChars = normalizedTyped.length;
  let correctChars = 0;
  let punctuationMistakes = 0;

  // Calculate correct characters and mistakes
  for (let i = 0; i < normalizedTyped.length; i++) {
    if (i < normalizedExpected.length) {
      if (normalizedTyped[i] === normalizedExpected[i]) {
        correctChars++;
      } else {
        if (
          isPunctuation(normalizedExpected[i]) ||
          isPunctuation(normalizedTyped[i])
        ) {
          punctuationMistakes++;
        }
      }
    } else {
      if (isPunctuation(normalizedTyped[i])) {
        punctuationMistakes++;
      }
    }
  }

  for (let i = normalizedTyped.length; i < normalizedExpected.length; i++) {
    if (isPunctuation(normalizedExpected[i])) {
      punctuationMistakes++;
    }
  }

  // Total mistakes: non-punctuation errors are full mistakes, punctuation errors are half
  const nonPunctuationMistakes = totalChars - correctChars - punctuationMistakes;
  const mistakes = nonPunctuationMistakes + punctuationMistakes * 0.5;

  const grossWords = totalChars / 5;
  const grossWpm = grossWords / elapsedTimeMinutes;

  const netWords = correctChars / 5;
  const netWpm = netWords / elapsedTimeMinutes;

  const accuracyPercent =
    totalChars > 0 ? Math.min(100, (correctChars / totalChars) * 100) : 0;

  // Calculate word-level statistics
  const typedWords = normalizedTyped.trim().split(/\s+/);
  const expectedWords = normalizedExpected.trim().split(/\s+/);
  let correctWordsCount = 0;
  let incorrectWordsCount = 0;

  typedWords.forEach((word, index) => {
    if (index < expectedWords.length) {
      if (word === expectedWords[index]) {
        correctWordsCount++;
      } else {
        incorrectWordsCount++;
      }
    } else {
      incorrectWordsCount++;
    }
  });

  return {
    grossSpeed: Math.round(grossWpm),
    netSpeed: Math.round(netWpm),
    accuracy: Math.round(accuracyPercent),
    mistakes: parseFloat(mistakes.toFixed(1)),
    totalWords: typedWords.length,
    correctWords: correctWordsCount,
    incorrectWords: incorrectWordsCount,
  };
};

// Generate feedback based on results
export const generateTestFeedback = (
  grossWpm: number,
  netWpm: number,
  accuracyPercent: number
): string => {
  let feedback = '';

  // Prioritize accuracy feedback
  if (accuracyPercent < 70) {
    feedback += 'Pehle accuracy par focus karo, phir speed apne aap badhegi.';
  } else if (accuracyPercent < 90) {
    feedback += 'Achhi accuracy hai, thodi aur improve karo!';
  } else {
    feedback += 'Accuracy toh shandaar hai! Ab speed par dhyan do.';
  }

  // Speed feedback if accuracy is decent
  if (accuracyPercent >= 70) {
    if (grossWpm === 0) {
      feedback += ' Typing start karo—practice se hi progress hogi!';
    } else if (grossWpm <= 19) {
      feedback += ' Shuruaat ho chuki hai, ab roz thoda practice karo!';
    } else if (grossWpm <= 29) {
      feedback +=
        ' Achhi progress hai, lekin 35 WPM tak pahunchne ke liye lagataar typing karo!';
    } else if (grossWpm <= 34) {
      feedback += ' Bas thoda aur push karo, 35 WPM bilkul paas hai!';
    } else if (grossWpm <= 44) {
      feedback += ' Great job! Aapki typing speed government standards ke kareeb hai!';
    } else if (grossWpm <= 59) {
      feedback += ' Bahut badhiya! Aap pro level ke kareeb ho!';
    } else {
      feedback += ' Excellent speed! Aap typing master banne wale ho!';
    }

    if (netWpm < grossWpm * 0.8) {
      feedback += ' Lekin thoda consistency laao, net speed aur badh sakti hai!';
    }
  }

  // Append accuracy threshold warning if below 80%
  if (accuracyPercent < 80) {
    feedback +=
      ' *Accuracy below 80%! You need to improve to qualify for SSC CGL,RRB-NTPC*.';
  }

  return feedback;
}; 