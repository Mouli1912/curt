const { startSession, submitAnswer, getAssessmentStatus } = require('../services/eloService');

/**
 * Starts a new assessment session
 * POST /api/assessment/start
 * Body: { userId, targetRole }
 */
const handleStartAssessment = async (req, res) => {
  try {
    const { userId = 'pro-user', targetRole = 'frontend-developer', role } = req.body || {};
    const selectedRole = targetRole || role || 'frontend-developer';
    const sessionData = startSession(userId, selectedRole);
    return res.status(200).json(sessionData);
  } catch (error) {
    console.error('[AssessmentController Start Error]:', error);
    return res.status(500).json({ error: 'Failed to start assessment session' });
  }
};

/**
 * Submits answer and returns Elo update + next question
 * POST /api/assessment/answer
 * Body: { userId, questionId, selectedIndex } (or sessionId, selectedOption)
 */
const handleSubmitAnswer = async (req, res) => {
  try {
    const { userId, sessionId, questionId, selectedIndex, selectedOption } = req.body || {};
    const identifier = userId || sessionId;
    const index = selectedIndex !== undefined ? selectedIndex : selectedOption;

    if (!identifier || !questionId || index === undefined || index === null) {
      return res.status(400).json({
        error: 'Missing required body parameters. Must provide userId (or sessionId), questionId, and selectedIndex.'
      });
    }

    const numericIndex = Number(index);
    if (isNaN(numericIndex) || numericIndex < 0 || numericIndex > 3) {
      return res.status(400).json({ error: 'selectedIndex must be an integer between 0 and 3.' });
    }

    const result = submitAnswer(identifier, questionId, numericIndex);
    return res.status(200).json(result);
  } catch (error) {
    console.error('[AssessmentController Answer Error]:', error);
    return res.status(400).json({ error: error.message || 'Failed to submit answer' });
  }
};

/**
 * Fetches assessment status for debugging or resuming
 * GET /api/assessment/status/:userId
 */
const handleGetStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId parameter' });
    }
    const status = getAssessmentStatus(userId);
    return res.status(200).json(status);
  } catch (error) {
    console.error('[AssessmentController Status Error]:', error);
    return res.status(500).json({ error: 'Failed to retrieve assessment status' });
  }
};

module.exports = {
  handleStartAssessment,
  handleSubmitAnswer,
  handleGetStatus
};
