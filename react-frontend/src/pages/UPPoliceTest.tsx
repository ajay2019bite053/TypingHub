import React from 'react';
import TypingEngine from '../components/common/TypingEngine';

const config = {
  testName: 'UP Police',
  timeLimit: 600,
  passageCategory: 'UP Police',
  qualificationCriteria: {
    minWpm: 25,
    minAccuracy: 85
  }
};

const UPPoliceTest = () => <TypingEngine config={config} />;

export default UPPoliceTest; 