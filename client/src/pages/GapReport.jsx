import React, { useState, useEffect } from 'react';
import { fetchGapReport, fetchSkillGraph } from '../api/client';
import GraphCanvas from '../components/GraphCanvas';
import CredentialQR from '../components/CredentialQR';
import ConfettiEffect from '../components/ConfettiEffect';
import { GraphSkeleton, CardGridSkeleton } from '../components/SkeletonLoader';

export default function GapReport({ userId = 'pro-user', targetRole = 'frontend-developer', onNavigate }) {
  const [report, setReport] = useState(null);
  const [graphNodes, setGraphNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Credential Modal State
  const [activeCredentialModal, setActiveCredentialModal] = useState(null);
  const [mintingSkill, setMintingSkill] = useState(null);

  const loadData = () => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetchGapReport(userId),
      fetchSkillGraph(targetRole)
    ])
      .then(([reportData, graphData]) => {
        setReport(reportData);
        setGraphNodes(graphData.nodes || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load gap report data:', err);
        setError('Failed to load skill gap report. Ensure backend server is running.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [userId, targetRole]);

  const handleClaimCredential = async (skillId) => {
    try {
      setMintingSkill(skillId);
      const res = await fetch('/api/credential/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, skillNode: skillId })
      });
      const credData = await res.json();
      if (!res.ok) {
        throw new Error(credData.error || 'Failed to mint credential');
      }
      setActiveCredentialModal(credData);
    } catch (err) {
      alert(`Credential Issue Error: ${err.message}`);
    } finally {
      setMintingSkill(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 pt-4">
        <GraphSkeleton />
        <CardGridSkeleton count={3} />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="bg-danger-50 dark:bg-danger-950/40 border border-danger-200 dark:border-danger-900/60 rounded-2xl p-8 space-y-4">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-xl font-bold text-danger-800 dark:text-danger-200">Error Loading Gap Report</h2>
          <p className="text-sm text-danger-600 dark:text-danger-300">{error || 'Unable to retrieve user gap report.'}</p>
          <button
            onClick={loadData}
            className="px-6 py-2.5 bg-danger-600 hover:bg-danger-500 text-white rounded-xl text-sm font-bold shadow-md transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const readinessPercent = report.readinessPercent || 0;
  const gaps = report.gaps || [];
  const provenNodes = report.provenNodes || report.proven || [];
  const isFreshUser = userId === 'fresh-user' || (provenNodes.length === 0 && readinessPercent === 0);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/80 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xl font-extrabold border border-primary-200 dark:border-primary-800">
              🎯
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Skill Gap Analysis & Roadmap
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Prerequisite-ordered learning path customized to your Elo rating profile and target role.
          </p>
        </div>
      </div>

      {/* Overview Metric Banner */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Radial Readiness Gauge */}
          <div className="md:col-span-4 text-center">
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  className="stroke-neutral-200 dark:stroke-neutral-800"
                  strokeWidth="3.5"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={readinessPercent >= 80 ? '#10b981' : readinessPercent >= 40 ? '#3b82f6' : '#f59e0b'}
                  strokeWidth="3.5"
                  strokeDasharray={`${readinessPercent}, 100`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-neutral-900 dark:text-white leading-none">
                  {readinessPercent}%
                </span>
                <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 mt-1 uppercase tracking-wider">
                  Readiness
                </span>
              </div>
            </div>
          </div>

          {/* Text Metrics & Details */}
          <div className="md:col-span-8 space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-md text-xs font-extrabold bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 border border-primary-200 dark:border-primary-800 uppercase tracking-wide">
                TARGET ROLE: {report.targetRole?.toUpperCase() || 'FRONTEND DEVELOPER'}
              </span>
              <span className="px-3 py-1 rounded-md text-xs font-bold bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 font-mono">
                ACCOUNT: {userId}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white">
              {readinessPercent >= 80
                ? '🎉 Exceptional Job Readiness!'
                : readinessPercent >= 40
                ? '⚡ Strong Core Foundation — Key Gaps Remain'
                : '🌱 Fresh Onboarding — Ready to Build Skills'}
            </h2>

            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Topological DAG analysis shows <strong className="text-neutral-900 dark:text-white">{provenNodes.length} proven skills</strong> out of <strong className="text-neutral-900 dark:text-white">{report.totalNodes || (provenNodes.length + gaps.length)} required skills</strong>.
              Follow the prerequisite path below to upgrade targeted competencies.
            </p>

            <div className="flex gap-6 pt-2 text-xs sm:text-sm font-bold">
              <div className="flex items-center gap-1.5 text-success-600 dark:text-success-400">
                <span>✓</span> {provenNodes.length} Proven Competencies
              </div>
              <div className="flex items-center gap-1.5 text-warning-600 dark:text-warning-400">
                <span>⚡</span> {gaps.length} Actionable Gaps
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Visual Skill Graph Topology */}
      <GraphCanvas nodes={graphNodes} provenIds={provenNodes} gaps={gaps} />

      {/* Fresh User Special Inviting State */}
      {isFreshUser && (
        <div className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700 text-white rounded-3xl p-8 sm:p-10 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-white">
                <span>🌱</span> Fresh Learner Persona Active
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Start Your Adaptive Assessment Journey
              </h2>
              <p className="text-sm opacity-90 leading-relaxed">
                You have 0 proven skills on record. Complete our 100% deterministic Elo assessment to measure your baseline rating and unlock cryptographically signed credentials!
              </p>
            </div>

            <button
              onClick={() => onNavigate && onNavigate('assessment')}
              className="px-6 py-4 rounded-2xl bg-white text-primary-700 font-extrabold text-sm sm:text-base hover:bg-neutral-100 shadow-xl shadow-black/10 hover:-translate-y-0.5 transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-white"
            >
              ⚡ Start Assessment Now →
            </button>
          </div>
        </div>
      )}

      {/* Section 1: Ordered Learning Path (Gap Nodes) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>📋</span> Prerequisite-Ordered Learning Path
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Sorted topographically so foundational prerequisite skills are mastered first.
            </p>
          </div>
        </div>

        {gaps.length === 0 ? (
          <div className="bg-success-50 dark:bg-success-950/40 border border-success-200 dark:border-success-900/60 rounded-2xl p-6 text-center text-success-800 dark:text-success-200 font-bold">
            🎉 Congratulations! You have no remaining skill gaps for this target role!
          </div>
        ) : (
          <div className="space-y-4">
            {gaps.map((gap, idx) => {
              const isWeak = gap.status === 'weak';

              return (
                <div
                  key={gap.id}
                  className={`bg-white dark:bg-neutral-900 border-l-4 border rounded-2xl p-5 sm:p-6 shadow-sm transition-all hover:shadow-md ${
                    isWeak
                      ? 'border-l-warning-500 border-neutral-200 dark:border-neutral-800'
                      : 'border-l-primary-500 border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-black text-xs shrink-0">
                        {idx + 1}
                      </span>
                      <h3 className="text-base sm:text-lg font-extrabold text-neutral-900 dark:text-white">
                        {gap.label}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wide ${
                        isWeak
                          ? 'bg-warning-100 text-warning-800 dark:bg-warning-950 dark:text-warning-300 border border-warning-200 dark:border-warning-800'
                          : 'bg-primary-100 text-primary-800 dark:bg-primary-950 dark:text-primary-300 border border-primary-200 dark:border-primary-800'
                      }`}>
                        {isWeak ? '⚡ Attempted (Weak)' : '○ Untouched'}
                      </span>
                    </div>

                    {gap.demandScore && (
                      <div className="flex flex-col items-end gap-1 self-start sm:self-auto">
                        <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-md">
                          Market Demand: {Math.round(gap.demandScore * 100)}%
                        </span>
                        {gap.currentRating !== null && gap.currentRating !== undefined && (
                          <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                            {gap.currentRating} Elo {gap.standardError ? `(±${gap.standardError} SE)` : ''} • <span className={`font-bold ${gap.confidenceLabel === 'High Confidence' ? 'text-success-600 dark:text-success-400' : gap.confidenceLabel === 'Medium Confidence' ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-400'}`}>{gap.confidenceLabel || 'Low Confidence'}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Prerequisites info */}
                  {gap.prerequisites && gap.prerequisites.length > 0 && (
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                      <span className="font-semibold text-neutral-700 dark:text-neutral-300">Prerequisites: </span>
                      {gap.prerequisites.join(', ')}
                    </div>
                  )}

                  {/* Curated Resources List */}
                  <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-1.5">
                      <span>📚</span> Curated Free Learning Resources:
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {gap.resources && gap.resources.length > 0 ? (
                        gap.resources.map((res, rIdx) => (
                          <a
                            key={rIdx}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-500 flex justify-between items-center text-xs transition-colors group"
                          >
                            <div>
                              <div className="font-bold text-primary-700 dark:text-primary-400 group-hover:underline">
                                {res.title}
                              </div>
                              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 capitalize mt-0.5">
                                Type: {res.type || 'docs'} • Free Access
                              </div>
                            </div>
                            <span className="text-primary-600 dark:text-primary-400 font-bold ml-2 text-sm">↗</span>
                          </a>
                        ))
                      ) : (
                        <div className="text-xs text-neutral-400 italic">No specific resources attached.</div>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 2: Proven Competencies & Credential Claiming */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
          <span>✅</span> Proven Competencies & Signed Credentials
        </h2>

        {provenNodes.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 text-center text-neutral-500 dark:text-neutral-400 text-sm">
            No proven skills recorded yet. Complete questions in the adaptive assessment to prove competencies!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {provenNodes.map(node => {
              const label = typeof node === 'object' ? node.label : node;
              const id = typeof node === 'object' ? node.id : node;
              const isMinting = mintingSkill === id;

              return (
                <div
                  key={id}
                  className="bg-success-50/60 dark:bg-success-950/40 border border-success-200 dark:border-success-900/60 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-success-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                      ✓
                    </div>
                    <div>
                      <div className="font-extrabold text-success-900 dark:text-success-100 text-base">{label}</div>
                      <div className="text-xs text-success-700 dark:text-success-300 font-medium">Proficiency Verified (≥1100 Elo)</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleClaimCredential(id)}
                    disabled={isMinting}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-white dark:bg-neutral-900 text-success-800 dark:text-success-200 border border-success-300 dark:border-success-700 hover:bg-success-50 dark:hover:bg-neutral-800 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-success-500"
                  >
                    {isMinting ? 'Minting ECDSA Signature...' : '🛡️ View Signed Credential'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Celebratory Credential Modal Dialog */}
      {activeCredentialModal && (
        <div className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-pop-in">
            {/* Festive Confetti particles */}
            <ConfettiEffect />

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-2xl animate-celebrate-bounce">🛡️</span>
                <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white">
                  Signed ECDSA P-256 Credential
                </h3>
              </div>
              <button
                onClick={() => setActiveCredentialModal(null)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white text-xl font-bold p-1"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="text-center py-2">
              <CredentialQR credential={activeCredentialModal} size={160} />
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-800/80 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="font-semibold text-neutral-500 dark:text-neutral-400">Student Name:</span>
                <span className="font-bold text-neutral-900 dark:text-white">{activeCredentialModal.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-neutral-500 dark:text-neutral-400">Skill Node:</span>
                <span className="font-bold text-primary-600 dark:text-primary-400 uppercase">{activeCredentialModal.skillNode}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-neutral-500 dark:text-neutral-400">Elo Score:</span>
                <span className="font-extrabold text-success-600 dark:text-success-400">{activeCredentialModal.score} Elo</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-neutral-500 dark:text-neutral-400">Credential ID:</span>
                <span className="font-mono text-xs text-neutral-600 dark:text-neutral-300">{activeCredentialModal.credentialId}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(activeCredentialModal, null, 2));
                  alert('Credential JSON copied to clipboard!');
                }}
                className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                📋 Copy Credential JSON
              </button>
              
              <button
                onClick={() => {
                  setActiveCredentialModal(null);
                  if (onNavigate) onNavigate('verify');
                }}
                className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-primary-600 hover:bg-primary-500 shadow-md transition-colors"
              >
                🛡️ Open Public Verifier →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
