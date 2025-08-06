import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../../../config/api';

interface LiveExam {
  _id: string;
  name: string;
  date: string;
  isLive: boolean;
  joinLink: string;
  passage: string;
  timeLimit: number;
  startTime?: string; // e.g., '07:00'
  endTime?: string;   // e.g., '22:00'
}

const LiveExams: React.FC = () => {
  const [exams, setExams] = useState<LiveExam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Update form state to not include timeLimit
  const [form, setForm] = useState<Partial<LiveExam>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      console.log('Frontend: Token found:', !!token);
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const url = `${API_CONFIG.BASE_URL}/live-exams/admin`;
      console.log('Frontend: Making request to:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Frontend: Response status:', response.status);
      console.log('Frontend: Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Frontend: Error response:', errorData);
        throw new Error(errorData.message || `Failed to fetch exams (${response.status})`);
      }

      const data = await response.json();
      console.log('Frontend: Success response:', data);
      setExams(data);
      setError(null);
    } catch (err: any) {
      console.error('Frontend: Error fetching exams:', err);
      setError(err.message || 'Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExams(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'timeLimit' ? Number(value) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Required fields check
    if (!form.name || !form.date || !form.joinLink || !form.passage || !form.timeLimit) {
      const missingFields = [];
      if (!form.name) missingFields.push('Name');
      if (!form.date) missingFields.push('Date');
      if (!form.joinLink) missingFields.push('Join Link');
      if (!form.passage) missingFields.push('Passage');
      if (!form.timeLimit) missingFields.push('Time Limit');
      
      setError(`Please fill all required fields: ${missingFields.join(', ')}`);
      setLoading(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Only send valid fields
      const payload = {
        name: form.name,
        date: form.date,
        isLive: false, // Default to false, can be made live later
        joinLink: form.joinLink,
        passage: form.passage,
        timeLimit: form.timeLimit,
        startTime: form.startTime || '',
        endTime: form.endTime || ''
      };
      
      const response = await fetch(
        editingId ? `${API_CONFIG.BASE_URL}/live-exams/${editingId}` : `${API_CONFIG.BASE_URL}/live-exams`,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${editingId ? 'update' : 'create'} exam (${response.status})`);
      }
      
      setForm({});
      setEditingId(null);
      fetchExams();
      setError(null);
    } catch (err: any) {
      console.error('Error saving exam:', err);
      setError(err.message || 'Failed to save exam');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exam: LiveExam) => {
    setForm({
      name: exam.name,
      date: exam.date.slice(0, 10),
      isLive: exam.isLive,
      joinLink: exam.joinLink,
      passage: exam.passage,
      timeLimit: exam.timeLimit,
      startTime: exam.startTime || '',
      endTime: exam.endTime || ''
    });
    setEditingId(exam._id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this exam?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/live-exams/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete exam');
      }

      fetchExams();
      setError(null);
    } catch (err: any) {
      console.error('Error deleting exam:', err);
      setError(err.message || 'Failed to delete exam');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLive = async (exam: LiveExam) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required');
      }
      // Only send valid fields
      const payload = {
        name: exam.name,
        date: exam.date,
        isLive: !exam.isLive,
        joinLink: exam.joinLink,
        passage: exam.passage,
        timeLimit: exam.timeLimit,
        startTime: exam.startTime || '',
        endTime: exam.endTime || ''
      };
      const response = await fetch(`${API_CONFIG.BASE_URL}/live-exams/${exam._id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update live status');
      }
      fetchExams();
      setError(null);
    } catch (err: any) {
      console.error('Error updating live status:', err);
      setError(err.message || 'Failed to update live status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h2 style={{ color: '#1976d2', marginBottom: 18 }}>Live Exams Management</h2>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <div style={{ background: '#f8fafc', border: '1.5px solid #90caf9', borderRadius: 14, padding: 20, marginBottom: 32, boxShadow: '0 2px 12px rgba(25,118,210,0.07)' }}>
        <h3 style={{ color: '#1976d2', marginBottom: 10 }}>{editingId ? 'Edit Live Exam' : 'Add New Exam'}</h3>
        <p style={{ fontSize: 13, color: '#666', marginBottom: 16, fontStyle: 'italic' }}>
          {editingId ? 'Update exam details below. Use the "Start Live" button to make it live.' : 'Add a new exam below. After adding, you can make it live using the "Start Live" button.'}
        </p>
        <div style={{ background: '#e3f2fd', border: '1px solid #90caf9', borderRadius: 6, padding: 12, marginBottom: 16, fontSize: 13 }}>
          <strong>Note:</strong> 
          <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
            <li><strong>Join Link:</strong> Google Meet/Zoom link for live interaction</li>
            <li><strong>Exam Link:</strong> Direct link to the typing test (auto-generated)</li>
          </ul>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* First row - Exam Name and Date */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Exam Name</label>
              <input 
                name="name" 
                placeholder="Enter exam name" 
                value={form.name || ''} 
                onChange={handleChange} 
                required 
                style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 14 }} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Official Exam Date</label>
              <input 
                name="date" 
                type="date" 
                value={form.date || ''} 
                onChange={handleChange} 
                required 
                style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 14 }} 
              />
            </div>
            </div>

          {/* Second row - Join Link and Time Limit */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
            <div style={{ flex: 2 }}>
              <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Join Link (Google Meet/Zoom)</label>
              <input 
                name="joinLink" 
                placeholder="https://meet.google.com/xxx-xxxx-xxx or https://zoom.us/j/1234567890" 
                value={form.joinLink || ''} 
                onChange={handleChange} 
                required 
                style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 14 }} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Time Limit (minutes)</label>
              <input 
                name="timeLimit" 
                type="number" 
                min={1} 
                placeholder="30" 
                value={form.timeLimit || ''} 
                onChange={handleChange} 
                required 
                style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 14 }} 
              />
            </div>
          </div>

          {/* Third row - Start Time and End Time */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Start Time</label>
              <input 
                name="startTime" 
                type="time" 
                value={form.startTime || ''} 
                onChange={handleChange} 
                style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 14 }} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>End Time</label>
              <input 
                name="endTime" 
                type="time" 
                value={form.endTime || ''} 
                onChange={handleChange} 
                style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 14 }} 
              />
            </div>
          </div>

          {/* Fourth row - Passage */}
          <div>
            <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Exam Passage</label>
            <textarea 
              name="passage" 
              placeholder="Enter the typing passage for this exam..." 
              value={form.passage || ''} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', height: 100, padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 14, resize: 'vertical' }} 
            />
          </div>

          {/* Fifth row - Submit buttons */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
            <button 
              type="submit" 
              style={{ 
                background: '#1976d2', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 6, 
                padding: '12px 24px', 
                fontWeight: 600, 
                cursor: 'pointer',
                fontSize: 14
              }}
            >
              {editingId ? 'Update' : 'Add'} Exam
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => { setForm({}); setEditingId(null); }} 
                style={{ 
                  background: '#bdbdbd', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 6, 
                  padding: '12px 24px', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  fontSize: 14
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      <div style={{ marginBottom: 18, fontWeight: 600, color: '#1976d2', fontSize: 18 }}>All Live Exams</div>
      {loading ? <div>Loading...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {exams.map(exam => (
            <div key={exam._id} style={{ background: '#fff', border: '1.5px solid #e3f2fd', borderRadius: 12, boxShadow: '0 1px 8px rgba(25,118,210,0.04)', padding: 18, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 18 }}>
              <div style={{ flex: 2, minWidth: 180 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#1976d2' }}>{exam.name}</div>
                <div style={{ fontSize: 13, color: '#1a2a44', margin: '2px 0 6px 0' }}>Official Exam Date: <b>{new Date(exam.date).toLocaleDateString()}</b></div>
                {(exam.startTime && exam.endTime) && (
                  <div style={{ fontSize: 13, color: '#d6001c', marginBottom: 4 }}><b>Live Timing:</b> {formatTime(exam.startTime)} - {formatTime(exam.endTime)}</div>
                )}
                <div style={{ fontSize: 13, color: '#333', marginBottom: 4 }}><b>Time Limit:</b> {exam.timeLimit} min</div>
                <div style={{ fontSize: 13, color: '#333', marginBottom: 4 }}><b>Passage:</b> <span style={{ background: '#f1f8e9', padding: '2px 6px', borderRadius: 4 }}>{exam.passage ? (exam.passage.length > 60 ? exam.passage.slice(0, 60) + '...' : exam.passage) : 'No passage'}</span></div>
                <div style={{ fontSize: 13, color: '#333', marginBottom: 4 }}><b>Join Link:</b> 
                  <a 
                    href={exam.joinLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      color: '#1976d2', 
                      textDecoration: 'underline',
                      marginLeft: 4,
                      fontWeight: 500
                    }}
                  >
                    {exam.joinLink}
                  </a>
                  <span style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>
                    (opens in new tab)
                  </span>
                </div>
                <div style={{ fontSize: 13, color: '#333', marginBottom: 4 }}>
                  <b>Exam Link:</b> 
                  <a 
                    href={`https://typinghub.in/live-exam/${exam._id}`}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      color: '#d6001c', 
                      textDecoration: 'underline',
                      marginLeft: 4,
                      fontWeight: 500
                    }}
                  >
                    https://typinghub.in/live-exam/{exam._id}
                  </a>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`https://typinghub.in/live-exam/${exam._id}`);
                      alert('Link copied to clipboard!');
                    }}
                    style={{ 
                      background: '#f0f0f0', 
                      border: '1px solid #ddd', 
                      borderRadius: 4, 
                      padding: '2px 8px', 
                      marginLeft: 8, 
                      fontSize: 11, 
                      cursor: 'pointer',
                      color: '#666'
                    }}
                  >
                    Copy
                  </button>
                  <span style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>
                    (share this link)
                  </span>
                </div>
                <div style={{ fontSize: 13, color: '#333', marginBottom: 4 }}><b>Status:</b> <span style={{ background: exam.isLive ? '#e8f5e8' : '#f5f5f5', color: exam.isLive ? '#43a047' : '#666', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>{exam.isLive ? 'LIVE' : 'STOPPED'}</span></div>
              </div>
              <div style={{ flex: 1, minWidth: 120, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                <button onClick={() => handleToggleLive(exam)} style={{ 
                  background: exam.isLive ? '#d6001c' : '#43a047', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 6, 
                  padding: '7px 16px', 
                  fontWeight: 600, 
                  fontSize: 14, 
                  marginBottom: 6, 
                  cursor: 'pointer', 
                  boxShadow: exam.isLive ? '0 2px 8px #d6001c22' : '0 2px 8px #43a04722'
                }}>
                  {exam.isLive ? 'Stop Exam' : 'Start Live'}
                </button>
                <button onClick={() => handleEdit(exam)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDelete(exam._id)} style={{ background: '#d6001c', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveExams;

// Helper to format 'HH:mm' to 'h:mm AM/PM'
function formatTime(time: string) {
  if (!time) return '';
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  const minute = parseInt(m, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
} 