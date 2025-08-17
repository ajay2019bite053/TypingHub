const express = require('express');
const router = express.Router();
const LiveExam = require('../models/LiveExam');
const { verifyAdmin } = require('../middleware/authMiddleware');

// Get all live exams (public)
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const exams = await LiveExam.find({ isLive: true }).sort({ date: 1 });
    // Filter by time window if startTime and endTime are set
    const filtered = exams.filter(exam => {
      if (!exam.startTime || !exam.endTime) return true;
      // Parse 'HH:mm' format
      const [startH, startM] = exam.startTime.split(':').map(Number);
      const [endH, endM] = exam.endTime.split(':').map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;
      return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    });
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all exams for admin (both live and stopped)
router.get('/admin', verifyAdmin, async (req, res) => {
  try {
    const exams = await LiveExam.find().sort({ date: -1, createdAt: -1 });
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
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { name, date, isLive, joinLink, passage, timeLimit, startTime, endTime } = req.body;
    if (!name || !date || !joinLink || !passage || !timeLimit) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const exam = new LiveExam({ name, date, isLive, joinLink, passage, timeLimit, startTime, endTime });
    await exam.save();
    res.status(201).json(exam);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
});

// Update a live exam (admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { name, date, isLive, joinLink, passage, timeLimit, startTime, endTime } = req.body;
    if (!name || !date || !joinLink || !passage || !timeLimit) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const exam = await LiveExam.findByIdAndUpdate(
      req.params.id,
      { name, date, isLive, joinLink, passage, timeLimit, startTime, endTime },
      { new: true }
    );
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json(exam);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
});

// Delete a live exam (admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const exam = await LiveExam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json({ message: 'Exam deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 