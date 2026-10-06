const { getAdminMetrics, getIntegrityReport, getCalibrationHealth } = require('../services/eloService');
const { getAdminAnalytics } = require('../services/adminAnalyticsService');

/**
 * GET /api/admin/metrics
 * Returns aggregate metrics for sessions and IRT calibration status
 */
const handleGetAdminMetrics = async (req, res) => {
  try {
    const metrics = getAdminMetrics();
    return res.status(200).json(metrics);
  } catch (error) {
    console.error('[AdminController Metrics Error]:', error);
    return res.status(500).json({ error: 'Failed to retrieve admin metrics' });
  }
};

/**
 * GET /api/admin/analytics
 * Returns non-PII aggregate market analytics, skill demand trends, and readiness tiers
 */
const handleGetAdminAnalytics = async (req, res) => {
  try {
    const analytics = getAdminAnalytics();
    return res.status(200).json(analytics);
  } catch (error) {
    console.error('[AdminController Analytics Error]:', error);
    return res.status(500).json({ error: 'Failed to retrieve admin analytics' });
  }
};

/**
 * GET /api/admin/integrity
 * Returns test-taking integrity report (fast answers, tab switches)
 */
const handleGetIntegrityReport = async (req, res) => {
  try {
    const report = getIntegrityReport();
    return res.status(200).json(report);
  } catch (error) {
    console.error('[AdminController Integrity Error]:', error);
    return res.status(500).json({ error: 'Failed to retrieve integrity report' });
  }
};

/**
 * GET /api/admin/calibration
 * Returns item discrimination calibration parameters and health
 */
const handleGetCalibration = async (req, res) => {
  try {
    const calibration = getCalibrationHealth();
    return res.status(200).json(calibration);
  } catch (error) {
    console.error('[AdminController Calibration Error]:', error);
    return res.status(500).json({ error: 'Failed to retrieve calibration metrics' });
  }
};

module.exports = {
  handleGetAdminMetrics,
  handleGetAdminAnalytics,
  handleGetIntegrityReport,
  handleGetCalibration
};
