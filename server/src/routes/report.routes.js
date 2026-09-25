const express = require('express');
const router = express.Router();
const { handleGetReport } = require('../controllers/reportController');

// GET /api/report/:userId
router.get('/:userId', handleGetReport);

module.exports = router;
