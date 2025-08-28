const Product = require('../models/Card');

// Get all products with search, filter, and sort
exports.getAllProducts = async (req, res) => {
  try {
    const { 
      search, 
      category, 
      vendor, 
      sortBy = 'name', 
      sortOrder = 'asc',
      minPrice,
      maxPrice,
      page = 1,
      limit = 20
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (search) {
      filter.$text = { $search: search };
    }
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (vendor) {
      filter.vendor = vendor;
    }
    
    if (minPrice || maxPrice) {
      filter.discountedPrice = {};
      if (minPrice) filter.discountedPrice.$gte = Number(minPrice);
      if (maxPrice) filter.discountedPrice.$lte = Number(maxPrice);
    }

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'price-low':
        sort.discountedPrice = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'price-high':
        sort.discountedPrice = sortOrder === 'desc' ? 1 : -1;
        break;
      case 'discount':
        sort.discountPercentage = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'rating':
        sort.rating = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'newest':
        sort.createdAt = sortOrder === 'desc' ? -1 : 1;
        break;
      default: // name
        sort.title = sortOrder === 'desc' ? -1 : 1;
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalProducts: total,
        hasNext: skip + products.length < total,
        hasPrev: Number(page) > 1
      }
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get product by slug
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ 
      slug: req.params.slug,
      isActive: true 
    }).lean();

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const products = await Product.find({ 
      category,
      isActive: true 
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

    const total = await Product.countDocuments({ 
      category,
      isActive: true 
    });

    res.json({
      products,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalProducts: total
      }
    });
  } catch (err) {
    console.error('Error fetching products by category:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get categories with product counts
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { 
        _id: '$category', 
        count: { $sum: 1 } 
      }},
      { $sort: { count: -1 } }
    ]);

    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create product (Admin only)
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    
    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product:', err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Product with this slug already exists' });
    }
    res.status(400).json({ error: 'Invalid data' });
  }
};

// Update product (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(400).json({ error: 'Invalid data' });
  }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Bulk create products (Admin only)
exports.bulkCreateProducts = async (req, res) => {
  try {
    const { products } = req.body;
    
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'Products must be an array' });
    }

    const createdProducts = await Product.insertMany(products);
    res.status(201).json({
      message: `${createdProducts.length} products created successfully`,
      products: createdProducts
    });
  } catch (err) {
    console.error('Error bulk creating products:', err);
    res.status(400).json({ error: 'Invalid data' });
  }
}; 