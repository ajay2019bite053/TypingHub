import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TypingEngine from '../components/common/TypingEngine';

interface LiveExam {
  _id: string;
  name: string;
  date: string;
  isLive: boolean;
  joinLink: string;
  passage: string;
  timeLimit: number;
}

const LiveExamTest: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [exam, setExam] = useState<LiveExam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExam = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/live-exams/${id}`);
        if (!res.ok) throw new Error('Exam not found');
        const data = await res.json();
        setExam(data);
        setError(null);
      } catch (err: any) {
        setError('Could not load exam');
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [id]);

  if (loading) return <div>Loading exam...</div>;
  if (error || !exam) return <div style={{ color: 'red' }}>{error || 'Exam not found'}</div>;

  const config = {
    testName: exam.name,
    timeLimit: exam.timeLimit * 60, // convert minutes to seconds
    passageCategory: '', // not used, we use customPassage
    qualificationCriteria: { minWpm: 25, minAccuracy: 85 },
    customPassage: exam.passage
  };

  return (
    <div className="typing-test-page">
      <TypingEngine config={config} />
    </div>
  );
};

export default LiveExamTest; 