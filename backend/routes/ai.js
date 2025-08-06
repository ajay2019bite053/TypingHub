const express = require('express');
const router = express.Router();
const { generateText } = require('../controllers/aiController');

// AI Text Generation Route
router.post('/generate-text', generateText);

module.exports = router; 