/**
 * Script: seedDemo.js
 * Creates 3 realistic demo user accounts at different progress stages for hackathon judges' presentation.
 * 
 * Accounts Created:
 * 1. "fresh-user"     - No assessment taken (0% progress, clean start)
 * 2. "mid-user"       - Assessment completed, 4 proven skills (HTML, CSS, JS, Git), gap report ready
 * 3. "pro-user"       - 10+ proven skills, 2 pre-issued ECDSA signed credentials (JavaScript & React)
 */

const { activeSessions, startSession, submitAnswer } = require('../src/services/assessmentService');
const { issueCredential, isNodeProvable } = require('../src/services/credentialService');

function seedDemoSessions() {
  console.log('[Seed Demo] Initializing 3 demo user profiles...');

  // 1. Fresh User
  startSession('fresh-user', 'frontend-developer');
  console.log('[Seed Demo] Created "fresh-user" (Stage: Fresh start, 0 questions answered)');

  // 2. Mid-Progress User
  const midSessionData = startSession('mid-user', 'frontend-developer');
  // Simulate answering questions to prove html, css, javascript, git
  const midAnswers = [
    { qId: 'q_html_01', ans: 2 },
    { qId: 'q_html_02', ans: 1 },
    { qId: 'q_html_03', ans: 2 },
    { qId: 'q_css_01', ans: 1 },
    { qId: 'q_css_02', ans: 2 },
    { qId: 'q_css_03', ans: 1 },
    { qId: 'q_js_01', ans: 1 },
    { qId: 'q_js_02', ans: 0 },
    { qId: 'q_js_03', ans: 1 },
    { qId: 'q_git_01', ans: 2 },
    { qId: 'q_git_02', ans: 0 },
    { qId: 'q_git_03', ans: 1 }
  ];

  midAnswers.forEach(({ qId, ans }) => {
    try {
      submitAnswer('mid-user', qId, ans);
    } catch (e) {
      // Ignore if skipped
    }
  });
  console.log('[Seed Demo] Created "mid-user" (Stage: Mid-progress, 4 proven skills: html, css, javascript, git)');

  // 3. Pro User (Near-Complete)
  startSession('pro-user', 'frontend-developer');
  const proAnswers = [
    { qId: 'q_html_01', ans: 2 }, { qId: 'q_html_02', ans: 1 }, { qId: 'q_html_03', ans: 2 },
    { qId: 'q_css_01', ans: 1 }, { qId: 'q_css_02', ans: 2 }, { qId: 'q_css_03', ans: 1 },
    { qId: 'q_js_01', ans: 1 }, { qId: 'q_js_02', ans: 0 }, { qId: 'q_js_03', ans: 1 },
    { qId: 'q_git_01', ans: 2 }, { qId: 'q_git_02', ans: 0 }, { qId: 'q_git_03', ans: 1 },
    { qId: 'q_react_01', ans: 2 }, { qId: 'q_react_02', ans: 1 }, { qId: 'q_react_03', ans: 1 },
    { qId: 'q_dom_01', ans: 1 }, { qId: 'q_dom_02', ans: 1 },
    { qId: 'q_rest_01', ans: 1 }, { qId: 'q_rest_02', ans: 1 },
    { qId: 'q_ts_01', ans: 1 }, { qId: 'q_ts_02', ans: 1 }
  ];

  proAnswers.forEach(({ qId, ans }) => {
    try {
      submitAnswer('pro-user', qId, ans);
    } catch (e) {
      // Ignore
    }
  });

  // Pre-issue 2 ECDSA signed credentials for pro-user
  const jsCred = issueCredential({
    studentId: 'pro-user',
    studentName: 'Jordan Pro',
    skillNode: 'javascript',
    score: 1248,
    targetRole: 'frontend-developer'
  });

  const reactCred = issueCredential({
    studentId: 'pro-user',
    studentName: 'Jordan Pro',
    skillNode: 'react',
    score: 1195,
    targetRole: 'frontend-developer'
  });

  console.log('[Seed Demo] Created "pro-user" (Stage: Near-complete, 8+ proven skills, 2 pre-issued credentials)');
  console.log('[Seed Demo]   - Pre-issued Credential #1 (JS):', jsCred.credentialId);
  console.log('[Seed Demo]   - Pre-issued Credential #2 (React):', reactCred.credentialId);

  console.log('\n===============================================================');
  console.log('DEMO ACCOUNTS READY FOR JUDGES PRESENTATION:');
  console.log('1. fresh-user : Fresh learner (0% readiness, test beginning)');
  console.log('2. mid-user   : Mid-level learner (Gap report & graph demo)');
  console.log('3. pro-user   : Advanced learner (ECDSA Credential & verification demo)');
  console.log('===============================================================\n');

  return { freshUser: 'fresh-user', midUser: 'mid-user', proUser: 'pro-user', jsCred, reactCred };
}

if (require.main === module) {
  seedDemoSessions();
}

module.exports = seedDemoSessions;
