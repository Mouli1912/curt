const express = require('express');
const router = express.Router();
const { handleGetPublicProfile, handleSetDiscoverability } = require('../controllers/userController');

// GET /api/profile/:username
router.get('/:username', handleGetPublicProfile);

// POST /api/profile/discoverability
router.post('/discoverability', handleSetDiscoverability);

module.exports = router;
