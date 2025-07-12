import React from 'react';
import TypingEngine from '../components/common/TypingEngine';

const config = {
  testName: 'Allahabad High Court',
  timeLimit: 600,
  passageCategory: 'Allahabad High Court',
  qualificationCriteria: {
    minWpm: 25,
    minAccuracy: 85
  }
};

const AllahabadHighCourtTest = () => <TypingEngine config={config} />;

export default AllahabadHighCourtTest; 