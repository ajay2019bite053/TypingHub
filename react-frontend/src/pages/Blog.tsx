import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import './Blog.css';
import { API_CONFIG } from '../config/api';

interface Blog {
  _id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

const Blog: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = `${API_CONFIG.BASE_URL}/blogs`;
      console.log('Fetching blogs from:', apiUrl);
      
      const res = await axios.get(apiUrl, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Blogs response:', res.data);
      setBlogs(res.data);
    } catch (err: any) {
      console.error('Error fetching blogs:', err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', err.response.data);
        console.error('Error status:', err.response.status);
        setError(`Server error: ${err.response.status} - ${err.response.data?.message || 'Unknown error'}`);
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        setError('No response from server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', err.message);
        setError(`Request error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content blog-page">
      <Helmet>
        <title>Blog - TypingHub.in 📚</title>
        <meta name="description" content="Explore expert guides, tutorials, and success stories about typing skills, exam preparation, and professional development." />
        <meta name="keywords" content="typing tutorials, typing guides, exam preparation, typing success stories" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Serif:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="blog-hero-section">
        <div className="blog-hero-content">
          <h1>TypingHub Learning Center 📚</h1>
          <p>Explore expert guides, comprehensive tutorials, and success stories to master typing and excel in your career.</p>
        </div>
      </div>

      <div className="blog-main-content">
        <div className="blog-sections">
          {loading && <p>Loading blogs...</p>}
          {error && (
            <div style={{ color: 'red', padding: '20px', background: '#fff3f3', border: '1px solid #ffcdd2', borderRadius: '8px', margin: '20px 0' }}>
              <strong>Error loading blogs:</strong> {error}
              <br />
              <button 
                onClick={fetchBlogs} 
                style={{ 
                  marginTop: '10px', 
                  padding: '8px 16px', 
                  background: '#1976d2', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}
              >
                Retry
              </button>
            </div>
          )}
          {blogs
            .slice()
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map(blog => (
              <div key={blog._id} className="blog-card">
                {blog.image && <img src={blog.image} alt={blog.title} className="blog-image" />}
                <h3 className="blog-title">{blog.title}</h3>
                <div className="blog-content-text">
                  <p>{blog.content}</p>
                </div>
              </div>
                ))}
          {blogs.length === 0 && !loading && !error && <p>No blogs found.</p>}
        </div>
    </div>
    </main>
  );
};

export default Blog; 