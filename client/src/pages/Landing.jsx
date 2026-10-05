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
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem', alignItems: 'center', marginBottom: '4rem' }}>
        <div>
          {/* Top Pill Tag */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#F3E8FF',
            color: '#7C3AED',
            fontWeight: 700,
            fontSize: '0.8rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            marginBottom: '1.25rem',
            letterSpacing: '0.04em'
          }}>
            <span>🎓</span> SKILLPATH — SDG 4 TRACK
          </div>

          {/* Main Title */}
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, lineHeight: 1.15, color: '#0F172A', marginBottom: '1rem', letterSpacing: '-0.03em' }}>
            Job-Demand-Driven <br />
            <span style={{ color: '#4F46E5' }}>Skill Assessment &</span> <br />
            <span style={{ color: '#4F46E5' }}>Verifiable Credentialing</span>
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.6, maxWidth: '540px', marginBottom: '2rem' }}>
            Bridge the gap between college education and industry hiring demand with objective, deterministic skill measurement.
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <button className="btn-gradient" onClick={() => onNavigate && onNavigate('assessment')}>
              <span>⚡</span> Take Adaptive Assessment
            </button>
            <button className="btn-secondary" onClick={() => onNavigate && onNavigate('report')}>
              <span style={{ color: '#EF4444' }}>🎯</span> View Skill Gap Report
            </button>
            <button className="btn-mint" onClick={() => onNavigate && onNavigate('verify')}>
              <span>🛡️</span> Verify Credential
            </button>
          </div>

          {/* Deterministic Banner */}
          <div className="banner-deterministic">
            <span style={{ fontSize: '1.1rem' }}>⚡</span>
            <div>
              <strong>100% Deterministic & LLM-Free:</strong> Zero GPT/LLM APIs. Applied Elo mathematics & ECDSA P-256 cryptography.
            </div>
          </div>
        </div>

        {/* Right Hero Graphic Mockup */}
        <div style={{ position: 'relative' }}>
          <div className="card-white" style={{
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            padding: '2rem',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></span>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></span>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></span>
              </div>
              <span style={{
                background: '#ecfdf5',
                color: '#047857',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                <span>✓</span> Verified
              </span>
            </div>

            {/* Line Chart Mockup */}
            <div style={{ background: '#f1f5f9', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.5rem' }}>ELO RATING PROGRESSION</div>
              <svg viewBox="0 0 300 80" style={{ width: '100%', height: '80px' }}>
                <path d="M0 60 Q 60 50, 120 20 T 240 30 T 300 10" fill="none" stroke="#2563eb" strokeWidth="3.5" />
                <circle cx="300" cy="10" r="5" fill="#2563eb" />
              </svg>
            </div>

            {/* Skill Credential Card Preview */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1.25rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', letterSpacing: '0.05em' }}>
                  <span>🛡️</span> SKILL CREDENTIAL
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
                  Frontend Development
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  ECDSA P-256 Signed
                </div>
              </div>

              {/* QR Code graphic */}
              <div style={{
                width: '52px',
                height: '52px',
                background: '#0f172a',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '1.5rem'
              }}>
                📷
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why SkillPath is Different */}
      <h2 className="section-title-center">Why SkillPath is Different</h2>
      <div className="blue-underline-bar"></div>

      <div className="grid-3" style={{ marginBottom: '4rem' }}>
        {/* Card 1 */}
        <div className="card-white" style={{ borderBottom: '4px solid #3b82f6' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#eff6ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            marginBottom: '1.25rem'
          }}>
            📊
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem' }}>
            Built from Real Job Postings
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Uses real industry job data, not curriculum someone invented.
          </p>
        </div>

        {/* Card 2 */}
        <div className="card-white" style={{ borderBottom: '4px solid #f97316' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#fff7ed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            marginBottom: '1.25rem'
          }}>
            ⚡
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem' }}>
            Adaptive Skill Assessment
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.5 }}>
            An adaptive test that actually measures what you know (Elo-based, like chess).
          </p>
        </div>

        {/* Card 3 */}
        <div className="card-white" style={{ borderBottom: '4px solid #10b981' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#ecfdf5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            marginBottom: '1.25rem'
          }}>
            🛡️
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem' }}>
            Cryptographically Signed Credentials
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Credentials a recruiter can verify in 5 seconds — no guesswork.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <h2 className="section-title-center">How It Works</h2>
      <div className="blue-underline-bar"></div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', alignItems: 'center', marginBottom: '5rem' }}>
        {/* Step 1 */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#eff6ff',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            margin: '0 auto 1rem auto'
          }}>
            📄
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
            1. Take Assessment
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.4 }}>
            Answer adaptive questions based on your skill level
          </p>
        </div>

        {/* Step 2 */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#fff7ed',
            color: '#f97316',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            margin: '0 auto 1rem auto'
          }}>
            📊
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
            2. Get Your Report
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.4 }}>
            See detailed skill gap analysis vs industry demand
          </p>
        </div>

        {/* Step 3 */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#ecfdf5',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            margin: '0 auto 1rem auto'
          }}>
            🛡️
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
            3. Earn Credential
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.4 }}>
            Get a cryptographically signed credential
          </p>
        </div>

        {/* Step 4 */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#f3e8ff',
            color: '#8b5cf6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            margin: '0 auto 1rem auto'
          }}>
            🔗
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
            4. Share & Verify
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.4 }}>
            Share with employers who can verify instantly
          </p>
        </div>
      </div>

      {/* Extracted Industry Skill Graph & Market Demand */}
      {graph && graph.nodes && (
        <div>
          <h2 className="section-title-center">Industry Skill Taxonomy & Demand Scores</h2>
          <div className="blue-underline-bar"></div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {graph.nodes.map((node) => (
              <div className="card-white" key={node.id} style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{node.label}</span>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '6px', background: '#eff6ff', color: '#2563eb', fontWeight: 700 }}>
                    {node.category}
                  </span>
                </div>

                <div style={{ margin: '1rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#64748b' }}>Industry Demand Score</span>
                    <span style={{ fontWeight: 800, color: '#10b981' }}>
                      {(node.demandScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.max(node.demandScore * 100, 4)}%`,
                        background: 'linear-gradient(90deg, #3b82f6, #10b981)',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                </div>

                {node.prerequisites && node.prerequisites.length > 0 ? (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', fontSize: '0.825rem', color: '#64748b' }}>
                    <span>Prerequisites: </span>
                    {node.prerequisites.map((reqId) => (
                      <span key={reqId} style={{ display: 'inline-block', background: '#f1f5f9', color: '#334155', padding: '0.15rem 0.5rem', borderRadius: '4px', margin: '0.2rem 0.2rem 0 0', fontSize: '0.75rem', fontWeight: 600 }}>
                        {reqId}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', fontSize: '0.825rem', color: '#94a3b8', fontStyle: 'italic' }}>
                    Foundational skill (no prerequisites)
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
