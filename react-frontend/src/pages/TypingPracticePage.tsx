import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import typingCourse from '../assets/typingCourse.json';

const TypingPracticePage: React.FC = () => {
  const { levelId, subLevelId } = useParams();
  const navigate = useNavigate();
  const subLevel = typingCourse.find(l => l.level === Number(subLevelId));

  if (!subLevel) {
    return <div style={{ padding: 32 }}>Level or sub-level not found.</div>;
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #0001', padding: 32 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>&larr; Back</button>
      <h2 style={{ marginBottom: 8 }}>{subLevel.title}</h2>
      {/* Replace below with your TypingEngine/TypingPractice component */}
      <div style={{ fontSize: 18, background: '#f8f8f8', padding: 24, borderRadius: 8, minHeight: 80, marginBottom: 32 }}>
        {subLevel.content}
      </div>
      {/* <TypingEngine config={{ customPassage: subLevel.content, ... }} /> */}
      {/* Add WPM, accuracy, timer, etc. here */}
    </div>
  );
};

export default TypingPracticePage; 