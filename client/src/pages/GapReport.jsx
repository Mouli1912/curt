import React, { useState, useEffect } from 'react';
import { fetchGapReport, fetchSkillGraph, issueCredential } from '../api/client';
import GraphCanvas from '../components/GraphCanvas';
import CredentialQR from '../components/CredentialQR';

export default function GapReport({ userId = 'demo-user' }) {
  const [report, setReport] = useState(null);
  const [graphNodes, setGraphNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCredential, setActiveCredential] = useState(null);
  const [credentialError, setCredentialError] = useState(null);
  const [mintingNode, setMintingNode] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [reportData, graphData] = await Promise.all([
        fetchGapReport(userId),
        fetchSkillGraph('frontend-developer')
      ]);
      setReport(reportData);
      setGraphNodes(graphData?.nodes || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load gap report data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const handleMintCredential = async (nodeId) => {
    setMintingNode(nodeId);
    setCredentialError(null);
    setActiveCredential(null);
    try {
      const cred = await issueCredential(userId, nodeId, 'Alex Learner');
      setActiveCredential(cred);
    } catch (err) {
      console.error('Failed to issue credential:', err);
      setCredentialError(err.message);
    } finally {
      setMintingNode(null);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading" style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>Traversing Skill Graph & Generating Topological Gap Report...</h2>
          <p style={{ color: 'var(--text-muted)' }}>Calculating prerequisite dependencies and readiness metrics</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ color: '#ef4444' }}>Error Generating Gap Report</h2>
          <p>{error}</p>
          <button onClick={loadData} className="btn-primary" style={{ marginTop: '1rem' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Page Header */}
      <header style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="logo-badge">Gap Analysis & Credentials — Steps 3 & 4</span>
            <h1 style={{ fontSize: '1.8rem', margin: '0.25rem 0' }}>Role Readiness & Digital Credentials</h1>
            <p className="subtitle" style={{ margin: 0, fontSize: '0.95rem' }}>
              Target Role: <strong>{report?.roleTitle || report?.targetRole}</strong> — Topologically ordered pathway.
            </p>
          </div>

          {/* Readiness Percentage Hero Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0f172a, #1e293b)',
              border: '1px solid #334155',
              padding: '1.25rem 1.75rem',
              borderRadius: '16px',
              textAlign: 'center',
              minWidth: '200px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 600 }}>
              Role Readiness
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981', lineHeight: 1.1 }}>
              {report?.readinessPercent}%
            </div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
              {report?.provenCount} of {report?.totalNodes} Skills Proven
            </div>
          </div>
        </div>

        {/* Zero LLM Banner */}
        <div className="no-llm-banner" style={{ marginTop: '1.25rem' }}>
          <span>⚡ <strong>Pure Graph Math & ECDSA P-256 Cryptography:</strong> No LLM APIs. Offline verifiable credentials.</span>
        </div>
      </header>

      {/* Active Credential Modal / Card */}
      {activeCredential && (
        <div style={{ marginBottom: '2.5rem', animation: 'fadeIn 0.3s ease-in' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#34d399' }}>
              🎉 Cryptographic Digital Credential Minted!
            </h3>
            <button
              onClick={() => setActiveCredential(null)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
          <CredentialQR credential={activeCredential} />
        </div>
      )}

      {credentialError && (
        <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          ⚠️ <strong>Credential Minting Notice:</strong> {credentialError}
        </div>
      )}

      {/* Visual Skill Taxonomy Graph Canvas */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', fontWeight: 600 }}>Interactive Skill Graph Canvas</h2>
        <GraphCanvas nodes={graphNodes} proven={report?.proven} gaps={report?.gaps} />
      </section>

      <main style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
        {/* Topologically Ordered Gaps Section */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🚀 Ordered Skill Gap Pathway</span>
              <span className="category-tag" style={{ background: '#f59e0b22', color: '#f59e0b', border: '1px solid #f59e0b44' }}>
                {report?.gapCount} Gaps Remaining
              </span>
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Ordered so prerequisites precede dependent skills
            </span>
          </div>

          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {report?.gaps.map((gapNode, index) => {
              const isWeak = gapNode.status === 'weak';
              return (
                <div
                  key={gapNode.id}
                  className="card"
                  style={{
                    padding: '1.5rem',
                    borderLeft: isWeak ? '4px solid #f59e0b' : '4px solid #64748b',
                    background: isWeak ? 'rgba(245, 158, 11, 0.04)' : 'var(--bg-card)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: '0.5rem' }}>
                        Step #{index + 1}
                      </span>
                      <h3 style={{ display: 'inline', fontSize: '1.2rem', fontWeight: 700 }}>
                        {gapNode.label}
                      </h3>
                      <span className="category-tag" style={{ marginLeft: '0.75rem' }}>
                        {gapNode.category}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          textTransform: 'uppercase',
                          background: isWeak ? '#f59e0b22' : '#334155',
                          color: isWeak ? '#fbbf24' : '#94a3b8',
                          border: `1px solid ${isWeak ? '#f59e0b44' : '#475569'}`
                        }}
                      >
                        {isWeak ? '⚠ Attempted (Weak)' : '⭕ Untouched'}
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#a5b4fc', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>
                        {gapNode.rating} Elo
                      </span>
                    </div>
                  </div>

                  {gapNode.prerequisites && gapNode.prerequisites.length > 0 && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      <strong>Prerequisites:</strong> {gapNode.prerequisites.join(', ')}
                    </div>
                  )}

                  {/* Curated Resources Links */}
                  {gapNode.resources && gapNode.resources.length > 0 && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.6rem', color: '#cbd5e1' }}>
                        📚 Curated Free Learning Resources:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                        {gapNode.resources.map((res, rIdx) => (
                          <a
                            key={rIdx}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.6rem 1rem',
                              borderRadius: '8px',
                              background: '#1e293b',
                              border: '1px solid #334155',
                              color: '#38bdf8',
                              textDecoration: 'none',
                              fontSize: '0.875rem',
                              fontWeight: 500,
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <span>🔗 {res.title}</span>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                padding: '0.15rem 0.4rem',
                                borderRadius: '4px',
                                background: '#0f172a',
                                color: '#94a3b8',
                                textTransform: 'uppercase'
                              }}
                            >
                              {res.type}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Proven Skills Section */}
        {report?.proven && report.proven.length > 0 && (
          <section>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>✅ Proven Skills (≥ 1100 Elo)</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>({report.proven.length})</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {report.proven.map(pNode => (
                <div
                  key={pNode.id}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#f8fafc' }}>
                      ✓ {pNode.label}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>
                      {pNode.rating} Elo
                    </div>
                  </div>

                  <button
                    onClick={() => handleMintCredential(pNode.id)}
                    disabled={mintingNode === pNode.id}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '6px',
                      background: '#10b981',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    {mintingNode === pNode.id ? 'Minting...' : '🔏 Claim Credential'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
