const express = require('express');
const router = express.Router();
const { handleStart, handleAnswer, handleStatus } = require('../controllers/assessmentController');
const { answerRateLimiter } = require('../middleware/rateLimiter');

// POST /api/assessment/start - Initialize or reset session
router.post('/start', handleStart);

// POST /api/assessment/answer - Submit an answer (Rate-limited)
router.post('/answer', answerRateLimiter, handleAnswer);

// GET /api/assessment/status/:userId - Check session status
router.get('/status/:userId', handleStatus);

module.exports = router;
