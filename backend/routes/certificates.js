const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const auth = require('../middleware/auth');

// Generate certificate
router.post('/generate', auth, certificateController.generateCertificate);

// Download certificate
router.get('/download/:certificateId', certificateController.downloadCertificate);

// Verify certificate
router.get('/verify/:verificationCode', certificateController.verifyCertificate);

// Get user certificate
router.get('/user/:userId', certificateController.getUserCertificate);

// List all certificates (admin protected optional). For now public GET.
router.get('/all', certificateController.getAllCertificates);

module.exports = router; 