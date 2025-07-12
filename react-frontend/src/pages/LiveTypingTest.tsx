import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface LiveExam {
  _id: string;
  name: string;
  date: string;
  isLive: boolean;
  joinLink: string;
}

const LiveTypingTest: React.FC = () => {
  const [exams, setExams] = useState<LiveExam[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/live-exams');
        setExams(res.data.filter((exam: LiveExam) => exam.isLive));
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  return (
    <>
      <div className="live-typing-test-notification" style={{
        background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
        color: '#fff',
        padding: '18px 0',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 600,
        letterSpacing: 0.2,
        boxShadow: '0 2px 12px rgba(25,118,210,0.10)',
        borderRadius: '0 0 16px 16px',
        marginBottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
      }}>
        <span style={{ fontSize: 20, verticalAlign: 'middle' }}>💻</span>
        <span>
          Welcome to <b>Live Typing Test</b>! Participate in real-time typing competitions, climb the live leaderboard, and join scheduled mock tests with fellow users. Sharpen your skills and compete for the top spot!
        </span>
      </div>
      <div className="live-typing-test-page" style={{ maxWidth: 900, margin: '0 auto', padding: 20, background: '#fff', borderRadius: '0 0 12px 12px', boxShadow: '0 2px 16px rgba(25,118,210,0.07)', fontSize: 15 }}>
        <div className="live-exam-info-card" style={{ marginBottom: 28, background: '#f8fafc', border: '1.5px solid #90caf9', borderRadius: 14, padding: 20, textAlign: 'center', fontSize: 15 }}>
          <div className="exam-info-title" style={{ fontSize: 18, fontWeight: 700, color: '#1976d2', marginBottom: 8 }}>Upcoming Exams</div>
          {loading ? <div>Loading...</div> : (
          <div className="exam-list" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
              {exams.length === 0 ? (
                <div style={{ color: '#888', fontSize: 15 }}>No live exams at the moment.</div>
              ) : exams.map((exam) => (
                <div key={exam._id} className="exam-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderRadius: 8, padding: '10px 14px', boxShadow: '0 1px 6px rgba(25,118,210,0.04)', fontSize: 14 }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, color: '#1976d2', fontSize: 14 }}>{exam.name}</div>
                    <div style={{ fontSize: 13, color: '#1a2a44', marginTop: 2 }}>Exam Date: <b>{new Date(exam.date).toLocaleDateString()}</b></div>
                </div>
                  <a href={`/live-exam/${exam._id}`} className="join-live-btn" style={{ background: '#d6001c', color: '#fff', borderRadius: 6, padding: '7px 14px', fontWeight: 600, textDecoration: 'none', fontSize: 13, boxShadow: '0 2px 8px #d6001c22', transition: 'background 0.2s' }}>Join Live Mock Test</a>
              </div>
            ))}
          </div>
          )}
          <div className="exam-info-join" style={{ fontSize: 13, color: '#1a2a44', margin: '18px 0 6px 0', fontWeight: 500 }}>Join for more updates:</div>
          <div className="exam-info-links" style={{ display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'center', marginBottom: 0 }}>
            <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="exam-info-link whatsapp" style={{ background: '#25D366', color: '#fff', borderRadius: 6, padding: '7px 12px', fontWeight: 600, textDecoration: 'none', fontSize: 13 }}>WhatsApp Group</a>
            <a href="https://t.me/your_support_channel" target="_blank" rel="noopener noreferrer" className="exam-info-link telegram" style={{ background: '#229ED9', color: '#fff', borderRadius: 6, padding: '7px 12px', fontWeight: 600, textDecoration: 'none', fontSize: 13 }}>Telegram Group</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveTypingTest; 