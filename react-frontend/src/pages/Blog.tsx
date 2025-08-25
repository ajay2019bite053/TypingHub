import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faWhatsapp, 
  faFacebook, 
  faTwitter, 
  faTelegram 
} from '@fortawesome/free-brands-svg-icons';
import { 
  faSearch, 
  faClock, 
  faUser, 
  faCalendar, 
  faEye, 
  faHeart,
  faChevronDown,
  faChevronUp,
  faCopy,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import './Blog.css';
import { API_CONFIG } from '../config/api';

interface Blog {
  _id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  category?: string;
  tags?: string[];
  readTime?: number;
  views?: number;
  likes?: number;
}

const Blog: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedBlogs, setExpandedBlogs] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(5);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [observerTarget, setObserverTarget] = useState<HTMLDivElement | null>(null);
  const [copiedBlogId, setCopiedBlogId] = useState<string | null>(null);
  const [likedBlogs, setLikedBlogs] = useState<Set<string>>(new Set());
  const [viewedBlogs, setViewedBlogs] = useState<Set<string>>(new Set());

  const navigate = useNavigate();

  // Categories for blogs
  const categories = [
    { id: 'all', name: 'All Categories', icon: '📚' },
    { id: 'typing-tips', name: 'Typing Tips', icon: '⌨️' },
    { id: 'exam-prep', name: 'Exam Preparation', icon: '📖' },
    { id: 'success-stories', name: 'Success Stories', icon: '🏆' },
    { id: 'speed-techniques', name: 'Speed Techniques', icon: '⚡' },
    { id: 'practice-exercises', name: 'Practice Exercises', icon: '🎯' }
  ];

  // Sort options
  const sortOptions = [
    { id: 'latest', name: 'Latest First', icon: '🕒' },
    { id: 'popular', name: 'Most Popular', icon: '🔥' },
    { id: 'most-read', name: 'Most Read', icon: '👁️' }
  ];

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (!observerTarget) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreBlogs();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerTarget);
    return () => observer.disconnect();
  }, [observerTarget, hasMore, loading]);

  // Filter and sort blogs
  useEffect(() => {
    let filtered = [...blogs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }

    // Sort blogs
    switch (sortBy) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'most-read':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      default:
        break;
    }

    setFilteredBlogs(filtered);
    setCurrentPage(1);
    setHasMore(filtered.length > blogsPerPage);
  }, [blogs, searchTerm, selectedCategory, sortBy, blogsPerPage]);

  const fetchBlogs = async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    try {
      const apiUrl = `${API_CONFIG.BASE_URL}/blogs`;
      const res = await axios.get(apiUrl, {
        timeout: 15000,
        headers: { 'Content-Type': 'application/json' }
      });
      
      const blogsWithDefaults = res.data.map((blog: Blog) => ({
        ...blog,
        category: blog.category || 'typing-tips',
        tags: blog.tags || ['typing', 'practice'],
        readTime: blog.readTime || Math.ceil(blog.content.split(' ').length / 200),
        views: blog.views || 0,
        likes: blog.likes || 0
      }));
      
      setBlogs(blogsWithDefaults);
    } catch (err: any) {
      console.error('Error fetching blogs:', err);
      
      if (err.response?.status === 429) {
        setError('Too many requests. Please wait a moment and try again.');
        setTimeout(() => {
          if (!loading) fetchBlogs();
        }, 5000);
        return;
      }
      
      if (err.response) {
        setError(`Server error: ${err.response.status} - ${err.response.data?.message || 'Unknown error'}`);
      } else if (err.request) {
        setError('No response from server. Please check your internet connection.');
      } else {
        setError(`Request error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMoreBlogs = useCallback(() => {
    if (loading || !hasMore) return;
    setCurrentPage(prev => prev + 1);
    setHasMore(filteredBlogs.length > currentPage * blogsPerPage);
  }, [loading, hasMore, filteredBlogs.length, currentPage, blogsPerPage]);

  const toggleBlogExpansion = (blogId: string) => {
    setExpandedBlogs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(blogId)) {
        newSet.delete(blogId);
      } else {
        newSet.add(blogId);
      }
      return newSet;
    });
  };

  const truncateContent = (content: string, maxLines: number = 6): string => {
    const estimatedCharsPerLine = 80;
    const maxChars = maxLines * estimatedCharsPerLine;
    
    if (content.length <= maxChars) return content;
    
    let truncated = content.substring(0, maxChars);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    if (lastSpaceIndex > 0) {
      truncated = truncated.substring(0, lastSpaceIndex);
    }
    
    return truncated + '...';
  };

  const isContentTruncated = (content: string, maxLines: number = 6): boolean => {
    const estimatedCharsPerLine = 80;
    const maxChars = maxLines * estimatedCharsPerLine;
    return content.length > maxChars;
  };

  // Share functionality
  const shareBlog = (blog: Blog, platform: string) => {
    const url = `${window.location.origin}/blog/${blog._id}`;
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

  // Copy link functionality
  const copyBlogLink = async (blog: Blog) => {
    try {
      const blogUrl = `${window.location.origin}/blog/${blog._id}`;
      await navigator.clipboard.writeText(blogUrl);
      
      setCopiedBlogId(blog._id);
      setTimeout(() => setCopiedBlogId(null), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = `${window.location.origin}/blog/${blog._id}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setCopiedBlogId(blog._id);
      setTimeout(() => setCopiedBlogId(null), 2000);
    }
  };

  // Track blog view
  const trackBlogView = async (blogId: string) => {
    if (viewedBlogs.has(blogId)) return;
    
    try {
      const apiUrl = `${API_CONFIG.BASE_URL}/blogs/${blogId}/view`;
      await axios.post(apiUrl, {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      });
      
      setViewedBlogs(prev => new Set(prev).add(blogId));
      await refreshBlogStats(blogId);
    } catch (err) {
      console.error('Error tracking blog view:', err);
    }
  };

  // Refresh blog stats from database
  const refreshBlogStats = async (blogId: string) => {
    try {
      const apiUrl = `${API_CONFIG.BASE_URL}/blogs/${blogId}/stats`;
      const response = await axios.get(apiUrl);
      const { views, likes } = response.data;
      
      setBlogs(prev => prev.map(blog => 
        blog._id === blogId ? { ...blog, views, likes } : blog
      ));
      
      setFilteredBlogs(prev => prev.map(blog => 
        blog._id === blogId ? { ...blog, views, likes } : blog
      ));
    } catch (err) {
      console.error('Error refreshing blog stats:', err);
    }
  };

  // Toggle blog like
  const toggleBlogLike = async (blogId: string) => {
    try {
      const isLiked = likedBlogs.has(blogId);
      const apiUrl = `${API_CONFIG.BASE_URL}/blogs/${blogId}/like`;
      
      await axios.post(apiUrl, {
        action: isLiked ? 'unlike' : 'like',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
      
      if (isLiked) {
        setLikedBlogs(prev => {
          const newSet = new Set(prev);
          newSet.delete(blogId);
          return newSet;
        });
      } else {
        setLikedBlogs(prev => new Set(prev).add(blogId));
      }
      
      await refreshBlogStats(blogId);
    } catch (err) {
      console.error('Error toggling blog like:', err);
    }
  };

  // Load user's liked blogs from localStorage
  useEffect(() => {
    const savedLikedBlogs = localStorage.getItem('likedBlogs');
    if (savedLikedBlogs) {
      try {
        const parsed = JSON.parse(savedLikedBlogs);
        setLikedBlogs(new Set(parsed));
      } catch (err) {
        console.error('Error parsing liked blogs from localStorage:', err);
      }
    }
  }, []);

  // Track views for all blogs when loaded
  useEffect(() => {
    if (blogs.length > 0) {
      blogs.forEach(blog => trackBlogView(blog._id));
    }
  }, [blogs]);

  // Save liked blogs to localStorage
  useEffect(() => {
    localStorage.setItem('likedBlogs', JSON.stringify(Array.from(likedBlogs)));
  }, [likedBlogs]);

  // Get related blogs
  const getRelatedBlogs = (currentBlog: Blog) => {
    return blogs
      .filter(blog => blog._id !== currentBlog._id && blog.category === currentBlog.category)
      .slice(0, 3);
  };

  // Current blogs to display (for infinite scroll)
  const currentBlogs = filteredBlogs.slice(0, currentPage * blogsPerPage);

  return (
    <main className="main-content blog-page">
      <Helmet>
        <title>Blog - TypingHub.in 📚</title>
        <meta name="description" content="Explore expert guides, tutorials, and success stories about typing skills, exam preparation, and professional development." />
        <meta name="keywords" content="typing tutorials, typing guides, exam preparation, typing success stories" />
      </Helmet>

      <div className="blog-hero-section">
        <div className="blog-hero-content">
          <h1>TypingHub Learning Center 📚</h1>
          <p>Explore expert guides, comprehensive tutorials, and success stories to master typing and excel in your career.</p>
        </div>
      </div>

      <div className="blog-main-content">
        {/* Search and Filter Section */}
        <div className="blog-controls">
          <div className="search-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
            </div>
          </div>
          
          <div className="filter-section">
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                </button>
              ))}
            </div>
            
            <div className="sort-section">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.icon} {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="blog-sections">
          {loading && currentPage === 1 && <p>Loading blogs...</p>}
          {error && (
            <div className="error-message">
              <strong>Error loading blogs:</strong> {error}
              <button onClick={fetchBlogs} className="retry-btn">Retry</button>
            </div>
          )}
          
          {currentBlogs.map(blog => (
              <div key={blog._id} className="blog-card">
              {blog.image && (
                <div className="blog-image-container">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="blog-image"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="blog-content-container">
                <div className="blog-header">
                  <div className="blog-meta-top">
                    <span className="blog-category">{blog.category?.replace('-', ' ').toUpperCase()}</span>
                    <span className="blog-read-time">
                      <FontAwesomeIcon icon={faClock} /> {blog.readTime} min read
                    </span>
                  </div>
                  <h3 
                    className="blog-title clickable"
                    onClick={() => navigate(`/blog/${blog._id}`)}
                    title="Click to read full blog"
                  >
                    {blog.title}
                  </h3>
                  <div className="blog-meta-info">
                    <div className="blog-author">
                      <FontAwesomeIcon icon={faUser} className="author-avatar" />
                      <span className="author-name">TypingHub</span>
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
                
                <div className="blog-content-text">
                  {expandedBlogs.has(blog._id) ? (
                    <div className="expanded-content">
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
                                <h4 className="content-header">{paragraph.trim()}</h4>
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
                  ) : (
                    <p>{truncateContent(blog.content)}</p>
                  )}
                </div>
                
                <div className="blog-tags">
                  {blog.tags?.map((tag, index) => (
                    <span key={index} className="blog-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className="blog-actions">
                  <div className="blog-actions-left">
                    {isContentTruncated(blog.content) && (
                      <button 
                        className="read-more-btn"
                        onClick={() => toggleBlogExpansion(blog._id)}
                      >
                        {expandedBlogs.has(blog._id) ? 'Show Less' : 'Read More'}
                        <FontAwesomeIcon 
                          icon={expandedBlogs.has(blog._id) ? faChevronUp : faChevronDown} 
                          className="btn-icon" 
                        />
                      </button>
                    )}
                  </div>
                  
                  <div className="blog-actions-right">
                    <div className="blog-stats">
                      <div className="blog-stat">
                        <FontAwesomeIcon icon={faEye} className="stat-icon" />
                        <span>{blog.views?.toLocaleString() || 0}</span>
                      </div>
                      <button 
                        className={`like-btn ${likedBlogs.has(blog._id) ? 'liked' : ''}`}
                        onClick={() => toggleBlogLike(blog._id)}
                        title={likedBlogs.has(blog._id) ? 'Unlike' : 'Like'}
                      >
                        <FontAwesomeIcon icon={faHeart} className="like-icon" />
                        <span className="like-count">{blog.likes || 0}</span>
                      </button>
                    </div>
                    
                    {/* Share Buttons */}
                    <div className="share-section">
                      <span className="share-label">Share:</span>
                      <div className="share-buttons">
                        <button 
                          className="share-btn whatsapp"
                          onClick={() => shareBlog(blog, 'whatsapp')}
                          title="Share on WhatsApp"
                        >
                          <FontAwesomeIcon icon={faWhatsapp} />
                        </button>
                        <button 
                          className="share-btn facebook"
                          onClick={() => shareBlog(blog, 'facebook')}
                          title="Share on Facebook"
                        >
                          <FontAwesomeIcon icon={faFacebook} />
                        </button>
                        <button 
                          className="share-btn twitter"
                          onClick={() => shareBlog(blog, 'twitter')}
                          title="Share on Twitter"
                        >
                          <FontAwesomeIcon icon={faTwitter} />
                        </button>
                        <button 
                          className="share-btn telegram"
                          onClick={() => shareBlog(blog, 'telegram')}
                          title="Share on Telegram"
                        >
                          <FontAwesomeIcon icon={faTelegram} />
                        </button>
                      </div>
                      
                      {/* Copy Link Button */}
                      <button 
                        className={`copy-link-btn ${copiedBlogId === blog._id ? 'copied' : ''}`}
                        onClick={() => copyBlogLink(blog)}
                        title={copiedBlogId === blog._id ? 'Link Copied!' : 'Copy Link'}
                      >
                        <FontAwesomeIcon 
                          icon={copiedBlogId === blog._id ? faCheck : faCopy} 
                        />
                        <span className="copy-text">
                          {copiedBlogId === blog._id ? 'Copied!' : 'Copy'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Related Blogs */}
                {expandedBlogs.has(blog._id) && (
                  <div className="related-blogs">
                    <h4 className="related-title">Related Articles</h4>
                    <div className="related-blogs-grid">
                      {getRelatedBlogs(blog).map(relatedBlog => (
                        <div key={relatedBlog._id} className="related-blog-card">
                          {relatedBlog.image && (
                            <img 
                              src={relatedBlog.image} 
                              alt={relatedBlog.title} 
                              className="related-blog-image"
                              loading="lazy"
                            />
                          )}
                          <div className="related-blog-content">
                            <h5 className="related-blog-title clickable" onClick={() => navigate(`/blog/${relatedBlog._id}`)}>
                              {relatedBlog.title}
                            </h5>
                            <span className="related-blog-category">{relatedBlog.category}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                </div>
              </div>
                ))}
          
          {currentBlogs.length === 0 && !loading && !error && (
            <div className="no-blogs">
              <p>No blogs found matching your criteria.</p>
              <button onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSortBy('latest');
              }} className="reset-filters-btn">
                Reset Filters
              </button>
            </div>
          )}
        </div>
        
        {/* Infinite Scroll Observer */}
        {hasMore && (
          <div 
            ref={setObserverTarget}
            className="infinite-scroll-observer"
          >
            {loading && <p>Loading more blogs...</p>}
          </div>
        )}
    </div>
    </main>
  );
};

export default Blog; 