import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileAlt, 
  faTimes,
  faExternalLinkAlt,
  faExclamationTriangle,
  faInfoCircle,
  faUnlink,
  faTrash,
  faQuestionCircle,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import './AssignedPassages.css';

interface AssignedPassagesProps {
  onClose: () => void;
  className?: string;
}

interface Passage {
  _id: string;
  title: string;
  content: string;
  testTypes: string[];
}

interface ConfirmationDialog {
  show: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type: 'danger' | 'warning' | 'info';
  action: (() => void) | null;
}

const TEST_CATEGORIES = [
  { id: 'ssc-cgl', name: 'SSC CGL' },
  { id: 'ssc-chsl', name: 'SSC CHSL' },
  { id: 'rrb-ntpc', name: 'RRB NTPC' },
  { id: 'junior-assistant', name: 'Junior Assistant' },
  { id: 'superintendent', name: 'Superintendent' },
  { id: 'junior-court-assistant', name: 'Junior Court Assistant' },
  { id: 'certificate-test', name: 'Certificate Test' },
  { id: 'create-test', name: 'Create Test' },
  { id: 'typing-test', name: 'Typing Test' },
  { id: 'up-police', name: 'UP Police' },
  { id: 'bihar-police', name: 'Bihar Police' },
  { id: 'aiims-crc', name: 'AIIMS CRC' },
  { id: 'allahabad-high-court', name: 'Allahabad High Court' }
];

const API_BASE_URL = 'http://localhost:5000/api';

const AssignedPassages: React.FC<AssignedPassagesProps> = ({ onClose, className }) => {
  const [selectedTestType, setSelectedTestType] = useState<string | null>(null);
  const [assignedPassages, setAssignedPassages] = useState<Passage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState<ConfirmationDialog>({
    show: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'info',
    action: null
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showPopup) {
          setShowPopup(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, showPopup]);

  const showConfirmationDialog = (dialog: Omit<ConfirmationDialog, 'show'>) => {
    setConfirmationDialog({
      ...dialog,
      show: true
    });
  };

  const hideConfirmationDialog = () => {
    setConfirmationDialog(prev => ({ ...prev, show: false }));
  };

  const executeConfirmationAction = () => {
    if (confirmationDialog.action) {
      confirmationDialog.action();
    }
    hideConfirmationDialog();
  };

  const getConfirmationIcon = () => {
    switch (confirmationDialog.type) {
      case 'danger':
        return <FontAwesomeIcon icon={faExclamationTriangle} className="danger-icon" />;
      case 'warning':
        return <FontAwesomeIcon icon={faQuestionCircle} className="warning-icon" />;
      case 'info':
        return <FontAwesomeIcon icon={faCheckCircle} className="info-icon" />;
      default:
        return <FontAwesomeIcon icon={faQuestionCircle} className="info-icon" />;
    }
  };

  const fetchPassagesByTestType = async (testType: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }

      console.log(`Fetching passages for test type: ${testType}`);
      const response = await fetch(`${API_BASE_URL}/passages/test/${encodeURIComponent(testType)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch passages (${response.status})`);
      }

      const data = await response.json();
      console.log(`Received ${data.length} passages for test type: ${testType}`);
      setAssignedPassages(data || []);
    } catch (err) {
      console.error('Error fetching passages:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching passages');
      setAssignedPassages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestTypeClick = (testType: string) => {
    setSelectedTestType(testType);
    setShowPopup(true);
    fetchPassagesByTestType(testType);
  };

  const handleUnassign = async (passageId: string, testType: string) => {
    const passage = assignedPassages.find(p => p._id === passageId);
    if (!passage) {
      setError('Passage not found');
      return;
    }

    showConfirmationDialog({
      title: 'Unassign Passage',
      message: `Are you sure you want to unassign the passage "${passage.title}" from ${testType}? This will remove the passage from this test type but keep it in the system.`,
      confirmText: 'Unassign',
      cancelText: 'Cancel',
      type: 'warning',
      action: async () => {
        try {
          const token = localStorage.getItem('accessToken');
          if (!token) throw new Error('No authentication token found');

          const updatedTestTypes = passage.testTypes.filter((t: string) => t !== testType);
          
          const response = await fetch(`${API_BASE_URL}/passages/${passageId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              title: passage.title,
              content: passage.content,
              testTypes: updatedTestTypes
            })
          });

          if (!response.ok) {
            throw new Error('Failed to unassign passage');
          }

          // Refresh the passages list
          fetchPassagesByTestType(testType);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to unassign passage');
        }
      }
    });
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedTestType(null);
    setAssignedPassages([]);
    setError(null);
  };

  return (
    <>
      <div className={`off-canvas-sidebar ${className || ''}`}>
        <button className="close-sidebar-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        
        <h3>Test Categories</h3>
        <ul>
          {TEST_CATEGORIES.map(category => (
            <li key={category.id} className="exam-section">
              <button 
                className="exam-button"
                onClick={() => handleTestTypeClick(category.name)}
              >
                {category.name} <FontAwesomeIcon icon={faExternalLinkAlt} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Popup Modal for Assigned Passages */}
      <div className={`passages-popup ${showPopup ? 'open' : ''}`}>
        <div className="popup-content">
          <div className="popup-header">
            <h3>{selectedTestType} - Assigned Passages</h3>
            <button className="popup-close-btn" onClick={closePopup}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          
          <div className="popup-body">
            {isLoading ? (
              <div className="spinner-container">
                <div className="spinner"></div>
              </div>
            ) : error ? (
              <div className="no-assigned-passages">
                <FontAwesomeIcon icon={faExclamationTriangle} size="2x" />
                <p>Error: {error}</p>
              </div>
            ) : assignedPassages.length === 0 ? (
              <div className="no-assigned-passages">
                <FontAwesomeIcon icon={faFileAlt} size="2x" />
                <p>No passages assigned to this test yet.</p>
              </div>
            ) : (
              <>
                <div className="modal-header-info">
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <span>Total passages assigned: {assignedPassages.length}</span>
                </div>
                <div className="assigned-passages-list">
                  {assignedPassages.map(passage => (
                    <div key={passage._id} className="assigned-passage-item">
                      <span>{passage.title}</span>
                      <button onClick={() => handleUnassign(passage._id, selectedTestType!)}>
                        <FontAwesomeIcon icon={faTrash} />
                        Unassign
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Confirmation Dialog */}
      {confirmationDialog.show && (
        <div className="modal-overlay">
          <div className={`modal-content confirmation-dialog ${confirmationDialog.type}`}>
            <div className="confirmation-header">
              {getConfirmationIcon()}
              <h3>{confirmationDialog.title}</h3>
            </div>
            <div className="confirmation-body">
              <p>{confirmationDialog.message}</p>
            </div>
            <div className="confirmation-actions">
              <button 
                onClick={hideConfirmationDialog} 
                className="cancel-btn"
              >
                {confirmationDialog.cancelText}
              </button>
              <button 
                onClick={executeConfirmationAction} 
                className={`confirm-btn ${confirmationDialog.type}`}
              >
                {confirmationDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssignedPassages; 