/**
 * Psychometric Elo Rating Service for SkillPath
 * 
 * Pure classical Elo algorithm for adaptive skill measurement without LLMs.
 * Formula:
 *   expected = 1 / (1 + 10^((questionDifficulty - learnerRating) / 400))
 *   newRating = learnerRating + K * (actualScore - expected)
 * where K = 32.
 */

const fs = require('fs');
const path = require('path');

const K_FACTOR = 32;
const DEFAULT_RATING = 1000;
const MAX_QUESTIONS = 15;
const STABILIZATION_THRESHOLD = 15; // Point change threshold over last 3 questions

// In-memory assessment session storage (keyed by userId and sessionId)
const sessionsStore = new Map();

/**
 * Reads question bank from server/src/data/questions.json
 */
function loadQuestionBank() {
  const possiblePaths = [
    path.join(__dirname, '../data/questions.json'),
    path.join(__dirname, '../../data/questions.json'),
    path.join(process.cwd(), 'server/src/data/questions.json'),
    path.join(process.cwd(), 'data/skill_graph.json')
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (err) {
        console.warn(`[EloService Warning] Failed parsing questions from ${p}:`, err.message);
      }
    }
  }
  return [];
}

/**
 * Pure Function: Calculates expected score EA for a learner against question difficulty
 * @param {number} learnerRating 
 * @param {number} questionDifficulty 
 * @returns {number} Expected score between 0 and 1
 */
function calculateExpectedScore(learnerRating, questionDifficulty) {
  return 1 / (1 + Math.pow(10, (questionDifficulty - learnerRating) / 400));
}

/**
 * Pure Function: Computes new Elo rating and delta
 * @param {number} learnerRating 
 * @param {number} questionDifficulty 
 * @param {boolean} isCorrect 
 * @returns {{ newRating: number, delta: number, expectedScore: number }}
 */
function updateEloRating(learnerRating, questionDifficulty, isCorrect) {
  const actualScore = isCorrect ? 1 : 0;
  const expectedScore = calculateExpectedScore(learnerRating, questionDifficulty);
  const delta = Math.round(K_FACTOR * (actualScore - expectedScore));
  const newRating = Math.max(0, Math.round(learnerRating + delta));
  return { newRating, delta, expectedScore };
}

/**
 * Pure Function: Calculates mean overall rating across touched/known skills
 * @param {Object} ratings - Object mapping skillNode to rating number
 * @returns {number} Overall average Elo rating
 */
function calculateOverallRating(ratings) {
  const values = Object.values(ratings);
  if (!values || values.length === 0) return DEFAULT_RATING;
  const sum = values.reduce((acc, r) => acc + r, 0);
  return Math.round(sum / values.length);
}

/**
 * Pure Function: Selects next unasked question prioritizing breadth-first untouched skills,
 * then targeting difficulty closest to learner rating.
 * 
 * @param {Object} ratings - Current skill ratings
 * @param {string[]} answeredQuestionIds - List of already asked question IDs
 * @param {Array} questionBank - Complete list of available questions
 * @param {string[]} touchedSkills - List of skillNode IDs already tested in this session
 * @returns {Object|null} Selected question object or null if out of questions
 */
function selectNextAdaptiveQuestion(ratings, answeredQuestionIds, questionBank, touchedSkills = []) {
  if (!questionBank || questionBank.length === 0) return null;

  const unasked = questionBank.filter(q => !answeredQuestionIds.includes(q.id));
  if (unasked.length === 0) return null;

  const overallRating = calculateOverallRating(ratings);

  // 1. Identify untouched skill nodes that have unasked questions available
  const availableSkillNodes = [...new Set(unasked.map(q => q.skillNode))];
  const untouchedNodes = availableSkillNodes.filter(node => !touchedSkills.includes(node));

  let candidatePool = unasked;

  // Breadth-First Priority: If there are untouched skills, pick from untouched skills first!
  if (untouchedNodes.length > 0) {
    candidatePool = unasked.filter(q => untouchedNodes.includes(q.skillNode));
  }

  // 2. Select the candidate question whose difficulty is closest to the learner's rating
  candidatePool.sort((a, b) => {
    const ratingA = ratings[a.skillNode] !== undefined ? ratings[a.skillNode] : overallRating;
    const ratingB = ratings[b.skillNode] !== undefined ? ratings[b.skillNode] : overallRating;

    const diffA = Math.abs(a.difficulty - ratingA);
    const diffB = Math.abs(b.difficulty - ratingB);

    return diffA - diffB;
  });

  return candidatePool[0];
}

/**
 * Pure Function: Evaluates stopping condition.
 * Stops if 15 questions answered OR overall rating changed by < 15 over last 3 questions.
 * 
 * @param {number} historyLength - Number of questions answered so far
 * @param {number[]} overallRatingHistory - Array of overall ratings at each step
 * @returns {boolean} True if stopping condition met
 */
function shouldStopAssessment(historyLength, overallRatingHistory) {
  if (historyLength >= MAX_QUESTIONS) {
    return true;
  }
  if (historyLength >= 3 && overallRatingHistory && overallRatingHistory.length >= 4) {
    const currentRating = overallRatingHistory[overallRatingHistory.length - 1];
    const rating3Ago = overallRatingHistory[overallRatingHistory.length - 4];
    if (Math.abs(currentRating - rating3Ago) < STABILIZATION_THRESHOLD) {
      return true;
    }
  }
  return false;
}

/**
 * Sanitizes question object so correctIndex is NEVER sent to client
 */
function sanitizeQuestion(question) {
  if (!question) return null;
  const { correctIndex, ...safeQuestion } = question;
  return safeQuestion;
}

/**
 * Starts or resets an assessment session
 */
function startSession(userId = 'pro-user', targetRole = 'frontend-developer') {
  const questionBank = loadQuestionBank();
  
  // Default skill node seeds per demo profile
  const initialRatings = userId === 'pro-user' ? {
    javascript: 1400,
    react: 1350,
    html: 1450,
    css: 1300,
    dom: 1250,
    git: 1400,
    typescript: 1200,
    "rest-api": 1350,
    "responsive-design": 1150,
    "state-management": 1250
  } : userId === 'mid-user' ? {
    html: 1200,
    css: 1100,
    javascript: 1150,
    git: 1150
  } : {};

  const initialOverall = calculateOverallRating(initialRatings);
  const sessionId = `session-${userId}-${Date.now()}`;
  const answeredQuestionIds = [];
  const touchedSkills = Object.keys(initialRatings);
  const firstQuestion = selectNextAdaptiveQuestion(initialRatings, answeredQuestionIds, questionBank, touchedSkills);

  const session = {
    sessionId,
    userId,
    targetRole,
    ratings: initialRatings,
    overallRating: initialOverall,
    overallRatingHistory: [initialOverall],
    answeredQuestionIds,
    touchedSkills,
    history: [],
    currentQuestion: firstQuestion,
    totalQuestions: MAX_QUESTIONS,
    isComplete: false,
    startTime: Date.now()
  };

  sessionsStore.set(userId, session);
  sessionsStore.set(sessionId, session);

  return {
    sessionId: session.sessionId,
    userId: session.userId,
    targetRole: session.targetRole,
    questionNumber: 1,
    totalQuestions: MAX_QUESTIONS,
    currentQuestion: sanitizeQuestion(session.currentQuestion),
    ratings: session.ratings,
    overallRating: session.overallRating,
    isComplete: false
  };
}

/**
 * Submits answer for current question and advances assessment state
 */
function submitAnswer(userIdOrSessionId, questionId, selectedIndex) {
  const session = sessionsStore.get(userIdOrSessionId);
  if (!session) {
    throw new Error('Assessment session not found. Please start a new session.');
  }

  if (session.isComplete) {
    return {
      isComplete: true,
      message: 'Assessment is already complete.',
      ratings: session.ratings,
      overallRating: session.overallRating
    };
  }

  const question = session.currentQuestion;
  if (!question || question.id !== questionId) {
    throw new Error('Invalid question submission or question mismatch.');
  }

  const questionBank = loadQuestionBank();
  const fullQuestionObj = questionBank.find(q => q.id === questionId) || question;

  const isCorrect = selectedIndex === fullQuestionObj.correctIndex;
  const currentSkillNode = fullQuestionObj.skillNode;
  const currentRating = session.ratings[currentSkillNode] !== undefined
    ? session.ratings[currentSkillNode]
    : DEFAULT_RATING;

  // Calculate Elo update
  const { newRating, delta } = updateEloRating(currentRating, fullQuestionObj.difficulty, isCorrect);
  
  // Update state
  session.ratings[currentSkillNode] = newRating;
  if (!session.touchedSkills.includes(currentSkillNode)) {
    session.touchedSkills.push(currentSkillNode);
  }
  session.answeredQuestionIds.push(fullQuestionObj.id);

  const updatedOverall = calculateOverallRating(session.ratings);
  session.overallRating = updatedOverall;
  session.overallRatingHistory.push(updatedOverall);

  session.history.push({
    questionId: fullQuestionObj.id,
    skillNode: currentSkillNode,
    prompt: fullQuestionObj.prompt,
    selectedIndex,
    correctIndex: fullQuestionObj.correctIndex,
    isCorrect,
    ratingBefore: currentRating,
    ratingAfter: newRating,
    delta,
    timestamp: Date.now()
  });

  // Evaluate stopping condition
  const isComplete = shouldStopAssessment(session.history.length, session.overallRatingHistory);
  session.isComplete = isComplete;

  let nextQuestion = null;
  if (!isComplete) {
    nextQuestion = selectNextAdaptiveQuestion(
      session.ratings,
      session.answeredQuestionIds,
      questionBank,
      session.touchedSkills
    );
    if (!nextQuestion) {
      session.isComplete = true;
    }
  }

  session.currentQuestion = nextQuestion;

  return {
    sessionId: session.sessionId,
    userId: session.userId,
    correct: isCorrect,
    isCorrect,
    skillNode: currentSkillNode,
    ratingDelta: delta,
    updatedRating: newRating,
    newRating,
    ratings: session.ratings,
    overallRating: session.overallRating,
    isComplete: session.isComplete,
    questionNumber: session.history.length + (session.isComplete ? 0 : 1),
    totalQuestions: MAX_QUESTIONS,
    nextQuestion: sanitizeQuestion(nextQuestion)
  };
}

/**
 * Retrieves current assessment status for a user
 */
function getAssessmentStatus(userId) {
  const session = sessionsStore.get(userId);
  if (!session) {
    return {
      exists: false,
      userId,
      isComplete: false,
      ratings: null
    };
  }

  return {
    exists: true,
    sessionId: session.sessionId,
    userId: session.userId,
    targetRole: session.targetRole,
    ratings: session.ratings,
    overallRating: session.overallRating,
    isComplete: session.isComplete,
    questionNumber: session.history.length + (session.isComplete ? 0 : 1),
    totalQuestions: MAX_QUESTIONS,
    history: session.history,
    currentQuestion: sanitizeQuestion(session.currentQuestion)
  };
}

module.exports = {
  K_FACTOR,
  DEFAULT_RATING,
  MAX_QUESTIONS,
  STABILIZATION_THRESHOLD,
  loadQuestionBank,
  calculateExpectedScore,
  updateEloRating,
  calculateOverallRating,
  selectNextAdaptiveQuestion,
  shouldStopAssessment,
  startSession,
  submitAnswer,
  getAssessmentStatus
};
