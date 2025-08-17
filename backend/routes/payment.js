const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create payment order
router.post('/create-order', paymentController.createPaymentOrder);

// Verify payment
router.post('/verify', paymentController.verifyPayment);

// Process competition payment
router.post('/competition', paymentController.processCompetitionPayment);

// Get payment status
router.get('/status/:paymentId', paymentController.getPaymentStatus);

module.exports = router;

