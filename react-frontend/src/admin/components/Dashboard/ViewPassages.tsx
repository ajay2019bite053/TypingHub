import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faTrash, 
  faSearch, 
  faAngleLeft, 
  faAngleRight,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faExclamationTriangle,
  faQuestionCircle,
  faCheckCircle,
  faDownload,
  faUpload,
  faFileCsv,
  faFileCode,
  faCheck,
  faTimes,
  faFilter,
  faSort,
  faCalendarAlt,
  faFont,
  faLayerGroup,
  faGlobe,
  faSortAmountDown,
  faSortAmountUp
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../contexts/AuthContext';
import { useDeleteRequest } from '../../../contexts/DeleteRequestContext';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import Toast, { ToastType } from '../../../components/Toast/Toast';
import './ViewPassages.css';
import { Passage } from '../../../types/Passage';

interface ViewPassagesProps {
  passages: Passage[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

interface ConfirmationDialog {
  show: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type: 'danger' | 'warning' | 'info';
  action: (() => void) | null;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

interface FilterOptions {
  testType: string;
  difficulty: string;
  language: string;
  dateFrom: string;
  dateTo: string;
  wordCountMin: string;
  wordCountMax: string;
  isActive: string;
}

interface SortOptions {
  field: 'title' | 'content' | 'createdAt' | 'wordCount' | 'testType';
  direction: 'asc' | 'desc';
}

const ViewPassages: React.FC<ViewPassagesProps> = ({
  passages,
  onEdit,
  onDelete
}) => {
  const { user } = useAuth();
  const { addDeleteRequest } = useDeleteRequest();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filteredPassages, setFilteredPassages] = useState<Passage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    show: boolean;
    type: ToastType;
    message: string;
  }>({
    show: false,
    type: 'info',
    message: ''
  });
  const [confirmationDialog, setConfirmationDialog] = useState<ConfirmationDialog>({
    show: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'info',
    action: null
  });
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    testType: '',
    difficulty: '',
    language: '',
    dateFrom: '',
    dateTo: '',
    wordCountMin: '',
    wordCountMax: '',
    isActive: ''
  });
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: 'createdAt',
    direction: 'desc'
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Page size options
  const pageSizeOptions = [5, 10, 20, 50, 100];

  // Filter options
  const testTypeOptions = ['general', 'typing', 'comprehension', 'grammar', 'vocabulary'];
  const difficultyOptions = ['easy', 'medium', 'hard'];
  const languageOptions = ['english', 'hindi'];
  const isActiveOptions = ['true', 'false'];

  useEffect(() => {
    const filterAndSortPassages = () => {
      setIsLoading(true);
      try {
        let filtered = [...passages];

        // Apply search filter
        if (searchTerm.trim()) {
          filtered = filtered.filter(passage =>
            passage.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            passage.content.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        // Apply filters
        if (filters.testType) {
          filtered = filtered.filter(passage => 
            passage.testType === filters.testType
          );
        }

        if (filters.difficulty) {
          filtered = filtered.filter(passage => 
            passage.difficulty === filters.difficulty
          );
        }

        if (filters.language) {
          filtered = filtered.filter(passage => 
            passage.language === filters.language
          );
        }

        if (filters.dateFrom) {
          filtered = filtered.filter(passage => 
            new Date(passage.createdAt) >= new Date(filters.dateFrom)
          );
        }

        if (filters.dateTo) {
          filtered = filtered.filter(passage => 
            new Date(passage.createdAt) <= new Date(filters.dateTo + 'T23:59:59')
          );
        }

        if (filters.wordCountMin) {
          const minWords = parseInt(filters.wordCountMin);
          filtered = filtered.filter(passage => 
            (passage.wordCount || 0) >= minWords
          );
        }

        if (filters.wordCountMax) {
          const maxWords = parseInt(filters.wordCountMax);
          filtered = filtered.filter(passage => 
            (passage.wordCount || 0) <= maxWords
          );
        }

        if (filters.isActive) {
          const isActive = filters.isActive === 'true';
          filtered = filtered.filter(passage => 
            passage.isActive === isActive
          );
        }

        // Apply sorting
        filtered.sort((a, b) => {
          let aValue: any = a[sortOptions.field];
          let bValue: any = b[sortOptions.field];

          // Handle special cases
          if (sortOptions.field === 'wordCount') {
            aValue = aValue || 0;
            bValue = bValue || 0;
          } else if (sortOptions.field === 'createdAt') {
            aValue = new Date(aValue).getTime();
            bValue = new Date(bValue).getTime();
          } else {
            aValue = String(aValue || '').toLowerCase();
            bValue = String(bValue || '').toLowerCase();
          }

          if (sortOptions.direction === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });

        setFilteredPassages(filtered);
        setError(null);
        setCurrentPage(1);

        // Update active filters display
        const active: string[] = [];
        if (filters.testType) active.push(`Test Type: ${filters.testType}`);
        if (filters.difficulty) active.push(`Difficulty: ${filters.difficulty}`);
        if (filters.language) active.push(`Language: ${filters.language}`);
        if (filters.dateFrom) active.push(`From: ${filters.dateFrom}`);
        if (filters.dateTo) active.push(`To: ${filters.dateTo}`);
        if (filters.wordCountMin) active.push(`Min Words: ${filters.wordCountMin}`);
        if (filters.wordCountMax) active.push(`Max Words: ${filters.wordCountMax}`);
        if (filters.isActive) active.push(`Active: ${filters.isActive === 'true' ? 'Yes' : 'No'}`);
        setActiveFilters(active);

      } catch (err) {
        showToast('error', 'Error filtering passages. Please try again.');
        console.error('Error filtering passages:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(filterAndSortPassages, 300);
    return () => clearTimeout(debounceTimer);
  }, [passages, searchTerm, filters, sortOptions]);

  // Reset to first page when page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  const totalPages = Math.ceil(filteredPassages.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPassages = filteredPassages.slice(startIndex, endIndex);

  // Pagination functions
  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  // Filter functions
  const handleFilterChange = (field: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      testType: '',
      difficulty: '',
      language: '',
      dateFrom: '',
      dateTo: '',
      wordCountMin: '',
      wordCountMax: '',
      isActive: ''
    });
    setActiveFilters([]);
  };

  const removeFilter = (filterText: string) => {
    const newFilters = { ...filters };
    
    if (filterText.includes('Test Type:')) newFilters.testType = '';
    if (filterText.includes('Difficulty:')) newFilters.difficulty = '';
    if (filterText.includes('Language:')) newFilters.language = '';
    if (filterText.includes('From:')) newFilters.dateFrom = '';
    if (filterText.includes('To:')) newFilters.dateTo = '';
    if (filterText.includes('Min Words:')) newFilters.wordCountMin = '';
    if (filterText.includes('Max Words:')) newFilters.wordCountMax = '';
    if (filterText.includes('Active:')) newFilters.isActive = '';
    
    setFilters(newFilters);
  };

  // Sort functions
  const handleSort = (field: SortOptions['field']) => {
    setSortOptions(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (field: SortOptions['field']) => {
    if (sortOptions.field !== field) {
      return <FontAwesomeIcon icon={faSort} />;
    }
    return sortOptions.direction === 'asc' 
      ? <FontAwesomeIcon icon={faSortAmountUp} />
      : <FontAwesomeIcon icon={faSortAmountDown} />;
  };

  const showConfirmationDialog = (dialog: Omit<ConfirmationDialog, 'show'>) => {
    setConfirmationDialog({
      ...dialog,
      show: true
    });
  };

  const hideConfirmationDialog = () => {
    setConfirmationDialog(prev => ({ ...prev, show: false }));
  };

  const executeConfirmationAction = () => {
    if (confirmationDialog.action) {
      confirmationDialog.action();
    }
    hideConfirmationDialog();
  };

  const handleDeleteClick = (passage: Passage) => {
    if (user?.role === 'super_admin') {
      showConfirmationDialog({
        title: 'Delete Passage',
        message: `Are you sure you want to permanently delete the passage "${passage.title}"? This action cannot be undone and will remove the passage from all assigned tests.`,
        confirmText: 'Delete Permanently',
        cancelText: 'Cancel',
        type: 'danger',
        action: () => {
          onDelete(passage._id);
          showToast('success', 'Passage deleted successfully!');
        }
      });
    } else {
      showConfirmationDialog({
        title: 'Request Deletion',
        message: `Are you sure you want to request deletion of the passage "${passage.title}"? This will create a deletion request that needs to be approved by a super administrator.`,
        confirmText: 'Request Deletion',
        cancelText: 'Cancel',
        type: 'warning',
        action: async () => {
          try {
        await addDeleteRequest({
          type: 'passage',
              itemId: passage._id,
              itemName: passage.title,
          requestedBy: {
            id: user?.id || '',
            email: user?.email || ''
          }
        });
            showToast('success', 'Delete request submitted successfully! It will be reviewed by a super administrator.');
          } catch (err) {
            showToast('error', 'Failed to submit delete request. Please try again.');
          }
        }
      });
    }
  };

  const handleEditClick = (passage: Passage) => {
    showConfirmationDialog({
      title: 'Edit Passage',
      message: `Are you sure you want to edit the passage "${passage.title}"? You will be redirected to the edit form.`,
      confirmText: 'Edit Passage',
      cancelText: 'Cancel',
      type: 'info',
      action: () => {
        onEdit(passage._id);
      }
    });
  };

  // Export Functions
  const exportToCSV = () => {
    const headers = ['Title', 'Content', 'Test Type', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...currentPassages.map(passage => [
        `"${passage.title.replace(/"/g, '""')}"`,
        `"${passage.content.replace(/"/g, '""')}"`,
        `"${passage.testType || ''}"`,
        `"${new Date(passage.createdAt).toLocaleDateString()}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `passages_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('success', 'Passages exported to CSV successfully!');
    setShowExportOptions(false);
  };

  const exportToJSON = () => {
    const exportData = currentPassages.map(passage => ({
      title: passage.title,
      content: passage.content,
      testType: passage.testType || '',
      createdAt: passage.createdAt
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `passages_export_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('success', 'Passages exported to JSON successfully!');
    setShowExportOptions(false);
  };

  // Import Functions
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
      setImportProgress(null);
    }
  };

  const handleImport = async () => {
    if (!importFile) return;

    setIsImporting(true);
    setImportProgress(null);

    try {
      const text = await importFile.text();
      let importData: any[] = [];
      const errors: string[] = [];

      // Try to parse as JSON first
      try {
        const jsonData = JSON.parse(text);
        importData = Array.isArray(jsonData) ? jsonData : [jsonData];
      } catch {
        // Try to parse as CSV
        const lines = text.split('\n');
        const headers = lines[0]?.split(',').map(h => h.trim().replace(/"/g, ''));
        
        if (headers && headers.length >= 2) {
          importData = lines.slice(1).map((line, index) => {
            const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
            return {
              title: values[0] || '',
              content: values[1] || '',
              testType: values[2] || 'general',
              difficulty: values[3] || 'medium',
              language: values[4] || 'english'
            };
          }).filter(item => item.title && item.content);
        } else {
          throw new Error('Invalid file format');
        }
      }

      // Call backend API to import passages
      const response = await fetch('/api/passages/bulk-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ passages: importData })
      });

      const result = await response.json();

      if (response.ok) {
        setImportProgress({
          success: result.data.success,
          failed: result.data.failed,
          errors: result.data.errors
        });

        if (result.data.success > 0) {
          showToast('success', `Successfully imported ${result.data.success} passages!`);
          // Refresh the passages list
          window.location.reload();
        }
        if (result.data.failed > 0) {
          showToast('warning', `${result.data.failed} passages failed to import. Check the details below.`);
        }
      } else {
        throw new Error(result.message || 'Import failed');
      }

    } catch (err) {
      showToast('error', `Failed to import file: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setImportProgress({
        success: 0,
        failed: 1,
        errors: [err instanceof Error ? err.message : 'Unknown error']
      });
    } finally {
      setIsImporting(false);
    }
  };

  const resetImport = () => {
    setImportFile(null);
    setImportProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getContentPreview = (content: string) => {
    return content.length > 200 ? content.substring(0, 200) + '...' : content;
  };

  const showToast = (type: ToastType, message: string) => {
    setToast({ show: true, type, message });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const getConfirmationIcon = () => {
    switch (confirmationDialog.type) {
      case 'danger':
        return <FontAwesomeIcon icon={faExclamationTriangle} className="danger-icon" />;
      case 'warning':
        return <FontAwesomeIcon icon={faQuestionCircle} className="warning-icon" />;
      case 'info':
        return <FontAwesomeIcon icon={faCheckCircle} className="info-icon" />;
      default:
        return <FontAwesomeIcon icon={faQuestionCircle} className="info-icon" />;
    }
  };

  if (isLoading) {
    return (
      <div className="view-passages">
        <LoadingSpinner 
          text="Loading passages..." 
          type="dots" 
          size="medium"
        />
      </div>
    );
  }

  return (
    <div className="view-passages">
      <div className="view-passages-header">
        <h2>View Passages</h2>
        <p>Manage and view all passages in the system</p>
      </div>

      {/* Advanced Search and Filters */}
      <div className="advanced-search-section">
        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search passages by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
            title="Toggle Advanced Filters"
          >
            <FontAwesomeIcon icon={faFilter} />
            Filters
            {activeFilters.length > 0 && (
              <span className="filter-count">{activeFilters.length}</span>
            )}
          </button>

          <div className="page-size-selector">
            <label htmlFor="page-size">Show:</label>
            <select
              id="page-size"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="page-size-select"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  {size} passages
                </option>
              ))}
            </select>
          </div>

          {/* Export/Import Buttons */}
          <div className="export-import-controls">
            <button
              onClick={() => setShowExportOptions(true)}
              className="export-btn"
              title="Export Passages"
            >
              <FontAwesomeIcon icon={faDownload} />
              Export
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="import-btn"
              title="Import Passages"
            >
              <FontAwesomeIcon icon={faUpload} />
              Import
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-header">
            <h4>Advanced Filters</h4>
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear All
            </button>
          </div>

          <div className="filters-grid">
            <div className="filter-group">
              <label htmlFor="test-type-filter">
                <FontAwesomeIcon icon={faLayerGroup} />
                Test Type
              </label>
              <select
                id="test-type-filter"
                value={filters.testType}
                onChange={(e) => handleFilterChange('testType', e.target.value)}
                className="filter-select"
              >
                <option value="">All Types</option>
                {testTypeOptions.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="difficulty-filter">
                <FontAwesomeIcon icon={faSortAmountDown} />
                Difficulty
              </label>
              <select
                id="difficulty-filter"
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="filter-select"
              >
                <option value="">All Difficulties</option>
                {difficultyOptions.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="language-filter">
                <FontAwesomeIcon icon={faGlobe} />
                Language
              </label>
              <select
                id="language-filter"
                value={filters.language}
                onChange={(e) => handleFilterChange('language', e.target.value)}
                className="filter-select"
              >
                <option value="">All Languages</option>
                {languageOptions.map(lang => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="date-from-filter">
                <FontAwesomeIcon icon={faCalendarAlt} />
                Date From
              </label>
              <input
                id="date-from-filter"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="date-to-filter">
                <FontAwesomeIcon icon={faCalendarAlt} />
                Date To
              </label>
              <input
                id="date-to-filter"
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="word-count-min-filter">
                <FontAwesomeIcon icon={faFont} />
                Min Words
              </label>
              <input
                id="word-count-min-filter"
                type="number"
                placeholder="Min"
                value={filters.wordCountMin}
                onChange={(e) => handleFilterChange('wordCountMin', e.target.value)}
                className="filter-input"
                min="0"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="word-count-max-filter">
                <FontAwesomeIcon icon={faFont} />
                Max Words
              </label>
              <input
                id="word-count-max-filter"
                type="number"
                placeholder="Max"
                value={filters.wordCountMax}
                onChange={(e) => handleFilterChange('wordCountMax', e.target.value)}
                className="filter-input"
                min="0"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="is-active-filter">
                <FontAwesomeIcon icon={faCheck} />
                Status
              </label>
              <select
                id="is-active-filter"
                value={filters.isActive}
                onChange={(e) => handleFilterChange('isActive', e.target.value)}
                className="filter-select"
              >
                <option value="">All Status</option>
                {isActiveOptions.map(option => (
                  <option key={option} value={option}>
                    {option === 'true' ? 'Active' : 'Inactive'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFilters.length > 0 && (
            <div className="active-filters">
              <span>Active Filters:</span>
              {activeFilters.map((filter, index) => (
                <span key={index} className="active-filter-tag">
                  {filter}
                  <button
                    onClick={() => removeFilter(filter)}
                    className="remove-filter-btn"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Results Summary */}
      <div className="results-summary">
        <p>
          Showing {startIndex + 1}-{Math.min(endIndex, filteredPassages.length)} of {filteredPassages.length} passages
          {searchTerm && ` matching "${searchTerm}"`}
          {activeFilters.length > 0 && ` with ${activeFilters.length} filter(s)`}
        </p>
      </div>

      {/* Passages Table */}
      {currentPassages.length === 0 ? (
        <div className="no-passages">
          <p>
            {searchTerm || activeFilters.length > 0
              ? `No passages found matching your search and filter criteria`
              : 'No passages available'
            }
          </p>
        </div>
      ) : (
        <>
          <div className="passages-table-wrapper">
            <table className="passages-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('title')} className="sortable-header">
                    Title {getSortIcon('title')}
                  </th>
                  <th>Content Preview</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPassages.map((passage) => (
                  <tr key={passage._id}>
                    <td className="passage-title">{passage.title}</td>
                    <td className="passage-content">{getContentPreview(passage.content)}</td>
                    <td className="passage-actions">
                        <button
                          onClick={() => handleEditClick(passage)}
                          className="edit-btn"
                          title="Edit Passage"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(passage)}
                          className="delete-btn"
                          title={user?.role === 'super_admin' ? 'Delete Passage' : 'Request Deletion'}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                          {user?.role === 'super_admin' ? 'Delete' : 'Request Deletion'}
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-section">
              <div className="pagination-info">
                <span>Page {currentPage} of {totalPages}</span>
              </div>

              <div className="pagination-controls">
                <button
                  onClick={handleFirstPage}
                  disabled={currentPage === 1}
                  className="pagination-button first-page"
                  title="First Page"
                >
                  <FontAwesomeIcon icon={faAngleDoubleLeft} />
                </button>
                
              <button
                  onClick={handlePrevPage}
                disabled={currentPage === 1}
                  className="pagination-button prev-page"
                  title="Previous Page"
                >
                  <FontAwesomeIcon icon={faAngleLeft} />
                </button>

                <div className="page-numbers">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`pagination-button page-number ${currentPage === pageNum ? 'active' : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="pagination-button next-page"
                  title="Next Page"
                >
                  <FontAwesomeIcon icon={faAngleRight} />
              </button>
                
              <button
                  onClick={handleLastPage}
                disabled={currentPage === totalPages}
                  className="pagination-button last-page"
                  title="Last Page"
              >
                  <FontAwesomeIcon icon={faAngleDoubleRight} />
              </button>
              </div>

              <div className="page-jump">
                <span>Go to page:</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page >= 1 && page <= totalPages) {
                      setCurrentPage(page);
                    }
                  }}
                  className="page-jump-input"
                />
                <span>of {totalPages}</span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Export Options Modal */}
      {showExportOptions && (
        <div className="modal-overlay">
          <div className="modal-content export-modal">
            <div className="modal-header">
              <h3>Export Passages</h3>
              <button 
                onClick={() => setShowExportOptions(false)}
                className="close-btn"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <p>Choose export format for {currentPassages.length} passages:</p>
              <div className="export-options">
                <button onClick={exportToCSV} className="export-option">
                  <FontAwesomeIcon icon={faFileCsv} />
                  <span>Export as CSV</span>
                  <small>Compatible with Excel and other spreadsheet applications</small>
                </button>
                <button onClick={exportToJSON} className="export-option">
                  <FontAwesomeIcon icon={faFileCode} />
                  <span>Export as JSON</span>
                  <small>Structured data format for developers</small>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="modal-overlay">
          <div className="modal-content import-modal">
            <div className="modal-header">
              <h3>Import Passages</h3>
              <button 
                onClick={() => setShowImportModal(false)}
                className="close-btn"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <div className="import-section">
                <h4>Select File</h4>
                <p>Supported formats: CSV, JSON</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileSelect}
                  className="file-input"
                />
                {importFile && (
                  <div className="file-info">
                    <FontAwesomeIcon icon={faCheck} />
                    <span>{importFile.name} ({(importFile.size / 1024).toFixed(1)} KB)</span>
                  </div>
                )}
              </div>

              {importProgress && (
                <div className="import-results">
                  <h4>Import Results</h4>
                  <div className="results-summary">
                    <div className="result-item success">
                      <FontAwesomeIcon icon={faCheck} />
                      <span>{importProgress.success} successful</span>
                    </div>
                    <div className="result-item failed">
                      <FontAwesomeIcon icon={faTimes} />
                      <span>{importProgress.failed} failed</span>
                    </div>
                  </div>
                  {importProgress.errors.length > 0 && (
                    <div className="error-list">
                      <h5>Errors:</h5>
                      <ul>
                        {importProgress.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

            <div className="modal-actions">
                <button 
                  onClick={() => setShowImportModal(false)}
                  className="cancel-btn"
                >
                  Close
                </button>
                <button 
                  onClick={resetImport}
                  className="reset-btn"
                >
                  Reset
                </button>
                <button 
                  onClick={handleImport}
                  disabled={!importFile || isImporting}
                  className="import-action-btn"
                >
                  {isImporting ? 'Importing...' : 'Import Passages'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Confirmation Dialog */}
      {confirmationDialog.show && (
        <div className="modal-overlay">
          <div className={`modal-content confirmation-dialog ${confirmationDialog.type}`}>
            <div className="confirmation-header">
              {getConfirmationIcon()}
              <h3>{confirmationDialog.title}</h3>
            </div>
            <div className="confirmation-body">
              <p>{confirmationDialog.message}</p>
            </div>
            <div className="confirmation-actions">
              <button 
                onClick={hideConfirmationDialog} 
                className="cancel-btn"
              >
                {confirmationDialog.cancelText}
              </button>
              <button 
                onClick={executeConfirmationAction} 
                className={`confirm-btn ${confirmationDialog.type}`}
              >
                {confirmationDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={hideToast}
        />
      )}
    </div>
  );
};

export default ViewPassages; 