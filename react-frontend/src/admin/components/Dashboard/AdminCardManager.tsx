import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

interface Card {
  id: string; // MongoDB _id as string
  title: string;
  description: string;
  originalPrice: number;
  offerPrice: number;
  isActive: boolean;
}

const AdminCardManager: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Card>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch cards from backend
  const fetchCards = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/cards');
      setCards(res.data.map((c: any) => ({ ...c, id: c._id })));
    } catch (err) {
      setError('Failed to load cards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleEdit = (card: Card) => {
    setEditingCard(card);
    setForm({
      id: card.id,
      title: card.title,
      description: card.description,
      originalPrice: card.originalPrice,
      offerPrice: card.offerPrice,
      isActive: card.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this card?')) return;
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/cards/${id}`);
      setCards(cards.filter(card => card.id !== id));
    } catch (err) {
      setError('Failed to delete card');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingCard(null);
    setForm({});
    setShowForm(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name.includes('Price') ? Number(value) : value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editingCard) {
        // Update
        const res = await axios.put(`/api/cards/${editingCard.id}`, form);
        setCards(cards.map(card => card.id === editingCard.id ? { ...res.data, id: res.data._id } : card));
      } else {
        // Add
        const res = await axios.post('/api/cards', form);
        setCards([...cards, { ...res.data, id: res.data._id }]);
      }
      setShowForm(false);
      setEditingCard(null);
      setForm({});
    } catch (err) {
      setError('Failed to save card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h2 style={{ color: '#1976d2', marginBottom: 18 }}>Card Management</h2>
      <button onClick={handleAddNew} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, marginBottom: 24, cursor: 'pointer' }}>Add New Card</button>
      {loading && <div style={{ color: '#1976d2', marginBottom: 12 }}>Loading...</div>}
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {showForm && (
        <div style={{ background: '#f8fafc', border: '1.5px solid #90caf9', borderRadius: 14, padding: 20, marginBottom: 32, boxShadow: '0 2px 12px rgba(25,118,210,0.07)', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
          <h3 style={{ color: '#1976d2', marginBottom: 18, textAlign: 'center' }}>{editingCard ? 'Edit Card' : 'Add New Card'}</h3>
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Title</label>
              <input name="title" value={form.title || ''} onChange={handleFormChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #bdbdbd' }} />
            </div>
            <div>
              <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Description</label>
              <textarea name="description" value={form.description || ''} onChange={handleFormChange} required style={{ width: '100%', height: 60, padding: 8, borderRadius: 6, border: '1px solid #bdbdbd', resize: 'vertical' }} />
            </div>
            <div>
              <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Original Price</label>
              <input name="originalPrice" type="number" min="0" value={form.originalPrice || ''} onChange={handleFormChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #bdbdbd' }} />
            </div>
            <div>
              <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Offer Price</label>
              <input name="offerPrice" type="number" min="0" value={form.offerPrice || ''} onChange={handleFormChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #bdbdbd' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
              <button type="submit" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 22px', fontWeight: 600, cursor: 'pointer' }}>{editingCard ? 'Update Card' : 'Add Card'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingCard(null); setForm({}); }} style={{ background: '#bdbdbd', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div style={{ marginBottom: 18, fontWeight: 600, color: '#1976d2', fontSize: 18 }}>All Cards</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {cards.map(card => (
          <div key={card.id} style={{ background: '#fff', border: '1.5px solid #e3f2fd', borderRadius: 12, boxShadow: '0 1px 8px rgba(25,118,210,0.04)', padding: 18, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 18 }}>
            <div style={{ flex: 2, minWidth: 180 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#1976d2' }}>{card.title}</div>
              <div style={{ fontSize: 13, color: '#1a2a44', margin: '2px 0 6px 0' }}>{card.description}</div>
              <div style={{ fontSize: 13, color: '#333', marginBottom: 4 }}>
                <b>Original Price:</b> {card.originalPrice === 0 ? <span style={{ color: '#43a047', fontWeight: 600 }}>Free</span> : <span style={{ textDecoration: card.offerPrice < card.originalPrice ? 'line-through' : 'none', color: card.offerPrice < card.originalPrice ? '#d6001c' : '#333' }}>{card.originalPrice}</span>}
              </div>
              <div style={{ fontSize: 13, color: '#333', marginBottom: 4 }}>
                <b>Offer Price:</b> {card.offerPrice === 0 ? <span style={{ color: '#43a047', fontWeight: 600 }}>Free</span> : <span style={{ color: '#43a047', fontWeight: 600 }}>{card.offerPrice}</span>}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 120, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
              <button onClick={() => handleEdit(card)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Edit</button>
              <button onClick={() => handleDelete(card.id)} style={{ background: '#d6001c', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCardManager; 