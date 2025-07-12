import React from 'react';
import TypingEngine from '../components/common/TypingEngine';

  const config = {
  testName: 'Junior Court Assistant',
  timeLimit: 600,
  passageCategory: 'Junior Court Assistant',
    qualificationCriteria: {
      minWpm: 25,
    minAccuracy: 85
    }
  };

const JuniorCourtAssistantTest = () => <TypingEngine config={config} />;

export default JuniorCourtAssistantTest; 
 