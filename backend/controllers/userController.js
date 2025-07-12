const User = require('../models/User');
const Card = require('../models/Card');

// POST /api/users/:userId/purchase
exports.purchaseCourse = async (req, res) => {
  const { userId } = req.params;
  const { courseId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.purchasedCourses) user.purchasedCourses = [];
    if (!user.purchasedCourses.includes(courseId)) {
      user.purchasedCourses.push(courseId);
      await user.save();
    }
    res.json({ message: 'Course purchased' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/users/:userId/purchased-courses
exports.getPurchasedCourses = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate('purchasedCourses');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.purchasedCourses || []);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}; 