const express = require('express');
const router  = express.Router();
const Student = require('../models/Student');

// GET /api/public/stats — no auth, returns all destination vote counts
router.get('/stats', async (req, res) => {
  try {
    const total = await Student.countDocuments();

    // All destinations with vote count, sorted highest first
    const destinations = await Student.aggregate([
      { $group: { _id: '$destination', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const leading      = destinations[0]?._id   || null;
    const leadingCount = destinations[0]?.count  || 0;

    res.json({ total, leading, leadingCount, destinations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
