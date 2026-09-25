import React, { useEffect, useState } from 'react';
import { fetchGapReport } from '../api/client';

export default function GapReport({ userId = 'pro-user', onNavigate }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGapReport(userId)
      .then(data => {
        setReport(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Gap report fetch error:', err);
        setLoading(false);
      });
  }, [userId]);

  return (
    <div className="container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="header-title-group">
            <div className="header-icon-box" style={{ background: '#eff6ff', color: '#2563eb' }}>
              📊
            </div>
            <h1 className="page-title">Skill Gap Report</h1>
          </div>
          <p className="page-subtitle">Your detailed skill analysis compared to industry demand.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.85rem' }}>
          <button className="btn-secondary">
            <span>📥</span> Download Report
          </button>
          <button className="btn-primary">
            <span>🚀</span> Share Report
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.75rem', marginBottom: '1.75rem' }}>
        {/* Top Left Card - Overall Skill Match */}
        <div className="card-white" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
              Overall Skill Match
            </h3>

            {/* Circular Donut Gauge */}
            <div style={{ textAlign: 'center', margin: '1rem 0 1.5rem 0' }}>
              <div style={{
                position: 'relative',
                width: '150px',
                height: '150px',
                margin: '0 auto 1rem auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3.5" strokeDasharray="72, 100" />
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>72%</div>
                </div>
              </div>

              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                Good Match
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.4, padding: '0 1rem' }}>
                You have a strong foundation with some areas for improvement.
              </p>
            </div>
          </div>

          {/* Top Strengths */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.85rem' }}>
              Top Strengths
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: '#334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> Strong problem-solving skills
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> Good understanding of core concepts
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> Excellent coding practices
              </div>
            </div>
          </div>
        </div>

        {/* Top Right Card - Skill Breakdown */}
        <div className="card-white">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.75rem' }}>
            Skill Breakdown
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Row 1 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.925rem', fontWeight: 700, color: '#1e293b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#10b981' }}>✓</span> Data Structures & Algorithms
                </span>
                <span>85%</span>
              </div>
              <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '85%', background: '#10b981', borderRadius: '4px' }}></div>
              </div>
            </div>

            {/* Row 2 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.925rem', fontWeight: 700, color: '#1e293b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#2563eb' }}>●</span> System Design
                </span>
                <span>60%</span>
              </div>
              <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '60%', background: '#2563eb', borderRadius: '4px' }}></div>
              </div>
            </div>

            {/* Row 3 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.925rem', fontWeight: 700, color: '#1e293b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#8b5cf6' }}>●</span> Database Management
                </span>
                <span>75%</span>
              </div>
              <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '75%', background: '#8b5cf6', borderRadius: '4px' }}></div>
              </div>
            </div>

            {/* Row 4 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.925rem', fontWeight: 700, color: '#1e293b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#f97316' }}>●</span> Machine Learning
                </span>
                <span>45%</span>
              </div>
              <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '45%', background: '#f97316', borderRadius: '4px' }}></div>
              </div>
            </div>

            {/* Row 5 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.925rem', fontWeight: 700, color: '#1e293b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#ef4444' }}>●</span> Cloud Computing
                </span>
                <span>30%</span>
              </div>
              <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '30%', background: '#ef4444', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem' }}>
        {/* Bottom Left - Areas for Improvement */}
        <div className="card-white">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#b91c1c', marginBottom: '1.25rem' }}>
            Areas for Improvement
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.925rem', color: '#334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#ffedd5',
                color: '#ea580c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem'
              }}>⚡</span>
              <span>System design concepts</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#ffedd5',
                color: '#ea580c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem'
              }}>⚡</span>
              <span>Cloud platform knowledge</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#ffedd5',
                color: '#ea580c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem'
              }}>⚡</span>
              <span>Advanced machine learning topics</span>
            </div>
          </div>
        </div>

        {/* Bottom Right - Recommended Learning Path */}
        <div className="card-white" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              flexShrink: 0
            }}>
              📘
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
                Recommended Learning Path
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.4 }}>
                Personalized recommendations to bridge your skill gaps.
              </p>
            </div>
          </div>

          <button className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
            View Learning Path →
          </button>
        </div>
      </div>
    </div>
  );
}
