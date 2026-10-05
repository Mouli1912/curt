const express = require('express');
const router = express.Router();
const {
  handleIssueCredential,
  handleVerifyCredential,
  handleGetCredential,
  handleGetPublicKey
} = require('../controllers/credentialController');

// GET /api/credential/public-key
router.get('/public-key', handleGetPublicKey);

// POST /api/credential/issue
router.post('/issue', handleIssueCredential);

// POST /api/credential/verify
router.post('/verify', handleVerifyCredential);

// GET /api/credential/:credentialId
router.get('/:credentialId', handleGetCredential);

module.exports = router;
