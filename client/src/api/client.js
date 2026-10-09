/**
 * API client helper for fetching endpoints from Express backend
 */
let rawBase = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '');
if (rawBase && !rawBase.startsWith('http://') && !rawBase.startsWith('https://')) {
  rawBase = `https://${rawBase}`;
}
export const API_BASE_URL = rawBase;
const API_BASE = API_BASE_URL ? `${API_BASE_URL}/api` : '/api';

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

export async function startAssessment(userId = 'pro-user', targetRole = 'frontend-developer') {
  const response = await fetch(`${API_BASE}/assessment/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, targetRole })
  });
  if (!response.ok) {
    throw new Error(`Failed to start assessment: ${response.statusText}`);
  }
  return response.json();
}

export async function submitAnswer(userId, questionId, selectedIndex, timeSpentMs, tabSwitchCount) {
  const response = await fetch(`${API_BASE}/assessment/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, questionId, selectedIndex, timeSpentMs, tabSwitchCount })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to submit answer: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchAssessmentStatus(userId = 'pro-user') {
  const response = await fetch(`${API_BASE}/assessment/status/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch status for ${userId}: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchGapReport(userId = 'pro-user') {
  const response = await fetch(`${API_BASE}/report/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch gap report for ${userId}: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchAdminMetrics() {
  const response = await fetch(`${API_BASE}/admin/metrics`);
  if (!response.ok) {
    throw new Error(`Failed to fetch admin metrics: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchIntegrityReport() {
  const response = await fetch(`${API_BASE}/admin/integrity`);
  if (!response.ok) {
    throw new Error(`Failed to fetch integrity report: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchCalibration() {
  const response = await fetch(`${API_BASE}/admin/calibration`);
  if (!response.ok) {
    throw new Error(`Failed to fetch calibration health: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchAdminAnalytics() {
  const response = await fetch(`${API_BASE}/admin/analytics`);
  if (!response.ok) {
    throw new Error(`Failed to fetch admin analytics: ${response.statusText}`);
  }
  return response.json();
}

export async function searchRecruiterLearners(skill = '', role = 'all') {
  const params = new URLSearchParams();
  if (skill) params.append('skill', skill);
  if (role && role !== 'all') params.append('role', role);

  const response = await fetch(`${API_BASE}/recruiters/search?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Recruiter search failed: ${response.statusText}`);
  }
  return response.json();
}

export async function bulkVerifyCredentials(credentialIds = []) {
  const response = await fetch(`${API_BASE}/recruiters/bulk-verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credentialIds })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Bulk verification failed: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchPublicProfile(username) {
  const response = await fetch(`${API_BASE}/profile/${username}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch public profile for ${username}: ${response.statusText}`);
  }
  return response.json();
}

export async function updateDiscoverability(userId, isPubliclyDiscoverable) {
  const response = await fetch(`${API_BASE}/profile/discoverability`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, isPubliclyDiscoverable })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to update discoverability setting: ${response.statusText}`);
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

export async function issueCredential(userId, skillNode) {
  const response = await fetch(`${API_BASE}/credential/issue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, skillNode })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Failed to issue credential: ${response.statusText}`);
  }
  return data;
}

export async function verifyCredential(credentialData) {
  const response = await fetch(`${API_BASE}/credential/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentialData)
  });
  return response.json();
}

