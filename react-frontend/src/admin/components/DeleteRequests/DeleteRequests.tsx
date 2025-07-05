import React, { useEffect, useState } from 'react';
import { useDeleteRequest } from '../../../contexts/DeleteRequestContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
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

const DeleteRequests: React.FC = () => {
  const { deleteRequests, approveDeleteRequest, rejectDeleteRequest, fetchDeleteRequests } = useDeleteRequest();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Check if user is default admin
  useEffect(() => {
    if (user && user.role !== 'super_admin') {
      navigate('/admin/dashboard');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        await fetchDeleteRequests();
        setError(null);
      } catch (err) {
        setError('Failed to load delete requests');
      } finally {
        setLoading(false);
      }
    };

    // Only load requests if user is super admin
    if (user?.role === 'super_admin') {
      loadRequests();
    }
  }, [fetchDeleteRequests, user]);

  const handleApprove = async (requestId: string) => {
    try {
      await approveDeleteRequest(requestId);
    } catch (err) {
      setError('Failed to approve delete request');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectDeleteRequest(requestId);
    } catch (err) {
      setError('Failed to reject delete request');
    }
  };

  const filteredRequests = deleteRequests.filter(request => {
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
        <button onClick={() => fetchDeleteRequests()} className="retry-btn">
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