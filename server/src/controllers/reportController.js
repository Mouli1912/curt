/**
 * Report Controller
 * Route handler for generating and returning target role gap reports.
 */

const path = require('path');
const fs = require('fs');
const { getSessionStatus, activeSessions } = require('../services/assessmentService');
const { generateGapReport } = require('../services/gapService');

const skillGraphPath = path.join(__dirname, '../../../data/skill_graph.json');

/**
 * GET /api/report/:userId
 */
function handleGetReport(req, res) {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: 'userId parameter is required.' });
    }

    let skillGraph;
    try {
      skillGraph = JSON.parse(fs.readFileSync(skillGraphPath, 'utf8'));
    } catch (err) {
      console.error('[ReportController] Failed to read skill_graph.json:', err);
      return res.status(500).json({ error: 'Skill graph data unavailable.' });
    }

    // Get active user session or default empty state
    const session = activeSessions.get(userId.trim()) || {
      ratings: {},
      history: []
    };

    const gapReport = generateGapReport(skillGraph, session.ratings, session.history);
    gapReport.userId = userId;

    return res.status(200).json(gapReport);
  } catch (error) {
    console.error('[ReportController] Error generating gap report:', error);
    return res.status(500).json({ error: 'Failed to generate gap report.', details: error.message });
  }
}

module.exports = {
  handleGetReport
};
