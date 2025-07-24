import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faSpinner, faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import Toast, { ToastType } from '../../../components/Toast/Toast';
import './AssignPassage.css';
import { useAdmin } from '../../../contexts/AdminContext';
import { Passage } from '../../../types/Passage';

interface AssignPassageProps {
  passages: Passage[];
  onPassageAssigned: () => Promise<void>;
}

interface ValidationErrors {
  passage?: string;
  categories?: string;
}

const TEST_CATEGORIES = [
  { id: 'ssc-cgl', name: 'SSC CGL' },
  { id: 'ssc-chsl', name: 'SSC CHSL' },
  { id: 'rrb-ntpc', name: 'RRB NTPC' },
  { id: 'junior-assistant', name: 'Junior Assistant' },
  { id: 'superintendent', name: 'Superintendent' },
  { id: 'junior-court-assistant', name: 'Junior Court Assistant' },
  { id: 'certificate-test', name: 'Certificate Test' },
  { id: 'create-test', name: 'Create Test' },
  { id: 'typing-test', name: 'Typing Test' },
  { id: 'up-police', name: 'UP Police' },
  { id: 'bihar-police', name: 'Bihar Police' },
  { id: 'aiims-crc', name: 'AIIMS CRC' },
  { id: 'allahabad-high-court', name: 'Allahabad High Court' }
];

const API_BASE_URL = 'http://localhost:9500/api';

const AssignPassage: React.FC<AssignPassageProps> = ({ passages, onPassageAssigned }) => {
  const [selectedPassage, setSelectedPassage] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ passage: boolean; categories: boolean }>({
    passage: false,
    categories: false
  });
  const [selectedPassageData, setSelectedPassageData] = useState<Passage | null>(null);
  const [toast, setToast] = useState<{
    show: boolean;
    type: ToastType;
    message: string;
  }>({
    show: false,
    type: 'info',
    message: ''
  });

  useEffect(() => {
    if (selectedPassage) {
      const passage = passages.find((p: Passage) => p._id === selectedPassage);
      setSelectedPassageData(passage || null);
    } else {
      setSelectedPassageData(null);
    }
  }, [selectedPassage, passages]);

  // Validation functions
  const validatePassage = (value: string): string | undefined => {
    if (!value.trim()) return 'Please select a passage';
    return undefined;
  };

  const validateCategories = (value: string[]): string | undefined => {
    if (value.length === 0) return 'Please select at least one test category';
    return undefined;
  };

  // Real-time validation
  useEffect(() => {
    if (touched.passage) {
      const passageError = validatePassage(selectedPassage);
      setErrors(prev => ({ ...prev, passage: passageError }));
    }
  }, [selectedPassage, touched.passage]);

  useEffect(() => {
    if (touched.categories) {
      const categoriesError = validateCategories(selectedCategories);
      setErrors(prev => ({ ...prev, categories: categoriesError }));
    }
  }, [selectedCategories, touched.categories]);

  const handleBlur = (field: 'passage' | 'categories') => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handlePassageChange = (value: string) => {
    setSelectedPassage(value);
    if (errors.passage) {
      setErrors(prev => ({ ...prev, passage: undefined }));
    }
  };

  const handleCategoryChange = (categoryName: string) => {
    const newCategories = selectedCategories.includes(categoryName)
      ? selectedCategories.filter(c => c !== categoryName)
      : [...selectedCategories, categoryName];
    
    setSelectedCategories(newCategories);
    
    if (errors.categories) {
      setErrors(prev => ({ ...prev, categories: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const passageError = validatePassage(selectedPassage);
    const categoriesError = validateCategories(selectedCategories);
    
    const newErrors: ValidationErrors = {};
    if (passageError) newErrors.passage = passageError;
    if (categoriesError) newErrors.categories = categoriesError;
    
    setErrors(newErrors);
    setTouched({ passage: true, categories: true });
    
    return Object.keys(newErrors).length === 0;
  };

  const showToast = (type: ToastType, message: string) => {
    setToast({ show: true, type, message });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const handleAssign = async (e: React.FormEvent) => {
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

      // Assign passage to all selected categories in one request
      const response = await fetch(`${API_BASE_URL}/passages/assign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          passageId: selectedPassage,
          categories: selectedCategories
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to assign passage');
      }

      const data = await response.json();
      showToast('success', `Passage assigned successfully to ${selectedCategories.length} test category(ies)!`);
      setSelectedPassage('');
      setSelectedCategories([]);
      setSelectedPassageData(null);
      setErrors({});
      setTouched({ passage: false, categories: false });
      await onPassageAssigned();
    } catch (err: any) {
      console.error('Assignment error:', err);
      const errorMessage = err.message || 'Failed to assign passage. Please try again.';
      showToast('error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = !errors.passage && !errors.categories && selectedPassage && selectedCategories.length > 0;

  return (
    <div className="assign-passage">
      <form onSubmit={handleAssign}>
        <div className="form-group">
          <label htmlFor="passage">
            Select Passage <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <select
              id="passage"
              value={selectedPassage}
              onChange={(e) => handlePassageChange(e.target.value)}
              onBlur={() => handleBlur('passage')}
              required
              disabled={isSubmitting}
              className={`${errors.passage ? 'error' : ''} ${touched.passage && !errors.passage && selectedPassage ? 'valid' : ''}`}
            >
              <option value="">Select a Passage</option>
              {passages.map((passage: Passage) => (
                <option key={passage._id} value={passage._id}>
                  {passage.title}
                </option>
              ))}
            </select>
            {touched.passage && errors.passage && (
              <div className="error-icon">
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </div>
            )}
            {touched.passage && !errors.passage && selectedPassage && (
              <div className="valid-icon">
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
            )}
          </div>
          {errors.passage && (
            <div className="error-message">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              {errors.passage}
            </div>
          )}
          {touched.passage && !errors.passage && selectedPassage && (
            <div className="valid-message">
              <FontAwesomeIcon icon={faCheckCircle} />
              Passage selected!
            </div>
          )}
        </div>

        <div className="form-group">
          <label>
            Select Test Categories <span className="required">*</span>
          </label>
          <div 
            className={`checkbox-group ${errors.categories ? 'error' : ''} ${touched.categories && !errors.categories && selectedCategories.length > 0 ? 'valid' : ''}`}
            onBlur={() => handleBlur('categories')}
          >
            {TEST_CATEGORIES.map((category) => (
              <label key={category.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.name)}
                  onChange={() => handleCategoryChange(category.name)}
                  disabled={isSubmitting}
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>
          {errors.categories && (
            <div className="error-message">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              {errors.categories}
            </div>
          )}
          {touched.categories && !errors.categories && selectedCategories.length > 0 && (
            <div className="valid-message">
              <FontAwesomeIcon icon={faCheckCircle} />
              {selectedCategories.length} category(ies) selected!
            </div>
          )}
          <div className="selection-count">
            {selectedCategories.length}/9 categories selected
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
              Assigning Passage...
            </div>
          ) : (
            <>
              <FontAwesomeIcon icon={faLink} /> Assign Passage
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

export default AssignPassage; 