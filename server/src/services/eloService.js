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
 * Pure Function: Calculates expected score EA for a learner against question difficulty (1PL/Elo)
 * @param {number} learnerRating 
 * @param {number} questionDifficulty 
 * @returns {number} Expected score between 0 and 1
 */
function calculateExpectedScore(learnerRating, questionDifficulty) {
  return 1 / (1 + Math.pow(10, (questionDifficulty - learnerRating) / 400));
}

/**
 * Pure Function: Calculates 2-Parameter Logistic (2PL) IRT probability
 * Formula: P(correct) = 1 / (1 + e^(-a * (theta - b)))
 * where theta = (learnerRating - 1000)/400, b = (questionDifficulty - 1000)/400, a = discrimination
 * 
 * @param {number} learnerRating 
 * @param {number} questionDifficulty 
 * @param {number} discrimination - Discrimination parameter 'a' (default 1.0)
 * @returns {number} Expected probability of correct answer (0 to 1)
 */
function calculate2PLProbability(learnerRating, questionDifficulty, discrimination = 1.0) {
  const theta = (learnerRating - 1000) / 400;
  const b = (questionDifficulty - 1000) / 400;
  const a = typeof discrimination === 'number' && !isNaN(discrimination) ? discrimination : 1.0;
  
  const exponent = -a * (theta - b);
  return 1 / (1 + Math.exp(exponent));
}

/**
 * Pure Function: Computes new Elo / 2PL IRT rating and delta
 * @param {number} learnerRating 
 * @param {number} questionDifficulty 
 * @param {boolean} isCorrect 
 * @param {number} discrimination - Item discrimination parameter
 * @param {string} mode - '2pl' or 'elo'
 * @returns {{ newRating: number, delta: number, expectedScore: number }}
 */
function updateEloRating(learnerRating, questionDifficulty, isCorrect, discrimination = 1.0, mode = 'elo') {
  const actualScore = isCorrect ? 1 : 0;
  
  let expectedScore;
  let effectiveK = K_FACTOR;

  if (mode === '2pl') {
    expectedScore = calculate2PLProbability(learnerRating, questionDifficulty, discrimination);
    effectiveK = K_FACTOR * (typeof discrimination === 'number' && !isNaN(discrimination) ? discrimination : 1.0);
  } else {
    expectedScore = calculateExpectedScore(learnerRating, questionDifficulty);
  }

  const delta = Math.round(effectiveK * (actualScore - expectedScore));
  const newRating = Math.max(0, Math.round(learnerRating + delta));
  return { newRating, delta, expectedScore };
}

/**
 * Alias for updateEloRating with explicit 2PL mode parameter order
 */
function update2PLRating(learnerRating, questionDifficulty, isCorrect, discrimination = 1.0) {
  return updateEloRating(learnerRating, questionDifficulty, isCorrect, discrimination, '2pl');
}

/**
 * Pure Function: Computes Standard Error (SE) and Confidence Interval for a given skill node
 * based on IRT Fisher Information.
 * 
 * @param {string} skillNode 
 * @param {Array} history - List of answered question history items
 * @param {number} currentRating - Current rating for the skill node
 * @returns {{ se: number, lower: number, upper: number, label: string, questionsAnswered: number }}
 */
function calculateStandardError(skillNode, history = [], currentRating = DEFAULT_RATING) {
  const nodeHistory = (history || []).filter(h => h.skillNode === skillNode);
  const questionsAnswered = nodeHistory.length;

  // Base Fisher Information prior
  let fisherInfo = 0.15;
  const theta = (currentRating - 1000) / 400;

  for (const item of nodeHistory) {
    const a = item.discrimination || 1.0;
    const b = ((item.difficulty || DEFAULT_RATING) - 1000) / 400;
    const P = 1 / (1 + Math.exp(-a * (theta - b)));
    const itemInfo = Math.pow(a, 2) * P * (1 - P);
    fisherInfo += itemInfo;
  }

  const seTheta = 1 / Math.sqrt(fisherInfo);
  const seElo = Math.round(seTheta * 100);

  const lower = Math.max(0, currentRating - seElo);
  const upper = currentRating + seElo;

  let label = 'Low Confidence';
  if (questionsAnswered === 0) {
    label = 'Unassessed';
  } else if (seElo <= 50) {
    label = 'High Confidence';
  } else if (seElo <= 80) {
    label = 'Medium Confidence';
  }

  return {
    se: seElo,
    lower,
    upper,
    label,
    questionsAnswered
  };
}

/**
 * Integrity Helper: Flags implausibly fast answer submissions (< 2000ms)
 * @param {number} timeSpentMs 
 * @returns {boolean} True if flagged as implausibly fast
 */
function detectFastAnswer(timeSpentMs) {
  return typeof timeSpentMs === 'number' && timeSpentMs > 0 && timeSpentMs < 2000;
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
 * Upgraded IRT stopping rule:
 * - Stops if 15 questions answered (MAX_QUESTIONS)
 * - OR if overall rating changed by < 15 over last 3 questions (stabilization)
 * - OR if average standard error across tested skills <= 50 AND at least 5 questions answered
 * 
 * @param {number} historyLength - Number of questions answered so far
 * @param {number[]} overallRatingHistory - Array of overall ratings at each step
 * @param {Array} history - Response history array
 * @param {Object} ratings - Current skill ratings
 * @returns {boolean} True if stopping condition met
 */
function shouldStopAssessment(historyLength, overallRatingHistory, history = [], ratings = {}) {
  if (historyLength >= MAX_QUESTIONS) {
    return true;
  }

  // Stabilization check
  if (historyLength >= 3 && overallRatingHistory && overallRatingHistory.length >= 4) {
    const currentRating = overallRatingHistory[overallRatingHistory.length - 1];
    const rating3Ago = overallRatingHistory[overallRatingHistory.length - 4];
    if (Math.abs(currentRating - rating3Ago) < STABILIZATION_THRESHOLD) {
      return true;
    }
  }

  // SE-based stopping rule check (after at least 5 questions)
  if (historyLength >= 5 && history.length >= 5) {
    const touchedSkillNodes = Object.keys(ratings);
    if (touchedSkillNodes.length > 0) {
      let totalSE = 0;
      for (const node of touchedSkillNodes) {
        const { se } = calculateStandardError(node, history, ratings[node]);
        totalSE += se;
      }
      const avgSE = totalSE / touchedSkillNodes.length;
      if (avgSE <= 50) {
        return true;
      }
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
function submitAnswer(userIdOrSessionId, questionId, selectedIndex, timeSpentMs, tabSwitchCount) {
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

  const discrimination = fullQuestionObj.discrimination !== undefined ? fullQuestionObj.discrimination : 1.0;

  // Calculate 2PL IRT update
  const { newRating, delta, expectedScore } = updateEloRating(
    currentRating,
    fullQuestionObj.difficulty,
    isCorrect,
    discrimination,
    '2pl'
  );
  
  // Update ratings state
  session.ratings[currentSkillNode] = newRating;
  if (!session.touchedSkills.includes(currentSkillNode)) {
    session.touchedSkills.push(currentSkillNode);
  }
  session.answeredQuestionIds.push(fullQuestionObj.id);

  const updatedOverall = calculateOverallRating(session.ratings);
  session.overallRating = updatedOverall;
  session.overallRatingHistory.push(updatedOverall);

  // Integrity checks
  const isFastAnswer = detectFastAnswer(timeSpentMs);
  if (tabSwitchCount !== undefined && typeof tabSwitchCount === 'number') {
    session.tabSwitchCount = Math.max(session.tabSwitchCount || 0, tabSwitchCount);
  }

  const historyEntry = {
    questionId: fullQuestionObj.id,
    skillNode: currentSkillNode,
    prompt: fullQuestionObj.prompt,
    selectedIndex,
    correctIndex: fullQuestionObj.correctIndex,
    isCorrect,
    ratingBefore: currentRating,
    ratingAfter: newRating,
    delta,
    discrimination,
    difficulty: fullQuestionObj.difficulty,
    expectedScore,
    timeSpentMs: typeof timeSpentMs === 'number' ? timeSpentMs : 0,
    flaggedFastAnswer: isFastAnswer,
    timestamp: Date.now()
  };

  session.history.push(historyEntry);

  // Calculate standard error for the updated skill node
  const seInfo = calculateStandardError(currentSkillNode, session.history, newRating);

  // Evaluate upgraded stopping condition
  const isComplete = shouldStopAssessment(
    session.history.length,
    session.overallRatingHistory,
    session.history,
    session.ratings
  );
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

  const totalFastAnswers = session.history.filter(h => h.flaggedFastAnswer).length;

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
    standardError: seInfo,
    integrityFlags: {
      flaggedFastAnswer: isFastAnswer,
      totalFastAnswers,
      tabSwitchCount: session.tabSwitchCount || 0
    },
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

  // Calculate standard error summary per touched skill
  const seSummary = {};
  for (const node of session.touchedSkills || []) {
    const r = session.ratings[node] !== undefined ? session.ratings[node] : DEFAULT_RATING;
    seSummary[node] = calculateStandardError(node, session.history, r);
  }

  const totalFastAnswers = (session.history || []).filter(h => h.flaggedFastAnswer).length;

  return {
    exists: true,
    sessionId: session.sessionId,
    userId: session.userId,
    targetRole: session.targetRole,
    ratings: session.ratings,
    overallRating: session.overallRating,
    standardErrorSummary: seSummary,
    integrityFlags: {
      totalFastAnswers,
      tabSwitchCount: session.tabSwitchCount || 0
    },
    isComplete: session.isComplete,
    questionNumber: session.history.length + (session.isComplete ? 0 : 1),
    totalQuestions: MAX_QUESTIONS,
    history: session.history,
    currentQuestion: sanitizeQuestion(session.currentQuestion)
  };
}

/**
 * Admin Helper: Returns calibration metrics of question bank
 */
function getCalibrationHealth() {
  const questionBank = loadQuestionBank();
  if (!questionBank || questionBank.length === 0) {
    return { totalQuestions: 0, calibratedCount: 0, meanDifficulty: 0, meanDiscrimination: 0 };
  }

  let totalDifficulty = 0;
  let totalDiscrimination = 0;
  let calibratedCount = 0;
  let minDisc = Infinity;
  let maxDisc = -Infinity;

  for (const q of questionBank) {
    totalDifficulty += q.difficulty || DEFAULT_RATING;
    const a = q.discrimination !== undefined ? q.discrimination : 1.0;
    if (q.discrimination !== undefined) calibratedCount++;
    totalDiscrimination += a;
    if (a < minDisc) minDisc = a;
    if (a > maxDisc) maxDisc = a;
  }

  return {
    totalQuestions: questionBank.length,
    calibratedCount,
    meanDifficulty: Math.round(totalDifficulty / questionBank.length),
    meanDiscrimination: parseFloat((totalDiscrimination / questionBank.length).toFixed(2)),
    minDiscrimination: minDisc === Infinity ? 1.0 : minDisc,
    maxDiscrimination: maxDisc === -Infinity ? 1.0 : maxDisc
  };
}

/**
 * Admin Helper: Returns aggregated test-taking metrics
 */
function getAdminMetrics() {
  const uniqueSessions = new Set();
  const sessions = [];

  for (const [key, session] of sessionsStore.entries()) {
    if (session && session.sessionId && !uniqueSessions.has(session.sessionId)) {
      uniqueSessions.add(session.sessionId);
      sessions.push(session);
    }
  }

  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.isComplete).length;
  const totalQuestionsAnswered = sessions.reduce((sum, s) => sum + (s.history ? s.history.length : 0), 0);
  const avgQuestionsPerSession = totalSessions > 0 ? parseFloat((totalQuestionsAnswered / totalSessions).toFixed(1)) : 0;
  const completionRate = totalSessions > 0 ? parseFloat(((completedSessions / totalSessions) * 100).toFixed(1)) : 0;

  const calibrationHealth = getCalibrationHealth();

  return {
    totalSessions,
    completedSessions,
    activeSessions: totalSessions - completedSessions,
    totalQuestionsAnswered,
    avgQuestionsPerSession,
    completionRate,
    calibrationHealth,
    timestamp: new Date().toISOString()
  };
}

/**
 * Admin Helper: Returns integrity flags log across all sessions
 */
function getIntegrityReport() {
  const uniqueSessions = new Set();
  const flaggedSessions = [];

  for (const [key, session] of sessionsStore.entries()) {
    if (session && session.sessionId && !uniqueSessions.has(session.sessionId)) {
      uniqueSessions.add(session.sessionId);
      
      const fastAnswers = (session.history || []).filter(h => h.flaggedFastAnswer);
      const tabSwitches = session.tabSwitchCount || 0;

      if (fastAnswers.length > 0 || tabSwitches > 0) {
        flaggedSessions.push({
          sessionId: session.sessionId,
          userId: session.userId,
          targetRole: session.targetRole,
          questionsAnswered: session.history ? session.history.length : 0,
          fastAnswersCount: fastAnswers.length,
          tabSwitchCount: tabSwitches,
          fastAnswersDetails: fastAnswers.map(f => ({
            questionId: f.questionId,
            skillNode: f.skillNode,
            timeSpentMs: f.timeSpentMs
          }))
        });
      }
    }
  }

  return {
    flaggedSessionsCount: flaggedSessions.length,
    flaggedSessions,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  K_FACTOR,
  DEFAULT_RATING,
  MAX_QUESTIONS,
  STABILIZATION_THRESHOLD,
  loadQuestionBank,
  calculateExpectedScore,
  calculate2PLProbability,
  updateEloRating,
  update2PLRating,
  calculateStandardError,
  detectFastAnswer,
  calculateOverallRating,
  selectNextAdaptiveQuestion,
  shouldStopAssessment,
  startSession,
  submitAnswer,
  getAssessmentStatus,
  getCalibrationHealth,
  getAdminMetrics,
  getIntegrityReport
};

