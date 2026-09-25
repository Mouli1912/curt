/**
 * Credential Controller
 * Express route handlers for issuing ECDSA signed credentials and public verification.
 */

const {
  isNodeProvable,
  issueCredential,
  verifyCredential,
  getCredentialById,
  getPublicKey
} = require('../services/credentialService');
const { activeSessions } = require('../services/assessmentService');

/**
 * POST /api/credential/issue
 * Body: { userId, skillNode, studentName? }
 */
function handleIssueCredential(req, res) {
  try {
    const { userId = 'demo-user', skillNode, studentName = 'Demo Student' } = req.body || {};

    if (!skillNode) {
      return res.status(400).json({ error: 'skillNode parameter is required.' });
    }

    // Get active user session to perform server-side pass check
    const session = activeSessions.get(userId.trim());
    if (!session) {
      return res.status(400).json({
        error: `No active session found for user '${userId}'. Please complete assessment questions first.`
      });
    }

    const nodeRating = session.ratings[skillNode] || 1000;
    // Count questions answered for this specific skillNode in history
    const questionCount = session.history.filter(h => h.skillNode === skillNode).length;

    // Server-side validation of pass criteria
    const canMint = isNodeProvable({ rating: nodeRating, questionCount });
    if (!canMint) {
      return res.status(400).json({
        error: `Skill node '${skillNode}' does not meet credential pass criteria.`,
        details: {
          currentRating: nodeRating,
          requiredRating: 1100,
          questionsAnswered: questionCount,
          requiredQuestions: 3
        }
      });
    }

    const credentialObj = issueCredential({
      studentId: userId,
      studentName,
      skillNode,
      score: nodeRating,
      targetRole: session.targetRole || 'frontend-developer'
    });

    return res.status(200).json(credentialObj);
  } catch (error) {
    console.error('[CredentialController] Error issuing credential:', error);
    return res.status(500).json({ error: 'Failed to issue credential.', details: error.message });
  }
}

/**
 * POST /api/credential/verify
 * Body: Full credential JSON object
 */
function handleVerifyCredential(req, res) {
  try {
    const credentialObj = req.body;
    if (!credentialObj || typeof credentialObj !== 'object') {
      return res.status(400).json({ valid: false, error: 'Invalid or missing JSON payload in request body.' });
    }

    const result = verifyCredential(credentialObj);
    return res.status(200).json(result);
  } catch (error) {
    console.error('[CredentialController] Error verifying credential:', error);
    return res.status(200).json({ valid: false, error: error.message });
  }
}

/**
 * GET /api/credential/public-key
 */
function handleGetPublicKey(req, res) {
  try {
    const publicKey = getPublicKey();
    return res.status(200).json({ publicKey, algorithm: 'ECDSA P-256 (SHA-256)' });
  } catch (error) {
    console.error('[CredentialController] Error reading public key:', error);
    return res.status(500).json({ error: 'Public key unavailable.', details: error.message });
  }
}

/**
 * GET /api/credential/:credentialId
 */
function handleGetCredential(req, res) {
  try {
    const { credentialId } = req.params;
    if (!credentialId) {
      return res.status(400).json({ error: 'credentialId parameter is required.' });
    }

    const credential = getCredentialById(credentialId);
    if (!credential) {
      return res.status(404).json({ error: `Credential '${credentialId}' not found.` });
    }

    return res.status(200).json(credential);
  } catch (error) {
    console.error('[CredentialController] Error fetching credential:', error);
    return res.status(500).json({ error: 'Failed to fetch credential.', details: error.message });
  }
}

module.exports = {
  handleIssueCredential,
  handleVerifyCredential,
  handleGetPublicKey,
  handleGetCredential
};
