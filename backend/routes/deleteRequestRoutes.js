const express = require('express');
const router = express.Router();
const deleteRequestController = require('../controllers/deleteRequestController');
const { verifyAdmin } = require('../middleware/authMiddleware');

// Create delete request
router.post('/', verifyAdmin, deleteRequestController.createDeleteRequest);

// Get all delete requests
router.get('/', verifyAdmin, deleteRequestController.getDeleteRequests);

// Approve delete request
router.put('/:requestId/approve', verifyAdmin, deleteRequestController.approveDeleteRequest);

// Reject delete request
router.put('/:requestId/reject', verifyAdmin, deleteRequestController.rejectDeleteRequest);

module.exports = router; 