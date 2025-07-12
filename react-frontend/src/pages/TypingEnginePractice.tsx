import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TypingEngine from '../components/common/TypingEngine';

const TypingEnginePractice: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const level = location.state?.level;

  if (!level) {
    return <div style={{ padding: 32 }}>No level data found.</div>;
  }

  const config = {
    testName: level.title,
    timeLimit: 300, // 5 min default
    passageCategory: 'Course',
    qualificationCriteria: { minWpm: 20, minAccuracy: 90 },
    customPassage: level.content,
  };

  // Back button to be rendered inside TypingEngine's control row
  const backButton = (
    <button
      onClick={() => navigate(-1)}
      style={{ marginLeft: 16, padding: '10px 24px', borderRadius: 8, background: '#eee', border: 'none', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
    >
      &larr; Back
    </button>
  );

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, background: '#fff' }}>
      <TypingEngine config={config} backButton={backButton} hideFeedbackModal={true} />
    </div>
  );
};

export default TypingEnginePractice; 