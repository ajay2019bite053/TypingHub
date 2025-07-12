const express = require('express');
const router = express.Router();
const LiveExam = require('../models/LiveExam');
const adminAuthMiddleware = require('../middleware/authMiddleware');

// Get all live exams (public)
router.get('/', async (req, res) => {
  try {
    const exams = await LiveExam.find().sort({ date: 1 });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get a single live exam by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const exam = await LiveExam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add a new live exam (admin only)
router.post('/', adminAuthMiddleware, async (req, res) => {
  try {
    const { name, date, isLive, joinLink, passage, timeLimit } = req.body;
    if (!name || !date || !joinLink || !passage || !timeLimit) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const exam = new LiveExam({ name, date, isLive, joinLink, passage, timeLimit });
    await exam.save();
    res.status(201).json(exam);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
});

// Update a live exam (admin only)
router.put('/:id', adminAuthMiddleware, async (req, res) => {
  try {
    const { name, date, isLive, joinLink, passage, timeLimit } = req.body;
    if (!name || !date || !joinLink || !passage || !timeLimit) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const exam = await LiveExam.findByIdAndUpdate(
      req.params.id,
      { name, date, isLive, joinLink, passage, timeLimit },
      { new: true }
    );
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json(exam);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
});

// Delete a live exam (admin only)
router.delete('/:id', adminAuthMiddleware, async (req, res) => {
  try {
    const exam = await LiveExam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json({ message: 'Exam deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 