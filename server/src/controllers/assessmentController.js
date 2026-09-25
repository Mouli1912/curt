/**
 * Assessment Controller
 * Express route handlers for starting sessions, answering questions, and checking status.
 */

const { startSession, submitAnswer, getSessionStatus } = require('../services/assessmentService');

/**
 * POST /api/assessment/start
 * Body: { userId?, targetRole? }
 */
function handleStart(req, res) {
  try {
    const { userId = 'demo-user', targetRole = 'frontend-developer' } = req.body || {};
    
    if (typeof userId !== 'string' || userId.trim() === '') {
      return res.status(400).json({ error: 'Invalid userId parameter.' });
    }

    const sessionData = startSession(userId.trim(), targetRole);
    return res.status(200).json(sessionData);
  } catch (error) {
    console.error('[AssessmentController] Error starting session:', error);
    return res.status(500).json({ error: 'Failed to start assessment session.', details: error.message });
  }
}

/**
 * POST /api/assessment/answer
 * Body: { userId, questionId, selectedIndex }
 */
function handleAnswer(req, res) {
  try {
    const { userId = 'demo-user', questionId, selectedIndex } = req.body || {};

    if (!questionId || selectedIndex === undefined || selectedIndex === null) {
      return res.status(400).json({ 
        error: 'Missing required parameters: questionId and selectedIndex must be provided.' 
      });
    }

    const parsedIndex = Number(selectedIndex);
    if (isNaN(parsedIndex) || parsedIndex < 0 || parsedIndex > 3) {
      return res.status(400).json({ error: 'selectedIndex must be a valid option index (0-3).' });
    }

    const result = submitAnswer(userId.trim(), questionId, parsedIndex);
    return res.status(200).json(result);
  } catch (error) {
    console.error('[AssessmentController] Error processing answer:', error);
    return res.status(400).json({ error: error.message });
  }
}

/**
 * GET /api/assessment/status/:userId
 */
function handleStatus(req, res) {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: 'userId parameter is required.' });
    }

    const status = getSessionStatus(userId);
    return res.status(200).json(status);
  } catch (error) {
    console.error('[AssessmentController] Error getting status:', error);
    return res.status(500).json({ error: 'Failed to retrieve assessment status.', details: error.message });
  }
}

module.exports = {
  handleStart,
  handleAnswer,
  handleStatus
};
