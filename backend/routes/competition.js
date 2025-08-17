const express = require('express');
const router = express.Router();
const {
  getCompetitionStatus,
  registerForCompetition,
  joinCompetition,
  submitCompetitionResult,
  getPublicResults,
  getAllRegistrations,
  getCompetitionResults,
  updateCompetitionSettings,
  deleteAllRegistrations,
  deleteAllResults,
  publishResults,
  unpublishResults,
  downloadResultsPDF
} = require('../controllers/competitionController');
const { verifyAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/status', getCompetitionStatus);
router.get('/public-results', getPublicResults);
router.post('/register', registerForCompetition);
router.post('/join', joinCompetition);
router.post('/submit-result', submitCompetitionResult);

// Admin routes (protected)
router.get('/admin/registrations', verifyAdmin, getAllRegistrations);
router.get('/admin/results', verifyAdmin, getCompetitionResults);
router.put('/admin/settings', verifyAdmin, updateCompetitionSettings);
router.delete('/admin/registrations', verifyAdmin, deleteAllRegistrations);
router.delete('/admin/results', verifyAdmin, deleteAllResults);
router.post('/admin/publish-results', verifyAdmin, publishResults);
router.post('/admin/unpublish-results', verifyAdmin, unpublishResults);
router.get('/admin/download-results', verifyAdmin, downloadResultsPDF);

module.exports = router;







