import React from 'react';
import TypingEngine from '../components/common/TypingEngine';

  const config = {
  testName: 'Superintendent',
  timeLimit: 600,
  passageCategory: 'Superintendent',
    qualificationCriteria: {
    minWpm: 25,
      minAccuracy: 85
    }
  };

const SuperintendentTest = () => <TypingEngine config={config} />;

export default SuperintendentTest; 
 