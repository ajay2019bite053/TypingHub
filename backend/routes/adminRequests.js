const express = require('express');
const router = express.Router();
const adminRequestsController = require('../controllers/adminRequestsController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all admin requests
router.get('/requests', authMiddleware, adminRequestsController.getAdminRequests);

// Approve admin request
router.put('/approve/:id', authMiddleware, adminRequestsController.approveAdmin);

// Reject admin request
router.put('/reject/:id', authMiddleware, adminRequestsController.rejectAdmin);

// Remove an approved admin
router.delete('/remove/:id', authMiddleware, adminRequestsController.removeAdmin);

module.exports = router; 