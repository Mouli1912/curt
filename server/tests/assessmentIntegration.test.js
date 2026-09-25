const test = require('node:test');
const assert = require('node:assert/strict');
const { startSession, submitAnswer, getSessionStatus } = require('../src/services/assessmentService');

test('Assessment Integration & End-to-End Tests', async (t) => {
  await t.test('1. Start session initializes ratings and returns sanitized question without correctIndex', () => {
    const userId = 'test-user-01';
    const result = startSession(userId, 'frontend-developer');

    assert.equal(result.userId, userId);
    assert.equal(result.overallRating, 1000);
    assert.equal(result.isComplete, false);
    assert.ok(result.currentQuestion, 'Should have a current question');
    assert.equal(result.currentQuestion.correctIndex, undefined, 'Must NOT leak correctIndex to client!');
    assert.ok(result.currentQuestion.id, 'Question has ID');
    assert.ok(result.currentQuestion.prompt, 'Question has prompt');
    assert.equal(result.currentQuestion.options.length, 4, 'Question has 4 options');
  });

  await t.test('2. Answering questions updates Elo ratings up/down and moves through breadth-first nodes', () => {
    const userId = 'test-user-02';
    const startResult = startSession(userId, 'frontend-developer');
    let currentQuestion = startResult.currentQuestion;
    let lastRating = startResult.overallRating;

    // Answer 1: submit index 0
    const ans1 = submitAnswer(userId, currentQuestion.id, 0);
    assert.equal(ans1.nextQuestion?.correctIndex, undefined, 'Next question must NOT leak correctIndex!');
    assert.notEqual(ans1.updatedRating, lastRating, 'Rating should move');
    
    if (ans1.correct) {
      assert.ok(ans1.updatedRating > lastRating, 'Correct answer increases rating');
    } else {
      assert.ok(ans1.updatedRating < lastRating, 'Incorrect answer decreases rating');
    }

    lastRating = ans1.updatedRating;
    currentQuestion = ans1.nextQuestion;

    // Answer 2
    const ans2 = submitAnswer(userId, currentQuestion.id, 0);
    assert.notEqual(ans2.updatedRating, lastRating, 'Rating should move on second answer');
  });

  await t.test('3. Stopping condition triggers automatically after maximum questions or stabilization', () => {
    const userId = 'test-user-03';
    let current = startSession(userId, 'frontend-developer');
    let steps = 0;

    while (!current.isComplete && steps < 20) {
      const qId = current.currentQuestion ? current.currentQuestion.id : null;
      if (!qId) break;

      // Consistently select option 0
      const ans = submitAnswer(userId, qId, 0);
      steps++;
      if (ans.isComplete) {
        assert.ok(ans.stopReason, 'Completed assessment must provide a stop reason');
        break;
      }
      current.currentQuestion = ans.nextQuestion;
    }

    const status = getSessionStatus(userId);
    assert.equal(status.isComplete, true, 'Session should be marked as complete');
    assert.ok(status.historyLength <= 15, `History length (${status.historyLength}) should be <= 15`);
  });
});
