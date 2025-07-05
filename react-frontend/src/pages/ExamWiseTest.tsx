import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExamWiseTest.css';

const ExamWiseTest: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const examCards = [
    {
      id: 'ssc-cgl',
      icon: 'fas fa-graduation-cap',
      title: 'SSC-CGL Typing Test',
      description: 'Practice for SSC-CGL with 2000 key depressions in 15 minutes.',
      link: '/ssc-cgl-test'
    },
    {
      id: 'ssc-chsl',
      icon: 'fas fa-graduation-cap',
      title: 'SSC-CHSL Typing Test',
      description: 'Prepare for SSC-CHSL with real exam passages and speed goals.',
      link: '/ssc-chsl-test'
    },
    {
      id: 'rrb-ntpc',
      icon: 'fas fa-train',
      title: 'RRB-NTPC Typing Test',
      description: 'Master RRB-NTPC typing with Hindi and English passages.',
      link: '/rrb-ntpc-test'
    },
    {
      id: 'junior-assistant',
      icon: 'fas fa-briefcase',
      title: 'Junior Assistant Test',
      description: 'Excel in Junior Assistant typing with accurate practice.',
      link: '/junior-assistant-test'
    },
    {
      id: 'superintendent',
      icon: 'fas fa-user-tie',
      title: 'Superintendent Test',
      description: 'Practice for Superintendent typing with exam-like conditions.',
      link: '/superintendent-test'
    },
    {
      id: 'junior-court-assistant',
      icon: 'fas fa-gavel',
      title: 'Jr. Court Assistant Test',
      description: 'Master Junior Court Assistant typing with legal terms.',
      link: '/junior-court-assistant-test'
    }
  ];

  const handleExamClick = (examId: string) => {
    const exam = examCards.find(card => card.id === examId);
    if (exam) {
      // Store exam type in localStorage
      localStorage.setItem('lastExamType', exam.title);
      // Navigate to the test page
      navigate(exam.link);
    }
  };

  const filterExams = (exam: any) => {
    return exam.title.toLowerCase().includes(searchTerm.toLowerCase());
  };

  return (
    <div className="main-content">
      <div className="container">
        <div className="panel">
          <div id="exam-wise-test-page" className="active">
            <div className="card">
              <div className="instructions">
                <p>
                  <strong>Real Exam Simulation</strong>: Experience timed tests (10-15 minutes) that mirror the structure and difficulty of SSC, Railway, and Supreme Court typing exams, such as 2000 key depressions for SSC-CGL/CHSL or specific WPM requirements for Junior Court Assistant.<br />
                  <strong>Previous Year Passages</strong>: Practice with carefully curated passages based on past SSC, Railway, and Supreme Court exams, including terms like "recruitment," "railway operations," "court proceedings," and symbols like @#$%, to build familiarity.<br />
                  <strong>Instant Feedback</strong>: Get real-time stats on your typing speed (WPM), accuracy, and correct words, allowing you to track progress and focus on improvement.<br />
                  <strong>Score High with Confidence</strong>: Regular practice with our tests will boost your typing proficiency, helping you achieve the high scores needed to clear these competitive exams.<br />
                  Start practicing today and take a step closer to acing your typing test in the actual exam!
                </p>
              </div>

              <div className="logo-container">
                <div className="logo-item">
                  <img src="/images/SSC.png" className="logo-ssc" alt="SSC Logo" />
                  <span className="logo-label">SSC</span>
                </div>
                <div className="logo-item">
                  <img src="/images/RAILWAY.png" className="logo-railway" alt="Railway Logo" />
                  <span className="logo-label">RAILWAY</span>
                </div>
                <div className="logo-item">
                  <img src="/images/Cbse.png" className="logo-cbse" alt="CBSE Logo" />
                  <span className="logo-label">CBSE</span>
                </div>
                <div className="logo-item">
                  <img src="/images/court.png" className="logo-court" alt="Supreme Court Logo" />
                  <span className="logo-label">SUPREME COURT</span>
                </div>
              </div>
              <div className="search-item">
                <input 
                  type="text" 
                  id="searchInput" 
                  placeholder="Search exams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <section className="panel-container">
              {examCards.filter(filterExams).map(exam => (
                <div 
                  key={exam.id} 
                  className="exam-card" 
                  data-exam={exam.id}
                  onClick={() => handleExamClick(exam.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className={exam.icon}></i>
                  <h5>{exam.title}</h5>
                  <p>{exam.description}</p>
                  <button 
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExamClick(exam.id);
                    }}
                  >
                    Take {exam.title.split(' ')[0]} Test
                  </button>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamWiseTest; 