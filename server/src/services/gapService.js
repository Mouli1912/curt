/**
 * Gap Report Service
 * Topological graph traversal and gap classification engine.
 * Zero LLM / external API dependencies.
 */

const PROFICIENCY_THRESHOLD = 1100;

/**
 * Performs a topological sort on skill graph nodes using Kahn's Algorithm.
 * Guarantees foundational prerequisite nodes appear before dependent nodes.
 * 
 * @param {Array<Object>} nodes - Array of skill graph node objects
 * @returns {Array<Object>} Topologically ordered array of nodes
 */
function topologicalSortNodes(nodes) {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const inDegree = new Map();
  const adjList = new Map();

  // Initialize graph structures
  nodes.forEach(n => {
    inDegree.set(n.id, 0);
    adjList.set(n.id, []);
  });

  // Build edges: prerequisite -> node
  nodes.forEach(n => {
    const prereqs = n.prerequisites || [];
    prereqs.forEach(preId => {
      if (nodeMap.has(preId)) {
        adjList.get(preId).push(n.id);
        inDegree.set(n.id, inDegree.get(n.id) + 1);
      }
    });
  });

  // Queue of nodes with 0 prerequisites
  const queue = [];
  nodes.forEach(n => {
    if (inDegree.get(n.id) === 0) {
      queue.push(n.id);
    }
  });

  // Sort queue by demandScore descending for deterministic, intuitive tie-breaking
  queue.sort((a, b) => (nodeMap.get(b).demandScore || 0) - (nodeMap.get(a).demandScore || 0));

  const sortedNodes = [];

  while (queue.length > 0) {
    const currentId = queue.shift();
    sortedNodes.push(nodeMap.get(currentId));

    const neighbors = adjList.get(currentId) || [];
    // Sort neighbors by demand score
    neighbors.sort((a, b) => (nodeMap.get(b).demandScore || 0) - (nodeMap.get(a).demandScore || 0));

    for (const neighborId of neighbors) {
      const newDegree = inDegree.get(neighborId) - 1;
      inDegree.set(neighborId, newDegree);
      if (newDegree === 0) {
        queue.push(neighborId);
      }
    }
  }

  // Handle any cycles gracefully by appending any missing nodes
  if (sortedNodes.length < nodes.length) {
    const includedSet = new Set(sortedNodes.map(n => n.id));
    nodes.forEach(n => {
      if (!includedSet.has(n.id)) {
        sortedNodes.push(n);
      }
    });
  }

  return sortedNodes;
}

/**
 * Classifies a node given learner rating and assessment history.
 * 
 * @param {string} nodeId - Skill node ID
 * @param {Object} learnerRatings - Object mapping nodeId to numeric Elo rating
 * @param {Array<Object>} history - Array of answered question history items
 * @returns {'proven' | 'weak' | 'untouched'} Skill status
 */
function classifyNodeStatus(nodeId, learnerRatings = {}, history = []) {
  const rating = learnerRatings[nodeId];
  const attemptedInHistory = Array.isArray(history) && history.some(h => h.skillNode === nodeId);

  if (rating !== undefined && rating >= PROFICIENCY_THRESHOLD) {
    return 'proven';
  } else if (attemptedInHistory || (rating !== undefined && rating < PROFICIENCY_THRESHOLD && rating !== 1000)) {
    return 'weak';
  }
  return 'untouched';
}

/**
 * Generates an actionable gap report sorted topologically by prerequisites.
 * Pure function: zero side-effects.
 * 
 * @param {Object} skillGraph - The loaded skill graph object ({ role, nodes: [...] })
 * @param {Object} learnerRatings - Map of { [skillNodeId]: rating }
 * @param {Array<Object>} history - Array of answered history items
 * @returns {Object} Gap report payload
 */
function generateGapReport(skillGraph, learnerRatings = {}, history = []) {
  if (!skillGraph || !Array.isArray(skillGraph.nodes)) {
    throw new Error('Invalid skill graph provided to generateGapReport.');
  }

  const sortedNodes = topologicalSortNodes(skillGraph.nodes);
  const provenList = [];
  const gapList = [];

  sortedNodes.forEach(node => {
    const status = classifyNodeStatus(node.id, learnerRatings, history);
    const currentRating = learnerRatings[node.id] !== undefined ? learnerRatings[node.id] : 1000;

    const nodePayload = {
      id: node.id,
      label: node.label,
      category: node.category,
      prerequisites: node.prerequisites || [],
      demandScore: node.demandScore || 0,
      rating: currentRating,
      status,
      resources: node.resources || []
    };

    if (status === 'proven') {
      provenList.push(nodePayload);
    } else {
      gapList.push(nodePayload);
    }
  });

  const totalNodes = skillGraph.nodes.length;
  const provenCount = provenList.length;
  const readinessPercent = totalNodes > 0 ? Math.round((provenCount / totalNodes) * 100) : 0;

  return {
    targetRole: skillGraph.role || 'frontend-developer',
    roleTitle: skillGraph.title || 'Frontend Developer Skill Graph',
    readinessPercent,
    provenCount,
    gapCount: gapList.length,
    totalNodes,
    proven: provenList,
    gaps: gapList,
    proficiencyThreshold: PROFICIENCY_THRESHOLD
  };
}

module.exports = {
  PROFICIENCY_THRESHOLD,
  topologicalSortNodes,
  classifyNodeStatus,
  generateGapReport
};
