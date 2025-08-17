import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCog, 
  faTrophy, 
  faUsers, 
  faCreditCard,
  faToggleOn,
  faToggleOff,
  faSave,
  faRefresh,
  faEye,
  faList,
  faTrash,
  faDownload,
  faShare,
  faCheckCircle,
  faTimes,
  faExclamationTriangle,
  faFilePdf,
  faChartBar,
  faCalendarAlt,
  faMoneyBillWave,
  faFileAlt
} from '@fortawesome/free-solid-svg-icons';
import { useCompetition } from '../../../contexts/CompetitionContext';
import Toast, { ToastType } from '../../../components/Toast/Toast';
import './CompetitionManager.css';

interface CompetitionSettings {
  isRegistrationActive: boolean;
  isCompetitionActive: boolean;
  entryFee: number;
  maxSlots: number;
  minSlots: number;
  prizes: {
    first: number;
    second: number;
    third: number;
  };
  passage: string;
  status: string;
  forceActivate?: boolean;
  resultsPublished?: boolean;
}

const CompetitionManager: React.FC = () => {
  const { 
    competitionStatus, 
    fetchCompetitionStatus,
    updateCompetitionSettings, 
    getAllRegistrations, 
    getCompetitionResults,
    deleteAllRegistrations,
    deleteAllResults,
    publishResults,
    unpublishResults,
    downloadResultsPDF,
    isLoading 
  } = useCompetition();
  
  const [settings, setSettings] = useState<CompetitionSettings>({
    isRegistrationActive: false,
    isCompetitionActive: false,
    entryFee: 10,
    maxSlots: 100,
    minSlots: 10,
    prizes: {
      first: 100,
      second: 50,
      third: 25
    },
    passage: '',
    status: 'upcoming',
    forceActivate: false,
    resultsPublished: false
  });

  const [registrations, setRegistrations] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'settings' | 'registrations' | 'results'>('settings');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
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
    if (competitionStatus) {
      setSettings({
        isRegistrationActive: competitionStatus.isRegistrationActive,
        isCompetitionActive: competitionStatus.isCompetitionActive,
        entryFee: competitionStatus.entryFee,
        maxSlots: competitionStatus.maxSlots,
        minSlots: competitionStatus.minSlots,
        prizes: competitionStatus.prizes,
        passage: competitionStatus.passage || '',
        status: competitionStatus.status,
        resultsPublished: competitionStatus.resultsPublished || false
      });
    }
  }, [competitionStatus]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePrizeChange = (prize: string, value: number) => {
    setSettings(prev => ({
      ...prev,
      prizes: {
        ...prev.prizes,
        [prize]: value
      }
    }));
  };



  const handleSaveSettings = async () => {
    const result = await updateCompetitionSettings(settings);
    
    if (result.success) {
      showToast('success', 'Competition settings updated successfully!');
    } else {
      showToast('error', result.message || 'Failed to update settings');
    }
  };

  const handleLoadRegistrations = async () => {
    const result = await getAllRegistrations();
    
    if (result.success) {
      setRegistrations(result.data.registrations);
      showToast('success', 'Registrations loaded successfully!');
    } else {
      showToast('error', result.message || 'Failed to load registrations');
    }
  };

  const handleLoadResults = async () => {
    const result = await getCompetitionResults();
    
    if (result.success) {
      setResults(result.data.results);
      showToast('success', 'Results loaded successfully!');
    } else {
      showToast('error', result.message || 'Failed to load results');
    }
  };

  const handleDeleteRegistrations = async () => {
    if (window.confirm('Are you sure you want to delete ALL registrations? This action cannot be undone!')) {
      try {
        const result = await deleteAllRegistrations();
        
        if (result.success) {
          setRegistrations([]);
          setResults([]); // Also clear results since registrations are deleted
          // Refresh competition status to update counts
          await fetchCompetitionStatus();
          // Also refresh results data to ensure UI is updated
          await handleLoadResults();
          showToast('success', 'All registrations deleted successfully!');
        } else {
          showToast('error', result.message || 'Failed to delete registrations');
        }
      } catch (error) {
        showToast('error', 'An error occurred while deleting registrations');
        console.error('Error deleting registrations:', error);
      }
    }
  };

  const handleDeleteResults = async () => {
    if (window.confirm('Are you sure you want to delete ALL results? This action cannot be undone!')) {
      try {
        const result = await deleteAllResults();
        
        if (result.success) {
          setResults([]);
          // Refresh competition status to update participant count
          await fetchCompetitionStatus();
          // Also refresh results data to ensure UI is updated
          await handleLoadResults();
          showToast('success', 'All results deleted successfully!');
        } else {
          showToast('error', result.message || 'Failed to delete results');
        }
      } catch (error) {
        showToast('error', 'An error occurred while deleting results');
        console.error('Error deleting results:', error);
      }
    }
  };

  const handlePublishResults = async () => {
    const result = await publishResults();
    
    if (result.success) {
      setSettings(prev => ({ ...prev, resultsPublished: true }));
      showToast('success', 'Results published successfully!');
    } else {
      showToast('error', result.message || 'Failed to publish results');
    }
  };

  const handleUnpublishResults = async () => {
    if (window.confirm('Are you sure you want to unpublish results? Users will no longer be able to see them.')) {
      try {
        console.log('Unpublishing results...');
        
        // Use the dedicated unpublish API
        const result = await unpublishResults();
        
        console.log('Unpublish result:', result);
        
        if (result.success) {
          console.log('Successfully unpublished results, now refreshing context...');
          // Update local state and refresh competition status
          setSettings(prev => ({ ...prev, resultsPublished: false }));
          await fetchCompetitionStatus(); // Refresh the context
          console.log('Context refreshed, showing success toast');
          showToast('success', 'Results unpublished successfully!');
        } else {
          showToast('error', result.message || 'Failed to unpublish results');
        }
      } catch (error) {
        showToast('error', 'Failed to unpublish results');
        console.error('Error unpublishing results:', error);
      }
    }
  };

  const handleDownloadPDF = async () => {
    const result = await downloadResultsPDF();
    
    if (result.success) {
      showToast('success', 'PDF downloaded successfully!');
    } else {
      showToast('error', result.message || 'Failed to download PDF');
    }
  };

  const showToast = (type: ToastType, message: string) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: 'info', message: '' });
    }, 5000);
  };

  const toggleRowExpansion = (index: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  // Filter and sort results
  const filteredAndSortedResults = results
    .filter(result => 
      result.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.mobile?.includes(searchTerm) ||
      result.secretId?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle numeric values
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // Handle string values
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });

  const getCompetitionStatusColor = () => {
    if (settings.isCompetitionActive) return '#28a745';
    if (settings.isRegistrationActive) return '#ffc107';
    return '#dc3545';
  };

  const getCompetitionStatusText = () => {
    if (settings.isCompetitionActive) return 'Active';
    if (settings.isRegistrationActive) return 'Registration Open';
    return 'Inactive';
  };

  return (
    <div className="competition-manager">
      <div className="competition-manager-header">
        <h2>
          <FontAwesomeIcon icon={faTrophy} />
          Competition Manager
        </h2>
        <div className="competition-stats">
          <div className="stat-item">
            <span>Status:</span>
            <span className="status-indicator" style={{ color: getCompetitionStatusColor() }}>
              {getCompetitionStatusText()}
            </span>
          </div>
          <div className="stat-item">
            <span>Registrations:</span>
            <span>{competitionStatus?.totalRegistrations || 0}/{competitionStatus?.maxSlots || 100}</span>
          </div>
          <div className="stat-item">
            <span>Participants:</span>
            <span>{competitionStatus?.totalParticipants || 0}</span>
          </div>
          <div className="stat-item">
            <span>Results Published:</span>
            <span className={settings.resultsPublished ? 'published' : 'not-published'}>
              {settings.resultsPublished ? 'Yes' : 'No'}
            </span>

          </div>
        </div>
      </div>

      <div className="competition-tabs">
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <FontAwesomeIcon icon={faCog} />
          Settings
        </button>
        <button 
          className={`tab-btn ${activeTab === 'registrations' ? 'active' : ''}`}
          onClick={() => setActiveTab('registrations')}
        >
          <FontAwesomeIcon icon={faUsers} />
          Registrations ({registrations.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          <FontAwesomeIcon icon={faTrophy} />
          Results ({results.length})
        </button>
      </div>

      <div className="competition-content">
        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="settings-section">
              <h3>
                <FontAwesomeIcon icon={faToggleOn} />
                Competition Activation
              </h3>
              <div className="setting-group">
                <label>
                  <FontAwesomeIcon icon={settings.isRegistrationActive ? faToggleOn : faToggleOff} />
                  Registration Active
                </label>
                <input
                  type="checkbox"
                  checked={settings.isRegistrationActive}
                  onChange={(e) => handleSettingChange('isRegistrationActive', e.target.checked)}
                />
                <small>Allow users to register for the competition</small>
              </div>
              <div className="setting-group">
                <label>
                  <FontAwesomeIcon icon={settings.isCompetitionActive ? faToggleOn : faToggleOff} />
                  Competition Active
                </label>
                <input
                  type="checkbox"
                  checked={settings.isCompetitionActive}
                  onChange={(e) => handleSettingChange('isCompetitionActive', e.target.checked)}
                />
                <small>Allow registered users to take the test</small>
              </div>
              <div className="setting-group">
                <label>
                  <FontAwesomeIcon icon={faToggleOn} />
                  Force Activate (Testing)
                </label>
                <input
                  type="checkbox"
                  checked={settings.forceActivate}
                  onChange={(e) => handleSettingChange('forceActivate', e.target.checked)}
                />
                <small>Bypass minimum slots requirement for testing</small>
              </div>
            </div>

            <div className="settings-section">
              <h3>
                <FontAwesomeIcon icon={faMoneyBillWave} />
                Entry Fee & Slots
              </h3>
              <div className="setting-group">
                <label>
                  <FontAwesomeIcon icon={faCreditCard} />
                  Entry Fee (₹)
                </label>
                <input
                  type="number"
                  value={settings.entryFee}
                  onChange={(e) => handleSettingChange('entryFee', parseInt(e.target.value))}
                  min="0"
                />
              </div>
              <div className="setting-group">
                <label>
                  <FontAwesomeIcon icon={faUsers} />
                  Max Slots
                </label>
                <input
                  type="number"
                  value={settings.maxSlots}
                  onChange={(e) => handleSettingChange('maxSlots', parseInt(e.target.value))}
                  min="1"
                />
              </div>
              <div className="setting-group">
                <label>
                  <FontAwesomeIcon icon={faUsers} />
                  Min Slots (Required to Start)
                </label>
                <input
                  type="number"
                  value={settings.minSlots}
                  onChange={(e) => handleSettingChange('minSlots', parseInt(e.target.value))}
                  min="1"
                  max={settings.maxSlots}
                />
              </div>
            </div>

            <div className="settings-section">
              <h3>
                <FontAwesomeIcon icon={faTrophy} />
                Prize Money
              </h3>
              <div className="setting-group">
                <label>1st Prize (₹)</label>
                <input
                  type="number"
                  value={settings.prizes.first}
                  onChange={(e) => handlePrizeChange('first', parseInt(e.target.value))}
                  min="0"
                />
              </div>
              <div className="setting-group">
                <label>2nd Prize (₹)</label>
                <input
                  type="number"
                  value={settings.prizes.second}
                  onChange={(e) => handlePrizeChange('second', parseInt(e.target.value))}
                  min="0"
                />
              </div>
              <div className="setting-group">
                <label>3rd Prize (₹)</label>
                <input
                  type="number"
                  value={settings.prizes.third}
                  onChange={(e) => handlePrizeChange('third', parseInt(e.target.value))}
                  min="0"
                />
              </div>
            </div>



            <div className="settings-section">
              <h3>
                <FontAwesomeIcon icon={faFileAlt} />
                Competition Passage
              </h3>
              <div className="setting-group passage-group">
                <label>
                  <FontAwesomeIcon icon={faFileAlt} />
                  Typing Test Passage
                </label>
                <textarea
                  value={settings.passage}
                  onChange={(e) => handleSettingChange('passage', e.target.value)}
                  placeholder="Paste or type your competition passage here..."
                  rows={10}
                  className="passage-textarea"
                />

              </div>
              
              {settings.passage && (
                <div className="passage-preview">
                  <h4>
                    <FontAwesomeIcon icon={faEye} />
                    Passage Preview
                  </h4>
                  <div className="preview-content">
                    <p>{settings.passage}</p>
                    <div className="preview-stats">
                      <span>Characters: {settings.passage.length}</span>
                      <span>Words: {settings.passage.trim().split(/\s+/).length}</span>
                      <span>Estimated Time: {Math.ceil(settings.passage.length / 5 / 30)} min</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button 
              className="save-settings-btn"
              onClick={handleSaveSettings}
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={faSave} />
              {isLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        )}

        {activeTab === 'registrations' && (
          <div className="registrations-tab">
            <div className="tab-header">
              <h3>
                <FontAwesomeIcon icon={faUsers} />
                Competition Registrations
              </h3>
              <div className="tab-actions">
                <button className="refresh-btn" onClick={handleLoadRegistrations}>
                  <FontAwesomeIcon icon={faRefresh} />
                  Refresh
                </button>
                {registrations.length > 0 && (
                  <button className="delete-btn" onClick={handleDeleteRegistrations}>
                    <FontAwesomeIcon icon={faTrash} />
                    Delete All
                  </button>
                )}
              </div>
            </div>
            
            <div className="registrations-list">
              {registrations.length > 0 ? (
                <table className="registrations-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Mobile</th>
                      <th>Secret ID</th>
                      <th>Payment Status</th>
                      <th>Has Attempted</th>
                      <th>Registered At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((reg, index) => (
                      <tr key={index}>
                        <td>{reg.name}</td>
                        <td>{reg.mobile}</td>
                        <td>{reg.secretId}</td>
                        <td>
                          <span className={`status-badge ${reg.paymentStatus}`}>
                            {reg.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${reg.hasAttempted ? 'attempted' : 'not-attempted'}`}>
                            {reg.hasAttempted ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td>{new Date(reg.registeredAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-data">
                  <FontAwesomeIcon icon={faList} />
                  <p>No registrations found. Click refresh to load data.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="results-tab">
            <div className="tab-header">
              <h3>
                <FontAwesomeIcon icon={faTrophy} />
                Competition Results
              </h3>
              <div className="tab-actions">
                <button className="refresh-btn" onClick={handleLoadResults}>
                  <FontAwesomeIcon icon={faRefresh} />
                  Refresh
                </button>
                {results.length > 0 && (
                  <>
                    <button 
                      className="publish-btn" 
                      onClick={handlePublishResults}
                      disabled={settings.resultsPublished}
                    >
                      <FontAwesomeIcon icon={faShare} />
                      {settings.resultsPublished ? 'Published' : 'Publish'}
                    </button>
                    {settings.resultsPublished && (
                      <button 
                        className="unpublish-btn" 
                        onClick={handleUnpublishResults}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                        Unpublish
                      </button>
                    )}
                    <button className="download-btn" onClick={handleDownloadPDF}>
                      <FontAwesomeIcon icon={faFilePdf} />
                      Download PDF
                    </button>
                    <button className="delete-btn" onClick={handleDeleteResults}>
                      <FontAwesomeIcon icon={faTrash} />
                      Delete All
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Results Summary */}
            {results.length > 0 && (
              <div className="results-summary">
                <div className="summary-card">
                  <h4>
                    <FontAwesomeIcon icon={faChartBar} />
                    Performance Summary
                  </h4>
                  <div className="summary-stats">
                    <div className="summary-stat">
                      <span className="stat-label">Total Participants:</span>
                      <span className="stat-value">{results.length}</span>
                    </div>
                    <div className="summary-stat">
                      <span className="stat-label">Average Speed:</span>
                      <span className="stat-value">
                        {(results.reduce((sum, r) => sum + (r.netSpeed || r.speed || 0), 0) / results.length).toFixed(1)} WPM
                      </span>
                    </div>
                    <div className="summary-stat">
                      <span className="stat-label">Average Accuracy:</span>
                      <span className="stat-value">
                        {(results.reduce((sum, r) => sum + (r.accuracy || 0), 0) / results.length).toFixed(1)}%
                      </span>
                    </div>
                    <div className="summary-stat">
                      <span className="stat-label">Average Final Score:</span>
                      <span className="stat-value">
                        {(results.reduce((sum, r) => sum + (r.finalScore || 0), 0) / results.length).toFixed(1)}
                      </span>
                    </div>
                    <div className="summary-stat">
                      <span className="stat-label">Top Speed:</span>
                      <span className="stat-value">
                        {Math.max(...results.map(r => r.netSpeed || r.speed || 0))} WPM
                      </span>
                    </div>
                    <div className="summary-stat">
                      <span className="stat-label">Best Accuracy:</span>
                      <span className="stat-value">
                        {Math.max(...results.map(r => r.accuracy || 0))}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search and Sort Controls */}
            {results.length > 0 && (
              <div className="results-controls">
                <div className="search-control">
                  <input
                    type="text"
                    placeholder="Search by name, mobile, or secret ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <span className="search-count">
                    Showing {filteredAndSortedResults.length} of {results.length} results
                  </span>
                </div>
                
                <div className="sort-controls">
                  <label>Sort by:</label>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    <option value="rank">Rank</option>
                    <option value="name">Name</option>
                    <option value="netSpeed">Net Speed</option>
                    <option value="accuracy">Accuracy</option>
                    <option value="finalScore">Final Score</option>
                    <option value="timeTaken">Time Taken</option>
                    <option value="submittedAt">Submitted At</option>
                  </select>
                  
                  <button 
                    className="sort-order-btn"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                  >
                    <FontAwesomeIcon 
                      icon={sortOrder === 'asc' ? faChartBar : faChartBar} 
                      className={sortOrder === 'asc' ? 'asc' : 'desc'}
                    />
                  </button>
                </div>
              </div>
            )}
            
            <div className="results-list">
              {results.length > 0 ? (
                <div className="results-table-container">
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th title="Final ranking based on comprehensive scoring">Rank</th>
                        <th title="Participant's name - Click to expand for details">Name</th>
                        <th title="Gross Words Per Minute (including mistakes)">Gross WPM</th>
                        <th title="Net Words Per Minute (excluding mistakes)">Net WPM</th>
                        <th title="Character-level accuracy percentage">Accuracy (%)</th>
                        <th title="Word-level accuracy percentage">Word Accuracy (%)</th>
                        <th title="Number of typing mistakes made">Mistakes</th>
                        <th title="Number of backspaces used">Backspaces</th>
                        <th title="Total words in the passage">Total Words</th>
                        <th title="Correctly typed words">Correct Words</th>
                        <th title="Time taken in minutes">Time (min)</th>
                        <th title="Final comprehensive score (0-100)">Final Score</th>
                        <th title="Prize amount won">Prize (₹)</th>
                        <th title="When the result was submitted">Submitted At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedResults.map((result, index) => (
                        <React.Fragment key={index}>
                          <tr 
                            className={`${result.rank <= 3 ? 'top-three' : ''} ${expandedRows.has(index) ? 'expanded' : ''}`}
                            onClick={() => toggleRowExpansion(index)}
                            style={{ cursor: 'pointer' }}
                          >
                            <td>
                              <span className={`rank-badge rank-${result.rank}`}>
                                {result.rank}
                              </span>
                            </td>
                            <td>
                              <div className="name-cell">
                                {result.name}
                                <FontAwesomeIcon 
                                  icon={expandedRows.has(index) ? faTimes : faEye} 
                                  className="expand-icon"
                                />
                              </div>
                            </td>
                            <td>{result.grossSpeed?.toFixed(1) || result.speed}</td>
                            <td>{result.netSpeed?.toFixed(1) || result.speed}</td>
                            <td>{result.accuracy?.toFixed(1)}%</td>
                            <td>{result.wordAccuracy?.toFixed(1)}%</td>
                            <td>{result.mistakes || 0}</td>
                            <td>{result.backspaces || 0}</td>
                            <td>{result.totalWords || 0}</td>
                            <td>{result.correctWords || 0}</td>
                            <td>{(result.timeTaken / 60).toFixed(1)}</td>
                            <td>{result.finalScore?.toFixed(1) || 'N/A'}</td>
                            <td>₹{result.prize}</td>
                            <td>{new Date(result.submittedAt).toLocaleDateString()}</td>
                          </tr>
                          
                          {/* Expanded Row Details */}
                          {expandedRows.has(index) && (
                            <tr className="expanded-details">
                              <td colSpan={14}>
                                <div className="expanded-content">
                                  <h5>Detailed Performance Analysis</h5>
                                  <div className="detail-grid">
                                    <div className="detail-section">
                                      <h6>Speed Analysis</h6>
                                      <div className="detail-item">
                                        <span>Gross Speed:</span>
                                        <span>{result.grossSpeed?.toFixed(1) || result.speed} WPM</span>
                                      </div>
                                      <div className="detail-item">
                                        <span>Net Speed:</span>
                                        <span>{result.netSpeed?.toFixed(1) || result.speed} WPM</span>
                                      </div>
                                      <div className="detail-item">
                                        <span>Speed Score:</span>
                                        <span>{result.speedScore?.toFixed(1) || 'N/A'}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="detail-section">
                                      <h6>Accuracy Analysis</h6>
                                      <div className="detail-item">
                                        <span>Character Accuracy:</span>
                                        <span>{result.accuracy?.toFixed(1)}%</span>
                                      </div>
                                      <div className="detail-item">
                                        <span>Word Accuracy:</span>
                                        <span>{result.wordAccuracy?.toFixed(1)}%</span>
                                      </div>
                                      <div className="detail-item">
                                        <span>Accuracy Score:</span>
                                        <span>{result.accuracyScore?.toFixed(1) || 'N/A'}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="detail-section">
                                      <h6>Efficiency Metrics</h6>
                                      <div className="detail-item">
                                        <span>Efficiency Score:</span>
                                        <span>{result.efficiencyScore?.toFixed(1) || 'N/A'}</span>
                                      </div>
                                      <div className="detail-item">
                                        <span>Completion Score:</span>
                                        <span>{result.completionScore?.toFixed(1) || 'N/A'}</span>
                                      </div>
                                      <div className="detail-item">
                                        <span>Final Score:</span>
                                        <span className="final-score">{result.finalScore?.toFixed(1) || 'N/A'}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="detail-section">
                                      <h6>Word Analysis</h6>
                                      <div className="detail-item">
                                        <span>Total Words:</span>
                                        <span>{result.totalWords || 0}</span>
                                      </div>
                                      <div className="detail-item">
                                        <span>Correct Words:</span>
                                        <span>{result.correctWords || 0}</span>
                                      </div>
                                      <div className="detail-item">
                                        <span>Incorrect Words:</span>
                                        <span>{result.incorrectWords || 0}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="no-data">
                  <FontAwesomeIcon icon={faTrophy} />
                  <p>No results found. Click refresh to load data.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ show: false, type: 'info', message: '' })}
        />
      )}
    </div>
  );
};

export default CompetitionManager;

