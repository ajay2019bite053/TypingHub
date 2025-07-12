import React from 'react';
import TypingEngine from '../components/common/TypingEngine';

const config = {
  testName: 'AIIMS CRC',
  timeLimit: 600,
  passageCategory: 'AIIMS CRC',
  qualificationCriteria: {
    minWpm: 25,
    minAccuracy: 85
  }
};

const AIIMSCRCTest = () => <TypingEngine config={config} />;

export default AIIMSCRCTest; 