const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const authMiddleware = require('../middleware/auth');

// GET /api/statistics  (protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const total = await Student.countDocuments();

    // Votes per destination
    const destStats = await Student.aggregate([
      {
        $group: {
          _id: '$destination',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Most popular destination
    const mostPopular = destStats.length > 0 ? destStats[0]._id : 'N/A';

    // Section breakdown
    const sectionStats = await Student.aggregate([
      {
        $group: {
          _id: '$section',
          count: { $sum: 1 },
        },
      },
    ]);

    // Recent 5 responses
    const recent = await Student.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        total,
        mostPopular,
        destinations: destStats,
        sections: sectionStats,
        recent,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
