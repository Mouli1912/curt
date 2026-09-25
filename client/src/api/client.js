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
