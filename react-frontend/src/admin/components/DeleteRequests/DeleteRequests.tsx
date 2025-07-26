import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck, 
  faTimes, 
  faSpinner, 
  faTrash,
  faExclamationTriangle,
  faLock
} from '@fortawesome/free-solid-svg-icons';
import './DeleteRequests.css';
import { API_BASE_URL } from '../../../utils/api';

interface DeleteRequest {
  _id: string;
  type: 'passage' | 'test' | 'question';
  itemId: string;
  itemName: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: {
    id: string;
    email: string;
  };
  createdAt: string;
}

const DeleteRequests: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [requests, setRequests] = useState<DeleteRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/delete-requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch delete requests (${response.status})`);
      }

      const data = await response.json();
      setRequests(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching delete requests:', err);
      setError(err.message || 'Failed to load delete requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (requestId: string) => {
    if (!window.confirm('Are you sure you want to approve this delete request?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/delete-requests/${requestId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to approve delete request');
      }

      fetchRequests();
      setError(null);
    } catch (err: any) {
      console.error('Error approving delete request:', err);
      setError(err.message || 'Failed to approve delete request');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (requestId: string) => {
    if (!window.confirm('Are you sure you want to reject this delete request?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/delete-requests/${requestId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to reject delete request');
      }

      fetchRequests();
      setError(null);
    } catch (err: any) {
      console.error('Error rejecting delete request:', err);
      setError(err.message || 'Failed to reject delete request');
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  // Show access denied message if not super admin
  if (user && user.role !== 'super_admin') {
    return (
      <div className="access-denied">
        <FontAwesomeIcon icon={faLock} size="3x" />
        <h2>Access Denied</h2>
        <p>Only super administrators can access delete requests.</p>
        <button onClick={() => navigate('/admin/dashboard')} className="back-btn">
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="delete-requests-loading">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        <p>Loading delete requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="delete-requests-error">
        <FontAwesomeIcon icon={faExclamationTriangle} size="2x" />
        <p>{error}</p>
        <button onClick={() => fetchRequests()} className="retry-btn">
          <FontAwesomeIcon icon={faSpinner} spin /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="delete-requests-container">
      <div className="delete-requests-header">
        <h2>Delete Requests</h2>
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'pending' ? 'active' : ''} 
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={filter === 'approved' ? 'active' : ''} 
            onClick={() => setFilter('approved')}
          >
            Approved
          </button>
          <button 
            className={filter === 'rejected' ? 'active' : ''} 
            onClick={() => setFilter('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="no-requests">
          <FontAwesomeIcon icon={faTrash} size="2x" />
          <p>No delete requests found</p>
        </div>
      ) : (
        <div className="delete-requests-table-wrapper">
          <table className="delete-requests-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Item Name</th>
                <th>Requested By</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request._id} className={`status-${request.status}`}>
                  <td>{request.type}</td>
                  <td>{request.itemName}</td>
                  <td>{request.requestedBy.email}</td>
                  <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${request.status}`}>
                      {request.status}
                    </span>
                  </td>
                  {request.status === 'pending' && (
                    <td>
                      <div className="request-actions">
                        <button
                          onClick={() => handleApprove(request._id)}
                          className="approve-btn"
                          title="Approve Request"
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button
                          onClick={() => handleReject(request._id)}
                          className="reject-btn"
                          title="Reject Request"
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeleteRequests; 