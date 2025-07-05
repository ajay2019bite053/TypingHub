import { CharacterHighlight } from '../types/Passage';

export const normalizeQuotes = (text: string): string => {
  return text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"');
};

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

export const isPunctuation = (char: string): boolean => {
  return /[.,!?;:'"()/]/.test(char);
};

export const sanitizeInput = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const calculateWordsPerLine = (
  passageWords: string[],
  sampleTextContainerRef: React.RefObject<HTMLDivElement | null>,
  sampleTextRef: React.RefObject<HTMLDivElement | null>,
  setWordsPerLine: (count: number) => void
): void => {
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