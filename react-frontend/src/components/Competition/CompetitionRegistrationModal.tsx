import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faUser, 
  faMobile, 
  faCreditCard,
  faTrophy,
  faUsers,
  faCheckCircle,
  faRefresh
} from '@fortawesome/free-solid-svg-icons';
import { useCompetition } from '../../contexts/CompetitionContext';
import Toast, { ToastType } from '../Toast/Toast';
import SecretIdPopup from './SecretIdPopup';
import paymentService from '../../services/paymentService';
import './CompetitionRegistrationModal.css';

interface CompetitionRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CompetitionRegistrationModal: React.FC<CompetitionRegistrationModalProps> = ({ isOpen, onClose }) => {
  const { competitionStatus, registerForCompetition, isLoading, fetchCompetitionStatus } = useCompetition();
  const [formData, setFormData] = useState({
    name: '',
    mobile: ''
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
  const [showSecretIdPopup, setShowSecretIdPopup] = useState(false);
  const [secretId, setSecretId] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Remove lastUpdated state to prevent unnecessary re-renders
  // const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshTimeout, setRefreshTimeout] = useState<NodeJS.Timeout | null>(null);

  // Refresh competition status when modal opens
  useEffect(() => {
    if (isOpen) {
      handleRefreshStatus();
    }
  }, [isOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
    };
  }, [refreshTimeout]);

  // Remove the problematic auto-refresh interval and change detection
  // useEffect(() => {
  //   if (isOpen) {
  //     handleRefreshStatus();
  //     
  //     // Set up automatic refresh every 10 seconds
  //     const refreshInterval = setInterval(() => {
  //       fetchCompetitionStatus();
  //     }, 10000); // Refresh every 10 seconds
  //     
  //     // Cleanup interval when modal closes
  //     return () => {
  //       clearInterval(refreshInterval);
  //     };
  //   }
  // }, [isOpen, fetchCompetitionStatus]);

  // Remove the problematic change detection
  // useEffect(() => {
  //   if (competitionStatus && lastUpdated) {
  //     // Check if prizes or fees have changed
  //     const currentPrizes = competitionStatus.prizes;
  //     const currentEntryFee = competitionStatus.entryFee;
  //     
  //     // You can add more sophisticated change detection here
  //     if (currentPrizes && currentEntryFee) {
  //       showToast('error', 'Competition details updated! Check the latest prizes and fees.');
  //     }
  //   }
  // }, [competitionStatus]);

  const handleRefreshStatus = async () => {
    // Prevent multiple rapid refresh calls
    if (isRefreshing) return;
    
    // Clear any existing timeout
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }
    
    // Set a small delay to prevent rapid successive calls
    const timeout = setTimeout(async () => {
      setIsRefreshing(true);
      try {
        await fetchCompetitionStatus();
        showToast('success', 'Competition status refreshed!');
      } catch (error) {
        showToast('error', 'Failed to refresh competition status');
      } finally {
        setIsRefreshing(false);
      }
    }, 300); // 300ms delay
    
    setRefreshTimeout(timeout);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.mobile.trim()) {
      showToast('error', 'Please fill in all fields');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      showToast('error', 'Please enter a valid mobile number');
      return;
    }

    const isFreeCompetition = (competitionStatus?.entryFee || 0) === 0;

    if (isFreeCompetition) {
      // Handle free competition registration
      console.log('Free competition detected, entry fee:', competitionStatus?.entryFee);
      try {
        const registrationData = {
          name: formData.name.trim(),
          mobile: formData.mobile.trim(),
          // Don't send payment fields for free competitions
        };
        console.log('Sending free registration data:', registrationData);
        
        const result = await registerForCompetition(registrationData);

        if (result.success) {
          setSecretId(result.data.secretId);
          setShowSecretIdPopup(true);
          setFormData({ name: '', mobile: '' });
          showToast('success', 'Free registration successful!');
        } else {
          showToast('error', result.message || 'Registration failed');
        }
      } catch (err: any) {
        console.error('Free registration error:', err);
        showToast('error', err.message || 'Registration failed');
      }
    } else {
      // Handle paid competition registration
      setIsProcessingPayment(true);
      try {
        // 1. Load Razorpay SDK
        await paymentService.loadRazorpaySDK();

        // 2. Create order from backend
        const receipt = `competition_${Date.now()}`;
        const amount = competitionStatus?.entryFee || 10;
        const order = await paymentService.createOrder(amount, receipt, {
          name: formData.name.trim(),
          mobile: formData.mobile.trim(),
          type: 'competition',
        });

        // 3. Open Razorpay payment popup
        const paymentResponse = await paymentService.initializeRazorpayPayment(
          order.orderId,
          order.amount,
          order.currency,
          'TypingHub',
          'Competition Registration',
          {
            name: formData.name.trim(),
            contact: formData.mobile.trim(),
          },
          { competition: true }
        );

        // 4. Verify payment on backend
        await paymentService.verifyPayment({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        });

        // 5. Register for competition only after payment success
        const result = await registerForCompetition({
          name: formData.name.trim(),
          mobile: formData.mobile.trim(),
          paymentId: paymentResponse.razorpay_payment_id,
          paymentAmount: amount,
        });

        if (result.success) {
          setSecretId(result.data.secretId);
          setShowSecretIdPopup(true);
          setFormData({ name: '', mobile: '' });
          // Remove automatic refresh to prevent modal instability
          // await fetchCompetitionStatus();
        } else {
          showToast('error', result.message || 'Registration failed');
        }
      } catch (err: any) {
        showToast('error', err.message || 'Payment or registration failed');
      } finally {
        setIsProcessingPayment(false);
      }
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
      <div className="competition-modal-overlay" onClick={onClose}>
        <div className="competition-modal" onClick={(e) => e.stopPropagation()}>
          <div className="competition-modal-header">
            <h2>Register for Weekly Competition</h2>
            <div className="header-actions">
              <button 
                className="refresh-btn" 
                onClick={handleRefreshStatus}
                disabled={isRefreshing}
                title="Refresh competition status"
              >
                <FontAwesomeIcon icon={faRefresh} spin={isRefreshing} />
              </button>
              <button className="competition-modal-close" onClick={onClose}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>

          <div className="competition-modal-content">
            <div className="competition-info">
              {/* Only show loading when manually refreshing, not during normal operation */}
              {isRefreshing ? (
                <div className="competition-loading">
                  <div className="spinner"></div>
                  <span>Refreshing competition status...</span>
                </div>
              ) : (
                <>
                  <div className="competition-prize-info">
                    <div className="prize-item">
                      <FontAwesomeIcon icon={faTrophy} className="prize-icon first" />
                      <span>1st: ₹{competitionStatus?.prizes?.first || 100}</span>
                    </div>
                    <div className="prize-item">
                      <FontAwesomeIcon icon={faTrophy} className="prize-icon second" />
                      <span>2nd: ₹{competitionStatus?.prizes?.second || 50}</span>
                    </div>
                    <div className="prize-item">
                      <FontAwesomeIcon icon={faTrophy} className="prize-icon third" />
                      <span>3rd: ₹{competitionStatus?.prizes?.third || 25}</span>
                    </div>
                  </div>

                  <div className="competition-stats">
                    <div className="stat-item">
                      <FontAwesomeIcon icon={faUsers} />
                      <span>Slots: {competitionStatus?.totalRegistrations || 0}/{competitionStatus?.maxSlots || 100}</span>
                    </div>
                    <div className="stat-item">
                      <FontAwesomeIcon icon={faCreditCard} />
                      <span>
                        Entry Fee: {(competitionStatus?.entryFee || 0) === 0 ? (
                          <span className="free-badge">FREE</span>
                        ) : (
                          `₹${competitionStatus?.entryFee || 10}`
                        )}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <form onSubmit={handleSubmit} className="competition-form">
              <div className="form-group">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter your mobile number"
                  pattern="[6-9][0-9]{9}"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="competition-submit-btn"
                disabled={isLoading || isProcessingPayment}
              >
                {isLoading || isProcessingPayment ? (
                  <>
                    <div className="spinner"></div>
                    Processing...
                  </>
                ) : (competitionStatus?.entryFee || 0) === 0 ? (
                  <>
                    <FontAwesomeIcon icon={faCheckCircle} />
                    Register for Free
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCheckCircle} />
                    Pay ₹{competitionStatus?.entryFee || 10} & Register
                  </>
                )}
              </button>
            </form>

            <div className="competition-terms">
              <p>
                By registering, you agree to participate in the typing competition. 
                The test can only be taken once. Results will be announced after the competition ends.
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

      <SecretIdPopup
        isOpen={showSecretIdPopup}
        secretId={secretId}
        onClose={() => setShowSecretIdPopup(false)}
      />
    </>
  );
};

export default CompetitionRegistrationModal;

