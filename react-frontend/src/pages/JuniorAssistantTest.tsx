import React from 'react';
import TypingEngine from '../components/common/TypingEngine';

  const config = {
  testName: 'Junior Assistant',
  timeLimit: 600,
  passageCategory: 'Junior Assistant',
    qualificationCriteria: {
      minWpm: 25,
    minAccuracy: 85
    }
  };

const JuniorAssistantTest = () => <TypingEngine config={config} />;

export default JuniorAssistantTest; 
 