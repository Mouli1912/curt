const { describe, it } = require('node:test');
const assert = require('node:assert');
const {
  calculateExpectedScore,
  updateEloRating,
  selectNextAdaptiveQuestion,
  shouldStopAssessment,
  calculateOverallRating,
  K_FACTOR
} = require('../src/services/eloService');

describe('Elo Psychometric Scoring Engine Unit Tests', () => {

  it('(a) a correct answer against a harder question increases rating more than against an easier one', () => {
    const baseRating = 1000;
    const easyQuestionDiff = 900;
    const hardQuestionDiff = 1400;

    const easyResult = updateEloRating(baseRating, easyQuestionDiff, true);
    const hardResult = updateEloRating(baseRating, hardQuestionDiff, true);

    assert.ok(
      hardResult.delta > easyResult.delta,
      `Hard question delta (${hardResult.delta}) should be greater than easy question delta (${easyResult.delta})`
    );
    assert.ok(
      hardResult.newRating > easyResult.newRating,
      `Hard question new rating (${hardResult.newRating}) should be higher than easy question new rating (${easyResult.newRating})`
    );
  });

  it('(b) rating never goes negative', () => {
    const lowRating = 10;
    const hardDiff = 1600;

    // Incorrect answer on a very hard question gives maximum negative delta
    const result = updateEloRating(lowRating, hardDiff, false);

    assert.ok(result.newRating >= 0, `Rating ${result.newRating} should be >= 0`);
  });

  it('(c) the update formula matches the documented formula for a hand-computed example', () => {
    // Hand computed example:
    // learnerRating = 1000, questionDifficulty = 1200, isCorrect = true, K = 32
    // expected = 1 / (1 + 10^((1200 - 1000)/400)) = 1 / (1 + 10^0.5) ≈ 0.240253
    // actualScore = 1
    // delta = Math.round(32 * (1 - 0.240253)) = Math.round(24.3119) = 24
    // newRating = 1000 + 24 = 1024

    const learnerRating = 1000;
    const questionDiff = 1200;
    const isCorrect = true;

    const expectedScore = calculateExpectedScore(learnerRating, questionDiff);
    assert.strictEqual(expectedScore.toFixed(4), (0.2403).toFixed(4));

    const { newRating, delta } = updateEloRating(learnerRating, questionDiff, isCorrect);
    assert.strictEqual(delta, 24);
    assert.strictEqual(newRating, 1024);
  });

  it('selects breadth-first unasked questions from untouched skills before repeating skill nodes', () => {
    const ratings = { javascript: 1000, react: 1000, css: 1000 };
    const mockQuestionBank = [
      { id: 'q1', skillNode: 'javascript', difficulty: 1000, prompt: 'JS 1' },
      { id: 'q2', skillNode: 'javascript', difficulty: 1050, prompt: 'JS 2' },
      { id: 'q3', skillNode: 'react', difficulty: 1000, prompt: 'React 1' },
      { id: 'q4', skillNode: 'css', difficulty: 1000, prompt: 'CSS 1' }
    ];

    // Node 'javascript' already touched
    const touchedSkills = ['javascript'];
    const answeredQuestionIds = ['q1'];

    const nextQ = selectNextAdaptiveQuestion(ratings, answeredQuestionIds, mockQuestionBank, touchedSkills);

    // Should pick from untouched skills ('react' or 'css'), not 'javascript'
    assert.notStrictEqual(nextQ.skillNode, 'javascript');
    assert.ok(nextQ.skillNode === 'react' || nextQ.skillNode === 'css');
  });

  it('triggers stopping condition at 15 questions or when overall rating stabilizes', () => {
    // Under 15 questions, not stabilized -> false
    assert.strictEqual(shouldStopAssessment(5, [1000, 1020, 1035, 1045, 1050, 1052]), false);

    // 15 questions reached -> true
    assert.strictEqual(shouldStopAssessment(15, [1000, 1010]), true);

    // Rating stabilization: overall rating changed by < 15 over last 3 questions (after at least 5 questions) -> true
    // Rating 3 steps ago = 1050, current = 1054 (|1054 - 1050| = 4 < 15)
    assert.strictEqual(shouldStopAssessment(5, [1000, 1050, 1052, 1053, 1054, 1054]), true);
  });

});
