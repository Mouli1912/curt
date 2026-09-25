/**
 * Elo Scoring Service
 * Pure functions for calculating expected scores and updated Elo ratings.
 * Zero LLM / external API dependencies.
 */

const K_FACTOR = 32;
const DEFAULT_RATING = 1000;

/**
 * Calculates expected win probability for learner against question difficulty.
 * Formula: 1 / (1 + 10 ^ ((questionDifficulty - learnerRating) / 400))
 * 
 * @param {number} learnerRating - Current Elo rating of learner
 * @param {number} questionDifficulty - Seed difficulty rating of question
 * @returns {number} Expected score between 0.0 and 1.0
 */
function calculateExpectedScore(learnerRating, questionDifficulty) {
  const diff = questionDifficulty - learnerRating;
  return 1 / (1 + Math.pow(10, diff / 400));
}

/**
 * Calculates new Elo rating after an answer submission.
 * Formula: learnerRating + K * (actualScore - expected)
 * Rating is rounded to nearest integer and clamped to a minimum of 0.
 * 
 * @param {number} learnerRating - Current Elo rating of learner
 * @param {number} questionDifficulty - Difficulty rating of question answered
 * @param {number} actualScore - 1 for correct answer, 0 for incorrect answer
 * @param {number} [kFactor=32] - K-factor tuning constant
 * @returns {{ newRating: number, delta: number, expectedScore: number }} Rating update details
 */
function calculateNewRating(learnerRating, questionDifficulty, actualScore, kFactor = K_FACTOR) {
  const expected = calculateExpectedScore(learnerRating, questionDifficulty);
  const score = actualScore ? 1 : 0;
  const rawDelta = kFactor * (score - expected);
  const rawNewRating = learnerRating + rawDelta;
  const newRating = Math.max(0, Math.round(rawNewRating));
  const delta = newRating - learnerRating;

  return {
    newRating,
    delta,
    expectedScore: Number(expected.toFixed(4))
  };
}

module.exports = {
  K_FACTOR,
  DEFAULT_RATING,
  calculateExpectedScore,
  calculateNewRating
};
