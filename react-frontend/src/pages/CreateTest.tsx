import React, { useState } from 'react';
import TypingEngine from '../components/common/TypingEngine';
import './CreateTest.css';

const CreateTest = () => {
  const [showSetup, setShowSetup] = useState(true);
  const [customText, setCustomText] = useState('');
  const [loading, setLoading] = useState(false);

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
    ...(customText.trim() ? { customPassage: customText.trim() } : {})
  };

  if (showSetup) {
  return (
      <div className="create-test-setup">
        <div className="setup-container">
          <div className="setup-header">
            <h1>✨ Create Custom Test</h1>
          </div>
          <div className="custom-text-section">
            <div className="text-input-container">
              <div className="instructions-sidebar">
                <h3>How to give test:</h3>
                <ul>
                  <li>Write or paste your text (optional)</li>
                  <li>Click "Proceed to Test"</li>
                  <li>Type the text as shown</li>
                  <li>Complete within time limit</li>
                </ul>
              </div>
              <div className="textarea-container">
          <textarea
                  className="custom-textarea"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Write or paste your custom text here... (Minimum 10 words recommended, or leave blank to use default passage)"
                  rows={8}
                />
                <div className="text-info">
                  <span>Words: {customText.trim().split(/\s+/).filter(word => word.length > 0).length}</span>
                  <span>Characters: {customText.length}</span>
                </div>
                <div className="setup-actions">
              <button
                    className="proceed-button"
                    onClick={handleProceed}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : '🚀 Proceed to Test'}
              </button>
            </div>
          </div>
            </div>
          </div>
        </div>
          </div>
    );
  }

  return (
    <div className="create-test-page">
      <TypingEngine config={config} />
    </div>
  );
};

export default CreateTest; 