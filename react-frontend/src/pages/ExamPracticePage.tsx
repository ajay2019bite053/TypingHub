import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import typingCourse from '../assets/typingCourse.json';
import TypingEngine from '../components/common/TypingEngine';

const ExamPracticePage: React.FC = () => {
  const { mockId } = useParams();
  const navigate = useNavigate();
  const mock = typingCourse.find(l => l.level === Number(mockId));

  if (!mock) {
    return <div style={{ padding: 32 }}>Mock test not found.</div>;
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #0001', padding: 32 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>&larr; Back</button>
      <h2 style={{ marginBottom: 8 }}>{mock.title}</h2>
      <h3 style={{ marginBottom: 24, color: '#666' }}>{mock.title}</h3>
      <TypingEngine
        config={{
          testName: mock.title,
          timeLimit: 600,
          passageCategory: 'Exam',
          qualificationCriteria: { minWpm: 20, minAccuracy: 90 },
          customPassage: mock.content
        }}
      />
    </div>
  );
};

export default ExamPracticePage; 