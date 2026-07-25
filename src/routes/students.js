const express = require('express');
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');

const MAX_CHANGES = 3; // 1 initial vote + 2 changes

/* ─── Validation rules ─────────────────────────────────────────────────── */
const voteRules = [
  body('name').trim().notEmpty().withMessage('Full name is required'),
  body('studentId')
    .trim().notEmpty().withMessage('Student ID is required')
    .matches(/^[Ww][Cc][Uu]\d+$/)
    .withMessage('Student ID must be WCU followed by numbers (e.g. WCU170167)'),
  body('section').isIn(['A', 'B']).withMessage('Section must be A or B'),
  body('destination').trim().notEmpty().withMessage('Destination is required'),
  body('reason').trim().notEmpty().withMessage('Reason is required'),
];

/* ─── GET /api/student/:studentId  — check vote status ─────────────────── */
router.get('/:studentId', async (req, res) => {
  try {
    const student = await Student.findOne({
      studentId: req.params.studentId.toUpperCase(),
    });

    if (!student) {
      return res.json({ exists: false });
    }

    const changesLeft = MAX_CHANGES - student.changeCount;

    res.json({
      exists:      true,
      destination: student.destination,
      changeCount: student.changeCount,
      changesLeft,
      locked:      student.changeCount >= MAX_CHANGES,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ─── POST /api/student  — submit or update vote ───────────────────────── */
router.post('/', voteRules, async (req, res) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const {
    name, studentId, section, destination,
    customDestination, customReason, reason,
  } = req.body;

  const upperID = studentId.toUpperCase();

  try {
    const existing = await Student.findOne({ studentId: upperID });

    /* ── New vote ── */
    if (!existing) {
      const student = await Student.create({
        name,
        studentId: upperID,
        section,
        destination,
        customDestination: customDestination || '',
        customReason:      customReason      || '',
        reason,
        changeCount: 0,
      });
      return res.status(201).json({
        success:     true,
        isUpdate:    false,
        changesLeft: MAX_CHANGES - 1, // they still have 2 changes
        message:     'Your vote has been submitted successfully!',
        data:        student,
      });
    }

    /* ── Locked — no changes left ── */
    if (existing.changeCount >= MAX_CHANGES) {
      return res.status(403).json({
        success:  false,
        locked:   true,
        message:  'Your vote is up — you have used all your changes.',
      });
    }

    /* ── Update vote ── */
    existing.name              = name;
    existing.section           = section;
    existing.destination       = destination;
    existing.customDestination = customDestination || '';
    existing.customReason      = customReason      || '';
    existing.reason            = reason;
    existing.changeCount       += 1;

    await existing.save();

    const changesLeft = MAX_CHANGES - existing.changeCount;

    return res.json({
      success:     true,
      isUpdate:    true,
      changesLeft,
      locked:      changesLeft === 0,
      message:     changesLeft === 0
        ? 'Vote updated. This was your final change — your vote is now locked.'
        : `Vote updated successfully. You have ${changesLeft} change${changesLeft === 1 ? '' : 's'} left.`,
      data: existing,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
