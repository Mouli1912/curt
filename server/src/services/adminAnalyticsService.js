/**
 * Admin Market Analytics Service for SkillPath
 * Generates non-personally-identifiable aggregate metrics on talent supply, credential issuance,
 * skill demand trends across roles, and readiness distributions.
 */

const { getSkillGraph, generateGapReport } = require('./gapService');
const { usersStore } = require('./userService');
const { getAdminMetrics } = require('./eloService');

/**
 * Aggregates market demand trends and readiness analytics across the platform
 */
function getAdminAnalytics() {
  const roles = ['frontend-developer', 'backend-developer', 'data-analyst'];
  const skillDemandMap = new Map();

  // 1. Aggregate demandScores across all role taxonomies
  for (const role of roles) {
    const graph = getSkillGraph(role);
    const nodes = graph.nodes || [];
    for (const node of nodes) {
      const existing = skillDemandMap.get(node.id) || {
        id: node.id,
        label: node.label || node.id,
        category: node.category || 'General',
        totalDemandScore: 0,
        roleCount: 0
      };
      existing.totalDemandScore += (node.demandScore || 0);
      existing.roleCount += 1;
      skillDemandMap.set(node.id, existing);
    }
  }

  // Sort top in-demand skills platform-wide
  const topInDemandSkills = Array.from(skillDemandMap.values())
    .map(s => ({
      id: s.id,
      label: s.label,
      category: s.category,
      avgDemandScore: parseFloat((s.totalDemandScore / s.roleCount).toFixed(2)),
      marketDemandPercent: Math.round((s.totalDemandScore / s.roleCount) * 100)
    }))
    .sort((a, b) => b.avgDemandScore - a.avgDemandScore)
    .slice(0, 10);

  // 2. Aggregate learner count & readiness distribution
  const learners = Array.from(usersStore.values()).filter(u => u.role === 'learner');
  const recruiters = Array.from(usersStore.values()).filter(u => u.role === 'recruiter');

  let tierFresh = 0;   // 0 - 39%
  let tierMid = 0;     // 40 - 79%
  let tierPro = 0;     // 80 - 100%

  for (const learner of learners) {
    const report = generateGapReport(learner.userId, learner.targetRole);
    const percent = report.readinessPercent || 0;
    if (percent >= 80) tierPro++;
    else if (percent >= 40) tierMid++;
    else tierFresh++;
  }

  const eloAdminMetrics = getAdminMetrics();

  return {
    timestamp: new Date().toISOString(),
    overview: {
      totalUsers: usersStore.size,
      totalLearners: learners.length,
      totalRecruiters: recruiters.length,
      totalSessions: eloAdminMetrics.totalSessions || 0,
      totalQuestionsAnswered: eloAdminMetrics.totalQuestionsAnswered || 0,
      completionRate: eloAdminMetrics.completionRate || 0
    },
    readinessDistribution: {
      freshLearnersCount: tierFresh, // 0 - 39%
      midLearnersCount: tierMid,     // 40 - 79%
      proLearnersCount: tierPro,     // 80 - 100%
      freshPercent: learners.length > 0 ? Math.round((tierFresh / learners.length) * 100) : 0,
      midPercent: learners.length > 0 ? Math.round((tierMid / learners.length) * 100) : 0,
      proPercent: learners.length > 0 ? Math.round((tierPro / learners.length) * 100) : 0
    },
    topInDemandSkills,
    calibrationHealth: eloAdminMetrics.calibrationHealth
  };
}

module.exports = {
  getAdminAnalytics
};
