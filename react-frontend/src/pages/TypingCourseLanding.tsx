import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faKeyboard, faChartLine,
  faUser, faSignInAlt, faUsers,
  faFileAlt, faTrophy, faCrown,
  faUserPlus, faRocket, faGraduationCap,
  faStar, faBookOpen, faCertificate, faGavel, faTrain, faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import UserAuthModal from '../components/Auth/UserAuthModal';
import CourseDetailsModal from '../components/CourseDetailsModal';
import ReactDOM from 'react-dom';
import './TypingCourseLanding.css';
import '../components/UserDashboard/Dashboard.css';
import { sharedLandingCourses } from '../components/UserDashboard/Dashboard';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface CourseDetail {
  title: string;
  description: string;
  features: string[];
  price?: string;
  buttonText?: string;
  buttonAction?: () => void;
}

// Testimonial data
const testimonials = [
  {
    name: 'Ankit Sharma',
    quote: 'TypingHub.in made learning fun! The 3D keyboard and AI feedback are next level.',
    rating: 5,
    avatar: '/avatars/ankit.jpg'
  },
  {
    name: 'Priya Patel',
    quote: 'I improved my speed by 30% in just a month. The gamified challenges kept me motivated!',
    rating: 5,
    avatar: '/avatars/priya.jpg'
  },
  {
    name: 'Rahul Verma',
    quote: 'Multi-language support helped me ace both Hindi and English typing tests.',
    rating: 5,
    avatar: '/avatars/rahul.jpg'
  },
  {
    name: 'Sneha Gupta',
    quote: 'The demo mode and real-time key animations are so cool! Highly recommended.',
    rating: 5,
    avatar: '/avatars/sneha.jpg'
  },
];

const TypingCourseLanding: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'free' | 'premium'>('free');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [isVisible, setIsVisible] = useState<{[key: string]: boolean}>({});
  const [isCourseDetailsModalOpen, setIsCourseDetailsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseDetail | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const courseDetailsData: {[key: string]: CourseDetail} = {
    'complete-typing-course': {
      title: 'Complete Typing Course',
      description: 'Master typing from basics to advanced. Covers finger placement, posture, speed, and accuracy drills for proficient typing.',
      features: [
        'Interactive Step-by-Step Lessons',
        'Proper Finger Placement & Posture',
        'Speed Building Modules',
        'Accuracy Drills',
        'Personalized Progress Tracking',
        'Virtual Keyboard Visuals',
        'Real-time Feedback & Analytics',
        'Lifetime Access'
      ],
      price: '₹999 Only',
      buttonText: 'Enroll Now',
      buttonAction: () => { /* Logic to enroll or redirect */ alert('Enrollment logic for Complete Typing Course'); }
    },
    'ssc-exams': {
      title: 'SSC-CGL/CHSL Mock Tests',
      description: 'Prepare for SSC CGL & CHSL with premium mocks. Real exam interface, specific passages, detailed analysis to master speed and accuracy.',
      features: [
        'Real Exam Interface Simulation',
        'Premium Passages (SSC Specific)',
        'Time-bound Mock Tests (10/15 min)',
        'Detailed Performance Analysis',
        'Error Highlighting',
        'Live WPM & Accuracy Tracking',
        'SSC Penalty Calculation (5 chars/mistake)'
      ],
      price: '₹499 Only',
      buttonText: 'Get SSC Mock Tests',
      buttonAction: () => { /* Logic to buy SSC mocks */ alert('Buy SSC Mock Tests logic'); }
    },
    'railway-exams': {
      title: 'Railway Exams (RRB-NTPC) Mock Tests',
      description: 'Specialized tests for RRB-NTPC and other railway exams. Match exact patterns, achieve precise speed and accuracy for success.',
      features: [
        'RRB-NTPC Specific Passages',
        'Real Exam Interface',
        'Accuracy & Speed Focused',
        'Progress Tracking',
        'Detailed Result Analysis'
      ],
      price: '₹399 Only',
      buttonText: 'Get Railway Mocks',
      buttonAction: () => { /* Logic to buy Railway mocks */ alert('Buy Railway Mock Tests logic'); }
    },
    'supreme-court-exams': {
      title: 'Supreme Court Typing Tests',
      description: 'Professional practice for Supreme Court & judicial exams. Focus on high accuracy and speed with tailored tests for prestigious positions.',
      features: [
        'Judicial Exam Passages',
        'High Accuracy Requirement Focus',
        'Error Correction Practice',
        'Time-based Challenges',
        'Detailed Analytics'
      ],
      price: '₹449 Only',
      buttonText: 'Get Court Mocks',
      buttonAction: () => { /* Logic to buy Supreme Court mocks */ alert('Buy Supreme Court Mocks logic'); }
    },
    'other-govt-exams': {
      title: 'Comprehensive Government Exam Mocks',
      description: 'A vast collection of specialized mock tests and practice materials tailored for various other government examinations (e.g., High Court, Police, Banking, etc.). Our platform provides a real exam interface and premium passages to ensure you are fully prepared to achieve your dream.',
      features: [
        'Diverse Exam Categories',
        'Real Exam Interface',
        'Premium Passages',
        'Customizable Tests',
        'Detailed Result Analysis',
        'Progress History'
      ],
      price: 'Starting from ₹299',
      buttonText: 'Explore All Exams',
      buttonAction: () => { /* Logic to explore all other exams */ alert('Explore All Other Exams logic'); }
    },
  };

  // Course details for structured data
  const courseDetails = {
    name: "Government Exam Typing Course",
    description: "Comprehensive typing course designed specifically for government exam preparation. Master typing with expert guidance and real exam patterns.",
    provider: {
      "@type": "Organization",
      "name": "TypingHub",
      "url": "https://typinghub.in"
    },
    features: [
      "SSC-CGL/CHSL specific training",
      "RRB-NTPC typing patterns",
      "Hindi & English typing practice",
      "Real exam simulations",
      "Expert instructor guidance",
      "Performance tracking",
      "Practice exercises",
      "Mock tests"
    ],
    duration: "P8W", // 8 weeks in ISO 8601 duration format
    coursePrerequisites: "Basic computer knowledge",
    educationalLevel: "Beginner to Advanced",
    occupationalCategory: "Government Exam Preparation",
    timeRequired: "PT2H", // 2 hours per day in ISO 8601 duration format
    availableLanguage: ["English", "Hindi"]
  };

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    ...courseDetails,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "validFrom": "2024-01-01"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "850",
      "bestRating": "5",
      "worstRating": "1"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": "PT14H",
      "distance": "0",
      "instructor": {
        "@type": "Person",
        "name": "Expert Typing Instructors"
      }
    }
  };

  // Handle auth modal
  const handleAuthClose = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const handleSignUpClick = useCallback(() => {
    setAuthMode('register');
    setIsAuthModalOpen(true);
  }, []);

  const handleLoginClick = useCallback(() => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  }, []);

  // Handle course details modal
  const handleCloseCourseDetailsModal = useCallback(() => {
    setIsCourseDetailsModalOpen(false);
    setSelectedCourse(null);
  }, []);

  const handleOpenModal = useCallback((courseType: string) => {
    const course = courseDetailsData[courseType];
    if (course) {
      setSelectedCourse(course);
      setIsCourseDetailsModalOpen(true);
    }
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.id) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: entry.isIntersecting
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observerRef.current?.observe(section));

    return () => {
      sections.forEach((section) => observerRef.current?.unobserve(section));
      observerRef.current?.disconnect();
    };
  }, []);

  // Handle testimonials scroll
  useEffect(() => {
    const testimonialsGrid = document.querySelector('.testimonials-grid');
    const indicators = document.querySelectorAll('.scroll-indicator');
    
    const handleScroll = () => {
      if (testimonialsGrid && indicators.length > 0) {
        const scrollLeft = testimonialsGrid.scrollLeft;
        const cardWidth = 320 + 32; // card width + gap
        const activeIndex = Math.round(scrollLeft / cardWidth);
        
        indicators.forEach((indicator, index) => {
          indicator.classList.toggle('active', index === activeIndex);
        });
      }
    };

    testimonialsGrid?.addEventListener('scroll', handleScroll);
    
    return () => {
      testimonialsGrid?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Government Exam Typing Course | SSC, RRB Typing Training</title>
        <meta name="description" content="Master typing for government exams with our comprehensive course. Expert-led training for SSC-CGL, CHSL, RRB-NTPC with real exam patterns in Hindi & English." />
        <meta name="keywords" content="typing course, government exam typing, SSC typing training, RRB typing course, Hindi typing course, English typing course, typing certification" />
        <link rel="canonical" href="https://typinghub.in/typing-course" />
        
        {/* Open Graph / Social Media Meta Tags */}
        <meta property="og:title" content="Government Exam Typing Course | SSC, RRB Training" />
        <meta property="og:description" content="Master typing for government exams with expert-led training. Real exam patterns, comprehensive practice, and certification." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://typinghub.in/typing-course" />
        <meta property="og:image" content="https://typinghub.in/images/typing-course-og.jpg" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Government Exam Typing Course" />
        <meta name="twitter:description" content="Expert-led typing training for government exams. SSC, RRB patterns." />
        <meta name="twitter:image" content="https://typinghub.in/images/typing-course-og.jpg" />
        
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

      {/* User Auth Modal */}
      <UserAuthModal
        isOpen={isAuthModalOpen}
          onClose={handleAuthClose}
        modalType={authMode}
        />

      <div className="typing-course-landing">
        {/* Course Details Modal */}
        {isCourseDetailsModalOpen && selectedCourse && (
          <CourseDetailsModal
            isOpen={isCourseDetailsModalOpen}
            onClose={handleCloseCourseDetailsModal}
            course={selectedCourse}
          />
        )}
        
        {/* Hero Section */}
        <section className="typing-hero-section">
          <div className="typing-hero-content">
            <h1>Master Typing for Govt Exams with Smart Courses & Premium Mock Tests</h1>
            <p>Learn from basics, then test yourself with premium SSC-CGL/CHSL, RRB-NTPC and other Government Exams mocks.</p>
            <div className="typing-hero-buttons">
              <button className="primary-btn" onClick={handleSignUpClick}>
                <FontAwesomeIcon icon={faUserPlus} />
                Register Now
              </button>
              <button className="secondary-btn" onClick={handleLoginClick}>
                <FontAwesomeIcon icon={faSignInAlt} />
                Login
              </button>
            </div>
          </div>
        </section>

        {/* Course Showcase */}
        <section className="course-showcase section-spacing">
          <h2>Our Premium Courses</h2>
          <div className="course-grid four-col-layout">
            {sharedLandingCourses.map(course => (
              <div className="course-card-modern not-enrolled" key={course.id}>
                <div className="course-icon-modern">
                  <FontAwesomeIcon icon={course.icon} />
                </div>
                <div className="course-content-modern">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="course-bottom-row">
                    <span className="course-price">₹{course.price}</span>
                    <button className="course-action-btn-modern primary" onClick={() => alert('Please register and login to buy the course.')}>Buy Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* More Courses Message */}
          <div className="more-courses-message">
            <h3>Discover More Specialized Courses</h3>
            <p>We offer many more specialized courses for various government exams. Register or login to explore our full catalog.</p>
            <button className="cta-button" onClick={handleSignUpClick}>
              <FontAwesomeIcon icon={faUserPlus} />
              Register Now to Explore More
            </button>
          </div>
        </section>

        {/* Why Choose Our Course? Section */}
        <section className="features section-spacing">
          <h2>Why Choose Our Course?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">⌨️</span>
              <h3>Learn Proper Technique</h3>
              <p>Master the correct finger placement and typing posture for maximum efficiency.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">⚡</span>
              <h3>Improve Your Speed</h3>
              <p>Gradually increase your typing speed through structured exercises and practice.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📚</span>
              <h3>Structured Learning</h3>
              <p>Follow our step-by-step curriculum designed for optimal learning progression.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🧠</span>
              <h3>Build Muscle Memory</h3>
              <p>Develop automatic typing skills through consistent practice and repetition.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🏆</span>
              <h3>Track Progress</h3>
              <p>Monitor your improvement with detailed statistics and performance metrics.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">⏱️</span>
              <h3>Time-Saving Skills</h3>
              <p>Save hours of typing time with improved speed and accuracy.</p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works section-spacing">
          <h2>How It Works</h2>
          <div className="steps-container">
            <div className="step-wrapper">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>
                  <span className="emoji-icon">🎯</span>
                  Set Your Goals
                </h3>
                <p>Define your typing speed and accuracy targets to personalize your learning path.</p>
              </div>
            </div>
            <div className="step-wrapper">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>
                  <span className="emoji-icon">✋</span>
                  Interactive Lessons
                </h3>
                <p>Engage with our structured lessons, focusing on proper finger placement and technique.</p>
              </div>
            </div>
            <div className="step-wrapper">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>
                  <span className="emoji-icon">🔁</span>
                  Practice & Master
                </h3>
                <p>Practice regularly with diverse exercises to build muscle memory and improve speed.</p>
              </div>
            </div>
            <div className="step-wrapper">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>
                  <span className="emoji-icon">📊</span>
                  Track Progress
                </h3>
                <p>Monitor your performance with detailed statistics and visualize your improvement over time.</p>
              </div>
            </div>
            <div className="step-wrapper">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3>
                  <span className="emoji-icon">📝</span>
                  Premium Mock Tests
                </h3>
                <p>Challenge yourself with full-length mock tests designed for government exams to simulate real conditions.</p>
              </div>
            </div>
            <div className="step-wrapper">
              <div className="step-number">6</div>
              <div className="step-content">
                <h3>
                  <span className="emoji-icon">🏆</span>
                  Achieve Your Dreams
                </h3>
                <p>Reach your typing goals and boost your chances of success in competitive exams.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TypingCourseLanding; 