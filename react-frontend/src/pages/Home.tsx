import React, { memo, useEffect, useRef } from 'react';
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
  faLaptop
} from '@fortawesome/free-solid-svg-icons';
import './Home.css';

// Memoized components for better performance
const HeroSection = memo(() => (
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

const Home: React.FC = () => {
  // SEO data
  const seoData = {
    title: 'TypingHub - Master Typing for Government Exams',
    description: 'Free typing practice platform for government exam aspirants. Improve your typing speed and accuracy with our comprehensive typing tests and resources.',
    keywords: 'typing test, government exam typing, hindi typing, english typing, typing practice, SSC typing test, RRB typing test, CHSL typing test',
    canonicalUrl: 'https://typinghub.in',
    ogImage: '/images/typing-hub-og.webp'
  };

  // JSON-LD structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "TypingHub",
    "url": "https://typinghub.in",
    "description": "Free typing practice platform for government exam aspirants",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "featureList": [
      "SSC-CGL Typing Test",
      "SSC-CHSL Typing Test",
      "RRB-NTPC Typing Test",
      "Hindi & English Typing Practice",
      "Real-time Speed & Accuracy Analysis",
      "Free Typing Certificate"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1000",
      "bestRating": "5",
      "worstRating": "1"
    }
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
        <meta name="keywords" content={seoData.keywords} />
        <link rel="canonical" href={seoData.canonicalUrl} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:image" content={seoData.ogImage} />
        <meta property="og:url" content={seoData.canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content={seoData.ogImage} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <HeroSection />

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
      <section className="demo-certificate-section" style={{ background: '#fff', padding: '12px 0 10px 0' }}>
        <div className="demo-certificate-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <div className="demo-certificate-card">
            <div className="pattern-bg"></div>
            <div className="flag-ribbon"></div>
            <img
              src="/images/ashoka-chakra.webp"
              alt="Ashoka Chakra"
              className="ashoka-chakra"
              width={120}
              height={120}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = target.src.replace('.webp', '.png');
              }}
            />
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
            <p style={{ fontSize: 16, color: '#333', marginBottom: 14 }}>has successfully completed the typing test with</p>
            <div style={{ display: 'flex', gap: 32, marginBottom: 14 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#1976d2' }}>42</div>
                <div style={{ fontSize: 15, color: '#555' }}>WPM</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#43a047' }}>97%</div>
                <div style={{ fontSize: 15, color: '#555' }}>Accuracy</div>
              </div>
            </div>
            <div style={{ fontSize: 15, color: '#333', marginBottom: 6 }}><b>Certificate ID:</b> DEMO-123456</div>
            <div style={{ fontSize: 15, color: '#333', marginBottom: 6 }}><b>Test Date:</b> 01/06/2024</div>
            <div style={{ fontSize: 15, color: '#333', marginBottom: 6 }}><b>Verification Code:</b> VC-DEMO123</div>
            <div className="decorative-line"></div>
            <div className="gold-seal">
              <img 
                src="/images/gold-seal.webp" 
                alt="Gold Seal"
                width={60}
                height={60}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = target.src.replace('.webp', '.png');
                }}
              />
            </div>
          </div>
          <div className="certificate-buttons">
            <Link to="/certificate" className="btn primary-btn no-hover">
              <FontAwesomeIcon icon={faCertificate} />
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
    </div>
  );
};

export default memo(Home); 