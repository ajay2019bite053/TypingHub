import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  type?: 'spinner' | 'dots' | 'pulse';
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium',
  color = '#1976d2',
  text = 'Loading...',
  type = 'spinner',
  fullScreen = false
}) => {
  const spinnerSize = {
    small: '30px',
    medium: '50px',
    large: '70px'
  }[size];

  const renderSpinner = () => {
    switch (type) {
      case 'dots':
        return (
          <div className="dots-spinner">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        );
      case 'pulse':
        return (
          <div 
            className="pulse-spinner"
            style={{ backgroundColor: color }}
          ></div>
        );
      default:
        return (
          <FontAwesomeIcon 
            icon={faSpinner} 
            spin 
            size={size === 'small' ? '1x' : size === 'medium' ? '2x' : '3x'}
            style={{ color }}
          />
        );
    }
  };

  const content = (
    <div className="loading-container">
      {renderSpinner()}
      {text && <p className="loading-text">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loading-overlay">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner; 