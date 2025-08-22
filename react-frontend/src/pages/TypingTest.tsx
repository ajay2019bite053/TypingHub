import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faKeyboard, 
  faFileAlt, 
  faCheckCircle,
  faBook,
  faCertificate,
  faChalkboardTeacher,
  faStar,
  faPenToSquare,
  faRocket,
  faSearch,
  faClipboardCheck,
  faHeadset,
  faShieldAlt,
  faGlobe,
  faAward,
  faUserGraduate,
  faHandshake,
  faChartBar,
  faSmile,
  faHeart,
  faLaptop,
  faLightbulb,
  faPlay,
  faQuestionCircle,
  faUserPlus as faRegister,
  faTrophy,
  faClock,
  faBullseye,
  faGraduationCap,
  faMedal,
  faUsers,
  faThumbsUp,
  faCog,
  faMobileAlt,
  faDesktop,
  faTabletAlt
} from '@fortawesome/free-solid-svg-icons';
import TypingEngine from '../components/common/TypingEngine';
import './TypingTest.css';

  const config = {
  testName: 'Free Typing Test',
  timeLimit: 600,
  passageCategory: 'Typing Test', // Updated to match backend category
    qualificationCriteria: {
      minWpm: 25,
      minAccuracy: 85
    }
  };

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Free Typing Test for Government Exams",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR"
  },
  "description": "Practice typing test with real exam patterns for SSC, RRB, and other government exams. Features include instant speed calculation, accuracy tracking, and detailed analysis.",
  "featureList": [
    "Real-time WPM calculation",
    "Accuracy tracking",
    "Error analysis",
    "Progress tracking",
    "Multiple language support",
    "Exam-specific patterns"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1200",
    "bestRating": "5",
    "worstRating": "1"
  }
};

const TypingTest = () => {
  // const breadcrumbItems = [
  //   { label: 'Home', path: '/' },
  //   { label: 'Typing Test', path: '/typing-test', isLast: true }
  // ]; // Remove visual breadcrumb

  return (
    <div className="typing-test-page">
      <Helmet>
        <title>Free Typing Test for Government Exams | Practice SSC, RRB Typing</title>
        <meta name="description" content="Practice typing test with real exam patterns for SSC, RRB, and other government exams. Get instant speed calculation, accuracy tracking, and detailed analysis." />
        <meta name="keywords" content="free typing test, government exam typing, typing speed test, typing practice, SSC typing, RRB typing, online typing test, typing course, typing speed improvement, typing accuracy, government job typing, competitive exam typing" />
        <link rel="canonical" href="https://typinghub.in/typing-test" />
        
        {/* Open Graph / Social Media Meta Tags */}
        <meta property="og:title" content="Free Typing Test for Government Exams" />
        <meta property="og:description" content="Practice typing test with real exam patterns. Get instant speed and accuracy analysis." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://typinghub.in/typing-test" />
        <meta property="og:image" content="https://typinghub.in/images/typing-test-og.webp" />
        <meta property="og:site_name" content="TypingHub" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Typing Test for Government Exams" />
        <meta name="twitter:description" content="Practice typing test with real exam patterns. Get instant analysis." />
        <meta name="twitter:image" content="https://typinghub.in/images/typing-test-og.webp" />
        <meta name="twitter:site" content="@typinghub" />
        
        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="1 days" />
        <meta name="author" content="TypingHub" />
        <meta name="copyright" content="TypingHub" />
        <meta name="coverage" content="Worldwide" />
        <meta name="distribution" content="Global" />
        <meta name="rating" content="General" />
        <meta name="theme-color" content="#1976d2" />
        
        {/* Typing Test Specific Meta Tags */}
        <meta name="application-name" content="TypingHub Typing Test" />
        <meta name="category" content="Educational Software" />
        <meta name="classification" content="Typing Test Application" />
        
        {/* Enhanced Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Free Typing Test for Government Exams",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Web",
            "url": "https://typinghub.in/typing-test",
            "description": "Practice typing test with real exam patterns for SSC, RRB, and other government exams. Features include instant speed calculation, accuracy tracking, and detailed analysis.",
            "featureList": [
              "Real-time WPM calculation",
              "Accuracy tracking",
              "Error analysis",
              "Progress tracking",
              "Multiple language support",
              "Exam-specific patterns",
              "Certificate generation",
              "Performance analytics"
            ],
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "INR",
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "1200",
              "bestRating": "5",
              "worstRating": "1"
            },
            "author": {
              "@type": "Organization",
              "name": "TypingHub",
              "url": "https://typinghub.in"
            },
            "publisher": {
              "@type": "Organization",
              "name": "TypingHub",
              "url": "https://typinghub.in"
            },
            "mainEntity": {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is a good typing speed for government exams?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A good typing speed for government exams is typically 30-35 WPM with 85-90% accuracy. However, requirements vary by exam and position."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How is typing speed calculated?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Typing speed is calculated as Words Per Minute (WPM) = (Total Characters ÷ 5) ÷ Time in Minutes. The standard word length is considered 5 characters."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I practice typing in Hindi?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! We offer typing practice in both English and Hindi. Many government exams require proficiency in both languages."
                  }
                }
              ]
            }
          })}
        </script>
      </Helmet>

      {/* Removed container div for full-width layout */}
      <TypingEngine config={config} />
      
      {/* Enhanced SEO-Rich Content Section */}
      <div className="typing-test-info-section">
        <div className="container">
          {/* Hero Information Section */}
          <div className="hero-info-section">
            <h2 className="section-title">
              <FontAwesomeIcon icon={faKeyboard} />
              Master Government Exam Typing Tests
            </h2>
            <p className="hero-description">
              Prepare for SSC, RRB, Police, and other government exams with our comprehensive typing test platform. 
              Practice with real exam patterns and get instant feedback on your speed and accuracy.
            </p>
          </div>

          {/* Key Features Grid */}
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faRocket} />
              </div>
              <h3>Real-time Analysis</h3>
              <p>Get instant WPM calculation and accuracy tracking as you type</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faBullseye} />
              </div>
              <h3>Exam Pattern Based</h3>
              <p>Practice with content that matches actual government exam patterns</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faCertificate} />
              </div>
              <h3>Free Certificate</h3>
              <p>Earn typing certificates for qualified scores to boost your resume</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faMobileAlt} />
              </div>
              <h3>Mobile Friendly</h3>
              <p>Practice typing on any device - desktop, tablet, or mobile</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faGlobe} />
              </div>
              <h3>Multi-language Support</h3>
              <p>Practice in both English and Hindi typing as per exam requirements</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faChartBar} />
              </div>
              <h3>Detailed Analytics</h3>
              <p>Track your progress with comprehensive performance reports</p>
            </div>
          </div>

          {/* Success Statistics */}
          <div className="success-stats-section">
            <h2 className="section-title">
              <FontAwesomeIcon icon={faUsers} />
              Success Stories & Statistics
            </h2>
            <div className="stats-grid">
              <div className="stat-card">
                <FontAwesomeIcon icon={faUserGraduate} className="stat-icon" />
                <div className="stat-number">50,000+</div>
                <div className="stat-label">Students Enrolled</div>
              </div>
              
              <div className="stat-card">
                <FontAwesomeIcon icon={faAward} className="stat-icon" />
                <div className="stat-number">95%</div>
                <div className="stat-label">Success Rate</div>
              </div>
              
              <div className="stat-card">
                <FontAwesomeIcon icon={faMedal} className="stat-icon" />
                <div className="stat-number">5,000+</div>
                <div className="stat-label">Certificates Issued</div>
              </div>
              
              <div className="stat-card">
                <FontAwesomeIcon icon={faThumbsUp} className="stat-icon" />
                <div className="stat-number">4.8★</div>
                <div className="stat-label">User Rating</div>
              </div>
            </div>
          </div>

          {/* Expert Tips Section */}
          <div className="tips-section">
            <h2 className="section-title">
              <FontAwesomeIcon icon={faLightbulb} />
              Expert Typing Tips for Government Exams
            </h2>
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-number">01</div>
                <h3>Master Touch Typing</h3>
                <p>Learn to type without looking at the keyboard. Use all fingers and practice proper finger positioning for maximum speed and accuracy.</p>
              </div>
              
              <div className="tip-card">
                <div className="tip-number">02</div>
                <h3>Focus on Accuracy First</h3>
                <p>Start slow and prioritize accuracy over speed. Speed will naturally improve as you develop muscle memory and confidence.</p>
              </div>
              
              <div className="tip-card">
                <div className="tip-number">03</div>
                <h3>Practice Exam Patterns</h3>
                <p>Use our exam-specific tests to familiarize yourself with the type of content you'll encounter in actual government exams.</p>
              </div>
              
              <div className="tip-card">
                <div className="tip-number">04</div>
                <h3>Regular Practice Schedule</h3>
                <p>Practice for 30-45 minutes daily. Consistency is key to improving both speed and accuracy over time.</p>
              </div>
              
              <div className="tip-card">
                <div className="tip-number">05</div>
                <h3>Simulate Exam Conditions</h3>
                <p>Practice with time limits and disable backspace to simulate real exam conditions and build confidence.</p>
              </div>
              
              <div className="tip-card">
                <div className="tip-number">06</div>
                <h3>Learn Keyboard Shortcuts</h3>
                <p>Master common keyboard shortcuts to improve efficiency and reduce time spent on corrections during exams.</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="faq-section">
            <h2 className="section-title">
              <FontAwesomeIcon icon={faQuestionCircle} />
              Frequently Asked Questions
            </h2>
            <div className="faq-grid">
              <div className="faq-item">
                <h3>What is a good typing speed for government exams?</h3>
                <p>A good typing speed for government exams is typically 30-35 WPM with 85-90% accuracy. However, requirements vary by exam and position. We recommend aiming for 40+ WPM to ensure you pass comfortably.</p>
              </div>
              
              <div className="faq-item">
                <h3>How is typing speed calculated?</h3>
                <p>Typing speed is calculated as Words Per Minute (WPM) = (Total Characters ÷ 5) ÷ Time in Minutes. The standard word length is considered 5 characters, which is the industry standard.</p>
              </div>
              
              <div className="faq-item">
                <h3>Can I practice typing in Hindi?</h3>
                <p>Yes! We offer comprehensive Hindi typing practice with proper fonts (Krutidev, Mangal) that are commonly used in government exams. Our platform supports both Hindi and English typing practice.</p>
              </div>
              
              <div className="faq-item">
                <h3>How often should I practice typing?</h3>
                <p>For best results, practice typing for at least 30 minutes daily. Consistency is key to improving both speed and accuracy. Start with 15-minute sessions and gradually increase.</p>
              </div>
              
              <div className="faq-item">
                <h3>Is the typing certificate from TypingHub valid for government jobs?</h3>
                <p>Our certificates demonstrate your typing proficiency and can be included in your resume. However, government exams have their own typing tests that you must pass to qualify for the position.</p>
              </div>
              
              <div className="faq-item">
                <h3>Which typing software is used in government exams?</h3>
                <p>SSC uses NIC software, while RRB uses TCS platform. Our typing tests simulate these real exam environments, so you'll be familiar with the interface when you take the actual exam.</p>
              </div>
            </div>
          </div>

          {/* Enhanced Call to Action Section */}
          <div className="cta-section">
            <div className="cta-content">
              <div className="cta-icon-wrapper">
                <FontAwesomeIcon icon={faRocket} className="cta-main-icon" />
              </div>
              <h2 className="cta-title">
                Ready to Master Government Exam Typing?
              </h2>
              <p className="cta-description">
                Join thousands of successful students who have cleared government typing tests using our platform. 
                Start practicing today and improve your typing skills for better career opportunities.
              </p>
              <div className="cta-highlights">
                <div className="cta-highlight">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <span>Free Practice Tests</span>
                </div>
                <div className="cta-highlight">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <span>Real-time Analysis</span>
                </div>
                <div className="cta-highlight">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <span>Certificate Generation</span>
                </div>
                <div className="cta-highlight">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <span>24/7 Support</span>
                </div>
              </div>
              <div className="cta-buttons">
                <a href="/exam-wise-test" className="cta-btn primary">
                  <FontAwesomeIcon icon={faSearch} />
                  Start Exam Practice Tests
                </a>
                <a href="/create-test" className="cta-btn secondary">
                  <FontAwesomeIcon icon={faPenToSquare} />
                  Build Your Own Test
                </a>
                <a href="/typing-course" className="cta-btn secondary">
                  <FontAwesomeIcon icon={faChalkboardTeacher} />
                  Master Typing Skills
                </a>
                <a href="/contact-us" className="cta-btn contact">
                  <FontAwesomeIcon icon={faHeadset} />
                  Get Expert Help
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingTest; 