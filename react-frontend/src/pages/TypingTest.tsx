import React, { useEffect, useRef, useState } from 'react';
import TypingEngine from '../components/common/TypingEngine';
import './TypingTest.css';

  const config = {
    testName: "Typing Test",
    timeLimit: 600, // 10 minutes
  passageCategory: "Typing Test", // Use space, not underscore
    qualificationCriteria: {
      minWpm: 25,
      minAccuracy: 85
    }
  };

const formatNumber = (num: number) => num.toLocaleString();

const LiveLeaderboard: React.FC = () => {
  // Animated user count (simulate real-time)
  const [userCount, setUserCount] = useState(3200);
  const [topWpm, setTopWpm] = useState(52); // Start in 40-60 range
  const [topExam, setTopExam] = useState('SSC CGL');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Animate user count up/down for FOMO effect
    intervalRef.current = setInterval(() => {
      setUserCount((prev) => {
        let change = Math.floor(Math.random() * 8 - 3); // -3 to +4
        let next = prev + change;
        if (next < 3100) next = 3100;
        if (next > 3400) next = 3400;
        return next;
      });
      setTopWpm((prev) => {
        let change = Math.floor(Math.random() * 3 - 1); // -1 to +1
        let next = prev + change;
        if (next < 40) next = 40;
        if (next > 60) next = 60;
        return next;
      });
    }, 1800);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="live-leaderboard-feed">
      <div className="live-activity">
        <span className="live-dot" />
        <span className="live-users">Live: <b>{formatNumber(userCount)}</b> users typing right now</span>
        <span className="divider">|</span>
        <span className="top-scorer">Top scorer today: <b>{topWpm} WPM</b></span>
      </div>
    </div>
  );
};

// --- Personalized Exam Path Recommendation Quiz ---
const questions = [
  {
    q: 'Which exam are you targeting?',
    options: ['SSC', 'Railway', 'Court', 'Other'],
  },
  {
    q: 'What is your current typing speed (WPM)?',
    options: ['Below 20', '20-30', '30-40', 'Above 40'],
  },
  {
    q: 'What is your main goal?',
    options: ['Practice for exam', 'Get certificate', 'Improve speed', 'Just explore'],
  },
];

const getRecommendation = (answers: string[]) => {
  // Simple placeholder logic
  if (answers[0] === 'SSC') return { test: 'SSC CGL Mock Test' };
  if (answers[0] === 'Railway') return { test: 'RRB NTPC Mock Test' };
  if (answers[0] === 'Court') return { test: 'Court Assistant Mock Test' };
  if (answers[2] === 'Get certificate') return { test: 'Typing Certificate Test' };
  return { test: 'Typing Practice Test' };
};

const PathRecommendation: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleStart = () => {
    setStarted(true);
    setStep(0);
    setAnswers([]);
    setShowResult(false);
  };

  const handleOption = (option: string) => {
    const nextAnswers = [...answers, option];
    setAnswers(nextAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setStarted(false);
    setStep(0);
    setAnswers([]);
    setShowResult(false);
  };

  const rec = showResult ? getRecommendation(answers) : null;

  return (
    <div className="path-recommendation-quiz">
      {!started && (
        <div className="rec-card">
          <div className="rec-title">Not sure which test to take?</div>
          <div className="rec-desc">Answer 3 quick questions and get your perfect mock test plan!</div>
          <button className="rec-btn" onClick={handleStart}>Find My Test</button>
        </div>
      )}
      {started && !showResult && (
        <div className="rec-quiz-card">
          <div className="rec-q">Q{step + 1}. {questions[step].q}</div>
          <div className="rec-options">
            {questions[step].options.map((opt) => (
              <button key={opt} className="rec-option-btn" onClick={() => handleOption(opt)}>{opt}</button>
            ))}
          </div>
          <div className="rec-progress">{step + 1} / {questions.length}</div>
        </div>
      )}
      {showResult && rec && (
        <div className="rec-result-card">
          <div className="rec-result-title">Recommended Test:</div>
          <div className="rec-result-test">{rec.test}</div>
          <button className="rec-btn" onClick={handleRestart}>Try Again</button>
        </div>
      )}
    </div>
  );
};

// --- Support Widget ---
const SUPPORT_LINKS = {
  whatsapp: 'https://wa.me/919999999999', // Replace with your real number
  telegram: 'https://t.me/your_support_channel', // Replace with your real channel
};

const SupportWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="support-widget-btn"
        aria-label="Chat support"
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#25D366"/><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.967-.94 1.166-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.205 5.077 4.372.71.306 1.263.489 1.695.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.007-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#fff"/></svg>
      </button>
      {open && (
        <div className="support-widget-popup">
          <div className="support-title">Need help? Chat with us instantly!</div>
          <div className="support-links">
            <a href={SUPPORT_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="support-link whatsapp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#25D366"/><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.967-.94 1.166-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.205 5.077 4.372.71.306 1.263.489 1.695.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.007-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#fff"/></svg>
              WhatsApp
            </a>
            <a href={SUPPORT_LINKS.telegram} target="_blank" rel="noopener noreferrer" className="support-link telegram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#229ED9"/><path d="M17.5 7.5L6.5 12.5L10 13.5L11.5 17.5L13.5 14.5L17.5 7.5Z" fill="#fff"/></svg>
              Telegram
            </a>
          </div>
        </div>
      )}
    </>
  );
};

const TypingTest = () => (
  <div className="typing-test-page">
    <TypingEngine config={config} />
    <LiveLeaderboard />
    <PathRecommendation />
    <SupportWidget />
  </div>
);

export default TypingTest; 