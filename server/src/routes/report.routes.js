const express = require('express');
const router = express.Router();
const { getGapReport } = require('../controllers/reportController');

// GET /api/report/:userId
router.get('/:userId', getGapReport);

module.exports = router;
