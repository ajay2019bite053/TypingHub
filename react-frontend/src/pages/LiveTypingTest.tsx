import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faTelegram, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

interface LiveExam {
  _id: string;
  name: string;
  date: string;
  isLive: boolean;
  joinLink: string;
  timeLimit: number;
  startTime?: string;
  endTime?: string;
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
              ) : exams.map((exam) => {
                const now = new Date();
                const currentMinutes = now.getHours() * 60 + now.getMinutes();
                let showJoin = true;
                let liveTiming = '';
                if (exam.startTime && exam.endTime) {
                  liveTiming = `${formatTime(exam.startTime)} - ${formatTime(exam.endTime)}`;
                  const [startH, startM] = exam.startTime.split(':').map(Number);
                  const [endH, endM] = exam.endTime.split(':').map(Number);
                  const startMinutes = startH * 60 + startM;
                  const endMinutes = endH * 60 + endM;
                  showJoin = currentMinutes >= startMinutes && currentMinutes <= endMinutes;
                } else {
                  liveTiming = 'N/A';
                }
                return (
                  <div key={exam._id} className="exam-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderRadius: 8, padding: '10px 14px', boxShadow: '0 1px 6px rgba(25,118,210,0.04)', fontSize: 14 }}>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 600, color: '#1976d2', fontSize: 14 }}>{exam.name}</div>
                      <div style={{ fontSize: 13, color: '#1a2a44', marginTop: 2 }}>Official Exam Date: <b>{new Date(exam.date).toLocaleDateString()}</b></div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', minWidth: 260, gap: 14, justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: 13, color: '#d6001c', fontWeight: 600, whiteSpace: 'nowrap' }}>Live Timing: <b>{liveTiming}</b></span>
                      <div style={{ width: 20 }}></div> {/* Gap between Live Timing and Join button */}
                      {showJoin ? (
                        <a 
                          href={`/live-exam/${exam._id}`}
                          className="join-live-btn" 
                          style={{ 
                            background: '#d6001c', 
                            color: '#fff', 
                            borderRadius: 6, 
                            padding: '7px 14px', 
                            fontWeight: 600, 
                            textDecoration: 'none', 
                            fontSize: 13, 
                            boxShadow: '0 2px 8px #d6001c22', 
                            transition: 'background 0.2s', 
                            marginTop: 0,
                            display: 'inline-block'
                          }}
                        >
                          Start Typing Test
                        </a>
                      ) : (
                        <span style={{ color: '#888', fontWeight: 600, fontSize: 13, marginTop: 0 }}>Test Closed</span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
          )}
          {/* Restore join for more updates text above the social icons */}
          <div className="exam-info-join" style={{ fontSize: 13, color: '#1a2a44', margin: '18px 0 6px 0', fontWeight: 500, textAlign: 'center' }}>Join for more updates:</div>
          <div className="exam-info-social-row" style={{ display: 'flex', flexDirection: 'row', gap: 18, justifyContent: 'center', margin: '0 0 6px 0' }}>
            <a href="https://whatsapp.com/channel/0029VbB5BgZIHphQNvybGU3V/?hl=en" target="_blank" rel="noopener noreferrer" title="WhatsApp" style={{ color: '#25D366', fontSize: 26 }}><FontAwesomeIcon icon={faWhatsapp} /></a>
            <a href="https://t.me/TypingHubOfficial" target="_blank" rel="noopener noreferrer" title="Telegram" style={{ color: '#229ED9', fontSize: 26 }}><FontAwesomeIcon icon={faTelegram} /></a>
            <a href="https://www.instagram.com/typinghub.in/?hl=en" target="_blank" rel="noopener noreferrer" title="Instagram" style={{ color: '#E1306C', fontSize: 26 }}><FontAwesomeIcon icon={faInstagram} /></a>
            <a href="https://x.com/typinghub?t=iMSzEgwq3aHVyKXyYtZ6NA&s=09" target="_blank" rel="noopener noreferrer" title="Twitter" style={{ color: '#1DA1F2', fontSize: 26 }}><FontAwesomeIcon icon={faTwitter} /></a>
            <a href="https://www.youtube.com/@TypingHub-TypingPracticeforSSC" target="_blank" rel="noopener noreferrer" title="YouTube" style={{ color: '#FF0000', fontSize: 26 }}><FontAwesomeIcon icon={faYoutube} /></a>
            <a href="/community" title="Community" style={{ color: '#1976d2', fontSize: 26, display: 'flex', alignItems: 'center' }} rel="noopener noreferrer"><FontAwesomeIcon icon={faUsers} /></a>
          </div>
        </div>
      </div>
    </>
  );
};

// Helper to format 'HH:mm' to 'h:mm AM/PM'
function formatTime(time: string) {
  if (!time) return '';
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  const minute = parseInt(m, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

export default LiveTypingTest; 