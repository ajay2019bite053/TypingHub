import React, { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
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
  faUserPlus as faRegister
} from '@fortawesome/free-solid-svg-icons';
import { useCompetition } from '../contexts/CompetitionContext';
import CompetitionRegistrationModal from '../components/Competition/CompetitionRegistrationModal';
import CompetitionJoinModal from '../components/Competition/CompetitionJoinModal';
import './Home.css';
 

// Memoized components for better performance
const HeroSection = memo(({ onRegisterClick, onJoinClick, competitionStatus }: {
  onRegisterClick: () => void;
  onJoinClick: () => void;
  competitionStatus: any;
}) => (
      <section className="hero-section">
        <div className="hero-content">
      <h1>Free Typing Test Practice for Government Exams</h1>
          <p>Practice for SSC-CGL, SSC-CHSL, RRB-NTPC, Police, and other govt exams.</p>
          <div className="hero-buttons">
            <Link to="/typing-test" className="btn primary-btn">
              <FontAwesomeIcon icon={faRocket} />
              Start Now – No Signup Needed
            </Link>
            <Link to="/exam-wise-test" className="btn secondary-btn">
              <FontAwesomeIcon icon={faSearch} />
              Explore Exam Wise Tests
            </Link>
          </div>
          
          
          {/* Competition Links Slider - Infinite smooth sliding */}
          {(competitionStatus?.isRegistrationActive || competitionStatus?.isCompetitionActive) && (
            <div className="competition-links-slider">
              <div className="competition-links-track">
                {/* First set of links */}
                {competitionStatus?.isRegistrationActive && (
                  <span className="competition-link" onClick={onRegisterClick}>
                    <span style={{color: '#d32f2f'}}>🏆 Ready to Win?</span> <span style={{color: '#1976d2'}}>Join Our Weekly Typing Competition for Just ₹{competitionStatus?.entryFee || 0}!</span> 
                    {competitionStatus?.prizes?.first > 0 && <span style={{color: '#d32f2f'}}> 🎁 Amazing Prizes Up to ₹{competitionStatus?.prizes?.first} Await You!</span>}
                    {competitionStatus?.minSlots > 0 && <span style={{color: '#1976d2'}}> ⚡ Only {competitionStatus?.minSlots} Users Needed to Start!</span>}
                  </span>
                )}
                {competitionStatus?.isCompetitionActive && (
                  <span className="competition-link" onClick={onJoinClick}>
                    <span style={{color: '#d32f2f'}}>🚀 Don't Miss Out!</span> <span style={{color: '#1976d2'}}>Live Competition is Happening Right Now with {competitionStatus?.totalRegistrations || 0} Amazing Participants!</span> 
                    {competitionStatus?.prizes?.first > 0 && <span style={{color: '#d32f2f'}}> 💰 Total Prize Pool: ₹{competitionStatus?.prizes?.first + (competitionStatus?.prizes?.second || 0) + (competitionStatus?.prizes?.third || 0)} Up for Grabs!</span>}
                  </span>
                )}
                
                {/* Results Link - Show when results are published */}
                {competitionStatus?.resultsPublished && (
                  <Link to="/competition-results" className="competition-link results-link">
                    <span style={{color: '#ffd700'}}>🏆 Results Published!</span> <span style={{color: '#1976d2'}}>Check Your Rank and See Who Won the Competition!</span> 
                    <span style={{color: '#d32f2f'}}> 🎉 {competitionStatus?.totalParticipants || 0} Participants Competed!</span>
                  </Link>
                )}
                
                {/* Duplicate set for seamless loop */}
                {competitionStatus?.isRegistrationActive && (
                  <span className="competition-link" onClick={onRegisterClick}>
                    <span style={{color: '#d32f2f'}}>🏆 Ready to Win?</span> <span style={{color: '#1976d2'}}>Join Our Weekly Typing Competition for Just ₹{competitionStatus?.entryFee || 0}!</span> 
                    {competitionStatus?.prizes?.first > 0 && <span style={{color: '#d32f2f'}}> 🎁 Amazing Prizes Up to ₹{competitionStatus?.prizes?.first} Await You!</span>}
                    {competitionStatus?.minSlots > 0 && <span style={{color: '#1976d2'}}> ⚡ Only {competitionStatus?.minSlots} Users Needed to Start!</span>}
                  </span>
                )}
                {competitionStatus?.isCompetitionActive && (
                  <span className="competition-link" onClick={onJoinClick}>
                    <span style={{color: '#d32f2f'}}>🚀 Don't Miss Out!</span> <span style={{color: '#1976d2'}}>Live Competition is Happening Right Now with {competitionStatus?.totalRegistrations || 0} Amazing Participants!</span> 
                    {competitionStatus?.prizes?.first > 0 && <span style={{color: '#d32f2f'}}> 💰 Total Prize Pool: ₹{competitionStatus?.prizes?.first + (competitionStatus?.prizes?.second || 0) + (competitionStatus?.prizes?.third || 0)} Up for Grabs!</span>}
                  </span>
                )}
                
                {/* Duplicate Results Link for seamless loop */}
                {competitionStatus?.resultsPublished && (
                  <Link to="/competition-results" className="competition-link results-link">
                    <span style={{color: '#ffd700'}}>🏆 Results Published!</span> <span style={{color: '#1976d2'}}>Check Your Rank and See Who Won the Competition!</span> 
                    <span style={{color: '#d32f2f'}}> 🎉 {competitionStatus?.totalParticipants || 0} Participants Competed!</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
));

// Panel Items: Add gradient backgrounds, scale/shadow on hover, and a 'New' badge for the first card.
const cardAccents = [
  '#1976d2', // Typing Test
  '#2e7d32', // Exam Wise Test - darker green for better contrast
  '#f57c00', // Advance Mode - darker orange for better contrast
  '#8e24aa'  // Typing Course
];
const PanelItem = memo(({ icon, title, description, link, linkText, isNew, accentColor }: {
  icon: any;
  title: string;
  description: string;
  link: string;
  linkText: string;
  isNew?: boolean;
  accentColor: string;
}) => {
  let btnIcon = faKeyboard;
  if (title === 'Exam Wise Test') btnIcon = faFileAlt;
  else if (title === 'Advance Mode') btnIcon = faPenToSquare;
  else if (title === 'Typing Course') btnIcon = faChalkboardTeacher;
  return (
    <div className="modern-panel-card" style={{ borderTop: `5px solid ${accentColor}` }}>
      <div className="modern-panel-icon-wrapper" style={{ background: accentColor }}>
        <FontAwesomeIcon icon={icon} className="modern-panel-icon" />
      </div>
      <h2 className="modern-panel-title">{title}</h2>
      <p className="modern-panel-desc">{description}</p>
      <Link to={link} className="modern-panel-btn" style={{ background: accentColor }}>
        <FontAwesomeIcon icon={btnIcon} />
      {linkText}
          </Link>
        </div>
  );
});

// List Sections: Add fade-in animation
const ListSection = memo(({ title, description, items }: {
  title: string;
  description: string;
  items: string[];
}) => (
  <div className="list-section upgraded-list-section">
    <h2>{title}</h2>
    <p>{description}</p>
    <ul>
      {items.map((item, index) => (
        <li key={index} className="list-fade-in"><FontAwesomeIcon icon={faCheckCircle} /> {item}</li>
      ))}
        </ul>
      </div>
));

// Features Grid: Add accent bar and elevation
const FeatureCard = memo(({ icon, title, description }: {
  icon: any;
  title: string;
  description: string;
}) => (
  <div className="feature-card upgraded-feature-card">
    <div className="feature-accent-bar"></div>
    <FontAwesomeIcon icon={icon} className="feature-icon" />
    <h3 className="feature-title">{title}</h3>
    <p className="feature-description">{description}</p>
  </div>
));



// Achievements: Animated counters, icon glow
const AchievementCard = memo(({ icon, number, text }: {
  icon: any;
  number: string;
  text: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.classList.add('animate-counter');
    }
  }, []);
  return (
    <div className="achievement-card upgraded-achievement-card">
      <FontAwesomeIcon icon={icon} className="achievement-icon icon-glow" />
      <div className="achievement-number" ref={ref}>{number}</div>
    <div className="achievement-text">{text}</div>
  </div>
  );
});

// YouTube Section: Add intro video showcase
const YouTubeSection = memo(() => (
  <section className="youtube-section">
    <div className="youtube-container">
      <h2 className="section-title">
        <FontAwesomeIcon icon={faPlay} style={{ color: '#ff0000', marginRight: '10px' }} />
        Watch Our Introduction
      </h2>
      <p className="section-description">
        Learn more about TypingHub and how we help students prepare for government typing exams
      </p>
      <div className="video-container">
        <div className="video-wrapper">
          <iframe
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID_HERE"
            title="TypingHub Introduction Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="youtube-video"
          ></iframe>
        </div>
        <div className="video-description">
          <p>Watch our comprehensive introduction to understand how TypingHub can help you excel in government typing exams.</p>
        </div>
      </div>
    </div>
  </section>
));

const Home: React.FC = () => {
  const { competitionStatus, fetchCompetitionStatus } = useCompetition();
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Debug logging to see when competitionStatus changes - REMOVED to prevent noise
  // useEffect(() => {
  //   console.log('Home: competitionStatus changed:', competitionStatus);
  //   console.log('Home: resultsPublished value:', competitionStatus?.resultsPublished);
  // }, [competitionStatus]);

  // Refresh competition status when component mounts
  useEffect(() => {
    fetchCompetitionStatus();
  }, [fetchCompetitionStatus]);

  // Force refresh when competition status changes - REMOVED to prevent infinite loop
  // useEffect(() => {
  //   if (competitionStatus) {
  //     setRefreshKey(prev => prev + 1);
  //   }
  // }, [competitionStatus?.resultsPublished]);

  const handleRegisterClick = () => {
    setIsRegistrationModalOpen(true);
  };

  const handleJoinClick = () => {
    setIsJoinModalOpen(true);
  };

  const handleJoinSuccess = (data: any) => {
    // Navigation is now handled in the modal
    console.log('Joined competition:', data);
  };

  // SEO data
  const seoData = {
    title: 'TypingHub - Free Typing Test Practice for SSC, RRB, Government Exams | Hindi & English Typing',
    description: 'Master typing for government exams with TypingHub. Free SSC-CGL, SSC-CHSL, RRB-NTPC typing tests. Practice Hindi & English typing with real exam patterns. Get typing certificates and improve speed & accuracy. 50,000+ students trust us for government exam preparation.',
    canonicalUrl: 'https://typinghub.in',
    ogImage: 'https://typinghub.in/images/typing-hub-og.webp',
    language: 'en',
    region: 'IN'
  };

  // JSON-LD structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "TypingHub",
    "url": "https://typinghub.in",
    "description": "Free typing practice platform for government exam aspirants. Master typing for SSC, RRB, and other government exams with our comprehensive typing tests and resources.",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "datePublished": "2024-01-01",
    "dateModified": "2024-12-01",
    "author": {
      "@type": "Organization",
      "name": "TypingHub",
      "url": "https://typinghub.in"
    },
    "publisher": {
      "@type": "Organization",
      "name": "TypingHub",
      "url": "https://typinghub.in",
      "logo": {
        "@type": "ImageObject",
        "url": "https://typinghub.in/images/Main_LOGO.webp"
      }
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock"
    },
    "featureList": [
      "SSC-CGL Typing Test",
      "SSC-CHSL Typing Test", 
      "RRB-NTPC Typing Test",
      "Police Typing Test",
      "Hindi Typing Practice",
      "English Typing Practice",
      "Real-time Speed Analysis",
      "Real-time Accuracy Analysis",
      "Free Typing Certificate",
      "Exam Pattern Mock Tests",
      "Custom Typing Tests",
      "Typing Course Training",
      "Government Exam Preparation",
      "CPCT Typing Test",
      "Banking Typing Test",
      "Court Typing Test"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1000",
      "bestRating": "5",
      "worstRating": "1"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "Government exam aspirants, students preparing for SSC, RRB, Police exams"
    },
    "educationalLevel": "Intermediate",
    "educationalUse": "Practice, Assessment, Training",
    "inLanguage": ["en", "hi"],
    "isAccessibleForFree": true,
    "learningResourceType": "Interactive Resource",
    "teaches": "Typing Skills, Speed Typing, Accuracy Typing, Government Exam Preparation"
  };

  // Panel items data
  const panelItems = [
    {
      icon: faKeyboard,
      title: 'Typing Test',
      description: 'Free mock typing tests for all government exams like SSC-CGL,RRB-NTPC, etc.',
      link: '/typing-test',
      linkText: 'Take Test'
    },
    {
      icon: faFileAlt,
      title: 'Exam Wise Test',
      description: 'Mock tests for SSC-CGL, SSC-CHSL, RRB-NTPC and other govt exams.',
      link: '/exam-wise-test',
      linkText: 'Explore Exams'
    },
    {
      icon: faPenToSquare,
      title: 'Advance Mode',
      description: 'Create your own custom typing tests for practice and we also provide Mock.',
      link: '/create-test',
      linkText: 'Create Test'
    },
    {
      icon: faChalkboardTeacher,
      title: 'Typing Course',
      description: 'Learn typing techniques from our expert instructors.',
      link: '/typing-course',
      linkText: 'Join Course'
    }
  ];

  // List sections data
  const listSections = [
    {
      title: 'Why Use Our Typing Test?',
      description: 'TypingHub offers an exam-like environment to prepare for SSC, RRB, CPCT, and other government typing tests. Our platform mimics the SSC-NIC software used in exams, providing real-time feedback on speed, accuracy, and errors to help you qualify for posts like Tax Assistant, LDC, and Junior Clerk.',
      items: [
        'Real Exam Pattern Based',
        'Hindi & English Typing',
        'Instant Speed & Accuracy Report',
        'Free Certificate Option',
        'Mobile Friendly Interface'
      ]
    },
    {
      title: 'Government Typing Test Overview',
      description: 'Typing tests are a crucial part of SSC and Railway recruitment for clerical and data entry posts. Below are key details to help you prepare effectively.',
      items: [
        'SSC CGL/CHSL: 2000 key depressions in 15 min (35 WPM English, 30 WPM Hindi)',
        'RRB NTPC: 30-35 WPM, Hindi typing in Devlys 010 or Mangal font',
        'Accuracy Matters: Up to 5% errors allowed; practice for 95%+ accuracy',
        'Exam Software: SSC uses NIC software; RRB tests via TCS platform'
      ]
    },
    {
      title: 'Expert Preparation Tips for Typing Tests',
      description: 'Boost your typing skills with these expert tips tailored for government exams.',
      items: [
        'Practice daily with SSC/Railway mock tests to hit 35 WPM.',
        'Disable backspace in custom tests to simulate real exam conditions.',
        'Learn Hindi fonts (Krutidev/Mangal) for RRB and SSC Hindi tests.',
        'Focus on accuracy first, then speed, to minimize errors.'
      ]
    },
    {
      title: 'Latest Government Exam Updates 2024',
      description: 'Stay updated with the latest changes in government typing test patterns and requirements.',
      items: [
        'SSC CGL 2024: Computer-based typing test with NIC software',
        'RRB NTPC: Updated Hindi typing requirements with Devlys font',
        'Police Exams: State-specific typing speed requirements vary',
        'CPCT: Centralized typing test for multiple government departments'
      ]
    },
    {
      title: 'Success Stories & Testimonials',
      description: 'Real success stories from students who cleared government typing tests using our platform.',
      items: [
        'Rahul cleared SSC CGL typing with 42 WPM using our practice tests',
        'Priya achieved 38 WPM in Hindi typing for RRB NTPC',
        'Amit improved from 25 to 35 WPM in just 2 weeks',
        'Over 5000+ students cleared typing tests in 2023'
      ]
    }
  ];

  // New Features Data
  const features = [
    {
      icon: faClipboardCheck,
      title: 'Exam-Like Environment',
      description: 'Practice in conditions that perfectly match SSC, RRB, and other government exam environments.'
    },
    {
      icon: faHeadset,
      title: '24/7 Support',
      description: 'Get help anytime with our dedicated support team and comprehensive learning resources.'
    },
    {
      icon: faShieldAlt,
      title: 'Secure Platform',
      description: 'Your practice data is safe with our secure, reliable, and fast testing platform.'
    }
  ];

  



  // Achievements Data
  const achievements = [
    {
      icon: faUserGraduate,
      number: "50,000+",
      text: "Successful Students"
    },
    {
      icon: faAward,
      number: "95%",
      text: "Success Rate"
    },
    {
      icon: faHandshake,
      number: "100+",
      text: "Partner Institutes"
    },
    {
      icon: faGlobe,
      number: "24/7",
      text: "Available Support"
    }
  ];

  return (
    <div id="home-page">
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="language" content={seoData.language} />
        <meta name="geo.region" content={seoData.region} />
        <meta name="geo.placename" content="India" />
        <meta name="author" content="TypingHub" />
        <meta name="copyright" content="TypingHub" />
        
        {/* Canonical and alternate languages */}
        <link rel="canonical" href={seoData.canonicalUrl} />
        <link rel="alternate" hrefLang="en" href={seoData.canonicalUrl} />
        <link rel="alternate" hrefLang="hi" href={`${seoData.canonicalUrl}/hi`} />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:image" content={seoData.ogImage} />
        <meta property="og:url" content={seoData.canonicalUrl} />
        <meta property="og:site_name" content="TypingHub" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content={seoData.ogImage} />
        <meta name="twitter:site" content="@typinghub" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#1976d2" />
        <meta name="msapplication-TileColor" content="#1976d2" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TypingHub" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <HeroSection 
        key={refreshKey}
        onRegisterClick={handleRegisterClick}
        onJoinClick={handleJoinClick}
        competitionStatus={competitionStatus}
      />

      {/* Modern Dashboard-style Course Cards */}
      <div
        className="user-dashboard-courses-modern four-col-layout dashboard-cards-spacing"
        style={{ margin: '60px auto 60px auto', maxWidth: 1400 }}
      >
        {panelItems.map((item, idx) => (
          <PanelItem key={item.title} {...item} isNew={idx === 0} accentColor={cardAccents[idx % cardAccents.length]} />
        ))}
      </div>

      <section className="features-grid">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </section>

      {/* YouTube Section: Add intro video showcase */}
      <YouTubeSection />

      {listSections.map((section, index) => (
        <ListSection key={index} {...section} />
      ))}

      

      <section className="achievements">
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
          <FontAwesomeIcon icon={faChartBar} style={{ color: '#1976d2', marginRight: '10px' }} />
          Our Achievements
        </h2>
        <div className="achievements-grid">
          {achievements.map((achievement, index) => (
            <AchievementCard key={index} {...achievement} />
          ))}
      </div>
      </section>

      {/* Demo Certificate Section */}
      <section className="demo-certificate-section">
        <div className="demo-certificate-wrapper">
          <h2 className="section-title">
            <FontAwesomeIcon icon={faCertificate} />
            Free Typing Certificate
          </h2>
          <div className="demo-certificate-card">
            <img 
              src="/images/Main_LOGO.webp" 
              alt="TypingHub Logo" 
              className="main-logo"
              width={90}
              height={90}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = target.src.replace('.webp', '.png');
              }}
            />
            <div className="certificate-title">
              <div className="title-line"></div>
              <h2 className="main-title">TYPING CERTIFICATE</h2>
              <div className="title-line"></div>
            </div>
            <p style={{ fontSize: 16, color: '#333', marginBottom: 12 }}>This is to certify that</p>
            <h3>Amit Kumar</h3>
            <p>has successfully completed the typing test with</p>
            <div className="stats-container">
              <div>
                <div className="stat-number">42</div>
                <div className="stat-label">WPM</div>
              </div>
              <div>
                <div className="stat-number">97%</div>
                <div className="stat-label">Accuracy</div>
              </div>
            </div>
            <div className="cert-info">
              <div><strong>Certificate ID:</strong> DEMO-123456</div>
              <div><strong>Test Date:</strong> 01/06/2024</div>
              <div><strong>Verification Code:</strong> VC-DEMO123</div>
            </div>
          </div>
          <div className="certificate-buttons">
            <Link to="/certificate" className="btn primary-btn no-hover">
              <FontAwesomeIcon icon={faAward} />
              Get Certificate
            </Link>
            <Link to="/certificate-verification" className="btn primary-btn no-hover">
              <FontAwesomeIcon icon={faSearch} />
              Verify Certificate
            </Link>
          </div>
        </div>
      </section>

      {/* Practice Resources Section */}
      <section className="resources-section">
        <div className="resources-container">
          <h2 className="section-title">Practice Resources</h2>
          <div className="resources-grid">
            <div className="resource-card upgraded-resource-card">
              <div className="resource-icon">
                <FontAwesomeIcon icon={faBook} />
              </div>
              <div className="resource-content">
                <h3>Study Materials</h3>
                <p>Access comprehensive study materials designed by experts</p>
                <ul>
                  <li><FontAwesomeIcon icon={faCheckCircle} /> Detailed typing lessons</li>
                  <li><FontAwesomeIcon icon={faCheckCircle} /> Practice exercises</li>
                  <li><FontAwesomeIcon icon={faCheckCircle} /> Mock tests</li>
                </ul>
              </div>
            </div>
            <div className="resource-card upgraded-resource-card">
              <div className="resource-icon">
                <FontAwesomeIcon icon={faLaptop} />
              </div>
              <div className="resource-content">
                <h3>Interactive Platform</h3>
                <p>Learn with our interactive typing platform</p>
                <ul>
                  <li><FontAwesomeIcon icon={faCheckCircle} /> Real-time feedback</li>
                  <li><FontAwesomeIcon icon={faCheckCircle} /> Progress tracking</li>
                  <li><FontAwesomeIcon icon={faCheckCircle} /> Performance analytics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exam Categories Section */}
      <section className="exam-categories">
        <h2 className="section-title">Popular Exam Categories</h2>
        <div className="category-grid">
          <div className="category-card upgraded-category-card">
            <div className="category-icon">
              <FontAwesomeIcon icon={faFileAlt} />
            </div>
            <h3 className="category-title">SSC CHSL</h3>
            <p className="category-stats">5000+ Students Enrolled</p>
            <Link to="/ssc-chsl-test" className="primary-button">Practice Now</Link>
          </div>
          <div className="category-card upgraded-category-card">
            <div className="category-icon">
              <FontAwesomeIcon icon={faFileAlt} />
            </div>
            <h3 className="category-title">SSC CGL</h3>
            <p className="category-stats">4500+ Students Enrolled</p>
            <Link to="/ssc-cgl-test" className="primary-button">Practice Now</Link>
          </div>
          <div className="category-card upgraded-category-card">
            <div className="category-icon">
              <FontAwesomeIcon icon={faFileAlt} />
            </div>
            <h3 className="category-title">RRB NTPC</h3>
            <p className="category-stats">3800+ Students Enrolled</p>
            <Link to="/rrb-ntpc-test" className="primary-button">Practice Now</Link>
          </div>
          <div className="category-card upgraded-category-card">
            <div className="category-icon">
              <FontAwesomeIcon icon={faFileAlt} />
            </div>
            <h3 className="category-title">Court Assistant</h3>
            <p className="category-stats">3200+ Students Enrolled</p>
            <Link to="/junior-court-assistant-test" className="primary-button">Practice Now</Link>
          </div>
        </div>
      </section>

      {/* Pro Tips Section */}
      <section className="typing-tips">
        <div className="tips-container">
          <h2 className="section-title">Pro Typing Tips</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-number">01</div>
              <h3 className="tip-title">Maintain Proper Posture</h3>
              <p className="tip-description">Keep your back straight, feet flat on the floor, and wrists elevated while typing to prevent fatigue and improve speed.</p>
            </div>
            <div className="tip-card">
              <div className="tip-number">02</div>
              <h3 className="tip-title">Focus on Accuracy</h3>
              <p className="tip-description">Start slow and focus on accuracy. Speed will naturally improve as you develop muscle memory.</p>
            </div>
            <div className="tip-card">
              <div className="tip-number">03</div>
              <h3 className="tip-title">Regular Practice</h3>
              <p className="tip-description">Practice consistently for at least 15-20 minutes daily to see significant improvements in your typing speed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive FAQ Section */}
      <section className="faq-section">
        <div className="faq-container">
          <h2 className="section-title">
            <FontAwesomeIcon icon={faQuestionCircle} />
            Frequently Asked Questions
          </h2>
          
          <div className="faq-grid">
            <div className="faq-item">
              <h3 className="faq-question">
                What is the minimum typing speed required for government exams?
              </h3>
              <p className="faq-answer">
                For most government exams like SSC CGL/CHSL, the minimum requirement is 35 WPM (Words Per Minute) for English and 30 WPM for Hindi typing. However, we recommend aiming for 40+ WPM to ensure you pass comfortably.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">
                How accurate does my typing need to be?
              </h3>
              <p className="faq-answer">
                Government exams typically allow up to 5% errors. We recommend maintaining at least 95% accuracy during practice. Our platform provides real-time accuracy feedback to help you improve.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">
                Which typing software is used in government exams?
              </h3>
              <p className="faq-answer">
                SSC uses NIC software, while RRB uses TCS platform. Our typing tests simulate these real exam environments, so you'll be familiar with the interface when you take the actual exam.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">
                How long should I practice daily?
              </h3>
              <p className="faq-answer">
                We recommend 30-45 minutes of daily practice. Start with 15-minute sessions and gradually increase. Consistency is more important than long, infrequent practice sessions.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">
                Is the typing certificate from TypingHub valid for government jobs?
              </h3>
              <p className="faq-answer">
                Our certificates demonstrate your typing proficiency and can be included in your resume. However, government exams have their own typing tests that you must pass to qualify for the position.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">
                Can I practice Hindi typing on your platform?
              </h3>
              <p className="faq-answer">
                Yes! We offer comprehensive Hindi typing practice with proper fonts (Krutidev, Mangal) that are commonly used in government exams. Our platform supports both Hindi and English typing practice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Competition Modals */}
      <CompetitionRegistrationModal 
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
      />
      
      <CompetitionJoinModal 
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoinSuccess={handleJoinSuccess}
      />
    </div>
  );
};

export default Home; 