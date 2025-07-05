import React, { createContext, useContext, useState, useCallback } from 'react';
import { Passage } from '../types/Passage';

interface TypingStats {
  grossSpeed: number;
  netSpeed: number;
  accuracy: number;
  mistakes: number;
  totalWords: number;
  correctWords: number;
  incorrectWords: number;
}

interface TypingContextType {
  passages: Passage[];
  setPassages: React.Dispatch<React.SetStateAction<Passage[]>>;
  selectedPassage: number;
  setSelectedPassage: React.Dispatch<React.SetStateAction<number>>;
  typingStats: TypingStats;
  updateTypingStats: (stats: Partial<TypingStats>) => void;
  resetTypingStats: () => void;
  examMode: 'Paper Typing' | 'Screen Typing';
  setExamMode: React.Dispatch<React.SetStateAction<'Paper Typing' | 'Screen Typing'>>;
}

const TypingContext = createContext<TypingContextType | undefined>(undefined);

export const TypingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [passages, setPassages] = useState<Passage[]>([]);
  const [selectedPassage, setSelectedPassage] = useState(0);
  const [examMode, setExamMode] = useState<'Paper Typing' | 'Screen Typing'>('Paper Typing');
  const [typingStats, setTypingStats] = useState<TypingStats>({
    grossSpeed: 0,
    netSpeed: 0,
    accuracy: 0,
    mistakes: 0,
    totalWords: 0,
    correctWords: 0,
    incorrectWords: 0
  });

  const updateTypingStats = useCallback((stats: Partial<TypingStats>) => {
    setTypingStats(prev => ({ ...prev, ...stats }));
  }, []);

  const resetTypingStats = useCallback(() => {
    setTypingStats({
      grossSpeed: 0,
      netSpeed: 0,
      accuracy: 0,
      mistakes: 0,
      totalWords: 0,
      correctWords: 0,
      incorrectWords: 0
    });
  }, []);

  return (
    <TypingContext.Provider
      value={{
        passages,
        setPassages,
        selectedPassage,
        setSelectedPassage,
        typingStats,
        updateTypingStats,
        resetTypingStats,
        examMode,
        setExamMode
      }}
    >
      {children}
    </TypingContext.Provider>
  );
};

export const useTyping = () => {
  const context = useContext(TypingContext);
  if (context === undefined) {
    throw new Error('useTyping must be used within a TypingProvider');
  }
  return context;
}; 