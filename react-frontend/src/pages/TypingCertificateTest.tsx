import React from 'react';
import TypingEngine from '../components/common/TypingEngine';

const TypingCertificateTest = () => {
  const config = {
    testName: "Typing Certificate Test",
    timeLimit: 600, // 10 minutes for certificate test
    passageCategory: "Certificate Test",
    qualificationCriteria: {
      minWpm: 20,
      minAccuracy: 75
    }
  };

  return <TypingEngine config={config} />;
};

export default TypingCertificateTest; 