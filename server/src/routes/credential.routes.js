const express = require('express');
const router = express.Router();
const {
  handleIssueCredential,
  handleVerifyCredential,
  handleGetPublicKey,
  handleGetCredential
} = require('../controllers/credentialController');

// GET /api/credential/public-key - Return ECDSA public key for offline verifiers
router.get('/public-key', handleGetPublicKey);

// POST /api/credential/issue - Server-side pass check & mint credential
router.post('/issue', handleIssueCredential);

// POST /api/credential/verify - Verify arbitrary credential object
router.post('/verify', handleVerifyCredential);

// GET /api/credential/:credentialId - Fetch previously issued credential by ID
router.get('/:credentialId', handleGetCredential);

module.exports = router;
