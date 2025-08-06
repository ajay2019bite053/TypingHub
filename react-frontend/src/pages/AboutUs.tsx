import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBullseye,
  faEye,
  faGraduationCap,
  faLaptopCode,
  faChartLine,
  faUsers,
  faCertificate,
  faClock,
  faTrophy,
  faUserGraduate,
  faHistory,
  faRocket,
  faQuoteLeft,
  faQuoteRight,
  faArrowRight,
  faCheckCircle,
  faGlobe,
  faHandshake,
  faAward,
  faBook,
  faLanguage,
  faUserTie
} from '@fortawesome/free-solid-svg-icons';
import {
  faLinkedin,
  faTwitter,
  faGithub,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';
import './AboutUs.css';

const AboutUs: React.FC = () => {
  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="main-content about-us-page">
      <Helmet>
        <title>About Us - TypingHub.in 🎯</title>
        <meta name="description" content="Learn about TypingHub.in's mission to help students excel in typing tests and government exams." />
        <meta name="keywords" content="TypingHub about us, typing test platform, typing course provider" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Serif:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="container">
        <div className="panel">
      <div className="about-hero-section">
        <div className="about-hero-content">
              <h1>About TypingHub.in 🎯</h1>
              <p>Empowering students to achieve their dreams through expert typing education and practice</p>
        </div>
      </div>

      <div className="about-content">
            <div className="mission-vision">
              <div className="mission">
                <h2><FontAwesomeIcon icon={faBullseye} /> Our Mission</h2>
                <p>To provide high-quality, accessible typing education and practice resources that help students excel in government exams and professional careers. We're committed to making typing mastery achievable for everyone through innovative learning methods and comprehensive practice materials.</p>
          </div>
              <div className="vision">
                <h2><FontAwesomeIcon icon={faEye} /> Our Vision</h2>
                <p>To become India's leading platform for typing education and exam preparation, known for our commitment to student success, innovative learning methods, and comprehensive practice resources. We aim to help millions of students achieve their career goals.</p>
              </div>
            </div>

            <div className="achievements">
              <h2>Our Impact 🏆</h2>
              <div className="achievements-grid">
                <div className="achievement-card">
                  <div className="achievement-number">50,000+</div>
                  <p>Active Students</p>
                </div>
                <div className="achievement-card">
                  <div className="achievement-number">95%</div>
                  <p>Success Rate</p>
                </div>
                <div className="achievement-card">
                  <div className="achievement-number">1000+</div>
                  <p>Practice Tests</p>
                </div>
                <div className="achievement-card">
                  <div className="achievement-number">100+</div>
                  <p>Expert Instructors</p>
                </div>
              </div>
            </div>

            <div className="language-support">
              <h2>Language Support 🌐</h2>
              <div className="language-grid">
                <div className="language-card">
                  <FontAwesomeIcon icon={faLanguage} />
                  <h3>English Typing</h3>
                  <ul>
                    <li><FontAwesomeIcon icon={faCheckCircle} /> QWERTY Keyboard Layout</li>
                    <li><FontAwesomeIcon icon={faCheckCircle} /> Professional Typing Techniques</li>
                    <li><FontAwesomeIcon icon={faCheckCircle} /> Business Correspondence</li>
                  </ul>
                </div>
                <div className="language-card">
                  <FontAwesomeIcon icon={faLanguage} />
                  <h3>Hindi Typing</h3>
                  <ul>
                    <li><FontAwesomeIcon icon={faCheckCircle} /> Kruti Dev</li>
                    <li><FontAwesomeIcon icon={faCheckCircle} /> Mangal Font</li>
                    <li><FontAwesomeIcon icon={faCheckCircle} /> Unicode Support</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="features">
              <h2>Why Choose TypingHub? 🌟</h2>
            <div className="features-grid">
                <div className="feature-card">
                  <FontAwesomeIcon icon={faGraduationCap} />
                  <h3>Expert-Led Learning</h3>
                  <p>Our courses are designed by typing experts with years of experience in government exam preparation.</p>
                </div>
              <div className="feature-card">
                <FontAwesomeIcon icon={faLaptopCode} />
                  <h3>Comprehensive Practice</h3>
                  <p>Access a vast library of typing tests, practice materials, and exam-specific resources.</p>
                </div>
                <div className="feature-card">
                  <FontAwesomeIcon icon={faChartLine} />
                  <h3>Track Progress</h3>
                  <p>Monitor your improvement with detailed analytics and performance tracking tools.</p>
                </div>
                <div className="feature-card">
                  <FontAwesomeIcon icon={faUsers} />
                  <h3>Community Support</h3>
                  <p>Join a community of learners and get support from experienced mentors.</p>
              </div>
              <div className="feature-card">
                  <FontAwesomeIcon icon={faCertificate} />
                  <h3>Certification</h3>
                  <p>Earn recognized certificates to showcase your typing proficiency.</p>
              </div>
              <div className="feature-card">
                  <FontAwesomeIcon icon={faClock} />
                  <h3>24/7 Access</h3>
                  <p>Practice anytime, anywhere with our online platform and mobile-friendly interface.</p>
                </div>
              </div>
            </div>

            <div className="exam-coverage">
              <h2>Exam Coverage 📚</h2>
              <div className="exam-grid">
                <div className="exam-card">
                  <FontAwesomeIcon icon={faUserTie} />
                  <h3>SSC Exams</h3>
                  <ul>
                    <li>SSC CGL</li>
                    <li>SSC CHSL</li>
                    <li>SSC MTS</li>
                  </ul>
                </div>
                <div className="exam-card">
                  <FontAwesomeIcon icon={faUserTie} />
                  <h3>Railway Exams</h3>
                  <ul>
                    <li>RRB NTPC</li>
                    <li>RRB Group D</li>
                    <li>RRB JE</li>
                  </ul>
                </div>
                <div className="exam-card">
                  <FontAwesomeIcon icon={faUserTie} />
                  <h3>State Exams</h3>
                  <ul>
                    <li>Police Recruitment</li>
                    <li>Teacher Eligibility</li>
                    <li>Clerical Grade</li>
                  </ul>
                </div>
                <div className="exam-card">
                  <FontAwesomeIcon icon={faUserTie} />
                  <h3>Other Exams</h3>
                  <ul>
                    <li>Bank PO/Clerk</li>
                    <li>Insurance Sector</li>
                    <li>CPCT</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="journey">
              <h2>Our Journey 🚀</h2>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h3>2022</h3>
                    <p>Founded with a vision to revolutionize typing education</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h3>2023</h3>
                    <p>Launched comprehensive exam-specific typing courses</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h3>2024</h3>
                    <p>Reached 25,000+ students milestone</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h3>2025</h3>
                    <p>Expanded to cover all major government exams</p>
              </div>
                </div>
              </div>
            </div>

            <div className="recognition">
              <h2>Recognition & Partnerships ��</h2>
              <div className="recognition-grid">
                <div className="recognition-card">
                  <FontAwesomeIcon icon={faAward} />
                  <h3>Best Ed-Tech Platform</h3>
                  <p>Awarded for excellence in online education - 2023</p>
                </div>
                <div className="recognition-card">
                  <FontAwesomeIcon icon={faHandshake} />
                  <h3>Government Collaborations</h3>
                  <p>Official partner for state-level typing certifications</p>
              </div>
                <div className="recognition-card">
                  <FontAwesomeIcon icon={faGlobe} />
                  <h3>Pan-India Presence</h3>
                  <p>Trusted by institutes across 20+ states</p>
              </div>
                <div className="recognition-card">
                  <FontAwesomeIcon icon={faBook} />
                  <h3>Research Excellence</h3>
                  <p>Published studies on typing education methodology</p>
                </div>
              </div>
            </div>

            <div className="cta-section">
              <h2>Ready to Start Your Journey? 🚀</h2>
              <p>Join thousands of successful students who have achieved their goals with TypingHub</p>
              <div className="cta-buttons">
                <Link to="/typing-test" className="cta-button primary">
                  Start Free Practice <FontAwesomeIcon icon={faArrowRight} />
                </Link>
                <Link to="/typing-course" className="cta-button secondary">
                  Explore Courses <FontAwesomeIcon icon={faGraduationCap} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AboutUs; 