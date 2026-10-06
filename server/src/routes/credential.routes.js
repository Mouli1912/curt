const express = require('express');
const router = express.Router();
const {
  handleIssueCredential,
  handleRevokeCredential,
  handleVerifyCredential,
  handleGetAuditLogs,
  handleGetCredential,
  handleGetPublicKey
} = require('../controllers/credentialController');
const { createRateLimiter } = require('../middleware/rateLimiter');

const issueRateLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 10 });
const revokeRateLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 10 });
const verifyRateLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 60 });

// GET /api/credential/public-key
router.get('/public-key', handleGetPublicKey);

// GET /api/credential/audit
router.get('/audit', handleGetAuditLogs);

// POST /api/credential/issue
router.post('/issue', issueRateLimiter, handleIssueCredential);

// POST /api/credential/revoke (or /revoke/:credentialId)
router.post('/revoke/:credentialId?', revokeRateLimiter, handleRevokeCredential);

// POST /api/credential/verify
router.post('/verify', verifyRateLimiter, handleVerifyCredential);

// GET /api/credential/:credentialId
router.get('/:credentialId', handleGetCredential);

module.exports = router;
