import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TypingEngine from '../components/common/TypingEngine';
import './CreateTest.css';

// API Configuration
const getBackendUrl = () => {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:9501';
  }
  return `https://${hostname}`;
};

const API_BASE_URL = getBackendUrl();

const CreateTest = () => {
  const navigate = useNavigate();
  const [showSetup, setShowSetup] = useState(true);
  const [customText, setCustomText] = useState('');
  const [aiGeneratedText, setAiGeneratedText] = useState('');
  const [passagePrompt, setPassagePrompt] = useState('');
  const [textLength, setTextLength] = useState('150-200');
  const [isGenerating, setIsGenerating] = useState(false);
  const [useAiText, setUseAiText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  const lengthOptions = [
    { value: '100-150', label: '100-150 words' },
    { value: '150-200', label: '150-200 words' },
    { value: '200-250', label: '200-250 words' },
    { value: '250-300', label: '250-300 words' },
    { value: '300-350', label: '300-350 words' },
    { value: '350-400', label: '350-400 words' },
    { value: '400-450', label: '400-450 words' }
  ];

  // Helper to get min and max word count from textLength
  const getWordRange = (length: string) => {
    switch (length) {
      case '100-150': return { min: 100, max: 150 };
      case '150-200': return { min: 150, max: 200 };
      case '200-250': return { min: 200, max: 250 };
      case '250-300': return { min: 250, max: 300 };
      case '300-350': return { min: 300, max: 350 };
      case '350-400': return { min: 350, max: 400 };
      case '400-450': return { min: 400, max: 450 };
      default: return { min: 150, max: 200 };
    }
  };

  // Helper to trim passage to max words
  const trimToMaxWords = (text: string, max: number) => {
    const words = text.trim().split(/\s+/);
    if (words.length > max) {
      return words.slice(0, max).join(' ') + '.';
    }
    return text.trim();
  };

  // Helper to clean up extra blank lines and ensure single line breaks between paragraphs
  const cleanParagraphs = (text: string) => {
    // Remove all line breaks for a single paragraph
    return text.replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const generateAiTextFromSearch = async () => {
    if (!searchText.trim()) {
      alert('Please enter a topic to generate text.');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/generate-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchText: searchText.trim(),
          textLength: textLength
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate text');
      }

      const data = await response.json();
      console.log('AI Response:', data);
      
      setAiGeneratedText(data.text);
      setSearchText('');
      setIsGenerating(false);
      
    } catch (error: any) {
      console.error('AI generation error:', error);
      alert(error.message || 'Failed to generate text. Please try again or use a different topic.');
      setIsGenerating(false);
    }
  };

  const generateAiText = async () => {
    if (!passagePrompt.trim()) {
      alert('Please enter a topic or prompt to generate text.');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/generate-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: passagePrompt.trim(),
          textLength: textLength
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate text');
      }

      const data = await response.json();
      console.log('AI Response:', data);
      
      setAiGeneratedText(data.text);
      setUseAiText(true);
      setIsGenerating(false);
      
    } catch (error: any) {
      console.error('AI generation error:', error);
      alert(error.message || 'Failed to generate text. Please try again.');
      setIsGenerating(false);
    }
  };

  const handleProceed = () => {
    setShowSetup(false);
  };

  const config = {
    testName: 'Create Test',
    timeLimit: 600,
    passageCategory: 'Create Test',
    qualificationCriteria: {
      minWpm: 25,
      minAccuracy: 85
    },
    customPassage: useAiText ? (aiGeneratedText.trim() || '') : (customText.trim() || '')
  };

  if (!showSetup) {
    return (
      <div className="create-test-page">
        <TypingEngine 
          config={config} 
          backButton={
            <button
              onClick={() => setShowSetup(true)}
              style={{
                background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              ⬅️ Back to Settings
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="create-test-setup">
      <div className="setup-container" style={{ paddingTop: '0', marginTop: '0' }}>
        {/* Header Section */}
        <div style={{ 
          display: 'flex', 
          gap: '30px', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '0px',
          paddingBottom: '0px',
          borderBottom: 'none',
          marginTop: '0px',
          paddingTop: '0px'
        }}>
          <div style={{ display: 'flex', gap: '15px', width: '100%' }}>
            <button
              className={`mode-btn ${useAiText ? 'active' : ''}`}
              onClick={() => setUseAiText(true)}
              style={{
                background: useAiText ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa',
                color: useAiText ? 'white' : '#2c3e50',
                border: '2px solid #e0e0e0',
                padding: '14px 20px',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: '200px',
                justifyContent: 'center',
                flex: '1'
              }}
            >
              🤖 Use AI for generating passage
            </button>
            <button
              className={`mode-btn ${!useAiText ? 'active' : ''}`}
              onClick={() => setUseAiText(false)}
              style={{
                background: !useAiText ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa',
                color: !useAiText ? 'white' : '#2c3e50',
                border: '2px solid #e0e0e0',
                padding: '14px 20px',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: '200px',
                justifyContent: 'center',
                flex: '1'
              }}
            >
              ✏️ Use your own custom passage
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="create-test-content">
          {useAiText ? (
            <div className="ai-section">
              {/* Search Section */}
              <div className="search-section">
                <div className="search-row">
                  <input
                    type="text"
                    placeholder="Enter topic (e.g., 'Modi ji speeches', 'climate change', 'Indian economy')"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="search-input"
                  />
                  <button
                    onClick={generateAiTextFromSearch}
                    disabled={isGenerating}
                    className="search-btn"
                  >
                    {isGenerating ? '🔄 Generating...' : '🚀 Generate Passage'}
                  </button>
                </div>
              </div>

              {/* Generated Text Area */}
              <div className="text-input-container">
                <div className="textarea-container" style={{ flex: '1', marginLeft: '0' }}>
                  <textarea
                    className="text-area"
                    value={aiGeneratedText}
                    onChange={(e) => setAiGeneratedText(e.target.value)}
                    placeholder="Generated text will appear here..."
                    rows={8}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="custom-section">
              <div className="text-section">
                <div className="text-header">
                  <h3>Custom Text Input</h3>
                  <div className="text-stats">
                    <span>Words: {customText.trim().split(/\s+/).filter((word: string) => word.length > 0).length}</span>
                    <span>Characters: {customText.length}</span>
                  </div>
                </div>
                <textarea
                  className="text-area"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Write or paste your custom text here... (Minimum 10 words recommended)"
                  rows={8}
                />
              </div>
            </div>
          )}
        </div>

        {/* Proceed Button */}
        <div className="proceed-section">
          <div className="proceed-container">
            <button
              className="proceed-btn"
              onClick={handleProceed}
              disabled={loading}
            >
              {loading ? '🔄 Loading...' : 'Continue to Test'}
            </button>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="help-section">
        <h2>Complete Guide to Using This Typing Test Tool</h2>
        
        <div className="help-content">
          <div className="help-grid">
            <div className="help-card ai">
              <h3>AI Text Generator</h3>
              <p>
                <strong>Our AI-powered text generator</strong> creates unique, engaging content for your typing practice. Simply enter any topic that interests you, such as "Modi ji speeches", "climate change effects", "Indian economy growth", or "technology trends 2024". The AI will generate relevant, well-structured text based on your chosen topic.
              </p>
              <p>
                <strong>Choose your preferred text length</strong> from the dropdown menu, ranging from 100 to 450 words. For beginners, we recommend 150-200 words as it provides a good balance between challenge and manageability. Advanced users can opt for longer texts to test their endurance and speed.
              </p>
              <p>
                <strong>After generation, you can edit the text</strong> to add your personal touch, correct any minor issues, or modify the content to better suit your practice needs. Once satisfied, click "Continue to Test" to begin your typing practice session with the generated content.
              </p>
            </div>
            
            <div className="help-card custom">
              <h3>Custom Text Input</h3>
              <p>
                <strong>For complete control over your practice material</strong>, switch to the Custom Text mode. This allows you to use any text that interests you - whether it's an article you found online, a passage from your favorite book, a news report, or even your own written content.
              </p>
              <p>
                <strong>Simply paste or type your chosen text</strong> into the text area. There's no limit on content length, but we recommend at least 10 words for a meaningful practice session. You can use content in any language, making this tool perfect for multilingual typing practice.
              </p>
              <p>
                <strong>Custom text is ideal for targeted practice</strong> - you can focus on specific topics, vocabulary, or writing styles that match your learning goals. Whether you're preparing for exams, improving professional writing skills, or just enjoying your favorite content, this mode gives you complete flexibility.
              </p>
            </div>
          </div>

          <div className="help-tips">
            <h4>Expert Tips for Maximum Typing Improvement</h4>
            <p>
              <strong>For AI-generated content:</strong> Use specific, detailed topics like "Indian economic reforms", "global climate change solutions", "artificial intelligence in healthcare", or "sustainable development goals". The more specific your topic, the better quality content the AI will generate. Try different topics to expose yourself to various writing styles and vocabulary.
            </p>
            <p>
              <strong>Optimal text length selection:</strong> Beginners should start with 150-200 words to build confidence and develop proper typing rhythm. Intermediate users can challenge themselves with 250-300 words, while advanced typists can practice with 350-450 words for endurance training. Remember, consistency in practice is more important than length.
            </p>
            <p>
              <strong>Custom text recommendations:</strong> Use articles from reputable news sources, educational content, or professional documents that match your field of interest. This not only improves typing skills but also enhances your knowledge. Consider using content in different languages if you're multilingual.
            </p>
            <p>
              <strong>Practice strategy:</strong> Focus on accuracy first - speed will naturally improve with consistent practice. Take regular breaks during longer sessions, and practice daily for 15-30 minutes rather than occasional long sessions. Track your progress over time to stay motivated and identify areas for improvement.
            </p>
            <p>
              <strong>Advanced techniques:</strong> Once comfortable with basic typing, challenge yourself with complex sentences, technical terms, or content in different languages. Use the custom text mode to practice specific vocabulary or writing styles relevant to your profession or studies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTest; 