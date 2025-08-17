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
const { verifyAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllPassages);
router.get('/test/:testType', getPassagesByTestType);

// Protected routes (admin only)
router.post('/assign', verifyAdmin, assignPassage);
router.post('/unassign', verifyAdmin, unassignPassage);
router.post('/bulk-import', verifyAdmin, bulkImportPassages);
router.post('/', verifyAdmin, createPassage);
router.get('/:id', verifyAdmin, getPassageById);
router.put('/:id', verifyAdmin, updatePassage);
router.delete('/:id', verifyAdmin, deletePassage);

module.exports = router;