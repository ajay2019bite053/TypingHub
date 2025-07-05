import React, { useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faExclamationTriangle, 
  faInfoCircle, 
  faTimes,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
  show?: boolean;
}

const Toast: React.FC<ToastProps> = ({ 
  type, 
  message, 
  onClose, 
  duration = 5000,
  show = true 
}) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearTimer();

    if (show && duration > 0) {
      timerRef.current = setTimeout(() => {
        onClose();
      }, duration);
    }

    return () => {
      clearTimer();
    };
  }, [show, duration, onClose, clearTimer]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return faCheckCircle;
      case 'error':
        return faTimesCircle;
      case 'warning':
        return faExclamationTriangle;
      case 'info':
        return faInfoCircle;
      default:
        return faInfoCircle;
    }
  };

  const getToastClass = () => {
    return `toast toast-${type} ${show ? 'show' : ''}`;
  };

  return (
    <div 
      className={getToastClass()}
      role="alert"
      aria-live="polite"
    >
      <div className="toast-icon">
        <FontAwesomeIcon icon={getIcon()} aria-hidden="true" />
      </div>
      <div className="toast-content">
        <p className="toast-message">{message}</p>
      </div>
      <button 
        className="toast-close" 
        onClick={onClose}
        aria-label="Close notification"
      >
        <FontAwesomeIcon icon={faTimes} aria-hidden="true" />
      </button>
    </div>
  );
};

export default Toast; 