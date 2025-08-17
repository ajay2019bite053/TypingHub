import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrophy, 
  faMedal, 
  faCrown, 
  faStar,
  faUsers,
  faCalendarAlt,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import { useCompetition } from '../contexts/CompetitionContext';
import { API_CONFIG } from '../config/api';
import './CompetitionResults.css';

interface CompetitionResult {
  rank: number;
  name: string;
  mobile: string;
  grossSpeed: number;
  netSpeed: number;
  accuracy: number;
  finalScore: number;
  timeTaken: number;
  prize: number;
  submittedAt: Date;
  // Detailed scores
  speedScore?: number;
  accuracyScore?: number;
  efficiencyScore?: number;
  completionScore?: number;
  // Additional metrics
  mistakes?: number;
  backspaces?: number;
  totalWords?: number;
  correctWords?: number;
  incorrectWords?: number;
}

const CompetitionResults: React.FC = () => {
  const { competitionStatus } = useCompetition();
  const [results, setResults] = useState<CompetitionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      console.log('Fetching results from:', `${API_CONFIG.BASE_URL}/competition/public-results`);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/competition/public-results`);
      const data = await response.json();
      
      console.log('API Response:', data);
      
      if (data.success) {
        console.log('Raw results data:', data.data.results);
        console.log('First result sample:', data.data.results[0]);
        
        // Check if detailed scores exist
        const resultsWithDefaults = data.data.results.map((result: any) => ({
          ...result,
          speedScore: result.speedScore || 0,
          accuracyScore: result.accuracyScore || 0,
          efficiencyScore: result.efficiencyScore || 0,
          completionScore: result.completionScore || 0,
          mistakes: result.mistakes || 0,
          backspaces: result.backspaces || 0,
          totalWords: result.totalWords || 0,
          correctWords: result.correctWords || 0,
          incorrectWords: result.incorrectWords || 0
        }));
        
        console.log('Processed results:', resultsWithDefaults);
        setResults(resultsWithDefaults);
      } else {
        setError(data.message || 'Failed to fetch results');
      }
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Error fetching competition results');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <FontAwesomeIcon icon={faCrown} className="rank-icon gold" />;
    if (rank === 2) return <FontAwesomeIcon icon={faMedal} className="rank-icon silver" />;
    if (rank === 3) return <FontAwesomeIcon icon={faMedal} className="rank-icon bronze" />;
    return <span className="rank-number">{rank}</span>;
  };

  const getRankClass = (rank: number) => {
    if (rank === 1) return 'rank-1';
    if (rank === 2) return 'rank-2';
    if (rank === 3) return 'rank-3';
    return '';
  };

  if (loading) {
    return (
      <div className="competition-results-loading">
        <div className="loading-spinner"></div>
        <p>Loading competition results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="competition-results-error">
        <FontAwesomeIcon icon={faTrophy} />
        <h2>Results Not Available</h2>
        <p>{error}</p>
        <p>Results will be available after the competition ends and admin publishes them.</p>
      </div>
    );
  }

  if (!competitionStatus?.resultsPublished) {
    return (
      <div className="competition-results-not-published">
        <FontAwesomeIcon icon={faTrophy} />
        <h2>Results Not Yet Published</h2>
        <p>The competition results are not yet published by the admin.</p>
        <p>Please check back later or contact support for more information.</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Competition Results - TypingHub</title>
        <meta name="description" content="View the latest competition results and rankings" />
      </Helmet>

      <div className="competition-results-container">
        <div className="results-header">
          <div className="header-content">
            <h1>
              <FontAwesomeIcon icon={faTrophy} />
              Competition Results
            </h1>
            <p className="subtitle">Final Rankings and Winners</p>
          </div>
          
                     <div className="competition-info">
             <div className="info-item">
               <FontAwesomeIcon icon={faUsers} />
               <span>{results.length} Participants</span>
             </div>
             <div className="info-item">
               <FontAwesomeIcon icon={faTrophy} />
               <span>Total Score: {results.reduce((sum, result) => sum + (result.finalScore || 0), 0).toFixed(2)}</span>
             </div>
             <div className="info-item">
               <FontAwesomeIcon icon={faCalendarAlt} />
               <span>{new Date().toLocaleDateString()}</span>
             </div>
             <div className="info-item">
               <FontAwesomeIcon icon={faClock} />
               <span>Results Published</span>
             </div>
           </div>
        </div>

        <div className="results-content">
          <div className="top-winners">
            {results.slice(0, 3).map((result, index) => (
              <div key={index} className={`winner-card ${getRankClass(result.rank)}`}>
                <div className="winner-rank">
                  {getRankIcon(result.rank)}
                </div>
                <div className="winner-info">
                  <h3 className="winner-name">{result.name}</h3>
                  <div className="winner-stats">
                    <div className="stat">
                      <span className="label">Final Score:</span>
                      <span className="value">{result.finalScore}/100</span>
                    </div>
                    <div className="stat">
                      <span className="label">Net Speed:</span>
                      <span className="value">{result.netSpeed} WPM</span>
                    </div>
                    <div className="stat">
                      <span className="label">Accuracy:</span>
                      <span className="value">{result.accuracy}%</span>
                    </div>
                    <div className="stat">
                      <span className="label">Time:</span>
                      <span className="value">{(result.timeTaken / 60).toFixed(1)}m</span>
                    </div>
                  </div>
                  
                  {/* Detailed Scores */}
                  <div className="detailed-scores">
                    <div className="score-item">
                      <span className="score-label">Speed Score:</span>
                      <span className="score-value">{result.speedScore || 'N/A'}/100</span>
                    </div>
                    <div className="score-item">
                      <span className="score-label">Accuracy Score:</span>
                      <span className="score-value">{result.accuracyScore || 'N/A'}/100</span>
                    </div>
                    <div className="score-item">
                      <span className="score-label">Efficiency Score:</span>
                      <span className="score-value">{result.efficiencyScore || 'N/A'}/100</span>
                    </div>
                    <div className="score-item">
                      <span className="score-label">Completion Score:</span>
                      <span className="score-value">{result.completionScore || 'N/A'}/100</span>
                    </div>
                  </div>
                  
                  {/* Additional Metrics */}
                  <div className="additional-metrics">
                    <div className="metric-item">
                      <span className="metric-label">Total Words:</span>
                      <span className="metric-value">{result.totalWords || 'N/A'}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Mistakes:</span>
                      <span className="metric-value">{result.mistakes || 'N/A'}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Backspaces:</span>
                      <span className="metric-value">{result.backspaces || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="winner-prize">
                    <FontAwesomeIcon icon={faStar} />
                    <span>Prize: ₹{result.prize}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="all-results">
            <h3>Complete Rankings</h3>
            <div className="results-table-container">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Final Score</th>
                    <th>Net Speed</th>
                    <th>Accuracy</th>
                    <th>Speed Score</th>
                    <th>Accuracy Score</th>
                    <th>Efficiency Score</th>
                    <th>Completion Score</th>
                    <th>Total Words</th>
                    <th>Mistakes</th>
                    <th>Backspaces</th>
                    <th>Time</th>
                    <th>Prize</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className={getRankClass(result.rank)}>
                      <td className="rank-cell">
                        {getRankIcon(result.rank)}
                      </td>
                      <td className="name-cell">{result.name}</td>
                      <td className="score-cell">{result.finalScore}/100</td>
                      <td className="speed-cell">{result.netSpeed} WPM</td>
                      <td className="accuracy-cell">{result.accuracy}%</td>
                      <td className="speed-score-cell">{result.speedScore || 'N/A'}/100</td>
                      <td className="accuracy-score-cell">{result.accuracyScore || 'N/A'}/100</td>
                      <td className="efficiency-score-cell">{result.efficiencyScore || 'N/A'}/100</td>
                      <td className="completion-score-cell">{result.completionScore || 'N/A'}/100</td>
                      <td className="total-words-cell">{result.totalWords || 'N/A'}</td>
                      <td className="mistakes-cell">{result.mistakes || 'N/A'}</td>
                      <td className="backspaces-cell">{result.backspaces || 'N/A'}</td>
                      <td className="time-cell">{(result.timeTaken / 60).toFixed(1)}m</td>
                      <td className="prize-cell">₹{result.prize}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompetitionResults;

