import React from 'react';
import TypingEngine from '../components/common/TypingEngine';

  const config = {
  testName: 'RRB NTPC',
  timeLimit: 600,
  passageCategory: 'RRB NTPC',
    qualificationCriteria: {
      minWpm: 25,
    minAccuracy: 85
    }
  };

const RRBNTPCTest = () => <TypingEngine config={config} />;

export default RRBNTPCTest; 