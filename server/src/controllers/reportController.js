const { generateGapReport } = require('../services/gapService');

/**
 * GET /api/report/:userId
 * Returns detailed skill gap analysis, readiness percentage, and topologically sorted learning path
 */
const getGapReport = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId parameter' });
    }
    const reportData = generateGapReport(userId);
    return res.status(200).json(reportData);
  } catch (error) {
    console.error('[ReportController Error]:', error);
    return res.status(500).json({ error: 'Failed to generate gap report' });
  }
};

module.exports = {
  getGapReport
};
