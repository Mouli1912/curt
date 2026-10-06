/**
 * Assessment Service
 * Manages assessment session creation, answer processing, Elo updates,
 * breadth-first question selection, and stopping criteria evaluation.
 * 
 * STORAGE CHOICE COMMENT:
 * Assessment sessions are stored in an active in-memory session store (Map indexed by userId)
 * with graceful database decoupling. This guarantees zero-latency state transitions during
 * live hackathon demos while allowing non-blocking persistence when MongoDB is enabled.
 */

const path = require('path');
const fs = require('fs');
const { calculateNewRating, DEFAULT_RATING } = require('./eloService');

// Load questions bank
const questionsPath = path.join(__dirname, '../data/questions.json');
const allQuestions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

// Load skill graph to know all nodes
const skillGraphPath = path.join(__dirname, '../../../data/skill_graph.json');
let skillNodes = [];
try {
  const skillGraph = JSON.parse(fs.readFileSync(skillGraphPath, 'utf8'));
  skillNodes = skillGraph.nodes.map(node => node.id);
} catch (err) {
  console.warn('[Assessment Service] Warning: Could not read skill_graph.json, extracting nodes from questions bank.');
  skillNodes = [...new Set(allQuestions.map(q => q.skillNode))];
}

// In-memory active session store
const activeSessions = new Map();

/**
 * Returns question object sanitized for client transmission (never leaks correctIndex).
 */
function sanitizeQuestion(question) {
  if (!question) return null;
  const { correctIndex, ...sanitized } = question;
  return sanitized;
}

/**
 * Initializes or resets an assessment session for a user.
 */
function startSession(userId = 'demo-user', targetRole = 'frontend-developer') {
  const initialRatings = {};
  skillNodes.forEach(nodeId => {
    initialRatings[nodeId] = DEFAULT_RATING;
  });

  const session = {
    userId,
    targetRole,
    overallRating: DEFAULT_RATING,
    ratings: initialRatings,
    questionsAsked: [],
    history: [],
    isComplete: false,
    startedAt: new Date().toISOString(),
    completedAt: null
  };

  const firstQuestion = selectNextQuestion(session);
  if (firstQuestion) {
    session.questionsAsked.push(firstQuestion.id);
  } else {
    session.isComplete = true;
    session.completedAt = new Date().toISOString();
  }

  activeSessions.set(userId, session);

  return {
    userId: session.userId,
    overallRating: session.overallRating,
    ratings: session.ratings,
    currentQuestion: sanitizeQuestion(firstQuestion),
    questionNumber: session.questionsAsked.length,
    isComplete: session.isComplete
  };
}

/**
 * Selects next unasked question adhering to BREADTH-FIRST criteria:
 * 1. Prioritizes untouched skill nodes (at least 1 question per node).
 * 2. Matches question difficulty closest to learner rating.
 */
function selectNextQuestion(session) {
  const askedSet = new Set(session.questionsAsked);
  const unaskedQuestions = allQuestions.filter(q => !askedSet.has(q.id));

  if (unaskedQuestions.length === 0) {
    return null;
  }

  // Find skill nodes touched so far
  const touchedNodes = new Set(session.history.map(h => h.skillNode));
  // Find untouched nodes present in remaining unasked questions
  const untouchedNodesWithQuestions = skillNodes.filter(nodeId => 
    !touchedNodes.has(nodeId) && unaskedQuestions.some(q => q.skillNode === nodeId)
  );

  let candidatePool = unaskedQuestions;

  // Breadth-First: prioritize untouched nodes first
  if (untouchedNodesWithQuestions.length > 0) {
    candidatePool = unaskedQuestions.filter(q => untouchedNodesWithQuestions.includes(q.skillNode));
  }

  // Select question whose difficulty is closest to learner's rating
  let bestQuestion = candidatePool[0];
  let minDiff = Infinity;

  for (const q of candidatePool) {
    const targetRating = session.ratings[q.skillNode] || session.overallRating;
    const diff = Math.abs(q.difficulty - targetRating);
    if (diff < minDiff) {
      minDiff = diff;
      bestQuestion = q;
    }
  }

  return bestQuestion;
}

/**
 * Evaluates whether assessment stopping criteria are met:
 * 1. Total 15 questions answered.
 * 2. Rating stabilization: net overall rating change < 15 points over last 3 questions (minimum 3 questions answered).
 */
function checkStoppingCondition(session) {
  const historyCount = session.history.length;

  // Max 15 questions limit
  if (historyCount >= 15) {
    return { stop: true, reason: 'Maximum question limit (15) reached.' };
  }

  // Rating stabilization limit over last 3 questions
  if (historyCount >= 3) {
    const currentRating = session.overallRating;
    const rating3QuestionsAgo = session.history[historyCount - 3].userRatingBefore;
    const ratingChangeOverLast3 = Math.abs(currentRating - rating3QuestionsAgo);

    if (ratingChangeOverLast3 < 15) {
      return { 
        stop: true, 
        reason: `Rating stabilized (changed by only ${ratingChangeOverLast3} points over last 3 questions).` 
      };
    }
  }

  return { stop: false };
}

/**
 * Processes an answered question, updates Elo ratings, records history, and selects next question.
 */
function submitAnswer(userId, questionId, selectedIndex) {
  const session = activeSessions.get(userId);
  if (!session) {
    throw new Error(`No active assessment session found for user '${userId}'. Please call /api/assessment/start first.`);
  }

  if (session.isComplete) {
    return {
      isComplete: true,
      message: 'Assessment is already complete.',
      overallRating: session.overallRating,
      ratings: session.ratings,
      nextQuestion: null
    };
  }

  const question = allQuestions.find(q => q.id === questionId);
  if (!question) {
    throw new Error(`Question '${questionId}' not found.`);
  }

  const isCorrect = question.correctIndex === Number(selectedIndex);
  const skillNode = question.skillNode;

  // Current ratings
  const currentOverall = session.overallRating;
  const currentSkillRating = session.ratings[skillNode] || DEFAULT_RATING;

  // Compute Elo updates
  const overallUpdate = calculateNewRating(currentOverall, question.difficulty, isCorrect);
  const skillUpdate = calculateNewRating(currentSkillRating, question.difficulty, isCorrect);

  // Update session state
  session.overallRating = overallUpdate.newRating;
  session.ratings[skillNode] = skillUpdate.newRating;

  const historyItem = {
    questionId: question.id,
    skillNode: question.skillNode,
    questionDifficulty: question.difficulty,
    userRatingBefore: currentOverall,
    userRatingAfter: overallUpdate.newRating,
    skillRatingBefore: currentSkillRating,
    skillRatingAfter: skillUpdate.newRating,
    delta: overallUpdate.delta,
    correct: isCorrect,
    timestamp: new Date().toISOString()
  };

  session.history.push(historyItem);

  // Check stopping condition
  const stopCheck = checkStoppingCondition(session);

  let nextQuestion = null;
  if (stopCheck.stop) {
    session.isComplete = true;
    session.completedAt = new Date().toISOString();
    session.stopReason = stopCheck.reason;
  } else {
    nextQuestion = selectNextQuestion(session);
    if (nextQuestion) {
      session.questionsAsked.push(nextQuestion.id);
    } else {
      session.isComplete = true;
      session.completedAt = new Date().toISOString();
      session.stopReason = 'All candidate questions exhausted.';
    }
  }

  return {
    correct: isCorrect,
    delta: overallUpdate.delta,
    updatedRating: session.overallRating,
    updatedSkillRatings: session.ratings,
    historyLength: session.history.length,
    isComplete: session.isComplete,
    stopReason: session.stopReason || null,
    nextQuestion: sanitizeQuestion(nextQuestion)
  };
}

/**
 * Gets session status for user.
 */
function getSessionStatus(userId) {
  const session = activeSessions.get(userId);
  if (!session) {
    return { hasSession: false };
  }

  return {
    hasSession: true,
    userId: session.userId,
    targetRole: session.targetRole,
    overallRating: session.overallRating,
    ratings: session.ratings,
    historyLength: session.history.length,
    questionsAskedCount: session.questionsAsked.length,
    isComplete: session.isComplete,
    stopReason: session.stopReason || null,
    startedAt: session.startedAt,
    completedAt: session.completedAt
  };
}

module.exports = {
  startSession,
  submitAnswer,
  getSessionStatus,
  sanitizeQuestion,
  activeSessions
};
