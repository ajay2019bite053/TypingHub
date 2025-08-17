import React from 'react';
import { Helmet } from 'react-helmet-async';
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
        <meta property="og:image" content="https://typinghub.in/images/typing-test-og.jpg" />
        <meta property="og:site_name" content="TypingHub" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Typing Test for Government Exams" />
        <meta name="twitter:description" content="Practice typing test with real exam patterns. Get instant analysis." />
        <meta name="twitter:image" content="https://typinghub.in/images/typing-test-og.jpg" />
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
      
      {/* SEO-Rich Content Section */}
      <div className="typing-test-info-section">
        <div className="container">
          {/* Main Typing Test Information */}
          <div className="typing-info-grid">
            <div className="typing-info-card">
              <h2>Free Typing Test for Government Exams</h2>
              <p>Master the art of typing with our comprehensive free typing test designed specifically for government exam aspirants. Whether you're preparing for SSC, RRB, UPSC, or any other competitive exam, our typing test provides real-time feedback and detailed analysis.</p>
              
              <div className="typing-features">
                <h3>Key Features:</h3>
                <ul>
                  <li>Real-time WPM (Words Per Minute) calculation</li>
                  <li>Instant accuracy tracking and error analysis</li>
                  <li>Multiple time durations (2, 5, 10, 15 minutes)</li>
                  <li>Exam-specific passage categories</li>
                  <li>Detailed performance statistics</li>
                  <li>Certificate generation for qualified scores</li>
                </ul>
              </div>
            </div>

            <div className="typing-info-card">
              <h3>Government Exam Typing Requirements</h3>
              <div className="exam-requirements">
                <div className="requirement-item">
                  <h4>SSC Typing Test</h4>
                  <p>Minimum 35 WPM with 90% accuracy for English typing</p>
                </div>
                <div className="requirement-item">
                  <h4>RRB Typing Test</h4>
                  <p>Minimum 30 WPM with 85% accuracy for English typing</p>
                </div>
                <div className="requirement-item">
                  <h4>UP Police Typing Test</h4>
                  <p>Minimum 25 WPM with 80% accuracy for English typing</p>
                </div>
                <div className="requirement-item">
                  <h4>Bihar Police Typing Test</h4>
                  <p>Minimum 25 WPM with 80% accuracy for English typing</p>
                </div>
              </div>
            </div>
          </div>

          {/* Typing Tips Section */}
          <div className="typing-tips-section">
            <h2>Typing Test Tips & Best Practices</h2>
            <div className="tips-grid">
              <div className="tip-card">
                <h3>Speed Improvement</h3>
                <ul>
                  <li>Practice touch typing regularly</li>
                  <li>Use all fingers, not just index fingers</li>
                  <li>Learn keyboard shortcuts</li>
                  <li>Focus on accuracy first, then speed</li>
                </ul>
              </div>
              
              <div className="tip-card">
                <h3>Accuracy Enhancement</h3>
                <ul>
                  <li>Read ahead while typing</li>
                  <li>Don't look at the keyboard</li>
                  <li>Practice with different text types</li>
                  <li>Use proper finger positioning</li>
                </ul>
              </div>
              
              <div className="tip-card">
                <h3>Exam Preparation</h3>
                <ul>
                  <li>Practice with official exam patterns</li>
                  <li>Time your practice sessions</li>
                  <li>Simulate exam conditions</li>
                  <li>Review your mistakes regularly</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="faq-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-grid">
              <div className="faq-item">
                <h3>What is a good typing speed for government exams?</h3>
                <p>A good typing speed for government exams is typically 30-35 WPM with 85-90% accuracy. However, requirements vary by exam and position.</p>
              </div>
              
              <div className="faq-item">
                <h3>How is typing speed calculated?</h3>
                <p>Typing speed is calculated as Words Per Minute (WPM) = (Total Characters ÷ 5) ÷ Time in Minutes. The standard word length is considered 5 characters.</p>
              </div>
              
              <div className="faq-item">
                <h3>Can I practice typing in Hindi?</h3>
                <p>Yes! We offer typing practice in both English and Hindi. Many government exams require proficiency in both languages.</p>
              </div>
              
              <div className="faq-item">
                <h3>How often should I practice typing?</h3>
                <p>For best results, practice typing for at least 30 minutes daily. Consistency is key to improving both speed and accuracy.</p>
              </div>
            </div>
          </div>

          {/* Typing Statistics & Success Stories */}
          <div className="stats-section">
            <h2>Typing Test Statistics & Success Stories</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>50,000+</h3>
                <p>Students have improved their typing speed</p>
              </div>
              <div className="stat-card">
                <h3>95%</h3>
                <p>Success rate in government typing tests</p>
              </div>
              <div className="stat-card">
                <h3>40+ WPM</h3>
                <p>Average improvement in typing speed</p>
              </div>
              <div className="stat-card">
                <h3>1000+</h3>
                <p>Practice passages available</p>
              </div>
            </div>
          </div>

          {/* More Exam Information */}
          <div className="exam-info-section">
            <h2>Government Exam Typing Test Details</h2>
            <div className="exam-info-grid">
              <div className="exam-detail-card">
                <h3>SSC CGL Typing Test</h3>
                <p>The Staff Selection Commission (SSC) CGL typing test requires candidates to achieve a minimum of 35 WPM in English typing with 90% accuracy. The test duration is typically 10 minutes.</p>
                <div className="exam-button-container">
                  <a href="/ssc-cgl-typing-test" className="exam-link">SSC CGL Test</a>
                </div>
              </div>
              
              <div className="exam-detail-card">
                <h3>SSC CHSL Typing Test</h3>
                <p>SSC CHSL typing test requires 35 WPM in English typing with 90% accuracy. Focus on clerical and data entry related content.</p>
                <div className="exam-button-container">
                  <a href="/ssc-chsl-typing-test" className="exam-link">SSC CHSL Test</a>
                </div>
              </div>
              
              <div className="exam-detail-card">
                <h3>RRB NTPC Typing Test</h3>
                <p>Railway Recruitment Board (RRB) NTPC typing test requires 30 WPM in English typing with 85% accuracy. The test focuses on railway-related content and terminology.</p>
                <div className="exam-button-container">
                  <a href="/rrb-ntpc-typing-test" className="exam-link">RRB NTPC Test</a>
                </div>
              </div>
              
              <div className="exam-detail-card">
                <h3>UP Police Typing Test</h3>
                <p>UP Police typing test requires 25-30 WPM with 80-85% accuracy. Content includes legal documents, reports, and official communications.</p>
                <div className="exam-button-container">
                  <a href="/up-police-typing-test" className="exam-link">UP Police Test</a>
                </div>
              </div>
              
              <div className="exam-detail-card">
                <h3>Bihar Police Typing Test</h3>
                <p>Bihar Police typing test requires 25-30 WPM with 80-85% accuracy. Practice with police-related documents and reports.</p>
                <div className="exam-button-container">
                  <a href="/bihar-police-typing-test" className="exam-link">Bihar Police Test</a>
                </div>
              </div>
              
              <div className="exam-detail-card">
                <h3>Allahabad High Court Typing Test</h3>
                <p>Allahabad High Court typing test requires high accuracy (90%+) with moderate speed (25-30 WPM). Content includes legal documents and court proceedings.</p>
                <div className="exam-button-container">
                  <a href="/allahabad-high-court-typing-test" className="exam-link">Allahabad High Court Test</a>
                </div>
              </div>
              
              <div className="exam-detail-card">
                <h3>Junior Court Assistant Typing Test</h3>
                <p>Junior Court Assistant typing test requires 90%+ accuracy with 25-30 WPM speed. Practice with legal documents and judgments.</p>
                <div className="exam-button-container">
                  <a href="/junior-court-assistant-typing-test" className="exam-link">Junior Court Assistant Test</a>
                </div>
              </div>
              
              <div className="exam-detail-card">
                <h3>Junior Assistant Typing Test</h3>
                <p>Junior Assistant typing test for government departments requires 25 WPM with 80% accuracy. Practice with administrative content.</p>
                <div className="exam-button-container">
                  <a href="/junior-assistant-typing-test" className="exam-link">Junior Assistant Test</a>
                </div>
              </div>
              
              <div className="exam-detail-card">
                <h3>Superintendent Typing Test</h3>
                <p>Superintendent typing test requires higher accuracy (85%+) with 25-30 WPM speed. Advanced level typing practice.</p>
                <div className="exam-button-container">
                  <a href="/superintendent-typing-test" className="exam-link">Superintendent Test</a>
                </div>
              </div>
              
              <div className="exam-detail-card">
                <h3>AIIMS CRC Typing Test</h3>
                <p>AIIMS CRC typing test for medical institutions requires 25 WPM with 85% accuracy. Practice with medical and administrative content.</p>
                <div className="exam-button-container">
                  <a href="/aiims-crc-typing-test" className="exam-link">AIIMS CRC Test</a>
                </div>
              </div>
            </div>
          </div>

          {/* Help & Support Section */}
          <div className="help-support-section">
            <h2>Need Help or Have Questions?</h2>
            <p>If you encounter any issues while taking the typing test or have questions about government exam requirements, our support team is here to help.</p>
            <div className="help-actions">
              <a href="/contact-us" className="help-btn primary">Contact Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingTest; 