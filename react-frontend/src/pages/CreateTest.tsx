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

          {/* Main Content Section */}
          <div style={{ 
            background: '#fafafa', 
            borderRadius: '15px', 
            padding: '10px 30px 30px 30px',
            border: '1px solid #e8e8e8',
            marginBottom: '30px',
            marginTop: '0px'
          }}>
            {useAiText ? (
              <div className="custom-text-section" style={{ marginBottom: '0', padding: '0', background: 'transparent', border: 'none' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  marginBottom: '0px',
                  paddingBottom: '0px',
                  borderBottom: '2px solid #e0e0e0',
                  justifyContent: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>🤖</span>
                    <h3 style={{ margin: '0', color: '#2c3e50', fontSize: '1.4rem' }}>AI Text Generator</h3>
                  </div>
                </div>
                
                <div className="search-container">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1' }}>
                    <label className="search-label">
                      Search Text:
                    </label>
                    <input
                      type="text"
                      className="search-input"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && searchText.trim()) {
                          generateAiTextFromSearch();
                        }
                      }}
                      placeholder="Type a topic (e.g., modi ji, pollution, education)..."
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label className="search-label">
                      Length:
                    </label>
                    <select 
                      value={textLength} 
                      onChange={(e) => setTextLength(e.target.value)}
                      className="search-input"
                      style={{ minWidth: '120px' }}
                    >
                      {lengthOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'end' }}>
                    <button
                      className="search-button"
                      onClick={generateAiTextFromSearch}
                      disabled={isGenerating || !searchText.trim()}
                    >
                      {isGenerating ? '🔄 Generating...' : '🚀 Generate Passage'}
                    </button>
                  </div>
                </div>
                
                <div className="text-input-container">
                  <div className="textarea-container" style={{ flex: '1', marginLeft: '0' }}>
                    <textarea
                      className="custom-textarea"
                      value={aiGeneratedText}
                      onChange={(e) => setAiGeneratedText(e.target.value)}
                      placeholder="Generated text will appear here..."
                      rows={10}
                    />
                    <div className="text-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <span>Words: {aiGeneratedText.trim().split(/\s+/).filter(word => word.length > 0).length}</span>
                        <span>Characters: {aiGeneratedText.length}</span>
                      </div>
                      <button
                        className="proceed-button"
                        onClick={handleProceed}
                        disabled={loading}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 20px',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          fontFamily: 'inherit',
                          transition: 'all 0.3s ease',
                          opacity: loading ? 0.7 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {loading ? '🔄 Loading...' : 'Continue to Test'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="custom-text-section" style={{ marginBottom: '0', padding: '0', background: 'transparent', border: 'none' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  marginBottom: '25px',
                  paddingBottom: '15px',
                  borderBottom: '2px solid #e0e0e0'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>✏️</span>
                  <h3 style={{ margin: '0', color: '#2c3e50', fontSize: '1.4rem' }}>Custom Text Input</h3>
                </div>
                <div className="text-input-container">
                  <div className="textarea-container" style={{ flex: '1', marginLeft: '0' }}>
                    <textarea
                      className="custom-textarea"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="Write or paste your custom text here... (Minimum 10 words recommended, or leave blank to use default passage)"
                      rows={10}
                    />
                    <div className="text-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <span>Words: {customText.trim().split(/\s+/).filter(word => word.length > 0).length}</span>
                        <span>Characters: {customText.length}</span>
                      </div>
                      <button
                        className="proceed-button"
                        onClick={handleProceed}
                        disabled={loading}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 20px',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          fontFamily: 'inherit',
                          transition: 'all 0.3s ease',
                          opacity: loading ? 0.7 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {loading ? '🔄 Loading...' : 'Continue to Test'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default CreateTest; 