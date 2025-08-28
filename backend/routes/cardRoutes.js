const express = require('express');
const router = express.Router();
const productController = require('../controllers/cardController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
// GET all products with search, filter, and sort
router.get('/', productController.getAllProducts);

// GET product by slug
router.get('/slug/:slug', productController.getProductBySlug);

// GET products by category
router.get('/category/:category', productController.getProductsByCategory);

// GET categories with product counts
router.get('/categories', productController.getCategories);

// Admin routes (protected)
// POST create product
router.post('/', authMiddleware.requireAuth, authMiddleware.requireAdmin, productController.createProduct);

// PUT update product
router.put('/:id', authMiddleware.requireAuth, authMiddleware.requireAdmin, productController.updateProduct);

// DELETE product
router.delete('/:id', authMiddleware.requireAuth, authMiddleware.requireAdmin, productController.deleteProduct);

// POST bulk create products
router.post('/bulk', authMiddleware.requireAuth, authMiddleware.requireAdmin, productController.bulkCreateProducts);

module.exports = router; 