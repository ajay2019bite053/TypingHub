const express = require('express');
const router = express.Router();
const {
  getAllPassages,
  getPassageById,
  createPassage,
  updatePassage,
  deletePassage,
  getPassagesByTestType,
  assignPassage,
  unassignPassage,
  bulkImportPassages
} = require('../controllers/passageController');
const adminAuthMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllPassages);
router.get('/test/:testType', getPassagesByTestType);

// Protected routes (admin only)
router.post('/assign', adminAuthMiddleware, assignPassage);
router.post('/unassign', adminAuthMiddleware, unassignPassage);
router.post('/bulk-import', adminAuthMiddleware, bulkImportPassages);
router.post('/', adminAuthMiddleware, createPassage);
router.get('/:id', adminAuthMiddleware, getPassageById);
router.put('/:id', adminAuthMiddleware, updatePassage);
router.delete('/:id', adminAuthMiddleware, deletePassage);

module.exports = router;