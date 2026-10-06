const express = require('express');
const router = express.Router();
const { handleGetAdminMetrics, handleGetAdminAnalytics, handleGetIntegrityReport, handleGetCalibration } = require('../controllers/adminController');

// GET /api/admin/metrics
router.get('/metrics', handleGetAdminMetrics);

// GET /api/admin/analytics
router.get('/analytics', handleGetAdminAnalytics);

// GET /api/admin/integrity
router.get('/integrity', handleGetIntegrityReport);

// GET /api/admin/calibration
router.get('/calibration', handleGetCalibration);

module.exports = router;
