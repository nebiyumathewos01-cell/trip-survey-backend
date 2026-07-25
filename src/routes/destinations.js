const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');

// GET /api/destinations
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find({ isCustom: false }).sort({ createdAt: 1 });
    res.json({ success: true, data: destinations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
