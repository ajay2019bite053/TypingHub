const express = require('express');
const router = express.Router();
const adminRequestsController = require('../controllers/adminRequestsController');
const { verifyAdmin } = require('../middleware/authMiddleware');

// Get all admin requests
router.get('/', verifyAdmin, adminRequestsController.getAdminRequests);

// Approve admin request
router.put('/approve/:id', verifyAdmin, adminRequestsController.approveAdmin);

// Reject admin request
router.put('/reject/:id', verifyAdmin, adminRequestsController.rejectAdmin);

// Remove an approved admin
router.delete('/remove/:id', verifyAdmin, adminRequestsController.removeAdmin);

module.exports = router; 