const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const BlogView = require('../models/BlogView');
const BlogLike = require('../models/BlogLike');
const { verifyAdmin } = require('../middleware/authMiddleware');

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new blog (Admin only)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { title, content, image, category, tags, readTime, author, status } = req.body;
    
    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    const blog = new Blog({
      title,
      content,
      image,
      category: category || 'typing-tips',
      tags: tags || [],
      readTime: readTime || 0,
      author: author || 'TypingHub',
      status: status || 'published'
    });
    
    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update blog (Admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { title, content, image, category, tags, readTime, author, status } = req.body;
    
    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        image,
        category: category || 'typing-tips',
        tags: tags || [],
        readTime: readTime || 0,
        author: author || 'TypingHub',
        status: status || 'published'
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete blog (Admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Also delete related views and likes
    await BlogView.deleteMany({ blogId: req.params.id });
    await BlogLike.deleteMany({ blogId: req.params.id });
    
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Track blog view
router.post('/:id/view', async (req, res) => {
  try {
    const { timestamp, userAgent, referrer } = req.body;
    const blogId = req.params.id;
    
    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Create unique identifier for this view
    const viewIdentifier = `${userAgent}-${req.ip}-${blogId}`;
    
    // Check if this is a unique view (within last 24 hours)
    const existingView = await BlogView.findOne({
      identifier: viewIdentifier,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    
    if (!existingView) {
      // Create new view record
      const blogView = new BlogView({
        blogId,
        identifier: viewIdentifier,
        userAgent,
        referrer,
        ipAddress: req.ip,
        timestamp: new Date(timestamp)
      });
      
      await blogView.save();
      
      // Increment blog view count
      await Blog.findByIdAndUpdate(blogId, { $inc: { views: 1 } });
      
      // Get updated blog
      const updatedBlog = await Blog.findById(blogId);
      
      res.json({ 
        message: 'View tracked successfully',
        views: updatedBlog.views,
        blogId 
      });
    } else {
      // View already exists, just return current count
      const currentBlog = await Blog.findById(blogId);
      res.json({ 
        message: 'View already tracked',
        views: currentBlog.views,
        blogId 
      });
    }
  } catch (err) {
    console.error('Error tracking view:', err);
    res.status(500).json({ message: 'Error tracking view' });
  }
});

// Toggle blog like
router.post('/:id/like', async (req, res) => {
  try {
    const { action, timestamp, userAgent } = req.body;
    const blogId = req.params.id;
    
    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Create unique identifier for this like
    const likeIdentifier = `${userAgent}-${req.ip}-${blogId}`;
    
    if (action === 'like') {
      // Check if already liked
      const existingLike = await BlogLike.findOne({ identifier: likeIdentifier });
      
      if (!existingLike) {
        // Create new like record
        const blogLike = new BlogLike({
          blogId,
          identifier: likeIdentifier,
          userAgent,
          ipAddress: req.ip,
          timestamp: new Date(timestamp)
        });
        
        await blogLike.save();
        
        // Increment blog like count
        await Blog.findByIdAndUpdate(blogId, { $inc: { likes: 1 } });
      }
    } else if (action === 'unlike') {
      // Remove like record
      const deletedLike = await BlogLike.findOneAndDelete({ identifier: likeIdentifier });
      
      if (deletedLike) {
        // Decrement blog like count
        await Blog.findByIdAndUpdate(blogId, { $inc: { likes: -1 } });
      }
    }
    
    // Get updated blog
    const updatedBlog = await Blog.findById(blogId);
    
    res.json({ 
      message: `Blog ${action === 'like' ? 'liked' : 'unliked'} successfully`,
      likes: updatedBlog.likes,
      blogId 
    });
  } catch (err) {
    console.error('Error toggling like:', err);
    res.status(500).json({ message: 'Error toggling like' });
  }
});

// Get blog stats
router.get('/:id/stats', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json({
      blogId: blog._id,
      views: blog.views || 0,
      likes: blog.likes || 0
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blog stats' });
  }
});

module.exports = router; 