const {
  issueCredentialForUser,
  verifyCredential,
  getCredentialById,
  getPublicKeyPem
} = require('../services/credentialService');

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
 * Cryptographically verifies a credential signature without needing server DB
 * POST /api/credential/verify
 * Body: credential object (or { credential })
 */
const handleVerifyCredential = async (req, res) => {
  try {
    const body = req.body || {};
    const credentialObj = body.credential || body;

    const result = verifyCredential(credentialObj);

    if (!result.valid) {
      // SECURITY: Never leak payload when verification fails
      return res.status(200).json({
        valid: false,
        error: result.error || 'Cryptographic verification failed.'
      });
    }

    return res.status(200).json({
      valid: true,
      payload: result.payload
    });
  } catch (error) {
    console.error('[CredentialController Verify Error]:', error.message);
    return res.status(200).json({ valid: false, error: 'Verification error' });
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
  handleVerifyCredential,
  handleGetCredential,
  handleGetPublicKey
};
