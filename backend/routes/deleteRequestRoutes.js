const express = require('express');
const router = express.Router();
const deleteRequestController = require('../controllers/deleteRequestController');
const adminAuthMiddleware = require('../middleware/authMiddleware');

// Create a new delete request
router.post('/', adminAuthMiddleware, deleteRequestController.createDeleteRequest);

// Get all delete requests
router.get('/', adminAuthMiddleware, deleteRequestController.getDeleteRequests);

// Approve a delete request
router.put('/:requestId/approve', adminAuthMiddleware, deleteRequestController.approveDeleteRequest);

// Reject a delete request
router.put('/:requestId/reject', adminAuthMiddleware, deleteRequestController.rejectDeleteRequest);

module.exports = router; 