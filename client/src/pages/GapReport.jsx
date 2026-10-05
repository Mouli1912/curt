import React, { useState, useEffect } from 'react';
import { fetchGapReport, fetchSkillGraph } from '../api/client';
import GraphCanvas from '../components/GraphCanvas';
import CredentialQR from '../components/CredentialQR';

export default function GapReport({ userId = 'pro-user', onNavigate }) {
  const [report, setReport] = useState(null);
  const [graphNodes, setGraphNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Credential Modal State
  const [activeCredentialModal, setActiveCredentialModal] = useState(null);
  const [mintingSkill, setMintingSkill] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    Promise.all([
      fetchGapReport(userId),
      fetchSkillGraph('frontend-developer')
    ])
      .then(([reportData, graphData]) => {
        if (!isMounted) return;
        setReport(reportData);
        setGraphNodes(graphData.nodes || []);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Failed to load gap report data:', err);
        setError('Failed to load gap report data. Please check backend server.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userId]);

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
      <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div className="card-white" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
          <h2 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 700 }}>
            Analyzing Skill Gaps & Topological Paths...
          </h2>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div className="card-white" style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Error Loading Report</h2>
          <p style={{ color: '#64748b' }}>{error || 'Unable to retrieve user gap report.'}</p>
        </div>
      </div>
    );
  }

  const readinessPercent = report.readinessPercent || 0;
  const gaps = report.gaps || [];
  const provenNodes = report.provenNodes || report.proven || [];

  return (
    <div className="container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="header-title-group">
            <div className="header-icon-box" style={{ background: '#eff6ff', color: '#2563eb' }}>
              🎯
            </div>
            <h1 className="page-title">Skill Gap Analysis Report</h1>
          </div>
          <p className="page-subtitle">
            Personalized learning path based on your adaptive Elo ratings and target role requirements.
          </p>
        </div>
      </div>

      {/* Overview Metric Banner */}
      <div className="card-white" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2.5rem', alignItems: 'center' }}>
          
          {/* Radial Readiness Gauge */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              position: 'relative',
              width: '140px',
              height: '140px',
              margin: '0 auto 0.75rem auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={readinessPercent >= 80 ? '#10b981' : readinessPercent >= 40 ? '#2563eb' : '#f59e0b'}
                  strokeWidth="3.5"
                  strokeDasharray={`${readinessPercent}, 100`}
                  style={{ transition: 'stroke-dasharray 0.8s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
                  {readinessPercent}%
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginTop: '0.2rem' }}>
                  Readiness
                </div>
              </div>
            </div>
          </div>

          {/* Text Metrics & Details */}
          <div>
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span style={{ background: '#eff6ff', color: '#2563eb', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                TARGET ROLE: {report.targetRole?.toUpperCase() || 'FRONTEND DEVELOPER'}
              </span>
              <span style={{ background: '#f8fafc', color: '#475569', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #e2e8f0' }}>
                USER: {userId}
              </span>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
              {readinessPercent >= 80 ? '🎉 Exceptional Job Readiness!' : readinessPercent >= 50 ? '⚡ Strong Core Foundation — Few Gaps Remain' : '📚 Priority Skill Upgrades Recommended'}
            </h2>

            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Topological analysis shows {provenNodes.length} proven skills out of {report.totalNodes || (provenNodes.length + gaps.length)} total role requirements.
              Follow the ordered path below to resolve prerequisite gaps.
            </p>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 700, color: '#047857' }}>
                <span>✓</span> {provenNodes.length} Proven Skills
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 700, color: '#b45309' }}>
                <span>⚡</span> {gaps.length} Target Gaps
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Visual Skill Graph Topology */}
      <GraphCanvas nodes={graphNodes} provenIds={provenNodes} gaps={gaps} />

      {/* Section 1: Ordered Learning Path (Gap Nodes) */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
              📋 Recommended Learning Path (Prerequisite-Ordered)
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Skills are ordered topographically so foundational prerequisites are completed first.
            </p>
          </div>
        </div>

        {gaps.length === 0 ? (
          <div className="card-white" style={{ padding: '2rem', textAlign: 'center', color: '#047857', background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
            🎉 Congratulations! You have no remaining skill gaps for this role!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {gaps.map((gap, idx) => {
              const isWeak = gap.status === 'weak';
              const statusColor = isWeak ? '#d97706' : '#2563eb';
              const statusBg = isWeak ? '#fef3c7' : '#eff6ff';

              return (
                <div key={gap.id} className="card-white" style={{ padding: '1.5rem', borderLeft: `6px solid ${statusColor}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: '#0f172a',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.85rem'
                      }}>
                        {idx + 1}
                      </span>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                        {gap.label}
                      </h3>
                      <span style={{
                        background: statusBg,
                        color: statusColor,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        textTransform: 'uppercase'
                      }}>
                        {gap.status === 'weak' ? '⚡ Attempted but Weak' : '○ Untouched'}
                      </span>
                    </div>

                    {gap.demandScore && (
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>
                        Market Demand: {Math.round(gap.demandScore * 100)}%
                      </span>
                    )}
                  </div>

                  {/* Prerequisites info */}
                  {gap.prerequisites && gap.prerequisites.length > 0 && (
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                      <span style={{ fontWeight: 700, color: '#475569' }}>Prerequisites: </span>
                      {gap.prerequisites.join(', ')}
                    </div>
                  )}

                  {/* Curated Resources List */}
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span>📚 Curated Free Resources:</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                      {gap.resources && gap.resources.length > 0 ? (
                        gap.resources.map((res, rIdx) => (
                          <a
                            key={rIdx}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: '0.75rem 1rem',
                              borderRadius: '8px',
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              textDecoration: 'none',
                              color: '#0f172a',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e40af' }}>
                                {res.title}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'capitalize' }}>
                                Type: {res.type || 'docs'} • Free Access
                              </div>
                            </div>
                            <span style={{ fontSize: '1rem', color: '#2563eb' }}>↗</span>
                          </a>
                        ))
                      ) : (
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No specific resources attached.</div>
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
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
          ✅ Proven Competencies & Signed Credentials
        </h2>

        {provenNodes.length === 0 ? (
          <div className="card-white" style={{ padding: '1.5rem', color: '#64748b' }}>
            No proven skills yet. Complete questions in the adaptive assessment to prove skills!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {provenNodes.map(node => {
              const label = typeof node === 'object' ? node.label : node;
              const id = typeof node === 'object' ? node.id : node;
              const isMinting = mintingSkill === id;

              return (
                <div key={id} style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '12px',
                  padding: '1.1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.85rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                      ✓
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: '#065f46', fontSize: '1rem' }}>{label}</div>
                      <div style={{ fontSize: '0.75rem', color: '#047857' }}>Proficiency Verified (≥1100 Elo)</div>
                    </div>
                  </div>

                  <button
                    className="btn-secondary"
                    onClick={() => handleClaimCredential(id)}
                    disabled={isMinting}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      background: '#ffffff',
                      borderColor: '#10b981',
                      color: '#047857',
                      cursor: 'pointer'
                    }}
                  >
                    {isMinting ? 'Minting ECDSA Signature...' : '🛡️ View Signed Credential'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Credential Modal Dialog */}
      {activeCredentialModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '1rem'
        }}>
          <div className="card-white" style={{ maxWidth: '640px', width: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🛡️</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
                  Signed ECDSA P-256 Credential
                </h3>
              </div>
              <button
                onClick={() => setActiveCredentialModal(null)}
                style={{ background: 'transparent', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <CredentialQR credential={activeCredentialModal} size={160} />
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700, color: '#64748b' }}>Student Name:</span>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>{activeCredentialModal.studentName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700, color: '#64748b' }}>Skill Node:</span>
                <span style={{ fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>{activeCredentialModal.skillNode}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700, color: '#64748b' }}>Elo Score:</span>
                <span style={{ fontWeight: 800, color: '#10b981' }}>{activeCredentialModal.score}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700, color: '#64748b' }}>Credential ID:</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#475569' }}>{activeCredentialModal.credentialId}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <button
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(activeCredentialModal, null, 2));
                  alert('Credential JSON copied to clipboard!');
                }}
              >
                📋 Copy Credential JSON
              </button>
              
              <button
                className="btn-primary"
                style={{ flex: 1 }}
                onClick={() => {
                  setActiveCredentialModal(null);
                  if (onNavigate) onNavigate('verify');
                }}
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
