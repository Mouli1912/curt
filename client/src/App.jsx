import React, { useState } from 'react';
import Landing from './pages/Landing';
import Assessment from './pages/Assessment';
import './styles/index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('assessment');

  return (
    <div className="app">
      <nav className="top-navbar">
        <div className="nav-brand">
          <span style={{ fontSize: '1.25rem' }}>🎓</span>
          <span>SkillPath</span>
          <span className="logo-badge" style={{ margin: 0, fontSize: '0.7rem' }}>SDG 4</span>
        </div>
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'graph' ? 'active' : ''}`}
            onClick={() => setActiveTab('graph')}
          >
            📊 Skill Graph
          </button>
          <button
            className={`nav-tab ${activeTab === 'assessment' ? 'active' : ''}`}
            onClick={() => setActiveTab('assessment')}
          >
            ⚡ Adaptive Assessment
          </button>
        </div>
      </nav>

      {activeTab === 'graph' ? <Landing /> : <Assessment userId="demo-user" />}
    </div>
  );
}
