import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faKeyboard, faFileAlt, faClock, faChartLine, faMicrochip, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import './CourseDetailsModal.css';

interface CourseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: CourseDetail;
}

interface CourseDetail {
  title: string;
  description: string;
  features: string[];
  price?: string;
  buttonText?: string;
  buttonAction?: () => void;
}

const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({ isOpen, onClose, course }) => {
  if (!isOpen) return null;

  const getFeatureIcon = (feature: string) => {
    if (feature.includes('Exam Interface') || feature.includes('Mock Tests')) return faFileAlt;
    if (feature.includes('Virtual Keyboard')) return faKeyboard;
    if (feature.includes('Progress History') || feature.includes('Analysis')) return faChartLine;
    if (feature.includes('Time') || feature.includes('Duration')) return faClock;
    if (feature.includes('AI Feedback')) return faMicrochip;
    if (feature.includes('Structured Lessons')) return faClipboardList;
    return faTimes; // Default if no match
  };

  return (
    <div className="course-details-modal-overlay">
      <div className="course-details-modal-content">
        <button className="course-details-close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h3 className="course-details-title">{course.title}</h3>
        <p className="course-details-description">{course.description}</p>
        
        <div className="course-features-grid">
          {course.features.map((feature, index) => (
            <div key={index} className="course-feature-item">
              <FontAwesomeIcon icon={getFeatureIcon(feature)} className="feature-icon" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {course.price && <div className="course-price">Price: {course.price}</div>}
        
        {course.buttonText && (
          <button className="course-action-btn" onClick={course.buttonAction || onClose}>
            {course.buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseDetailsModal; 