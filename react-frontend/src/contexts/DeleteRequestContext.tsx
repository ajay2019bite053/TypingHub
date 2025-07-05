import React, { createContext, useContext, useState } from 'react';

interface DeleteRequest {
  _id: string;
  type: 'passage' | 'test' | 'question';
  itemId: string;
  itemName: string;
  requestedBy: {
    id: string;
    email: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface DeleteRequestContextType {
  deleteRequests: DeleteRequest[];
  addDeleteRequest: (request: Omit<DeleteRequest, '_id' | 'status' | 'createdAt'>) => Promise<void>;
  approveDeleteRequest: (requestId: string) => Promise<void>;
  rejectDeleteRequest: (requestId: string) => Promise<void>;
  fetchDeleteRequests: () => Promise<void>;
}

const DeleteRequestContext = createContext<DeleteRequestContextType | undefined>(undefined);

export const DeleteRequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deleteRequests, setDeleteRequests] = useState<DeleteRequest[]>([]);

  const addDeleteRequest = async (request: Omit<DeleteRequest, '_id' | 'status' | 'createdAt'>) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/delete-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create delete request');
      }

      const newRequest = await response.json();
      setDeleteRequests(prev => [...prev, newRequest]);
    } catch (error) {
      console.error('Error creating delete request:', error);
      throw error;
    }
  };

  const approveDeleteRequest = async (requestId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/delete-requests/${requestId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve delete request');
      }

      setDeleteRequests(prev => 
        prev.map(request => 
          request._id === requestId 
            ? { ...request, status: 'approved' }
            : request
        )
      );
    } catch (error) {
      console.error('Error approving delete request:', error);
      throw error;
    }
  };

  const rejectDeleteRequest = async (requestId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/delete-requests/${requestId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject delete request');
      }

      setDeleteRequests(prev => 
        prev.map(request => 
          request._id === requestId 
            ? { ...request, status: 'rejected' }
            : request
        )
      );
    } catch (error) {
      console.error('Error rejecting delete request:', error);
      throw error;
    }
  };

  const fetchDeleteRequests = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/delete-requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch delete requests');
      }

      const requests = await response.json();
      setDeleteRequests(requests);
    } catch (error) {
      console.error('Error fetching delete requests:', error);
      throw error;
    }
  };

  return (
    <DeleteRequestContext.Provider
      value={{
        deleteRequests,
        addDeleteRequest,
        approveDeleteRequest,
        rejectDeleteRequest,
        fetchDeleteRequests
      }}
    >
      {children}
    </DeleteRequestContext.Provider>
  );
};

export const useDeleteRequest = () => {
  const context = useContext(DeleteRequestContext);
  if (context === undefined) {
    throw new Error('useDeleteRequest must be used within a DeleteRequestProvider');
  }
  return context;
}; 