const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  affiliateUrl: { 
    type: String, 
    required: true,
    trim: true
  },
  vendor: { 
    type: String, 
    required: true,
    enum: ['amazon', 'flipkart', 'meesho', 'other'],
    lowercase: true
  },
  images: [{ 
    type: String,
    required: true
  }],
  originalPrice: { 
    type: Number, 
    required: true,
    min: 0
  },
  discountedPrice: { 
    type: Number, 
    required: true,
    min: 0
  },
  currency: { 
    type: String, 
    default: 'INR',
    uppercase: true
  },
  description: { 
    type: String,
    trim: true
  },
  features: [{ 
    type: String,
    trim: true
  }],
  category: { 
    type: String, 
    required: true,
    enum: ['keyboard', 'mouse', 'furniture', 'electronics', 'books', 'accessories', 'stationery', 'cables', 'lighting', 'audio', 'storage'],
    lowercase: true
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  tags: [{ 
    type: String,
    lowercase: true,
    trim: true
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    min: 0,
    default: 0
  },
  stockStatus: {
    type: String,
    enum: ['in-stock', 'out-of-stock', 'limited'],
    default: 'in-stock'
  },
  // SEO Fields
  metaTitle: {
    type: String,
    trim: true,
    maxlength: 60
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: 160
  },
  keywords: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  // Product Priority/Featured System
  priority: {
    type: Number,
    default: 100,
    min: 1,
    max: 1000
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice > 0) {
    return Math.round(((this.originalPrice - this.discountedPrice) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for savings amount
productSchema.virtual('savings').get(function() {
  return this.originalPrice - this.discountedPrice;
});

// Index for better search performance
productSchema.index({ title: 'text', description: 'text', category: 1 });
productSchema.index({ isActive: 1, category: 1 });

module.exports = mongoose.model('Product', productSchema); 