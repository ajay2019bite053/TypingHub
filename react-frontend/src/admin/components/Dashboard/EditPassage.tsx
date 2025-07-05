import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditPassage.css';
import { useAdmin } from '../../../contexts/AdminContext';
import { Passage } from '../../../types/Passage';
import axios from 'axios';

const EditPassage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { passages, setPassages, setEditId } = useAdmin();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPassage = async () => {
      try {
        const response = await axios.get(`/api/passages/${id}`);
        const passage = response.data;
        setTitle(passage.title);
        setContent(passage.content);
        setCategory(passage.category || '');
      } catch (err) {
        navigate('/admin/view-passages');
      }
    };

    if (id) {
      fetchPassage();
    }
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.put(
        `/api/passages/${id}`,
        {
          title,
          content,
          category
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setPassages(passages.map((passage: Passage) =>
        passage._id === id
          ? { ...passage, ...response.data }
          : passage
      ));
      setEditId(null);
      navigate('/admin/view-passages');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update passage');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="edit-passage">
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            disabled={isLoading}
          >
            <option value="">Select Category</option>
            <option value="SSC-CGL">SSC-CGL</option>
            <option value="SSC-CHSL">SSC-CHSL</option>
            <option value="RRB-NTPC">RRB-NTPC</option>
            <option value="Police">Police</option>
            <option value="CPCT">CPCT</option>
          </select>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Passage'}
        </button>
      </form>
    </div>
  );
};

export default EditPassage; 