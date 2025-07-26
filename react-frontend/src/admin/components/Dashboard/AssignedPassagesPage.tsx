import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileAlt, 
  faTimes,
  faExternalLinkAlt,
  faExclamationTriangle,
  faInfoCircle,
  faUnlink,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './AssignedPassagesPage.css';
import { API_BASE_URL } from '../../../utils/api';

interface Passage {
  _id: string;
  title: string;
  content: string;
  testTypes: string[];
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

const AssignedPassagesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTestType, setSelectedTestType] = useState<string | null>(null);
  const [assignedPassages, setAssignedPassages] = useState<Passage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPassagesByTestType = async (testType: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${API_BASE_URL}/passages/test/${encodeURIComponent(testType)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch passages');
      }

      const data = await response.json();
      setAssignedPassages(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setAssignedPassages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestTypeClick = (testType: string) => {
    setSelectedTestType(testType);
    fetchPassagesByTestType(testType);
  };

  const handleUnassign = async (passageId: string, testType: string) => {
    if (!window.confirm(`Are you sure you want to unassign this passage from ${testType}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No authentication token found');

      const passage = assignedPassages.find(p => p._id === passageId);
      if (!passage) throw new Error('Passage not found');

      const updatedTestTypes = passage.testTypes.filter(t => t !== testType);
      
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
  };

  return (
    <div className="assigned-passages-page">
      <div className="page-content">
        <div className="test-categories-section">
          <h2>Select Test Category</h2>
          <div className="test-categories-grid">
            {TEST_CATEGORIES.map(category => (
              <button 
                key={category.id} 
                className={`test-category-card ${selectedTestType === category.name ? 'active' : ''}`}
                onClick={() => handleTestTypeClick(category.name)}
              >
                <div className="category-icon">
                  <FontAwesomeIcon icon={faFileAlt} />
                </div>
                <div className="category-name prominent">{category.name}</div>
                <div className="category-arrow">
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedTestType && (
          <div className="passages-section">
            <div className="section-header">
              <h2>{selectedTestType} - Assigned Passages</h2>
              {!isLoading && !error && (
                <div className="passage-count">
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <span>Total passages: {assignedPassages.length}</span>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading assigned passages...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <FontAwesomeIcon icon={faExclamationTriangle} size="2x" />
                <p>Error: {error}</p>
              </div>
            ) : assignedPassages.length === 0 ? (
              <div className="empty-container">
                <FontAwesomeIcon icon={faFileAlt} size="3x" />
                <h3>No Passages Assigned</h3>
                <p>No passages have been assigned to {selectedTestType} yet.</p>
              </div>
            ) : (
              <div className="passages-grid">
                {assignedPassages.map(passage => (
                  <div key={passage._id} className="passage-card">
                    <div className="passage-content">
                      <h3>{passage.title}</h3>
                    </div>
                    <div className="passage-actions">
                      <button 
                        className="unassign-btn"
                        onClick={() => handleUnassign(passage._id, selectedTestType)}
                      >
                        <FontAwesomeIcon icon={faUnlink} />
                        Unassign
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedPassagesPage; 