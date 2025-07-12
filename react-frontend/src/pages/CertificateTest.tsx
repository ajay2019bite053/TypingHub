import React from 'react';
import TypingEngine from '../components/common/TypingEngine';

const config = {
  testName: 'Certificate Test',
  timeLimit: 600,
  passageCategory: 'Certificate Test',
  qualificationCriteria: {
    minWpm: 25,
    minAccuracy: 85
  }
};

const CertificateTest = () => <TypingEngine config={config} />;

export default CertificateTest; 