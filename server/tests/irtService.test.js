const { describe, it } = require('node:test');
const assert = require('node:assert');
const {
  calculate2PLProbability,
  update2PLRating,
  calculateStandardError,
  detectFastAnswer,
  shouldStopAssessment,
  startSession,
  submitAnswer,
  getAdminMetrics,
  getIntegrityReport,
  getCalibrationHealth
} = require('../src/services/eloService');

describe('IRT-Lite 2PL & Integrity Signal Engine Tests', () => {

  it('(1) calculate2PLProbability computes correct sigmoid response curve with discrimination parameter a', () => {
    // theta = (1000 - 1000)/400 = 0
    // b = (1000 - 1000)/400 = 0
    // P = 1 / (1 + e^(0)) = 0.5 regardless of 'a' when theta == b
    const pEqual = calculate2PLProbability(1000, 1000, 1.5);
    assert.strictEqual(pEqual, 0.5);

    // theta = (1200 - 1000)/400 = 0.5
    // b = (1000 - 1000)/400 = 0
    // High discrimination (a = 2.0) should produce higher probability than lower discrimination (a = 0.8)
    const pHighDisc = calculate2PLProbability(1200, 1000, 2.0);
    const pLowDisc = calculate2PLProbability(1200, 1000, 0.8);

    assert.ok(
      pHighDisc > pLowDisc,
      `High discrimination P (${pHighDisc.toFixed(4)}) should be > low discrimination P (${pLowDisc.toFixed(4)})`
    );
  });

  it('(2) update2PLRating applies discrimination scaling to effective K factor', () => {
    const learnerRating = 1000;
    const diff = 1200;
    const isCorrect = true;

    // a = 1.0 vs a = 1.8
    const resBase = update2PLRating(learnerRating, diff, isCorrect, 1.0, '2pl');
    const resHighDisc = update2PLRating(learnerRating, diff, isCorrect, 1.8, '2pl');

    assert.ok(
      resHighDisc.delta > resBase.delta,
      `High discrimination delta (${resHighDisc.delta}) should be greater than base delta (${resBase.delta})`
    );
  });

  it('(3) calculateStandardError narrows confidence interval as more questions are answered', () => {
    const skillNode = 'javascript';
    const currentRating = 1200;

    // 0 questions answered
    const se0 = calculateStandardError(skillNode, [], currentRating);
    assert.strictEqual(se0.label, 'Unassessed');

    // 1 question answered
    const history1 = [{ skillNode, difficulty: 1200, discrimination: 1.5 }];
    const se1 = calculateStandardError(skillNode, history1, currentRating);

    // 4 questions answered for same skill
    const history4 = [
      { skillNode, difficulty: 1200, discrimination: 1.5 },
      { skillNode, difficulty: 1250, discrimination: 1.4 },
      { skillNode, difficulty: 1150, discrimination: 1.6 },
      { skillNode, difficulty: 1200, discrimination: 1.5 }
    ];
    const se4 = calculateStandardError(skillNode, history4, currentRating);

    assert.ok(
      se4.se < se1.se,
      `Standard Error after 4 questions (${se4.se}) should be smaller than after 1 question (${se1.se})`
    );
  });

  it('(4) detectFastAnswer correctly identifies implausibly fast answer submissions (< 2000ms)', () => {
    assert.strictEqual(detectFastAnswer(1200), true, '1200ms should be flagged as fast answer');
    assert.strictEqual(detectFastAnswer(500), true, '500ms should be flagged as fast answer');
    assert.strictEqual(detectFastAnswer(3500), false, '3500ms should NOT be flagged as fast answer');
    assert.strictEqual(detectFastAnswer(undefined), false, 'undefined time should NOT be flagged');
  });

  it('(5) shouldStopAssessment respects SE threshold <= 50 after 5 questions', () => {
    const history = Array(6).fill({ skillNode: 'javascript', difficulty: 1000, discrimination: 2.0 });
    const ratings = { javascript: 1200 };
    const overallHistory = [1000, 1050, 1100, 1150, 1180, 1200, 1200];

    const stop = shouldStopAssessment(6, overallHistory, history, ratings);
    assert.strictEqual(stop, true, 'Assessment should stop when SE <= 50 after at least 5 questions');
  });

  it('(6) submitAnswer tracks timeSpentMs, tabSwitchCount, and updates session state', () => {
    const userId = 'test-irt-user-' + Date.now();
    const session = startSession(userId, 'frontend-developer');

    assert.ok(session.currentQuestion, 'Session should have a valid current question');
    const questionId = session.currentQuestion.id;

    // Submit with 1200ms time (fast answer) and 2 tab switches
    const answerRes = submitAnswer(userId, questionId, 0, 1200, 2);

    assert.ok(answerRes.integrityFlags, 'Response should include integrityFlags');
    assert.strictEqual(answerRes.integrityFlags.flaggedFastAnswer, true, 'Fast answer should be flagged true');
    assert.strictEqual(answerRes.integrityFlags.tabSwitchCount, 2, 'Tab switch count should equal 2');
    assert.ok(answerRes.standardError, 'Response should contain standardError calculation');
  });

  it('(7) Admin metrics and calibration endpoints report item health and integrity flags', () => {
    const metrics = getAdminMetrics();
    assert.ok(metrics.totalSessions >= 0, 'Admin metrics should return totalSessions');

    const calHealth = getCalibrationHealth();
    assert.ok(calHealth.calibratedCount > 0, 'Question bank should contain calibrated items');
    assert.ok(calHealth.meanDiscrimination >= 0.8, 'Mean discrimination should be >= 0.8');

    const integrityRep = getIntegrityReport();
    assert.ok(integrityRep.timestamp, 'Integrity report should contain a timestamp');
  });

});
