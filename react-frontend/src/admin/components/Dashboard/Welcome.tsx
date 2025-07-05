import React, { useState } from 'react';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import './Welcome.css';

const Welcome: React.FC = () => {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="welcome-section">
      <h2>Hello, Admin! 🌟 Let's Shape the Future of TypingHub! 🚀</h2>
      <p>
        Welcome to your Admin Dashboard, the heart of TypingHub! You're the driving force behind helping thousands of users achieve their typing dreams and excel in their government exams. From creating engaging passages to assigning them to various tests, your role is pivotal in ensuring our users get the best practice experience.
      </p>
      <p>
        Let's make learning fun, interactive, and impactful! Whether it's crafting new passages, managing existing ones, or assigning them to tests, every action you take here empowers users to type faster, smarter, and with confidence. Together, we can help them ace exams like SSC, RRB, and CPCT, and secure their dream jobs.
      </p>
      <p>
        So, let's dive in with full energy, create amazing content, and inspire our users to reach new heights in their typing journey! Ready to make a difference today? Let's get started! 💻✨
      </p>
      
      <div className="demo-section">
        <h3>🎯 Loading States Demo</h3>
        <p>Check out the improved loading states we just added:</p>
        
        <div className="loading-demos">
          <div className="demo-item">
            <h4>Spinner Type</h4>
            <LoadingSpinner type="spinner" text="Loading..." size="medium" />
          </div>
          
          <div className="demo-item">
            <h4>Dots Type</h4>
            <LoadingSpinner type="dots" text="Processing..." size="medium" />
          </div>
          
          <div className="demo-item">
            <h4>Pulse Type</h4>
            <LoadingSpinner type="pulse" text="Saving..." size="medium" />
          </div>
          
          <div className="demo-item">
            <h4>Small Size</h4>
            <LoadingSpinner type="dots" text="" size="small" />
          </div>
        </div>
        
        <div className="feature-highlights">
          <h3>✨ New Features Added:</h3>
          <ul>
            <li>✅ <strong>Loading States</strong> - Better user feedback during operations</li>
            <li>🔄 <strong>Multiple Spinner Types</strong> - Spinner, Dots, and Pulse animations</li>
            <li>📱 <strong>Responsive Design</strong> - Works great on all devices</li>
            <li>🎨 <strong>Customizable</strong> - Different sizes, colors, and text</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Welcome; 