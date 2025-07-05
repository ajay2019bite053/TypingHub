import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../config/api';

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  hasPaid?: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshToken = async (): Promise<string | null> => {
    try {
      const isAdmin = user?.role === 'super_admin' || user?.role === 'user_admin';
      const endpoint = isAdmin ? '/admin/auth/refresh-token' : '/auth/refresh-token';
      
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${endpoint}`,
        {},
        {
          withCredentials: true
        }
      );
      
      if (response.data.success && response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        return response.data.accessToken;
      }
      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const isAdmin = parsedUser.role === 'super_admin' || parsedUser.role === 'user_admin';
          const endpoint = isAdmin ? '/admin/auth/check-auth' : '/auth/check-auth';
          
          // Verify token with backend
          const response = await axios.get(
            `${API_CONFIG.BASE_URL}${endpoint}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              },
              withCredentials: true
            }
          );

          if (response.data.success) {
            setIsAuthenticated(true);
            setUser(parsedUser);
          } else {
            // Token might be expired, try to refresh
            const newToken = await refreshToken();
            if (newToken) {
              setIsAuthenticated(true);
              setUser(parsedUser);
            } else {
              // If refresh fails, logout
              await logout();
            }
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        await logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (token: string, userData: User) => {
    console.log('AuthContext: login called with token:', token);
    console.log('AuthContext: userData:', userData);
    
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    
    console.log('AuthContext: State updated - isAuthenticated:', true);
    console.log('AuthContext: State updated - user:', userData);
  };

  const logout = async () => {
    try {
      const isAdmin = user?.role === 'super_admin' || user?.role === 'user_admin';
      const endpoint = isAdmin ? '/admin/auth/logout' : '/auth/logout';
      
      // Call logout endpoint
      await axios.post(
        `${API_CONFIG.BASE_URL}${endpoint}`,
        {},
        {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state regardless of API call success
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin: user?.role === 'super_admin' || user?.role === 'user_admin',
        user,
        isLoading,
        login,
        logout,
        refreshToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 