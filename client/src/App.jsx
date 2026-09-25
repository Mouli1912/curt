import React, { useState } from 'react';
import Landing from './pages/Landing';
import Assessment from './pages/Assessment';
import GapReport from './pages/GapReport';
import CredentialVerify from './pages/CredentialVerify';
import './styles/index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [selectedUser, setSelectedUser] = useState('mid-user'); // Default to mid-user for best initial demo view

  return (
    <div className="app">
      <nav className="top-navbar" style={{ gap: '1rem', flexWrap: 'wrap' }}>
        <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('landing')}>
          <span style={{ fontSize: '1.25rem' }}>🎓</span>
          <span style={{ fontWeight: 800 }}>SkillPath</span>
          <span className="logo-badge" style={{ margin: 0, fontSize: '0.7rem' }}>SDG 4 Track</span>
        </div>

        {/* Demo Account Switcher for Judges & Presenters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Demo Account:</span>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            style={{
              background: '#0f172a',
              color: '#38bdf8',
              border: '1px solid #334155',
              padding: '0.3rem 0.6rem',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <option value="fresh-user">🟢 fresh-user (Fresh Start - 0%)</option>
            <option value="mid-user">🟡 mid-user (Mid-Progress - 4 Proven)</option>
            <option value="pro-user">⭐ pro-user (Near Complete + Signed Credential)</option>
          </select>
        </div>

        {/* Navigation Tabs */}
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'landing' ? 'active' : ''}`}
            onClick={() => setActiveTab('landing')}
          >
            🏠 Home
          </button>
          <button
            className={`nav-tab ${activeTab === 'assessment' ? 'active' : ''}`}
            onClick={() => setActiveTab('assessment')}
          >
            ⚡ Adaptive Assessment
          </button>
          <button
            className={`nav-tab ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => setActiveTab('report')}
          >
            🎯 Skill Gap Report
          </button>
          <button
            className={`nav-tab ${activeTab === 'verify' ? 'active' : ''}`}
            onClick={() => setActiveTab('verify')}
          >
            🛡️ Verify Credential
          </button>
        </div>
      </nav>

      {/* Page Content */}
      {activeTab === 'landing' && <Landing onNavigate={setActiveTab} />}
      {activeTab === 'assessment' && (
        <Assessment
          userId={selectedUser}
          onFinish={() => setActiveTab('report')}
        />
      )}
      {activeTab === 'report' && <GapReport userId={selectedUser} />}
      {activeTab === 'verify' && <CredentialVerify />}
    </div>
  );
}
