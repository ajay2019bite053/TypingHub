import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();

  const handleOpenModal = (type: 'login' | 'register') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    // Don't navigate away - stay on admin page
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <p>Welcome to the administration area</p>
        </div>
        
        <div className="admin-options">
          <div className="option-card">
            <h3>Login</h3>
            <p>Access your admin dashboard</p>
            <button 
              className="admin-btn login-btn"
              onClick={() => handleOpenModal('login')}
            >
              Login
            </button>
          </div>
          
          <div className="option-card">
            <h3>Register</h3>
            <p>Create a new admin account</p>
            <button 
              className="admin-btn register-btn"
              onClick={() => handleOpenModal('register')}
            >
              Register
            </button>
          </div>
        </div>
        
        <div className="admin-footer">
          <button 
            className="back-btn"
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </button>
        </div>
      </div>

      <Login 
        isOpen={isModalOpen} 
        onClose={handleClose}
        modalType={modalType}
      />
    </div>
  );
};

export default LoginPage; 