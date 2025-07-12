import React from 'react';
import TypingEngine from '../components/common/TypingEngine';

  const config = {
  testName: 'SSC CHSL',
  timeLimit: 600,
  passageCategory: 'SSC CHSL',
    qualificationCriteria: {
    minWpm: 25,
      minAccuracy: 85
    }
  };

const SSCCHSLTest = () => <TypingEngine config={config} />;

export default SSCCHSLTest; 