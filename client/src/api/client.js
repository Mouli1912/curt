/**
 * API client helper for fetching endpoints from Express backend
 */
const API_BASE = '/api';

export async function fetchSkillGraph(role = 'frontend-developer') {
  const response = await fetch(`${API_BASE}/graph/${role}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch skill graph for role ${role}: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchHealth() {
  const response = await fetch(`${API_BASE}/health`);
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.statusText}`);
  }
  return response.json();
}

export async function startAssessment(userId = 'demo-user', targetRole = 'frontend-developer') {
  const response = await fetch(`${API_BASE}/assessment/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, targetRole })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to start assessment: ${response.statusText}`);
  }
  return response.json();
}

export async function submitAnswer(userId, questionId, selectedIndex) {
  const response = await fetch(`${API_BASE}/assessment/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, questionId, selectedIndex })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to submit answer: ${response.statusText}`);
  }
  return response.json();
}

export async function getAssessmentStatus(userId = 'demo-user') {
  const response = await fetch(`${API_BASE}/assessment/status/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to get status for user ${userId}: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchGapReport(userId = 'demo-user') {
  const response = await fetch(`${API_BASE}/report/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch gap report for user ${userId}: ${response.statusText}`);
  }
  return response.json();
}

export async function issueCredential(userId = 'demo-user', skillNode, studentName = 'Alex Learner') {
  const response = await fetch(`${API_BASE}/credential/issue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, skillNode, studentName })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to issue credential: ${response.statusText}`);
  }
  return response.json();
}

export async function verifyCredential(credentialObj) {
  const response = await fetch(`${API_BASE}/credential/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentialObj)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to verify credential: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchPublicKey() {
  const response = await fetch(`${API_BASE}/credential/public-key`);
  if (!response.ok) {
    throw new Error(`Failed to fetch public key: ${response.statusText}`);
  }
  return response.json();
}

export async function getCredentialById(credentialId) {
  const response = await fetch(`${API_BASE}/credential/${credentialId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch credential ${credentialId}: ${response.statusText}`);
  }
  return response.json();
}
