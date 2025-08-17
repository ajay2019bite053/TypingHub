import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import certificateService, { Certificate, GenerateCertificateRequest } from '../services/certificateService';

interface CertificateState {
  certificates: Certificate[];
  loading: boolean;
  error: string | null;
  currentCertificate: Certificate | null;
}

type CertificateAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CERTIFICATES'; payload: Certificate[] }
  | { type: 'ADD_CERTIFICATE'; payload: Certificate }
  | { type: 'SET_CURRENT_CERTIFICATE'; payload: Certificate | null }
  | { type: 'CLEAR_ERROR' };

const initialState: CertificateState = {
  certificates: [],
  loading: false,
  error: null,
  currentCertificate: null,
};

const certificateReducer = (state: CertificateState, action: CertificateAction): CertificateState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CERTIFICATES':
      return { ...state, certificates: action.payload };
    case 'ADD_CERTIFICATE':
      return { ...state, certificates: [action.payload, ...state.certificates] };
    case 'SET_CURRENT_CERTIFICATE':
      return { ...state, currentCertificate: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

interface CertificateContextType {
  state: CertificateState;
  generateCertificate: (data: GenerateCertificateRequest) => Promise<Certificate>;
  downloadCertificate: (certificateId: string) => Promise<void>;
  verifyCertificate: (verificationCode: string) => Promise<Certificate>;
  getUserCertificates: (userId: string) => Promise<void>;
  getAllCertificates: () => Promise<void>;
  clearError: () => void;
}

const CertificateContext = createContext<CertificateContextType | undefined>(undefined);

export const useCertificate = () => {
  const context = useContext(CertificateContext);
  if (!context) {
    throw new Error('useCertificate must be used within a CertificateProvider');
  }
  return context;
};

interface CertificateProviderProps {
  children: ReactNode;
}

export const CertificateProvider: React.FC<CertificateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(certificateReducer, initialState);

  const generateCertificate = async (data: GenerateCertificateRequest): Promise<Certificate> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const response = await certificateService.generateCertificate(data);
      
      if (response.success && response.certificate) {
        dispatch({ type: 'ADD_CERTIFICATE', payload: response.certificate });
        dispatch({ type: 'SET_CURRENT_CERTIFICATE', payload: response.certificate });
        return response.certificate;
      } else {
        throw new Error(response.message || 'Failed to generate certificate');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to generate certificate';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const downloadCertificate = async (certificateId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const blob = await certificateService.downloadCertificate(certificateId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to download certificate';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const verifyCertificate = async (verificationCode: string): Promise<Certificate> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const response = await certificateService.verifyCertificate(verificationCode);
      
      if (response.success && response.certificate) {
        return response.certificate;
      } else {
        throw new Error(response.message || 'Certificate verification failed');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to verify certificate';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getUserCertificates = async (userId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const response = await certificateService.getUserCertificates(userId);
      
      if (response.success && response.certificates) {
        dispatch({ type: 'SET_CERTIFICATES', payload: response.certificates });
      } else {
        throw new Error(response.message || 'Failed to fetch certificates');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch certificates';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getAllCertificates = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const response = await certificateService.getAllCertificates();
      
      if (response.success && response.certificates) {
        dispatch({ type: 'SET_CERTIFICATES', payload: response.certificates });
      } else {
        throw new Error(response.message || 'Failed to fetch certificates');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch certificates';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: CertificateContextType = {
    state,
    generateCertificate,
    downloadCertificate,
    verifyCertificate,
    getUserCertificates,
    getAllCertificates,
    clearError,
  };

  return (
    <CertificateContext.Provider value={value}>
      {children}
    </CertificateContext.Provider>
  );
}; 