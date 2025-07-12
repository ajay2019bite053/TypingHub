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
      link: '/ssc-cgl-test',
      category: 'SSC'
    },
    {
      id: 'ssc-chsl',
      icon: 'fas fa-graduation-cap',
      title: 'SSC-CHSL Typing Test',
      description: 'Prepare for SSC-CHSL with real exam passages and speed goals.',
      link: '/ssc-chsl-test',
      category: 'SSC'
    },
    {
      id: 'rrb-ntpc',
      icon: 'fas fa-train',
      title: 'RRB-NTPC Typing Test',
      description: 'Master RRB-NTPC typing with Hindi and English passages.',
      link: '/rrb-ntpc-test',
      category: 'Railway'
    },
    {
      id: 'junior-assistant',
      icon: 'fas fa-briefcase',
      title: 'Junior Assistant Test',
      description: 'Excel in Junior Assistant typing with accurate practice.',
      link: '/junior-assistant-test',
      category: 'Government'
    },
    {
      id: 'superintendent',
      icon: 'fas fa-user-tie',
      title: 'Superintendent Test',
      description: 'Practice for Superintendent typing with exam-like conditions.',
      link: '/superintendent-test',
      category: 'Government'
    },
    {
      id: 'junior-court-assistant',
      icon: 'fas fa-gavel',
      title: 'Jr. Court Assistant Test',
      description: 'Master Junior Court Assistant typing with legal terms.',
      link: '/junior-court-assistant-test',
      category: 'Court'
    },
    {
      id: 'up-police',
      icon: 'fas fa-shield-alt',
      title: 'UP Police Typing Test',
      description: 'Practice for UP Police typing test with real exam patterns.',
      link: '/up-police-test',
      category: 'Police'
    },
    {
      id: 'bihar-police',
      icon: 'fas fa-shield-alt',
      title: 'Bihar Police Typing Test',
      description: 'Prepare for Bihar Police typing test with exam-like passages.',
      link: '/bihar-police-test',
      category: 'Police'
    },
    {
      id: 'aiims-crc',
      icon: 'fas fa-hospital',
      title: 'AIIMS CRC Typing Test',
      description: 'Practice for AIIMS CRC typing test with medical terminology.',
      link: '/aiims-crc-test',
      category: 'Medical'
    },
    {
      id: 'allahabad-high-court',
      icon: 'fas fa-balance-scale',
      title: 'Allahabad High Court Typing Test',
      description: 'Prepare for Allahabad High Court typing test with legal passages.',
      link: '/allahabad-high-court-test',
      category: 'Court'
    }
  ];

  const handleExamClick = (examId: string) => {
    const exam = examCards.find(card => card.id === examId);
    if (exam) {
      localStorage.setItem('lastExamType', exam.title);
      navigate(exam.link);
    }
  };

  const filterExams = (exam: any) => {
    return exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           exam.category.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const filteredExams = examCards.filter(filterExams);

  return (
    <div className="main-content">
      <div className="container">
        <div className="panel">
          {/* Header Section */}
          <div className="header-section">
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
          </div>

          {/* Search Section */}
          <div className="search-section">
            <div className="search-container">
              <div className="search-item">
                <input 
                  type="text" 
                  id="searchInput" 
                  placeholder="Search exams by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <div className="search-results">
                    <span>{filteredExams.length} exam{filteredExams.length !== 1 ? 's' : ''} found</span>
                  </div>
                )}
              </div>
              <div className="search-title">
                <h2>Available Typing Tests</h2>
                <p>Select an exam to start practicing</p>
              </div>
              </div>
            </div>

          {/* Exams Grid Section */}
          <div className="exams-section">
            <section className="panel-container">
              {filteredExams.length > 0 ? (
                filteredExams.map(exam => (
                <div 
                  key={exam.id} 
                  className="exam-card" 
                  data-exam={exam.id}
                  onClick={() => handleExamClick(exam.id)}
                  style={{ cursor: 'pointer' }}
                >
                    <div className="exam-icon">
                  <i className={exam.icon}></i>
                    </div>
                    <div className="exam-content">
                  <h5>{exam.title}</h5>
                  <p>{exam.description}</p>
                      <span className="exam-category">{exam.category}</span>
                    </div>
                  <button 
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExamClick(exam.id);
                    }}
                  >
                      Start Test
                  </button>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <i className="fas fa-search"></i>
                  <h3>No exams found</h3>
                  <p>Try adjusting your search terms</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamWiseTest; 