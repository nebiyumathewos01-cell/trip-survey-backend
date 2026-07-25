const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    section: { type: String, required: true, enum: ['A', 'B'] },
    destination: { type: String, required: true },
    customDestination: { type: String, default: '' },
    customReason: { type: String, default: '' },
    reason: { type: String, required: true },
    changeCount: { type: Number, default: 0, min: 0, max: 3 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
