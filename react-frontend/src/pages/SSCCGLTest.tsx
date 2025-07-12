import React from 'react';
import TypingEngine from '../components/common/TypingEngine';

const config = {
  testName: 'SSC CGL',
  timeLimit: 600,
  passageCategory: 'SSC CGL',
  qualificationCriteria: {
    minWpm: 25,
    minAccuracy: 85
  }
};

const SSCCGLTest = () => <TypingEngine config={config} />;

export default SSCCGLTest; 