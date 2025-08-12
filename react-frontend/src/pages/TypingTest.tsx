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
        <meta name="keywords" content="free typing test, government exam typing, typing speed test, typing practice, SSC typing, RRB typing, online typing test" />
        <link rel="canonical" href="https://typinghub.in/typing-test" />
        
        {/* Open Graph / Social Media Meta Tags */}
        <meta property="og:title" content="Free Typing Test for Government Exams" />
        <meta property="og:description" content="Practice typing test with real exam patterns. Get instant speed and accuracy analysis." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://typinghub.in/typing-test" />
        <meta property="og:image" content="https://typinghub.in/images/typing-test-og.webp" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Typing Test for Government Exams" />
        <meta name="twitter:description" content="Practice typing test with real exam patterns. Get instant analysis." />
        <meta name="twitter:image" content="https://typinghub.in/images/typing-test-og.webp" />
        
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

      {/* Removed container div for full-width layout */}
      <script type="application/ld+json" style={{ display: 'none' }}>
        {JSON.stringify(structuredData)}
      </script>
      <TypingEngine config={config} />
    </div>
  );
};

export default TypingTest; 