import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faWhatsapp, 
  faFacebook, 
  faTwitter, 
  faTelegram 
} from '@fortawesome/free-brands-svg-icons';
import { 
  faClock, 
  faUser, 
  faCalendar, 
  faEye, 
  faHeart,
  faCopy,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './IndividualBlog.css';
import { API_CONFIG } from '../config/api';

interface Blog {
  _id: string;
  title: string;
  content: string;
  image?: string;
  category?: string;
  tags?: string[];
  readTime?: number;
  views?: number;
  likes?: number;
  author?: string;
  createdAt: string;
  updatedAt: string;
}

const IndividualBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    if (id) {
      fetchBlog(id);
      checkIfLiked(id);
    }
  }, [id]);

  const fetchBlog = async (blogId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/blogs/${blogId}`);
      const blogData = response.data;
      
      // Add default values if missing
      const blogWithDefaults = {
        ...blogData,
        category: blogData.category || 'typing-tips',
        tags: blogData.tags || ['typing', 'practice'],
        readTime: blogData.readTime || Math.ceil(blogData.content.split(' ').length / 200),
        views: blogData.views || 0,
        likes: blogData.likes || 0,
        author: blogData.author || 'TypingHub'
      };
      
      setBlog(blogWithDefaults);
      
      // Track view
      trackBlogView(blogId);
      
      // Fetch related blogs
      fetchRelatedBlogs(blogWithDefaults);
      
    } catch (err: any) {
      console.error('Error fetching blog:', err);
      if (err.response?.status === 404) {
        setError('Blog not found');
      } else {
        setError('Failed to load blog. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const trackBlogView = async (blogId: string) => {
    try {
      await axios.post(`${API_CONFIG.BASE_URL}/blogs/${blogId}/view`, {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      });
    } catch (err) {
      console.error('Error tracking view:', err);
    }
  };

  const checkIfLiked = (blogId: string) => {
    const savedLikedBlogs = localStorage.getItem('likedBlogs');
    if (savedLikedBlogs) {
      try {
        const parsed = JSON.parse(savedLikedBlogs);
        setLiked(parsed.includes(blogId));
      } catch (err) {
        console.error('Error parsing liked blogs:', err);
      }
    }
  };

  const fetchRelatedBlogs = async (currentBlog: Blog) => {
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/blogs`);
      const allBlogs = response.data;
      
      const related = allBlogs
        .filter((blog: Blog) => 
          blog._id !== currentBlog._id && 
          blog.category === currentBlog.category
        )
        .slice(0, 3);
      
      setRelatedBlogs(related);
    } catch (err) {
      console.error('Error fetching related blogs:', err);
    }
  };

  const toggleLike = async () => {
    if (!blog) return;
    
    try {
      const action = liked ? 'unlike' : 'like';
      const response = await axios.post(`${API_CONFIG.BASE_URL}/blogs/${blog._id}/like`, {
        action,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
      
      // Update local state
      setLiked(!liked);
      setBlog(prev => prev ? { ...prev, likes: response.data.likes } : null);
      
      // Update localStorage
      const savedLikedBlogs = localStorage.getItem('likedBlogs') || '[]';
      const parsed = JSON.parse(savedLikedBlogs);
      
      if (liked) {
        const updated = parsed.filter((id: string) => id !== blog._id);
        localStorage.setItem('likedBlogs', JSON.stringify(updated));
      } else {
        const updated = [...parsed, blog._id];
        localStorage.setItem('likedBlogs', JSON.stringify(updated));
      }
      
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const shareBlog = (platform: string) => {
    if (!blog) return;
    
    const url = window.location.href;
    const title = blog.title;
    const text = blog.content.substring(0, 100) + '...';
    
    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${text}\n\n${url}`)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const copyLink = async () => {
    if (!blog) return;
    
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="individual-blog-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="individual-blog-page">
        <div className="error-container">
          <h2>Oops! Something went wrong</h2>
          <p>{error || 'Blog not found'}</p>
          <button onClick={() => navigate('/blog')} className="back-btn">
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="individual-blog-page">
      <Helmet>
        <title>{blog.title} - TypingHub.in 📚</title>
        <meta name="description" content={blog.content.substring(0, 160)} />
        <meta name="keywords" content={blog.tags?.join(', ') || 'typing, practice'} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.content.substring(0, 160)} />
        <meta property="og:image" content={blog.image} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Serif:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      {/* Blog Content - Full Width */}
      <div className="individual-blog-container">
        {/* Blog Header */}
        <div className="blog-header-section">
          <div className="blog-meta-top">
            <span className="blog-category">{blog.category?.replace('-', ' ').toUpperCase()}</span>
            <span className="blog-read-time">
              <FontAwesomeIcon icon={faClock} /> {blog.readTime} min read
            </span>
          </div>
          
          <h1 className="blog-main-title">{blog.title}</h1>
          
          <div className="blog-meta-info">
            <div className="blog-author">
              <FontAwesomeIcon icon={faUser} className="author-avatar" />
              <span className="author-name">{blog.author}</span>
            </div>
            <div className="blog-date">
              <FontAwesomeIcon icon={faCalendar} className="date-icon" />
              {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Blog Image */}
        {blog.image && (
          <div className="blog-main-image-container">
            <img src={blog.image} alt={blog.title} className="blog-main-image" />
          </div>
        )}

        {/* Blog Content */}
        <div className="blog-content-section">
          <div className="blog-content-text">
            {blog.content
              .split(/\n+/)
              .filter(paragraph => paragraph.trim().length > 0)
              .map((paragraph, index) => {
                // Check if paragraph starts with common headers
                if (paragraph.trim().toLowerCase().startsWith('introduction:') || 
                    paragraph.trim().toLowerCase().startsWith('content:') ||
                    paragraph.trim().toLowerCase().startsWith('conclusion:')) {
                  return (
                    <div key={index} className="content-section">
                      <h3 className="content-header">{paragraph.trim()}</h3>
                    </div>
                  );
                }
                
                // Regular paragraph
                return (
                  <p key={index} className="content-paragraph">
                    {paragraph.trim()}
                  </p>
                );
              })}
          </div>
        </div>

        {/* Blog Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="blog-tags-section">
            <h3>Tags:</h3>
            <div className="blog-tags">
              {blog.tags.map((tag, index) => (
                <span key={index} className="blog-tag">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Blog Actions - All in One Section */}
        <div className="blog-actions-section">
          <div className="blog-actions-left">
            <div className="blog-stats">
              <div className="blog-stat">
                <FontAwesomeIcon icon={faEye} className="stat-icon" />
                <span>{blog.views?.toLocaleString() || 0} views</span>
              </div>
              <button 
                className={`like-btn ${liked ? 'liked' : ''}`}
                onClick={toggleLike}
                title={liked ? 'Unlike' : 'Like'}
              >
                <FontAwesomeIcon icon={faHeart} className="like-icon" />
                <span className="like-count">{blog.likes || 0}</span>
              </button>
            </div>
          </div>
          
          <div className="blog-actions-right">
            <div className="share-section">
              <span className="share-label">Share:</span>
              <div className="share-buttons">
                <button 
                  className="share-btn whatsapp"
                  onClick={() => shareBlog('whatsapp')}
                  title="Share on WhatsApp"
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                </button>
                <button 
                  className="share-btn facebook"
                  onClick={() => shareBlog('facebook')}
                  title="Share on Facebook"
                >
                  <FontAwesomeIcon icon={faFacebook} />
                </button>
                <button 
                  className="share-btn twitter"
                  onClick={() => shareBlog('twitter')}
                  title="Share on Twitter"
                >
                  <FontAwesomeIcon icon={faTwitter} />
                </button>
                <button 
                  className="share-btn telegram"
                  onClick={() => shareBlog('telegram')}
                  title="Share on Telegram"
                >
                  <FontAwesomeIcon icon={faTelegram} />
                </button>
              </div>
              
              <button 
                className={`copy-link-btn ${copied ? 'copied' : ''}`}
                onClick={copyLink}
                title={copied ? 'Link Copied!' : 'Copy Link'}
              >
                <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                <span className="copy-text">
                  {copied ? 'Copied!' : 'Copy'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <div className="related-blogs-section">
            <h3 className="related-title">Related Articles</h3>
            <div className="related-blogs-grid">
              {relatedBlogs.map(relatedBlog => (
                <div key={relatedBlog._id} className="related-blog-card" onClick={() => navigate(`/blog/${relatedBlog._id}`)}>
                  {relatedBlog.image && (
                    <img 
                      src={relatedBlog.image} 
                      alt={relatedBlog.title} 
                      className="related-blog-image"
                    />
                  )}
                  <div className="related-blog-content">
                    <h4 className="related-blog-title">{relatedBlog.title}</h4>
                    <span className="related-blog-category">{relatedBlog.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default IndividualBlog;
