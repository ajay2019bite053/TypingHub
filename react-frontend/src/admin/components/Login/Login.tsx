import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaPhone, FaMapMarkerAlt, FaIdCard, FaCamera } from 'react-icons/fa';
import { useAuth } from '../../../contexts/AuthContext';
import './Login.css';

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
  modalType?: 'login' | 'register';
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose, modalType = 'login' }) => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(modalType === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    aadharNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [aadharImage, setAadharImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Update mode when modalType changes
  useEffect(() => {
    setIsLoginMode(modalType === 'login');
  }, [modalType]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (isLoginMode) {
      setLoginData(prev => ({ ...prev, [name]: value }));
    } else {
      setRegisterData(prev => ({ ...prev, [name]: value }));
    }
    if (errorMessage) setErrorMessage('');
    if (successMessage) setSuccessMessage('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAadharImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateLoginForm = () => {
    if (!loginData.email.trim()) {
      setErrorMessage('Email is required');
      return false;
    }
    if (!loginData.password) {
      setErrorMessage('Password is required');
      return false;
    }
    return true;
  };

  const validateRegisterForm = () => {
    if (!registerData.name.trim()) {
      setErrorMessage('Name is required');
      return false;
    }
    if (!registerData.email.trim()) {
      setErrorMessage('Email is required');
      return false;
    }
    if (!registerData.phone.trim()) {
      setErrorMessage('Phone number is required');
      return false;
    }
    if (!registerData.address.trim()) {
      setErrorMessage('Address is required');
      return false;
    }
    if (!registerData.aadharNumber.trim()) {
      setErrorMessage('Aadhar number is required');
      return false;
    }
    if (!registerData.password) {
      setErrorMessage('Password is required');
      return false;
    }
    if (registerData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return false;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return false;
    }
    if (!aadharImage) {
      setErrorMessage('Aadhar card image is required');
      return false;
    }
    return true;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLoginForm()) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const { accessToken, user } = data;
        authLogin(accessToken, {
          id: user.id,
          email: user.email,
          role: user.role
        });
        onClose();
        navigate('/admin/dashboard');
      } else {
        setErrorMessage(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegisterForm()) return;

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const formData = new FormData();
      formData.append('name', registerData.name);
      formData.append('email', registerData.email);
      formData.append('phone', registerData.phone);
      formData.append('address', registerData.address);
      formData.append('aadharNumber', registerData.aadharNumber);
      formData.append('password', registerData.password);
      if (aadharImage) {
        formData.append('aadharImage', aadharImage);
      }

      const response = await fetch('/api/admin/auth/register', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage('Registration successful! Please wait for admin approval.');
        // Reset form
        setRegisterData({
          name: '',
          email: '',
          phone: '',
          address: '',
          aadharNumber: '',
          password: '',
          confirmPassword: ''
        });
        setAadharImage(null);
        setImagePreview('');
      } else {
        setErrorMessage(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setErrorMessage('');
    setSuccessMessage('');
    setLoginData({ email: '', password: '' });
    setRegisterData({
      name: '',
      email: '',
      phone: '',
      address: '',
      aadharNumber: '',
      password: '',
      confirmPassword: ''
    });
    setAadharImage(null);
    setImagePreview('');
  };

  return (
    <div className="login-modal-overlay" onClick={handleBackdropClick}>
      <div className="login-modal">
        <div className="login-modal-header">
          <h2>{isLoginMode ? 'Admin Login' : 'Admin Registration'}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
      </div>
      
        <div className="mode-toggle">
          <button 
            className={`toggle-btn ${isLoginMode ? 'active' : ''}`}
            onClick={() => !isLoginMode && toggleMode()}
          >
            Login
          </button>
          <button 
            className={`toggle-btn ${!isLoginMode ? 'active' : ''}`}
            onClick={() => isLoginMode && toggleMode()}
          >
            Register
          </button>
        </div>

        {isLoginMode ? (
          <form onSubmit={handleLoginSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope /> Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <FaLock /> Password
              </label>
              <div className="password-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="register-form">
              <div className="form-group">
                <label htmlFor="name">
                  <FaUser /> Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                value={registerData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope /> Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={registerData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  <FaPhone /> Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                value={registerData.phone}
                  onChange={handleInputChange}
                placeholder="Enter 10-digit phone number"
                pattern="[0-9]{10}"
                required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">
                <FaMapMarkerAlt /> Address
                </label>
              <textarea
                  id="address"
                  name="address"
                value={registerData.address}
                  onChange={handleInputChange}
                placeholder="Enter your complete address"
                required
                />
              </div>

              <div className="form-group">
                <label htmlFor="aadharNumber">
                  <FaIdCard /> Aadhar Number
                </label>
                <input
                  type="text"
                  id="aadharNumber"
                  name="aadharNumber"
                value={registerData.aadharNumber}
                  onChange={handleInputChange}
                placeholder="Enter 12-digit Aadhar number"
                pattern="[0-9]{12}"
                  maxLength={12}
                required
                />
              </div>

              <div className="form-group">
                <label htmlFor="aadharImage">
                <FaCamera /> Aadhar Card Image
                </label>
                <input
                  type="file"
                  id="aadharImage"
                  name="aadharImage"
                accept="image/*"
                  onChange={handleImageChange}
                required
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Aadhar preview" />
                  </div>
                )}
          </div>

          <div className="form-group">
          <label htmlFor="password">
            <FaLock /> Password
          </label>
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
                name="password"
                  value={registerData.password}
                onChange={handleInputChange}
                  placeholder="Enter password (min 6 characters)"
                  required
            />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
          </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <FaLock /> Confirm Password
              </label>
              <div className="password-container">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}

            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        )}
      </div>
    </div>
  );
};

export default Login; 