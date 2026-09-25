import React, { useEffect, useState } from 'react';
import { fetchSkillGraph } from '../api/client';

export default function Landing() {
  const [graph, setGraph] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSkillGraph('frontend-developer')
      .then(data => {
        setGraph(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching skill graph:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <h2>Loading Skill Graph from live API...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <h2>Failed to load Skill Graph</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <span className="logo-badge">SkillPath — SDG 4 Track</span>
        <h1>Frontend Developer Skill Graph</h1>
        <p className="subtitle">
          Job-demand-driven skill taxonomy extracted deterministically via TF-IDF from real hiring data.
        </p>

        <div className="no-llm-banner">
          <span>⚡ <strong>Zero LLM/GPT Dependency:</strong> Pure classical NLP term extraction & cryptographic verification pipeline.</span>
        </div>

        <div className="stats-bar">
          <div className="stat-item">
            <div className="stat-label">Role Profile</div>
            <div className="stat-value">{graph?.role || 'Frontend Developer'}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Job Postings Analyzed</div>
            <div className="stat-value">{graph?.totalPostingsAnalyzed || 0}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Extracted Skill Nodes</div>
            <div className="stat-value">{graph?.nodes?.length || 0}</div>
          </div>
        </div>
      </header>

      <main>
        <h2 style={{ marginBottom: '1.25rem', fontSize: '1.4rem' }}>Extracted Skills & Industry Demand</h2>
        
        <div className="grid">
          {graph?.nodes?.map((node) => (
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
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${Math.max(node.demandScore * 100, 4)}%` }} 
                  />
                </div>
              </div>

              {node.prerequisites && node.prerequisites.length > 0 ? (
                <div className="prereqs">
                  <span>Prerequisites: </span>
                  {node.prerequisites.map((reqId) => (
                    <span key={reqId} className="prereq-badge">
                      {reqId}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="prereqs">
                  <span style={{ fontStyle: 'italic', opacity: 0.7 }}>Foundational skill (no prerequisites)</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
