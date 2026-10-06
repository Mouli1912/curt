import React, { useState, useEffect } from 'react';
import { searchRecruiterLearners, bulkVerifyCredentials } from '../api/client';

export default function RecruiterSearch({ onSelectProfile }) {
  const [activeSubTab, setActiveSubTab] = useState('search'); // 'search' | 'bulk'

  // Candidate Search State
  const [skillQuery, setSkillQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Bulk Verification State
  const [bulkInput, setBulkInput] = useState('');
  const [bulkResults, setBulkResults] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState(null);

  const fetchCandidates = () => {
    setLoading(true);
    setError(null);

    searchRecruiterLearners(skillQuery, roleFilter)
      .then((data) => {
        setCandidates(data.learners || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Candidate search failed:', err);
        setError('Failed to search candidates. Ensure server is running.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCandidates();
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCandidates();
  };

  const handleRunBulkVerify = async () => {
    if (!bulkInput.trim()) return;

    setBulkLoading(true);
    setBulkError(null);

    // Split input by newlines, commas, or spaces
    const ids = bulkInput
      .split(/[\n,\s]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    try {
      const summary = await bulkVerifyCredentials(ids);
      setBulkResults(summary);
    } catch (err) {
      console.error('Bulk verify error:', err);
      setBulkError(err.message || 'Bulk verification failed.');
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-950/80 text-accent-600 dark:text-accent-400 flex items-center justify-center text-xl font-extrabold border border-accent-200 dark:border-accent-800">
              💼
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Recruiter Talent Registry & Discovery
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Search verified candidates by proven skill competencies or bulk-verify ECDSA credential callsets.
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl self-start sm:self-auto border border-neutral-200 dark:border-neutral-700">
          <button
            onClick={() => setActiveSubTab('search')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${
              activeSubTab === 'search'
                ? 'bg-white dark:bg-neutral-900 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            🔍 Talent Search
          </button>
          <button
            onClick={() => setActiveSubTab('bulk')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${
              activeSubTab === 'bulk'
                ? 'bg-white dark:bg-neutral-900 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            ⚡ Bulk Verify
          </button>
        </div>
      </div>

      {/* VIEW 1: Candidate Search */}
      {activeSubTab === 'search' && (
        <div className="space-y-6">
          {/* Search Controls Card */}
          <form onSubmit={handleSearchSubmit} className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
              
              <div className="sm:col-span-6 space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  Proven Skill Keyword
                </label>
                <input
                  type="text"
                  placeholder="e.g. react, javascript, python, sql..."
                  value={skillQuery}
                  onChange={(e) => setSkillQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="sm:col-span-4 space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  Target Career Role
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm font-bold text-primary-600 dark:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="frontend-developer">🎨 Frontend Developer</option>
                  <option value="backend-developer">⚙️ Backend Developer</option>
                  <option value="data-analyst">📊 Data Analyst</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Search →
                </button>
              </div>

            </div>

            <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-2 pt-1 border-t border-neutral-100 dark:border-neutral-800">
              <span>🔒 Privacy Guarantee:</span>
              <span>Only candidates who opted into public discoverability appear. Only proven skills are exposed; raw score histories remain private.</span>
            </div>
          </form>

          {/* Candidates Results List */}
          {loading ? (
            <div className="space-y-4">
              <div className="h-32 bg-neutral-200 dark:bg-neutral-800/60 rounded-2xl animate-pulse" />
              <div className="h-32 bg-neutral-200 dark:bg-neutral-800/60 rounded-2xl animate-pulse" />
            </div>
          ) : error ? (
            <div className="p-6 bg-danger-50 dark:bg-danger-950/40 text-danger-700 dark:text-danger-300 rounded-2xl text-center text-sm font-bold">
              {error}
            </div>
          ) : candidates.length === 0 ? (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-12 text-center text-neutral-500 dark:text-neutral-400 space-y-2">
              <div className="text-4xl">🔍</div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">No Matching Candidates Found</h3>
              <p className="text-xs max-w-md mx-auto">
                Try searching for skills like "react" or "javascript" or clearing your skill keyword filter.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Showing {candidates.length} Verified Discoverable Candidates
              </div>

              {candidates.map((candidate) => (
                <div
                  key={candidate.userId}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                        {candidate.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white">
                          {candidate.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <span className="font-mono font-semibold">@{candidate.username}</span>
                          <span>•</span>
                          <span className="uppercase font-bold text-primary-600 dark:text-primary-400">
                            {candidate.targetRole}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Proven Skills Badges */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {candidate.provenSkills && candidate.provenSkills.length > 0 ? (
                        candidate.provenSkills.map((skill) => (
                          <span
                            key={skill.id}
                            className="px-3 py-1 rounded-lg text-xs font-bold bg-success-50 text-success-800 dark:bg-success-950/80 dark:text-success-200 border border-success-200 dark:border-success-800 flex items-center gap-1.5"
                          >
                            <span>✓</span> {skill.label}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-neutral-400 italic">No proven skills recorded.</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="text-xs font-extrabold text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-950/50 px-3 py-1 rounded-full border border-success-200 dark:border-success-800">
                      {candidate.readinessPercent}% Verified Job Readiness
                    </div>

                    <button
                      onClick={() => onSelectProfile && onSelectProfile(candidate.username)}
                      className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-900 text-xs font-extrabold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      View Shareable Public Profile →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: Bulk Verification */}
      {activeSubTab === 'bulk' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>📋</span> Batch Candidate Credential Verifier
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Paste multiple credential IDs (separated by commas, spaces, or newlines) to verify ECDSA signatures and revocation statuses in a single pass.
            </p>

            <textarea
              rows={5}
              placeholder="Paste credential IDs (e.g. cred-1741234567-a1b2, cred-1741234890-c3d4)..."
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              className="w-full p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setBulkInput('cred-demo-pro-1, cred-demo-mid-1, cred-tampered-invalid-99');
                }}
                className="px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-bold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                Load Demo Sample Callset
              </button>

              <button
                type="button"
                onClick={handleRunBulkVerify}
                disabled={bulkLoading || !bulkInput.trim()}
                className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-extrabold shadow-md transition-all disabled:opacity-50"
              >
                {bulkLoading ? 'Verifying Batch...' : 'Run Bulk Verification →'}
              </button>
            </div>
          </div>

          {bulkError && (
            <div className="p-4 bg-danger-50 text-danger-700 dark:bg-danger-950 dark:text-danger-200 rounded-2xl text-xs font-bold border border-danger-200">
              {bulkError}
            </div>
          )}

          {/* Bulk Results Table */}
          {bulkResults && (
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
                  Batch Verification Summary
                </h3>

                <div className="flex gap-2 text-xs font-bold">
                  <span className="px-2.5 py-1 rounded-md bg-success-100 text-success-800 dark:bg-success-950 dark:text-success-200">
                    Valid: {bulkResults.validCount}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-warning-100 text-warning-800 dark:bg-warning-950 dark:text-warning-200">
                    Revoked: {bulkResults.revokedCount}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-danger-100 text-danger-800 dark:bg-danger-950 dark:text-danger-200">
                    Invalid/Missing: {bulkResults.invalidCount}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800 font-extrabold text-neutral-500 uppercase tracking-wider">
                      <th className="py-3 px-3">Credential ID</th>
                      <th className="py-3 px-3">Student Name</th>
                      <th className="py-3 px-3">Skill Node</th>
                      <th className="py-3 px-3">Score</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {bulkResults.results.map((res, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        <td className="py-3 px-3 font-mono font-bold text-neutral-900 dark:text-white">{res.credentialId}</td>
                        <td className="py-3 px-3 font-semibold">{res.studentName}</td>
                        <td className="py-3 px-3 uppercase font-bold text-primary-600 dark:text-primary-400">{res.skillNode}</td>
                        <td className="py-3 px-3 font-bold">{res.score ? `${res.score} Elo` : 'N/A'}</td>
                        <td className="py-3 px-3">
                          {res.valid ? (
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-black bg-success-100 text-success-800 dark:bg-success-950 dark:text-success-200 border border-success-300">
                              ✓ VALID
                            </span>
                          ) : res.revoked ? (
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-black bg-warning-100 text-warning-800 dark:bg-warning-950 dark:text-warning-200 border border-warning-300">
                              ⚠️ REVOKED
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-black bg-danger-100 text-danger-800 dark:bg-danger-950 dark:text-danger-200 border border-danger-300">
                              ✕ INVALID
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
