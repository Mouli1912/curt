const { searchDiscoverableLearners } = require('../services/userService');
const { bulkVerifyCredentials } = require('../services/credentialService');

/**
 * GET /api/recruiters/search?skill=X&role=Y
 * Searches discoverable learners by proven skill and target role.
 * PRIVACY GUARANTEE: Excludes non-discoverable learners and exposes ONLY proven competencies.
 */
const handleSearchLearners = async (req, res) => {
  try {
    const { skill, role } = req.query || {};
    const learners = searchDiscoverableLearners({ skill, role });
    return res.status(200).json({
      count: learners.length,
      skillFilter: skill || null,
      roleFilter: role || 'all',
      learners
    });
  } catch (error) {
    console.error('[RecruiterController Search Error]:', error.message);
    return res.status(500).json({ error: 'Failed to search candidates.' });
  }
};

/**
 * POST /api/credential/bulk-verify
 * Batch verifies candidate credential IDs or full payload objects
 * Body: { credentialIds: [...] } or { credentials: [...] }
 */
const handleBulkVerify = async (req, res) => {
  try {
    const { credentialIds, credentials, items } = req.body || {};
    const inputList = credentialIds || credentials || items || [];

    if (!Array.isArray(inputList)) {
      return res.status(400).json({ error: 'Must provide an array of credential IDs or credential objects in body.' });
    }

    const summary = bulkVerifyCredentials(inputList);
    return res.status(200).json(summary);
  } catch (error) {
    console.error('[RecruiterController Bulk Verify Error]:', error.message);
    return res.status(400).json({ error: error.message || 'Failed to bulk verify credentials.' });
  }
};

module.exports = {
  handleSearchLearners,
  handleBulkVerify
};
