import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faLock, faEnvelope, faTimes,
  faEye, faEyeSlash, faSignInAlt, faUserPlus,
  faExclamationCircle, faCheckCircle, faKey
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';
import { API_CONFIG } from '../../config/api';
import './Auth.css';
import { useAuth } from '../../contexts/AuthContext';

type AuthMode = 'login' | 'signup' | 'forgot';

interface AuthProps {
  onClose: () => void;
  initialMode: AuthMode;
}

interface FormState {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  rememberMe: boolean;
  otp: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  mobile?: string;
  password?: string;
  confirmPassword?: string;
  submit?: string;
}

interface LoginData {
  password: string;
  rememberMe: boolean;
  email?: string;
  mobile?: string;
}

interface SignupData {
  name: string;
  password: string;
  email?: string;
  mobile?: string;
}

const INITIAL_FORM_STATE: FormState = {
  name: '',
  email: '',
  mobile: '',
  password: '',
  confirmPassword: '',
  rememberMe: false,
  otp: ''
};

// OTP Input Component
const OTPInput: React.FC<{ 
  value: string;
  onChange: (otp: string) => void;
  disabled?: boolean;
}> = ({ value, onChange, disabled }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setRef = (index: number) => (element: HTMLInputElement | null) => {
    inputRefs.current[index] = element;
  };

  const handleChange = (index: number, val: string) => {
    if (val.length > 1) return;
    
    const newOTP = value.split('');
    newOTP[index] = val;
    onChange(newOTP.join(''));

    // Auto focus next input
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      onChange(pastedData);
    }
  };

  return (
    <div className="otp-inputs">
      {[0,1,2,3,4,5].map(i => (
        <input
          key={i}
          ref={setRef(i)}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={value[i] || ''}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
};

// OTP Timer Component
const OTPTimer: React.FC<{ 
  initialSeconds: number;
  onExpire: () => void;
  isActive: boolean;
}> = ({ initialSeconds, onExpire, isActive }) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (!isActive) {
      setSeconds(initialSeconds);
      return;
    }

    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, initialSeconds, onExpire]);

  return (
    <span className="otp-timer">
      {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
    </span>
  );
};

const Auth: React.FC<AuthProps> = ({ onClose, initialMode }) => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [otpStep, setOtpStep] = useState<'init' | 'verify' | 'reset'>('init');
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [socialLoginLoading, setSocialLoginLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [otpTimer, setOtpTimer] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Validation function
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        return undefined;

      case 'email':
        if (!value) return 'Email/Mobile is required';
        if (value.match(/^[0-9]{10}$/)) return undefined; // Valid mobile number
        if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Invalid email format';
        return undefined;

      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return 'Password must contain uppercase, lowercase and numbers';
        }
        return undefined;

      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        return undefined;

      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Validate based on current mode
    if (mode === 'signup') {
      const nameError = validateField('name', formData.name);
      if (nameError) errors.name = nameError;
    }

    const emailError = validateField('email', formData.email);
    if (emailError) errors.email = emailError;

    const passwordError = validateField('password', formData.password);
    if (passwordError) errors.password = passwordError;

    if (mode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input changes with validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (type !== 'checkbox') {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  // Handle login submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const loginData: LoginData = {
        password: formData.password,
        rememberMe: formData.rememberMe
      };

      // Check if email or mobile is provided
      if (formData.email.match(/^[0-9]{10}$/)) {
        loginData.mobile = formData.email;
      } else {
        loginData.email = formData.email;
      }

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/auth/login`,
        loginData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        const { accessToken, user } = response.data;
        // Use the auth context login
        authLogin(accessToken, {
          id: user._id || user.id,
          email: user.email,
          name: user.name,
          role: 'user',
          hasPaid: user.hasPaid || false
        });
        
        onClose();
        navigate('/dashboard');
      } else {
        setErrors({ submit: response.data.message || 'Login failed' });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setErrors({
        submit: error.response?.data?.message || 'An error occurred during login'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup submit
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const signupData: SignupData = {
        name: formData.name,
        password: formData.password
      };

      // Check if email or mobile is provided
      if (formData.email.match(/^[0-9]{10}$/)) {
        signupData.mobile = formData.email;
      } else {
        signupData.email = formData.email;
      }

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/auth/register`,
        signupData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSuccessMessage('Registration successful! Please login to continue.');
        setTimeout(() => {
          setMode('login');
          setFormData(INITIAL_FORM_STATE);
          setErrors({});
        }, 2000);
      } else {
        setErrors({ submit: response.data.message || 'Registration failed' });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setErrors({
        submit: error.response?.data?.message || 'An error occurred during registration'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Social login handlers
  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setSocialLoginLoading(true);
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/auth/${provider}`);
      window.location.href = response.data.authUrl;
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || `Failed to login with ${provider}`
      });
    } finally {
      setSocialLoginLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/forgot-password`, {
        email: formData.email
      });

      if (response.data.success) {
        setOtpStep('verify');
        setOtpTimer(true);
        setSuccessMessage('Password reset email sent successfully!');
      }
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || 'Failed to send reset email. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/verify-reset-token/${formData.otp}`, {
        email: formData.email
      });

      if (response.data.success) {
        setOtpStep('reset');
      }
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || 'Invalid reset token. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validate password
    const passwordError = validateField('password', formData.password);
    const confirmError = validateField('confirmPassword', formData.confirmPassword);

    if (passwordError || confirmError) {
      setErrors({
        password: passwordError,
        confirmPassword: confirmError
      });
      setIsLoading(false);
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrors({
        confirmPassword: 'Passwords do not match'
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/reset-password/${formData.otp}`, {
        password: formData.password
      });

      if (response.data.success) {
        setResetSuccess(true);
        setSuccessMessage('Password reset successfully! You can now login with your new password.');
        setTimeout(() => {
          setMode('login');
          setFormData(INITIAL_FORM_STATE);
          setErrors({});
          setResetSuccess(false);
        }, 3000);
      }
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || 'Failed to reset password. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render OTP verification form
  const renderOTPVerificationForm = () => (
    <form onSubmit={handleVerifyOTP}>
      <div className="form-group">
        <label>Enter OTP</label>
        <p className="otp-instruction">
          Please enter the 6-digit OTP sent to your {formData.email.match(/^[0-9]{10}$/) ? 'mobile number' : 'email address'}
        </p>
        <OTPInput
          value={formData.otp}
          onChange={(otp: string) => setFormData(prev => ({ ...prev, otp }))}
          disabled={isLoading}
        />
        <div className="otp-timer-container">
          <OTPTimer
            initialSeconds={180}
            onExpire={() => setOtpTimer(false)}
            isActive={otpTimer}
          />
          {!otpTimer && (
            <button
              type="button"
              className="resend-otp-btn"
              onClick={handleSendOTP}
              disabled={isLoading}
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>

      {errors.submit && (
        <div className="error-message">
          <FontAwesomeIcon icon={faExclamationCircle} />
          {errors.submit}
        </div>
      )}

      <button 
        type="submit" 
        className="submit-button"
        disabled={isLoading || formData.otp.length !== 6}
      >
        {isLoading ? (
          <div className="button-loader" />
        ) : (
          <>
            <FontAwesomeIcon icon={faKey} />
            Verify OTP
          </>
        )}
      </button>
    </form>
  );

  // Render forgot password initial form
  const renderForgotPasswordForm = () => (
    <form onSubmit={handleSendOTP}>
      <div className="form-group">
        <label htmlFor="email">Email or Mobile Number</label>
        <input
          type="text"
          id="email"
          name="email"
          className={`form-control ${errors.email ? 'error' : ''}`}
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your registered email or mobile"
          disabled={isLoading}
        />
        {errors.email && <div className="error-message">{errors.email}</div>}
      </div>

      {errors.submit && (
        <div className="error-message">
          <FontAwesomeIcon icon={faExclamationCircle} />
          {errors.submit}
        </div>
      )}

      <button 
        type="submit" 
        className="submit-button"
        disabled={isLoading || !formData.email}
      >
        {isLoading ? (
          <div className="button-loader" />
        ) : (
          <>
            <FontAwesomeIcon icon={faEnvelope} />
            Send OTP
          </>
        )}
      </button>

      <div className="auth-footer">
        Remember your password?
        <button 
          type="button"
          onClick={() => {
            setMode('login');
            setFormData(INITIAL_FORM_STATE);
            setErrors({});
          }}
          className="switch-auth-mode"
          disabled={isLoading}
        >
          Sign In
        </button>
      </div>
    </form>
  );

  // Render reset password form
  const renderResetPasswordForm = () => (
    <form onSubmit={handleResetPassword}>
      <div className="form-group">
        <label htmlFor="password">New Password</label>
        <div className="password-input">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            className={`form-control ${errors.password ? 'error' : ''}`}
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter new password"
            disabled={isLoading}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        {errors.password && <div className="error-message">{errors.password}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm New Password</label>
        <div className="password-input">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm new password"
            disabled={isLoading}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
      </div>

      {errors.submit && (
        <div className="error-message">
          <FontAwesomeIcon icon={faExclamationCircle} />
          {errors.submit}
        </div>
      )}

      <button 
        type="submit" 
        className="submit-button"
        disabled={isLoading || !formData.password || !formData.confirmPassword}
      >
        {isLoading ? (
          <div className="button-loader" />
        ) : (
          <>
            <FontAwesomeIcon icon={faKey} />
            Reset Password
          </>
        )}
      </button>
    </form>
  );

  // Render login/signup form
  const renderAuthForm = () => (
    <form className="auth-form" onSubmit={mode === 'login' ? handleLogin : handleSignup}>
      {successMessage && (
        <div className="success-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          {successMessage}
        </div>
      )}

      {errors.submit && !successMessage && (
        <div className="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {errors.submit}
        </div>
      )}

      {mode === 'signup' && (
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className={`form-control ${errors.name ? 'error' : ''}`}
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            disabled={isLoading}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="email">Email or Mobile Number</label>
        <input
          type="text"
          id="email"
          name="email"
          className={`form-control ${errors.email ? 'error' : ''}`}
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email or mobile number"
          disabled={isLoading}
        />
        {errors.email && <div className="error-message">{errors.email}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <div className="password-input">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            className={`form-control ${errors.password ? 'error' : ''}`}
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            disabled={isLoading}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        {errors.password && <div className="error-message">{errors.password}</div>}
      </div>

      {mode === 'signup' && (
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-input">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              disabled={isLoading}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
        </div>
      )}

      {mode === 'login' && (
        <div className="form-options">
          <label className="remember-me">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            Remember me
          </label>
          <button
            type="button"
            className="forgot-password-link"
            onClick={() => {
              setMode('forgot');
              setFormData(INITIAL_FORM_STATE);
              setErrors({});
            }}
            disabled={isLoading}
          >
            Forgot Password?
          </button>
        </div>
      )}

      <button 
        type="submit" 
        className="submit-button"
        disabled={isLoading || socialLoginLoading}
      >
        {isLoading ? (
          <div className="button-loader" />
        ) : (
          <>
            <FontAwesomeIcon icon={mode === 'login' ? faSignInAlt : faUserPlus} />
            {mode === 'login' ? 'Sign In' : 'Sign Up'}
          </>
        )}
      </button>

      <div className="auth-footer">
        {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
        <button 
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setFormData(INITIAL_FORM_STATE);
            setErrors({});
          }}
          className="switch-auth-mode"
          disabled={isLoading}
        >
          {mode === 'login' ? 'Sign Up' : 'Sign In'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="auth-container" onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>
      <div className="auth-card">
        <button className="auth-close" onClick={onClose} aria-label="Close">
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {isLoading && <div className="loading-overlay" />}

        {/* Welcome Panel */}
        <div className="welcome-panel">
          <h2>
            {mode === 'forgot'
              ? otpStep === 'init' 
                ? 'Reset Password'
                : otpStep === 'verify'
                  ? 'Verify OTP'
                  : 'Create New Password'
              : mode === 'login'
                ? 'Welcome Back!'
                : 'Join Us Today'}
          </h2>
          <p>
            {mode === 'forgot'
              ? otpStep === 'init'
                ? 'Enter your email or mobile number to receive OTP'
                : otpStep === 'verify'
                  ? 'Enter the OTP sent to your email/mobile'
                  : 'Create a new strong password for your account'
              : mode === 'login'
                ? 'Sign in to continue your typing journey and access all your progress.'
                : 'Create an account to start your typing journey and unlock premium features.'}
          </p>
          {mode !== 'forgot' && (
            <div className="welcome-social">
              <div className="social-buttons">
                <button 
                  className="social-button google-button"
                  onClick={() => handleSocialLogin('google')}
                  disabled={socialLoginLoading || isLoading}
                >
                  <FontAwesomeIcon icon={faGoogle} />
                  Continue with Google
                </button>
                <button 
                  className="social-button github-button"
                  onClick={() => handleSocialLogin('github')}
                  disabled={socialLoginLoading || isLoading}
                >
                  <FontAwesomeIcon icon={faGithub} />
                  Continue with GitHub
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Form Panel */}
        <div className="form-panel">
          {mode === 'forgot' ? (
            otpStep === 'init' 
              ? renderForgotPasswordForm()
              : otpStep === 'verify'
                ? renderOTPVerificationForm()
                : renderResetPasswordForm()
          ) : (
            renderAuthForm()
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth; 