const {
  issueCredentialForUser,
  verifyCredential,
  revokeCredential,
  getCredentialById,
  getPublicKeyPem
} = require('../services/credentialService');
const { getAuditLogs } = require('../services/auditLogger');

/**
 * Mints and cryptographically signs a credential for an eligible user & skill node
 * POST /api/credential/issue
 * Body: { userId, skillNode }
 */
const handleIssueCredential = async (req, res) => {
  try {
    const { userId = 'pro-user', skillNode } = req.body || {};
    if (!skillNode) {
      return res.status(400).json({ error: 'Missing required body parameter: skillNode.' });
    }

    const credential = issueCredentialForUser(userId, skillNode);
    return res.status(200).json(credential);
  } catch (error) {
    console.error('[CredentialController Issue Error]:', error.message);
    return res.status(400).json({ error: error.message || 'Failed to issue credential' });
  }
};

/**
 * Revokes a credential by ID
 * POST /api/credential/revoke/:credentialId
 * Body: { reason } (or { credentialId, reason })
 */
const handleRevokeCredential = async (req, res) => {
  try {
    const credentialId = req.params.credentialId || req.body?.credentialId;
    const { reason } = req.body || {};

    if (!credentialId) {
      return res.status(400).json({ error: 'Missing credentialId parameter.' });
    }

    const result = revokeCredential(credentialId, reason);
    return res.status(200).json(result);
  } catch (error) {
    console.error('[CredentialController Revoke Error]:', error.message);
    return res.status(400).json({ error: error.message || 'Failed to revoke credential' });
  }
};

/**
 * Cryptographically verifies a credential signature and revocation status
 * POST /api/credential/verify
 * Body: credential object (or { credential })
 */
const handleVerifyCredential = async (req, res) => {
  try {
    const body = req.body || {};
    const credentialObj = body.credential || body;

    const result = verifyCredential(credentialObj);

    if (!result.valid) {
      // SECURITY: Do NOT leak payload when verification fails
      return res.status(200).json({
        valid: false,
        revoked: result.revoked || false,
        revokedAt: result.revokedAt,
        error: result.error || 'Cryptographic verification failed.'
      });
    }

    return res.status(200).json({
      valid: true,
      revoked: false,
      payload: result.payload
    });
  } catch (error) {
    console.error('[CredentialController Verify Error]:', error.message);
    return res.status(200).json({ valid: false, error: 'Verification error' });
  }
};

/**
 * Returns security audit logs for credential events
 * GET /api/credential/audit
 */
const handleGetAuditLogs = async (req, res) => {
  try {
    const logs = getAuditLogs();
    return res.status(200).json({ count: logs.length, auditLogs: logs });
  } catch (error) {
    console.error('[CredentialController Audit Error]:', error.message);
    return res.status(500).json({ error: 'Failed to retrieve audit logs' });
  }
};

/**
 * Fetches previously issued credential by ID
 * GET /api/credential/:credentialId
 */
const handleGetCredential = async (req, res) => {
  try {
    const { credentialId } = req.params;
    if (!credentialId) {
      return res.status(400).json({ error: 'Missing credentialId parameter' });
    }

    const credential = getCredentialById(credentialId);
    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    return res.status(200).json(credential);
  } catch (error) {
    console.error('[CredentialController Get Error]:', error.message);
    return res.status(500).json({ error: 'Failed to retrieve credential' });
  }
};

/**
 * Returns PEM-formatted ECDSA public key for offline independent verification
 * GET /api/credential/public-key
 */
const handleGetPublicKey = async (req, res) => {
  try {
    const publicKey = getPublicKeyPem();
    if (!publicKey) {
      return res.status(500).json({ error: 'Public key not found' });
    }
    return res.status(200).json({ publicKey });
  } catch (error) {
    console.error('[CredentialController Public Key Error]:', error.message);
    return res.status(500).json({ error: 'Failed to retrieve public key' });
  }
};

module.exports = {
  handleIssueCredential,
  handleRevokeCredential,
  handleVerifyCredential,
  handleGetAuditLogs,
  handleGetCredential,
  handleGetPublicKey
};
