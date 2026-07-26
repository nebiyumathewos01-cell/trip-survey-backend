const express = require('express');
const router  = express.Router();
const Student = require('../models/Student');

// GET /api/public/stats — no auth required, shows total votes + leader
router.get('/stats', async (req, res) => {
  try {
    const total = await Student.countDocuments();

    const destStats = await Student.aggregate([
      { $group: { _id: '$destination', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const leading      = destStats[0]?._id      || null;
    const leadingCount = destStats[0]?.count     || 0;

    res.json({ total, leading, leadingCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
