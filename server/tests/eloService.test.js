const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateExpectedScore, calculateNewRating, K_FACTOR } = require('../src/services/eloService');

test('Elo Service Unit Tests', async (t) => {
  await t.test('(a) Correct answer against harder question increases rating more than against easier question', () => {
    const learnerRating = 1000;
    
    // Hard question (difficulty 1400)
    const hardResult = calculateNewRating(learnerRating, 1400, 1);
    // Easy question (difficulty 800)
    const easyResult = calculateNewRating(learnerRating, 800, 1);

    assert.ok(
      hardResult.delta > easyResult.delta,
      `Hard question delta (${hardResult.delta}) should be greater than easy question delta (${easyResult.delta})`
    );
  });

  await t.test('(b) Rating never goes negative', () => {
    // Very low rating learner failing many hard questions
    let rating = 10;
    for (let i = 0; i < 10; i++) {
      const result = calculateNewRating(rating, 1600, 0);
      rating = result.newRating;
    }

    assert.ok(rating >= 0, `Rating (${rating}) should never be less than 0`);
  });

  await t.test('(c) Formula matches documented hand-computed example', () => {
    // Example: learner 1000, question 1000, correct answer (1)
    // expected = 1 / (1 + 10^0) = 0.5
    // delta = 32 * (1 - 0.5) = 16
    // newRating = 1016
    const expectedScore = calculateExpectedScore(1000, 1000);
    assert.equal(expectedScore, 0.5);

    const result = calculateNewRating(1000, 1000, 1);
    assert.equal(result.expectedScore, 0.5);
    assert.equal(result.delta, 16);
    assert.equal(result.newRating, 1016);
  });

  await t.test('Incorrect answer against easy question penalizes more than against hard question', () => {
    const learnerRating = 1000;

    // Fail easy question (800)
    const easyFail = calculateNewRating(learnerRating, 800, 0);
    // Fail hard question (1400)
    const hardFail = calculateNewRating(learnerRating, 1400, 0);

    assert.ok(
      easyFail.delta < hardFail.delta,
      `Failing easy question (${easyFail.delta}) should penalize rating more than failing hard question (${hardFail.delta})`
    );
  });
});
