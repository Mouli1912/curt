const { getPublicProfile, setUserDiscoverability, getUserByIdOrUsername } = require('../services/userService');

/**
 * GET /api/profile/:username
 * Returns public shareable learner profile if discoverable
 */
const handleGetPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ error: 'Missing username parameter.' });
    }

    const profileData = getPublicProfile(username);
    if (!profileData.exists) {
      return res.status(404).json({ error: profileData.error || 'User not found.' });
    }

    if (!profileData.discoverable) {
      return res.status(403).json({
        exists: true,
        discoverable: false,
        error: profileData.error || 'Profile is private or not publicly discoverable.'
      });
    }

    return res.status(200).json(profileData);
  } catch (error) {
    console.error('[UserController Profile Error]:', error.message);
    return res.status(500).json({ error: 'Failed to retrieve public profile.' });
  }
};

/**
 * POST /api/profile/discoverability
 * Toggles user public discoverability setting
 * Body: { userId, isPubliclyDiscoverable }
 */
const handleSetDiscoverability = async (req, res) => {
  try {
    const { userId = 'pro-user', isPubliclyDiscoverable } = req.body || {};
    if (isPubliclyDiscoverable === undefined) {
      return res.status(400).json({ error: 'Missing isPubliclyDiscoverable boolean parameter.' });
    }

    const updatedUser = setUserDiscoverability(userId, isPubliclyDiscoverable);
    return res.status(200).json({
      success: true,
      userId: updatedUser.userId,
      username: updatedUser.username,
      isPubliclyDiscoverable: updatedUser.isPubliclyDiscoverable
    });
  } catch (error) {
    console.error('[UserController Discoverability Error]:', error.message);
    return res.status(400).json({ error: error.message || 'Failed to update discoverability setting.' });
  }
};

module.exports = {
  handleGetPublicProfile,
  handleSetDiscoverability
};
