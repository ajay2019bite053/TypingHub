import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface LiveExam {
  _id: string;
  name: string;
  date: string;
  isLive: boolean;
  joinLink: string;
  passage: string;
  timeLimit: number;
}

const LiveExams: React.FC = () => {
  const [exams, setExams] = useState<LiveExam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<LiveExam & { passage: string; timeLimit: number }>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/live-exams');
      setExams(res.data);
      setError(null);
    } catch (err: any) {
      setError('Failed to fetch exams');
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
    try {
      if (editingId) {
        await axios.put(`/api/live-exams/${editingId}`, form, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } });
      } else {
        await axios.post('/api/live-exams', form, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } });
      }
      setForm({});
      setEditingId(null);
      fetchExams();
    } catch (err) {
      setError('Failed to save exam');
    }
  };

  const handleEdit = (exam: LiveExam) => {
    setForm({ name: exam.name, date: exam.date.slice(0, 10), isLive: exam.isLive, joinLink: exam.joinLink, passage: exam.passage, timeLimit: exam.timeLimit });
    setEditingId(exam._id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this exam?')) return;
    try {
      await axios.delete(`/api/live-exams/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } });
      fetchExams();
    } catch (err) {
      setError('Failed to delete exam');
    }
  };

  const handleToggleLive = async (exam: LiveExam) => {
    try {
      await axios.put(`/api/live-exams/${exam._id}`, { ...exam, isLive: !exam.isLive }, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } });
      fetchExams();
    } catch (err) {
      setError('Failed to update live status');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h2 style={{ color: '#1976d2', marginBottom: 18 }}>Live Exams Management</h2>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <div style={{ background: '#f8fafc', border: '1.5px solid #90caf9', borderRadius: 14, padding: 20, marginBottom: 32, boxShadow: '0 2px 12px rgba(25,118,210,0.07)' }}>
        <h3 style={{ color: '#1976d2', marginBottom: 10 }}>{editingId ? 'Edit Live Exam' : 'Add New Live Exam'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, width: '100%' }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label style={{ fontWeight: 500 }}>Exam Name</label>
              <input name="name" placeholder="Exam Name" value={form.name || ''} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }} />
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label style={{ fontWeight: 500 }}>Date</label>
              <input name="date" type="date" value={form.date || ''} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }} />
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label style={{ fontWeight: 500 }}>Join Link</label>
              <input name="joinLink" placeholder="Join Link" value={form.joinLink || ''} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }} />
            </div>
          </div>
          <div style={{ width: '100%' }}>
            <label style={{ fontWeight: 500 }}>Passage</label>
            <textarea name="passage" placeholder="Exam Passage" value={form.passage || ''} onChange={handleChange} required style={{ width: '100%', height: 80, padding: 8, borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4, resize: 'vertical' }} />
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <label style={{ fontWeight: 500 }}>Time Limit (minutes)</label>
            <input name="timeLimit" type="number" min={1} placeholder="Time Limit" value={form.timeLimit || ''} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }} />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 24 }}>
            <button type="submit" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>{editingId ? 'Update' : 'Add'} Exam</button>
            {editingId && <button type="button" onClick={() => { setForm({}); setEditingId(null); }} style={{ background: '#bdbdbd', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 14px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>}
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
                <div style={{ fontSize: 13, color: '#1a2a44', margin: '2px 0 6px 0' }}>Date: <b>{new Date(exam.date).toLocaleDateString()}</b></div>
                <div style={{ fontSize: 13, color: '#333', marginBottom: 4 }}><b>Time Limit:</b> {exam.timeLimit} min</div>
                <div style={{ fontSize: 13, color: '#333', marginBottom: 4 }}><b>Passage:</b> <span style={{ background: '#f1f8e9', padding: '2px 6px', borderRadius: 4 }}>{exam.passage ? (exam.passage.length > 60 ? exam.passage.slice(0, 60) + '...' : exam.passage) : 'No passage'}</span></div>
                <div style={{ fontSize: 13, color: '#333', marginBottom: 4 }}><b>Join Link:</b> <a href={exam.joinLink} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline' }}>{exam.joinLink}</a></div>
              </div>
              <div style={{ flex: 1, minWidth: 120, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                <button onClick={() => handleToggleLive(exam)} style={{ background: exam.isLive ? '#43a047' : '#bdbdbd', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontWeight: 600, fontSize: 14, marginBottom: 6, cursor: 'pointer', boxShadow: exam.isLive ? '0 2px 8px #43a04722' : undefined }}>
                  {exam.isLive ? 'Live' : 'Stopped'}
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