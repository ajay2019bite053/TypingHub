import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../config/api';

interface CompetitionStatus {
  isRegistrationActive: boolean;
  isCompetitionActive: boolean;
  entryFee: number;
  maxSlots: number;
  minSlots: number;
  prizes: {
    first: number;
    second: number;
    third: number;
  };
  passage: string;
  totalRegistrations: number;
  totalParticipants: number;
  status: string;
  forceActivate?: boolean;
  resultsPublished?: boolean;
}

interface CompetitionRegistration {
  name: string;
  mobile: string;
  secretId: string;
  paymentId?: string; // Optional for free competitions
  paymentAmount?: number; // Optional for free competitions
  paymentStatus: string;
  hasAttempted: boolean;
  testResult: {
    // Raw Metrics
    grossSpeed: number;
    netSpeed: number;
    accuracy: number;
    wordAccuracy: number;
    mistakes: number;
    backspaces: number;
    totalWords: number;
    correctWords: number;
    incorrectWords: number;
    timeTaken: number;
    // Calculated Scores
    speedScore: number;
    accuracyScore: number;
    efficiencyScore: number;
    completionScore: number;
    finalScore: number;
    // Legacy field
    speed: number;
    submittedAt?: Date;
  };
  rank?: number;
  prize: number;
  registeredAt: Date;
  attemptedAt?: Date;
}

interface CompetitionResult {
  secretId: string;
  name: string;
  mobile: string;
  // Raw Metrics
  grossSpeed: number;
  netSpeed: number;
  accuracy: number;
  wordAccuracy: number;
  mistakes: number;
  backspaces: number;
  totalWords: number;
  correctWords: number;
  incorrectWords: number;
  timeTaken: number;
  // Calculated Scores
  speedScore: number;
  accuracyScore: number;
  efficiencyScore: number;
  completionScore: number;
  finalScore: number;
  // Legacy field
  speed: number;
  rank: number;
  prize: number;
  submittedAt: Date;
}

interface CompetitionContextType {
  competitionStatus: CompetitionStatus | null;
  isLoading: boolean;
  error: string | null;
  fetchCompetitionStatus: () => Promise<void>;
  registerForCompetition: (data: { 
    name: string; 
    mobile: string; 
    paymentId?: string; 
    paymentAmount?: number; 
  }) => Promise<{ success: boolean; data?: any; message?: string }>;
  joinCompetition: (data: { name: string; secretId: string }) => Promise<{ success: boolean; data?: any; message?: string }>;
  submitCompetitionResult: (data: { 
    secretId: string; 
    name: string; // Add name field
    grossSpeed: number; 
    netSpeed: number; 
    accuracy: number; 
    wordAccuracy: number;
    mistakes: number; 
    backspaces: number; 
    totalWords: number; 
    correctWords: number; 
    incorrectWords: number; 
    timeTaken: number; 
  }) => Promise<{ success: boolean; data?: any; message?: string }>;
  getAllRegistrations: () => Promise<{ success: boolean; data?: any; message?: string }>;
  getCompetitionResults: () => Promise<{ success: boolean; data?: any; message?: string }>;
  updateCompetitionSettings: (settings: any) => Promise<{ success: boolean; data?: any; message?: string }>;
  deleteAllRegistrations: () => Promise<{ success: boolean; data?: any; message?: string }>;
  deleteAllResults: () => Promise<{ success: boolean; data?: string; message?: string }>;
  publishResults: () => Promise<{ success: boolean; data?: any; message?: string }>;
  unpublishResults: () => Promise<{ success: boolean; data?: any; message?: string }>;
  downloadResultsPDF: () => Promise<{ success: boolean; data?: any; message?: string }>;
}

const CompetitionContext = createContext<CompetitionContextType | undefined>(undefined);

export const useCompetition = () => {
  const context = useContext(CompetitionContext);
  if (context === undefined) {
    throw new Error('useCompetition must be used within a CompetitionProvider');
  }
  return context;
};

interface CompetitionProviderProps {
  children: ReactNode;
}

export const CompetitionProvider: React.FC<CompetitionProviderProps> = ({ children }) => {
  const [competitionStatus, setCompetitionStatus] = useState<CompetitionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompetitionStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // console.log('CompetitionContext: Fetching competition status...');
      const response = await axios.get(`${API_CONFIG.BASE_URL}/competition/status`);
      
      // console.log('CompetitionContext: API response:', response.data);
      
      if (response.data.success) {
        // console.log('CompetitionContext: Setting competition status:', response.data.data);
        // console.log('CompetitionContext: Previous status:', competitionStatus);
        setCompetitionStatus(response.data.data);
        // console.log('CompetitionContext: Status updated, new value will be:', response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch competition status');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error fetching competition status');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const registerForCompetition = async (data: { 
    name: string; 
    mobile: string; 
    paymentId?: string; 
    paymentAmount?: number; 
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Sending registration data:', data);
      console.log('API URL:', `${API_CONFIG.BASE_URL}/competition/register`);
      
      const response = await axios.post(`${API_CONFIG.BASE_URL}/competition/register`, data);
      
      console.log('Registration response:', response.data);
      
      if (response.data.success) {
        // Refresh competition status after registration
        await fetchCompetitionStatus();
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response?.data);
      const message = error.response?.data?.message || 'Error registering for competition';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const joinCompetition = async (data: { name: string; secretId: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_CONFIG.BASE_URL}/competition/join`, data);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error joining competition';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const submitCompetitionResult = async (data: { 
    secretId: string; 
    name: string; // Add name field
    grossSpeed: number; 
    netSpeed: number; 
    accuracy: number; 
    wordAccuracy: number;
    mistakes: number; 
    backspaces: number; 
    totalWords: number; 
    correctWords: number; 
    incorrectWords: number; 
    timeTaken: number; 
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_CONFIG.BASE_URL}/competition/submit-result`, data);
      
      if (response.data.success) {
        // Refresh competition status after submission
        await fetchCompetitionStatus();
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error submitting result';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const getAllRegistrations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_CONFIG.BASE_URL}/competition/admin/registrations`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error fetching registrations';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const getCompetitionResults = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_CONFIG.BASE_URL}/competition/admin/results`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error fetching results';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateCompetitionSettings = async (settings: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('CompetitionContext: Updating competition settings:', settings);
      
      const token = localStorage.getItem('accessToken');
      const response = await axios.put(`${API_CONFIG.BASE_URL}/competition/admin/settings`, settings, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('CompetitionContext: Settings update response:', response.data);
      
      if (response.data.success) {
        console.log('CompetitionContext: Settings updated successfully, refreshing status...');
        // Refresh competition status after settings update
        await fetchCompetitionStatus();
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error updating settings';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAllRegistrations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');
      const response = await axios.delete(`${API_CONFIG.BASE_URL}/competition/admin/registrations`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        await fetchCompetitionStatus();
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error deleting registrations';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAllResults = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');
      const response = await axios.delete(`${API_CONFIG.BASE_URL}/competition/admin/results`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        await fetchCompetitionStatus();
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error deleting results';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const publishResults = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`${API_CONFIG.BASE_URL}/competition/admin/publish-results`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        await fetchCompetitionStatus();
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error publishing results';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const unpublishResults = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('CompetitionContext: Unpublishing results...');
      
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`${API_CONFIG.BASE_URL}/competition/admin/unpublish-results`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('CompetitionContext: Unpublish response:', response.data);
      
      if (response.data.success) {
        console.log('CompetitionContext: Results unpublished successfully, refreshing status...');
        await fetchCompetitionStatus();
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error unpublishing results';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResultsPDF = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_CONFIG.BASE_URL}/competition/admin/download-results`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'competition-results.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true, data: response.data };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error downloading PDF';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch competition status on mount
  useEffect(() => {
    fetchCompetitionStatus();
  }, []);

  // Debug logging when competitionStatus changes - REMOVED to prevent noise
  // useEffect(() => {
  //   console.log('CompetitionContext: competitionStatus state changed to:', competitionStatus);
  // }, [competitionStatus]);

  const value: CompetitionContextType = {
    competitionStatus,
    isLoading,
    error,
    fetchCompetitionStatus,
    registerForCompetition,
    joinCompetition,
    submitCompetitionResult,
    getAllRegistrations,
    getCompetitionResults,
    updateCompetitionSettings,
    deleteAllRegistrations,
    deleteAllResults,
    publishResults,
    unpublishResults,
    downloadResultsPDF
  };

  return (
    <CompetitionContext.Provider value={value}>
      {children}
    </CompetitionContext.Provider>
  );
};

