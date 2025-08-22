import React, { useState } from 'react';
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
  const [showSetup, setShowSetup] = useState(true);
  const [customText, setCustomText] = useState('');
  const [aiGeneratedText, setAiGeneratedText] = useState('');
  const [textLength, setTextLength] = useState('150-200');
  const [isGenerating, setIsGenerating] = useState(false);
  const [useAiText, setUseAiText] = useState(true);
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
      setAiGeneratedText(data.text);
      setSearchText('');
      setIsGenerating(false);
      
    } catch (error: any) {
      console.error('AI generation error:', error);
      alert(error.message || 'Failed to generate text. Please try again or use a different topic.');
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
              className="create-test-back-btn"
            >
              ⬅️ Back to Settings
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="create-test-container">
      {/* Mode Selection */}
      <div className="create-test-mode-selection">
        <button
          className={`create-test-mode-btn ${useAiText ? 'create-test-active' : ''}`}
          onClick={() => setUseAiText(true)}
        >
          🤖 Use AI for generating passage
        </button>
        <button
          className={`create-test-mode-btn ${!useAiText ? 'create-test-active' : ''}`}
          onClick={() => setUseAiText(false)}
        >
          ✏️ Use your own custom passage
        </button>
      </div>

      {/* Main Content */}
      <div className="create-test-main-content">
        {useAiText ? (
          <div className="create-test-ai-section">
            {/* Search Section */}
            <div className="create-test-search-section">
              <div className="create-test-search-row">
                <div className="create-test-input-group">
                  <label>Topic for Passage</label>
                  <input
                    type="text"
                    placeholder="Enter topic (e.g., 'Modi ji speeches', 'climate change', 'Indian economy')"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="create-test-search-input"
                  />
                </div>
                <div className="create-test-input-group">
                  <label>Passage Length</label>
                  <select
                    value={textLength}
                    onChange={(e) => setTextLength(e.target.value)}
                    className="create-test-length-select"
                  >
                    {lengthOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={generateAiTextFromSearch}
                  disabled={isGenerating || !searchText.trim()}
                  className="create-test-generate-btn"
                >
                  {isGenerating ? '🔄 Generating...' : '🚀 Generate'}
                </button>
              </div>
            </div>

            {/* Generated Text Area */}
            <div className="create-test-text-section">
              <div className="create-test-text-header">
                <h3>Generated Text</h3>
                <div className="create-test-text-stats">
                  <span>Words: {aiGeneratedText.trim().split(/\s+/).filter((word: string) => word.length > 0).length}</span>
                  <span>Characters: {aiGeneratedText.length}</span>
                </div>
              </div>
              <textarea
                className="create-test-text-area"
                value={aiGeneratedText}
                onChange={(e) => setAiGeneratedText(e.target.value)}
                placeholder="Generated text will appear here..."
                rows={8}
              />
            </div>
          </div>
        ) : (
          <div className="create-test-custom-section">
            <div className="create-test-text-section">
              <div className="create-test-text-header">
                <h3>Custom Text Input</h3>
                <div className="create-test-text-stats">
                  <span>Words: {customText.trim().split(/\s+/).filter((word: string) => word.length > 0).length}</span>
                  <span>Characters: {customText.length}</span>
                </div>
              </div>
              <textarea
                className="create-test-text-area"
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
      <div className="create-test-proceed-section">
        <button
          className="create-test-proceed-btn"
          onClick={handleProceed}
          disabled={isGenerating}
        >
          Continue to Test
        </button>
      </div>

      {/* Help Section */}
      <div className="create-test-help-section">
        <h2>Complete Guide to Using This Typing Test Tool</h2>
        
        <div className="create-test-help-content">
          <div className="create-test-help-grid">
            <div className="create-test-help-card">
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
            
            <div className="create-test-help-card">
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

          <div className="create-test-help-tips">
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