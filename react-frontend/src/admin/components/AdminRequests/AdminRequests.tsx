import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck, 
  faTimes, 
  faTrash, 
  faSpinner, 
  faExclamationTriangle,
  faUserCheck,
  faUserClock,
  faEye,
  faLock
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../contexts/AuthContext';
import './AdminRequests.css';

interface Admin {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  aadharNumber: string;
  aadharImage: string;
  isApproved: boolean;
  registrationDate: string;
  isDefaultAdmin?: boolean;
}

// NOTE: API_BASE_URL is for API calls. Static files are served directly from http://localhost:5000/uploads
const API_BASE_URL = 'http://localhost:5000/api';
const STATIC_FILE_BASE_URL = 'http://localhost:5000/uploads';

const AdminRequests: React.FC = () => {
  const [pendingAdmins, setPendingAdmins] = useState<Admin[]>([]);
  const [approvedAdmins, setApprovedAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApproved, setShowApproved] = useState(false); // State to toggle between pending/approved
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user is super admin
  useEffect(() => {
    if (user && user.role !== 'super_admin') {
      navigate('/admin/dashboard');
      return;
    }
  }, [user, navigate]);

  const fetchAdminRequests = async () => {
    try {
      console.log('Fetching admin requests...');
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        console.log('No access token found, redirecting to login...');
        navigate('/admin/login');
        return;
      }

      console.log('Making API request to:', `${API_BASE_URL}/admin/requests`);
      const response = await axios.get(`${API_BASE_URL}/admin/requests`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('API Response:', response.data);
      setPendingAdmins(response.data.pendingAdmins);
      setApprovedAdmins(response.data.approvedAdmins);
      setError(null);
    } catch (err: any) {
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });

      if (err.response?.status === 401) {
        console.log('Unauthorized, redirecting to login...');
        navigate('/admin/login');
      } else {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch admin requests';
        console.error('Setting error message:', errorMessage);
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('AdminRequests component mounted');
    // Only fetch requests if user is super admin
    if (user?.role === 'super_admin') {
      fetchAdminRequests();
    }
  }, [navigate, user]);

  const handleApprove = async (adminId: string) => {
    try {
      console.log('Approving admin:', adminId);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        navigate('/admin/login');
        return;
      }

      await axios.put(
        `${API_BASE_URL}/admin/approve/${adminId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('Admin approved successfully');
      fetchAdminRequests();
    } catch (err: any) {
      console.error('Error approving admin:', err);
      if (err.response?.status === 401) {
        navigate('/admin/login');
      } else {
        setError(err.response?.data?.message || 'Failed to approve admin');
      }
    }
  };

  const handleReject = async (adminId: string) => {
    try {
      console.log('Rejecting admin:', adminId);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        navigate('/admin/login');
        return;
      }

      await axios.put(
        `${API_BASE_URL}/admin/reject/${adminId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('Admin rejected successfully');
      fetchAdminRequests();
    } catch (err: any) {
      console.error('Error rejecting admin:', err);
      if (err.response?.status === 401) {
        navigate('/admin/login');
      } else {
        setError(err.response?.data?.message || 'Failed to reject admin');
      }
    }
  };

  const handleRemove = async (adminId: string) => {
    try {
      console.log('Removing admin:', adminId);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        navigate('/admin/login');
        return;
      }

      await axios.delete(
        `${API_BASE_URL}/admin/remove/${adminId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('Admin removed successfully');
      fetchAdminRequests();
    } catch (err: any) {
      console.error('Error removing admin:', err);
      if (err.response?.status === 401) {
        navigate('/admin/login');
      } else {
        setError(err.response?.data?.message || 'Failed to remove admin');
      }
    }
  };

  // Show access denied message if not super admin
  if (user && user.role !== 'super_admin') {
    return (
      <div className="access-denied">
        <FontAwesomeIcon icon={faLock} size="3x" />
        <h2>Access Denied</h2>
        <p>Only super administrators can access admin requests.</p>
        <button onClick={() => navigate('/admin/dashboard')} className="back-btn">
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-requests-loading">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        <p>Loading admin requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-requests-error">
        <FontAwesomeIcon icon={faExclamationTriangle} size="2x" />
        <p>{error}</p>
        <button onClick={() => fetchAdminRequests()} className="retry-btn">
          <FontAwesomeIcon icon={faSpinner} spin /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-requests-container">
      <div className="admin-requests-header">
        <h2>Admin Requests Management</h2>
        <div className="admin-list-toggle">
          <button 
            className={`toggle-btn ${!showApproved ? 'active' : ''}`}
            onClick={() => setShowApproved(false)}
          >
            <FontAwesomeIcon icon={faUserClock} />
            Pending Requests ({pendingAdmins.length})
          </button>
          <button 
            className={`toggle-btn ${showApproved ? 'active' : ''}`}
            onClick={() => setShowApproved(true)}
          >
            <FontAwesomeIcon icon={faUserCheck} />
            Approved Admins ({approvedAdmins.length})
          </button>
        </div>
      </div>

      {showApproved ? (
        approvedAdmins.length === 0 ? (
          <div className="no-requests">
            <FontAwesomeIcon icon={faUserCheck} size="2x" />
            <p>No approved admins found</p>
          </div>
        ) : (
          <div className="admin-requests-table-wrapper">
            <div className="table-header">
              <h3>Approved Admins</h3>
              <div className="table-actions">
                <input 
                  type="text" 
                  placeholder="Search admins..." 
                  className="search-input"
                />
              </div>
            </div>
            <table className="admin-requests-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Aadhar Number</th>
                  <th>Aadhar Image</th>
                  <th>Registration Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {approvedAdmins.map((admin) => {
                  const aadharFilename = admin.aadharImage 
                    ? admin.aadharImage.replace(/^[\\/]?uploads[\\/]/, '') 
                    : 'N/A';

                  return (
                    <tr key={admin._id} className="approved-row">
                      <td>{admin.name}</td>
                      <td>{admin.email}</td>
                      <td>{admin.phone}</td>
                      <td>{admin.address}</td>
                      <td>{admin.aadharNumber}</td>
                      <td>
                        {admin.aadharImage && aadharFilename !== 'N/A' ? (
                          <a 
                            href={`${STATIC_FILE_BASE_URL}/${aadharFilename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="aadhar-image-link"
                          >
                            <FontAwesomeIcon icon={faEye} /> View Image
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>{new Date(admin.registrationDate).toLocaleDateString()}</td>
                      <td>
                        <div className="admin-actions">
                          <button
                            onClick={() => handleRemove(admin._id)}
                            className="remove-btn"
                            title="Remove Admin"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      ) : (
        pendingAdmins.length === 0 ? (
          <div className="no-requests">
            <FontAwesomeIcon icon={faUserClock} size="2x" />
            <p>No pending admin requests</p>
          </div>
        ) : (
          <div className="admin-requests-table-wrapper">
            <div className="table-header">
              <h3>Pending Admin Requests</h3>
              <div className="table-actions">
                <input 
                  type="text" 
                  placeholder="Search requests..." 
                  className="search-input"
                />
              </div>
            </div>
            <table className="admin-requests-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Aadhar Number</th>
                  <th>Aadhar Image</th>
                  <th>Registration Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingAdmins.map((admin) => {
                  const aadharFilename = admin.aadharImage 
                    ? admin.aadharImage.replace(/^[\\/]?uploads[\\/]/, '') 
                    : 'N/A';

                  return (
                    <tr key={admin._id} className="pending-row">
                      <td>{admin.name}</td>
                      <td>{admin.email}</td>
                      <td>{admin.phone}</td>
                      <td>{admin.address}</td>
                      <td>{admin.aadharNumber}</td>
                      <td>
                        {admin.aadharImage && aadharFilename !== 'N/A' ? (
                          <a 
                            href={`${STATIC_FILE_BASE_URL}/${aadharFilename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="aadhar-image-link"
                          >
                            <FontAwesomeIcon icon={faEye} /> View Image
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>{new Date(admin.registrationDate).toLocaleDateString()}</td>
                      <td>
                        <div className="admin-actions">
                          <button
                            onClick={() => handleApprove(admin._id)}
                            className="approve-btn"
                            title="Approve Admin"
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                          <button
                            onClick={() => handleReject(admin._id)}
                            className="reject-btn"
                            title="Reject Admin"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export default AdminRequests; 