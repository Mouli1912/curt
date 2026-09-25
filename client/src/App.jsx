import React, { useState } from 'react';
import Landing from './pages/Landing';
import Assessment from './pages/Assessment';
import GapReport from './pages/GapReport';
import CredentialVerify from './pages/CredentialVerify';
import './styles/index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [selectedUser, setSelectedUser] = useState('pro-user');

  return (
    <div className="app">
      {/* Top Navbar */}
      <nav className="top-navbar">
        <div className="nav-left">
          <div className="nav-brand" onClick={() => setActiveTab('landing')}>
            <span style={{ fontSize: '1.4rem' }}>🎓</span>
            <span>SkillPath</span>
            <span className="sdg-badge">SDG 4 TRACK</span>
          </div>

          <div className="demo-account-picker">
            <span className="demo-label">DEMO ACCOUNT:</span>
            <select
              className="demo-select"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="pro-user">⭐ pro-user (Near Complete + Signed Credential)</option>
              <option value="mid-user">🟡 mid-user (Mid-Progress - 4 Proven)</option>
              <option value="fresh-user">🟢 fresh-user (Fresh Start - 0%)</option>
            </select>
          </div>
        </div>

        <div className="nav-right">
          <div className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === 'landing' ? 'active' : ''}`}
              onClick={() => setActiveTab('landing')}
            >
              <span>🏠</span> Home
            </button>
            <button
              className={`nav-tab ${activeTab === 'assessment' ? 'active' : ''}`}
              onClick={() => setActiveTab('assessment')}
            >
              <span>⚡</span> Adaptive Assessment
            </button>
            <button
              className={`nav-tab ${activeTab === 'report' ? 'active' : ''}`}
              onClick={() => setActiveTab('report')}
            >
              <span>🎯</span> Skill Gap Report
            </button>
            <button
              className={`nav-tab ${activeTab === 'verify' ? 'active' : ''}`}
              onClick={() => setActiveTab('verify')}
            >
              <span>🛡️</span> Verify Credential
            </button>
          </div>

          <div className="user-avatar" title="Suraj Bhan Kumar">
            SB
          </div>
        </div>
      </nav>

      {/* Main Content Pages */}
      {activeTab === 'landing' && <Landing onNavigate={setActiveTab} />}
      {activeTab === 'assessment' && (
        <Assessment
          userId={selectedUser}
          onFinish={() => setActiveTab('report')}
        />
      )}
      {activeTab === 'report' && <GapReport userId={selectedUser} onNavigate={setActiveTab} />}
      {activeTab === 'verify' && <CredentialVerify />}
    </div>
  );
}
