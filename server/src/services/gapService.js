/**
 * Skill Gap Analysis & Topological Resource Routing Service
 * Pure graph algorithms for personalizing learning paths based on Elo ratings (No LLMs).
 */

const fs = require('fs');
const path = require('path');
const { getAssessmentStatus, calculateStandardError } = require('./eloService');

const PROFICIENCY_THRESHOLD = 1100;
const GRAPH_PATH = path.join(__dirname, '../../../data/skill_graph.json');

/**
 * Loads skill graph JSON
 */
function getSkillGraph(role = 'frontend-developer') {
  const possiblePaths = [
    path.join(__dirname, `../../../data/skill_graph_${role}.json`),
    path.join(__dirname, `../../data/skill_graph_${role}.json`),
    path.join(process.cwd(), `data/skill_graph_${role}.json`),
    GRAPH_PATH,
    path.join(__dirname, '../../data/skill_graph.json'),
    path.join(process.cwd(), 'data/skill_graph.json')
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.nodes)) {
          return parsed;
        }
      } catch (err) {
        console.warn(`[GapService Warning] Failed reading skill graph from ${p}:`, err.message);
      }
    }
  }
  return { role, nodes: [] };
}

/**
 * Pure Function: Topologically sorts skill nodes so that prerequisites strictly precede dependent skills.
 * Example: 'javascript' will always appear before 'react'.
 * 
 * @param {Array} nodes - List of skill node objects
 * @returns {Array} Topologically sorted skill node objects
 */
function sortSkillsTopologically(nodes) {
  if (!nodes || nodes.length === 0) return [];

  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const inDegree = new Map();
  const graph = new Map(); // prereq -> dependents

  // Initialize
  for (const node of nodes) {
    inDegree.set(node.id, 0);
    graph.set(node.id, []);
  }

  // Build graph edges and calculate in-degrees relative to the given nodes
  for (const node of nodes) {
    const prereqs = node.prerequisites || [];
    for (const prereqId of prereqs) {
      if (nodeMap.has(prereqId)) {
        graph.get(prereqId).push(node.id);
        inDegree.set(node.id, inDegree.get(node.id) + 1);
      }
    }
  }

  // Queue of nodes with 0 prerequisites in current subset
  const queue = [];
  for (const [id, count] of inDegree.entries()) {
    if (count === 0) {
      queue.push(id);
    }
  }

  // Sort queue by demandScore descending or preserve original order for stability
  queue.sort((a, b) => (nodeMap.get(b).demandScore || 0) - (nodeMap.get(a).demandScore || 0));

  const result = [];
  const visited = new Set();

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const currentNode = nodeMap.get(currentId);
    if (currentNode) {
      result.push(currentNode);
    }

    const neighbors = graph.get(currentId) || [];
    for (const neighborId of neighbors) {
      inDegree.set(neighborId, inDegree.get(neighborId) - 1);
      if (inDegree.get(neighborId) === 0) {
        queue.push(neighborId);
      }
    }
  }

  // Append any remaining unvisited nodes (if cycle exists or disconnected)
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      result.push(node);
    }
  }

  return result;
}

/**
 * Pure Function: Generates a skill gap report given a skill graph, learner ratings, and history.
 * 
 * @param {Object} skillGraph - Skill graph containing `nodes` array
 * @param {Object} learnerRatings - Object mapping skillNode IDs to numeric Elo ratings
 * @param {number} threshold - Elo threshold for proficiency (default 1100)
 * @param {Array} history - Optional assessment response history
 * @returns {Object} Gap report payload
 */
function generateGapReportPure(skillGraph, learnerRatings = {}, threshold = PROFICIENCY_THRESHOLD, history = []) {
  const nodes = skillGraph?.nodes || [];
  if (nodes.length === 0) {
    return {
      targetRole: skillGraph?.role || 'frontend-developer',
      readinessPercent: 0,
      proven: [],
      provenNodes: [],
      gaps: [],
      totalNodes: 0,
      provenCount: 0
    };
  }

  const provenNodes = [];
  const gapNodes = [];

  for (const node of nodes) {
    const rating = learnerRatings[node.id];
    let status = 'untouched';
    let isProven = false;

    if (rating !== undefined && rating !== null) {
      if (rating >= threshold) {
        status = 'proven';
        isProven = true;
      } else {
        status = 'weak';
        isProven = false;
      }
    }

    const seInfo = calculateStandardError ? calculateStandardError(node.id, history, rating || 1000) : { se: 100, label: 'Low Confidence' };

    const nodeItem = {
      id: node.id,
      label: node.label || node.id,
      category: node.category || 'General',
      demandScore: node.demandScore || 0,
      prerequisites: node.prerequisites || [],
      resources: node.resources || [],
      status,
      isProven,
      currentRating: rating !== undefined ? rating : null,
      standardError: seInfo.se,
      confidenceLabel: seInfo.label,
      confidenceBounds: rating !== undefined ? { lower: seInfo.lower, upper: seInfo.upper } : null
    };

    if (isProven) {
      provenNodes.push(nodeItem);
    } else {
      gapNodes.push(nodeItem);
    }
  }

  // Sort gap nodes topologically respecting prerequisites
  const sortedGaps = sortSkillsTopologically(gapNodes);

  const totalNodes = nodes.length;
  const provenCount = provenNodes.length;
  const readinessPercent = totalNodes > 0 ? Math.round((provenCount / totalNodes) * 100) : 0;

  return {
    targetRole: skillGraph?.role || 'frontend-developer',
    readinessPercent,
    proven: provenNodes.map(n => n.id),
    provenNodes,
    gaps: sortedGaps,
    totalNodes,
    provenCount
  };
}

/**
 * Service function to retrieve gap report for a specific userId
 * Fetches ratings from active session or fallback profile data.
 */
function generateGapReport(userId = 'pro-user', targetRole = 'frontend-developer', history = []) {
  if (typeof userId === 'object' && userId !== null) {
    const skillGraph = userId;
    const learnerRatings = typeof targetRole === 'object' && targetRole !== null ? targetRole : {};
    const responseHistory = Array.isArray(history) ? history : [];
    return generateGapReportPure(skillGraph, learnerRatings, PROFICIENCY_THRESHOLD, responseHistory);
  }

  const skillGraph = getSkillGraph(targetRole);
  
  // 1. Check if user has an active assessment session
  const status = getAssessmentStatus(userId);
  let learnerRatings = {};
  let userHistory = [];

  if (status && status.exists && status.ratings) {
    learnerRatings = status.ratings;
    userHistory = status.history || [];
  } else {
    // Demo fallback default ratings
    if (userId === 'pro-user') {
      learnerRatings = {
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
      };
    } else if (userId === 'mid-user') {
      learnerRatings = {
        html: 1200,
        css: 1100,
        javascript: 1150,
        git: 1150
      };
    } else {
      // fresh-user (0 ratings)
      learnerRatings = {};
    }
  }

  return generateGapReportPure(skillGraph, learnerRatings, PROFICIENCY_THRESHOLD, userHistory);
}

module.exports = {
  PROFICIENCY_THRESHOLD,
  sortSkillsTopologically,
  generateGapReportPure,
  generateGapReport,
  getSkillGraph
};
