import React, { useEffect, useState } from 'react';
import { fetchSkillGraph } from '../api/client';

export default function Landing({ onNavigate }) {
  const [graph, setGraph] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkillGraph('frontend-developer')
      .then(data => {
        setGraph(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching skill graph:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Hero Section */}
      <header style={{ textAlign: 'center', padding: '3rem 1rem 2.5rem 1rem', borderBottom: '1px solid var(--border-card)' }}>
        <span className="logo-badge" style={{ fontSize: '0.9rem', padding: '0.35rem 1rem' }}>
          🎓 SkillPath — SDG 4 Track
        </span>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, margin: '0.75rem 0 1rem 0', lineHeight: 1.2 }}>
          Job-Demand-Driven Skill Assessment & Verifiable Credentialing
        </h1>
        <p className="subtitle" style={{ fontSize: '1.2rem', maxWidth: '750px', margin: '0 auto 2rem auto', color: '#94a3b8' }}>
          Bridge the gap between college education and industry hiring demand with objective, deterministic skill measurement.
        </p>

        {/* Quick Call to Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <button
            onClick={() => onNavigate && onNavigate('assessment')}
            style={{ padding: '0.85rem 1.75rem', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb, #4f46e5)', color: '#fff', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)' }}
          >
            ⚡ Take Adaptive Assessment
          </button>
          <button
            onClick={() => onNavigate && onNavigate('report')}
            style={{ padding: '0.85rem 1.75rem', borderRadius: '10px', background: '#1e293b', color: '#38bdf8', fontWeight: 700, fontSize: '1rem', border: '1px solid #334155', cursor: 'pointer' }}
          >
            🎯 View Skill Gap Report
          </button>
          <button
            onClick={() => onNavigate && onNavigate('verify')}
            style={{ padding: '0.85rem 1.75rem', borderRadius: '10px', background: '#10b98122', color: '#34d399', fontWeight: 700, fontSize: '1rem', border: '1px solid #10b98144', cursor: 'pointer' }}
          >
            🛡️ Verify Credential
          </button>
        </div>

        <div className="no-llm-banner" style={{ display: 'inline-flex', marginTop: '1.5rem', marginBottom: 0 }}>
          <span>⚡ <strong>100% Deterministic & LLM-Free:</strong> Zero GPT/LLM APIs. Applied Elo mathematics & ECDSA P-256 cryptography.</span>
        </div>
      </header>

      {/* 3 Key Differentiator Feature Cards */}
      <section style={{ margin: '3rem 0' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.6rem', marginBottom: '2rem', fontWeight: 700 }}>
          Why SkillPath is Different
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Differentiator 1 */}
          <div className="card" style={{ padding: '1.75rem', borderTop: '4px solid #6366f1' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📊</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f8fafc' }}>
              1. Built from real job postings, not a curriculum someone invented
            </h3>
            <p style={{ fontSize: '0.925rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Skill taxonomies and prerequisite dependencies are extracted directly from active tech hiring data using classical NLP term frequency analysis, ensuring learners focus on what employers actually hire for.
            </p>
          </div>

          {/* Differentiator 2 */}
          <div className="card" style={{ padding: '1.75rem', borderTop: '4px solid #38bdf8' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚡</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f8fafc' }}>
              2. An adaptive test that actually measures what you know (Elo-based, like chess ratings)
            </h3>
            <p style={{ fontSize: '0.925rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Questions dynamically scale in difficulty based on your real-time performance using pure Elo rating algorithms ($K=32$). Rating increases more when solving harder items, giving accurate per-skill skill scores.
            </p>
          </div>

          {/* Differentiator 3 */}
          <div className="card" style={{ padding: '1.75rem', borderTop: '4px solid #10b981' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🛡️</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f8fafc' }}>
              3. Cryptographically signed credentials a recruiter can verify in 5 seconds — no GPT, no guesswork
            </h3>
            <p style={{ fontSize: '0.925rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Proving proficiency mints an ECDSA P-256 (SHA-256) digital credential. Recruiters can independently verify authenticity offline using the public key—any tampered score is instantly flagged.
            </p>
          </div>
        </div>
      </section>

      {/* Extracted Skill Graph Preview */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Industry Skill Graph ({graph?.role || 'Frontend Developer'})</h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{graph?.nodes?.length || 34} extracted skill nodes derived from {graph?.totalPostingsAnalyzed || 18} job postings</p>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('report')}
            style={{ padding: '0.5rem 1rem', borderRadius: '6px', background: '#334155', color: '#f8fafc', border: 'none', fontSize: '0.85rem', cursor: 'pointer' }}
          >
            View Interactive Graph →
          </button>
        </div>

        <div className="grid">
          {graph?.nodes?.slice(0, 6).map((node) => (
            <div className="card" key={node.id}>
              <div className="card-header">
                <span className="skill-title">{node.label}</span>
                <span className="category-tag">{node.category}</span>
              </div>
              <div className="score-container">
                <div className="score-meta">
                  <span style={{ color: 'var(--text-muted)' }}>Market Demand Score</span>
                  <span style={{ fontWeight: 600, color: '#10b981' }}>
                    {(node.demandScore * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${Math.max(node.demandScore * 100, 5)}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
