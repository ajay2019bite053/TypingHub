import React, { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import Toast, { ToastType } from '../../../components/Toast/Toast';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import './BlogManager.css';

interface Blog {
  _id: string;
  title: string;
  content: string;
  image?: string;
  likes: number;
  comments: { user: string; text: string; date: string }[];
  shareCount: number;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

const BlogManager: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Blog>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10;
  const [toast, setToast] = useState<{ show: boolean; type: ToastType; message: string }>({ show: false, type: 'info', message: '' });

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/blogs`);
      setBlogs(res.data);
    } catch (err: any) {
      setError('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageUploading(true);
      try {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        const res = await axios.post(`${API_BASE_URL}/uploads`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setForm(f => ({ ...f, image: res.data.url }));
      } catch (err) {
        setFormError('Image upload failed');
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
    setFormError(null);
    if (editingId) {
      // Optimistic update for edit
      const prevBlogs = [...blogs];
      const updatedBlog = { ...blogs.find(b => b._id === editingId)!, title: form.title!, content: form.content! };
      setBlogs(blogs => blogs.map(b => b._id === editingId ? updatedBlog : b));
      try {
        const res = await axios.put(`${API_BASE_URL}/blogs/${editingId}`,
          { title: form.title, content: form.content, image: form.image });
        setBlogs(blogs => blogs.map(b => b._id === editingId ? res.data : b));
        showToast('success', 'Blog updated successfully!');
      } catch (err) {
        setBlogs(prevBlogs);
        setFormError('Failed to save blog');
        showToast('error', 'Failed to save blog');
      } finally {
        setActionLoading(false);
        setForm({});
        setEditingId(null);
      }
    } else {
      // Optimistic update for add
      const tempId = 'temp-' + Date.now();
      const optimisticBlog = { _id: tempId, title: form.title!, content: form.content!, image: '', likes: 0, comments: [], shareCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      setBlogs(blogs => [optimisticBlog, ...blogs]);
      try {
        const res = await axios.post(`${API_BASE_URL}/blogs`,
          { title: form.title, content: form.content, image: form.image });
        setBlogs(blogs => blogs.map(b => b._id === tempId ? res.data : b));
        showToast('success', 'Blog added successfully!');
      } catch (err) {
        setBlogs(blogs => blogs.filter(b => b._id !== tempId));
        setFormError('Failed to save blog');
        showToast('error', 'Failed to save blog');
      } finally {
        setActionLoading(false);
        setForm({});
        setEditingId(null);
      }
    }
  };

  const handleEdit = (blog: Blog) => {
    setForm({ title: blog.title, content: blog.content, image: blog.image });
    setEditingId(blog._id);
    setFormError(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this blog?')) return;
    setActionLoading(true);
    // Optimistic update for delete
    const prevBlogs = [...blogs];
    setBlogs(blogs => blogs.filter(b => b._id !== id));
    try {
      await axios.delete(`${API_BASE_URL}/blogs/${id}`);
      showToast('success', 'Blog deleted successfully!');
    } catch (err) {
      setBlogs(prevBlogs);
      setError('Failed to delete blog');
      showToast('error', 'Failed to delete blog');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({});
    setEditingId(null);
    setFormError(null);
  };

  // Calculate paginated blogs
  const paginatedBlogs = blogs.slice((currentPage - 1) * blogsPerPage, currentPage * blogsPerPage);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      {loading && <LoadingSpinner fullScreen text="Loading blogs..." />}
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <div style={{ background: '#f8fafc', border: '1.5px solid #90caf9', borderRadius: 14, padding: 20, marginBottom: 32, boxShadow: '0 2px 12px rgba(25,118,210,0.07)' }}>
        <h3 style={{ color: '#1976d2', marginBottom: 18, fontWeight: 700, fontSize: 20 }}>{editingId ? 'Edit Blog' : 'Add New Blog'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <label style={{ fontWeight: 500 }}>Title</label>
            <input name="title" placeholder="Blog Title" value={form.title || ''} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4 }} disabled={actionLoading} />
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <label style={{ fontWeight: 500 }}>Content</label>
            <textarea name="content" placeholder="Blog Content" value={form.content || ''} onChange={handleChange} required rows={3} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #bdbdbd', marginTop: 4, resize: 'vertical' }} disabled={actionLoading} />
          </div>
          {formError && <div style={{ color: 'red', width: '100%' }}>{formError}</div>}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
            <button type="submit" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: actionLoading ? 'not-allowed' : 'pointer', opacity: actionLoading ? 0.7 : 1 }} disabled={actionLoading}>{actionLoading ? <LoadingSpinner size="small" text="" /> : (editingId ? 'Update Blog' : 'Add Blog')}</button>
            {editingId && <button type="button" onClick={handleCancel} style={{ background: '#bdbdbd', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 18px', fontWeight: 600, fontSize: 16, cursor: actionLoading ? 'not-allowed' : 'pointer', opacity: actionLoading ? 0.7 : 1 }} disabled={actionLoading}>Cancel</button>}
          </div>
        </form>
      </div>
      <div style={{ marginBottom: 18, fontWeight: 600, color: '#1976d2', fontSize: 18 }}>All Blogs</div>
      {loading ? null : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {paginatedBlogs.map(blog => (
            <div key={blog._id} style={{ background: '#fff', border: '1.5px solid #e3f2fd', borderRadius: 12, boxShadow: '0 1px 8px rgba(25,118,210,0.04)', padding: 18, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 18 }}>
              <div style={{ flex: 2, minWidth: 180 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#1976d2' }}>{blog.title}</div>
                <div style={{ fontSize: 13, color: '#333', margin: '2px 0 6px 0' }}>{blog.content}</div>
                {blog.image && <div style={{ margin: '8px 0' }}><img src={blog.image} alt={blog.title} style={{ maxWidth: 120, maxHeight: 80, borderRadius: 6 }} /></div>}
                <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}><b>Likes:</b> {blog.likes} &nbsp; <b>Comments:</b> {blog.comments.length} &nbsp; <b>Shares:</b> {blog.shareCount}</div>
                <div style={{ fontSize: 12, color: '#aaa' }}>Created: {new Date(blog.createdAt).toLocaleString()}</div>
              </div>
              <div style={{ flex: 1, minWidth: 120, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                <button onClick={() => handleEdit(blog)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontWeight: 600, fontSize: 14, cursor: actionLoading ? 'not-allowed' : 'pointer', opacity: actionLoading ? 0.7 : 1 }} disabled={actionLoading}>Edit</button>
                <button onClick={() => handleDelete(blog._id)} style={{ background: '#d6001c', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontWeight: 600, fontSize: 14, cursor: actionLoading ? 'not-allowed' : 'pointer', opacity: actionLoading ? 0.7 : 1 }} disabled={actionLoading}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Pagination Controls */}
      {totalPages > 1 && !loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 24 }}>
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || loading} style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid #bdbdbd', background: currentPage === 1 ? '#eee' : '#1976d2', color: currentPage === 1 ? '#888' : '#fff', fontWeight: 600, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>Prev</button>
          <span style={{ fontWeight: 600, color: '#1976d2' }}>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || loading} style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid #bdbdbd', background: currentPage === totalPages ? '#eee' : '#1976d2', color: currentPage === totalPages ? '#888' : '#fff', fontWeight: 600, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}>Next</button>
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