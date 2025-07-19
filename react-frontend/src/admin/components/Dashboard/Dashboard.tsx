import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAdmin } from '../../../contexts/AdminContext';
import { useAuth } from '../../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faPlus, 
  faList, 
  faUserPlus, 
  faClipboardList,
  faSignOutAlt,
  faTimes,
  faTrash,
  faExclamationTriangle,
  faQuestionCircle,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import Toast, { ToastType } from '../../../components/Toast/Toast';
import Welcome from './Welcome';
import AddPassage from './AddPassage';
import ViewPassages from './ViewPassages';
import AssignPassage from './AssignPassage';
import AssignedPassages from './AssignedPassages';
import AssignedPassagesPage from './AssignedPassagesPage';
import LiveExams from './LiveExams';
import AdminCardManager from './AdminCardManager';
import AdminCouponManager from './AdminCouponManager';
import BlogManager from '../BlogManager/BlogManager';
import './Dashboard.css';

// Types
interface Passage {
  _id: string;
  title: string;
  content: string;
  category?: string;
  createdAt: string;
}

interface AddPassageProps {
  onPassageAdded: () => Promise<void>;
}

interface AssignPassageProps {
  passages: Passage[];
  onPassageAssigned: () => Promise<void>;
}

interface AssignedPassagesProps {
  onClose: () => void;
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

// Constants
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const API_BASE_URL = 'http://localhost:5000/api';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { passages, setPassages } = useAdmin();
  const [activeSection, setActiveSection] = useState('welcome');
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lastLoginAttempt, setLastLoginAttempt] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditPassage, setCurrentEditPassage] = useState<any>(null);
  const [isAssignedSidebarOpen, setIsAssignedSidebarOpen] = useState(false);
  const [selectedTestType, setSelectedTestType] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const passagesPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    type: ToastType;
    message: string;
  }>({
    show: false,
    type: 'info',
    message: ''
  });
  const [confirmationDialog, setConfirmationDialog] = useState<ConfirmationDialog>({
    show: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'info',
    action: null
  });

  const handleLogout = async () => {
    showConfirmationDialog({
      title: 'Confirm Logout',
      message: 'Are you sure you want to logout? Any unsaved changes will be lost.',
      confirmText: 'Logout',
      cancelText: 'Cancel',
      type: 'warning',
      action: async () => {
        try {
          await logout();
          navigate('/admin/login');
        } catch (error) {
          console.error('Error during logout:', error);
        }
      }
    });
  };

  // Force logout function to clear old tokens
  const forceLogout = () => {
    showConfirmationDialog({
      title: 'Force Logout',
      message: 'This will clear all authentication tokens and force you to login again. Are you sure?',
      confirmText: 'Force Logout',
      cancelText: 'Cancel',
      type: 'danger',
      action: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        sessionStorage.clear();
        navigate('/admin/login');
      }
    });
  };

  // Session Management
  const startSessionTimer = useCallback(() => {
    if (sessionTimer) clearTimeout(sessionTimer);
    const timer = setTimeout(() => {
      showConfirmationDialog({
        title: 'Session Expired',
        message: 'Your session has expired. You will be logged out automatically.',
        confirmText: 'OK',
        cancelText: '',
        type: 'warning',
        action: () => {
          handleLogout();
        }
      });
    }, SESSION_TIMEOUT);
    setSessionTimer(timer);
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [sessionTimer]);

  const resetSessionTimer = useCallback(() => {
    startSessionTimer();
  }, [startSessionTimer]);

  // Activity Monitoring
  useEffect(() => {
    const handleActivity = () => {
      resetSessionTimer();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('click', handleActivity);
      if (sessionTimer) clearTimeout(sessionTimer);
    };
  }, [resetSessionTimer, sessionTimer]);

  // Security Functions
  const isSecureContext = () => {
    return window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost';
  };

  const checkBrowserSecurity = () => {
    if (!isSecureContext()) {
      console.warn('Warning: Application is not running in a secure context');
    }
    if (!window.crypto || !window.crypto.subtle) {
      console.error('Error: Cryptographic features are not available');
      return false;
    }
    return true;
  };

  // Token Management
  const refreshToken = async () => {
    try {
      const response = await axios.post('/api/auth/refresh-token', {}, {
        withCredentials: true
      });
      return response.data.accessToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      await handleLogout();
      throw error;
    }
  };

  // API Functions
  const fetchWithAuth = async (url: string, options: any = {}) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No access token');

      const response = await axios({
        url,
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          const newToken = await refreshToken();
          return axios({
            url,
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${newToken}`
            }
          });
        } catch (refreshError) {
          throw refreshError;
        }
      }
      throw error;
    }
  };

  // Passage Management
  const fetchAllPassages = async () => {
    try {
      setIsLoading(true);
      const data = await fetchWithAuth(`${API_BASE_URL}/passages`);
      setPassages(data);
    } catch (error) {
      console.error('Error fetching passages:', error);
      showToast('error', 'Error loading passages. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPassage = async (passageId: string) => {
    const passage = passages.find(p => p._id === passageId);
    if (!passage) {
      showToast('error', 'Passage not found. Please refresh the page and try again.');
      return;
    }
    setCurrentEditPassage(passage);
    setIsEditModalOpen(true);
  };

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

  const handleDeletePassage = (passageId: string) => {
    const passage = passages.find(p => p._id === passageId);
    if (!passage) {
      showToast('error', 'Passage not found.');
      return;
    }

    showConfirmationDialog({
      title: 'Delete Passage',
      message: `Are you sure you want to delete the passage "${passage.title}"? This action cannot be undone and will permanently remove the passage from the system.`,
      confirmText: 'Delete Passage',
      cancelText: 'Cancel',
      type: 'danger',
      action: async () => {
        try {
          await fetchWithAuth(`${API_BASE_URL}/passages/${passageId}`, {
            method: 'DELETE'
          });
          await fetchAllPassages();
          showToast('success', 'Passage deleted successfully!');
        } catch (error) {
          console.error('Error deleting passage:', error);
          showToast('error', 'Error deleting passage. Please try again.');
        }
      }
    });
  };

  const handleSaveEdit = async (editedPassage: any) => {
    showConfirmationDialog({
      title: 'Save Changes',
      message: 'Are you sure you want to save these changes? This will update the passage permanently.',
      confirmText: 'Save Changes',
      cancelText: 'Cancel',
      type: 'info',
      action: async () => {
        try {
          await fetchWithAuth(`${API_BASE_URL}/passages/${editedPassage._id}`, {
            method: 'PUT',
            data: editedPassage
          });
          setPassages(passages.map(p => p._id === editedPassage._id ? editedPassage : p));
          setIsEditModalOpen(false);
          setCurrentEditPassage(null);
          showToast('success', 'Passage updated successfully!');
        } catch (error) {
          console.error('Error updating passage:', error);
          showToast('error', 'Error updating passage. Please try again.');
        }
      }
    });
  };

  // Navigation
  const handleSectionChange = (section: string) => {
    if (isEditModalOpen) {
      showConfirmationDialog({
        title: 'Unsaved Changes',
        message: 'You have unsaved changes. Are you sure you want to leave this page?',
        confirmText: 'Leave Page',
        cancelText: 'Stay Here',
        type: 'warning',
        action: () => {
          setIsEditModalOpen(false);
          setCurrentEditPassage(null);
          setActiveSection(section);
          if (section === 'view-passages' || section === 'assign-passage') {
            fetchAllPassages();
          }
          if (isAssignedSidebarOpen) {
            setIsAssignedSidebarOpen(false);
          }
        }
      });
    } else {
      setActiveSection(section);
      if (section === 'view-passages' || section === 'assign-passage') {
        fetchAllPassages();
      }
      if (isAssignedSidebarOpen) {
        setIsAssignedSidebarOpen(false);
      }
    }
  };

  const handleAssignedPassagesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAssignedSidebarOpen(true);
  };

  // Render Functions
  const renderContent = () => {
    switch (activeSection) {
      case 'welcome':
        return <Welcome />;
      case 'add-passage':
        return <AddPassage onPassageAdded={fetchAllPassages} />;
      case 'view-passages':
        return (
          <ViewPassages
            passages={passages}
            onEdit={handleEditPassage}
            onDelete={handleDeletePassage}
          />
        );
      case 'assign-passage':
        return <AssignPassage passages={passages} onPassageAssigned={fetchAllPassages} />;
      case 'assigned-passages':
        return <AssignedPassagesPage />;
      case 'live-exams':
        return <LiveExams />;
      case 'manage-cards':
        return <AdminCardManager />;
      case 'manage-coupons':
        return <AdminCouponManager />;
      case 'blog-manager':
        return <BlogManager />;
      default:
        return <Welcome />;
    }
  };

  const showToast = (type: ToastType, message: string) => {
    setToast({ show: true, type, message });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
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

  return (
    <div className="admin-dashboard">
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button 
          onClick={() => handleSectionChange('welcome')}
          className={activeSection === 'welcome' ? 'active' : ''}
        >
          <FontAwesomeIcon icon={faHome} /> Dashboard
        </button>
        <button 
          onClick={() => handleSectionChange('add-passage')}
          className={activeSection === 'add-passage' ? 'active' : ''}
        >
          <FontAwesomeIcon icon={faPlus} /> Add Passage
        </button>
        <button 
          onClick={() => handleSectionChange('view-passages')}
          className={activeSection === 'view-passages' ? 'active' : ''}
        >
          <FontAwesomeIcon icon={faList} /> View Passages
        </button>
        <button 
          onClick={() => handleSectionChange('assign-passage')}
          className={activeSection === 'assign-passage' ? 'active' : ''}
        >
          <FontAwesomeIcon icon={faUserPlus} /> Assign Passage to Tests
        </button>
        <button 
          onClick={() => handleSectionChange('assigned-passages')}
          className={activeSection === 'assigned-passages' ? 'active' : ''}
        >
          <FontAwesomeIcon icon={faClipboardList} /> Assigned Passages
        </button>
        <button 
          onClick={() => handleSectionChange('live-exams')}
          className={activeSection === 'live-exams' ? 'active' : ''}
        >
          <FontAwesomeIcon icon={faUserPlus} /> Live Exams
        </button>
        <button 
          onClick={() => handleSectionChange('manage-cards')}
          className={activeSection === 'manage-cards' ? 'active' : ''}
        >
          <FontAwesomeIcon icon={faList} /> Manage Cards
        </button>
        <button 
          onClick={() => handleSectionChange('manage-coupons')}
          className={activeSection === 'manage-coupons' ? 'active' : ''}
        >
          <FontAwesomeIcon icon={faList} /> Manage Coupons
        </button>
        <button 
          onClick={() => handleSectionChange('blog-manager')}
          className={activeSection === 'blog-manager' ? 'active' : ''}
        >
          <FontAwesomeIcon icon={faList} /> Blog Manager
        </button>
        <button 
          onClick={() => navigate('/admin/admin-requests')}
          className="admin-requests-btn"
        >
          <FontAwesomeIcon icon={faUserPlus} /> Admin Requests
        </button>
        <button 
          onClick={() => navigate('/admin/delete-requests')}
          className="delete-requests-btn"
        >
          <FontAwesomeIcon icon={faTrash} /> Delete Requests
        </button>
        <button onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </button>
        <button onClick={forceLogout} style={{ backgroundColor: '#e63946', marginTop: '10px' }}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Force Logout (Clear Old Token)
        </button>
      </aside>

      <main className="content">
        {isLoading ? <LoadingSpinner /> : renderContent()}
      </main>

      {/* Edit Passage Modal */}
      {isEditModalOpen && currentEditPassage && (
        <div className="edit-modal show">
          <div className="edit-modal-content">
            <button className="close" onClick={() => setIsEditModalOpen(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2>Edit Passage</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSaveEdit(currentEditPassage);
            }}>
              <label htmlFor="edit-title">Passage Title:</label>
              <input
                type="text"
                id="edit-title"
                value={currentEditPassage.title}
                onChange={(e) => setCurrentEditPassage({
                  ...currentEditPassage,
                  title: e.target.value
                })}
                required
              />
              <label htmlFor="edit-content">Passage Content:</label>
              <textarea
                id="edit-content"
                value={currentEditPassage.content}
                onChange={(e) => setCurrentEditPassage({
                  ...currentEditPassage,
                  content: e.target.value
                })}
                required
              />
              <div className="button-group">
                <button type="submit" className="save">Save Changes</button>
                <button type="button" className="cancel" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

      {/* Toast Notification */}
      <Toast
        type={toast.type}
        message={toast.message}
        show={toast.show}
        onClose={hideToast}
        duration={4000}
      />
    </div>
  );
};

export default Dashboard; 