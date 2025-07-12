import React from 'react';
import TypingEngine from '../components/common/TypingEngine';

const config = {
  testName: 'Bihar Police',
  timeLimit: 600,
  passageCategory: 'Bihar Police',
  qualificationCriteria: {
    minWpm: 25,
    minAccuracy: 85
  }
};

const BiharPoliceTest = () => <TypingEngine config={config} />;

export default BiharPoliceTest; 