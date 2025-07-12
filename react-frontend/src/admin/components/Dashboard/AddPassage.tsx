import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { api } from '../../../utils/api';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import Toast, { ToastType } from '../../../components/Toast/Toast';
import './AddPassage.css';
import { useAdmin } from '../../../contexts/AdminContext';
import { Passage } from '../../../types/Passage';

interface AddPassageProps {
  onPassageAdded: () => Promise<void>;
}

interface ValidationErrors {
  title?: string;
  content?: string;
}

const AddPassage: React.FC<AddPassageProps> = ({ onPassageAdded }) => {
  const { setPassages } = useAdmin();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ title: boolean; content: boolean }>({
    title: false,
    content: false
  });
  const [toast, setToast] = useState<{
    show: boolean;
    type: ToastType;
    message: string;
  }>({
    show: false,
    type: 'info',
    message: ''
  });

  // Validation rules
  const validateTitle = (value: string): string | undefined => {
    if (!value.trim()) return 'Title is required';
    if (value.trim().length < 3) return 'Title must be at least 3 characters';
    if (value.trim().length > 200) return 'Title must be less than 200 characters';
    if (!/^[a-zA-Z0-9\s\-_.,!?()]+$/.test(value.trim())) {
      return 'Title contains invalid characters';
    }
    return undefined;
  };

  const validateContent = (value: string): string | undefined => {
    if (!value.trim()) return 'Content is required';
    if (value.trim().length < 10) return 'Content must be at least 10 characters';
    if (value.trim().length > 5000) return 'Content must be less than 5000 characters';
    return undefined;
  };

  // Real-time validation
  useEffect(() => {
    if (touched.title) {
      const titleError = validateTitle(title);
      setErrors(prev => ({ ...prev, title: titleError }));
    }
  }, [title, touched.title]);

  useEffect(() => {
    if (touched.content) {
      const contentError = validateContent(content);
      setErrors(prev => ({ ...prev, content: contentError }));
    }
  }, [content, touched.content]);

  const handleBlur = (field: 'title' | 'content') => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleInputChange = (field: 'title' | 'content', value: string) => {
    if (field === 'title') {
      setTitle(value);
    } else {
      setContent(value);
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const titleError = validateTitle(title);
    const contentError = validateContent(content);
    
    const newErrors: ValidationErrors = {};
    if (titleError) newErrors.title = titleError;
    if (contentError) newErrors.content = contentError;
    
    setErrors(newErrors);
    setTouched({ title: true, content: true });
    
    return Object.keys(newErrors).length === 0;
  };

  const showToast = (type: ToastType, message: string) => {
    setToast({ show: true, type, message });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('error', 'Please fix the validation errors before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await api.post(
        '/api/passages',
        {
          title: title.trim(),
          content: content.trim()
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const newPassage: Passage = {
        _id: response._id,
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date(response.createdAt || Date.now())
      };

      setPassages((prev: Passage[]) => [...prev, newPassage]);
      setTitle('');
      setContent('');
      setErrors({});
      setTouched({ title: false, content: false });
      await onPassageAdded();
      showToast('success', 'Passage added successfully!');
    } catch (err: any) {
      console.error('Error adding passage:', err);
      const errorMessage = err.response?.data?.message || 'Failed to add passage. Please try again.';
      showToast('error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = !errors.title && !errors.content && title.trim() && content.trim();

  return (
    <div className="add-passage">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">
            Title <span className="required">*</span>
          </label>
          <div className="input-wrapper">
          <input
            type="text"
            id="title"
            value={title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
              placeholder="Enter passage title (3-200 characters)"
            required
            disabled={isSubmitting}
              className={`${errors.title ? 'error' : ''} ${touched.title && !errors.title && title.trim() ? 'valid' : ''}`}
              maxLength={200}
            />
            {touched.title && errors.title && (
              <div className="error-icon">
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </div>
            )}
            {touched.title && !errors.title && title.trim() && (
              <div className="valid-icon">
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
            )}
          </div>
          {errors.title && (
            <div className="error-message">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              {errors.title}
            </div>
          )}
          {touched.title && !errors.title && title.trim() && (
            <div className="valid-message">
              <FontAwesomeIcon icon={faCheckCircle} />
              Title looks good!
            </div>
          )}
          <div className="character-count">
            {title.length}/200 characters
        </div>
        </div>

        <div className="form-group">
          <label htmlFor="content">
            Content <span className="required">*</span>
          </label>
          <div className="input-wrapper">
          <textarea
            id="content"
            value={content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              onBlur={() => handleBlur('content')}
              placeholder="Enter passage content (10-5000 characters)"
            required
            disabled={isSubmitting}
              className={`${errors.content ? 'error' : ''} ${touched.content && !errors.content && content.trim() ? 'valid' : ''}`}
              maxLength={5000}
              rows={8}
            />
            {touched.content && errors.content && (
              <div className="error-icon">
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </div>
            )}
            {touched.content && !errors.content && content.trim() && (
              <div className="valid-icon">
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
            )}
          </div>
          {errors.content && (
            <div className="error-message">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              {errors.content}
            </div>
          )}
          {touched.content && !errors.content && content.trim() && (
            <div className="valid-message">
              <FontAwesomeIcon icon={faCheckCircle} />
              Content looks good!
            </div>
          )}
          <div className="character-count">
            {content.length}/5000 characters
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting || !isFormValid}
          className={!isFormValid ? 'disabled' : ''}
        >
          {isSubmitting ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LoadingSpinner size="small" type="dots" text="" />
              Adding Passage...
            </div>
          ) : (
            <>
              <FontAwesomeIcon icon={faPlus} /> Add Passage
            </>
          )}
        </button>
      </form>

      {/* Toast Notification */}
      <Toast
        type={toast.type}
        message={toast.message}
        show={toast.show}
        onClose={hideToast}
        duration={4000}
      />
    </div>
  );
};

export default AddPassage; 