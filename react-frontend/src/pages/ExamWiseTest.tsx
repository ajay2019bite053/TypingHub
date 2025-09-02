import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

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
      category: 'SSC',
      requirements: {
        speed: '35 WPM (English), 30 WPM (Hindi)',
        duration: '15 minutes',
        keystrokes: '2000 key depressions',
        accuracy: '95%'
      }
    },
    {
      id: 'ssc-chsl',
      icon: 'fas fa-graduation-cap',
      title: 'SSC-CHSL Typing Test',
      description: 'Prepare for SSC-CHSL with real exam passages and speed goals.',
      link: '/ssc-chsl-test',
      category: 'SSC',
      requirements: {
        speed: '35 WPM (English), 30 WPM (Hindi)',
        duration: '15 minutes',
        keystrokes: '2000 key depressions',
        accuracy: '95%'
      }
    },
    {
      id: 'rrb-ntpc',
      icon: 'fas fa-train',
      title: 'RRB-NTPC Typing Test',
      description: 'Master RRB-NTPC typing with Hindi and English passages.',
      link: '/rrb-ntpc-test',
      category: 'Railway',
      requirements: {
        speed: '30 WPM',
        duration: '10 minutes',
        keystrokes: '1500 key depressions',
        accuracy: '90%'
      }
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

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Government Exam Typing Tests - SSC, RRB, NTPC",
    "description": "Free typing practice tests for SSC-CGL, SSC-CHSL, RRB-NTPC and other government exams. Practice in both Hindi and English with real exam patterns.",
    "provider": {
      "@type": "Organization",
      "name": "TypingHub",
      "url": "https://typinghub.in"
    },
    "offers": examCards.map(exam => ({
      "@type": "Offer",
      "name": exam.title,
      "description": exam.description,
      "category": exam.category,
      "url": `https://typinghub.in${exam.link}`,
      "price": "0",
      "priceCurrency": "INR"
    }))
  };

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



  // Preparation Tips Section Component
  const PreparationTipsSection = () => (
    <section className="preparation-tips-section">
      <div className="tips-container">
        <h2>Expert Preparation Tips</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-number">01</div>
            <h3>Start with Accuracy</h3>
            <p>Focus on typing accurately first. Speed will naturally improve as you develop muscle memory and confidence.</p>
          </div>
          <div className="tip-card">
            <div className="tip-number">02</div>
            <h3>Practice Daily</h3>
            <p>Consistent daily practice of 30-45 minutes is more effective than long, infrequent sessions.</p>
          </div>
          <div className="tip-card">
            <div className="tip-number">03</div>
            <h3>Use Proper Posture</h3>
            <p>Maintain correct sitting position with feet flat, back straight, and wrists elevated for better performance.</p>
          </div>
          <div className="tip-card">
            <div className="tip-number">04</div>
            <h3>Learn Keyboard Layout</h3>
            <p>Practice without looking at the keyboard. Learn the position of all keys for faster typing.</p>
          </div>
          <div className="tip-card">
            <div className="tip-number">05</div>
            <h3>Take Mock Tests</h3>
            <p>Regularly take full-length mock tests to simulate real exam conditions and build stamina.</p>
          </div>
          <div className="tip-card">
            <div className="tip-number">06</div>
            <h3>Review Your Mistakes</h3>
            <p>Analyze your errors and focus on improving weak areas. Track your progress over time.</p>
          </div>
        </div>
      </div>
    </section>
  );



  // FAQ Section Component
  const FAQSection = () => (
    <section className="faq-section">
      <div className="faq-container">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>How many typing tests should I practice daily?</h3>
            <p>We recommend 2-3 typing tests daily, each lasting 10-15 minutes. Focus on quality practice rather than quantity.</p>
          </div>
          <div className="faq-item">
            <h3>Which language should I practice more - Hindi or English?</h3>
            <p>Practice both languages equally. Most government exams require proficiency in both. Focus on your weaker language initially.</p>
          </div>
          <div className="faq-item">
            <h3>How long does it take to improve typing speed?</h3>
            <p>With consistent practice, you can see improvement in 2-3 weeks. Significant improvement (10+ WPM) typically takes 2-3 months.</p>
          </div>
          <div className="faq-item">
            <h3>Are these mock tests similar to real exams?</h3>
            <p>Yes, our tests are designed to match real exam patterns, difficulty levels, and time constraints used in government typing tests.</p>
          </div>
          <div className="faq-item">
            <h3>What if I make mistakes during practice?</h3>
            <p>Mistakes are part of learning. Focus on accuracy first, then speed. Use our detailed reports to identify and improve weak areas.</p>
          </div>
          <div className="faq-item">
            <h3>Can I practice on mobile devices?</h3>
            <p>While possible, we recommend using a computer or laptop for practice as government exams are conducted on computers.</p>
          </div>
        </div>
      </div>
    </section>
  );

  // Study Groups Section Component
  const StudyGroupsSection = () => (
    <section className="study-groups-section">
      <div className="groups-container">
        <h2>Join Our Study Groups</h2>
        <p>Connect with fellow aspirants, get exam updates, and share study tips in our active community groups</p>
        <div className="groups-grid">
          <div className="group-card whatsapp-group">
            <div className="group-icon">
              <i className="fab fa-whatsapp"></i>
            </div>
            <div className="group-content">
              <h3>WhatsApp Study Group</h3>
              <p>Join our active WhatsApp group for instant updates, daily practice reminders, and quick doubt solving</p>
              <ul className="group-features">
                <li><i className="fas fa-check"></i> Daily exam updates</li>
                <li><i className="fas fa-check"></i> Practice material sharing</li>
                <li><i className="fas fa-check"></i> Expert guidance</li>
                <li><i className="fas fa-check"></i> Success stories</li>
              </ul>
              <a 
                href="https://wa.me/919999999999?text=Hi! I want to join the TypingHub study group for government exam preparation" 
                target="_blank" 
                rel="noopener noreferrer"
                className="join-btn whatsapp-btn"
              >
                <i className="fab fa-whatsapp"></i>
                Join WhatsApp Group
              </a>
            </div>
          </div>
          
          <div className="group-card telegram-group">
            <div className="group-icon">
              <i className="fab fa-telegram-plane"></i>
            </div>
            <div className="group-content">
              <h3>Telegram Study Channel</h3>
              <p>Follow our Telegram channel for comprehensive study materials, exam notifications, and detailed guides</p>
              <ul className="group-features">
                <li><i className="fas fa-check"></i> Study material updates</li>
                <li><i className="fas fa-check"></i> Exam notifications</li>
                <li><i className="fas fa-check"></i> Practice tests</li>
                <li><i className="fas fa-check"></i> Career guidance</li>
              </ul>
              <a 
                href="https://t.me/typinghub_study" 
                target="_blank" 
                rel="noopener noreferrer"
                className="join-btn telegram-btn"
              >
                <i className="fab fa-telegram-plane"></i>
                Join Telegram Channel
              </a>
            </div>
          </div>
        </div>
        
        <div className="groups-info">
          <div className="info-card">
            <i className="fas fa-users"></i>
            <h4>5000+ Active Members</h4>
            <p>Join thousands of aspirants preparing for government exams</p>
          </div>
          <div className="info-card">
            <i className="fas fa-clock"></i>
            <h4>24/7 Support</h4>
            <p>Get help anytime from our community and experts</p>
          </div>
          <div className="info-card">
            <i className="fas fa-bell"></i>
            <h4>Instant Updates</h4>
            <p>Never miss important exam notifications and deadlines</p>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="exam-wise-test-page">
      <Helmet>
        <title>Government Exam Typing Tests - SSC, RRB, NTPC | TypingHub</title>
        <meta name="description" content="Practice typing tests for SSC-CGL, SSC-CHSL, RRB-NTPC and other government exams. Free mock tests with real exam patterns in Hindi and English." />
        <meta name="keywords" content="SSC typing test, RRB typing test, NTPC typing test, government exam typing, Hindi typing practice, English typing practice, SSC-CGL typing, SSC-CHSL typing" />
        <link rel="canonical" href="https://typinghub.in/exam-wise-test" />
        
        {/* Open Graph / Social Media Meta Tags */}
        <meta property="og:title" content="Government Exam Typing Tests - SSC, RRB, NTPC" />
        <meta property="og:description" content="Free typing practice tests for SSC-CGL, SSC-CHSL, RRB-NTPC and other government exams. Practice in both Hindi and English with real exam patterns." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://typinghub.in/exam-wise-test" />
        <meta property="og:image" content="https://typinghub.in/images/exam-wise-test-og.webp" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Government Exam Typing Tests - SSC, RRB, NTPC" />
        <meta name="twitter:description" content="Free typing practice tests for SSC-CGL, SSC-CHSL, RRB-NTPC and other government exams." />
        <meta name="twitter:image" content="https://typinghub.in/images/exam-wise-test-og.webp" />
        
        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="1 days" />
        <meta name="author" content="TypingHub" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>



      <div className="main-content">
        <div className="container">
          {/* Breadcrumb structured data only, visually hidden */}
          <script type="application/ld+json" style={{ display: 'none' }}>
            {JSON.stringify(structuredData)}
          </script>
          <div className="panel">
            {/* Header Section */}
            <div className="header-section">
                <div className="logo-container">
                  <div className="logo-item">
                    <img 
                      src="/images/SSC.webp" 
                      className="logo-ssc" 
                      alt="SSC Logo"
                      width={70}
                      height={70}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = target.src.replace('.webp', '.png');
                      }}
                    />
                    <span className="logo-label">SSC</span>
                  </div>
                  <div className="logo-item">
                    <img 
                      src="/images/RAILWAY.webp" 
                      className="logo-railway" 
                      alt="Railway Logo"
                      width={70}
                      height={70}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = target.src.replace('.webp', '.png');
                      }}
                    />
                    <span className="logo-label">RAILWAY</span>
                  </div>
                  <div className="logo-item">
                    <img 
                      src="/images/Cbse.webp" 
                      className="logo-cbse" 
                      alt="CBSE Logo"
                      width={70}
                      height={70}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = target.src.replace('.webp', '.png');
                      }}
                    />
                    <span className="logo-label">CBSE</span>
                  </div>
                  <div className="logo-item">
                    <img 
                      src="/images/court.webp" 
                      className="logo-court" 
                      alt="Supreme Court Logo"
                      width={70}
                      height={70}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = target.src.replace('.webp', '.png');
                      }}
                    />
                    <span className="logo-label">SUPREME COURT</span>
                  </div>
                </div>
            </div>

            {/* Search Section */}
            <div className="exam-search-section">
              <div className="exam-search-container">
                <div className="exam-search-item">
                  <input 
                    type="text" 
                    id="examSearchInput" 
                    placeholder="Search exams by name or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <div className="exam-search-results">
                      <span>{filteredExams.length} exam{filteredExams.length !== 1 ? 's' : ''} found</span>
                    </div>
                  )}
                </div>
                <div className="exam-search-title">
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

      {/* Preparation Tips Section */}
      <PreparationTipsSection />



      {/* FAQ Section */}
      <FAQSection />

      {/* Study Groups Section */}
      <StudyGroupsSection />
    </div>
  );
};

export default ExamWiseTest; 