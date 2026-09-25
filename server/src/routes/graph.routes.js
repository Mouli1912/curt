const express = require('express');
const router = express.Router();
const { getSkillGraph } = require('../controllers/graphController');

// GET /api/graph/:role
router.get('/:role', getSkillGraph);

module.exports = router;
