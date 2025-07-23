import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaGoogle, FaPhone, FaArrowLeft } from 'react-icons/fa';
import './UserAuthModal.css';
import { useNavigate } from 'react-router-dom';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalType?: 'login' | 'register';
}

type AuthStep = 'login' | 'register' | 'mobile' | 'otp' | 'forgot' | 'reset';

const API_BASE = '/api/auth';

const UserAuthModal: React.FC<UserAuthModalProps> = ({ isOpen, onClose, modalType = 'login' }) => {
  const navigate = useNavigate();
  // Step state
  const [step, setStep] = useState<AuthStep>(modalType);
  // Form states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Login/Register
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', username: '', password: '', confirmPassword: '' });
  // Forgot/Reset
  const [resetTarget, setResetTarget] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  // Add new state for forgot password OTP flow
  const [forgotStep, setForgotStep] = useState<'input' | 'otp' | 'reset'>('input');
  const [forgotOtp, setForgotOtp] = useState('');
  const [sentOtpTo, setSentOtpTo] = useState('');

  // Modal open/close: prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setStep(modalType);
      setErrorMessage('');
      setSuccessMessage('');
      setIsLoading(false);
      setLoginData({ email: '', password: '' });
      setRegisterData({ name: '', username: '', password: '', confirmPassword: '' });
      setResetTarget(''); setResetToken('');
      setNewPassword(''); setConfirmNewPassword('');
    }
  }, [isOpen, modalType]);

  // Reset forgot password flow on modal open or when switching to forgot
  useEffect(() => {
    if (isOpen && step === 'forgot') {
      setForgotStep('input');
      setForgotOtp('');
      setSentOtpTo('');
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isOpen, step]);

  if (!isOpen) return null;

  // --- Validation helpers ---
  const validateLoginForm = () => {
    if (!loginData.email.trim()) return setErrorMessage('Email or mobile is required'), false;
    if (!loginData.password) return setErrorMessage('Password is required'), false;
    return true;
  };
  const validateRegisterForm = () => {
    if (!registerData.name.trim()) return setErrorMessage('Name is required'), false;
    if (!registerData.username.trim()) return setErrorMessage('Email or mobile is required'), false;
    if (registerData.username.includes('@') && !/^\S+@\S+\.\S+$/.test(registerData.username)) return setErrorMessage('Invalid email format'), false;
    if (!registerData.username.includes('@') && !/^\d{10}$/.test(registerData.username)) return setErrorMessage('Invalid mobile number'), false;
    if (!registerData.password) return setErrorMessage('Password is required'), false;
    if (registerData.password.length < 6) return setErrorMessage('Password must be at least 6 characters'), false;
    if (registerData.password !== registerData.confirmPassword) return setErrorMessage('Passwords do not match'), false;
    return true;
  };
  const validateResetPassword = () => {
    if (!newPassword) return setErrorMessage('Password is required'), false;
    if (newPassword.length < 6) return setErrorMessage('Password must be at least 6 characters'), false;
    if (newPassword !== confirmNewPassword) return setErrorMessage('Passwords do not match'), false;
    return true;
  };

  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrorMessage('');
    setSuccessMessage('');
    if (step === 'login') setLoginData(prev => ({ ...prev, [name]: value }));
    if (step === 'register') setRegisterData(prev => ({ ...prev, [name]: value }));
    if (step === 'forgot') setResetTarget(value);
    if (step === 'reset') {
      if (name === 'newPassword') setNewPassword(value);
      if (name === 'confirmNewPassword') setConfirmNewPassword(value);
    }
  };

  // --- Auth flows (real API) ---
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLoginForm()) return;
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email.includes('@') ? loginData.email : undefined,
          mobile: !loginData.email.includes('@') ? loginData.email : undefined,
          password: loginData.password
        }),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage('Login successful!');
          setSuccessMessage('');
          onClose();
          navigate('/user/dashboard');
      } else {
        setErrorMessage(data.message || data.error || 'Login failed');
      }
    } catch (err) {
      setErrorMessage('Network error');
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
      const isEmail = registerData.username.includes('@');
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerData.name,
          email: isEmail ? registerData.username : undefined,
          mobile: !isEmail ? registerData.username : undefined,
          password: registerData.password
        }),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage('Registration successful! You can now log in.');
        setTimeout(() => { setSuccessMessage(''); setStep('login'); }, 1200);
      } else {
        setErrorMessage(data.message || data.error || 'Registration failed');
      }
    } catch (err) {
      setErrorMessage('Network error');
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoogleAuth = () => {
    setErrorMessage('Google login is not implemented yet.');
  };
  // Mobile login/register (no OTP, just mobile+password)
  const handleMobileLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('Mobile login with OTP is not implemented. Use mobile + password on login/register.');
  };
  // --- Forgot password with OTP flow ---
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTarget.trim()) return setErrorMessage('Enter your email or mobile'), false;
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const isEmail = resetTarget.includes('@');
      const res = await fetch(`${API_BASE}/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: isEmail ? resetTarget : undefined,
          mobile: !isEmail ? resetTarget : undefined
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage('OTP sent! Check your email/mobile.');
        setSentOtpTo(resetTarget);
        setForgotStep('otp');
      } else {
        setErrorMessage(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setErrorMessage('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotOtp || forgotOtp.length !== 6) return setErrorMessage('Enter the 6-digit OTP'), false;
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const isEmail = sentOtpTo.includes('@');
      const res = await fetch(`${API_BASE}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: isEmail ? sentOtpTo : undefined,
          mobile: !isEmail ? sentOtpTo : undefined,
          otp: forgotOtp
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage('OTP verified! Set your new password.');
        setForgotStep('reset');
      } else {
        setErrorMessage(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setErrorMessage('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateResetPassword()) return;
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const isEmail = sentOtpTo.includes('@');
      const res = await fetch(`${API_BASE}/reset-password-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: isEmail ? sentOtpTo : undefined,
          mobile: !isEmail ? sentOtpTo : undefined,
          otp: forgotOtp,
          newPassword
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage('Password reset successful! You can now log in.');
        setTimeout(() => { setSuccessMessage(''); setStep('login'); }, 1200);
      } else {
        setErrorMessage(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setErrorMessage('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- UI ---
  const renderLogin = () => (
    <form onSubmit={handleLoginSubmit} className="auth-form">
      <button type="button" className="google-btn" onClick={handleGoogleAuth} disabled={isLoading}>
        <FaGoogle className="google-icon" /> Continue with Google
      </button>
      <div className="input-group">
        <FaEnvelope className="input-icon" />
        <input
          type="text"
          name="email"
          placeholder="Email or Mobile Number"
          value={loginData.email}
          onChange={handleInputChange}
          autoComplete="email"
          required
        />
      </div>
      <div className="input-group">
        <FaLock className="input-icon" />
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Password"
          value={loginData.password}
          onChange={handleInputChange}
          autoComplete="current-password"
          required
        />
        <span className="toggle-password" onClick={() => setShowPassword((prev) => !prev)}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
      <div className="forgot-row">
        <button type="button" className="forgot-btn" onClick={() => setStep('forgot')}>Forgot password?</button>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <button className="submit-btn" type="submit" disabled={isLoading}>
        {isLoading ? 'Please wait...' : 'Login'}
      </button>
      <div className="toggle-auth-mode">
        Don't have an account?{' '}
        <button className="toggle-btn" type="button" onClick={() => setStep('register')}>Register</button>
      </div>
    </form>
  );

  const renderRegister = () => (
    <form onSubmit={handleRegisterSubmit} className="auth-form">
      <button type="button" className="google-btn" onClick={handleGoogleAuth} disabled={isLoading}>
        <FaGoogle className="google-icon" /> Continue with Google
      </button>
      <div className="input-group">
        <FaUser className="input-icon" />
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={registerData.name}
          onChange={e => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
          autoComplete="name"
          required
        />
      </div>
      <div className="input-group">
        <FaEnvelope className="input-icon" />
        <input
          type="text"
          name="username"
          placeholder="Email or Mobile Number"
          value={registerData.username}
          onChange={e => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
          autoComplete="email"
          required
        />
      </div>
      <div className="input-group">
        <FaLock className="input-icon" />
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Password"
          value={registerData.password}
          onChange={e => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
          autoComplete="new-password"
          required
        />
        <span className="toggle-password" onClick={() => setShowPassword((prev) => !prev)}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
      <div className="input-group">
        <FaLock className="input-icon" />
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          placeholder="Confirm Password"
          value={registerData.confirmPassword}
          onChange={e => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
          autoComplete="new-password"
          required
        />
        <span className="toggle-password" onClick={() => setShowConfirmPassword((prev) => !prev)}>
          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <button className="submit-btn" type="submit" disabled={isLoading}>
        {isLoading ? 'Please wait...' : 'Register'}
      </button>
      <div className="toggle-auth-mode">
        Already have an account?{' '}
        <button className="toggle-btn" type="button" onClick={() => setStep('login')}>Login</button>
      </div>
    </form>
  );

  const renderMobile = () => (
    <form onSubmit={handleMobileLogin} className="auth-form">
      <button type="button" className="back-btn" onClick={() => setStep('login')}><FaArrowLeft /> Back</button>
      <div className="input-group">
        <FaPhone className="input-icon" />
        <input
          type="tel"
          name="mobile"
          placeholder="Mobile Number"
          value={loginData.email}
          onChange={e => setLoginData({ ...loginData, email: e.target.value })}
          autoComplete="tel"
          required
          maxLength={10}
        />
      </div>
      <div className="input-group">
        <FaLock className="input-icon" />
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Password"
          value={loginData.password}
          onChange={handleInputChange}
          autoComplete="current-password"
          required
        />
        <span className="toggle-password" onClick={() => setShowPassword((prev) => !prev)}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
      <div className="info-message">Mobile login with OTP is not implemented. Use mobile + password.</div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <button className="submit-btn" type="submit" disabled={isLoading}>
        {isLoading ? 'Please wait...' : 'Login'}
      </button>
    </form>
  );

  // --- UI for forgot password OTP flow ---
  const renderForgot = () => {
    if (forgotStep === 'input') {
      return (
        <form onSubmit={handleForgotSubmit} className="auth-form">
      <div className="input-group">
        <FaEnvelope className="input-icon" />
        <input
          type="text"
          name="resetTarget"
          placeholder="Email or Mobile Number"
          value={resetTarget}
          onChange={handleInputChange}
          autoComplete="email"
          required
        />
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <button className="submit-btn" type="submit" disabled={isLoading}>
        {isLoading ? 'Please wait...' : 'Send OTP'}
      </button>
      <div className="toggle-auth-mode">
        <button className="toggle-btn" type="button" onClick={() => setStep('login')}>Back to Login</button>
      </div>
    </form>
  );
    }
    if (forgotStep === 'otp') {
      return (
        <form onSubmit={handleOtpVerify} className="auth-form">
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="text"
              name="forgotOtp"
              placeholder="Enter OTP"
              value={forgotOtp}
              onChange={e => setForgotOtp(e.target.value)}
              maxLength={6}
              required
            />
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          <button className="submit-btn" type="submit" disabled={isLoading}>
            {isLoading ? 'Please wait...' : 'Verify OTP'}
          </button>
          <div className="toggle-auth-mode">
            <button className="toggle-btn" type="button" onClick={() => { setForgotStep('input'); setForgotOtp(''); }}>Back</button>
          </div>
        </form>
      );
    }
    if (forgotStep === 'reset') {
      return (
    <form onSubmit={handleResetPasswordSubmit} className="auth-form">
      <div className="input-group">
        <FaLock className="input-icon" />
        <input
          type={showPassword ? 'text' : 'password'}
          name="newPassword"
          placeholder="New Password"
          value={newPassword}
          onChange={handleInputChange}
          autoComplete="new-password"
          required
        />
        <span className="toggle-password" onClick={() => setShowPassword((prev) => !prev)}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
      <div className="input-group">
        <FaLock className="input-icon" />
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmNewPassword"
          placeholder="Confirm New Password"
          value={confirmNewPassword}
          onChange={handleInputChange}
          autoComplete="new-password"
          required
        />
        <span className="toggle-password" onClick={() => setShowConfirmPassword((prev) => !prev)}>
          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <button className="submit-btn" type="submit" disabled={isLoading}>
        {isLoading ? 'Please wait...' : 'Reset Password'}
      </button>
    </form>
  );
    }
    return null;
  };

  // At the top of the component, add a function to get the modal title based on the step
  const getModalTitle = () => {
    if (step === 'login') return 'User Login';
    if (step === 'register') return 'User Registration';
    if (step === 'forgot') return 'Forgot Password';
    if (step === 'reset') return 'Reset Password';
    return '';
  };

  // --- Render modal ---
  return (
    <div className="user-auth-modal-backdrop glass-bg">
      <div className="user-auth-modal modern-auth-modal" style={{ fontFamily: 'Roboto Serif, serif' }}>
        <div className="modal-header-bar">
          <span className="modal-title">{getModalTitle()}</span>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        {step === 'login' && renderLogin()}
        {step === 'register' && renderRegister()}
        {step === 'mobile' && renderMobile()}
        {step === 'forgot' && renderForgot()}
        {step === 'reset' && renderForgot()}
      </div>
    </div>
  );
};

export default UserAuthModal; 