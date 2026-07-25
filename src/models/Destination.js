const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    distance: { type: String, required: true },
    estimatedPrice: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    highlights: [{ type: String }],
    image: { type: String, required: true },
    images: [{ type: String }],
    isCustom: { type: Boolean, default: false },
    isNotInterested: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Destination', destinationSchema);
