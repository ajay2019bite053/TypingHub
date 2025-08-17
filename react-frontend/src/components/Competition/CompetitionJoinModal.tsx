import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faUser, 
  faKey,
  faPlay,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { useCompetition } from '../../contexts/CompetitionContext';
import Toast, { ToastType } from '../Toast/Toast';
import './CompetitionJoinModal.css';

interface CompetitionJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinSuccess: (data: any) => void;
}

const CompetitionJoinModal: React.FC<CompetitionJoinModalProps> = ({ isOpen, onClose, onJoinSuccess }) => {
  const navigate = useNavigate();
  const { competitionStatus, joinCompetition, isLoading } = useCompetition();
  const [formData, setFormData] = useState({
    name: '',
    secretId: ''
  });
  const [toast, setToast] = useState<{
    show: boolean;
    type: ToastType;
    message: string;
  }>({
    show: false,
    type: 'info',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.secretId.trim()) {
      showToast('error', 'Please fill in all fields');
      return;
    }

    const result = await joinCompetition({
      name: formData.name.trim(),
      secretId: formData.secretId.trim()
    });

    if (result.success) {
      showToast('success', 'Competition joined successfully!');
      onJoinSuccess(result.data);
      setFormData({ name: '', secretId: '' });
      setTimeout(() => {
        onClose();
        // Navigate to competition test
        navigate('/competition-test', { 
          state: { 
            competitionData: {
              secretId: result.data.secretId,
              name: result.data.name,
              competitionId: result.data.competitionId
            }
          }
        });
      }, 2000);
    } else {
      showToast('error', result.message || 'Failed to join competition');
    }
  };

  const showToast = (type: ToastType, message: string) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: 'info', message: '' });
    }, 5000);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="competition-join-modal-overlay" onClick={onClose}>
        <div className="competition-join-modal" onClick={(e) => e.stopPropagation()}>
          <div className="competition-join-modal-header">
            <h2>Join Live Competition</h2>
            <button className="competition-join-modal-close" onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="competition-join-modal-content">
            <div className="competition-join-info">
              <div className="competition-status">
                <div className="status-item">
                  <span>Total Participants:</span>
                  <span>{competitionStatus?.totalParticipants || 0}</span>
                </div>
                <div className="status-item">
                  <span>Competition Status:</span>
                  <span className={`status-badge ${competitionStatus?.isCompetitionActive ? 'active' : 'inactive'}`}>
                    {competitionStatus?.isCompetitionActive ? 'LIVE' : 'INACTIVE'}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="competition-join-form">
              <div className="form-group">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name as registered"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  id="secretId"
                  name="secretId"
                  value={formData.secretId}
                  onChange={handleInputChange}
                  placeholder="Enter your secret ID (e.g., TH2025-1234)"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="competition-join-btn"
                disabled={isLoading || !competitionStatus?.isCompetitionActive}
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Joining...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPlay} />
                    Join Competition
                  </>
                )}
              </button>
            </form>

            <div className="competition-join-terms">
              <p>
                <strong>Note:</strong> Make sure your name matches exactly with your registration. 
                The competition test is 10 minutes long and can only be attempted once. 
                If you've already attempted, you cannot join again.
              </p>
            </div>
          </div>
        </div>
      </div>

      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ show: false, type: 'info', message: '' })}
        />
      )}
    </>
  );
};

export default CompetitionJoinModal;
