import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import './Blog.css';

interface Blog {
  _id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

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
      const res = await axios.get(`${API_BASE_URL}/blogs`);
      setBlogs(res.data);
    } catch (err: any) {
      setError('Failed to load blogs');
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
          {error && <p style={{ color: 'red' }}>{error}</p>}
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
          {blogs.length === 0 && !loading && <p>No blogs found.</p>}
        </div>
    </div>
    </main>
  );
};

export default Blog; 