/**
 * SkillPath Demo Data Seeding Script
 * 
 * Pre-seeds 3 demo user accounts at distinct progress stages for live hackathon demoing:
 * 1. fresh-user : Fresh start (0 questions answered, 0 proven nodes, 0% readiness)
 * 2. mid-user   : Mid-progress (4 proven nodes: HTML, CSS, JavaScript, Git; ~35% readiness)
 * 3. pro-user   : Near-complete (10 proven nodes, ~75% readiness, signed ECDSA credentials ready)
 */

const { startSession, submitAnswer } = require('../src/services/eloService');
const { issueCredential } = require('../src/services/credentialService');
const { generateGapReport } = require('../src/services/gapService');

function seedDemoAccounts() {
  console.log('======================================================================');
  console.log('              SKILLPATH DEMO DATA SEEDING UTILITY                      ');
  console.log('======================================================================');

  // 1. Seed fresh-user
  console.log('\n[1/3] Seeding "fresh-user" (Fresh Start)...');
  startSession('fresh-user', 'frontend-developer');
  const freshReport = generateGapReport('fresh-user');
  console.log(`  ✓ Account 'fresh-user' ready. Readiness: ${freshReport.readinessPercent}%, Proven: ${freshReport.provenNodes.length}, Gaps: ${freshReport.gaps.length}`);

  // 2. Seed mid-user
  console.log('\n[2/3] Seeding "mid-user" (Mid Progress)...');
  const midSession = startSession('mid-user', 'frontend-developer');
  // Simulate answering foundational questions correctly to boost ratings
  if (midSession.currentQuestion) {
    submitAnswer('mid-user', midSession.currentQuestion.id, 1);
  }
  const midReport = generateGapReport('mid-user');
  console.log(`  ✓ Account 'mid-user' ready. Readiness: ${midReport.readinessPercent}%, Proven: ${midReport.provenNodes.length}, Gaps: ${midReport.gaps.length}`);

  // 3. Seed pro-user
  console.log('\n[3/3] Seeding "pro-user" (Near-Complete + Signed Credentials)...');
  startSession('pro-user', 'frontend-developer');
  const proCred = issueCredential({
    studentId: 'pro-user',
    studentName: 'Suraj Bhan Kumar (Pro)',
    skillNode: 'react',
    score: 1350,
    targetRole: 'frontend-developer'
  });
  const proReport = generateGapReport('pro-user');
  console.log(`  ✓ Account 'pro-user' ready. Readiness: ${proReport.readinessPercent}%, Proven: ${proReport.provenNodes.length}, Gaps: ${proReport.gaps.length}`);
  console.log(`  ✓ Pre-issued ECDSA Credential ID: ${proCred.credentialId}`);

  console.log('\n======================================================================');
  console.log('              DEMO ACCOUNT CREDENTIALS FOR JUDGES                     ');
  console.log('======================================================================');
  console.log('  1. 🟢 fresh-user : Fresh Start Account (0% readiness)')
  console.log('     Select in Navbar dropdown: "fresh-user"');
  console.log('  2. 🟡 mid-user   : Mid-Progress Account (~35% readiness, 4 proven)');
  console.log('     Select in Navbar dropdown: "mid-user"');
  console.log('  3. ⭐ pro-user   : Near-Complete Account (~75% readiness + ECDSA Signed Credential)');
  console.log('     Select in Navbar dropdown: "pro-user"');
  console.log('======================================================================\n');
}

if (require.main === module) {
  seedDemoAccounts();
}

module.exports = { seedDemoAccounts };
