import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
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
import './AdminRequests.css';
import { API_CONFIG } from '../../../config/api';
import { API_BASE_URL } from '../../../utils/api';

interface Admin {
  _id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  aadharNumber: string;
  aadharImage: string;
  isApproved: boolean;
  registrationDate: string;
  role: 'super_admin' | 'sub_admin';
}

const STATIC_FILE_BASE_URL = `${API_BASE_URL}/uploads`;

const AdminRequests: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pendingAdmins, setPendingAdmins] = useState<Admin[]>([]);
  const [approvedAdmins, setApprovedAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApproved, setShowApproved] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'super_admin') {
      navigate('/admin/dashboard');
      return;
    }
    fetchAdminRequests();
  }, [user, navigate]);

  const fetchAdminRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch admin requests (${response.status})`);
      }

      const data = await response.json();
      setPendingAdmins(data.pendingAdmins || []);
      setApprovedAdmins(data.approvedAdmins || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching admin requests:', err);
      setError(err.message || 'Failed to load admin requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!window.confirm('Are you sure you want to approve this admin?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/approve/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to approve admin');
      }

      fetchAdminRequests();
      setError(null);
    } catch (err: any) {
      console.error('Error approving admin:', err);
      setError(err.message || 'Failed to approve admin');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm('Are you sure you want to reject this admin?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/reject/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to reject admin');
      }

      fetchAdminRequests();
      setError(null);
    } catch (err: any) {
      console.error('Error rejecting admin:', err);
      setError(err.message || 'Failed to reject admin');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this admin?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/remove/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to remove admin');
      }

      fetchAdminRequests();
      setError(null);
    } catch (err: any) {
      console.error('Error removing admin:', err);
      setError(err.message || 'Failed to remove admin');
    } finally {
      setLoading(false);
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