/**
 * User & Recruiter Ecosystem Service for SkillPath
 * Manages user roles, public discoverability opt-in/out, recruiter searches, and public profiles.
 */

const { generateGapReport, getSkillGraph } = require('./gapService');
const { getCredentialById, userCredentialsMap } = require('./credentialService');

// Seeded users store
const usersStore = new Map([
  ['pro-user', {
    userId: 'pro-user',
    username: 'surajbhan',
    name: 'Suraj Bhan Kumar',
    role: 'learner',
    targetRole: 'frontend-developer',
    isPubliclyDiscoverable: true,
    bio: 'Senior Frontend Engineer specializing in React, TypeScript, and Web Architecture.',
    joinedAt: '2026-01-15T08:00:00.000Z'
  }],
  ['mid-user', {
    userId: 'mid-user',
    username: 'alexrivers',
    name: 'Alex Rivers',
    role: 'learner',
    targetRole: 'frontend-developer',
    isPubliclyDiscoverable: true,
    bio: 'Mid-level web developer scaling frontend competencies.',
    joinedAt: '2026-02-10T10:30:00.000Z'
  }],
  ['fresh-user', {
    userId: 'fresh-user',
    username: 'morganlee',
    name: 'Morgan Lee',
    role: 'learner',
    targetRole: 'frontend-developer',
    isPubliclyDiscoverable: false, // Default opt-out for fresh learners
    bio: 'Aspiring software developer learning core foundations.',
    joinedAt: '2026-03-01T14:15:00.000Z'
  }],
  ['recruiter-user', {
    userId: 'recruiter-user',
    username: 'sarah-recruiter',
    name: 'Sarah Jenkins',
    role: 'recruiter',
    company: 'TechTalent Global',
    targetRole: 'all',
    isPubliclyDiscoverable: false,
    bio: 'Lead Technical Recruiter matching verified talent with top tech companies.',
    joinedAt: '2026-01-01T09:00:00.000Z'
  }]
]);

/**
 * Retrieves user profile by userId or username
 */
function getUserByIdOrUsername(identifier) {
  if (!identifier) return null;
  if (usersStore.has(identifier)) return usersStore.get(identifier);

  for (const user of usersStore.values()) {
    if (user.username === identifier) return user;
  }
  return null;
}

/**
 * Updates user discoverability setting
 */
function setUserDiscoverability(userId, isPubliclyDiscoverable) {
  const user = usersStore.get(userId);
  if (!user) {
    throw new Error(`User ${userId} not found.`);
  }
  user.isPubliclyDiscoverable = Boolean(isPubliclyDiscoverable);
  return user;
}

/**
 * Recruiter Search Endpoint Logic
 * Searches discoverable learners by proven skill and target role.
 * 
 * PRIVACY GUARANTEE:
 * Returns ONLY learners with isPubliclyDiscoverable === true.
 * Exposes ONLY proven skills/credentials. NEVER exposes raw un-stabilized scores or in-progress gap data!
 */
function searchDiscoverableLearners({ skill, role }) {
  const results = [];

  for (const user of usersStore.values()) {
    // 1. Must be a learner role
    if (user.role !== 'learner') continue;

    // 2. PRIVACY CHECK: Must be explicitly publicly discoverable
    if (!user.isPubliclyDiscoverable) continue;

    // 3. Match role if requested
    if (role && role !== 'all' && user.targetRole !== role) continue;

    // 4. Retrieve gap report for user to extract proven skills
    const report = generateGapReport(user.userId, user.targetRole);
    const provenNodes = report.provenNodes || [];

    // Extract proven skill IDs & labels
    const provenSkills = provenNodes.map(n => ({
      id: n.id,
      label: n.label || n.id,
      category: n.category || 'General',
      currentRating: n.currentRating
    }));

    // 5. Match skill filter if requested
    if (skill && skill.trim().length > 0) {
      const targetSkill = skill.trim().toLowerCase();
      const hasSkill = provenSkills.some(s => s.id.toLowerCase() === targetSkill || s.label.toLowerCase().includes(targetSkill));
      if (!hasSkill) continue;
    }

    results.push({
      userId: user.userId,
      username: user.username,
      name: user.name,
      targetRole: user.targetRole,
      readinessPercent: report.readinessPercent,
      provenSkillCount: provenSkills.length,
      provenSkills
    });
  }

  return results;
}

/**
 * Public Shareable Profile Data Generator
 * Returns public profile if user is discoverable.
 */
function getPublicProfile(identifier) {
  const user = getUserByIdOrUsername(identifier);
  if (!user) {
    return { exists: false, error: 'User profile not found.' };
  }

  if (!user.isPubliclyDiscoverable) {
    return {
      exists: true,
      discoverable: false,
      userId: user.userId,
      username: user.username,
      error: 'This profile is private or not publicly discoverable.'
    };
  }

  const report = generateGapReport(user.userId, user.targetRole);
  const provenNodes = report.provenNodes || [];

  const provenSkills = provenNodes.map(n => ({
    id: n.id,
    label: n.label || n.id,
    category: n.category || 'General'
  }));

  return {
    exists: true,
    discoverable: true,
    user: {
      userId: user.userId,
      username: user.username,
      name: user.name,
      targetRole: user.targetRole,
      bio: user.bio,
      joinedAt: user.joinedAt
    },
    readinessPercent: report.readinessPercent,
    provenSkills
  };
}

module.exports = {
  usersStore,
  getUserByIdOrUsername,
  setUserDiscoverability,
  searchDiscoverableLearners,
  getPublicProfile
};
