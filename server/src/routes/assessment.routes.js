const express = require('express');
const router = express.Router();
const { handleStartAssessment, handleSubmitAnswer, handleGetStatus } = require('../controllers/assessmentController');
const { createRateLimiter } = require('../middleware/rateLimiter');

// Rate limiter middleware for submitting answers (max 30 submissions per minute)
const answerRateLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 30 });

// POST /api/assessment/start
router.post('/start', handleStartAssessment);

// POST /api/assessment/answer (rate limited)
router.post('/answer', answerRateLimiter, handleSubmitAnswer);

// GET /api/assessment/status/:userId
router.get('/status/:userId', handleGetStatus);

module.exports = router;
