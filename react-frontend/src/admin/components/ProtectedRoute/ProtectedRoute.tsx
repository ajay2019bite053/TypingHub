import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isAdmin, user, isLoading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute: isAuthenticated:', isAuthenticated);
  console.log('ProtectedRoute: isAdmin:', isAdmin);
  console.log('ProtectedRoute: user:', user);
  console.log('ProtectedRoute: isLoading:', isLoading);
  console.log('ProtectedRoute: localStorage accessToken:', localStorage.getItem('accessToken'));
  console.log('ProtectedRoute: localStorage user:', localStorage.getItem('user'));

  // If we haven't loaded the user yet, show loading
  if (isLoading) {
    console.log('ProtectedRoute: Still loading, showing spinner');
    return (
      <div className="loading-container">
        <LoadingSpinner />
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    // Redirect to admin login with return path
    return <Navigate to="/admin-secret-9382xj" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    console.log('ProtectedRoute: Not admin, redirecting to home');
    console.log('ProtectedRoute: User role:', user?.role);
    return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute: All checks passed, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute; 