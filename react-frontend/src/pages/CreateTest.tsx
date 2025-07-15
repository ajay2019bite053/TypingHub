import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TypingEngine from '../components/common/TypingEngine';
import { AI_CONFIG, getMaxLength, cleanGeneratedText } from '../config/aiConfig';
import './CreateTest.css';

const CreateTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSetup, setShowSetup] = useState(true);
  const [customText, setCustomText] = useState('');
  const [aiGeneratedText, setAiGeneratedText] = useState('');
  const [passagePrompt, setPassagePrompt] = useState('');
  const [textLength, setTextLength] = useState('150-200');
  const [isGenerating, setIsGenerating] = useState(false);
  const [useAiText, setUseAiText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (!showSetup) {
        setShowSetup(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [showSetup]);

  // Update URL when test starts
  useEffect(() => {
    if (!showSetup) {
      navigate('/create-test/testing', { replace: true });
    } else {
      navigate('/create-test', { replace: true });
    }
  }, [showSetup, navigate]);

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
    
    // Create dynamic prompt based on search topic
    const prompt = `Write a ${textLength} paragraph about ${searchText} in the style of SSC CGL/CHSL/RRB-NTPC typing exams. Write as a continuous paragraph without titles, headings, or excessive spacing. Focus on government exams, competitive tests, and educational content. Make it suitable for typing practice with proper sentence structure and flow.`;

    // Try each model in order until one works
    for (let i = 0; i < AI_CONFIG.MODELS.length; i++) {
      const model = AI_CONFIG.MODELS[i];
      
      try {
        console.log(`Trying model ${i + 1}/${AI_CONFIG.MODELS.length}: ${model}`);
        console.log('With prompt:', prompt);
        
        const response = await fetch(`${AI_CONFIG.BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${AI_CONFIG.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://typinghub.com',
            'X-Title': 'TypingHub'
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'user', content: prompt }
            ],
            max_tokens: getMaxLength(textLength)
          })
        });

        if (!response.ok) {
          console.log(`Model ${model} failed with status: ${response.status}`);
          continue; // Try next model
        }

        const data = await response.json();
        console.log('OpenRouter Response:', data);
        
        const generatedText = data.choices?.[0]?.message?.content || '';

        // Clean and format the generated text
        const cleanedText = generatedText.trim();
        
        if (!cleanedText) {
          console.log(`Model ${model} returned empty text`);
          continue; // Try next model
        }
        
        setAiGeneratedText(cleanedText);
        setUseAiText(true);
        setSearchText(''); // Clear the search box after generating
        console.log(`Successfully generated text using model: ${model}`);
        return; // Success!
        
      } catch (error) {
        console.error(`Error with model ${model}:`, error);
        continue; // Try next model
      }
    }
    
    // If all models failed
    alert('All AI models failed. Please try again later.');
    setIsGenerating(false);
  };

  const generateAiText = async () => {
    if (!passagePrompt.trim()) {
      alert('Please enter a topic or prompt to generate text.');
      return;
    }

    setIsGenerating(true);
    
    // Create dynamic prompt based on user input
    const prompt = `Write a ${textLength} paragraph about ${passagePrompt} in the style of SSC CGL/CHSL/RRB-NTPC typing exams. Write as a continuous paragraph without titles, headings, or excessive spacing. Focus on government exams, competitive tests, and educational content. Make it suitable for typing practice with proper sentence structure and flow.`;

    // Try each model in order until one works
    for (let i = 0; i < AI_CONFIG.MODELS.length; i++) {
      const model = AI_CONFIG.MODELS[i];
      
      try {
        console.log(`Trying model ${i + 1}/${AI_CONFIG.MODELS.length}: ${model}`);
        console.log('With prompt:', prompt);
        
        const response = await fetch(`${AI_CONFIG.BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${AI_CONFIG.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://typinghub.com',
            'X-Title': 'TypingHub'
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'user', content: prompt }
            ],
            max_tokens: getMaxLength(textLength)
          })
        });

        if (!response.ok) {
          console.log(`Model ${model} failed with status: ${response.status}`);
          continue; // Try next model
        }

        const data = await response.json();
        console.log('OpenRouter Response:', data);
        
        const generatedText = data.choices?.[0]?.message?.content || '';

        // Clean and format the generated text
        const cleanedText = generatedText.trim();
        
        if (!cleanedText) {
          console.log(`Model ${model} returned empty text`);
          continue; // Try next model
        }
        
        setAiGeneratedText(cleanedText);
        setUseAiText(true);
        console.log(`Successfully generated text using model: ${model}`);
        return; // Success!
        
      } catch (error) {
        console.error(`Error with model ${model}:`, error);
        continue; // Try next model
      }
    }
    
    // If all models failed
    alert('All AI models failed. Please try again later.');
    setIsGenerating(false);
  };

  const handleProceed = () => {
      setShowSetup(false);
  };

  // Allow proceeding even if customText is empty
  const canProceed = () => true;

  // Only include customPassage if customText is not empty
  const config = {
    testName: 'Create Test',
    timeLimit: 600,
    passageCategory: 'Create Test',
    qualificationCriteria: {
      minWpm: 25,
      minAccuracy: 85
    },
    ...(useAiText && aiGeneratedText.trim() ? { customPassage: aiGeneratedText.trim() } : 
        customText.trim() ? { customPassage: customText.trim() } : {})
  };

  if (showSetup) {
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
            paddingBottom: '20px',
            borderBottom: '2px solid #f0f0f0',
            marginTop: '0px',
            paddingTop: '0px'
          }}>
            <div style={{ display: 'flex', gap: '15px' }}>
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
                  justifyContent: 'center'
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
                  justifyContent: 'center'
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
            padding: '30px',
            border: '1px solid #e8e8e8',
            marginBottom: '30px'
          }}>
            {useAiText ? (
              <div className="custom-text-section" style={{ marginBottom: '0', padding: '0', background: 'transparent', border: 'none' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  marginBottom: '25px',
                  paddingBottom: '15px',
                  borderBottom: '2px solid #e0e0e0',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>🤖</span>
                    <h3 style={{ margin: '0', color: '#2c3e50', fontSize: '1.4rem' }}>AI Text Generator</h3>
                  </div>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1' }}>
                      <label style={{ fontWeight: '600', color: '#2c3e50', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                        Search Text:
                      </label>
                      <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && searchText.trim()) {
                            generateAiTextFromSearch();
                          }
                        }}
                        placeholder="Type a topic (e.g., modi ji, pollution, education) and press Enter..."
                        style={{
                          padding: '8px 12px',
                          border: '2px solid #e0e0e0',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontFamily: 'inherit',
                          backgroundColor: '#fff',
                          width: '100%',
                          boxSizing: 'border-box',
                          flex: '1'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ fontWeight: '600', color: '#2c3e50', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                        Length:
                      </label>
                      <select 
                        value={textLength} 
                        onChange={(e) => setTextLength(e.target.value)}
                        style={{
                          padding: '8px 12px',
                          border: '2px solid #e0e0e0',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontFamily: 'inherit',
                          backgroundColor: '#fff',
                          minWidth: '120px'
                        }}
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
                        onClick={generateAiTextFromSearch}
                        disabled={isGenerating || !searchText.trim()}
                        style={{
                          background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: (isGenerating || !searchText.trim()) ? 'not-allowed' : 'pointer',
                          fontFamily: 'inherit',
                          opacity: (isGenerating || !searchText.trim()) ? 0.7 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          height: 'fit-content',
                          marginTop: 'auto'
                        }}
                      >
                        {isGenerating ? '🔄 Generating...' : '🚀 Generate Passage'}
                      </button>
                    </div>
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
                        {loading ? '🔄 Loading...' : '▶️ Start Test'}
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
                        {loading ? '🔄 Loading...' : '▶️ Start Test'}
              </button>
            </div>
          </div>
            </div>
          </div>
            )}
          </div>

          {/* Action Section - Removed since buttons are now in each section */}
        </div>
          </div>
    );
  }

  return (
    <div className="create-test-page">
      <TypingEngine 
        config={config} 
        backButton={
          <button
            onClick={() => {
              setShowSetup(true);
              navigate('/create-test', { replace: true });
            }}
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
};

export default CreateTest; 