import React, { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import Toast, { ToastType } from '../../../components/Toast/Toast';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import './BlogManager.css';
import { API_CONFIG } from '../../../config/api';

interface Blog {
  _id: string;
  title: string;
  content: string;
  image?: string;
  category: string;
  tags: string[];
  readTime: number;
  views: number;
  likes: number;
  author: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const BlogManager: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Blog>>({
    category: 'typing-tips',
    tags: [],
    author: 'TypingHub',
    status: 'published'
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10;
  const [toast, setToast] = useState<{ show: boolean; type: ToastType; message: string }>({ show: false, type: 'info', message: '' });

  // Categories for blogs
  const categories = [
    { id: 'typing-tips', name: 'Typing Tips' },
    { id: 'exam-prep', name: 'Exam Preparation' },
    { id: 'success-stories', name: 'Success Stories' },
    { id: 'speed-techniques', name: 'Speed Techniques' },
    { id: 'practice-exercises', name: 'Practice Exercises' }
  ];

  // Status options
  const statusOptions = [
    { id: 'draft', name: 'Draft' },
    { id: 'published', name: 'Published' },
    { id: 'archived', name: 'Archived' }
  ];

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/blogs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch blogs (${response.status})`);
      }

      const data = await response.json();
      setBlogs(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching blogs:', err);
      setError(err.message || 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setForm({ ...form, tags });
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageUploading(true);
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('Authentication required');
        }

        const formData = new FormData();
        formData.append('image', e.target.files[0]);

        const response = await fetch(`${API_CONFIG.BASE_URL}/uploads`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to upload image');
        }

        const data = await response.json();
        setForm(f => ({ ...f, image: data.url }));
        setFormError(null);
      } catch (err: any) {
        console.error('Error uploading image:', err);
        setFormError(err.message || 'Failed to upload image');
      } finally {
        setImageUploading(false);
      }
    }
  };

  const showToast = (type: ToastType, message: string) => {
    setToast({ show: true, type, message });
  };
  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Calculate read time if not provided
      if (!form.readTime && form.content) {
        const words = form.content.split(' ').length;
        form.readTime = Math.ceil(words / 200); // 200 words per minute
      }

      const response = await fetch(
        editingId ? `${API_CONFIG.BASE_URL}/blogs/${editingId}` : `${API_CONFIG.BASE_URL}/blogs`,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form)
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${editingId ? 'update' : 'create'} blog`);
      }

      showToast('success', `Blog ${editingId ? 'updated' : 'created'} successfully!`);
      fetchBlogs();
      setForm({
        category: 'typing-tips',
        tags: [],
        author: 'TypingHub',
        status: 'published'
      });
      setEditingId(null);
      setFormError(null);
    } catch (err: any) {
      console.error('Error saving blog:', err);
      setFormError(err.message || 'Failed to save blog');
      showToast('error', err.message || 'Failed to save blog');
      } finally {
        setActionLoading(false);
    }
  };

  const handleEdit = (blog: Blog) => {
    setForm({ 
      title: blog.title, 
      content: blog.content, 
      image: blog.image,
      category: blog.category,
      tags: blog.tags,
      readTime: blog.readTime,
      author: blog.author,
      status: blog.status
    });
    setEditingId(blog._id);
    setFormError(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this blog post?')) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete blog');
      }

      showToast('success', 'Blog deleted successfully!');
      fetchBlogs();
      setFormError(null);
    } catch (err: any) {
      console.error('Error deleting blog:', err);
      setFormError(err.message || 'Failed to delete blog');
      showToast('error', err.message || 'Failed to delete blog');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      category: 'typing-tips',
      tags: [],
      author: 'TypingHub',
      status: 'published'
    });
    setEditingId(null);
    setFormError(null);
  };

  // Calculate paginated blogs
  const paginatedBlogs = blogs.slice((currentPage - 1) * blogsPerPage, currentPage * blogsPerPage);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      {loading && <LoadingSpinner fullScreen text="Loading blogs..." />}
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      
      {/* Blog Form */}
      <div style={{ background: '#f8fafc', border: '1.5px solid #90caf9', borderRadius: 14, padding: 24, marginBottom: 32, boxShadow: '0 2px 12px rgba(25,118,210,0.07)' }}>
        <h3 style={{ color: '#1976d2', marginBottom: 20, fontWeight: 700, fontSize: 22 }}>{editingId ? 'Edit Blog' : 'Add New Blog'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Title and Category Row */}
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ flex: 2 }}>
              <label style={{ fontWeight: 600, color: '#333', marginBottom: 8, display: 'block' }}>Title *</label>
              <input 
                name="title" 
                placeholder="Blog Title" 
                value={form.title || ''} 
                onChange={handleChange} 
                required 
                style={{ 
                  width: '100%', 
                  padding: 12, 
                  borderRadius: 8, 
                  border: '1px solid #bdbdbd', 
                  fontSize: 14,
                  backgroundColor: '#fff'
                }} 
                disabled={actionLoading} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, color: '#333', marginBottom: 8, display: 'block' }}>Category *</label>
              <select 
                name="category" 
                value={form.category || 'typing-tips'} 
                onChange={handleChange} 
                required 
                style={{ 
                  width: '100%', 
                  padding: 12, 
                  borderRadius: 8, 
                  border: '1px solid #bdbdbd', 
                  fontSize: 14,
                  backgroundColor: '#fff'
                }} 
                disabled={actionLoading}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Content */}
          <div>
            <label style={{ fontWeight: 600, color: '#333', marginBottom: 8, display: 'block' }}>Content *</label>
            <textarea 
              name="content" 
              placeholder="Blog Content" 
              value={form.content || ''} 
              onChange={handleChange} 
              required 
              rows={6} 
              style={{ 
                width: '100%', 
                padding: 12, 
                borderRadius: 8, 
                border: '1px solid #bdbdbd', 
                fontSize: 14,
                resize: 'vertical',
                backgroundColor: '#fff'
              }} 
              disabled={actionLoading} 
            />
          </div>

          {/* Tags and Read Time Row */}
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ flex: 2 }}>
              <label style={{ fontWeight: 600, color: '#333', marginBottom: 8, display: 'block' }}>Tags (comma separated)</label>
              <input 
                name="tags" 
                placeholder="typing, practice, tips" 
                value={form.tags?.join(', ') || ''} 
                onChange={handleTagsChange} 
                style={{ 
                  width: '100%', 
                  padding: 12, 
                  borderRadius: 8, 
                  border: '1px solid #bdbdbd', 
                  fontSize: 14,
                  backgroundColor: '#fff'
                }} 
                disabled={actionLoading} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, color: '#333', marginBottom: 8, display: 'block' }}>Read Time (minutes)</label>
              <input 
                name="readTime" 
                type="number" 
                placeholder="Auto-calculated" 
                value={form.readTime || ''} 
                onChange={handleChange} 
                min="1"
                style={{ 
                  width: '100%', 
                  padding: 12, 
                  borderRadius: 8, 
                  border: '1px solid #bdbdbd', 
                  fontSize: 14,
                  backgroundColor: '#fff'
                }} 
                disabled={actionLoading} 
              />
            </div>
          </div>

          {/* Author, Status, and Image Row */}
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, color: '#333', marginBottom: 8, display: 'block' }}>Author</label>
              <input 
                name="author" 
                placeholder="TypingHub" 
                value={form.author || 'TypingHub'} 
                onChange={handleChange} 
                style={{ 
                  width: '100%', 
                  padding: 12, 
                  borderRadius: 8, 
                  border: '1px solid #bdbdbd', 
                  fontSize: 14,
                  backgroundColor: '#fff'
                }} 
                disabled={actionLoading} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, color: '#333', marginBottom: 8, display: 'block' }}>Status</label>
              <select 
                name="status" 
                value={form.status || 'published'} 
                onChange={handleChange} 
                style={{ 
                  width: '100%', 
                  padding: 12, 
                  borderRadius: 8, 
                  border: '1px solid #bdbdbd', 
                  fontSize: 14,
                  backgroundColor: '#fff'
                }} 
                disabled={actionLoading}
              >
                {statusOptions.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, color: '#333', marginBottom: 8, display: 'block' }}>Image</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                style={{ 
                  width: '100%', 
                  padding: 8, 
                  borderRadius: 8, 
                  border: '1px solid #bdbdbd', 
                  fontSize: 14,
                  backgroundColor: '#fff'
                }} 
                disabled={actionLoading || imageUploading} 
              />
              {imageUploading && <div style={{ color: '#1976d2', fontSize: 12, marginTop: 4 }}>Uploading...</div>}
              {form.image && (
                <div style={{ marginTop: 8 }}>
                  <img src={form.image} alt="Preview" style={{ maxWidth: 100, maxHeight: 60, borderRadius: 4 }} />
                </div>
              )}
            </div>
          </div>

          {formError && <div style={{ color: 'red', width: '100%', padding: '8px 12px', backgroundColor: '#ffebee', borderRadius: 6, border: '1px solid #ffcdd2' }}>{formError}</div>}
          
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
            <button 
              type="submit" 
              style={{ 
                background: '#1976d2', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 8, 
                padding: '12px 28px', 
                fontWeight: 600, 
                fontSize: 16, 
                cursor: actionLoading ? 'not-allowed' : 'pointer', 
                opacity: actionLoading ? 0.7 : 1 
              }} 
              disabled={actionLoading}
            >
              {actionLoading ? <LoadingSpinner size="small" text="" /> : (editingId ? 'Update Blog' : 'Add Blog')}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={handleCancel} 
                style={{ 
                  background: '#bdbdbd', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 8, 
                  padding: '12px 24px', 
                  fontWeight: 600, 
                  fontSize: 16, 
                  cursor: actionLoading ? 'not-allowed' : 'pointer', 
                  opacity: actionLoading ? 0.7 : 1 
                }} 
                disabled={actionLoading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Blogs List */}
      <div style={{ marginBottom: 20, fontWeight: 600, color: '#1976d2', fontSize: 20 }}>All Blogs ({blogs.length})</div>
      {loading ? null : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {paginatedBlogs.map(blog => (
            <div key={blog._id} style={{ background: '#fff', border: '1.5px solid #e3f2fd', borderRadius: 12, boxShadow: '0 2px 12px rgba(25,118,210,0.08)', padding: 20 }}>
              
              {/* Blog Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{ 
                      background: '#1976d2', 
                      color: 'white', 
                      padding: '4px 12px', 
                      borderRadius: 12, 
                      fontSize: 11, 
                      fontWeight: 600 
                    }}>
                      {blog.category?.replace('-', ' ').toUpperCase()}
                    </span>
                    <span style={{ 
                      background: blog.status === 'published' ? '#4caf50' : blog.status === 'draft' ? '#ff9800' : '#9e9e9e', 
                      color: 'white', 
                      padding: '4px 8px', 
                      borderRadius: 8, 
                      fontSize: 10, 
                      fontWeight: 600 
                    }}>
                      {blog.status}
                    </span>
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: 18, color: '#1976d2', marginBottom: 8 }}>{blog.title}</h3>
                  <div style={{ fontSize: 14, color: '#666', marginBottom: 12 }}>{blog.content.substring(0, 150)}...</div>
                </div>
                
                {/* Blog Image */}
                {blog.image && (
                  <div style={{ marginLeft: 20 }}>
                    <img src={blog.image} alt={blog.title} style={{ maxWidth: 120, maxHeight: 80, borderRadius: 8, objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              {/* Blog Meta */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 20, fontSize: 13, color: '#666' }}>
                  <span><strong>Author:</strong> {blog.author}</span>
                  <span><strong>Read Time:</strong> {blog.readTime || 'Auto'} min</span>
                  <span><strong>Views:</strong> {blog.views || 0}</span>
                  <span><strong>Likes:</strong> {blog.likes || 0}</span>
                  <span><strong>Created:</strong> {new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {blog.tags.map((tag, index) => (
                      <span key={index} style={{ 
                        background: '#f0f4fa', 
                        color: '#1976d2', 
                        padding: '4px 8px', 
                        borderRadius: 12, 
                        fontSize: 11, 
                        fontWeight: 500 
                      }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => handleEdit(blog)} 
                  style={{ 
                    background: '#1976d2', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 6, 
                    padding: '8px 16px', 
                    fontWeight: 600, 
                    fontSize: 14, 
                    cursor: actionLoading ? 'not-allowed' : 'pointer', 
                    opacity: actionLoading ? 0.7 : 1 
                  }} 
                  disabled={actionLoading}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(blog._id)} 
                  style={{ 
                    background: '#d6001c', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 6, 
                    padding: '8px 16px', 
                    fontWeight: 600, 
                    fontSize: 14, 
                    cursor: actionLoading ? 'not-allowed' : 'pointer', 
                    opacity: actionLoading ? 0.7 : 1 
                  }} 
                  disabled={actionLoading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && !loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 32 }}>
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
            disabled={currentPage === 1 || loading} 
            style={{ 
              padding: '8px 20px', 
              borderRadius: 8, 
              border: '1px solid #bdbdbd', 
              background: currentPage === 1 ? '#eee' : '#1976d2', 
              color: currentPage === 1 ? '#888' : '#fff', 
              fontWeight: 600, 
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer' 
            }}
          >
            Previous
          </button>
          <span style={{ fontWeight: 600, color: '#1976d2', fontSize: 16 }}>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
            disabled={currentPage === totalPages || loading} 
            style={{ 
              padding: '8px 20px', 
              borderRadius: 8, 
              border: '1px solid #bdbdbd', 
              background: currentPage === totalPages ? '#eee' : '#1976d2', 
              color: currentPage === totalPages ? '#888' : '#fff', 
              fontWeight: 600, 
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' 
            }}
          >
            Next
          </button>
        </div>
      )}

      <Toast
        type={toast.type}
        message={toast.message}
        show={toast.show}
        onClose={hideToast}
        duration={3500}
      />
    </div>
  );
};

export default BlogManager; 