const express = require('express');
const router = express.Router();
const { handleSearchLearners, handleBulkVerify } = require('../controllers/recruiterController');
const { createRateLimiter } = require('../middleware/rateLimiter');

const searchRateLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 30 });
const bulkVerifyRateLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 20 });

// GET /api/recruiters/search?skill=X&role=Y
router.get('/search', searchRateLimiter, handleSearchLearners);

// POST /api/recruiters/bulk-verify
router.post('/bulk-verify', bulkVerifyRateLimiter, handleBulkVerify);

module.exports = router;
