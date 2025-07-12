const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

// GET all cards
router.get('/', cardController.getAllCards);

// POST create card
router.post('/', cardController.createCard);

// PUT update card
router.put('/:id', cardController.updateCard);

// DELETE card
router.delete('/:id', cardController.deleteCard);

module.exports = router; 